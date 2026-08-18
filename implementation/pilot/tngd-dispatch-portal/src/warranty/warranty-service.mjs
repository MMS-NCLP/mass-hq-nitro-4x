import { randomUUID } from "node:crypto";

const freeze = (v) => {
  if (!v || typeof v !== "object" || Object.isFrozen(v)) return v;
  Object.freeze(v);
  for (const x of Object.values(v)) freeze(x);
  return v;
};

const CLAIM_STATUSES = Object.freeze([
  "submitted", "under-review", "awaiting-evidence", "awaiting-appointment",
  "decision-pending", "approved", "partially-approved", "denied",
  "resolution-in-progress", "resolved", "closed"
]);

const VALID_TRANSITIONS = Object.freeze({
  "submitted": ["under-review"],
  "under-review": ["awaiting-evidence", "awaiting-appointment", "decision-pending"],
  "awaiting-evidence": ["under-review", "decision-pending"],
  "awaiting-appointment": ["under-review", "decision-pending"],
  "decision-pending": ["approved", "partially-approved", "denied"],
  "approved": ["resolution-in-progress"],
  "partially-approved": ["resolution-in-progress"],
  "denied": ["closed"],
  "resolution-in-progress": ["resolved"],
  "resolved": ["closed"]
});

const COVERAGE_OUTCOMES = Object.freeze(["covered", "partially-covered", "not-covered"]);
const REGISTRATION_STATES = Object.freeze(["active", "expired", "voided", "superseded"]);
const RESOLUTION_CLASSES = Object.freeze(["no-charge", "customer-charge", "administrative-review"]);

const DAYS_MS = 24 * 60 * 60 * 1000;

export class WarrantyService {
  #policies = new Map();
  #registrations = new Map();
  #regByKey = new Map();
  #coverageItems = new Map();
  #claims = new Map();
  #claimByKey = new Map();
  #claimEvidence = new Map();
  #assessments = new Map();
  #findings = new Map();
  #decisions = new Map();
  #resolutions = new Map();
  #history = new Map();
  #handoffs = new Map();
  #secure;
  #audit;
  #now;

  constructor({ secureAccess, auditLog, now = () => new Date() } = {}) {
    if (!secureAccess || !auditLog)
      throw new Error("BP-013 requires security and audit contracts.");
    this.#secure = secureAccess;
    this.#audit = auditLog;
    this.#now = now;
  }

  // --- Policy ---

  createPolicyAuthorized({ sessionToken, tenantId, name, partsCoverageDays, serviceCoverageDays }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*", "warranty:policy:create");
    if (!name || typeof partsCoverageDays !== "number" || typeof serviceCoverageDays !== "number")
      throw new Error("Policy name, parts coverage days, and service coverage days are required.");
    if (partsCoverageDays < 1 || serviceCoverageDays < 1)
      throw new Error("Coverage days must be positive.");
    const policy = freeze({
      id: randomUUID(), tenantId, name, version: 1,
      partsCoverageDays, serviceCoverageDays,
      effectiveDate: this.#now().toISOString(),
      createdBy: p.id, createdAt: this.#now().toISOString()
    });
    this.#policies.set(policy.id, policy);
    this.#record(tenantId, policy.id, "PolicyCreated", p.id, { policyId: policy.id });
    return policy;
  }

  getPolicyAuthorized({ sessionToken, tenantId, policyId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `warranty:policy:${policyId}`);
    const p = this.#policies.get(policyId);
    if (!p || p.tenantId !== tenantId) throw new Error("Policy not found.");
    return p;
  }

  // --- Registration ---

