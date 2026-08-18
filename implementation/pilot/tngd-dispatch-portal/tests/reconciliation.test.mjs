import assert from "node:assert/strict";
import test from "node:test";
import { ReconciliationService } from "../src/administration/index.mjs";
import { AuditLog, SecureAccess } from "../src/security/index.mjs";

const T = "tenant-tngd", P = "correct horse battery staple";

async function setup() {
  const auditLog = new AuditLog();
  const secureAccess = new SecureAccess({ auditLog });
  await secureAccess.bootstrapTenantAdmin({ tenantId: T, email: "owner@example.com", password: P });
  const owner = await secureAccess.authenticate({ tenantId: T, email: "owner@example.com", password: P });
  const coordinator = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: T, email: "coordinator@example.com", password: P, roles: ["admin_dispatch"] });
  const mgr = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: T, email: "manager@example.com", password: P, roles: ["manager"] });
  const tech = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: T, email: "tech@example.com", password: P, roles: ["technician"] });
  const exec = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: T, email: "exec@example.com", password: P, roles: ["executive"] });
  const sessions = {
    owner,
    coordinator: await secureAccess.authenticate({ tenantId: T, email: coordinator.email, password: P }),
    manager: await secureAccess.authenticate({ tenantId: T, email: mgr.email, password: P }),
    tech: await secureAccess.authenticate({ tenantId: T, email: tech.email, password: P }),
    exec: await secureAccess.authenticate({ tenantId: T, email: exec.email, password: P })
  };
  const service = new ReconciliationService({ secureAccess, auditLog });
  return { auditLog, secureAccess, sessions, service };
}

function queue(c, key = "review-1") {
  return c.service.queueForReviewAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    serviceCaseId: "case-1",
    invoiceId: "invoice-1",
    idempotencyKey: key
  });
}

function begin(c, reviewId) {
  return c.service.beginReviewAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId
  });
}

function createException(c, reviewId, opts = {}) {
  return c.service.createExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId,
    category: opts.category || "payment",
    type: opts.type || "Payment discrepancy",
    detail: opts.detail || "Square transaction does not match MASS invoice total",
    priority: opts.priority || "high",
    ...opts
  });
}

test("tenant-safe completion review queues work and deduplicates with idempotency key", async () => {
  const c = await setup();
  const a = queue(c);
  const b = queue(c);
  assert.equal(a, b);
  assert.equal(a.status, "pending");
  assert.equal(a.tenantId, T);
  assert.equal(a.serviceCaseId, "case-1");
  assert.equal(a.invoiceId, "invoice-1");
  assert.equal(a.checklist.fieldEvidence.status, "unchecked");
  assert.equal(a.exceptionIds.length, 0);
});

test("evidence checks track verification status across all upstream categories", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  const categories = [
    "fieldEvidence", "estimateEvidence", "authorizationEvidence",
    "invoiceEvidence", "paymentEvidence", "dispatchEvidence"
  ];
  let current = review;
  for (const cat of categories) {
    current = c.service.checkEvidenceAuthorized({
      sessionToken: c.sessions.coordinator.token,
      tenantId: T,
      reviewId: current.id,
      category: cat,
      referenceId: `ref-${cat}`,
      status: "verified"
    });
    assert.equal(current.checklist[cat].status, "verified");
  }
  const missing = c.service.checkEvidenceAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId: current.id,
    category: "paymentEvidence",
    referenceId: "ref-payment-2",
    status: "missing"
  });
  assert.equal(missing.checklist.paymentEvidence.status, "missing");
});

test("exception creation requires category, type, detail and transitions review to exceptions-open", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  assert.throws(() => c.service.createExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId: review.id,
    category: "invalid",
    type: "test",
    detail: "test"
  }), /category/);
  assert.throws(() => c.service.createExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId: review.id,
    category: "payment",
    type: "",
    detail: "test"
  }), /type and detail/);
  const exception = createException(c, review.id);
  assert.equal(exception.category, "payment");
  assert.equal(exception.priority, "high");
  assert.equal(exception.status, "open");
  const updated = c.service.getReviewAuthorized({
    sessionToken: c.sessions.exec.token,
    tenantId: T,
    reviewId: review.id
  });
  assert.equal(updated.status, "exceptions-open");
  assert.ok(updated.exceptionIds.includes(exception.id));
});

