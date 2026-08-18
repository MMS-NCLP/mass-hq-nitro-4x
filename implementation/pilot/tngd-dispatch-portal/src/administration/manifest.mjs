export const reconciliationManifest = Object.freeze({
  workOrderId: "TNGD-BP-012",
  entities: Object.freeze([
    "CompletionReview",
    "ReconciliationChecklist",
    "OperationalException",
    "ExceptionAssignment",
    "ExceptionEvidenceReference",
    "ReconciliationDifference",
    "ResolutionDecision",
    "EscalationRecord",
    "AdministrativeHistory",
    "ReconciliationHandoff"
  ]),
  consumes: Object.freeze([
    "TNGD-BP-004",
    "TNGD-BP-007",
    "TNGD-BP-008",
    "TNGD-BP-009",
    "TNGD-BP-010",
    "TNGD-BP-011"
  ]),
  selfApprovalPrevention: true,
  handoffTargets: Object.freeze(["TNGD-BP-013", "TNGD-BP-014"]),
  persistence: Object.freeze({
    boundary: "in-memory",
    migrationLocation: "migrations"
  })
});
