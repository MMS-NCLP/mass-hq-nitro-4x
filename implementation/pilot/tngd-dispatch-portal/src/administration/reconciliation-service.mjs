import { randomUUID } from "node:crypto";

const freeze = (v) => {
  if (!v || typeof v !== "object" || Object.isFrozen(v)) return v;
  Object.freeze(v);
  for (const x of Object.values(v)) freeze(x);
  return v;
};

const EXCEPTION_CATEGORIES = Object.freeze([
  "callback", "parts", "estimate", "payment", "warranty",
  "follow-up", "field", "dispatch", "authorization", "reconciliation"
]);
const EXCEPTION_PRIORITIES = Object.freeze(["low", "medium", "high", "critical"]);
const HANDOFF_CATEGORIES = Object.freeze(["warranty", "follow-up", "callback", "parts"]);
const EVIDENCE_CATEGORIES = Object.freeze([
  "fieldEvidence", "estimateEvidence", "authorizationEvidence",
  "invoiceEvidence", "paymentEvidence", "dispatchEvidence"
]);
const EVIDENCE_STATUSES = Object.freeze(["verified", "missing", "conflicting", "failed"]);

export class ReconciliationService {
  #reviews = new Map();
  #byKey = new Map();
  #exceptions = new Map();
  #assignments = new Map();
  #escalations = new Map();
  #resolutions = new Map();
  #differences = new Map();
  #handoffs = new Map();
  #history = new Map();
  #secure;
  #audit;
  #now;

  constructor({ secureAccess, auditLog, now = () => new Date() } = {}) {
    if (!secureAccess || !auditLog)
      throw new Error("BP-012 requires security and audit contracts.");
    this.#secure = secureAccess;
    this.#audit = auditLog;
    this.#now = now;
  }

  queueForReviewAuthorized({ sessionToken, tenantId, serviceCaseId, invoiceId, idempotencyKey }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `reconciliation:${serviceCaseId}:queue`);
    if (!String(idempotencyKey || "").trim() || !String(serviceCaseId || "").trim() || !String(invoiceId || "").trim())
      throw new Error("Service case, invoice, and idempotency key are required.");
    const key = `${tenantId}:${idempotencyKey}`;
    if (this.#byKey.has(key)) return this.#reviews.get(this.#byKey.get(key));

    const checklist = freeze({
      id: randomUUID(),
      fieldEvidence: { status: "unchecked" },
      estimateEvidence: { status: "unchecked" },
      authorizationEvidence: { status: "unchecked" },
      invoiceEvidence: { status: "unchecked" },
      paymentEvidence: { status: "unchecked" },
      dispatchEvidence: { status: "unchecked" }
    });

    const review = freeze({
      id: randomUUID(),
      tenantId,
      serviceCaseId,
      invoiceId,
      status: "pending",
      checklist,
      exceptionIds: [],
      differenceIds: [],
      handoffIds: [],
      createdBy: p.id,
      createdAt: this.#now().toISOString(),
      completedAt: null,
      revision: 1
    });

    this.#reviews.set(review.id, review);
    this.#byKey.set(key, review.id);
    this.#record(review, p.id, "CompletionReviewQueued", { serviceCaseId, invoiceId });
    return review;
  }

