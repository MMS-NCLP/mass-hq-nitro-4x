import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { foundation } from "../src/foundation.mjs";
import { securityManifest } from "../src/security/index.mjs";
import { intakeManifest } from "../src/intake/index.mjs";

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
  "src/intake/index.mjs",
  "src/intake/intake-service.mjs",
  "src/intake/manifest.mjs",
  "src/security/audit-log.mjs",
  "src/security/index.mjs",
  "src/security/manifest.mjs",
  "src/security/passwords.mjs",
  "src/security/portal-boundary.mjs",
  "src/security/secure-access.mjs",
  "migrations/README.md",
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
  "node --test tests/foundation.test.mjs tests/security.test.mjs tests/intake.test.mjs";
if (packageJson.scripts.test !== canonicalTestCommand) {
  throw new Error("Test command must target canonical BP-000/BP-001/BP-002 tests.");
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

process.stdout.write("Canonical BP-000/BP-001/BP-002 repository validation passed.\n");
