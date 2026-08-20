import assert from "node:assert/strict";
import test from "node:test";
import { foundation } from "../src/foundation.mjs";

test("foundation identifies the authorized project, packages, and location", () => {
  assert.equal(foundation.projectId, "MASS-TNGD-PILOT-001");
  assert.deepEqual(
    foundation.implementedPackages,
    ["TNGD-BP-000", "TNGD-BP-001", "TNGD-BP-002", "TNGD-BP-003", "TNGD-BP-004", "TNGD-BP-005", "TNGD-BP-006", "TNGD-BP-007", "TNGD-BP-008", "TNGD-BP-009", "TNGD-BP-010", "TNGD-BP-011", "TNGD-BP-012", "TNGD-BP-013", "TNGD-BP-014", "TNGD-BP-015", "TNGD-DISPATCH-V1-COMMERCE-OPS"]
  );
  assert.equal(
    foundation.implementationRoot,
    "implementation/pilot/tngd-dispatch-portal"
  );
});

test("foundation requires the authorized runtime boundary", () => {
  assert.equal(foundation.runtime.engine, "node");
  assert.equal(foundation.runtime.minimumMajor, 22);
  assert.equal(foundation.runtime.moduleFormat, "esm");
});

test("foundation exposes the complete BP-001 feature authority", () => {
  assert.deepEqual(foundation.authorizedFeatureScope, [
    "authentication",
    "password-recovery",
    "role-enforcement",
    "tenant-isolation",
    "portal-separation",
    "audit-logging",
    "session-management"
  ]);
});

test("foundation records only exact BP-002 work-order responsibilities", () => {
  assert.deepEqual(foundation.bp002FeatureScope, [
    "repair-intake",
    "estimate-intake",
    "other-services-intake",
    "eight-question-intake-foundation",
    "initial-customer-capture",
    "service-request-creation"
  ]);
});

test("foundation records only exact BP-003 work-order responsibilities", () => {
  assert.deepEqual(foundation.bp003FeatureScope, [
    "eight-question-guided-intake",
    "conditional-intake-rules",
    "autosave-and-resume",
    "intake-media-references",
    "structured-intake-record",
    "bp004-ready-handoff"
  ]);
});

test("foundation records only exact BP-004 work-order responsibilities", () => {
  assert.deepEqual(foundation.bp004FeatureScope, [
    "intake-to-customer-conversion",
    "tenant-customer-matching",
    "duplicate-customer-prevention",
    "initial-service-case-creation",
    "initial-customer-timeline",
    "intake-evidence-preservation",
    "bp005-ready-handoff",
    "hcp-template-schema-expansion",
    "customer-record-enrichment",
    "direct-customer-creation"
  ]);
});

test("foundation records only exact BP-005 work-order responsibilities", () => {
  assert.deepEqual(foundation.bp005FeatureScope, ["appointment-creation", "calendar-synchronization", "conflict-detection", "rescheduling", "dispatch-readiness", "scheduling-audit"]);
});

test("foundation records only exact BP-006 work-order responsibilities", () => {
  assert.deepEqual(foundation.bp006FeatureScope, ["technician-availability-profiles", "capacity-calculation", "availability-exceptions", "temporary-capacity-overrides", "capability-and-area-filtering", "bp005-bp007-capacity-handoff"]);
});
test("foundation records only exact BP-007 work-order responsibilities",()=>{assert.deepEqual(foundation.bp007FeatureScope,["dispatcher-work-queue","capacity-aware-recommendations","human-approved-assignment","reassignment-and-return","dispatch-lifecycle","exception-handling","immutable-assignment-history","technician-handoff"]);});
test("foundation records only exact BP-008 work-order responsibilities",()=>{assert.deepEqual(foundation.bp008FeatureScope,["assigned-technician-mobile-workflow","today-current-next-job-views","field-lifecycle-and-exceptions","25-point-inspection","governed-diagnostic-evidence","immutable-submission","customer-safe-report","bp009-ready-reference-handoff"]);});
test("foundation records only exact BP-009 work-order responsibilities",()=>{assert.deepEqual(foundation.bp009FeatureScope,["repair-service-template","new-door-estimate-template","draft-and-version-lifecycle","diagnostic-reference-lineage","recommendations-options-line-items","outcome-recording","idempotent-estimate-conversion","bp010-ready-authorization-package"]);});
test("foundation records only exact BP-010 work-order responsibilities",()=>{assert.deepEqual(foundation.bp010FeatureScope,["authorization-request-and-presentation","adult-acknowledgment","immutable-content-snapshot","signature-or-equivalent-evidence","decision-lifecycle","amendment-and-reauthorization","customer-safe-receipt","bp011-ready-financial-handoff"]);});
test("foundation records only exact BP-011 work-order responsibilities",()=>{assert.deepEqual(foundation.bp011FeatureScope,["invoice-draft-and-finalization","authorized-scope-consumption","immutable-invoice-versions","square-payment-gateway","idempotent-payment-webhooks","transaction-scoped-customer-access","refund-and-exception-evidence","bp012-ready-reconciliation-handoff"]);});
test("foundation records only exact BP-012 work-order responsibilities",()=>{assert.deepEqual(foundation.bp012FeatureScope,["administrative-completion-review","evidence-completeness-checks","exception-categorization-and-ownership","self-approval-prevention","escalation-and-resolution-lifecycle","reconciliation-difference-tracking","immutable-review-and-resolution-history","bp013-bp014-ready-handoffs"]);});
test("foundation records only exact BP-013 work-order responsibilities",()=>{assert.deepEqual(foundation.bp013FeatureScope,["warranty-policy-and-registration","warranty-claim-intake","eligibility-and-coverage-assessment","findings-decision-and-resolution","warranty-lifecycle-governance","self-approval-prevention","superseding-corrections","bp014-ready-handoff"]);});
test("foundation records only exact BP-014 work-order responsibilities",()=>{assert.deepEqual(foundation.bp014FeatureScope,["follow-up-policy-and-versioning","five-cadence-scheduling","authoritative-eligibility","consent-recheck-and-opt-out","task-and-communication-handoffs","immutable-suppression-evidence","reasoned-rescheduling-and-supersession","communications-only-delivery"]);});
test("foundation records only exact BP-015 work-order responsibilities",()=>{assert.deepEqual(foundation.bp015FeatureScope,["report-and-metric-definitions","governed-report-generation","tenant-safe-operational-views","deterministic-metric-calculations","point-in-time-snapshots","authorized-export-definitions","source-reference-traceability","data-quality-exception-representation"]);});
test("foundation records only exact Commerce Operations responsibilities",()=>{assert.deepEqual(foundation.commerceOperationsFeatureScope,["catalog-administration","governed-categories","tax-treatment","modifier-sets","controlled-discounts","deposit-configuration","authorized-ad-hoc-lines","bp009-bp012-commerce-integration"]);});

test("foundation preserves persistence and deployment seams", () => {
  assert.equal(foundation.paths.migrations, "migrations");
  assert.equal(foundation.paths.deployment, "deployment");
  assert.ok(foundation.environment.includes("MASS_DATABASE_URL"));
  assert.ok(foundation.environment.includes("MASS_DEPLOYMENT_TARGET"));
});