  beginReviewAuthorized({ sessionToken, tenantId, reviewId }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `reconciliation:${reviewId}:begin`);
    const review = this.#review(tenantId, reviewId);
    if (review.status === "in-review") return review;
    if (review.status !== "pending")
      throw new Error("Only pending reviews can be started.");
    return this.#replace(review, { status: "in-review" }, p.id, "CompletionReviewStarted");
  }

  checkEvidenceAuthorized({ sessionToken, tenantId, reviewId, category, referenceId, status }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `reconciliation:${reviewId}:check`);
    const review = this.#review(tenantId, reviewId);
    if (!["in-review", "exceptions-open"].includes(review.status))
      throw new Error("Review must be active.");
    if (!EVIDENCE_CATEGORIES.includes(category))
      throw new Error("Evidence category is not recognized.");
    if (!EVIDENCE_STATUSES.includes(status))
      throw new Error("Evidence status must be verified, missing, conflicting, or failed.");

    const checklist = {
      ...review.checklist,
      id: review.checklist.id,
      [category]: freeze({
        status,
        referenceId: referenceId || null,
        checkedBy: p.id,
        checkedAt: this.#now().toISOString()
      })
    };

    return this.#replace(review, { checklist: freeze(checklist) }, p.id,
      "EvidenceChecked", { category, status });
  }

  createExceptionAuthorized({
    sessionToken, tenantId, reviewId, category, type, detail,
    priority = "medium", dueDate, evidenceReferences = []
  }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `reconciliation:${reviewId}:exception`);
    const review = this.#review(tenantId, reviewId);
    if (!["in-review", "exceptions-open"].includes(review.status))
      throw new Error("Review must be active to create exceptions.");
    if (!EXCEPTION_CATEGORIES.includes(category))
      throw new Error("Exception category is not recognized.");
    if (!String(type || "").trim() || !String(detail || "").trim())
      throw new Error("Exception type and detail are required.");
    if (!EXCEPTION_PRIORITIES.includes(priority))
      throw new Error("Exception priority must be low, medium, high, or critical.");

    const refs = evidenceReferences.map(ref => freeze({
      id: randomUUID(),
      sourceType: String(ref.sourceType || "").trim(),
      sourceId: String(ref.sourceId || "").trim(),
      tenantId
    }));

    const exception = freeze({
      id: randomUUID(),
      tenantId,
      reviewId,
      category,
      type: String(type).trim(),
      detail: String(detail).trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      status: "open",
      evidenceReferences: refs,
      createdBy: p.id,
      createdAt: this.#now().toISOString(),
      revision: 1
    });

    this.#exceptions.set(exception.id, exception);
    this.#replace(review, {
      status: "exceptions-open",
      exceptionIds: [...review.exceptionIds, exception.id]
    }, p.id, "OperationalExceptionCreated", {
      exceptionId: exception.id, category, priority
    });

    return exception;
  }

  assignExceptionAuthorized({ sessionToken, tenantId, exceptionId, assignedRole, assignedTo }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `exception:${exceptionId}:assign`);
    const exception = this.#exception(tenantId, exceptionId);
    if (!["open", "returned", "reopened"].includes(exception.status))
      throw new Error("Exception is not assignable in current status.");
    if (!String(assignedRole || "").trim() || !String(assignedTo || "").trim())
      throw new Error("Assigned role and person are required.");

    const assignment = freeze({
      id: randomUUID(),
      exceptionId,
      assignedRole: String(assignedRole).trim(),
      assignedTo: String(assignedTo).trim(),
      assignedBy: p.id,
      assignedAt: this.#now().toISOString()
    });

    const assignments = [...(this.#assignments.get(exceptionId) || []), assignment];
    this.#assignments.set(exceptionId, assignments);

    return {
      exception: this.#replaceException(exception, { status: "assigned" }, p.id,
        "ExceptionAssigned", { assignmentId: assignment.id, assignedRole, assignedTo }),
      assignment
    };
  }

  returnExceptionAuthorized({ sessionToken, tenantId, exceptionId, reason }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `exception:${exceptionId}:return`);
    const exception = this.#exception(tenantId, exceptionId);
    if (exception.status !== "assigned")
      throw new Error("Only assigned exceptions can be returned.");
    if (!String(reason || "").trim())
      throw new Error("Return requires a reason.");

    return this.#replaceException(exception, { status: "returned" }, p.id,
      "ExceptionReturned", { reason });
  }

  escalateExceptionAuthorized({ sessionToken, tenantId, exceptionId, escalatedTo, reason }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `exception:${exceptionId}:escalate`);
    const exception = this.#exception(tenantId, exceptionId);
    if (!["assigned", "returned"].includes(exception.status))
      throw new Error("Exception cannot be escalated in current status.");
    if (!String(escalatedTo || "").trim() || !String(reason || "").trim())
      throw new Error("Escalation target and reason are required.");

    const record = freeze({
      id: randomUUID(),
      exceptionId,
      escalatedTo: String(escalatedTo).trim(),
      reason: String(reason).trim(),
      escalatedBy: p.id,
      escalatedAt: this.#now().toISOString(),
      immutable: true
    });

    const escalations = [...(this.#escalations.get(exceptionId) || []), record];
    this.#escalations.set(exceptionId, escalations);

    return {
      exception: this.#replaceException(exception, { status: "escalated" }, p.id,
        "ExceptionEscalated", { escalationId: record.id, escalatedTo }),
      escalation: record
    };
  }

  resolveExceptionAuthorized({ sessionToken, tenantId, exceptionId, resolution, evidenceReferences = [], reason }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `exception:${exceptionId}:resolve`);
    const exception = this.#exception(tenantId, exceptionId);
    if (!["assigned", "escalated", "reopened"].includes(exception.status))
      throw new Error("Exception cannot be resolved in current status.");
    if (!String(resolution || "").trim() || !String(reason || "").trim())
      throw new Error("Resolution and reason are required.");
    if (p.id === exception.createdBy)
      throw new Error("The exception creator cannot approve their own resolution.");

    const decision = freeze({
      id: randomUUID(),
      exceptionId,
      resolution: String(resolution).trim(),
      evidenceReferences: evidenceReferences.map(ref => freeze({
        sourceType: String(ref.sourceType || ""),
        sourceId: String(ref.sourceId || "")
      })),
      reason: String(reason).trim(),
      resolvedBy: p.id,
      resolvedAt: this.#now().toISOString(),
      immutable: true
    });

    const decisions = [...(this.#resolutions.get(exceptionId) || []), decision];
    this.#resolutions.set(exceptionId, decisions);

    return {
      exception: this.#replaceException(exception, { status: "resolved" }, p.id,
        "ExceptionResolved", { decisionId: decision.id }),
      decision
    };
  }

  reopenExceptionAuthorized({ sessionToken, tenantId, exceptionId, reason }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `exception:${exceptionId}:reopen`);
    const exception = this.#exception(tenantId, exceptionId);
    if (exception.status !== "resolved")
      throw new Error("Only resolved exceptions can be reopened.");
    if (!String(reason || "").trim())
      throw new Error("Reopen requires a reason.");

    const decision = freeze({
      id: randomUUID(),
      exceptionId,
      resolution: "reopened",
      reason: String(reason).trim(),
      reopenedBy: p.id,
      reopenedAt: this.#now().toISOString(),
      immutable: true
    });

    const decisions = [...(this.#resolutions.get(exceptionId) || []), decision];
    this.#resolutions.set(exceptionId, decisions);

    return {
      exception: this.#replaceException(exception, { status: "reopened" }, p.id,
        "ExceptionReopened", { decisionId: decision.id, reason }),
      decision
    };
  }

  completeReviewAuthorized({ sessionToken, tenantId, reviewId }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `reconciliation:${reviewId}:complete`);
    const review = this.#review(tenantId, reviewId);
    if (review.status === "completed") return review;
    if (!["in-review", "exceptions-open"].includes(review.status))
      throw new Error("Review cannot be completed in current status.");

    const unresolved = review.exceptionIds
      .map(id => this.#exceptions.get(id))
      .filter(e => e && e.status !== "resolved");
    if (unresolved.length)
      throw new Error("Completion blocked by unresolved exceptions.");

    return this.#replace(review, {
      status: "completed",
      completedAt: this.#now().toISOString()
    }, p.id, "CompletionReviewCompleted");
  }

  outstandingAuthorized({ sessionToken, tenantId }) {
    this.#permit(sessionToken, tenantId, "operations.read",
      "reconciliation:outstanding");
    const now = this.#now();
    const reviews = [...this.#reviews.values()]
      .filter(r => r.tenantId === tenantId && r.status !== "completed");
    const exceptions = [...this.#exceptions.values()]
      .filter(e => e.tenantId === tenantId && e.status !== "resolved");
    return freeze({
      unresolvedReviews: reviews.map(r => ({
        reviewId: r.id,
        serviceCaseId: r.serviceCaseId,
        status: r.status,
        createdAt: r.createdAt,
        ageMs: now.getTime() - new Date(r.createdAt).getTime()
      })),
      unresolvedExceptions: exceptions.map(e => ({
        exceptionId: e.id,
        reviewId: e.reviewId,
        category: e.category,
        priority: e.priority,
        status: e.status,
        createdAt: e.createdAt,
        ageMs: now.getTime() - new Date(e.createdAt).getTime()
      }))
    });
  }

  recordDifferenceAuthorized({ sessionToken, tenantId, reviewId, field, massValue, externalValue, provider }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `reconciliation:${reviewId}:difference`);
    const review = this.#review(tenantId, reviewId);
    if (!["in-review", "exceptions-open"].includes(review.status))
      throw new Error("Review must be active to record differences.");
    if (!String(field || "").trim())
      throw new Error("Difference field is required.");

    const difference = freeze({
      id: randomUUID(),
      reviewId,
      tenantId,
      field: String(field).trim(),
      massValue: String(massValue ?? ""),
      externalValue: String(externalValue ?? ""),
      provider: String(provider || "square"),
      recordedBy: p.id,
      recordedAt: this.#now().toISOString()
    });

    this.#differences.set(difference.id, difference);
    this.#replace(review, {
      differenceIds: [...review.differenceIds, difference.id]
    }, p.id, "ReconciliationDifferenceRecorded", {
      differenceId: difference.id, field
    });
    return difference;
  }

  createHandoffAuthorized({ sessionToken, tenantId, reviewId, targetPackage, category, referenceId }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage",
      `reconciliation:${reviewId}:handoff`);
    const review = this.#review(tenantId, reviewId);
    if (!["TNGD-BP-013", "TNGD-BP-014"].includes(targetPackage))
      throw new Error("Handoff must target BP-013 or BP-014.");
    if (!HANDOFF_CATEGORIES.includes(category))
      throw new Error("Handoff category must be warranty, follow-up, callback, or parts.");

    const handoff = freeze({
      id: randomUUID(),
      reviewId,
      tenantId,
      targetPackage,
      category,
      referenceId: String(referenceId || "").trim(),
      serviceCaseId: review.serviceCaseId,
      createdBy: p.id,
      createdAt: this.#now().toISOString()
    });

    this.#handoffs.set(handoff.id, handoff);
    this.#replace(review, {
      handoffIds: [...review.handoffIds, handoff.id]
    }, p.id, "ReconciliationHandoffCreated", {
      handoffId: handoff.id, targetPackage, category
    });

    return handoff;
  }

  getReviewAuthorized({ sessionToken, tenantId, reviewId }) {
    this.#permit(sessionToken, tenantId, "operations.read",
      `reconciliation:${reviewId}`);
    return this.#review(tenantId, reviewId);
  }

  listReviewsAuthorized({ sessionToken, tenantId }) {
    this.#permit(sessionToken, tenantId, "operations.read", "reconciliation:list");
    return freeze([...this.#reviews.values()].filter(r => r.tenantId === tenantId));
  }

  getExceptionAuthorized({ sessionToken, tenantId, exceptionId }) {
    this.#permit(sessionToken, tenantId, "operations.read",
      `exception:${exceptionId}`);
    return this.#exception(tenantId, exceptionId);
  }

  listExceptionsAuthorized({ sessionToken, tenantId }) {
    this.#permit(sessionToken, tenantId, "operations.read", "exceptions:list");
    return freeze([...this.#exceptions.values()].filter(e => e.tenantId === tenantId));
  }

  exceptionHistoryAuthorized({ sessionToken, tenantId, exceptionId }) {
    this.#permit(sessionToken, tenantId, "operations.read",
      `exception:${exceptionId}:history`);
    this.#exception(tenantId, exceptionId);
    return freeze({
      assignments: [...(this.#assignments.get(exceptionId) || [])],
      escalations: [...(this.#escalations.get(exceptionId) || [])],
      resolutions: [...(this.#resolutions.get(exceptionId) || [])]
    });
  }

  historyAuthorized({ sessionToken, tenantId, reviewId }) {
    this.#permit(sessionToken, tenantId, "operations.read",
      `reconciliation:${reviewId}:history`);
    this.#review(tenantId, reviewId);
    return freeze([...(this.#history.get(reviewId) || [])]);
  }

  #permit(token, tenantId, permission, resourceId) {
    return this.#secure.requirePermission({ sessionToken: token, tenantId, permission, resourceId });
  }

  #review(tenantId, id) {
    const review = this.#reviews.get(id);
    if (!review || review.tenantId !== tenantId)
      throw new Error("Completion review not found for tenant.");
    return review;
  }

  #exception(tenantId, id) {
    const exception = this.#exceptions.get(id);
    if (!exception || exception.tenantId !== tenantId)
      throw new Error("Operational exception not found for tenant.");
    return exception;
  }

  #replace(review, changes, actorId, type, metadata = {}) {
    const next = freeze({ ...review, ...changes, revision: review.revision + 1, updatedAt: this.#now().toISOString() });
    this.#reviews.set(review.id, next);
    this.#record(next, actorId, type, metadata);
    return next;
  }

  #replaceException(exception, changes, actorId, type, metadata = {}) {
    const next = freeze({ ...exception, ...changes, revision: exception.revision + 1, updatedAt: this.#now().toISOString() });
    this.#exceptions.set(exception.id, next);
    const review = this.#reviews.get(exception.reviewId);
    if (review) this.#record(review, actorId, type, { exceptionId: exception.id, ...metadata });
    return next;
  }

  #record(review, actorId, type, metadata = {}) {
    const event = freeze({ id: randomUUID(), type, actorId, occurredAt: this.#now().toISOString(), metadata: structuredClone(metadata) });
    this.#history.set(review.id, [...(this.#history.get(review.id) || []), event]);
    this.#audit.append({ tenantId: review.tenantId, principalId: actorId, type, resource: `reconciliation:${review.id}`, action: "operations.reconciliation", outcome: "granted", metadata: event.metadata });
    return event;
  }
}
