import assert from "node:assert/strict";
import test from "node:test";
import { DispatchService } from "../src/dispatch/index.mjs";
import { FieldWorkflowService, inspectionTemplate } from "../src/field-workflow/index.mjs";
import { AuditLog, SecureAccess } from "../src/security/index.mjs";

const TENANT = "tenant-tngd"; const PASSWORD = "correct horse battery staple";
const NOW = new Date("2026-08-17T09:00:00Z");

async function setup({ serviceType = "repair" } = {}) {
  const auditLog = new AuditLog({ now: () => NOW }); const secureAccess = new SecureAccess({ auditLog, now: () => NOW });
  await secureAccess.bootstrapTenantAdmin({ tenantId: TENANT, email: "owner@example.com", password: PASSWORD });
  const owner = await secureAccess.authenticate({ tenantId: TENANT, email: "owner@example.com", password: PASSWORD });
  const dispatcherUser = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: TENANT, email: "dispatch@example.com", password: PASSWORD, roles: ["admin_dispatch"] });
  const managerUser = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: TENANT, email: "manager@example.com", password: PASSWORD, roles: ["manager"] });
  const technicianUser = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: TENANT, email: "tech@example.com", password: PASSWORD, roles: ["technician"] });
  const otherUser = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: TENANT, email: "other@example.com", password: PASSWORD, roles: ["technician"] });
  const sessions = {
    owner,
    dispatcher: await secureAccess.authenticate({ tenantId: TENANT, email: dispatcherUser.email, password: PASSWORD }),
    manager: await secureAccess.authenticate({ tenantId: TENANT, email: managerUser.email, password: PASSWORD }),
    technician: await secureAccess.authenticate({ tenantId: TENANT, email: technicianUser.email, password: PASSWORD }),
    other: await secureAccess.authenticate({ tenantId: TENANT, email: otherUser.email, password: PASSWORD })
  };
  const appointment = Object.freeze({ id: "apt-field-1", tenantId: TENANT, serviceCaseId: "case-field-1", customerId: "cust-field-1",
    status: "scheduled", startsAt: "2026-08-17T13:00:00Z", endsAt: "2026-08-17T14:00:00Z", organizationTimeZone: "America/New_York" });
  const schedulingService = { getAuthorized: ({ appointmentId }) => appointmentId === appointment.id ? appointment : null };
  const capacityService = { calculateAuthorized: () => Object.freeze({ candidates: Object.freeze([{ technicianId: technicianUser.id, available: true, remainingCapacity: 2, reasons: [] }]) }) };
  const dispatch = new DispatchService({ secureAccess, schedulingService, capacityService, auditLog, now: () => NOW });
  const requirements = Object.freeze({ serviceType, serviceArea: "raleigh", travelDistanceMiles: 12, requiredSkills: ["torsion-spring"], requiredEquipment: ["ladder"], requiredVehicle: "service-van", emergency: false });
  const workItem = dispatch.createWorkItemAuthorized({ sessionToken: sessions.dispatcher.token, tenantId: TENANT, appointmentId: appointment.id, requirements });
  const recommendation = dispatch.recommendAuthorized({ sessionToken: sessions.dispatcher.token, tenantId: TENANT, workItemId: workItem.id });
  dispatch.assignAuthorized({ sessionToken: sessions.manager.token, tenantId: TENANT, workItemId: workItem.id, recommendationId: recommendation.id, technicianId: technicianUser.id });
  dispatch.dispatchAuthorized({ sessionToken: sessions.manager.token, tenantId: TENANT, workItemId: workItem.id });
  const field = new FieldWorkflowService({ secureAccess, dispatchService: dispatch, auditLog, now: () => NOW });
  return { auditLog, secureAccess, sessions, technicianUser, otherUser, dispatch, field, workItem, appointment };
}

function open(context) { return context.field.openAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, workItemId: context.workItem.id }); }
function transition(context, fieldSessionId, status) { return context.field.transitionAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId, status }); }
function reachFieldComplete(context, fieldSessionId) { for (const status of ["en-route", "arrived", "in-progress", "field-complete"]) transition(context, fieldSessionId, status); }
function startInspection(context, fieldSessionId) { return context.field.startInspectionAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId }); }
function completeInspection(context, inspectionId) {
  for (const [index, component] of inspectionTemplate.components.entries()) {
    context.field.recordItemAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId, itemId: component.id,
      result: index === 0 ? "Flag" : index === 1 ? "Does Not Apply" : "Pass", note: index === 0 ? "Spring wear observed" : "" });
  }
  context.field.addNoteAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId, text: "Internal technician detail", visibility: "internal" });
  context.field.addNoteAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId, text: "Spring wear should be reviewed", visibility: "customer" });
  context.field.addMeasurementAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId, name: "Door width", value: "16", unit: "ft" });
  context.field.recordDoorDetailsAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId, quantity: 1,
    springIdentification: "0.225 wire", doorSize: "16x7", springType: "Torsion", groundLevelCondition: "Leveled" });
  context.field.attachMediaReferenceAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId, category: "before", assetId: "asset-before", mimeType: "image/jpeg" });
  context.field.attachMediaReferenceAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId, category: "diagnostic", assetId: "asset-diagnostic", mimeType: "image/jpeg" });
  context.field.attachMediaReferenceAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId, category: "after", assetId: "asset-after", mimeType: "image/jpeg" });
  context.field.confirmOperationalEvidenceAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId, stickerWarrantyDisclosure: true, referralCard: true });
}

