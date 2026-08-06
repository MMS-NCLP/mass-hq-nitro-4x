import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { foundation } from "../src/foundation.mjs";
import { securityManifest } from "../src/security/index.mjs";

const requiredPaths = [
  ".env.example",
  ".gitignore",
  "package.json",
  "src/foundation.mjs",
  "scripts/build.mjs",
  "scripts/validate-repository.mjs",
  "tests/foundation.test.mjs",
  "tests/security.test.mjs",
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
  "node --test tests/foundation.test.mjs tests/security.test.mjs";
if (packageJson.scripts.test !== canonicalTestCommand) {
  throw new Error("Test command must target only canonical BP-000/BP-001 tests.");
}

const buildSource = await readFile(
  new URL("./build.mjs", import.meta.url),
  "utf8"
);
if (buildSource.includes("../src/secure-access.mjs")) {
  throw new Error("Build references the discarded BP-001 implementation.");
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
if (
  JSON.stringify(foundation.deferredToBp002) !==
  JSON.stringify(exactBp002Scope)
) {
  throw new Error("Foundation metadata expands or omits BP-002 authority.");
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

const portalSource = await readFile(
  new URL("../src/security/portal-boundary.mjs", import.meta.url),
  "utf8"
);
if (!portalSource.includes('action !== "intake.submit"')) {
  throw new Error("Public portal must retain the approved action allowlist.");
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

process.stdout.write("Canonical BP-000/BP-001 repository validation passed.\n");
