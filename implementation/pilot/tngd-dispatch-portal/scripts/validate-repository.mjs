import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { foundation } from "../src/foundation.mjs";
import { securityManifest } from "../src/security/index.mjs";
import { intakeManifest } from "../src/intake/index.mjs";
import { customerCaseManifest } from "../src/customer/index.mjs";
import { schedulingManifest } from "../src/scheduling/index.mjs";
import { capacityManifest } from "../src/capacity/index.mjs";
import { dispatchManifest } from "../src/dispatch/index.mjs";
import { fieldWorkflowManifest } from "../src/field-workflow/index.mjs";
import { repairEstimateManifest } from "../src/repair-estimate/index.mjs";
import { customerAuthorizationManifest } from "../src/customer-authorization/index.mjs";
import { invoicePaymentManifest } from "../src/invoicing/index.mjs";
import { reconciliationManifest } from "../src/administration/index.mjs";
import { warrantyManifest } from "../src/warranty/index.mjs";
import { followUpManifest } from "../src/follow-up/index.mjs";
import { reportingManifest } from "../src/reporting/index.mjs";
import { commerceOperationsManifest } from "../src/commerce/index.mjs";

const requiredPaths = [
  ".env.example",
  ".gitignore",
  "package.json",
  "src/foundation.mjs",
  "scripts/build.mjs",
  "scripts/validate-repository.mjs",
  "tests/foundation.test.mjs",
  "tests/security.test.mjs",
  "tests/intake.test.mjs",
  "tests/guided-intake.test.mjs",
  "tests/customer-case.test.mjs",
  "tests/scheduling.test.mjs",
  "tests/capacity.test.mjs",
  "tests/dispatch.test.mjs","src/dispatch/index.mjs","src/dispatch/dispatch-service.mjs","src/dispatch/manifest.mjs",
  "docs/bp007/DOMAIN_AND_DATA_MODEL.md","docs/bp007/API_INVENTORY.md","docs/bp007/PERMISSION_MATRIX.md","docs/bp007/ASSIGNMENT_AND_DISPATCH_RULES.md","docs/bp007/ROUTE_RECOMMENDATION_BOUNDARY.md","docs/bp007/AUDIT_AND_EVENT_MODEL.md","docs/bp007/REVISION_LOG.md",
  "tests/field-workflow.test.mjs","src/field-workflow/index.mjs","src/field-workflow/field-workflow-service.mjs","src/field-workflow/manifest.mjs",
  "docs/bp008/DOMAIN_AND_DATA_MODEL.md","docs/bp008/API_INVENTORY.md","docs/bp008/PERMISSION_MATRIX.md","docs/bp008/MOBILE_WORKFLOW_AND_STATE_RULES.md","docs/bp008/INSPECTION_TEMPLATE_AND_VALIDATION_RULES.md","docs/bp008/DIAGNOSTIC_REPORT_AND_MEDIA_CONTRACT.md","docs/bp008/AUDIT_AND_EVENT_MODEL.md","docs/bp008/REVISION_LOG.md",
  "tests/repair-estimate.test.mjs","src/repair-estimate/index.mjs","src/repair-estimate/repair-estimate-service.mjs","src/repair-estimate/manifest.mjs",
  "docs/bp009/DOMAIN_AND_DATA_MODEL.md","docs/bp009/API_INVENTORY.md","docs/bp009/PERMISSION_MATRIX.md","docs/bp009/LIFECYCLE_AND_BUSINESS_RULES.md","docs/bp009/AUDIT_AND_EVENT_MODEL.md","docs/bp009/REVISION_LOG.md",
  "tests/customer-authorization.test.mjs","src/customer-authorization/index.mjs","src/customer-authorization/customer-authorization-service.mjs","src/customer-authorization/manifest.mjs",
  "docs/bp010/DOMAIN_AND_DATA_MODEL.md","docs/bp010/API_INVENTORY.md","docs/bp010/PERMISSION_MATRIX.md","docs/bp010/LIFECYCLE_AND_BUSINESS_RULES.md","docs/bp010/AUDIT_AND_EVENT_MODEL.md","docs/bp010/REVISION_LOG.md",
  "tests/invoice-payment.test.mjs","src/invoicing/index.mjs","src/invoicing/invoice-payment-service.mjs","src/invoicing/manifest.mjs",
  "docs/bp011/DOMAIN_AND_DATA_MODEL.md","docs/bp011/API_INVENTORY.md","docs/bp011/PERMISSION_MATRIX.md","docs/bp011/LIFECYCLE_AND_BUSINESS_RULES.md","docs/bp011/AUDIT_AND_EVENT_MODEL.md","docs/bp011/REVISION_LOG.md",
  "tests/reconciliation.test.mjs","src/administration/index.mjs","src/administration/reconciliation-service.mjs","src/administration/manifest.mjs",
  "docs/bp012/DOMAIN_AND_DATA_MODEL.md","docs/bp012/API_INVENTORY.md","docs/bp012/PERMISSION_MATRIX.md","docs/bp012/RECONCILIATION_AND_EXCEPTION_RULES.md","docs/bp012/AUDIT_AND_EVENT_MODEL.md","docs/bp012/REVISION_LOG.md",
  "tests/warranty.test.mjs","src/warranty/index.mjs","src/warranty/warranty-service.mjs","src/warranty/manifest.mjs",
  "docs/bp013/DOMAIN_AND_DATA_MODEL.md","docs/bp013/API_INVENTORY.md","docs/bp013/PERMISSION_MATRIX.md","docs/bp013/WARRANTY_LIFECYCLE_AND_COVERAGE_RULES.md","docs/bp013/AUDIT_AND_EVENT_MODEL.md","docs/bp013/REVISION_LOG.md",
  "tests/follow-up.test.mjs","src/follow-up/index.mjs","src/follow-up/follow-up-service.mjs","src/follow-up/manifest.mjs",
  "docs/bp014/DOMAIN_AND_DATA_MODEL.md","docs/bp014/API_INVENTORY.md","docs/bp014/PERMISSION_MATRIX.md","docs/bp014/FOLLOW_UP_CADENCE_AND_CONSENT_RULES.md","docs/bp014/AUDIT_AND_EVENT_MODEL.md","docs/bp014/REVISION_LOG.md",
  "tests/reporting.test.mjs","src/reporting/index.mjs","src/reporting/reporting-service.mjs","src/reporting/manifest.mjs",
  "docs/bp015/DOMAIN_AND_DATA_MODEL.md","docs/bp015/API_INVENTORY.md","docs/bp015/PERMISSION_MATRIX.md","docs/bp015/METRIC_AND_REPORT_INVENTORY.md","docs/bp015/SOURCE_AND_CALCULATION_MAP.md","docs/bp015/AUDIT_AND_EVENT_MODEL.md","docs/bp015/REVISION_LOG.md",
  "tests/commerce-operations.test.mjs","src/commerce/index.mjs","src/commerce/commerce-operations-service.mjs","src/commerce/manifest.mjs",
  "docs/commerce-operations/DOMAIN_AND_DATA_MODEL.md","docs/commerce-operations/API_INVENTORY.md","docs/commerce-operations/PERMISSION_AND_AUDIT_MODEL.md","docs/commerce-operations/REVISION_LOG.md",
  "src/intake/index.mjs",
  "src/intake/guided-intake.mjs",
  "src/intake/intake-service.mjs",
  "src/intake/manifest.mjs",
  "docs/bp003/QUESTIONNAIRE_AND_RULES.md",
  "docs/bp003/DOMAIN_AND_DATA_MODEL.md",
  "docs/bp003/API_INVENTORY.md",
  "docs/bp003/PERMISSION_AUDIT_EVENT_MODEL.md",
  "docs/bp003/REVISION_LOG.md",
  "src/customer/index.mjs",
  "src/customer/customer-case-service.mjs",
  "src/customer/manifest.mjs",
  "docs/bp004/DOMAIN_AND_DATA_MODEL.md",
  "docs/bp004/API_INVENTORY.md",
  "docs/bp004/CONVERSION_AND_DEDUPLICATION_RULES.md",
  "docs/bp004/PERMISSION_AUDIT_EVENT_MODEL.md",
  "docs/bp004/REVISION_LOG.md",
  "src/scheduling/index.mjs",
  "src/scheduling/scheduling-service.mjs",
  "src/scheduling/calendar-gateway.mjs",
  "src/scheduling/manifest.mjs",
  "docs/bp005/DOMAIN_AND_DATA_MODEL.md",
  "docs/bp005/API_INVENTORY.md",
  "docs/bp005/SCHEDULING_CALENDAR_RULES.md",
  "docs/bp005/REVISION_LOG.md",
  "src/capacity/index.mjs", "src/capacity/capacity-service.mjs", "src/capacity/manifest.mjs",
  "docs/bp006/DOMAIN_AND_DATA_MODEL.md", "docs/bp006/API_INVENTORY.md", "docs/bp006/PERMISSION_MATRIX.md", "docs/bp006/CAPACITY_CALCULATION_RULES.md", "docs/bp006/AUDIT_AND_EVENT_MODEL.md", "docs/bp006/REVISION_LOG.md",
  "src/security/audit-log.mjs",
  "src/security/index.mjs",
  "src/security/manifest.mjs",
  "src/security/passwords.mjs",
  "src/security/portal-boundary.mjs",
  "src/security/secure-access.mjs",
  "migrations/README.md",
  "migrations/TNGD-BP-003_REFERENCE.md",
  "migrations/TNGD-BP-004_REFERENCE.md",
  "migrations/TNGD-BP-005_REFERENCE.md",
  "migrations/TNGD-BP-006_REFERENCE.md",
  "migrations/TNGD-BP-007_REFERENCE.md",
  "migrations/TNGD-BP-008_REFERENCE.md",
  "migrations/TNGD-BP-009_REFERENCE.md",
  "migrations/TNGD-BP-010_REFERENCE.md",
  "migrations/TNGD-BP-011_REFERENCE.md",
  "migrations/TNGD-BP-012_REFERENCE.md",
  "migrations/TNGD-BP-013_REFERENCE.md",
  "migrations/TNGD-BP-014_REFERENCE.md",
  "migrations/TNGD-BP-015_REFERENCE.md",
  "migrations/TNGD-COMMERCE-OPS_REFERENCE.md",
  "deployment/README.md"
];