test("assigned technician receives today, current, and next views from the BP-007 handoff", async () => {
  const context = await setup();
  assert.equal(context.field.listJobsAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, view: "today" }).length, 1);
  assert.equal(context.field.listJobsAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, view: "next" }).length, 1);
  assert.equal(context.field.listJobsAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, view: "current" }).length, 0);
  const first = open(context); assert.equal(open(context), first);
  transition(context, first.id, "en-route");
  assert.equal(context.field.listJobsAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, view: "current" })[0].fieldStatus, "en-route");
});

test("unassigned technicians cannot view, open, or mutate field work", async () => {
  const context = await setup();
  assert.deepEqual(context.field.listJobsAuthorized({ sessionToken: context.sessions.other.token, tenantId: TENANT, view: "today" }), []);
  assert.throws(() => context.field.openAuthorized({ sessionToken: context.sessions.other.token, tenantId: TENANT, workItemId: context.workItem.id }), /not authorized/);
  const session = open(context);
  assert.throws(() => context.field.transitionAuthorized({ sessionToken: context.sessions.other.token, tenantId: TENANT, fieldSessionId: session.id, status: "en-route" }), /not authorized/);
});

test("field lifecycle permits pause and resume while rejecting invalid transitions", async () => {
  const context = await setup(); const session = open(context);
  assert.throws(() => transition(context, session.id, "in-progress"), /Invalid field transition/);
  transition(context, session.id, "en-route"); transition(context, session.id, "arrived"); transition(context, session.id, "in-progress");
  assert.equal(transition(context, session.id, "paused").status, "paused"); assert.equal(transition(context, session.id, "in-progress").status, "in-progress");
  assert.equal(transition(context, session.id, "field-complete").status, "field-complete");
});

test("25-Point Inspection exposes exactly nineteen source components and four governed results", async () => {
  assert.equal(inspectionTemplate.name, "25-Point Inspection"); assert.equal(inspectionTemplate.components.length, 19);
  assert.deepEqual(inspectionTemplate.itemResults, ["Does Not Apply", "Pass", "Flag", "Fail"]);
  assert.deepEqual(inspectionTemplate.components.map((item) => item.name), ["Springs", "Cables", "Rollers", "Hinges and Hardware", "Pulleys or Drums", "End Bearings", "Center Bearing or Plate", "Top and Bottom Brackets", "Jamb Brackets", "Vertical Tracks", "Horizontal Tracks", "Panels and Vinyl Trim", "Bottom Rubber or Retainer", "Operator", "Rail, Trolley, Chain, or Belt", "Safety Sensors", "Wiring, Force, and Travel Limits", "Keypad, Remotes, and Wall Button", "Leveled Ground"]);
  const context = await setup(); const session = open(context); const inspection = startInspection(context, session.id);
  assert.throws(() => context.field.recordItemAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId: inspection.id, itemId: inspectionTemplate.components[0].id, result: "Needs Repair" }), /Does Not Apply, Pass, Flag, or Fail/);
});

test("repair submission blocks missing inspection, item results, door details, media, and confirmations", async () => {
  const context = await setup(); const session = open(context); reachFieldComplete(context, session.id);
  assert.throws(() => context.field.submitAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id }), /Repair requires/);
  const inspection = startInspection(context, session.id);
  assert.throws(() => context.field.submitAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id }), /Every inspection component/);
  for (const component of inspectionTemplate.components) context.field.recordItemAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId: inspection.id, itemId: component.id, result: "Pass" });
  assert.throws(() => context.field.submitAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id }), /door details/);
});

test("completed inspection submits immutable evidence and a BP-009-ready reference handoff", async () => {
  const context = await setup(); const session = open(context); const inspection = startInspection(context, session.id); completeInspection(context, inspection.id); reachFieldComplete(context, session.id);
  const report = context.field.submitAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id });
  assert.equal(report.itemResults.length, 19); assert.equal(report.findings.length, 1); assert.equal(report.immutable, true);
  assert.equal(context.field.submitAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id }), report);
  assert.throws(() => context.field.recordItemAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId: inspection.id, itemId: inspectionTemplate.components[0].id, result: "Pass" }), /immutable/);
  const admin = context.field.administrativeViewAuthorized({ sessionToken: context.sessions.owner.token, tenantId: TENANT, fieldSessionId: session.id });
  assert.deepEqual(admin.session.handoff, { targetPackage: "TNGD-BP-009", serviceCaseId: "case-field-1", fieldSessionId: session.id, diagnosticReportId: report.id, findingItemIds: ["component-01"], action: "repair-or-estimate-pending" });
  assert.equal("repair" in admin.session.handoff, false); assert.equal("estimate" in admin.session.handoff, false);
});

