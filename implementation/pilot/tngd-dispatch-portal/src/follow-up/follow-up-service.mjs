import { randomUUID } from "node:crypto";

const freeze = Object.freeze;

const CADENCES = Object.freeze(["immediate", "short-term", "two-month", "six-month", "annual"]);
const ACTIVITY_TYPES = Object.freeze(["satisfaction", "review-request", "estimate", "maintenance", "relationship"]);
const VALID_STATUSES = Object.freeze(["due", "eligible", "suppressed", "handed-off", "completed", "failed", "cancelled", "superseded"]);

const CADENCE_DAYS = Object.freeze({
  "immediate": 0,
  "short-term": 7,
  "two-month": 60,
  "six-month": 180,
  "annual": 365
});

const DAYS_MS = 86_400_000;

const VALID_TRANSITIONS = Object.freeze({
  "due": ["eligible", "suppressed", "cancelled"],
  "eligible": ["suppressed", "handed-off", "cancelled"],
  "suppressed": [],
  "handed-off": ["completed", "failed"],
  "completed": [],
  "failed": ["due", "cancelled"],
  "cancelled": [],
  "superseded": []
});

export class FollowUpService {
  #secure;
  #audit;
  #now;

  #policies = new Map();
  #policyVersions = new Map();
  #eligibilities = new Map();
  #activities = new Map();
  #activityByKey = new Map();
  #suppressions = new Map();
  #taskHandoffs = new Map();
  #taskHandoffByKey = new Map();
  #commHandoffs = new Map();
  #commHandoffByKey = new Map();
  #history = new Map();

  constructor({ secureAccess, auditLog, now }) {
    this.#secure = secureAccess;
    this.#audit = auditLog;
    this.#now = now || (() => new Date());
  }

