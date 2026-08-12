export const schedulingManifest = Object.freeze({
  workOrderId: "TNGD-BP-005",
  capabilities: Object.freeze(["appointment-creation", "calendar-synchronization", "conflict-detection", "rescheduling", "dispatch-readiness", "scheduling-audit"]),
  entity: "Appointment",
  states: Object.freeze(["scheduled"]),
  calendarBoundary: "approved-provider-gateway",
  handoffTarget: "TNGD-BP-006",
  persistence: Object.freeze({ boundary: "in-memory", migrationLocation: "migrations" })
});