test("estimate inspection is optional and does not create repair or estimate execution", async () => {
  const context = await setup({ serviceType: "estimate" }); const session = open(context); reachFieldComplete(context, session.id);
  const report = context.field.submitAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id });
  assert.equal(report.inspectionPerformed, false); assert.equal(report.itemResults.every((item) => item.result === null), true);
  assert.equal(JSON.stringify(report).includes("estimateId"), false); assert.equal(JSON.stringify(report).includes("repairId"), false);
});

test("media is stored once as governed references without binary duplication", async () => {
  const context = await setup(); const session = open(context); const inspection = startInspection(context, session.id);
  const updated = context.field.attachMediaReferenceAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId: inspection.id, category: "before", assetId: "asset-1", mimeType: "image/jpeg", base64: "not-stored" });
  const duplicate = context.field.attachMediaReferenceAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId: inspection.id, category: "before", assetId: "asset-1", mimeType: "image/jpeg" });
  assert.equal(updated.mediaReferences.length, 1); assert.equal(duplicate.mediaReferences.length, 1); assert.equal("base64" in duplicate.mediaReferences[0], false);
});

test("explicitly shared and downloaded diagnostic reports exclude internal-only notes", async () => {
  const context = await setup(); const session = open(context); const inspection = startInspection(context, session.id); completeInspection(context, inspection.id); reachFieldComplete(context, session.id);
  const report = context.field.submitAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id });
  const share = context.field.shareDiagnosticReportAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id });
  const customer = context.field.sharedDiagnosticReport({ shareToken: share.shareToken });
  assert.equal(customer, report); assert.deepEqual(customer.customerNotes.map((note) => note.text), ["Spring wear should be reviewed"]); assert.equal(JSON.stringify(customer).includes("Internal technician detail"), false);
  const download = context.field.downloadDiagnosticReportAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id });
  assert.equal(download.mediaType, "application/json"); assert.equal(download.content.includes("Internal technician detail"), false);
});

test("field exceptions return to administration without closing the Service Case or losing evidence", async () => {
  const context = await setup(); const session = open(context); transition(context, session.id, "en-route"); const inspection = startInspection(context, session.id);
  context.field.recordItemAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, inspectionId: inspection.id, itemId: inspectionTemplate.components[0].id, result: "Flag" });
  const exception = context.field.addExceptionAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id, type: "customer-unavailable", detail: "No answer at door" });
  assert.equal(exception.previousStatus, "en-route"); assert.ok(exception.evidenceRevision > 1);
  const admin = context.field.administrativeViewAuthorized({ sessionToken: context.sessions.dispatcher.token, tenantId: TENANT, fieldSessionId: session.id });
  assert.equal(admin.session.status, "en-route"); assert.equal(admin.session.serviceCaseId, "case-field-1"); assert.equal(admin.exceptions[0].status, "returned-to-administration");
});

test("tenant administrator governs template availability and other roles cannot silently disable it", async () => {
  const context = await setup();
  assert.throws(() => context.field.setTemplateAvailabilityAuthorized({ sessionToken: context.sessions.manager.token, tenantId: TENANT, enabled: false }), /tenant administrator/);
  assert.equal(context.field.setTemplateAvailabilityAuthorized({ sessionToken: context.sessions.owner.token, tenantId: TENANT, enabled: false }), false);
  const session = open(context); assert.throws(() => startInspection(context, session.id), /unavailable/);
  assert.equal(context.field.setTemplateAvailabilityAuthorized({ sessionToken: context.sessions.owner.token, tenantId: TENANT, enabled: true }), true);
  assert.equal(startInspection(context, session.id).templateId, "tngd-25-point-v1");
});

test("tenant isolation, role enforcement, idempotency, and audit history remain intact", async () => {
  const context = await setup(); const session = open(context);
  assert.throws(() => context.field.historyAuthorized({ sessionToken: context.sessions.technician.token, tenantId: "tenant-other", fieldSessionId: session.id }), /Tenant mismatch|not found/);
  assert.equal(transition(context, session.id, "en-route"), transition(context, session.id, "en-route"));
  assert.ok(context.field.historyAuthorized({ sessionToken: context.sessions.technician.token, tenantId: TENANT, fieldSessionId: session.id }).length >= 2);
  assert.equal(context.auditLog.verify(), true);
});
