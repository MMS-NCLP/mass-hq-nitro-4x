import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { foundation } from "../src/foundation.mjs";
import { securityManifest } from "../src/security/index.mjs";
import { intakeManifest } from "../src/intake/index.mjs";
import { customerCaseManifest } from "../src/customer/index.mjs";

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
  "src/security/audit-log.mjs",
  "src/security/index.mjs",
  "src/security/manifest.mjs",
  "src/security/passwords.mjs",
  "src/security/portal-boundary.mjs",
  "src/security/secure-access.mjs",
  "migrations/README.md",
  "migrations/TNGD-BP-003_REFERENCE.md",
  "migrations/TNGD-BP-004_REFERENCE.md",
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
  "node --test tests/foundation.test.mjs tests/security.test.mjs tests/intake.test.mjs tests/guided-intake.test.mjs tests/customer-case.test.mjs";
if (packageJson.scripts.test !== canonicalTestCommand) {
  throw new Error("Test command must target canonical BP-000 through BP-004 tests.");
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

process.stdout.write("Canonical BP-000/BP-001/BP-002/BP-003/BP-004 repository validation passed.\n");
