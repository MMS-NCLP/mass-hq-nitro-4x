import assert from "node:assert/strict";
import test from "node:test";
import { WarrantyService } from "../src/warranty/index.mjs";
import { SecureAccess } from "../src/security/secure-access.mjs";

async function setup() {
  const secure = new SecureAccess();
  const tenantId = "t-warranty";
  const owner = await secure.bootstrapTenantAdmin({ tenantId, email: "owner@tngd.test", password: "WarrantyTest99!" });
  const ownerToken = (await secure.authenticate({ tenantId, email: "owner@tngd.test", password: "WarrantyTest99!" })).token;
  const coord = await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "coord@tngd.test", password: "WarrantyTest99!", roles: ["admin_dispatch"] });
  const coordToken = (await secure.authenticate({ tenantId, email: "coord@tngd.test", password: "WarrantyTest99!" })).token;
  const mgr = await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "mgr@tngd.test", password: "WarrantyTest99!", roles: ["manager"] });
  const mgrToken = (await secure.authenticate({ tenantId, email: "mgr@tngd.test", password: "WarrantyTest99!" })).token;
  const tech = await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "tech@tngd.test", password: "WarrantyTest99!", roles: ["technician"] });
  const techToken = (await secure.authenticate({ tenantId, email: "tech@tngd.test", password: "WarrantyTest99!" })).token;
  const exec = await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "exec@tngd.test", password: "WarrantyTest99!", roles: ["executive"] });
  const execToken = (await secure.authenticate({ tenantId, email: "exec@tngd.test", password: "WarrantyTest99!" })).token;

  const baseDate = new Date("2026-01-15T10:00:00Z");
  let tick = 0;
  const svc = new WarrantyService({ secureAccess: secure, auditLog: secure.auditLog, now: () => new Date(baseDate.getTime() + (tick++) * 1000) });

  const policy = svc.createPolicyAuthorized({ sessionToken: ownerToken, tenantId, name: "TNGD Standard", partsCoverageDays: 730, serviceCoverageDays: 90 });

  function register(key, completionDate) {
    return svc.registerWorkAuthorized({
      sessionToken: coordToken, tenantId, policyId: policy.id,
      serviceCaseId: `sc-${key}`, sourceJobId: `job-${key}`,
      completionDate: completionDate || "2026-01-10T10:00:00Z",
      coveredItems: [{ description: "Torsion spring replacement", type: "parts", sourceReference: "BP-009-ref-1" },
        { description: "Installation labor", type: "service", sourceReference: "BP-009-ref-2" }],
      idempotencyKey: `reg-${key}`
    });
  }

  function claim(reg, key) {
    return svc.createClaimAuthorized({
      sessionToken: coordToken, tenantId, registrationId: reg.id,
      serviceCaseId: reg.serviceCaseId, issueDescription: "Spring failure within warranty period",
      affectedItemIds: [reg.coveredItemIds[0]], idempotencyKey: `claim-${key}`
    });
  }

  return { svc, secure, tenantId, ownerToken, coordToken, mgrToken, techToken, execToken, policy, register, claim, owner, coord, mgr };
}

test("standard policy distinguishes two-year parts and 90-day service coverage", async () => {
  const { policy } = await setup();
  assert.equal(policy.partsCoverageDays, 730);
  assert.equal(policy.serviceCoverageDays, 90);
  assert.ok(policy.id);
  assert.equal(policy.version, 1);
});

test("registration preserves exact policy and source-work lineage with idempotency", async () => {
  const { svc, coordToken, tenantId, register } = await setup();
  const reg = register("dup-1");
  const dup = register("dup-1");
  assert.equal(reg.id, dup.id);
  assert.equal(reg.coveredItemIds.length, 2);
  assert.equal(reg.status, "active");
  assert.ok(reg.partsExpiration);
  assert.ok(reg.serviceExpiration);
  assert.ok(reg.sourceJobId);
  assert.equal(reg.policyVersion, 1);
});

test("duplicate claim prevention returns existing claim", async () => {
  const { svc, coordToken, tenantId, register, claim } = await setup();
  const reg = register("dup-c");
  const c1 = claim(reg, "dup-c");
  const c2 = claim(reg, "dup-c");
  assert.equal(c1.id, c2.id);
  assert.equal(c1.status, "submitted");
});

