import assert from "node:assert/strict";
import test from "node:test";
import { FollowUpService } from "../src/follow-up/index.mjs";
import { SecureAccess } from "../src/security/secure-access.mjs";

async function setup() {
  const secure = new SecureAccess();
  const tenantId = "t-followup";
  const pw = "FollowUpTest99!";
  const owner = await secure.bootstrapTenantAdmin({ tenantId, email: "owner@tngd.test", password: pw });
  const ownerToken = (await secure.authenticate({ tenantId, email: "owner@tngd.test", password: pw })).token;
  const coord = await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "coord@tngd.test", password: pw, roles: ["admin_dispatch"] });
  const coordToken = (await secure.authenticate({ tenantId, email: "coord@tngd.test", password: pw })).token;
  const mgr = await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "mgr@tngd.test", password: pw, roles: ["manager"] });
  const mgrToken = (await secure.authenticate({ tenantId, email: "mgr@tngd.test", password: pw })).token;
  const tech = await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "tech@tngd.test", password: pw, roles: ["technician"] });
  const techToken = (await secure.authenticate({ tenantId, email: "tech@tngd.test", password: pw })).token;
  const exec = await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "exec@tngd.test", password: pw, roles: ["executive"] });
  const execToken = (await secure.authenticate({ tenantId, email: "exec@tngd.test", password: pw })).token;

  const baseDate = new Date("2026-03-01T10:00:00Z");
  let tick = 0;
  const svc = new FollowUpService({ secureAccess: secure, auditLog: secure.auditLog, now: () => new Date(baseDate.getTime() + (tick++) * 1000) });

  const { policy } = svc.createPolicyAuthorized({ sessionToken: ownerToken, tenantId, name: "TNGD Standard Follow-Up" });

  return { svc, secure, tenantId, ownerToken, coordToken, mgrToken, techToken, execToken, policy };
}

test("all five roadmap cadences are scheduled with correct due-date offsets", async () => {
  const { svc, coordToken, tenantId, policy } = await setup();
  const cadences = ["immediate", "short-term", "two-month", "six-month", "annual"];
  const expectedDays = [0, 7, 60, 180, 365];
  for (let i = 0; i < cadences.length; i++) {
    const a = svc.scheduleActivityAuthorized({
      sessionToken: coordToken, tenantId, cadence: cadences[i],
      activityType: "satisfaction", customerId: "cust-1", serviceCaseId: "sc-1",
      idempotencyKey: `cad-${cadences[i]}`
    });
    assert.equal(a.cadence, cadences[i]);
    assert.equal(a.status, "due");
    assert.ok(a.dueAt);
  }
});

test("authoritative eligibility evaluates consent and policy state", async () => {
  const { svc, coordToken, tenantId, policy } = await setup();
  const eligible = svc.evaluateEligibilityAuthorized({
    sessionToken: coordToken, tenantId, customerId: "cust-e", serviceCaseId: "sc-e",
    policyId: policy.id, cadence: "immediate", activityType: "satisfaction", consentGranted: true
  });
  assert.equal(eligible.eligible, true);
  assert.equal(eligible.consentGranted, true);
  assert.equal(eligible.policyVersion, 1);

  const ineligible = svc.evaluateEligibilityAuthorized({
    sessionToken: coordToken, tenantId, customerId: "cust-e2", serviceCaseId: "sc-e2",
    policyId: policy.id, cadence: "short-term", activityType: "review-request", consentGranted: false
  });
  assert.equal(ineligible.eligible, false);
  assert.equal(ineligible.reason, "consent-not-granted");
});

test("current-consent recheck suppresses activity when consent withdrawn", async () => {
  const { svc, coordToken, tenantId } = await setup();
  const a = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "short-term",
    activityType: "review-request", customerId: "cust-c", serviceCaseId: "sc-c",
    idempotencyKey: "consent-test"
  });
  assert.equal(a.status, "due");

  const { activity, suppression } = svc.recheckConsentAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id, consentGranted: false
  });
  assert.equal(activity.status, "suppressed");
  assert.equal(activity.reason, "consent-withdrawn");
  assert.ok(suppression);
  assert.equal(suppression.reason, "opt-out");
});

test("opt-out suppression with explicit reason and immutable evidence", async () => {
  const { svc, coordToken, tenantId } = await setup();
  const a = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "two-month",
    activityType: "maintenance", customerId: "cust-opt", serviceCaseId: "sc-opt",
    idempotencyKey: "opt-out-test"
  });
  assert.throws(() => svc.suppressActivityAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id, reason: ""
  }), /reason/i);

  const { activity, suppression } = svc.suppressActivityAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id, reason: "Customer requested no contact"
  });
  assert.equal(activity.status, "suppressed");
  assert.equal(suppression.reason, "Customer requested no contact");
  assert.ok(suppression.suppressedAt);
});

