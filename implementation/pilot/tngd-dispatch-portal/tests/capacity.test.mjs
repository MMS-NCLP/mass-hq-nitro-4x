import assert from "node:assert/strict";
import test from "node:test";
import { CapacityService } from "../src/capacity/index.mjs";
import { AuditLog, SecureAccess } from "../src/security/index.mjs";

const TENANT = "tenant-tngd"; const PASSWORD = "correct horse battery staple";
async function setup(appointments = []) {
  const auditLog = new AuditLog(); const secureAccess = new SecureAccess({ auditLog });
  await secureAccess.bootstrapTenantAdmin({ tenantId: TENANT, email: "owner@example.com", password: PASSWORD });
  const admin = await secureAccess.authenticate({ tenantId: TENANT, email: "owner@example.com", password: PASSWORD });
  const technician = await secureAccess.createUser({ actorSessionToken: admin.token, tenantId: TENANT, email: "tech@example.com", password: PASSWORD, roles: ["technician"] });
  const schedulingService = { getAuthorized: ({ appointmentId }) => appointments.find((item) => item.id === appointmentId) ?? null };
  const capacity = new CapacityService({ secureAccess, schedulingService, auditLog });
  return { auditLog, secureAccess, capacity, admin, technician };
}
function configure(context, changes = {}) {
  return context.capacity.configureProfileAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id,
    serviceCapabilities: ["repair", "estimate"], shifts: [{ dayOfWeek: 1, startsAt: "08:00", endsAt: "17:00" }],
    serviceAreas: ["raleigh"], travelRadiusMiles: 30, dailyLimit: 3, sameDayLimit: 2,
    emergencyEnabled: true, equipment: ["ladder"], vehicles: ["service-van"], ...changes });
}
const query = (context, changes = {}) => context.capacity.calculateAuthorized({ sessionToken: context.admin.token, tenantId: TENANT,
  startsAt: "2026-08-17T13:00:00Z", endsAt: "2026-08-17T14:00:00Z", serviceType: "repair", serviceArea: "raleigh",
  requiredEquipment: ["ladder"], requiredVehicle: "service-van", ...changes });

test("shift setup exposes service-capable capacity to scheduling and dispatch", async () => {
  const context = await setup(); configure(context); const result = query(context);
  assert.equal(result.candidates[0].available, true); assert.deepEqual(result.handoff, { scheduling: "TNGD-BP-005", dispatch: "TNGD-BP-007" }); assert.equal(context.auditLog.verify(), true);
});
test("PTO and blackout dates block capacity", async () => {
  const context = await setup(); configure(context);
  context.capacity.addExceptionAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id, date: "2026-08-17", type: "pto", reason: "Approved leave" });
  assert.deepEqual(query(context).candidates[0].reasons, ["availability-exception"]);
});
test("capability, service area, equipment, vehicle, and emergency requirements filter candidates", async () => {
  const context = await setup(); configure(context);
  const result = query(context, { serviceType: "installation", serviceArea: "durham", requiredEquipment: ["lift"], requiredVehicle: "box-truck", emergency: true });
  assert.deepEqual(result.candidates[0].reasons, ["capability", "service-area", "vehicle", "equipment"]);
});
test("same-day limits and overlapping assignments block capacity", async () => {
  const appointment = { id: "a1", technicianId: "placeholder", startsAt: "2026-08-17T13:30:00Z", endsAt: "2026-08-17T14:30:00Z" };
  const context = await setup([appointment]); appointment.technicianId = context.technician.id; configure(context, { sameDayLimit: 1 });
  const result = query(context, { appointmentIds: ["a1"], sameDay: true });
  assert.deepEqual(result.candidates[0].reasons, ["overlap", "daily-capacity"]);
});
test("authorized reasoned override increases temporary capacity and remains auditable", async () => {
  const appointment = { id: "a1", technicianId: "placeholder", startsAt: "2026-08-17T10:00:00Z", endsAt: "2026-08-17T11:00:00Z" };
  const context = await setup([appointment]); appointment.technicianId = context.technician.id; configure(context, { sameDayLimit: 1 });
  assert.throws(() => context.capacity.addOverrideAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id, date: "2026-08-17", additionalCapacity: 1 }), /reason/);
  const override = context.capacity.addOverrideAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id, date: "2026-08-17", additionalCapacity: 1, reason: "Storm response" });
  const result = query(context, { appointmentIds: ["a1"], sameDay: true }); assert.equal(result.candidates[0].available, true); assert.equal(result.candidates[0].overrideId, override.id);
});
test("tenant and role enforcement prevent technician capacity administration", async () => {
  const context = await setup(); const techSession = await context.secureAccess.authenticate({ tenantId: TENANT, email: "tech@example.com", password: PASSWORD });
  assert.throws(() => context.capacity.configureProfileAuthorized({ sessionToken: techSession.token, tenantId: TENANT, technicianId: context.technician.id, serviceCapabilities: ["repair"], shifts: [{ dayOfWeek: 1, startsAt: "08:00", endsAt: "17:00" }], dailyLimit: 1 }), /Access denied/);
});