  #permit(sessionToken, tenantId, permission, resource) {
    return this.#secure.requirePermission({
      sessionToken, tenantId, permission, resourceId: resource
    });
  }

  #record(tenantId, subjectId, type, actorId, data) {
    const entry = freeze({ id: randomUUID(), tenantId, subjectId, type, actorId, data: freeze(data), at: this.#now().toISOString() });
    const list = this.#history.get(subjectId) || [];
    list.push(entry);
    this.#history.set(subjectId, list);
    this.#audit.append({ tenantId, principalId: actorId, type, resource: subjectId, action: type, outcome: "recorded", metadata: data });
    return entry;
  }

  // --- Policy ---

  createPolicyAuthorized({ sessionToken, tenantId, name, cadences, activityTypes }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*", "followup:policy:create");
    if (!name || typeof name !== "string") throw new Error("Policy name is required.");
    for (const c of (cadences || [])) if (!CADENCES.includes(c)) throw new Error(`Invalid cadence: ${c}`);
    for (const a of (activityTypes || [])) if (!ACTIVITY_TYPES.includes(a)) throw new Error(`Invalid activity type: ${a}`);

    const policy = freeze({
      id: randomUUID(), tenantId, name,
      cadences: freeze([...(cadences || CADENCES)]),
      activityTypes: freeze([...(activityTypes || ACTIVITY_TYPES)]),
      currentVersion: 1,
      createdAt: this.#now().toISOString(), createdBy: p.id
    });
    this.#policies.set(policy.id, policy);

    const version = freeze({
      id: randomUUID(), policyId: policy.id, tenantId, version: 1,
      cadences: policy.cadences, activityTypes: policy.activityTypes,
      createdAt: this.#now().toISOString(), createdBy: p.id
    });
    this.#policyVersions.set(version.id, version);
    this.#record(tenantId, policy.id, "PolicyCreated", p.id, { name, version: 1 });
    return { policy, version };
  }

  versionPolicyAuthorized({ sessionToken, tenantId, policyId, cadences, activityTypes }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*", `followup:policy:${policyId}:version`);
    const policy = this.#policies.get(policyId);
    if (!policy || policy.tenantId !== tenantId) throw new Error("Policy not found.");
    for (const c of (cadences || [])) if (!CADENCES.includes(c)) throw new Error(`Invalid cadence: ${c}`);
    for (const a of (activityTypes || [])) if (!ACTIVITY_TYPES.includes(a)) throw new Error(`Invalid activity type: ${a}`);

    const newVersion = policy.currentVersion + 1;
    const updated = freeze({ ...policy, currentVersion: newVersion,
      cadences: freeze([...(cadences || policy.cadences)]),
      activityTypes: freeze([...(activityTypes || policy.activityTypes)])
    });
    this.#policies.set(policyId, updated);

    const version = freeze({
      id: randomUUID(), policyId, tenantId, version: newVersion,
      cadences: updated.cadences, activityTypes: updated.activityTypes,
      createdAt: this.#now().toISOString(), createdBy: p.id
    });
    this.#policyVersions.set(version.id, version);
    this.#record(tenantId, policyId, "PolicyVersioned", p.id, { version: newVersion });
    return { policy: updated, version };
  }

  // --- Eligibility ---

  evaluateEligibilityAuthorized({ sessionToken, tenantId, customerId, serviceCaseId, policyId, cadence, activityType, consentGranted }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `followup:eligibility:evaluate`);
    if (!CADENCES.includes(cadence)) throw new Error(`Invalid cadence: ${cadence}`);
    if (!ACTIVITY_TYPES.includes(activityType)) throw new Error(`Invalid activity type: ${activityType}`);
    if (!customerId || !serviceCaseId) throw new Error("Customer and service case references are required.");

    const policy = this.#policies.get(policyId);
    if (!policy || policy.tenantId !== tenantId) throw new Error("Policy not found.");

    const eligible = consentGranted === true;

    const eligibility = freeze({
      id: randomUUID(), tenantId, customerId, serviceCaseId, policyId,
      policyVersion: policy.currentVersion,
      cadence, activityType, consentGranted: !!consentGranted,
      eligible, reason: eligible ? "consent-granted" : "consent-not-granted",
      evaluatedAt: this.#now().toISOString(), evaluatedBy: p.id
    });
    this.#eligibilities.set(eligibility.id, eligibility);
    this.#record(tenantId, eligibility.id, "EligibilityEvaluated", p.id, { customerId, cadence, activityType, eligible });
    return eligibility;
  }

  // --- Activity ---

  scheduleActivityAuthorized({ sessionToken, tenantId, eligibilityId, cadence, activityType, customerId, serviceCaseId, sourceReferences, idempotencyKey }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `followup:activity:schedule`);
    if (!CADENCES.includes(cadence)) throw new Error(`Invalid cadence: ${cadence}`);
    if (!ACTIVITY_TYPES.includes(activityType)) throw new Error(`Invalid activity type: ${activityType}`);
    if (!customerId || !serviceCaseId) throw new Error("Customer and service case references are required.");

    if (idempotencyKey) {
      const existing = this.#activityByKey.get(`${tenantId}:${idempotencyKey}`);
      if (existing) return this.#activities.get(existing);
    }

    const dueAt = new Date(this.#now().getTime() + (CADENCE_DAYS[cadence] || 0) * DAYS_MS).toISOString();

    const activity = freeze({
      id: randomUUID(), tenantId, eligibilityId: eligibilityId || null,
      cadence, activityType, customerId, serviceCaseId,
      sourceReferences: freeze([...(sourceReferences || [])]),
      status: "due", dueAt, reason: null,
      idempotencyKey: idempotencyKey || null,
      createdAt: this.#now().toISOString(), createdBy: p.id
    });
    this.#activities.set(activity.id, activity);
    if (idempotencyKey) this.#activityByKey.set(`${tenantId}:${idempotencyKey}`, activity.id);
    this.#record(tenantId, activity.id, "ActivityScheduled", p.id, { cadence, activityType, dueAt });
    return activity;
  }

  transitionActivityAuthorized({ sessionToken, tenantId, activityId, toStatus, reason }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `followup:activity:${activityId}:transition`);
    const activity = this.#activities.get(activityId);
    if (!activity || activity.tenantId !== tenantId) throw new Error("Activity not found.");
    const allowed = VALID_TRANSITIONS[activity.status];
    if (!allowed || !allowed.includes(toStatus))
      throw new Error(`Transition from '${activity.status}' to '${toStatus}' is not allowed.`);

    const updated = freeze({ ...activity, status: toStatus, reason: reason || activity.reason });
    this.#activities.set(activityId, updated);
    this.#record(tenantId, activityId, "ActivityTransitioned", p.id, { from: activity.status, to: toStatus, reason });
    return updated;
  }

  recheckConsentAuthorized({ sessionToken, tenantId, activityId, consentGranted }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `followup:activity:${activityId}:consent`);
    const activity = this.#activities.get(activityId);
    if (!activity || activity.tenantId !== tenantId) throw new Error("Activity not found.");
    if (activity.status === "completed" || activity.status === "superseded" || activity.status === "cancelled")
      throw new Error("Cannot recheck consent on finalized activity.");

    if (!consentGranted) {
      const suppressed = freeze({ ...activity, status: "suppressed", reason: "consent-withdrawn" });
      this.#activities.set(activityId, suppressed);

      const suppression = freeze({
        id: randomUUID(), tenantId, activityId,
        reason: "opt-out", source: "consent-recheck",
        suppressedAt: this.#now().toISOString(), suppressedBy: p.id
      });
      this.#suppressions.set(suppression.id, suppression);
      this.#record(tenantId, activityId, "ActivitySuppressed", p.id, { reason: "opt-out" });
      return { activity: suppressed, suppression };
    }

    this.#record(tenantId, activityId, "ConsentRechecked", p.id, { consentGranted: true });
    return { activity, suppression: null };
  }

  suppressActivityAuthorized({ sessionToken, tenantId, activityId, reason }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `followup:activity:${activityId}:suppress`);
    if (!reason || typeof reason !== "string") throw new Error("Suppression reason is required.");
    const activity = this.#activities.get(activityId);
    if (!activity || activity.tenantId !== tenantId) throw new Error("Activity not found.");
    if (activity.status === "completed" || activity.status === "superseded" || activity.status === "cancelled")
      throw new Error("Cannot suppress finalized activity.");

    const suppressed = freeze({ ...activity, status: "suppressed", reason });
    this.#activities.set(activityId, suppressed);

    const suppression = freeze({
      id: randomUUID(), tenantId, activityId, reason,
      source: "manual", suppressedAt: this.#now().toISOString(), suppressedBy: p.id
    });
    this.#suppressions.set(suppression.id, suppression);
    this.#record(tenantId, activityId, "ActivitySuppressed", p.id, { reason });
    return { activity: suppressed, suppression };
  }

  rescheduleActivityAuthorized({ sessionToken, tenantId, activityId, newCadence, reason }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `followup:activity:${activityId}:reschedule`);
    if (!reason || typeof reason !== "string") throw new Error("Reschedule reason is required.");
    if (!CADENCES.includes(newCadence)) throw new Error(`Invalid cadence: ${newCadence}`);
    const activity = this.#activities.get(activityId);
    if (!activity || activity.tenantId !== tenantId) throw new Error("Activity not found.");
    if (activity.status === "completed" || activity.status === "superseded" || activity.status === "cancelled")
      throw new Error("Cannot reschedule finalized activity.");

    const superseded = freeze({ ...activity, status: "superseded", reason: `Superseded: ${reason}` });
    this.#activities.set(activityId, superseded);

    const dueAt = new Date(this.#now().getTime() + (CADENCE_DAYS[newCadence] || 0) * DAYS_MS).toISOString();
    const rescheduled = freeze({
      id: randomUUID(), tenantId, eligibilityId: activity.eligibilityId,
      cadence: newCadence, activityType: activity.activityType,
      customerId: activity.customerId, serviceCaseId: activity.serviceCaseId,
      sourceReferences: activity.sourceReferences,
      status: "due", dueAt, reason: null, idempotencyKey: null,
      supersedes: activityId,
      createdAt: this.#now().toISOString(), createdBy: p.id
    });
    this.#activities.set(rescheduled.id, rescheduled);
    this.#record(tenantId, activityId, "ActivitySuperseded", p.id, { reason, replacedBy: rescheduled.id });
    this.#record(tenantId, rescheduled.id, "ActivityScheduled", p.id, { cadence: newCadence, dueAt, supersedes: activityId });
    return { superseded, rescheduled };
  }

  // --- Task Handoff ---

  createTaskHandoffAuthorized({ sessionToken, tenantId, activityId, taskDescription, consentGranted, idempotencyKey }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `followup:task-handoff:create`);
    if (!consentGranted) throw new Error("Consent must be verified before task handoff.");

    if (idempotencyKey) {
      const existing = this.#taskHandoffByKey.get(`${tenantId}:${idempotencyKey}`);
      if (existing) return this.#taskHandoffs.get(existing);
    }

    const activity = this.#activities.get(activityId);
    if (!activity || activity.tenantId !== tenantId) throw new Error("Activity not found.");
    if (activity.status !== "eligible") throw new Error("Activity must be eligible before handoff.");

    const handoff = freeze({
      id: randomUUID(), tenantId, activityId,
      taskDescription: taskDescription || `Follow-up: ${activity.activityType}`,
      consentVerified: true, handoffType: "task",
      targetBoundary: "APP-012",
      idempotencyKey: idempotencyKey || null,
      createdAt: this.#now().toISOString(), createdBy: p.id
    });
    this.#taskHandoffs.set(handoff.id, handoff);
    if (idempotencyKey) this.#taskHandoffByKey.set(`${tenantId}:${idempotencyKey}`, handoff.id);

    const updated = freeze({ ...activity, status: "handed-off" });
    this.#activities.set(activityId, updated);
    this.#record(tenantId, activityId, "TaskHandoffCreated", p.id, { handoffId: handoff.id, taskDescription: handoff.taskDescription });
    return handoff;
  }

  // --- Communication Handoff ---

  createCommunicationHandoffAuthorized({ sessionToken, tenantId, activityId, channel, templateReference, consentGranted, idempotencyKey }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `followup:comm-handoff:create`);
    if (!consentGranted) throw new Error("Consent must be verified before communication handoff.");

    if (idempotencyKey) {
      const existing = this.#commHandoffByKey.get(`${tenantId}:${idempotencyKey}`);
      if (existing) return this.#commHandoffs.get(existing);
    }

    const activity = this.#activities.get(activityId);
    if (!activity || activity.tenantId !== tenantId) throw new Error("Activity not found.");
    if (activity.status !== "eligible") throw new Error("Activity must be eligible before handoff.");

    const handoff = freeze({
      id: randomUUID(), tenantId, activityId,
      channel: channel || "governed",
      templateReference: templateReference || null,
      consentVerified: true, handoffType: "communication",
      targetBoundary: "APP-006",
      idempotencyKey: idempotencyKey || null,
      createdAt: this.#now().toISOString(), createdBy: p.id
    });
    this.#commHandoffs.set(handoff.id, handoff);
    if (idempotencyKey) this.#commHandoffByKey.set(`${tenantId}:${idempotencyKey}`, handoff.id);

    const updated = freeze({ ...activity, status: "handed-off" });
    this.#activities.set(activityId, updated);
    this.#record(tenantId, activityId, "CommunicationHandoffCreated", p.id, { handoffId: handoff.id, channel: handoff.channel, targetBoundary: "APP-006" });
    return handoff;
  }

  recordHandoffOutcomeAuthorized({ sessionToken, tenantId, activityId, outcome, outcomeReference }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `followup:activity:${activityId}:outcome`);
    const activity = this.#activities.get(activityId);
    if (!activity || activity.tenantId !== tenantId) throw new Error("Activity not found.");
    if (activity.status !== "handed-off") throw new Error("Activity must be in handed-off state to record outcome.");
    if (outcome !== "completed" && outcome !== "failed") throw new Error("Outcome must be completed or failed.");

    const updated = freeze({ ...activity, status: outcome, reason: outcomeReference || null });
    this.#activities.set(activityId, updated);
    this.#record(tenantId, activityId, "HandoffOutcomeRecorded", p.id, { outcome, outcomeReference });
    return updated;
  }

  // --- Read ---

  getActivityAuthorized({ sessionToken, tenantId, activityId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `followup:activity:${activityId}`);
    const a = this.#activities.get(activityId);
    if (!a || a.tenantId !== tenantId) throw new Error("Activity not found.");
    return a;
  }

  listActivitiesAuthorized({ sessionToken, tenantId, customerId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `followup:activities:${customerId || "all"}`);
    const results = [];
    for (const a of this.#activities.values()) {
      if (a.tenantId !== tenantId) continue;
      if (customerId && a.customerId !== customerId) continue;
      results.push(a);
    }
    return freeze(results);
  }

  getHistoryAuthorized({ sessionToken, tenantId, subjectId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `followup:history:${subjectId}`);
    return freeze([...(this.#history.get(subjectId) || [])]);
  }

  // --- Forbidden scope ---

  deliverEmailAuthorized() { throw new Error("BP-014 does not deliver email directly."); }
  deliverSmsAuthorized() { throw new Error("BP-014 does not deliver SMS directly."); }
  createConsentAuthorized() { throw new Error("BP-014 does not create consent."); }
  publishReviewAuthorized() { throw new Error("BP-014 does not publish reviews."); }
  processPaymentAuthorized() { throw new Error("BP-014 does not process payments."); }
  generateReportAuthorized() { throw new Error("BP-014 does not generate reports."); }
}
