import assert from "node:assert/strict";
import test from "node:test";
import { foundation } from "../src/foundation.mjs";

test("foundation identifies the authorized package and location", () => {
  assert.equal(foundation.packageId, "TNGD-BP-000");
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

test("foundation does not implement pilot features", () => {
  assert.deepEqual(foundation.authorizedFeatureScope, []);
  assert.ok(foundation.deferredToBp001.includes("authentication"));
  assert.ok(foundation.deferredToBp001.includes("tenant-isolation"));
  assert.ok(foundation.deferredToBp001.includes("session-management"));
});

test("foundation reserves persistence and deployment seams", () => {
  assert.equal(foundation.paths.migrations, "migrations");
  assert.equal(foundation.paths.deployment, "deployment");
  assert.ok(foundation.environment.includes("MASS_DATABASE_URL"));
  assert.ok(foundation.environment.includes("MASS_DEPLOYMENT_TARGET"));
});
