import { pathToFileURL } from "node:url";

export const foundation = Object.freeze({
  packageId: "TNGD-BP-000",
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
  authorizedFeatureScope: Object.freeze([]),
  deferredToBp001: Object.freeze([
    "authentication",
    "authorization",
    "roles",
    "tenant-isolation",
    "portal-separation",
    "audit-logging",
    "session-management"
  ])
});

const invokedDirectly =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  process.stdout.write(`${JSON.stringify(foundation, null, 2)}\n`);
}
