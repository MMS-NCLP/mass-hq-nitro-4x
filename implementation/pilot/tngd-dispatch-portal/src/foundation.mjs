import { pathToFileURL } from "node:url";

export const foundation = Object.freeze({
  projectId: "MASS-TNGD-PILOT-001",
  implementedPackages: Object.freeze([
    "TNGD-BP-000",
    "TNGD-BP-001",
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
    "TNGD-BP-012"
  ]),
  implementationRoot: "implementation/pilot/tngd-dispatch-portal",
  runtime: Object.freeze({
    engine: "node",
    minimumMajor: 22,
    moduleFormat: "esm"
  }),
  paths: Object.freeze({
    source: "src",
    tests: "tests",
    automation: "scripts",
    migrations: "migrations",
    deployment: "deployment",
    generated: "dist"
  }),
  environment: Object.freeze([
    "MASS_RUNTIME_ENV",
    "MASS_DATABASE_URL",
    "MASS_DEPLOYMENT_TARGET"
  ]),
  authorizedFeatureScope: Object.freeze([
    "authentication",
    "password-recovery",
    "role-enforcement",
    "tenant-isolation",
    "portal-separation",
    "audit-logging",
    "session-management"
  ]),
  bp002FeatureScope: Object.freeze([
    "repair-intake",
    "estimate-intake",
    "other-services-intake",
    "eight-question-intake-foundation",
    "initial-customer-capture",
    "service-request-creation"
  ]),
  bp003FeatureScope: Object.freeze([
    "eight-question-guided-intake",
    "conditional-intake-rules",
    "autosave-and-resume",
    "intake-media-references",
    "structured-intake-record",
    "bp004-ready-handoff"
  ]),
  bp004FeatureScope: Object.freeze([
    "intake-to-customer-conversion",
    "tenant-customer-matching",
    "duplicate-customer-prevention",
    "initial-service-case-creation",
    "initial-customer-timeline",
    "intake-evidence-preservation",
    "bp005-ready-handoff"
  ]),
  bp005FeatureScope: Object.freeze([
    "appointment-creation",
    "calendar-synchronization",
    "conflict-detection",
    "rescheduling",
    "dispatch-readiness",
    "scheduling-audit"
  ]),
  bp006FeatureScope: Object.freeze([
    "technician-availability-profiles",
    "capacity-calculation",
    "availability-exceptions",
    "temporary-capacity-overrides",
    "capability-and-area-filtering",
    "bp005-bp007-capacity-handoff"
  ]),
  bp007FeatureScope: Object.freeze([
    "dispatcher-work-queue","capacity-aware-recommendations","human-approved-assignment","reassignment-and-return","dispatch-lifecycle","exception-handling","immutable-assignment-history","technician-handoff"
  ]),
  bp008FeatureScope: Object.freeze([
    "assigned-technician-mobile-workflow",
    "today-current-next-job-views",
    "field-lifecycle-and-exceptions",
    "25-point-inspection",
    "governed-diagnostic-evidence",
    "immutable-submission",
    "customer-safe-report",
    "bp009-ready-reference-handoff"
  ]),
  bp009FeatureScope: Object.freeze([
    "repair-service-template","new-door-estimate-template","draft-and-version-lifecycle","diagnostic-reference-lineage","recommendations-options-line-items","outcome-recording","idempotent-estimate-conversion","bp010-ready-authorization-package"
  ]),
  bp010FeatureScope: Object.freeze([
    "authorization-request-and-presentation","adult-acknowledgment","immutable-content-snapshot","signature-or-equivalent-evidence","decision-lifecycle","amendment-and-reauthorization","customer-safe-receipt","bp011-ready-financial-handoff"
  ]),
  bp011FeatureScope: Object.freeze(["invoice-draft-and-finalization","authorized-scope-consumption","immutable-invoice-versions","square-payment-gateway","idempotent-payment-webhooks","transaction-scoped-customer-access","refund-and-exception-evidence","bp012-ready-reconciliation-handoff"]),
  bp012FeatureScope: Object.freeze(["administrative-completion-review","evidence-completeness-checks","exception-categorization-and-ownership","self-approval-prevention","escalation-and-resolution-lifecycle","reconciliation-difference-tracking","immutable-review-and-resolution-history","bp013-bp014-ready-handoffs"])
});

const invokedDirectly =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  process.stdout.write(`${JSON.stringify(foundation, null, 2)}\n`);
}