const discardedPaths = [
  "src/secure-access.mjs",
  "tests/secure-access.test.mjs"
];

for (const path of requiredPaths) {
  await access(new URL(`../${path}`, import.meta.url), constants.R_OK);
}

for (const path of discardedPaths) {
  try {
    await access(new URL(`../${path}`, import.meta.url), constants.F_OK);
    throw new Error(`Discarded BP-001 implementation path remains: ${path}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8")
);

if (packageJson.private !== true) {
  throw new Error("Pilot package must remain private.");
}

if (packageJson.dependencies || packageJson.devDependencies) {
  throw new Error("Pilot package must remain dependency-free.");
}

for (const script of ["build", "test", "validate", "check", "start"]) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`Missing required script: ${script}`);
  }
}

const canonicalTestCommand =
  "node --test tests/foundation.test.mjs tests/security.test.mjs tests/intake.test.mjs tests/guided-intake.test.mjs tests/customer-case.test.mjs tests/scheduling.test.mjs tests/capacity.test.mjs tests/dispatch.test.mjs tests/field-workflow.test.mjs tests/repair-estimate.test.mjs tests/customer-authorization.test.mjs tests/invoice-payment.test.mjs tests/reconciliation.test.mjs tests/warranty.test.mjs tests/follow-up.test.mjs tests/reporting.test.mjs tests/commerce-operations.test.mjs";
if (packageJson.scripts.test !== canonicalTestCommand) {
  throw new Error("Test command must target canonical BP-000 through BP-015 and Commerce Operations tests.");
}

const buildSource = await readFile(
  new URL("./build.mjs", import.meta.url),
  "utf8"
);
if (buildSource.includes("../src/secure-access.mjs")) {
  throw new Error("Build references the discarded BP-001 implementation.");
}
if (!buildSource.includes("intake-manifest.json")) {
  throw new Error("Build does not generate the canonical BP-002 intake manifest.");
}
if (!buildSource.includes("customer-case-manifest.json")) {
  throw new Error("Build does not generate the canonical BP-004 customer-case manifest.");
}
if (!buildSource.includes("scheduling-manifest.json")) throw new Error("Build does not generate BP-005 scheduling manifest.");
if (!buildSource.includes("capacity-manifest.json")) throw new Error("Build does not generate BP-006 capacity manifest.");
if (!buildSource.includes("dispatch-manifest.json")) throw new Error("Build does not generate BP-007 dispatch manifest.");
if (!buildSource.includes("field-workflow-manifest.json")) throw new Error("Build does not generate BP-008 field-workflow manifest.");
if (!buildSource.includes("repair-estimate-manifest.json")) throw new Error("Build does not generate BP-009 repair-estimate manifest.");
if (!buildSource.includes("customer-authorization-manifest.json")) throw new Error("Build does not generate BP-010 customer-authorization manifest.");
if (!buildSource.includes("invoice-payment-manifest.json")) throw new Error("Build does not generate BP-011 invoice-payment manifest.");
if (!buildSource.includes("reconciliation-manifest.json")) throw new Error("Build does not generate BP-012 reconciliation manifest.");
if (!buildSource.includes("warranty-manifest.json")) throw new Error("Build does not generate BP-013 warranty manifest.");
if (!buildSource.includes("follow-up-manifest.json")) throw new Error("Build does not generate BP-014 follow-up manifest.");
if (!buildSource.includes("reporting-manifest.json")) throw new Error("Build does not generate BP-015 reporting manifest.");
if (!buildSource.includes("commerce-operations-manifest.json")) throw new Error("Build does not generate Commerce Operations manifest.");

const requiredBp001Scope = [
  "authentication",
  "password-recovery",
  "role-enforcement",
  "tenant-isolation",
  "portal-separation",
  "audit-logging",
  "session-management"
];
if (
  JSON.stringify(foundation.authorizedFeatureScope) !==
  JSON.stringify(requiredBp001Scope)
) {
  throw new Error("Foundation BP-001 feature scope does not match authority.");
}

const exactBp002Scope = [
  "repair-intake",
  "estimate-intake",
  "other-services-intake",
  "eight-question-intake-foundation",
  "initial-customer-capture",
  "service-request-creation"
];
if (JSON.stringify(foundation.bp002FeatureScope) !== JSON.stringify(exactBp002Scope)) {
  throw new Error("Foundation metadata expands or omits BP-002 authority.");
}

if (!foundation.implementedPackages.includes("TNGD-BP-002")) {
  throw new Error("Foundation does not identify BP-002 as implemented.");
}

const exactBp003Scope = [
  "eight-question-guided-intake",
  "conditional-intake-rules",
  "autosave-and-resume",
  "intake-media-references",
  "structured-intake-record",
  "bp004-ready-handoff"
];
if (JSON.stringify(foundation.bp003FeatureScope) !== JSON.stringify(exactBp003Scope)) {
  throw new Error("Foundation metadata expands or omits BP-003 authority.");
}
if (!foundation.implementedPackages.includes("TNGD-BP-003")) {
  throw new Error("Foundation does not identify BP-003 as implemented.");
}

const exactBp004Scope = [
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
];
if (JSON.stringify(foundation.bp004FeatureScope) !== JSON.stringify(exactBp004Scope)) {
  throw new Error("Foundation metadata expands or omits BP-004 authority.");
}
if (!foundation.implementedPackages.includes("TNGD-BP-004")) {
  throw new Error("Foundation does not identify BP-004 as implemented.");
}
const exactBp005Scope = ["appointment-creation", "calendar-synchronization", "conflict-detection", "rescheduling", "dispatch-readiness", "scheduling-audit"];
if (JSON.stringify(foundation.bp005FeatureScope) !== JSON.stringify(exactBp005Scope) || !foundation.implementedPackages.includes("TNGD-BP-005")) throw new Error("Foundation BP-005 authority is incorrect.");
if (JSON.stringify(schedulingManifest.capabilities) !== JSON.stringify(exactBp005Scope) || schedulingManifest.handoffTarget !== "TNGD-BP-006" || schedulingManifest.calendarBoundary !== "approved-provider-gateway") throw new Error("BP-005 scheduling manifest is incorrect.");
const exactBp006Scope = ["technician-availability-profiles", "capacity-calculation", "availability-exceptions", "temporary-capacity-overrides", "capability-and-area-filtering", "bp005-bp007-capacity-handoff"];
if (JSON.stringify(foundation.bp006FeatureScope) !== JSON.stringify(exactBp006Scope) || !foundation.implementedPackages.includes("TNGD-BP-006")) throw new Error("Foundation BP-006 authority is incorrect.");
if (capacityManifest.workOrderId !== "TNGD-BP-006" || !capacityManifest.consumers.includes("TNGD-BP-007")) throw new Error("BP-006 capacity manifest is incorrect.");
if(!foundation.implementedPackages.includes("TNGD-BP-007")||dispatchManifest.workOrderId!=="TNGD-BP-007"||dispatchManifest.humanApprovalRequired!==true)throw new Error("BP-007 manifest authority is incorrect.");
const exactBp008Scope=["assigned-technician-mobile-workflow","today-current-next-job-views","field-lifecycle-and-exceptions","25-point-inspection","governed-diagnostic-evidence","immutable-submission","customer-safe-report","bp009-ready-reference-handoff"];
if(!foundation.implementedPackages.includes("TNGD-BP-008")||JSON.stringify(foundation.bp008FeatureScope)!==JSON.stringify(exactBp008Scope)||fieldWorkflowManifest.workOrderId!=="TNGD-BP-008"||fieldWorkflowManifest.componentCount!==19||fieldWorkflowManifest.handoffTarget!=="TNGD-BP-009"||fieldWorkflowManifest.persistence.media!=="references-only")throw new Error("BP-008 manifest authority is incorrect.");
const exactBp009Scope=["repair-service-template","new-door-estimate-template","draft-and-version-lifecycle","diagnostic-reference-lineage","recommendations-options-line-items","outcome-recording","idempotent-estimate-conversion","bp010-ready-authorization-package"];
if(!foundation.implementedPackages.includes("TNGD-BP-009")||JSON.stringify(foundation.bp009FeatureScope)!==JSON.stringify(exactBp009Scope)||repairEstimateManifest.workOrderId!=="TNGD-BP-009"||repairEstimateManifest.handoffTarget!=="TNGD-BP-010")throw new Error("BP-009 manifest authority is incorrect.");
const exactBp010Scope=["authorization-request-and-presentation","adult-acknowledgment","immutable-content-snapshot","signature-or-equivalent-evidence","decision-lifecycle","amendment-and-reauthorization","customer-safe-receipt","bp011-ready-financial-handoff"];
if(!foundation.implementedPackages.includes("TNGD-BP-010")||JSON.stringify(foundation.bp010FeatureScope)!==JSON.stringify(exactBp010Scope)||customerAuthorizationManifest.workOrderId!=="TNGD-BP-010"||customerAuthorizationManifest.handoffTarget!=="TNGD-BP-011")throw new Error("BP-010 manifest authority is incorrect.");
const exactBp011Scope=["invoice-draft-and-finalization","authorized-scope-consumption","immutable-invoice-versions","square-payment-gateway","idempotent-payment-webhooks","transaction-scoped-customer-access","refund-and-exception-evidence","bp012-ready-reconciliation-handoff"];
if(!foundation.implementedPackages.includes("TNGD-BP-011")||JSON.stringify(foundation.bp011FeatureScope)!==JSON.stringify(exactBp011Scope)||invoicePaymentManifest.workOrderId!=="TNGD-BP-011"||invoicePaymentManifest.handoffTarget!=="TNGD-BP-012")throw new Error("BP-011 manifest authority is incorrect.");

if (
  customerCaseManifest.workOrderId !== "TNGD-BP-004" ||
  JSON.stringify(customerCaseManifest.capabilities) !== JSON.stringify(exactBp004Scope) ||
  JSON.stringify(customerCaseManifest.entities) !==
    JSON.stringify(["CustomerRecord", "ServiceCase", "CustomerTimeline"]) ||
  customerCaseManifest.serviceCaseStatus !== "ready-for-scheduling" ||
  customerCaseManifest.handoffTarget !== "TNGD-BP-005" ||
  customerCaseManifest.persistence.boundary !== "in-memory"
) {
  throw new Error("BP-004 customer-case manifest does not match authority.");
}

if (JSON.stringify(intakeManifest.paths) !== JSON.stringify(["repair", "estimate", "other-services"])) {
  throw new Error("Intake manifest does not expose exactly the three authorized paths.");
}

const exactIntakeQuestions = [
  "name",
  "phone",
  "email",
  "serviceAddress",
  "serviceCategory",
  "serviceNeed",
  "urgency",
  "preferredContact"
];
if (JSON.stringify(intakeManifest.questions) !== JSON.stringify(exactIntakeQuestions)) {
  throw new Error("Intake manifest must expose exactly the eight authorized questions.");
}

if (intakeManifest.persistence.boundary !== "in-memory") {
  throw new Error("BP-002 must not select an unauthorized persistence provider.");
}

if (
  JSON.stringify(intakeManifest.workOrderIds) !==
  JSON.stringify(["TNGD-BP-002", "TNGD-BP-003"])
) {
  throw new Error("Intake manifest work-order ownership is incorrect.");
}
if (
  intakeManifest.guidedIntake.primaryQuestionCount !== 8 ||
  intakeManifest.guidedIntake.questions.length !== 8 ||
  intakeManifest.guidedIntake.presentation !== "one-at-a-time" ||
  intakeManifest.guidedIntake.autosave !== "after-each-answer" ||
  intakeManifest.guidedIntake.handoffTarget !== "TNGD-BP-004"
) {
  throw new Error("BP-003 manifest does not preserve the guided-intake contract.");
}

if (!securityManifest.capabilities.includes("password-recovery")) {
  throw new Error("BP-001 password-recovery capability is missing.");
}

const secureAccessSource = await readFile(
  new URL("../src/security/secure-access.mjs", import.meta.url),
  "utf8"
);
if (!secureAccessSource.includes("new AuditLog()")) {
  throw new Error("Secure access must retain non-discarding default audit storage.");
}
if (!secureAccessSource.includes("keyForIdentity(tenantId, email)")) {
  throw new Error("Identity lookup must remain tenant-keyed.");
}
if (!secureAccessSource.includes("#tenantBootstrapReservations")) {
  throw new Error("Tenant bootstrap must retain an atomic per-tenant reservation.");
}
if (!secureAccessSource.includes("reset.consumingAt")) {
  throw new Error("Password reset must retain atomic token consumption.");
}

const securityTestSource = await readFile(
  new URL("../tests/security.test.mjs", import.meta.url),
  "utf8"
);
for (const evidenceName of [
  "exactly one concurrent tenant bootstrap succeeds",
  "exactly one concurrent password reset succeeds"
]) {
  if (!securityTestSource.includes(evidenceName)) {
    throw new Error(`Missing concurrency evidence: ${evidenceName}`);
  }
}

const customerCaseSource = await readFile(
  new URL("../src/customer/customer-case-service.mjs", import.meta.url),
  "utf8"
);
for (const requiredBoundary of [
  "convertAuthorized",
  'permission: "customers.write"',
  "getRecordAuthorized",
  "#customerIdentityIndex",
  'status: "ready-for-scheduling"',
  'targetPackage: "TNGD-BP-005"',
  "originalEvidence",
  "auditEventIds"
]) {
  if (!customerCaseSource.includes(requiredBoundary)) {
    throw new Error(`BP-004 customer-case boundary is missing: ${requiredBoundary}`);
  }
}
for (const forbiddenBoundary of ["scheduledAt", "calendarEventId", "technicianId"]) {
  if (customerCaseSource.includes(forbiddenBoundary)) {
    throw new Error(`BP-004 improperly implements scheduling: ${forbiddenBoundary}`);
  }
}

const customerCaseTestSource = await readFile(
  new URL("../tests/customer-case.test.mjs", import.meta.url),
  "utf8"
);
for (const evidenceName of [
  "completed guided intake creates one governed customer, service case, timeline, and BP-005 handoff",
  "repeat conversion is idempotent and does not create duplicate cases",
  "matching email or phone reuses the tenant customer while creating a new service case",
  "tenant boundaries and customer permissions govern conversion and reads",
  "intake evidence remains immutable and scheduling behavior is not implemented"
]) {
  if (!customerCaseTestSource.includes(evidenceName)) {
    throw new Error(`Missing BP-004 evidence: ${evidenceName}`);
  }
}
for (const lcoBoundary of [
  "updateCustomerAuthorized",
  "parseName",
  "firstName",
  "lastName",
  "displayName",
  "mobileNumber",
  "homeNumber",
  "workNumber",
  "additionalEmails",
  "customerType",
  "isContractor",
  "addresses",
  "streetLine1",
  "billsTo",
  "acceptsBillsFrom",
  "leadSource",
  "doNotService",
  "notificationsEnabled",
  "customerCreatedAt",
  "lastServiceDate",
  "lifetimeValue",
  "immutableFields",
  "CustomerRecordUpdated",
  "createCustomerAuthorized",
  "CustomerRecordCreated"
]) {
  if (!customerCaseSource.includes(lcoBoundary)) {
    throw new Error(`BP-004.1 LCO boundary missing: ${lcoBoundary}`);
  }
}
for (const lcoEvidence of [
  "customer record contains all HCP-template fields after intake conversion",
  "update enriches existing customer without overwriting intake evidence",
  "identity matching still works with expanded customer records",
  "doNotService flag is preserved and queryable after update",
  "backward-compatible intake customers have valid defaults for all expanded fields",
  "tenant isolation preserved through customer update operations",
  "direct customer creation populates full HCP schema without intake",
  "batch import deduplicates by email and phone within tenant"
]) {
  if (!customerCaseTestSource.includes(lcoEvidence)) {
    throw new Error(`Missing BP-004.1 LCO evidence: ${lcoEvidence}`);
  }
}

const schedulingSource = await readFile(new URL("../src/scheduling/scheduling-service.mjs", import.meta.url), "utf8");
for (const boundary of ["scheduleAuthorized", "rescheduleAuthorized", 'permission: "scheduling.manage"', "#assertNoConflict", 'status: "scheduled"', 'technicianAssignmentStatus: "ready-for-bp006"', 'targetPackage: "TNGD-BP-006"']) if (!schedulingSource.includes(boundary)) throw new Error(`BP-005 boundary missing: ${boundary}`);
for (const forbidden of ["assignTechnician", "optimizeRoute", "dispatchAuthorized"]) if (schedulingSource.includes(forbidden)) throw new Error(`BP-005 improperly implements BP-006: ${forbidden}`);

const schedulingTests = await readFile(new URL("../tests/scheduling.test.mjs", import.meta.url), "utf8");
for (const evidence of ["creates one synchronized BP-006-ready appointment", "idempotent per tenant Service Case", "overlapping tenant appointments are rejected", "rescheduling updates the same calendar event", "technicians cannot schedule and BP-006 dispatch is not implemented"]) if (!schedulingTests.includes(evidence)) throw new Error(`Missing BP-005 evidence: ${evidence}`);

const capacitySource = await readFile(new URL("../src/capacity/capacity-service.mjs", import.meta.url), "utf8");
for (const boundary of ["configureProfileAuthorized", "addExceptionAuthorized", "addOverrideAuthorized", "calculateAuthorized", 'permission: "dispatch.manage"', 'permission: "scheduling.manage"', 'dispatch: "TNGD-BP-007"']) if (!capacitySource.includes(boundary)) throw new Error(`BP-006 boundary missing: ${boundary}`);
for (const forbidden of ["assignTechnicianAuthorized", "routeOptimization", "dispatchBoard"]) if (capacitySource.includes(forbidden)) throw new Error(`BP-006 improperly implements BP-007: ${forbidden}`);
const capacityTests = await readFile(new URL("../tests/capacity.test.mjs", import.meta.url), "utf8");
for (const evidence of ["shift setup exposes service-capable capacity", "PTO and blackout dates block capacity", "capability, service area, equipment, vehicle, and emergency requirements", "same-day limits and overlapping assignments", "authorized reasoned override increases temporary capacity", "tenant and role enforcement prevent technician capacity administration"]) if (!capacityTests.includes(evidence)) throw new Error(`Missing BP-006 evidence: ${evidence}`);
const dispatchSource=await readFile(new URL("../src/dispatch/dispatch-service.mjs",import.meta.url),"utf8");for(const b of ["createWorkItemAuthorized","recommendAuthorized","assignAuthorized","reassignAuthorized","returnToQueueAuthorized","dispatchAuthorized","handoffAuthorized","Recommendation requester cannot approve"])if(!dispatchSource.includes(b))throw new Error(`BP-007 boundary missing: ${b}`);for(const f of ["executeJobAuthorized","createEstimate","processPayment","liveTrafficProvider"])if(dispatchSource.includes(f))throw new Error(`BP-007 forbidden scope: ${f}`);
const dispatchTests=await readFile(new URL("../tests/dispatch.test.mjs",import.meta.url),"utf8");for(const e of ["idempotent unassigned work item","capacity-aware recommendation","human approval separation","immutable assignment history","return to queue and dispatch lifecycle","exceptions are opened and resolved","assigned technician receives"])if(!dispatchTests.includes(e))throw new Error(`Missing BP-007 evidence: ${e}`);
const fieldSource=await readFile(new URL("../src/field-workflow/field-workflow-service.mjs",import.meta.url),"utf8");
for(const boundary of ["listJobsAuthorized","openAuthorized","transitionAuthorized","startInspectionAuthorized","recordItemAuthorized","attachMediaReferenceAuthorized","submitAuthorized","shareDiagnosticReportAuthorized","addExceptionAuthorized","administrativeViewAuthorized",'targetPackage: "TNGD-BP-009"','action: "repair-or-estimate-pending"',"Submitted inspection evidence is immutable","Repair requires the 25-Point Inspection","Does Not Apply", "listHandoffsAuthorized"])if(!fieldSource.includes(boundary))throw new Error(`BP-008 boundary missing: ${boundary}`);
for(const forbidden of ["createRepairAuthorized","createEstimateAuthorized","authorizeCustomerAuthorized","createInvoiceAuthorized","processPaymentAuthorized","determineWarrantyAuthorized","garageDoorOrderForm","computerVision","aiDiagnosis"])if(fieldSource.includes(forbidden))throw new Error(`BP-008 forbidden scope: ${forbidden}`);
const fieldTests=await readFile(new URL("../tests/field-workflow.test.mjs",import.meta.url),"utf8");
for(const evidence of ["assigned technician receives today, current, and next views","unassigned technicians cannot view, open, or mutate","field lifecycle permits pause and resume","exactly nineteen source components and four governed results","repair submission blocks missing inspection","submits immutable evidence and a BP-009-ready reference handoff","estimate inspection is optional","governed references without binary duplication","exclude internal-only notes","exceptions return to administration","tenant isolation, role enforcement, idempotency, and audit history"])if(!fieldTests.includes(evidence))throw new Error(`Missing BP-008 evidence: ${evidence}`);
const executionSource=await readFile(new URL("../src/repair-estimate/repair-estimate-service.mjs",import.meta.url),"utf8");
for(const boundary of ["Garage Door Repair | Service","New Garage Door Estimate","executionHandoffAuthorized","25-Point Inspection","two-year parts warranty","90-day service coverage","finalized","reviseAuthorized","prepareAuthorizationPackageAuthorized","pending-authorization","convertEstimateAuthorized","authorizationEvidenceReferenceId"])if(!executionSource.includes(boundary))throw new Error(`BP-009 boundary missing: ${boundary}`);
for(const forbidden of ["authorizeCustomerAuthorized","createInvoiceAuthorized","processPaymentAuthorized","determineWarrantyAuthorized","garageDoorOrderForm","aiGeneratedPricing"])if(executionSource.includes(forbidden))throw new Error(`BP-009 forbidden scope: ${forbidden}`);
const executionTests=await readFile(new URL("../tests/repair-estimate.test.mjs",import.meta.url),"utf8");
for(const evidence of ["both approved templates and exact standard Service and Warranty line items","repair requires BP-008 inspection while estimate inspection remains optional","draft creation is idempotent and preserves customer Service Case and evidence references","finalized versions are immutable and corrections create a new version","BP-010 package remains pending and does not authorize work","accepted estimate conversion preserves lineage without duplicate customer or Service Case","tenant and role enforcement plus audit history remain intact","no authorization invoice payment warranty decision or detailed order execution is exposed"])if(!executionTests.includes(evidence))throw new Error(`Missing BP-009 evidence: ${evidence}`);
const authorizationSource=await readFile(new URL("../src/customer-authorization/customer-authorization-service.mjs",import.meta.url),"utf8");
for(const boundary of ["createRequestAuthorized","decide","revoke","amendAuthorized","receipt","financialHandoffAuthorized","immutable","adultAcknowledged","signatureEvidence",'targetPackage:"TNGD-BP-011"','status:"authorization-confirmed"',"cannot authorize for the customer","Governed transaction access"])if(!authorizationSource.includes(boundary))throw new Error(`BP-010 boundary missing: ${boundary}`);
for(const forbidden of ["createInvoiceAuthorized","processPaymentAuthorized","storeCardAuthorized","determineWarrantyAuthorized"])if(authorizationSource.includes(forbidden))throw new Error(`BP-010 forbidden scope: ${forbidden}`);
const authorizationTests=await readFile(new URL("../tests/customer-authorization.test.mjs",import.meta.url),"utf8");
for(const evidence of ["authorization binds one immutable BP-009 version","authorization request creation is idempotent","authorized adult acknowledgment and signature evidence are required","employees technicians AI and unauthenticated calls cannot authorize","accepted and declined evidence is immutable","expired requests reject decisions","changed scope or price requires amendment","customer-safe receipt excludes transaction token","BP-011 handoff requires current approval","tenant role and audit boundaries remain intact"])if(!authorizationTests.includes(evidence))throw new Error(`Missing BP-010 evidence: ${evidence}`);
const invoiceSource=await readFile(new URL("../src/invoicing/invoice-payment-service.mjs",import.meta.url),"utf8");
for(const boundary of ["createDraftAuthorized","finalizeAuthorized","createPaymentLinkAuthorized","processWebhook","refundAuthorized","reconciliationHandoffAuthorized","customerView","issueCustomerAccessAuthorized","financialHandoffAuthorized","Prohibited card data","verifyWebhook",'targetPackage:"TNGD-BP-012"'])if(!invoiceSource.includes(boundary))throw new Error(`BP-011 boundary missing: ${boundary}`);
for(const forbidden of ["resolveReconciliationAuthorized","determineWarrantyAuthorized","followUpAuthorized","garageDoorOrderForm"])if(invoiceSource.includes(forbidden))throw new Error(`BP-011 forbidden scope: ${forbidden}`);
const invoiceTests=await readFile(new URL("../tests/invoice-payment.test.mjs",import.meta.url),"utf8");
for(const evidence of ["authorized BP-010 scope produces one tenant-safe invoice","diagnostic report attaches by default","finalized invoice versions are immutable and content-hashed","Square payment links are retry-safe","webhook authenticity and idempotency govern payment state","prohibited card data is rejected","customer invoice access is transaction-scoped","refund requires authorized human reason","failures and disputes produce a BP-012 reference-only exception handoff","tenant role audit and later-package boundaries remain intact"])if(!invoiceTests.includes(evidence))throw new Error(`Missing BP-011 evidence: ${evidence}`);
const exactBp012Scope=["administrative-completion-review","evidence-completeness-checks","exception-categorization-and-ownership","self-approval-prevention","escalation-and-resolution-lifecycle","reconciliation-difference-tracking","immutable-review-and-resolution-history","bp013-bp014-ready-handoffs"];
if(!foundation.implementedPackages.includes("TNGD-BP-012")||JSON.stringify(foundation.bp012FeatureScope)!==JSON.stringify(exactBp012Scope)||reconciliationManifest.workOrderId!=="TNGD-BP-012"||reconciliationManifest.selfApprovalPrevention!==true||JSON.stringify(reconciliationManifest.handoffTargets)!==JSON.stringify(["TNGD-BP-013","TNGD-BP-014"]))throw new Error("BP-012 manifest authority is incorrect.");
const reconciliationSource=await readFile(new URL("../src/administration/reconciliation-service.mjs",import.meta.url),"utf8");
for(const boundary of ["queueForReviewAuthorized","beginReviewAuthorized","checkEvidenceAuthorized","createExceptionAuthorized","assignExceptionAuthorized","returnExceptionAuthorized","escalateExceptionAuthorized","resolveExceptionAuthorized","reopenExceptionAuthorized","completeReviewAuthorized","outstandingAuthorized","createHandoffAuthorized","creator cannot approve","TNGD-BP-013","TNGD-BP-014"])if(!reconciliationSource.includes(boundary))throw new Error(`BP-012 boundary missing: ${boundary}`);
for(const forbidden of ["processPaymentAuthorized","adjudicateWarrantyAuthorized","deliverFollowUpAuthorized","autonomousResolveAuthorized"])if(reconciliationSource.includes(forbidden))throw new Error(`BP-012 forbidden scope: ${forbidden}`);
const reconciliationTests=await readFile(new URL("../tests/reconciliation.test.mjs",import.meta.url),"utf8");
for(const evidence of ["tenant-safe completion review queues work and deduplicates","evidence checks track verification status","exception creation requires category","self-approval prevention blocks exception creator","escalation records are immutable","resolution requires evidence and reason","reopen creates a new immutable decision","completion blocked while blocking exceptions","outstanding view shows unresolved reviews","BP-013 and BP-014 handoffs distinguish warranty","reconciliation differences and immutable history","tenant isolation and role boundaries remain intact"])if(!reconciliationTests.includes(evidence))throw new Error(`Missing BP-012 evidence: ${evidence}`);

const exactBp013Scope=["warranty-policy-and-registration","warranty-claim-intake","eligibility-and-coverage-assessment","findings-decision-and-resolution","warranty-lifecycle-governance","self-approval-prevention","superseding-corrections","bp014-ready-handoff"];
if(!foundation.implementedPackages.includes("TNGD-BP-013")||JSON.stringify(foundation.bp013FeatureScope)!==JSON.stringify(exactBp013Scope)||warrantyManifest.workOrderId!=="TNGD-BP-013"||warrantyManifest.selfApprovalPrevention!==true||JSON.stringify(warrantyManifest.handoffTargets)!==JSON.stringify(["TNGD-BP-014"]))throw new Error("BP-013 manifest authority is incorrect.");
const warrantySource=await readFile(new URL("../src/warranty/warranty-service.mjs",import.meta.url),"utf8");
for(const boundary of ["createPolicyAuthorized","registerWorkAuthorized","createClaimAuthorized","assessEligibilityAuthorized","recordFindingAuthorized","submitDecisionAuthorized","supersedeDecisionAuthorized","beginResolutionAuthorized","completeResolutionAuthorized","closeClaimAuthorized","createHandoffAuthorized","creator cannot approve","TNGD-BP-014","partsCoverageDays","serviceCoverageDays","advisory: true"])if(!warrantySource.includes(boundary))throw new Error(`BP-013 boundary missing: ${boundary}`);
for(const forbidden of ["processPaymentAuthorized","deliverCommunicationAuthorized","generateAiFindings","automateFollowUpAuthorized"]){const pattern=new RegExp(`${forbidden}\\s*\\([^)]*\\)\\s*\\{[^}]*does not`);if(warrantySource.includes(forbidden)&&!pattern.test(warrantySource))throw new Error(`BP-013 forbidden scope implemented: ${forbidden}`);}
const warrantyTests=await readFile(new URL("../tests/warranty.test.mjs",import.meta.url),"utf8");
for(const evidence of ["standard policy distinguishes two-year parts and 90-day service coverage","registration preserves exact policy and source-work lineage with idempotency","duplicate claim prevention returns existing claim","parts expiration blocks eligibility after two years","eligibility derived from authoritative dates within coverage period","covered, partially-covered, and denied decisions require human authorization","self-approval prevention blocks claim creator from deciding","missing evidence and invalid transitions are rejected","immutable finalized decisions and superseding corrections","resolution lifecycle from approval through closure","source-record non-mutation and BP-014 handoff","tenant isolation and role boundaries remain intact through BP-012","findings require description and are recorded against claim"])if(!warrantyTests.includes(evidence))throw new Error(`Missing BP-013 evidence: ${evidence}`);

const exactBp014Scope=["follow-up-policy-and-versioning","five-cadence-scheduling","authoritative-eligibility","consent-recheck-and-opt-out","task-and-communication-handoffs","immutable-suppression-evidence","reasoned-rescheduling-and-supersession","communications-only-delivery"];
if(!foundation.implementedPackages.includes("TNGD-BP-014")||JSON.stringify(foundation.bp014FeatureScope)!==JSON.stringify(exactBp014Scope)||followUpManifest.workOrderId!=="TNGD-BP-014"||followUpManifest.communicationBoundary!=="APP-006"||JSON.stringify(followUpManifest.cadences)!==JSON.stringify(["immediate","short-term","two-month","six-month","annual"]))throw new Error("BP-014 manifest authority is incorrect.");
const followUpSource=await readFile(new URL("../src/follow-up/follow-up-service.mjs",import.meta.url),"utf8");
for(const boundary of ["createPolicyAuthorized","evaluateEligibilityAuthorized","scheduleActivityAuthorized","recheckConsentAuthorized","suppressActivityAuthorized","rescheduleActivityAuthorized","createTaskHandoffAuthorized","createCommunicationHandoffAuthorized","recordHandoffOutcomeAuthorized","APP-006","APP-012","consentGranted","Consent must be verified"])if(!followUpSource.includes(boundary))throw new Error(`BP-014 boundary missing: ${boundary}`);
for(const forbidden of ["deliverEmailAuthorized","deliverSmsAuthorized","createConsentAuthorized","publishReviewAuthorized","generateReportAuthorized"]){const pat=new RegExp(`${forbidden}\\s*\\([^)]*\\)\\s*\\{[^}]*does not`);if(followUpSource.includes(forbidden)&&!pat.test(followUpSource))throw new Error(`BP-014 forbidden scope implemented: ${forbidden}`);}
const followUpTests=await readFile(new URL("../tests/follow-up.test.mjs",import.meta.url),"utf8");
for(const evidence of ["all five roadmap cadences are scheduled with correct due-date offsets","authoritative eligibility evaluates consent and policy state","current-consent recheck suppresses activity when consent withdrawn","opt-out suppression with explicit reason and immutable evidence","follow-up survives after service case and job closure","duplicate-handoff prevention returns existing handoff","Communications-only delivery through governed handoff boundary","handoff requires consent verification","reasoned rescheduling supersedes original and creates new activity","source-record non-mutation and immutable finalized evidence","tenant isolation and role boundaries remain intact through BP-013","policy versioning preserves history and updates current version","handoff outcome records completed and failed states"])if(!followUpTests.includes(evidence))throw new Error(`Missing BP-014 evidence: ${evidence}`);

const exactBp015Scope=["report-and-metric-definitions","governed-report-generation","tenant-safe-operational-views","deterministic-metric-calculations","point-in-time-snapshots","authorized-export-definitions","source-reference-traceability","data-quality-exception-representation"];
if(!foundation.implementedPackages.includes("TNGD-BP-015")||JSON.stringify(foundation.bp015FeatureScope)!==JSON.stringify(exactBp015Scope)||reportingManifest.workOrderId!=="TNGD-BP-015"||JSON.stringify(reportingManifest.calculationMethods)!==JSON.stringify(["count","rate","sum","status-distribution"])||JSON.stringify(reportingManifest.exportFormats)!==JSON.stringify(["csv","json"]))throw new Error("BP-015 manifest authority is incorrect.");
const reportingSource=await readFile(new URL("../src/reporting/reporting-service.mjs",import.meta.url),"utf8");
for(const boundary of ["defineMetricAuthorized","createDefinitionAuthorized","generateReportAuthorized","finalizeSnapshotAuthorized","recordExceptionAuthorized","requestExportAuthorized","listDefinitionsAuthorized","getResultsAuthorized","getSnapshotHistoryAuthorized","inspectSourceReferencesAuthorized","getExportStatusAuthorized","businessMeaning","authoritativeSource","calculationMethod","unavailableDataBehavior","sourceReferences"])if(!reportingSource.includes(boundary))throw new Error(`BP-015 boundary missing: ${boundary}`);
for(const forbidden of ["predictiveModelAuthorized","aiConclusionAuthorized","automateDecisionAuthorized","crossTenantBenchmarkAuthorized","mutateSourceAuthorized","autonomousResolutionAuthorized","deliverCommunicationAuthorized","externalBiAuthorized"]){const pat=new RegExp(`${forbidden}\\s*\\([^)]*\\)\\s*\\{[^}]*does not`);if(reportingSource.includes(forbidden)&&!pat.test(reportingSource))throw new Error(`BP-015 forbidden scope implemented: ${forbidden}`);}
const reportingTests=await readFile(new URL("../tests/reporting.test.mjs",import.meta.url),"utf8");
for(const evidence of ["deterministic metric calculations produce consistent results from governed source data","metric definitions require complete business specification","source-reference traceability links each result to its origin package","missing and stale source data are represented as explicit exceptions","timezone and date-boundary filtering respects governed timestamps","filter validation rejects invalid criteria","finalized snapshot is immutable and reproducible","idempotent report generation returns existing report","export authorization restricts to administrative roles","unresolved exceptions remain visible in report results","role-limited access prevents unauthorized report generation and export","reporting does not mutate source records from BP-002 through BP-014","tenant isolation and role boundaries remain intact through BP-014","operational views cover the complete accepted pilot loop"])if(!reportingTests.includes(evidence))throw new Error(`Missing BP-015 evidence: ${evidence}`);

for (const correctedBoundary of [
  "this.#scheduling.listAuthorized({ sessionToken, tenantId })",
  'governedDistance(travelDistanceMiles, "Travel distance")',
  'governedCapacityInteger(dailyLimit, "Daily capacity", 1)',
  'governedCapacityInteger(sameDayLimit, "Same-day capacity")',
  'governedCapacityInteger(emergencyDailyLimit, "Emergency capacity")',
  'governedCapacityInteger(additionalCapacity, "Override capacity")',
  "const assignedOnDate = assigned.filter",
  "limit - assignedOnDate.length",
  "overrideId: override.id",
  "additionalCapacity: override.additionalCapacity",
  "reason: override.reason"
]) {
  if (!capacitySource.includes(correctedBoundary)) {
    throw new Error(`Missing BP-006.2 corrected boundary: ${correctedBoundary}`);
  }
}

for (const correctedEvidence of [
  "partial-day exceptions block only overlapping intervals",
  "governed travel input rejects omission and invalid distances",
  "remaining capacity counts only appointments on the requested date",
  "capacity and override amounts reject malformed or ungoverned numeric values",
  "authorized reasoned override increases temporary capacity and remains auditable"
]) {
  if (!capacityTests.includes(correctedEvidence)) {
    throw new Error(`Missing BP-006.2 correction evidence: ${correctedEvidence}`);
  }
}

const portalSource = await readFile(
  new URL("../src/security/portal-boundary.mjs", import.meta.url),
  "utf8"
);
if (!portalSource.includes('action !== "intake.submit"')) {
  throw new Error("Public portal must retain the approved action allowlist.");
}

const intakeSource = await readFile(
  new URL("../src/intake/intake-service.mjs", import.meta.url),
  "utf8"
);
for (const requiredBoundary of [
  "submitAuthorized",
  'permission: "intake.create"',
  'action: "intake.create"',
  "customerKey(tenantId, answers)"
]) {
  if (!intakeSource.includes(requiredBoundary)) {
    throw new Error(`BP-002 intake boundary is missing: ${requiredBoundary}`);
  }
}

const intakeTestSource = await readFile(
  new URL("../tests/intake.test.mjs", import.meta.url),
  "utf8"
);
for (const evidenceName of [
  "all three authorized intake paths create service requests",
  "the intake foundation requires all eight authorized answers",
  "initial customer capture reuses a tenant customer and isolates tenants",
  "authorized portal users create intake while denied users cannot mutate state",
  "approved public intake integrates through the secure portal allowlist"
]) {
  if (!intakeTestSource.includes(evidenceName)) {
    throw new Error(`Missing BP-002 evidence: ${evidenceName}`);
  }
}

const guidedIntakeSource = await readFile(
  new URL("../src/intake/guided-intake.mjs", import.meta.url),
  "utf8"
);
for (const requiredBoundary of [
  "PRIMARY_QUESTIONS",
  "startAuthorized",
  "answerAuthorized",
  "resumeAuthorized",
  "attachMediaAuthorized",
  "completeAuthorized",
  'permission: "intake.create"',
  'permission: "intake.read"',
  'status: "ready-for-bp004"',
  'targetPackage: "TNGD-BP-004"',
  '"photo", "voice-note"',
  "originalEvidence",
  "auditEventIds"
]) {
  if (!guidedIntakeSource.includes(requiredBoundary)) {
    throw new Error(`BP-003 guided-intake boundary is missing: ${requiredBoundary}`);
  }
}

const guidedIntakeTestSource = await readFile(
  new URL("../tests/guided-intake.test.mjs", import.meta.url),
  "utf8"
);
for (const evidenceName of [
  "repair, estimate, and other-service paths produce BP-004-ready records",
  "one-at-a-time questions enforce adaptive and conditional requirements",
  "every answer autosaves and a session resumes at the next question",
  "photo and voice-note references remain immutable original evidence",
  "tenant and role enforcement prevent unauthorized guided-intake mutation",
  "completed records retain user, source, timestamps, and valid audit history"
]) {
  if (!guidedIntakeTestSource.includes(evidenceName)) {
    throw new Error(`Missing BP-003 evidence: ${evidenceName}`);
  }
}

const environment = await readFile(
  new URL("../.env.example", import.meta.url),
  "utf8"
);

for (const name of [
  "MASS_RUNTIME_ENV",
  "MASS_DATABASE_URL",
  "MASS_DEPLOYMENT_TARGET"
]) {
  if (!environment.includes(`${name}=`)) {
    throw new Error(`Missing environment declaration: ${name}`);
  }
}

try {
  await access(new URL("../.env", import.meta.url), constants.F_OK);
  throw new Error("A real .env file must not be committed.");
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}


const exactCommerceScope=["catalog-administration","governed-categories","tax-treatment","modifier-sets","controlled-discounts","deposit-configuration","authorized-ad-hoc-lines","bp009-bp012-commerce-integration"];
if(!foundation.implementedPackages.includes("TNGD-DISPATCH-V1-COMMERCE-OPS")||JSON.stringify(foundation.commerceOperationsFeatureScope)!==JSON.stringify(exactCommerceScope)||commerceOperationsManifest.workOrderId!=="TNGD-DISPATCH-V1-COMMERCE-OPS"||commerceOperationsManifest.paymentAuthority!=="TNGD-BP-011")throw new Error("Commerce Operations manifest authority is incorrect.");
const commerceSource=await readFile(new URL("../src/commerce/commerce-operations-service.mjs",import.meta.url),"utf8");
for(const boundary of ["createCategoryAuthorized","createModifierSetAuthorized","createItemAuthorized","updateItemAuthorized","deactivateItemAuthorized","createDiscountAuthorized","addCatalogLineAuthorized","addAdHocLineAuthorized","applyDiscountAuthorized","setDepositAuthorized","catalogRevision","taxable","approvalReason","operations.commerce.manage"])if(!commerceSource.includes(boundary))throw new Error(`Commerce Operations boundary missing: ${boundary}`);
const commerceTests=await readFile(new URL("../tests/commerce-operations.test.mjs",import.meta.url),"utf8");
for(const evidence of ["administrator creates governed categories services tax treatment and reusable modifiers without code changes","catalog line snapshots preserve price tax modifier provenance after catalog edits and deactivation","assigned technician adds an attributed ad-hoc line without polluting the permanent catalog","fixed and percentage discounts enforce authority and retain attributable evidence","none fixed percentage and governed custom deposits calculate one existing payment balance","approved commercial snapshot reaches BP-011 invoice and Square handoff without a duplicate ledger","tenant isolation and malformed commercial values remain rejected"])if(!commerceTests.includes(evidence))throw new Error(`Missing Commerce Operations evidence: ${evidence}`);
const commerceInvoiceSource=await readFile(new URL("../src/invoicing/invoice-payment-service.mjs",import.meta.url),"utf8");
if(!commerceInvoiceSource.includes("createFromAuthorizationAuthorized")||!commerceInvoiceSource.includes("handoff.lineItems")||!commerceInvoiceSource.includes("commerce.depositCents"))throw new Error("Commerce Operations does not flow through the canonical BP-011 invoice boundary.");
for(const forbidden of ["createParallelInvoiceLedger","replaceSquareGateway","advancedTaxEngine","pricingIntelligence","automaticMarketPrice","campaignManager","garageDoorOrderForm"])if(commerceSource.includes(forbidden))throw new Error(`Forbidden Commerce Operations scope implemented: ${forbidden}`);

process.stdout.write("Canonical BP-000 through BP-015 and Commerce Operations repository validation passed.\n");
