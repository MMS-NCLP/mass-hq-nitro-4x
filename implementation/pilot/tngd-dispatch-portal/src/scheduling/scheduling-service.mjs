import { randomUUID } from "node:crypto";

const freeze = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) freeze(nested);
  return value;
};

function interval(startsAt, endsAt) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (!Number.isFinite(start.valueOf()) || !Number.isFinite(end.valueOf()) || start >= end) {
    throw new Error("A valid appointment interval is required.");
  }
  return { startsAt: start.toISOString(), endsAt: end.toISOString() };
}

export class SchedulingService {
  #appointments = new Map();
  #byCase = new Map();
  #secureAccess;
  #customerCases;
  #calendar;
  #audit;
  #now;

  constructor({ secureAccess, customerCaseService, calendarGateway, auditLog, now = () => new Date() } = {}) {
    if (!secureAccess || !customerCaseService || !calendarGateway || !auditLog) {
      throw new Error("Scheduling requires security, service-case, calendar, and audit contracts.");
    }
    this.#secureAccess = secureAccess;
    this.#customerCases = customerCaseService;
    this.#calendar = calendarGateway;
    this.#audit = auditLog;
    this.#now = now;
  }

  scheduleAuthorized({ sessionToken, tenantId, serviceCaseId, startsAt, endsAt, organizationTimeZone }) {
    const principal = this.#authorize(sessionToken, tenantId, `service-case:${serviceCaseId}:schedule`);
    const existingId = this.#byCase.get(`${tenantId}:${serviceCaseId}`);
    if (existingId) return this.#appointments.get(existingId);
    const serviceCase = this.#customerCases.getServiceCaseAuthorized({ sessionToken, tenantId, serviceCaseId });
    if (!serviceCase || serviceCase.status !== "ready-for-scheduling") {
      throw new Error("A BP-004 scheduling-ready Service Case is required.");
    }
    const period = interval(startsAt, endsAt);
    this.#assertNoConflict(tenantId, period);
    const id = randomUUID();
    const calendar = this.#calendar.createEvent({
      idempotencyKey: `${tenantId}:${serviceCaseId}`,
      tenantId,
      ...period,
      title: `TNGD service case ${serviceCaseId}`,
      metadata: { serviceCaseId, customerId: serviceCase.customerId }
    });
    const createdAt = this.#now().toISOString();
    const appointment = freeze({
      id, tenantId, serviceCaseId, customerId: serviceCase.customerId,
      status: "scheduled", ...period,
      organizationTimeZone: String(organizationTimeZone || "America/New_York"),
      calendar, technicianAssignmentStatus: "ready-for-bp006",
      createdBy: principal.id, createdAt, revision: 1
    });
    this.#appointments.set(id, appointment);
    this.#byCase.set(`${tenantId}:${serviceCaseId}`, id);
    this.#record(principal.id, tenantId, appointment, "AppointmentScheduled");
    return appointment;
  }

  rescheduleAuthorized({ sessionToken, tenantId, appointmentId, startsAt, endsAt, reason }) {
    const principal = this.#authorize(sessionToken, tenantId, `appointment:${appointmentId}:reschedule`);
    const current = this.#appointments.get(appointmentId);
    if (!current || current.tenantId !== tenantId) throw new Error("Appointment not found for tenant.");
    const period = interval(startsAt, endsAt);
    this.#assertNoConflict(tenantId, period, appointmentId);
    const calendar = this.#calendar.updateEvent({
      idempotencyKey: `${tenantId}:${current.serviceCaseId}`,
      ...period,
      metadata: { serviceCaseId: current.serviceCaseId, rescheduleReason: String(reason || "") }
    });
    const updated = freeze({ ...current, ...period, calendar, revision: current.revision + 1,
      rescheduledAt: this.#now().toISOString(), rescheduledBy: principal.id,
      rescheduleReason: String(reason || "") });
    this.#appointments.set(appointmentId, updated);
    this.#record(principal.id, tenantId, updated, "AppointmentRescheduled");
    return updated;
  }

  getAuthorized({ sessionToken, tenantId, appointmentId }) {
    this.#secureAccess.requirePermission({ sessionToken, tenantId, permission: "customers.read", resourceId: `appointment:${appointmentId}` });
    const value = this.#appointments.get(appointmentId);
    return value?.tenantId === tenantId ? value : null;
  }

  listAuthorized({ sessionToken, tenantId }) {
    this.#secureAccess.requirePermission({ sessionToken, tenantId, permission: "customers.read", resourceId: "appointments:list" });
    return Object.freeze([...this.#appointments.values()].filter((value) => value.tenantId === tenantId));
  }

  #assertNoConflict(tenantId, proposed, excludedId = null) {
    for (const appointment of this.#appointments.values()) {
      if (appointment.tenantId !== tenantId || appointment.id === excludedId) continue;
      if (proposed.startsAt < appointment.endsAt && proposed.endsAt > appointment.startsAt) {
        throw new Error("Appointment conflicts with an existing tenant calendar interval.");
      }
    }
  }

  #authorize(sessionToken, tenantId, resourceId) {
    return this.#secureAccess.requirePermission({ sessionToken, tenantId, permission: "scheduling.manage", resourceId });
  }

  #record(principalId, tenantId, appointment, type) {
    this.#audit.append({ tenantId, principalId, type, resource: `appointment:${appointment.id}`,
      action: "scheduling.manage", outcome: "granted",
      metadata: { serviceCaseId: appointment.serviceCaseId, revision: appointment.revision,
        targetPackage: "TNGD-BP-006" } });
  }
}
