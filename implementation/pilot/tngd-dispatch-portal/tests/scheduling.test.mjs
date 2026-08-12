import assert from "node:assert/strict";
import test from "node:test";
import { CustomerCaseService } from "../src/customer/index.mjs";
import { GuidedIntakeService, PRIMARY_QUESTIONS } from "../src/intake/index.mjs";
import { InMemoryCalendarGateway, SchedulingService } from "../src/scheduling/index.mjs";
import { AuditLog, SecureAccess } from "../src/security/index.mjs";

const TENANT = "tenant-tngd";
const PASSWORD = "correct horse battery staple";
const answers = [
  { name: "Taylor Customer" },
  { phone: "919-555-0100", email: "taylor@example.com", preferredContact: "phone" },
  { address: "100 Main Street" }, { serviceSubtype: "garage-door-repair" },
  { description: "Door will not close." }, { urgency: "this-week", safetyConcern: false },
  { equipmentDetails: "Sectional door" }, { availability: "Weekday mornings", authorizedToProceed: true }
];

async function setup() {
  const auditLog = new AuditLog();
  const secureAccess = new SecureAccess({ auditLog });
  await secureAccess.bootstrapTenantAdmin({ tenantId: TENANT, email: "owner@example.com", password: PASSWORD });
  const admin = await secureAccess.authenticate({ tenantId: TENANT, email: "owner@example.com", password: PASSWORD });
  const guidedIntake = new GuidedIntakeService({ secureAccess, auditLog });
  const customerCases = new CustomerCaseService({ secureAccess, guidedIntake, auditLog });
  const calendarGateway = new InMemoryCalendarGateway();
  const scheduling = new SchedulingService({ secureAccess, customerCaseService: customerCases, calendarGateway, auditLog });
  return { auditLog, secureAccess, guidedIntake, customerCases, scheduling, admin };
}

function serviceCase(context, suffix = "") {
  const session = context.guidedIntake.startAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, path: "repair", source: "phone" });
  for (const [index, question] of PRIMARY_QUESTIONS.entries()) {
    const value = structuredClone(answers[index]);
    if (question.id === "contactInformation" && suffix) {
      value.email = `taylor${suffix}@example.com`; value.phone = `91955501${suffix.padStart(2, "0")}`;
    }
    context.guidedIntake.answerAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, guidedSessionId: session.id, questionId: question.id, value });
  }
  const intake = context.guidedIntake.completeAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, guidedSessionId: session.id }).intakeRecord;
  return context.customerCases.convertAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, intakeRecordId: intake.id }).serviceCase;
}

test("a BP-004 Service Case creates one synchronized BP-006-ready appointment", async () => {
  const context = await setup();
  const item = serviceCase(context);
  const appointment = context.scheduling.scheduleAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, serviceCaseId: item.id, startsAt: "2026-08-15T13:00:00Z", endsAt: "2026-08-15T14:00:00Z" });
  assert.equal(appointment.status, "scheduled");
  assert.equal(appointment.calendar.provider, "approved-calendar-adapter");
  assert.equal(appointment.technicianAssignmentStatus, "ready-for-bp006");
  assert.equal(context.auditLog.verify(), true);
});

test("appointment creation is idempotent per tenant Service Case", async () => {
  const context = await setup(); const item = serviceCase(context);
  const input = { sessionToken: context.admin.token, tenantId: TENANT, serviceCaseId: item.id, startsAt: "2026-08-15T13:00:00Z", endsAt: "2026-08-15T14:00:00Z" };
  assert.equal(context.scheduling.scheduleAuthorized(input), context.scheduling.scheduleAuthorized(input));
});

test("overlapping tenant appointments are rejected", async () => {
  const context = await setup(); const first = serviceCase(context, "1"); const second = serviceCase(context, "2");
  context.scheduling.scheduleAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, serviceCaseId: first.id, startsAt: "2026-08-15T13:00:00Z", endsAt: "2026-08-15T14:00:00Z" });
  assert.throws(() => context.scheduling.scheduleAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, serviceCaseId: second.id, startsAt: "2026-08-15T13:30:00Z", endsAt: "2026-08-15T14:30:00Z" }), /conflicts/);
});

test("rescheduling updates the same calendar event with revision evidence", async () => {
  const context = await setup(); const item = serviceCase(context);
  const first = context.scheduling.scheduleAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, serviceCaseId: item.id, startsAt: "2026-08-15T13:00:00Z", endsAt: "2026-08-15T14:00:00Z" });
  const next = context.scheduling.rescheduleAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, appointmentId: first.id, startsAt: "2026-08-16T13:00:00Z", endsAt: "2026-08-16T14:00:00Z", reason: "Customer request" });
  assert.equal(next.id, first.id); assert.equal(next.revision, 2); assert.equal(next.calendar.externalEventId, first.calendar.externalEventId);
});

test("technicians cannot schedule and BP-006 dispatch is not implemented", async () => {
  const context = await setup(); const item = serviceCase(context);
  const tech = await context.secureAccess.createUser({ actorSessionToken: context.admin.token, tenantId: TENANT, email: "tech@example.com", password: PASSWORD, roles: ["technician"] });
  const session = await context.secureAccess.authenticate({ tenantId: TENANT, email: tech.email, password: PASSWORD });
  assert.throws(() => context.scheduling.scheduleAuthorized({ sessionToken: session.token, tenantId: TENANT, serviceCaseId: item.id, startsAt: "2026-08-15T13:00:00Z", endsAt: "2026-08-15T14:00:00Z" }), /Access denied/);
  const appointment = context.scheduling.scheduleAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, serviceCaseId: item.id, startsAt: "2026-08-15T13:00:00Z", endsAt: "2026-08-15T14:00:00Z" });
  assert.equal("technicianId" in appointment, false); assert.equal("route" in appointment, false);
});
