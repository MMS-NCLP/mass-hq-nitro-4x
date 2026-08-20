import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createProductRealizationServer } from "../src/product-realization/server.mjs";
import { nextTechnicianDestination, operationalPulse, productRealizationContract, routesForRoles } from "../src/product-realization/index.mjs";

test("product contract exposes every accepted V1 surface without deployment or V2 authority", () => {
  const contract = productRealizationContract();
  assert.equal(contract.routes.length, 18);
  assert.equal(contract.deploymentAuthorized, false);
  assert.equal(contract.liveData, false);
  assert.ok(contract.providerStates.includes("media-unavailable"));
  assert.ok(!JSON.stringify(contract).includes("Adaptive Ambient Dynamic Pulse"));
});

test("role routing preserves technician and administrative permission boundaries", () => {
  const technician = routesForRoles(["technician"]).map(({ id }) => id);
  assert.ok(technician.includes("today"));
  assert.ok(technician.includes("inspection"));
  assert.ok(!technician.includes("administration"));
  assert.equal(routesForRoles(["administrator"]).length, 18);
});

test("Operational Pulse V1 derives restrained condition from real counters", () => {
  assert.deepEqual(operationalPulse({}), { condition: "healthy", pressure: 0, tone: "mass-blue", motion: "restrained-breathe", derived: true });
  assert.equal(operationalPulse({ attention: 1, active: 3 }).condition, "active");
  assert.equal(operationalPulse({ overdue: 2 }).condition, "constrained");
  assert.equal(operationalPulse({ blocked: 2 }).condition, "urgent");
});

test("technician flywheel routes completed actions to operationally sensible destinations", () => {
  assert.equal(nextTechnicianDestination("arrived"), "diagnosis");
  assert.equal(nextTechnicianDestination("estimate-finalized"), "authorization");
  assert.equal(nextTechnicianDestination("paid"), "completion");
  assert.equal(nextTechnicianDestination("completed"), "next-destination");
});

test("delivery adapter serves secure bootstrap and browser application without live-data claims", async () => {
  const server = createProductRealizationServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const { port } = server.address();
    const bootstrap = await fetch(`http://127.0.0.1:${port}/api/bootstrap?role=technician`);
    assert.equal(bootstrap.status, 200);
    const body = await bootstrap.json();
    assert.equal(body.session.authenticated, true);
    assert.equal(body.session.preview, true);
    assert.ok(body.permittedRoutes.every((route) => route.id !== "administration"));
    const page = await fetch(`http://127.0.0.1:${port}/today`);
    assert.match(await page.text(), /MASS Dispatch/);
    assert.match(page.headers.get("content-security-policy"), /object-src 'none'/);
  } finally { server.close(); }
});