  registerWorkAuthorized({ sessionToken, tenantId, policyId, serviceCaseId,
    sourceJobId, completionDate, coveredItems, idempotencyKey }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:registration:${serviceCaseId}`);
    if (!policyId || !serviceCaseId || !completionDate || !idempotencyKey)
      throw new Error("Policy, service case, completion date, and idempotency key are required.");
    if (!Array.isArray(coveredItems) || coveredItems.length === 0)
      throw new Error("At least one covered item is required.");

    const key = `${tenantId}:${idempotencyKey}`;
    if (this.#regByKey.has(key)) return this.#registrations.get(this.#regByKey.get(key));

    const policy = this.#policies.get(policyId);
    if (!policy || policy.tenantId !== tenantId) throw new Error("Policy not found.");

    const completionMs = new Date(completionDate).getTime();
    const partsExpiration = new Date(completionMs + policy.partsCoverageDays * DAYS_MS).toISOString();
    const serviceExpiration = new Date(completionMs + policy.serviceCoverageDays * DAYS_MS).toISOString();

    const regId = randomUUID();
    const items = coveredItems.map((item) => {
      const ci = freeze({
        id: randomUUID(), registrationId: regId, tenantId,
        description: item.description, type: item.type,
        sourceReference: item.sourceReference || null
      });
      this.#coverageItems.set(ci.id, ci);
      return ci;
    });

    const reg = freeze({
      id: regId, tenantId, policyId, policyVersion: policy.version,
      serviceCaseId, sourceJobId: sourceJobId || null,
      completionDate, partsExpiration, serviceExpiration,
      status: "active", voidReason: null,
      coveredItemIds: Object.freeze(items.map((i) => i.id)),
      createdBy: p.id, createdAt: this.#now().toISOString(), revision: 1
    });
    this.#registrations.set(reg.id, reg);
    this.#regByKey.set(key, reg.id);
    this.#record(tenantId, reg.id, "RegistrationCreated", p.id, { policyId, serviceCaseId });
    return reg;
  }

  getRegistrationAuthorized({ sessionToken, tenantId, registrationId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `warranty:registration:${registrationId}`);
    const r = this.#registrations.get(registrationId);
    if (!r || r.tenantId !== tenantId) throw new Error("Registration not found.");
    return { ...r, coveredItems: r.coveredItemIds.map((id) => this.#coverageItems.get(id)) };
  }

  voidRegistrationAuthorized({ sessionToken, tenantId, registrationId, reason }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*", `warranty:registration:${registrationId}:void`);
    if (!reason) throw new Error("Reason is required for voiding.");
    const r = this.#registrations.get(registrationId);
    if (!r || r.tenantId !== tenantId) throw new Error("Registration not found.");
    if (r.status !== "active") throw new Error("Only active registrations can be voided.");
    const voided = freeze({ ...r, status: "voided", voidReason: reason, revision: r.revision + 1 });
    this.#registrations.set(registrationId, voided);
    this.#record(tenantId, registrationId, "RegistrationVoided", p.id, { reason });
    return voided;
  }

  // --- Claims ---

  createClaimAuthorized({ sessionToken, tenantId, registrationId, serviceCaseId,
    issueDescription, affectedItemIds, idempotencyKey }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:claim:${registrationId}`);
    if (!registrationId || !serviceCaseId || !issueDescription || !idempotencyKey)
      throw new Error("Registration, service case, issue description, and idempotency key are required.");
    if (!Array.isArray(affectedItemIds) || affectedItemIds.length === 0)
      throw new Error("At least one affected item is required.");

    const claimKey = `${tenantId}:${idempotencyKey}`;
    if (this.#claimByKey.has(claimKey)) return this.#claims.get(this.#claimByKey.get(claimKey));

    const reg = this.#registrations.get(registrationId);
    if (!reg || reg.tenantId !== tenantId) throw new Error("Registration not found.");
    if (reg.status !== "active") throw new Error("Claims can only be filed against active registrations.");

    for (const itemId of affectedItemIds) {
      if (!reg.coveredItemIds.includes(itemId))
        throw new Error("Affected item is not covered by this registration.");
    }

    const claim = freeze({
      id: randomUUID(), tenantId, registrationId, serviceCaseId,
      issueDescription, affectedItemIds: Object.freeze([...affectedItemIds]),
      status: "submitted", createdBy: p.id,
      createdAt: this.#now().toISOString(), revision: 1
    });
    this.#claims.set(claim.id, claim);
    this.#claimByKey.set(claimKey, claim.id);
    this.#record(tenantId, claim.id, "ClaimCreated", p.id, { registrationId, serviceCaseId });
    return claim;
  }

