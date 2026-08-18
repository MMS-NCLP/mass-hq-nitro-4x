export const followUpManifest = Object.freeze({
  workOrderId: "TNGD-BP-014",
  entities: Object.freeze([
    "FollowUpPolicy",
    "FollowUpPolicyVersion",
    "FollowUpEligibility",
    "FollowUpActivity",
    "FollowUpSuppression",
    "FollowUpTaskHandoff",
    "CommunicationHandoff",
    "FollowUpHistory"
  ]),
  consumes: Object.freeze([
    "TNGD-BP-004",
    "TNGD-BP-009",
    "TNGD-BP-011",
    "TNGD-BP-012",
    "TNGD-BP-013"
  ]),
  cadences: Object.freeze(["immediate", "short-term", "two-month", "six-month", "annual"]),
  activityTypes: Object.freeze(["satisfaction", "review-request", "estimate", "maintenance", "relationship"]),
  communicationBoundary: "APP-006",
  workflowBoundary: "APP-012",
  handoffTargets: Object.freeze(["TNGD-BP-015"]),
  persistence: Object.freeze({
    boundary: "in-memory",
    migrationLocation: "migrations"
  })
});
