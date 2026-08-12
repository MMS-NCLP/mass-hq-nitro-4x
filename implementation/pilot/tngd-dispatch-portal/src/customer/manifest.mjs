export const customerCaseManifest = Object.freeze({
  workOrderId: "TNGD-BP-004",
  capabilities: Object.freeze([
    "intake-to-customer-conversion",
    "tenant-customer-matching",
    "duplicate-customer-prevention",
    "initial-service-case-creation",
    "initial-customer-timeline",
    "intake-evidence-preservation",
    "bp005-ready-handoff"
  ]),
  entities: Object.freeze(["CustomerRecord", "ServiceCase", "CustomerTimeline"]),
  serviceCaseStatus: "ready-for-scheduling",
  handoffTarget: "TNGD-BP-005",
  persistence: Object.freeze({ boundary: "in-memory", migrationLocation: "migrations" })
});

