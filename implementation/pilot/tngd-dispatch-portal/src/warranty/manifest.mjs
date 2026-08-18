export const warrantyManifest = Object.freeze({
  workOrderId: "TNGD-BP-013",
  entities: Object.freeze([
    "WarrantyPolicy",
    "WarrantyRegistration",
    "WarrantyCoverageItem",
    "WarrantyClaim",
    "WarrantyClaimEvidenceReference",
    "WarrantyEligibilityAssessment",
    "WarrantyFinding",
    "WarrantyCoverageDecision",
    "WarrantyResolution",
    "WarrantyHistory",
    "WarrantyHandoff"
  ]),
  consumes: Object.freeze([
    "TNGD-BP-004",
    "TNGD-BP-005",
    "TNGD-BP-008",
    "TNGD-BP-009",
    "TNGD-BP-010",
    "TNGD-BP-011",
    "TNGD-BP-012"
  ]),
  selfApprovalPrevention: true,
  standardPolicy: Object.freeze({
    partsCoverageDays: 730,
    serviceCoverageDays: 90
  }),
  handoffTargets: Object.freeze(["TNGD-BP-014"]),
  persistence: Object.freeze({
    boundary: "in-memory",
    migrationLocation: "migrations"
  })
});