test("exception assignment enforces accountable role ownership", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  const exception = createException(c, review.id, { category: "dispatch" });
  assert.throws(() => c.service.assignExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    assignedRole: "",
    assignedTo: "user-1"
  }), /role and person/);
  const result = c.service.assignExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    assignedRole: "Dispatch Administrator",
    assignedTo: "dispatch-admin-1"
  });
  assert.equal(result.exception.status, "assigned");
  assert.equal(result.assignment.assignedRole, "Dispatch Administrator");
});

test("self-approval prevention blocks exception creator from resolving their own exception", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  const exception = createException(c, review.id);
  c.service.assignExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    assignedRole: "Finance Steward",
    assignedTo: "finance-1"
  });
  assert.throws(() => c.service.resolveExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    resolution: "Resolved after Square confirmation",
    reason: "Square confirmed payment cleared"
  }), /creator cannot approve/);
  const result = c.service.resolveExceptionAuthorized({
    sessionToken: c.sessions.manager.token,
    tenantId: T,
    exceptionId: exception.id,
    resolution: "Resolved after Square confirmation",
    reason: "Square confirmed payment cleared"
  });
  assert.equal(result.exception.status, "resolved");
  assert.equal(result.decision.immutable, true);
});

test("escalation records are immutable and require target and reason", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  const exception = createException(c, review.id);
  c.service.assignExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    assignedRole: "Finance Steward",
    assignedTo: "finance-1"
  });
  assert.throws(() => c.service.escalateExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    escalatedTo: "",
    reason: "test"
  }), /target and reason/);
  const result = c.service.escalateExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    escalatedTo: "Manager",
    reason: "Unresolved after 48 hours"
  });
  assert.equal(result.exception.status, "escalated");
  assert.equal(result.escalation.immutable, true);
  assert.throws(() => { result.escalation.reason = "changed"; }, TypeError);
});

test("resolution requires evidence and reason with immutable decision record", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  const exception = createException(c, review.id);
  c.service.assignExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    assignedRole: "Finance Steward",
    assignedTo: "finance-1"
  });
  assert.throws(() => c.service.resolveExceptionAuthorized({
    sessionToken: c.sessions.manager.token,
    tenantId: T,
    exceptionId: exception.id,
    resolution: "Resolved",
    reason: ""
  }), /reason/);
  const result = c.service.resolveExceptionAuthorized({
    sessionToken: c.sessions.manager.token,
    tenantId: T,
    exceptionId: exception.id,
    resolution: "Payment confirmed in Square dashboard",
    evidenceReferences: [{ sourceType: "square-transaction", sourceId: "txn-1" }],
    reason: "Verified payment receipt matches invoice total"
  });
  assert.equal(result.decision.immutable, true);
  assert.equal(result.decision.evidenceReferences[0].sourceType, "square-transaction");
  assert.throws(() => { result.decision.resolution = "changed"; }, TypeError);
});

test("reopen creates a new immutable decision and allows reassignment", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  const exception = createException(c, review.id);
  c.service.assignExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    assignedRole: "Finance Steward",
    assignedTo: "finance-1"
  });
  c.service.resolveExceptionAuthorized({
    sessionToken: c.sessions.manager.token,
    tenantId: T,
    exceptionId: exception.id,
    resolution: "Resolved",
    reason: "Initial resolution"
  });
  const reopened = c.service.reopenExceptionAuthorized({
    sessionToken: c.sessions.manager.token,
    tenantId: T,
    exceptionId: exception.id,
    reason: "Customer disputed the resolution"
  });
  assert.equal(reopened.exception.status, "reopened");
  assert.equal(reopened.decision.immutable, true);
  const reassigned = c.service.assignExceptionAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    exceptionId: exception.id,
    assignedRole: "Manager",
    assignedTo: "mgr-1"
  });
  assert.equal(reassigned.exception.status, "assigned");
  const history = c.service.exceptionHistoryAuthorized({
    sessionToken: c.sessions.manager.token,
    tenantId: T,
    exceptionId: exception.id
  });
  assert.equal(history.resolutions.length, 2);
  assert.equal(history.assignments.length, 2);
});

