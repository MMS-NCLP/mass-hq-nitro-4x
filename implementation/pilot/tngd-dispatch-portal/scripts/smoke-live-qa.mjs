import assert from "node:assert/strict";
import { once } from "node:events";
import { createProductRealizationServer } from "../src/product-realization/server.mjs";

const server = createProductRealizationServer();
server.listen(0, "127.0.0.1");
await once(server, "listening");
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;
const results = [];
const check = async (name, run) => {
  await run();
  results.push({ name, status: "passed" });
};

try {
  await check("health posture", async () => {
    const response = await fetch(`${origin}/api/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.phase, "pre-launch-live-qa-candidate");
    assert.equal(body.productionAccepted, false);
    assert.equal(body.deploymentValidated, false);
  });
  await check("security headers", async () => {
    const response = await fetch(origin);
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'none'/);
    assert.match(response.headers.get("permissions-policy"), /camera=\(\)/);
  });
  await check("history fallback", async () => {
    const response = await fetch(`${origin}/inspection`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /MASS Dispatch/);
  });
  await check("approved assets", async () => {
    for (const path of ["assets/brands/mass-hq.png", "assets/brands/tngd-primary.png", "media/manifest.json"]) {
      const response = await fetch(`${origin}/${path}`);
      assert.equal(response.status, 200);
      assert.ok(Number(response.headers.get("content-length") || (await response.arrayBuffer()).byteLength) > 0);
    }
  });
  await check("role boundaries", async () => {
    const expected = { technician: 8, dispatcher: 9, administrator: 18 };
    for (const [role, count] of Object.entries(expected)) {
      const response = await fetch(`${origin}/api/bootstrap?role=${role}`);
      const body = await response.json();
      assert.equal(body.permittedRoutes.length, count);
      assert.equal(body.session.preview, true);
      assert.equal(body.deploymentAuthorized, false);
    }
  });
  await check("path traversal rejection", async () => {
    const response = await fetch(`${origin}/..%2F..%2Fpackage.json`);
    assert.equal(response.status, 403);
  });
} finally {
  server.close();
  await once(server, "close");
}

process.stdout.write(`${JSON.stringify({ posture: "PRE-LAUNCH / LIVE QA", productionAccepted: false, results }, null, 2)}\n`);