test("parts expiration blocks eligibility after two years", async () => {
  const { svc, coordToken, tenantId, policy } = await setup();
  const oldDate = "2023-01-01T10:00:00Z";
  const reg = svc.registerWorkAuthorized({
    sessionToken: coordToken, tenantId, policyId: policy.id,
    serviceCaseId: "sc-old", sourceJobId: "job-old", completionDate: oldDate,
    coveredItems: [{ description: "Old spring", type: "parts" }],
    idempotencyKey: "reg-old"
  });
  const c = svc.createClaimAuthorized({
    sessionToken: coordToken, tenantId, registrationId: reg.id,
    serviceCaseId: "sc-old", issueDescription: "Failed", affectedItemIds: [reg.coveredItemIds[0]],
    idempotencyKey: "claim-old"
  });
  const assessment = svc.assessEligibilityAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id });
  assert.equal(assessment.partsEligible, false);
  assert.equal(assessment.serviceEligible, false);
  assert.equal(assessment.advisory, true);
});

test("eligibility derived from authoritative dates within coverage period", async () => {
  const { svc, coordToken, tenantId, register, claim } = await setup();
  const reg = register("elig");
  const c = claim(reg, "elig");
  const assessment = svc.assessEligibilityAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id });
  assert.equal(assessment.partsEligible, true);
  assert.equal(assessment.serviceEligible, true);
  assert.equal(assessment.registrationStatus, "active");
});

test("covered, partially-covered, and denied decisions require human authorization", async () => {
  const { svc, coordToken, mgrToken, tenantId, register, claim } = await setup();

  const regA = register("cov");
  const cA = claim(regA, "cov");
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: cA.id, toStatus: "under-review" });
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: cA.id, toStatus: "decision-pending" });
  const { decision: d1, claim: c1 } = svc.submitDecisionAuthorized({
    sessionToken: mgrToken, tenantId, claimId: cA.id, outcome: "covered",
    reason: "Within coverage, verified spring failure", approvedItems: [regA.coveredItemIds[0]],
    excludedItems: [], resolutionClass: "no-charge"
  });
  assert.equal(d1.outcome, "covered");
  assert.equal(c1.status, "approved");

  const regB = register("part");
  const cB = claim(regB, "part");
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: cB.id, toStatus: "under-review" });
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: cB.id, toStatus: "decision-pending" });
  const { decision: d2, claim: c2 } = svc.submitDecisionAuthorized({
    sessionToken: mgrToken, tenantId, claimId: cB.id, outcome: "partially-covered",
    reason: "Parts covered, labor not", approvedItems: [regB.coveredItemIds[0]],
    excludedItems: [regB.coveredItemIds[1]], resolutionClass: "customer-charge"
  });
  assert.equal(d2.outcome, "partially-covered");
  assert.equal(c2.status, "partially-approved");

  const regC = register("deny");
  const cC = claim(regC, "deny");
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: cC.id, toStatus: "under-review" });
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: cC.id, toStatus: "decision-pending" });
  const { decision: d3, claim: c3 } = svc.submitDecisionAuthorized({
    sessionToken: mgrToken, tenantId, claimId: cC.id, outcome: "not-covered",
    reason: "Customer misuse, not manufacturing defect", approvedItems: [],
    excludedItems: regC.coveredItemIds, resolutionClass: "customer-charge"
  });
  assert.equal(d3.outcome, "not-covered");
  assert.equal(c3.status, "denied");
});

test("self-approval prevention blocks claim creator from deciding", async () => {
  const { svc, mgrToken, tenantId, policy } = await setup();
  const reg = svc.registerWorkAuthorized({
    sessionToken: mgrToken, tenantId, policyId: policy.id,
    serviceCaseId: "sc-self", sourceJobId: "job-self",
    completionDate: "2026-01-10T10:00:00Z",
    coveredItems: [{ description: "Spring", type: "parts" }],
    idempotencyKey: "reg-self"
  });
  const c = svc.createClaimAuthorized({
    sessionToken: mgrToken, tenantId, registrationId: reg.id,
    serviceCaseId: "sc-self", issueDescription: "Failed spring",
    affectedItemIds: [reg.coveredItemIds[0]], idempotencyKey: "claim-self"
  });
  svc.transitionClaimAuthorized({ sessionToken: mgrToken, tenantId, claimId: c.id, toStatus: "under-review" });
  svc.transitionClaimAuthorized({ sessionToken: mgrToken, tenantId, claimId: c.id, toStatus: "decision-pending" });
  assert.throws(() => svc.submitDecisionAuthorized({
    sessionToken: mgrToken, tenantId, claimId: c.id, outcome: "covered",
    reason: "Self-approve attempt", approvedItems: [], excludedItems: [], resolutionClass: "no-charge"
  }), /creator cannot approve/);
});

