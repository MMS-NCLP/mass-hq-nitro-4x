export const repairEstimateManifest = Object.freeze({
  workOrderId: "TNGD-BP-009",
  templates: Object.freeze(["Garage Door Repair | Service", "New Garage Door Estimate"]),
  entities: Object.freeze(["RepairRecord", "EstimateRecord", "EstimateVersion", "EstimateOption", "LineItem", "WorkRecommendation", "PerformedWork", "DeclinedWork", "EstimateConversion", "ExecutionHistory"]),
  consumes: Object.freeze(["TNGD-BP-003", "TNGD-BP-004", "TNGD-BP-008"]),
  handoffTarget: "TNGD-BP-010",
  persistence: Object.freeze({ boundary: "in-memory", migrationLocation: "migrations" })
});