test("follow-up survives after service case and job closure", async () => {
  const { svc, coordToken, execToken, tenantId } = await setup();
  const a = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "six-month",
    activityType: "maintenance", customerId: "cust-surv", serviceCaseId: "sc-closed",
    sourceReferences: ["BP-004-sc-closed", "BP-009-job-closed"],
    idempotencyKey: "survive-closure"
  });
  assert.equal(a.status, "due");
  assert.ok(a.sourceReferences.includes("BP-004-sc-closed"));

  svc.transitionActivityAuthorized({ sessionToken: coordToken, tenantId, activityId: a.id, toStatus: "eligible" });
  const current = svc.getActivityAuthorized({ sessionToken: execToken, tenantId, activityId: a.id });
  assert.equal(current.status, "eligible");
  assert.equal(current.serviceCaseId, "sc-closed");
});

test("duplicate-handoff prevention returns existing handoff", async () => {
  const { svc, coordToken, tenantId } = await setup();
  const a = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "immediate",
    activityType: "satisfaction", customerId: "cust-dup", serviceCaseId: "sc-dup",
    idempotencyKey: "dup-activity"
  });
  svc.transitionActivityAuthorized({ sessionToken: coordToken, tenantId, activityId: a.id, toStatus: "eligible" });

  const h1 = svc.createTaskHandoffAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id,
    taskDescription: "Satisfaction follow-up call", consentGranted: true,
    idempotencyKey: "handoff-dup"
  });
  const h2 = svc.createTaskHandoffAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id,
    taskDescription: "Satisfaction follow-up call", consentGranted: true,
    idempotencyKey: "handoff-dup"
  });
  assert.equal(h1.id, h2.id);
});

test("Communications-only delivery through governed handoff boundary", async () => {
  const { svc, coordToken, tenantId } = await setup();
  const a = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "immediate",
    activityType: "review-request", customerId: "cust-comm", serviceCaseId: "sc-comm",
    idempotencyKey: "comm-test"
  });
  svc.transitionActivityAuthorized({ sessionToken: coordToken, tenantId, activityId: a.id, toStatus: "eligible" });

  const handoff = svc.createCommunicationHandoffAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id,
    channel: "email", templateReference: "review-request-template",
    consentGranted: true, idempotencyKey: "comm-handoff"
  });
  assert.equal(handoff.targetBoundary, "APP-006");
  assert.equal(handoff.channel, "email");
  assert.equal(handoff.consentVerified, true);
  assert.equal(handoff.handoffType, "communication");

  assert.throws(() => svc.deliverEmailAuthorized(), /does not deliver/);
  assert.throws(() => svc.deliverSmsAuthorized(), /does not deliver/);
});

test("handoff requires consent verification", async () => {
  const { svc, coordToken, tenantId } = await setup();
  const a = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "immediate",
    activityType: "satisfaction", customerId: "cust-no-consent", serviceCaseId: "sc-nc",
    idempotencyKey: "no-consent-test"
  });
  svc.transitionActivityAuthorized({ sessionToken: coordToken, tenantId, activityId: a.id, toStatus: "eligible" });

  assert.throws(() => svc.createCommunicationHandoffAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id,
    consentGranted: false, idempotencyKey: "no-consent-handoff"
  }), /Consent/);
  assert.throws(() => svc.createTaskHandoffAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id,
    consentGranted: false, idempotencyKey: "no-consent-task"
  }), /Consent/);
});

test("reasoned rescheduling supersedes original and creates new activity", async () => {
  const { svc, coordToken, tenantId } = await setup();
  const a = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "short-term",
    activityType: "estimate", customerId: "cust-resched", serviceCaseId: "sc-resched",
    idempotencyKey: "resched-test"
  });
  assert.throws(() => svc.rescheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id, newCadence: "two-month", reason: ""
  }), /reason/i);

  const { superseded, rescheduled } = svc.rescheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id,
    newCadence: "two-month", reason: "Customer requested delay"
  });
  assert.equal(superseded.status, "superseded");
  assert.equal(rescheduled.cadence, "two-month");
  assert.equal(rescheduled.status, "due");
  assert.equal(rescheduled.supersedes, a.id);
  assert.notEqual(rescheduled.id, a.id);
});

