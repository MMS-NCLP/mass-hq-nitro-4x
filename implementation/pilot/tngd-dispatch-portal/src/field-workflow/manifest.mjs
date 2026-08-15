export const fieldWorkflowManifest = Object.freeze({
  workOrderId: "TNGD-BP-008",
  diagnosticName: "25-Point Inspection",
  componentCount: 19,
  itemResults: Object.freeze(["Does Not Apply", "Pass", "Flag", "Fail"]),
  entities: Object.freeze([
    "FieldWorkSession", "TechnicianJobView", "InspectionTemplate", "InspectionItemDefinition",
    "InspectionExecution", "InspectionItemResult", "FieldNote", "MeasurementRecord",
    "MediaReference", "DiagnosticReport", "FieldException", "FieldHistory"
  ]),
  consumes: Object.freeze(["TNGD-BP-001", "TNGD-BP-004", "TNGD-BP-005", "TNGD-BP-007"]),
  handoffTarget: "TNGD-BP-009",
  persistence: Object.freeze({ boundary: "in-memory", migrationLocation: "migrations", media: "references-only" })
});
