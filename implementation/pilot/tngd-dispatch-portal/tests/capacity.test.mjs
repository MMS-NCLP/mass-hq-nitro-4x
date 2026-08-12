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
  const schedulingService = { listAuthorized: () => Object.freeze([...appointments]) };
  const capacity = new CapacityService({ secureAccess, schedulingService, auditLog, now: () => new Date("2026-08-17T09:00:00Z") });
  return { auditLog, secureAccess, capacity, admin, technician };
}
function configure(context, changes = {}) {
  return context.capacity.configureProfileAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id,
    serviceCapabilities: ["repair", "estimate"], skills: ["torsion-spring"], shifts: [{ dayOfWeek: 1, startsAt: "08:00", endsAt: "17:00" }],
    serviceAreas: ["raleigh"], travelRadiusMiles: 30, dailyLimit: 3, sameDayLimit: 2,
    emergencyEnabled: true, emergencyDailyLimit: 1, equipment: ["ladder"], vehicles: ["service-van"], ...changes });
}
const query = (context, changes = {}) => context.capacity.calculateAuthorized({ sessionToken: context.admin.token, tenantId: TENANT,
  startsAt: "2026-08-17T13:00:00Z", endsAt: "2026-08-17T14:00:00Z", serviceType: "repair", serviceArea: "raleigh",
  travelDistanceMiles: 10, requiredSkills: ["torsion-spring"], requiredEquipment: ["ladder"], requiredVehicle: "service-van", ...changes });