  getClaimAuthorized({ sessionToken, tenantId, claimId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `warranty:claim:${claimId}`);
    const c = this.#claims.get(claimId);
    if (!c || c.tenantId !== tenantId) throw new Error("Claim not found.");
    return c;
  }

  transitionClaimAuthorized({ sessionToken, tenantId, claimId, toStatus }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:claim:${claimId}:transition`);
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    const allowed = VALID_TRANSITIONS[claim.status];
    if (!allowed || !allowed.includes(toStatus))
      throw new Error(`Transition from '${claim.status}' to '${toStatus}' is not allowed.`);
    const updated = freeze({ ...claim, status: toStatus, revision: claim.revision + 1 });
    this.#claims.set(claimId, updated);
    this.#record(tenantId, claimId, "ClaimTransitioned", p.id, { from: claim.status, to: toStatus });
    return updated;
  }

  // --- Evidence ---

  attachEvidenceAuthorized({ sessionToken, tenantId, claimId, sourceType, sourceId, description }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:claim:${claimId}:evidence`);
    if (!sourceType || !sourceId) throw new Error("Evidence source type and ID are required.");
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    const ref = freeze({
      id: randomUUID(), claimId, tenantId, sourceType, sourceId,
      description: description || null,
      attachedBy: p.id, attachedAt: this.#now().toISOString()
    });
    if (!this.#claimEvidence.has(claimId)) this.#claimEvidence.set(claimId, []);
    this.#claimEvidence.get(claimId).push(ref);
    this.#record(tenantId, claimId, "EvidenceAttached", p.id, { sourceType, sourceId });
    return ref;
  }

  // --- Eligibility Assessment ---

  assessEligibilityAuthorized({ sessionToken, tenantId, claimId }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:claim:${claimId}:assess`);
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    const reg = this.#registrations.get(claim.registrationId);
    const now = this.#now();

    const partsEligible = reg.status === "active" &&
      now.getTime() <= new Date(reg.partsExpiration).getTime();
    const serviceEligible = reg.status === "active" &&
      now.getTime() <= new Date(reg.serviceExpiration).getTime();

    const evidenceRefs = this.#claimEvidence.get(claimId) || [];
    const assessment = freeze({
      id: randomUUID(), claimId, tenantId,
      registrationStatus: reg.status,
      partsEligible, serviceEligible,
      partsExpiration: reg.partsExpiration,
      serviceExpiration: reg.serviceExpiration,
      evidenceCount: evidenceRefs.length,
      assessedAt: now.toISOString(), assessedBy: p.id,
      advisory: true
    });
    this.#assessments.set(assessment.id, assessment);
    this.#record(tenantId, claimId, "EligibilityAssessed", p.id,
      { partsEligible, serviceEligible });
    return assessment;
  }

  // --- Findings ---

  recordFindingAuthorized({ sessionToken, tenantId, claimId, description, evidenceReferences }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:claim:${claimId}:finding`);
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    if (!description) throw new Error("Finding description is required.");
    const finding = freeze({
      id: randomUUID(), claimId, tenantId, description,
      evidenceReferences: Object.freeze([...(evidenceReferences || [])]),
      recordedBy: p.id, recordedAt: this.#now().toISOString()
    });
    if (!this.#findings.has(claimId)) this.#findings.set(claimId, []);
    this.#findings.get(claimId).push(finding);
    this.#record(tenantId, claimId, "FindingRecorded", p.id, { findingId: finding.id });
    return finding;
  }