test("missing evidence and invalid transitions are rejected", async () => {
  const { svc, coordToken, tenantId, register, claim } = await setup();
  const reg = register("inv");
  const c = claim(reg, "inv");
  assert.throws(() => svc.transitionClaimAuthorized({
    sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "approved"
  }), /not allowed/);
  assert.throws(() => svc.transitionClaimAuthorized({
    sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "closed"
  }), /not allowed/);
});

test("immutable finalized decisions and superseding corrections", async () => {
  const { svc, coordToken, mgrToken, ownerToken, tenantId, register, claim } = await setup();
  const reg = register("sup");
  const c = claim(reg, "sup");
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "under-review" });
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "decision-pending" });
  const { decision: original } = svc.submitDecisionAuthorized({
    sessionToken: mgrToken, tenantId, claimId: c.id, outcome: "not-covered",
    reason: "Initial denial", approvedItems: [], excludedItems: reg.coveredItemIds, resolutionClass: "customer-charge"
  });
  assert.equal(original.supersededBy, null);

  const { decision: corrected, superseded } = svc.supersedeDecisionAuthorized({
    sessionToken: ownerToken, tenantId, claimId: c.id, originalDecisionId: original.id,
    outcome: "covered", reason: "Correction after re-examination",
    approvedItems: reg.coveredItemIds, excludedItems: [], resolutionClass: "no-charge"
  });
  assert.ok(superseded.supersededBy);
  assert.equal(corrected.outcome, "covered");
  assert.equal(corrected.supersededBy, null);

  const decisions = svc.getDecisionsAuthorized({ sessionToken: mgrToken, tenantId, claimId: c.id });
  assert.equal(decisions.length, 2);
});

test("resolution lifecycle from approval through closure", async () => {
  const { svc, coordToken, mgrToken, tenantId, register, claim } = await setup();
  const reg = register("res");
  const c = claim(reg, "res");
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "under-review" });
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "decision-pending" });
  svc.submitDecisionAuthorized({
    sessionToken: mgrToken, tenantId, claimId: c.id, outcome: "covered",
    reason: "Valid claim", approvedItems: [reg.coveredItemIds[0]], excludedItems: [], resolutionClass: "no-charge"
  });
  svc.beginResolutionAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id });
  const { resolution, claim: resolved } = svc.completeResolutionAuthorized({
    sessionToken: coordToken, tenantId, claimId: c.id,
    resolutionSummary: "Replacement spring installed under warranty",
    evidenceReferences: ["BP-008-evidence-ref"]
  });
  assert.equal(resolved.status, "resolved");
  assert.ok(resolution.resolvedAt);
  const closed = svc.closeClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id });
  assert.equal(closed.status, "closed");
});

test("voiding registration requires reason and only works on active registrations", async () => {
  const { svc, ownerToken, tenantId, register } = await setup();
  const reg = register("void");
  assert.throws(() => svc.voidRegistrationAuthorized({
    sessionToken: ownerToken, tenantId, registrationId: reg.id, reason: ""
  }), /Reason/);
  const voided = svc.voidRegistrationAuthorized({
    sessionToken: ownerToken, tenantId, registrationId: reg.id, reason: "Customer fraud detected"
  });
  assert.equal(voided.status, "voided");
  assert.throws(() => svc.voidRegistrationAuthorized({
    sessionToken: ownerToken, tenantId, registrationId: reg.id, reason: "Again"
  }), /Only active/);
});