test("shift setup exposes service-capable capacity to scheduling and dispatch", async () => {
  const context = await setup(); configure(context); const result = query(context);
  assert.equal(result.candidates[0].available, true); assert.deepEqual(result.handoff, { scheduling: "TNGD-BP-005", dispatch: "TNGD-BP-007" }); assert.equal(context.auditLog.verify(), true);
});
test("PTO and blackout dates block capacity", async () => {
  const context = await setup(); configure(context);
  context.capacity.addExceptionAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id, date: "2026-08-17", type: "pto", reason: "Approved leave" });
  assert.deepEqual(query(context).candidates[0].reasons, ["availability-exception"]);
  const blackout = await setup(); configure(blackout);
  blackout.capacity.addExceptionAuthorized({ sessionToken: blackout.admin.token, tenantId: TENANT, technicianId: blackout.technician.id, date: "2026-08-17", type: "blackout", reason: "Office closure" });
  assert.deepEqual(query(blackout).candidates[0].reasons, ["availability-exception"]);
});
test("training and administrative holds block capacity", async () => {
  for (const type of ["training", "administrative-hold"]) {
    const context = await setup(); configure(context);
    context.capacity.addExceptionAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id, date: "2026-08-17", type, reason: type });
    assert.deepEqual(query(context).candidates[0].reasons, ["availability-exception"]);
  }
});
test("partial-day exceptions block only overlapping intervals", async () => {
  const context = await setup(); configure(context);
  context.capacity.addExceptionAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id,
    date: "2026-08-17", type: "training", startsAt: "2026-08-17T13:30:00.000Z", endsAt: "2026-08-17T14:30:00.000Z", reason: "Safety training" });
  assert.deepEqual(query(context).candidates[0].reasons, ["availability-exception"]);
  assert.equal(query(context, { startsAt: "2026-08-17T15:00:00Z", endsAt: "2026-08-17T16:00:00Z" }).candidates[0].available, true);
});
test("capability, service area, equipment, vehicle, and emergency requirements filter candidates", async () => {
  const context = await setup(); configure(context);
  const result = query(context, { serviceType: "installation", serviceArea: "durham", travelDistanceMiles: 50, requiredSkills: ["commercial-door"], requiredEquipment: ["lift"], requiredVehicle: "box-truck" });
  assert.deepEqual(result.candidates[0].reasons, ["capability", "skill", "service-area", "travel-radius", "vehicle", "equipment"]);
});
test("governed travel input rejects omission and invalid distances", async () => {
  const context = await setup(); configure(context);
  const invalidDistances = [undefined, null, -1, Number.NaN, Number.POSITIVE_INFINITY, "10"];
  for (const travelDistanceMiles of invalidDistances) {
    assert.throws(() => query(context, { travelDistanceMiles }), /Travel distance must be a finite non-negative number/);
    assert.throws(() => configure(context, { travelRadiusMiles: travelDistanceMiles }), /Travel radius must be a finite non-negative number/);
  }
  assert.equal(query(context, { travelDistanceMiles: 30 }).candidates[0].available, true);
  assert.deepEqual(query(context, { travelDistanceMiles: 30.01 }).candidates[0].reasons, ["travel-radius"]);
});
test("same-day limits and overlapping assignments block capacity", async () => {
  const appointment = { id: "a1", technicianId: "placeholder", startsAt: "2026-08-17T13:30:00Z", endsAt: "2026-08-17T14:30:00Z" };
  const context = await setup([appointment]); appointment.technicianId = context.technician.id; configure(context, { sameDayLimit: 1 });
  const result = query(context);
  assert.deepEqual(result.candidates[0].reasons, ["overlap", "daily-capacity"]);
});
test("remaining capacity counts only appointments on the requested date", async () => {
  const prior = { id: "prior", technicianId: "placeholder", startsAt: "2026-08-16T10:00:00Z", endsAt: "2026-08-16T11:00:00Z" };
  const current = { id: "current", technicianId: "placeholder", startsAt: "2026-08-17T10:00:00Z", endsAt: "2026-08-17T11:00:00Z" };
  const context = await setup([prior, current]); prior.technicianId = context.technician.id; current.technicianId = context.technician.id;
  configure(context, { dailyLimit: 4, sameDayLimit: 3 });
  const candidate = query(context).candidates[0];
  assert.equal(candidate.available, true); assert.equal(candidate.remainingCapacity, 2);
});
test("authorized reasoned override increases temporary capacity and remains auditable", async () => {
  const appointment = { id: "a1", technicianId: "placeholder", startsAt: "2026-08-17T10:00:00Z", endsAt: "2026-08-17T11:00:00Z" };
  const context = await setup([appointment]); appointment.technicianId = context.technician.id; configure(context, { sameDayLimit: 1 });
  assert.throws(() => context.capacity.addOverrideAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id, date: "2026-08-17", additionalCapacity: 1 }), /reason/);
  const override = context.capacity.addOverrideAuthorized({ sessionToken: context.admin.token, tenantId: TENANT, technicianId: context.technician.id, date: "2026-08-17", additionalCapacity: 1, reason: "Storm response" });
  const result = query(context); assert.equal(result.candidates[0].available, true); assert.equal(result.candidates[0].overrideId, override.id);
  const event = context.auditLog.list({ tenantId: TENANT }).find((item) => item.type === "CapacityOverrideAuthorized");
  assert.deepEqual(event.metadata, { overrideId: override.id, date: "2026-08-17", additionalCapacity: 1, reason: "Storm response" });
});
test("same-day and emergency capacity are derived and governed", async () => {
  const existing = { id: "a1", technicianId: "placeholder", startsAt: "2026-08-17T10:00:00Z", endsAt: "2026-08-17T11:00:00Z" };
  const context = await setup([existing]); existing.technicianId = context.technician.id; configure(context, { sameDayLimit: 2, emergencyDailyLimit: 1 });
  assert.deepEqual(query(context, { emergency: true }).candidates[0].reasons, ["daily-capacity"]);
});
test("capacity and override amounts reject malformed or ungoverned numeric values", async () => {
  const context = await setup();
  for (const invalid of [undefined, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, -1, 1.5, "2", null]) {
    assert.throws(() => configure(context, { dailyLimit: invalid }), /Daily capacity must be a finite integer/);
    assert.throws(() => configure(context, { sameDayLimit: invalid }), /Same-day capacity must be a finite integer/);
    assert.throws(() => configure(context, { emergencyDailyLimit: invalid }), /Emergency capacity must be a finite integer/);
    assert.throws(() => context.capacity.addOverrideAuthorized({ sessionToken: context.admin.token, tenantId: TENANT,
      technicianId: context.technician.id, date: "2026-08-17", additionalCapacity: invalid, reason: "Governed correction" }), /Override capacity must be a finite integer/);
  }
  assert.throws(() => configure(context, { dailyLimit: 0 }), /greater than or equal to 1/);
  assert.doesNotThrow(() => configure(context, { dailyLimit: 1, sameDayLimit: 0, emergencyDailyLimit: 0, travelRadiusMiles: 0 }));
});
test("tenant and role enforcement prevent technician capacity administration", async () => {
  const context = await setup(); const techSession = await context.secureAccess.authenticate({ tenantId: TENANT, email: "tech@example.com", password: PASSWORD });
  assert.throws(() => context.capacity.configureProfileAuthorized({ sessionToken: techSession.token, tenantId: TENANT, technicianId: context.technician.id, serviceCapabilities: ["repair"], shifts: [{ dayOfWeek: 1, startsAt: "08:00", endsAt: "17:00" }], dailyLimit: 1 }), /Access denied/);
});