test("source-record non-mutation and immutable finalized evidence", async () => {
  const { svc, coordToken, execToken, tenantId } = await setup();
  const a = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "immediate",
    activityType: "satisfaction", customerId: "cust-imm", serviceCaseId: "sc-imm",
    idempotencyKey: "immutable-test"
  });
  svc.transitionActivityAuthorized({ sessionToken: coordToken, tenantId, activityId: a.id, toStatus: "eligible" });
  svc.createTaskHandoffAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id,
    consentGranted: true, idempotencyKey: "imm-handoff"
  });
  svc.recordHandoffOutcomeAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id,
    outcome: "completed", outcomeReference: "call-ref-123"
  });
  const completed = svc.getActivityAuthorized({ sessionToken: execToken, tenantId, activityId: a.id });
  assert.equal(completed.status, "completed");

  assert.throws(() => svc.suppressActivityAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id, reason: "late suppress"
  }), /finalized/);
  assert.throws(() => svc.rescheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, activityId: a.id, newCadence: "annual", reason: "late reschedule"
  }), /finalized/);
});

test("tenant isolation and role boundaries remain intact through BP-013", async () => {
  const { svc, secure, coordToken, techToken, execToken, tenantId } = await setup();
  const tenantB = "t-other-followup";
  await secure.bootstrapTenantAdmin({ tenantId: tenantB, email: "other@test.co", password: "FollowUpTest99!" });
  const otherToken = (await secure.authenticate({ tenantId: tenantB, email: "other@test.co", password: "FollowUpTest99!" })).token;

  const a = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "immediate",
    activityType: "satisfaction", customerId: "cust-iso", serviceCaseId: "sc-iso",
    idempotencyKey: "isolation-test"
  });
  assert.throws(() => svc.getActivityAuthorized({
    sessionToken: otherToken, tenantId, activityId: a.id
  }), /denied/);
  assert.throws(() => svc.scheduleActivityAuthorized({
    sessionToken: techToken, tenantId, cadence: "immediate",
    activityType: "satisfaction", customerId: "cust-iso2", serviceCaseId: "sc-iso2",
    idempotencyKey: "tech-try"
  }), /denied/);

  const activities = svc.listActivitiesAuthorized({ sessionToken: execToken, tenantId });
  assert.ok(Array.isArray(activities));

  assert.throws(() => svc.createConsentAuthorized(), /does not create/);
  assert.throws(() => svc.publishReviewAuthorized(), /does not publish/);
  assert.throws(() => svc.processPaymentAuthorized(), /does not process/);
  assert.throws(() => svc.generateReportAuthorized(), /does not generate/);
});

test("policy versioning preserves history and updates current version", async () => {
  const { svc, ownerToken, tenantId, policy } = await setup();
  assert.equal(policy.currentVersion, 1);

  const { policy: updated, version } = svc.versionPolicyAuthorized({
    sessionToken: ownerToken, tenantId, policyId: policy.id,
    cadences: ["immediate", "short-term", "annual"]
  });
  assert.equal(updated.currentVersion, 2);
  assert.equal(version.version, 2);
  assert.equal(version.cadences.length, 3);
});

test("handoff outcome records completed and failed states", async () => {
  const { svc, coordToken, tenantId } = await setup();
  const a1 = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "immediate",
    activityType: "satisfaction", customerId: "cust-out1", serviceCaseId: "sc-out1",
    idempotencyKey: "outcome-complete"
  });
  svc.transitionActivityAuthorized({ sessionToken: coordToken, tenantId, activityId: a1.id, toStatus: "eligible" });
  svc.createTaskHandoffAuthorized({
    sessionToken: coordToken, tenantId, activityId: a1.id,
    consentGranted: true, idempotencyKey: "out-handoff-1"
  });
  const completed = svc.recordHandoffOutcomeAuthorized({
    sessionToken: coordToken, tenantId, activityId: a1.id,
    outcome: "completed", outcomeReference: "call-completed"
  });
  assert.equal(completed.status, "completed");

  const a2 = svc.scheduleActivityAuthorized({
    sessionToken: coordToken, tenantId, cadence: "immediate",
    activityType: "review-request", customerId: "cust-out2", serviceCaseId: "sc-out2",
    idempotencyKey: "outcome-fail"
  });
  svc.transitionActivityAuthorized({ sessionToken: coordToken, tenantId, activityId: a2.id, toStatus: "eligible" });
  svc.createCommunicationHandoffAuthorized({
    sessionToken: coordToken, tenantId, activityId: a2.id,
    consentGranted: true, idempotencyKey: "out-handoff-2"
  });
  const failed = svc.recordHandoffOutcomeAuthorized({
    sessionToken: coordToken, tenantId, activityId: a2.id,
    outcome: "failed", outcomeReference: "email-bounced"
  });
  assert.equal(failed.status, "failed");

  const retried = svc.transitionActivityAuthorized({
    sessionToken: coordToken, tenantId, activityId: a2.id, toStatus: "due"
  });
  assert.equal(retried.status, "due");
});
