import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { foundation } from "../src/foundation.mjs";
import { securityManifest } from "../src/security/index.mjs";
import { intakeManifest } from "../src/intake/index.mjs";
import { customerCaseManifest } from "../src/customer/index.mjs";
import { schedulingManifest } from "../src/scheduling/index.mjs";
import { capacityManifest } from "../src/capacity/index.mjs";
import { dispatchManifest } from "../src/dispatch/index.mjs";

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
  "node --test tests/foundation.test.mjs tests/security.test.mjs tests/intake.test.mjs tests/guided-intake.test.mjs tests/customer-case.test.mjs tests/scheduling.test.mjs tests/capacity.test.mjs tests/dispatch.test.mjs";
if (packageJson.scripts.test !== canonicalTestCommand) {
  throw new Error("Test command must target canonical BP-000 through BP-006 tests.");
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
  "bp005-ready-handoff"
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

process.stdout.write("Canonical BP-000 through BP-007 repository validation passed.\n");
