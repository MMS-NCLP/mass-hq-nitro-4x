import assert from "node:assert/strict";
import test from "node:test";
import { foundation } from "../src/foundation.mjs";

test("foundation identifies the authorized project, packages, and location", () => {
  assert.equal(foundation.projectId, "MASS-TNGD-PILOT-001");
  assert.deepEqual(
    foundation.implementedPackages,
    ["TNGD-BP-000", "TNGD-BP-001", "TNGD-BP-002", "TNGD-BP-003"]
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

test("foundation preserves persistence and deployment seams", () => {
  assert.equal(foundation.paths.migrations, "migrations");
  assert.equal(foundation.paths.deployment, "deployment");
  assert.ok(foundation.environment.includes("MASS_DATABASE_URL"));
  assert.ok(foundation.environment.includes("MASS_DEPLOYMENT_TARGET"));
});