test("completion blocked while blocking exceptions remain unresolved", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  createException(c, review.id);
  assert.throws(() => c.service.completeReviewAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId: review.id
  }), /unresolved exceptions/);
});

test("outstanding view shows unresolved reviews and exceptions with age", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  createException(c, review.id);
  const outstanding = c.service.outstandingAuthorized({
    sessionToken: c.sessions.exec.token,
    tenantId: T
  });
  assert.ok(outstanding.unresolvedReviews.length > 0);
  assert.ok(outstanding.unresolvedExceptions.length > 0);
  assert.ok(typeof outstanding.unresolvedReviews[0].ageMs === "number");
  assert.ok(typeof outstanding.unresolvedExceptions[0].ageMs === "number");
  assert.equal(outstanding.unresolvedExceptions[0].category, "payment");
  assert.equal(outstanding.unresolvedExceptions[0].priority, "high");
});

test("BP-013 and BP-014 handoffs distinguish warranty and follow-up outcomes", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  const warranty = c.service.createHandoffAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId: review.id,
    targetPackage: "TNGD-BP-013",
    category: "warranty",
    referenceId: "warranty-claim-1"
  });
  assert.equal(warranty.targetPackage, "TNGD-BP-013");
  assert.equal(warranty.category, "warranty");
  const followUp = c.service.createHandoffAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId: review.id,
    targetPackage: "TNGD-BP-014",
    category: "follow-up",
    referenceId: "follow-up-1"
  });
  assert.equal(followUp.targetPackage, "TNGD-BP-014");
  assert.equal(followUp.category, "follow-up");
  assert.throws(() => c.service.createHandoffAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId: review.id,
    targetPackage: "TNGD-BP-015",
    category: "warranty",
    referenceId: "bad"
  }), /BP-013 or BP-014/);
});

test("reconciliation differences and immutable history preserve audit chain", async () => {
  const c = await setup();
  const review = begin(c, queue(c).id);
  const diff = c.service.recordDifferenceAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: T,
    reviewId: review.id,
    field: "totalCents",
    massValue: "47000",
    externalValue: "46500",
    provider: "square"
  });
  assert.equal(diff.field, "totalCents");
  assert.equal(diff.provider, "square");
  const history = c.service.historyAuthorized({
    sessionToken: c.sessions.manager.token,
    tenantId: T,
    reviewId: review.id
  });
  assert.ok(history.length >= 3);
  assert.ok(history.some(e => e.type === "ReconciliationDifferenceRecorded"));
  assert.equal(c.auditLog.verify(), true);
});

test("tenant isolation and role boundaries remain intact through BP-011", async () => {
  const c = await setup();
  const review = queue(c);
  assert.throws(() => c.service.getReviewAuthorized({
    sessionToken: c.sessions.tech.token,
    tenantId: T,
    reviewId: review.id
  }), /permission/);
  assert.throws(() => c.service.getReviewAuthorized({
    sessionToken: c.sessions.coordinator.token,
    tenantId: "other-tenant",
    reviewId: review.id
  }), /tenant/);
  assert.throws(() => c.service.queueForReviewAuthorized({
    sessionToken: c.sessions.tech.token,
    tenantId: T,
    serviceCaseId: "case-2",
    invoiceId: "invoice-2",
    idempotencyKey: "key-2"
  }), /permission/);
  for (const n of ["processPaymentAuthorized", "adjudicateWarrantyAuthorized", "deliverFollowUpAuthorized", "autonomousResolveAuthorized"])
    assert.equal(typeof c.service[n], "undefined");
});