test("appointment reference through evidence attachment", async () => {
  const { svc, coordToken, execToken, tenantId, register, claim } = await setup();
  const reg = register("appt");
  const c = claim(reg, "appt");
  const ref = svc.attachEvidenceAuthorized({
    sessionToken: coordToken, tenantId, claimId: c.id,
    sourceType: "BP-005-appointment", sourceId: "appt-uuid-123",
    description: "Warranty inspection appointment"
  });
  assert.equal(ref.sourceType, "BP-005-appointment");
  assert.ok(ref.attachedAt);
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "under-review" });
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "awaiting-appointment" });
  const current = svc.getClaimAuthorized({ sessionToken: execToken, tenantId, claimId: c.id });
  assert.equal(current.status, "awaiting-appointment");
});

test("source-record non-mutation and BP-014 handoff", async () => {
  const { svc, coordToken, mgrToken, tenantId, register, claim } = await setup();
  const reg = register("hand");
  const c = claim(reg, "hand");
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "under-review" });
  svc.transitionClaimAuthorized({ sessionToken: coordToken, tenantId, claimId: c.id, toStatus: "decision-pending" });
  svc.submitDecisionAuthorized({
    sessionToken: mgrToken, tenantId, claimId: c.id, outcome: "covered",
    reason: "Covered claim", approvedItems: [reg.coveredItemIds[0]], excludedItems: [], resolutionClass: "no-charge"
  });
  const handoff = svc.createHandoffAuthorized({
    sessionToken: coordToken, tenantId, claimId: c.id,
    targetPackage: "TNGD-BP-014", category: "follow-up", referenceId: c.id
  });
  assert.equal(handoff.targetPackage, "TNGD-BP-014");
  assert.equal(handoff.category, "follow-up");
  assert.throws(() => svc.createHandoffAuthorized({
    sessionToken: coordToken, tenantId, claimId: c.id,
    targetPackage: "TNGD-BP-015", category: "follow-up"
  }), /BP-014 only/);
});

test("tenant isolation and role boundaries remain intact through BP-012", async () => {
  const { svc, secure, coordToken, techToken, execToken, tenantId, register, claim } = await setup();
  const tenantB = "t-other-warranty";
  const otherOwner = await secure.bootstrapTenantAdmin({ tenantId: tenantB, email: "other@test.co", password: "WarrantyTest99!" });
  const otherToken = (await secure.authenticate({ tenantId: tenantB, email: "other@test.co", password: "WarrantyTest99!" })).token;

  const reg = register("iso");
  assert.throws(() => svc.getRegistrationAuthorized({
    sessionToken: otherToken, tenantId, registrationId: reg.id
  }), /denied/);
  assert.throws(() => svc.registerWorkAuthorized({
    sessionToken: techToken, tenantId, policyId: "fake", serviceCaseId: "sc",
    completionDate: "2026-01-01", coveredItems: [{ description: "x", type: "parts" }],
    idempotencyKey: "tech-try"
  }), /denied/);
  const c = claim(reg, "iso");
  assert.throws(() => svc.transitionClaimAuthorized({
    sessionToken: execToken, tenantId, claimId: c.id, toStatus: "under-review"
  }), /denied/);

  const history = svc.getClaimHistoryAuthorized({ sessionToken: execToken, tenantId, claimId: c.id });
  assert.ok(Array.isArray(history));

  assert.throws(() => svc.processPaymentAuthorized(), /does not process/);
  assert.throws(() => svc.deliverCommunicationAuthorized(), /does not deliver/);
  assert.throws(() => svc.generateAiFindings(), /does not generate/);
  assert.throws(() => svc.automateFollowUpAuthorized(), /does not automate/);
});

test("findings require description and are recorded against claim", async () => {
  const { svc, coordToken, tenantId, register, claim } = await setup();
  const reg = register("find");
  const c = claim(reg, "find");
  assert.throws(() => svc.recordFindingAuthorized({
    sessionToken: coordToken, tenantId, claimId: c.id, description: ""
  }), /description/);
  const finding = svc.recordFindingAuthorized({
    sessionToken: coordToken, tenantId, claimId: c.id,
    description: "Torsion spring shows fatigue fracture at 30% of expected life",
    evidenceReferences: ["BP-008-inspection-ref"]
  });
  assert.ok(finding.id);
  assert.equal(finding.claimId, c.id);
});
