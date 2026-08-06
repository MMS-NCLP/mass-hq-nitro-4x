import assert from "node:assert/strict";
import test from "node:test";
import { foundation } from "../src/foundation.mjs";

test("foundation identifies the authorized project, packages, and location", () => {
  assert.equal(foundation.projectId, "MASS-TNGD-PILOT-001");
  assert.deepEqual(
    foundation.implementedPackages,
    ["TNGD-BP-000", "TNGD-BP-001"]
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

test("foundation exposes only BP-001 feature authority", () => {
  assert.deepEqual(foundation.authorizedFeatureScope, [
    "authentication",
    "role-enforcement",
    "tenant-isolation",
    "portal-separation",
    "audit-logging",
    "session-management"
  ]);
  assert.ok(foundation.deferredToBp002.includes("customer-records"));
  assert.ok(foundation.deferredToBp002.includes("service-locations"));
});

test("foundation preserves persistence and deployment seams", () => {
  assert.equal(foundation.paths.migrations, "migrations");
  assert.equal(foundation.paths.deployment, "deployment");
  assert.ok(foundation.environment.includes("MASS_DATABASE_URL"));
  assert.ok(foundation.environment.includes("MASS_DEPLOYMENT_TARGET"));
});
