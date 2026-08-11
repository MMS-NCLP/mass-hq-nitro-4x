import { pathToFileURL } from "node:url";

export const foundation = Object.freeze({
  projectId: "MASS-TNGD-PILOT-001",
  implementedPackages: Object.freeze([
    "TNGD-BP-000",
    "TNGD-BP-001",
    "TNGD-BP-002",
    "TNGD-BP-003"
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
  ])
});

const invokedDirectly =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  process.stdout.write(`${JSON.stringify(foundation, null, 2)}\n`);
}
