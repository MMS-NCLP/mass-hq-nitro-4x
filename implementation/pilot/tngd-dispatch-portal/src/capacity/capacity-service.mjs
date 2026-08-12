import { randomUUID } from "node:crypto";

const frozen = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value); for (const nested of Object.values(value)) frozen(nested); return value;
};
const day = (value) => new Date(value).toISOString().slice(0, 10);
const minutes = (value) => { const [h, m] = String(value).split(":").map(Number); return h * 60 + m; };
const clock = (value) => { const date = new Date(value); return date.getUTCHours() * 60 + date.getUTCMinutes(); };
const overlaps = (a, b) => a.startsAt < b.endsAt && a.endsAt > b.startsAt;

export class CapacityService {
  #profiles = new Map(); #exceptions = new Map(); #overrides = new Map();
  #secureAccess; #scheduling; #audit; #now;
  constructor({ secureAccess, schedulingService, auditLog, now = () => new Date() } = {}) {
    if (!secureAccess || !schedulingService || !auditLog) throw new Error("Capacity requires security, scheduling, and audit contracts.");
    this.#secureAccess = secureAccess; this.#scheduling = schedulingService; this.#audit = auditLog; this.#now = now;
  }

  configureProfileAuthorized({ sessionToken, tenantId, technicianId, serviceCapabilities, skills = [], shifts, serviceAreas, travelRadiusMiles, dailyLimit, sameDayLimit, emergencyEnabled, emergencyDailyLimit = 0, equipment, vehicles }) {
    const principal = this.#authorize(sessionToken, tenantId, `technician:${technicianId}:capacity`);
    if (!Array.isArray(shifts) || !shifts.length || Number(dailyLimit) < 1) throw new Error("Valid shifts and daily capacity are required.");
    const profile = frozen({ id: randomUUID(), tenantId, technicianId,
      serviceCapabilities: [...new Set(serviceCapabilities ?? [])], skills: [...new Set(skills)], shifts: structuredClone(shifts),
      serviceAreas: [...new Set(serviceAreas ?? [])], travelRadiusMiles: Number(travelRadiusMiles ?? 0),
      dailyLimit: Number(dailyLimit), sameDayLimit: Number(sameDayLimit ?? dailyLimit),
      emergencyEnabled: Boolean(emergencyEnabled), emergencyDailyLimit: Number(emergencyDailyLimit), equipment: [...new Set(equipment ?? [])],
      vehicles: [...new Set(vehicles ?? [])], updatedBy: principal.id, updatedAt: this.#now().toISOString() });
    this.#profiles.set(`${tenantId}:${technicianId}`, profile);
    this.#event(principal, tenantId, technicianId, "TechnicianCapacityProfileConfigured"); return profile;
  }

  addExceptionAuthorized({ sessionToken, tenantId, technicianId, date, type, startsAt = null, endsAt = null, reason }) {
    const principal = this.#authorize(sessionToken, tenantId, `technician:${technicianId}:exception`);
    if (!["pto", "blackout", "training", "administrative-hold"].includes(type)) throw new Error("Unsupported availability exception.");
    const exception = frozen({ id: randomUUID(), tenantId, technicianId, date, type, startsAt, endsAt, reason: String(reason || ""), createdBy: principal.id });
    const key = `${tenantId}:${technicianId}:${date}`; this.#exceptions.set(key, [...(this.#exceptions.get(key) ?? []), exception]);
    this.#event(principal, tenantId, technicianId, "AvailabilityExceptionAdded"); return exception;
  }

  addOverrideAuthorized({ sessionToken, tenantId, technicianId, date, additionalCapacity, reason }) {
    const principal = this.#authorize(sessionToken, tenantId, `technician:${technicianId}:override`);
    if (!String(reason || "").trim()) throw new Error("Capacity override requires a reason.");
    const override = frozen({ id: randomUUID(), tenantId, technicianId, date, additionalCapacity: Number(additionalCapacity), reason, authorId: principal.id, createdAt: this.#now().toISOString() });
    this.#overrides.set(`${tenantId}:${technicianId}:${date}`, override);
    this.#event(principal, tenantId, technicianId, "CapacityOverrideAuthorized", { overrideId: override.id, date, additionalCapacity: override.additionalCapacity, reason: override.reason }); return override;
  }

  calculateAuthorized({ sessionToken, tenantId, startsAt, endsAt, serviceType, serviceArea, travelDistanceMiles = 0, requiredSkills = [], requiredEquipment = [], requiredVehicle = null, emergency = false }) {
    const principal = this.#secureAccess.requirePermission({ sessionToken, tenantId, permission: "scheduling.manage", resourceId: "capacity:query" });
    const period = { startsAt: new Date(startsAt).toISOString(), endsAt: new Date(endsAt).toISOString() };
    if (period.startsAt >= period.endsAt) throw new Error("Valid capacity interval required.");
    const date = day(period.startsAt); const weekday = new Date(period.startsAt).getUTCDay();
    const sameDay = date === day(this.#now().toISOString());
    const appointments = this.#scheduling.listAuthorized({ sessionToken, tenantId });
    const candidates = [];
    for (const profile of this.#profiles.values()) {
      if (profile.tenantId !== tenantId) continue;
      const reasons = [];
      if (!profile.serviceCapabilities.includes(serviceType)) reasons.push("capability");
      if (requiredSkills.some((item) => !profile.skills.includes(item))) reasons.push("skill");
      if (!profile.serviceAreas.includes(serviceArea)) reasons.push("service-area");
      if (Number(travelDistanceMiles) > profile.travelRadiusMiles) reasons.push("travel-radius");
      if (emergency && !profile.emergencyEnabled) reasons.push("emergency");
      if (requiredVehicle && !profile.vehicles.includes(requiredVehicle)) reasons.push("vehicle");
      if (requiredEquipment.some((item) => !profile.equipment.includes(item))) reasons.push("equipment");
      const shift = profile.shifts.find((item) => item.dayOfWeek === weekday && clock(period.startsAt) >= minutes(item.startsAt) && clock(period.endsAt) <= minutes(item.endsAt));
      if (!shift) reasons.push("outside-shift");
      const exceptions = this.#exceptions.get(`${tenantId}:${profile.technicianId}:${date}`) ?? [];
      if (exceptions.some((item) => !item.startsAt || overlaps(period, { startsAt: item.startsAt, endsAt: item.endsAt }))) reasons.push("availability-exception");
      const assigned = appointments.filter((item) => item.technicianId === profile.technicianId || item.capacityReservationTechnicianId === profile.technicianId);
      if (assigned.some((item) => overlaps(period, item))) reasons.push("overlap");
      const override = this.#overrides.get(`${tenantId}:${profile.technicianId}:${date}`);
      const emergencyLimit = emergency ? profile.emergencyDailyLimit : Number.POSITIVE_INFINITY;
      const limit = Math.min(sameDay ? profile.sameDayLimit : profile.dailyLimit, emergencyLimit) + Number(override?.additionalCapacity ?? 0);
      if (assigned.filter((item) => day(item.startsAt) === date).length >= limit) reasons.push("daily-capacity");
      candidates.push(frozen({ technicianId: profile.technicianId, available: reasons.length === 0, reasons, remainingCapacity: Math.max(0, limit - assigned.length), overrideId: override?.id ?? null }));
    }
    const result = frozen({ tenantId, ...period, serviceType, serviceArea, candidates, calculatedAt: this.#now().toISOString(), handoff: { scheduling: "TNGD-BP-005", dispatch: "TNGD-BP-007" } });
    this.#audit.append({ tenantId, principalId: principal.id, type: "TechnicianCapacityCalculated", resource: "capacity:query", action: "scheduling.manage", outcome: "granted", metadata: { candidateCount: candidates.length, availableCount: candidates.filter((x) => x.available).length } });
    return result;
  }

  #authorize(sessionToken, tenantId, resourceId) { return this.#secureAccess.requirePermission({ sessionToken, tenantId, permission: "dispatch.manage", resourceId }); }
  #event(principal, tenantId, technicianId, type, metadata = {}) { this.#audit.append({ tenantId, principalId: principal.id, type, resource: `technician:${technicianId}`, action: "dispatch.manage", outcome: "granted", metadata }); }
}