  // --- Coverage Decision ---

  submitDecisionAuthorized({ sessionToken, tenantId, claimId, outcome, reason,
    approvedItems, excludedItems, resolutionClass }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*",
      `warranty:claim:${claimId}:decision`);
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    if (claim.status !== "decision-pending")
      throw new Error("Claim must be in decision-pending status.");
    if (!COVERAGE_OUTCOMES.includes(outcome))
      throw new Error("Outcome must be covered, partially-covered, or not-covered.");
    if (!reason) throw new Error("Reason is required for coverage decision.");
    if (!RESOLUTION_CLASSES.includes(resolutionClass))
      throw new Error("Resolution class must be no-charge, customer-charge, or administrative-review.");

    if (p.id === claim.createdBy)
      throw new Error("The claim creator cannot approve their own warranty decision.");

    const decision = freeze({
      id: randomUUID(), claimId, tenantId, outcome, reason,
      approvedItems: Object.freeze([...(approvedItems || [])]),
      excludedItems: Object.freeze([...(excludedItems || [])]),
      resolutionClass, supersededBy: null,
      decidedBy: p.id, decidedAt: this.#now().toISOString()
    });
    if (!this.#decisions.has(claimId)) this.#decisions.set(claimId, []);
    this.#decisions.get(claimId).push(decision);

    const targetStatus = outcome === "covered" ? "approved" :
      outcome === "partially-covered" ? "partially-approved" : "denied";
    const updated = freeze({ ...claim, status: targetStatus, revision: claim.revision + 1 });
    this.#claims.set(claimId, updated);

    this.#record(tenantId, claimId, "CoverageDecisionSubmitted", p.id,
      { outcome, resolutionClass, decisionId: decision.id });
    return { decision, claim: updated };
  }

  supersedeDecisionAuthorized({ sessionToken, tenantId, claimId, originalDecisionId,
    outcome, reason, approvedItems, excludedItems, resolutionClass }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*",
      `warranty:claim:${claimId}:supersede`);
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    if (!reason) throw new Error("Reason is required for superseding a decision.");
    if (!COVERAGE_OUTCOMES.includes(outcome))
      throw new Error("Outcome must be covered, partially-covered, or not-covered.");
    if (!RESOLUTION_CLASSES.includes(resolutionClass))
      throw new Error("Resolution class is required.");

    const decisions = this.#decisions.get(claimId) || [];
    const original = decisions.find((d) => d.id === originalDecisionId);
    if (!original) throw new Error("Original decision not found.");

    const marked = freeze({ ...original, supersededBy: randomUUID() });
    const idx = decisions.indexOf(original);
    decisions[idx] = marked;

    const newDecision = freeze({
      id: marked.supersededBy, claimId, tenantId, outcome, reason,
      approvedItems: Object.freeze([...(approvedItems || [])]),
      excludedItems: Object.freeze([...(excludedItems || [])]),
      resolutionClass, supersededBy: null,
      decidedBy: p.id, decidedAt: this.#now().toISOString()
    });
    decisions.push(newDecision);

    const targetStatus = outcome === "covered" ? "approved" :
      outcome === "partially-covered" ? "partially-approved" : "denied";
    const updated = freeze({ ...claim, status: targetStatus, revision: claim.revision + 1 });
    this.#claims.set(claimId, updated);

    this.#record(tenantId, claimId, "DecisionSuperseded", p.id,
      { originalId: originalDecisionId, newId: newDecision.id, outcome });
    return { decision: newDecision, superseded: marked, claim: updated };
  }

  // --- Resolution ---

  beginResolutionAuthorized({ sessionToken, tenantId, claimId }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:claim:${claimId}:resolve`);
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    if (!["approved", "partially-approved"].includes(claim.status))
      throw new Error("Only approved or partially-approved claims can begin resolution.");
    return this.transitionClaimAuthorized({ sessionToken, tenantId, claimId, toStatus: "resolution-in-progress" });
  }

  completeResolutionAuthorized({ sessionToken, tenantId, claimId, resolutionSummary, evidenceReferences }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:claim:${claimId}:complete`);
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    if (claim.status !== "resolution-in-progress")
      throw new Error("Claim must be in resolution-in-progress status.");
    if (!resolutionSummary) throw new Error("Resolution summary is required.");

    const resolution = freeze({
      id: randomUUID(), claimId, tenantId, resolutionSummary,
      evidenceReferences: Object.freeze([...(evidenceReferences || [])]),
      resolvedBy: p.id, resolvedAt: this.#now().toISOString()
    });
    this.#resolutions.set(claimId, resolution);

    const updated = freeze({ ...claim, status: "resolved", revision: claim.revision + 1 });
    this.#claims.set(claimId, updated);
    this.#record(tenantId, claimId, "ResolutionCompleted", p.id, { resolutionId: resolution.id });
    return { resolution, claim: updated };
  }

  closeClaimAuthorized({ sessionToken, tenantId, claimId }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:claim:${claimId}:close`);
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    if (!["resolved", "denied"].includes(claim.status))
      throw new Error("Only resolved or denied claims can be closed.");
    return this.transitionClaimAuthorized({ sessionToken, tenantId, claimId, toStatus: "closed" });
  }

  // --- History ---

  getClaimHistoryAuthorized({ sessionToken, tenantId, claimId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `warranty:claim:${claimId}:history`);
    return Object.freeze([...(this.#history.get(claimId) || [])]);
  }

  getDecisionsAuthorized({ sessionToken, tenantId, claimId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `warranty:claim:${claimId}:decisions`);
    return Object.freeze([...(this.#decisions.get(claimId) || [])]);
  }

  // --- Handoff ---

  createHandoffAuthorized({ sessionToken, tenantId, claimId, targetPackage, category, referenceId }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `warranty:claim:${claimId}:handoff`);
    if (targetPackage !== "TNGD-BP-014")
      throw new Error("Warranty handoffs target BP-014 only.");
    if (!["follow-up", "callback"].includes(category))
      throw new Error("Warranty handoff category must be follow-up or callback.");
    const claim = this.#claims.get(claimId);
    if (!claim || claim.tenantId !== tenantId) throw new Error("Claim not found.");
    const handoff = freeze({
      id: randomUUID(), claimId, tenantId, targetPackage, category,
      referenceId: referenceId || claimId,
      serviceCaseId: claim.serviceCaseId,
      createdBy: p.id, createdAt: this.#now().toISOString()
    });
    this.#handoffs.set(handoff.id, handoff);
    this.#record(tenantId, claimId, "HandoffCreated", p.id, { targetPackage, category });
    return handoff;
  }

  // --- Forbidden scope ---

  processPaymentAuthorized() { throw new Error("BP-013 does not process payments."); }
  deliverCommunicationAuthorized() { throw new Error("BP-013 does not deliver communications."); }
  generateAiFindings() { throw new Error("BP-013 does not generate AI findings."); }
  automateFollowUpAuthorized() { throw new Error("BP-013 does not automate follow-up."); }

  // --- Internal ---

  #permit(sessionToken, tenantId, permission, resourceId) {
    return this.#secure.requirePermission({ sessionToken, tenantId, permission, resourceId });
  }

  #record(tenantId, subjectId, type, actorId, metadata) {
    const entry = freeze({
      id: randomUUID(), subjectId, type,
      actorId, occurredAt: this.#now().toISOString(), metadata
    });
    if (!this.#history.has(subjectId)) this.#history.set(subjectId, []);
    this.#history.get(subjectId).push(entry);
    this.#audit.append({
      tenantId, principalId: actorId, type,
      resource: `warranty:${subjectId}`,
      action: "operations.warranty", outcome: "granted", metadata
    });
  }
}
