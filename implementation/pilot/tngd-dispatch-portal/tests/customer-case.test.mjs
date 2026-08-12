import assert from "node:assert/strict";
import test from "node:test";
import { CustomerCaseService } from "../src/customer/index.mjs";
import { GuidedIntakeService, PRIMARY_QUESTIONS } from "../src/intake/index.mjs";
import { AuditLog, SecureAccess } from "../src/security/index.mjs";

const TENANT_A = "tenant-tngd";
const TENANT_B = "tenant-other";
const PASSWORD = "correct horse battery staple";

async function setup() {
  const auditLog = new AuditLog();
  const secureAccess = new SecureAccess({ auditLog });
  await secureAccess.bootstrapTenantAdmin({ tenantId: TENANT_A, email: "owner@example.com", password: PASSWORD });
  await secureAccess.bootstrapTenantAdmin({ tenantId: TENANT_B, email: "other@example.com", password: PASSWORD });
  const admin = await secureAccess.authenticate({ tenantId: TENANT_A, email: "owner@example.com", password: PASSWORD });
  const other = await secureAccess.authenticate({ tenantId: TENANT_B, email: "other@example.com", password: PASSWORD });
  const guidedIntake = new GuidedIntakeService({ secureAccess, auditLog });
  const customerCases = new CustomerCaseService({ secureAccess, guidedIntake, auditLog });
  return { auditLog, secureAccess, guidedIntake, customerCases, admin, other };
}

function values({ email = "taylor@example.com", phone = "919-555-0100", name = "Taylor Customer" } = {}) {
  return [
    { name },
    { phone, email, preferredContact: "phone" },
    { address: "100 Main Street, Raleigh, NC" },
    { serviceSubtype: "no-cooling" },
    { description: "Customer description retained without re-entry." },
    { urgency: "this-week", safetyConcern: false },
    { equipmentDetails: "Door system and operator details" },
    { availability: "Weekday mornings", authorizedToProceed: true }
  ];
}

function completedIntake({ guidedIntake, token, tenantId = TENANT_A, overrides }) {
  const session = guidedIntake.startAuthorized({ sessionToken: token, tenantId, path: "repair", source: "phone" });
  for (const [index, question] of PRIMARY_QUESTIONS.entries()) {
    guidedIntake.answerAuthorized({
      sessionToken: token,
      tenantId,
      guidedSessionId: session.id,
      questionId: question.id,
      value: values(overrides)[index]
    });
  }
  return guidedIntake.completeAuthorized({ sessionToken: token, tenantId, guidedSessionId: session.id }).intakeRecord;
}

test("completed guided intake creates one governed customer, service case, timeline, and BP-005 handoff", async () => {
  const { guidedIntake, customerCases, admin, auditLog } = await setup();
  const intake = completedIntake({ guidedIntake, token: admin.token });
  const result = customerCases.convertAuthorized({ sessionToken: admin.token, tenantId: TENANT_A, intakeRecordId: intake.id });

  assert.equal(result.customer.tenantId, TENANT_A);
  assert.equal(result.serviceCase.customerId, result.customer.id);
  assert.equal(result.serviceCase.status, "ready-for-scheduling");
  assert.equal(result.timeline.entries.length, 1);
  assert.equal(result.intakeEvidence.originalEvidence.length, 8);
  assert.equal(result.handoff.targetPackage, "TNGD-BP-005");
  assert.equal(auditLog.verify(), true);
});

test("repeat conversion is idempotent and does not create duplicate cases", async () => {
  const { guidedIntake, customerCases, admin } = await setup();
  const intake = completedIntake({ guidedIntake, token: admin.token });
  const first = customerCases.convertAuthorized({ sessionToken: admin.token, tenantId: TENANT_A, intakeRecordId: intake.id });
  const second = customerCases.convertAuthorized({ sessionToken: admin.token, tenantId: TENANT_A, intakeRecordId: intake.id });
  assert.equal(second, first);
});

test("matching email or phone reuses the tenant customer while creating a new service case", async () => {
  const { guidedIntake, customerCases, admin } = await setup();
  const firstIntake = completedIntake({ guidedIntake, token: admin.token });
  const first = customerCases.convertAuthorized({ sessionToken: admin.token, tenantId: TENANT_A, intakeRecordId: firstIntake.id });
  const secondIntake = completedIntake({
    guidedIntake,
    token: admin.token,
    overrides: { email: "TAYLOR@example.com", phone: "(919) 555-0100" }
  });
  const second = customerCases.convertAuthorized({ sessionToken: admin.token, tenantId: TENANT_A, intakeRecordId: secondIntake.id });
  assert.equal(second.customer.id, first.customer.id);
  assert.equal(second.customerMatched, true);
  assert.notEqual(second.serviceCase.id, first.serviceCase.id);
});

test("tenant boundaries and customer permissions govern conversion and reads", async () => {
  const { guidedIntake, customerCases, secureAccess, admin, other } = await setup();
  const intake = completedIntake({ guidedIntake, token: admin.token });
  assert.throws(
    () => customerCases.convertAuthorized({ sessionToken: other.token, tenantId: TENANT_B, intakeRecordId: intake.id }),
    /completed BP-004-ready/
  );
  const technician = await secureAccess.createUser({
    actorSessionToken: admin.token,
    tenantId: TENANT_A,
    email: "tech@example.com",
    password: PASSWORD,
    roles: ["technician"]
  });
  const techSession = await secureAccess.authenticate({ tenantId: TENANT_A, email: technician.email, password: PASSWORD });
  assert.throws(
    () => customerCases.convertAuthorized({ sessionToken: techSession.token, tenantId: TENANT_A, intakeRecordId: intake.id }),
    /Access denied/
  );
});

test("intake evidence remains immutable and scheduling behavior is not implemented", async () => {
  const { guidedIntake, customerCases, admin } = await setup();
  const intake = completedIntake({ guidedIntake, token: admin.token });
  const result = customerCases.convertAuthorized({ sessionToken: admin.token, tenantId: TENANT_A, intakeRecordId: intake.id });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.intakeEvidence.originalEvidence), true);
  assert.equal("appointmentId" in result.serviceCase, false);
  assert.equal("scheduledAt" in result.serviceCase, false);
});
