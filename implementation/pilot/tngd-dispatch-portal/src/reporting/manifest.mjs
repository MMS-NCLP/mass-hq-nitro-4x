export const reportingManifest = Object.freeze({
  workOrderId: "TNGD-BP-015",
  entities: Object.freeze([
    "ReportDefinition",
    "MetricDefinition",
    "OperationalReport",
    "ReportSnapshot",
    "ReportFilter",
    "ReportResult",
    "ReportSourceReference",
    "ReportException",
    "ReportExport",
    "ReportHistory"
  ]),
  consumes: Object.freeze([
    "TNGD-BP-002",
    "TNGD-BP-003",
    "TNGD-BP-004",
    "TNGD-BP-005",
    "TNGD-BP-006",
    "TNGD-BP-007",
    "TNGD-BP-008",
    "TNGD-BP-009",
    "TNGD-BP-010",
    "TNGD-BP-011",
    "TNGD-BP-012",
    "TNGD-BP-013",
    "TNGD-BP-014"
  ]),
  calculationMethods: Object.freeze(["count", "rate", "sum", "status-distribution"]),
  exportFormats: Object.freeze(["csv", "json"]),
  handoffTargets: Object.freeze([]),
  persistence: Object.freeze({
    boundary: "in-memory",
    migrationLocation: "migrations"
  })
});
