import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { loadDeploymentConfig } from "../src/deployment/config.mjs";
import { SupabaseAuthBoundary, SupabaseHttpClient, SupabasePersistenceAdapter } from "../src/deployment/supabase-client.mjs";
import { SupabaseStorageAdapter } from "../src/deployment/supabase-storage.mjs";
import { createProductRealizationHandler } from "../src/product-realization/server.mjs";
import { createRailwayServer } from "../src/deployment/railway-server.mjs";

const userId = "11111111-1111-4111-8111-111111111111";
const tenantA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const tenantB = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function mockedClient(resolver) {
  return new SupabaseHttpClient({ url: "https://example.supabase.co", publishableKey: "publishable-test-key", fetchImpl: resolver });
}

const jsonResponse = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "content-type": "application/json" } });

test("deployment configuration separates publishable and privileged secrets", () => {
  const config = loadDeploymentConfig({ SUPABASE_URL: "https://example.supabase.co", SUPABASE_PUBLISHABLE_KEY: "public", SUPABASE_SERVICE_ROLE_KEY: "secret", MASS_PUBLIC_ORIGIN: "https://dispatch.example.com" });
  assert.equal(config.supabase.publishableKey, "public");
  assert.equal(JSON.stringify(config).includes("secret"), false);
  assert.throws(() => loadDeploymentConfig({ SUPABASE_URL: "https://example.supabase.co", SUPABASE_PUBLISHABLE_KEY: "same", SUPABASE_SERVICE_ROLE_KEY: "same" }), /distinct/);
});

test("verified identity resolves tenant and role only from authoritative membership", async () => {
  const calls = [];
  const boundary = new SupabaseAuthBoundary({ client: mockedClient(async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith("/auth/v1/user")) return jsonResponse({ id: userId, user_metadata: { tenant_id: tenantB, role: "administrator" } });
    return jsonResponse([{ tenant_id: tenantA, ui_role: "technician", roles: ["technician"], permissions: ["jobs.assigned.read"] }]);
  }) });
  const principal = await boundary.resolvePrincipal({ accessToken: "verified-jwt", requestedTenantId: tenantA });
  assert.equal(principal.tenantId, tenantA);
  assert.equal(principal.uiRole, "technician");
  assert.match(calls[1].url, new RegExp(`tenant_id=eq\\.${tenantA}`));
  assert.equal(calls.every((call) => call.options.headers.apikey === "publishable-test-key"), true);
});

test("request-supplied tenant cannot create authority and ambiguous membership is rejected", async () => {
  const none = new SupabaseAuthBoundary({ client: mockedClient(async (url) => String(url).endsWith("/auth/v1/user") ? jsonResponse({ id: userId }) : jsonResponse([])) });
  await assert.rejects(() => none.resolvePrincipal({ accessToken: "jwt", requestedTenantId: tenantB }), /active-tenant-membership-required/);
  const ambiguous = new SupabaseAuthBoundary({ client: mockedClient(async (url) => String(url).endsWith("/auth/v1/user") ? jsonResponse({ id: userId }) : jsonResponse([
    { tenant_id: tenantA, ui_role: "technician", roles: [], permissions: [] },
    { tenant_id: tenantB, ui_role: "dispatcher", roles: [], permissions: [] }
  ])) });
  await assert.rejects(() => ambiguous.resolvePrincipal({ accessToken: "jwt" }), /tenant-selection-required/);
});

test("persistence adapter derives tenant from principal and uses optimistic version RPC", async () => {
  let captured;
  const client = mockedClient(async (url, options) => { captured = { url: String(url), options }; return jsonResponse({ version: 2 }); });
  const adapter = new SupabasePersistenceAdapter({ client, principal: { id: userId, tenantId: tenantA, accessToken: "jwt" } });
  await adapter.save({ aggregateType: "customer", aggregateId: userId, expectedVersion: 1, state: { name: "Sarah" }, event: { type: "CustomerUpdated", payload: { source: "qa" } }, idempotencyKey: "customer-update-1" });
  const body = JSON.parse(captured.options.body);
  assert.equal(body.p_tenant_id, tenantA);
  assert.equal(body.p_expected_version, 1);
  assert.equal(body.p_idempotency_key, "customer-update-1");
  assert.match(body.p_request_hash, /^[0-9a-f]{64}$/);
  assert.match(captured.url, /dispatch_save_aggregate/);
});

test("storage adapter enforces tenant and media-rights boundaries before provider access", async () => {
  let registered;
  const adapter = new SupabaseStorageAdapter({ client: mockedClient(async (url, options) => { registered = { url: String(url), options }; return jsonResponse({ signedURL: "/object/sign/dispatch-media/signed" }); }), principal: { id: userId, tenantId: tenantA, accessToken: "jwt" } });
  const base = { assetId: "job-photo", tenantId: tenantA, sourceCollection: "jobs", sourceKey: "jobs/photo.jpg", mimeType: "image/jpeg", classification: "customer-job", approvalState: "internal-approved", lineage: "technician-capture" };
  assert.equal(adapter.objectKey(base), `${tenantA}/jobs/photo.jpg`);
  assert.throws(() => adapter.objectKey({ ...base, tenantId: tenantB }), /media-tenant-mismatch/);
  await assert.rejects(() => adapter.createSignedUrl({ asset: base, context: "public" }), /public-use-not-approved/);
  await adapter.registerMetadata({ asset: base });
  const metadata = JSON.parse(registered.options.body);
  assert.equal(metadata.tenant_id, tenantA);
  assert.equal(metadata.object_key, `${tenantA}/jobs/photo.jpg`);
  assert.equal(metadata.created_by, userId);
});

test("Vercel-compatible handler requires verified session and never accepts role query authority", async () => {
  const authBoundary = { resolvePrincipal: async () => ({ id: userId, tenantId: tenantA, uiRole: "technician", roles: ["technician"], permissions: [], accessToken: "jwt" }) };
  const server = createServer(createProductRealizationHandler({ authBoundary, serveStatic: false }));
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    assert.equal((await fetch(`${origin}/api/bootstrap?role=administrator`)).status, 401);
    const response = await fetch(`${origin}/api/bootstrap?role=administrator`, { headers: { authorization: "Bearer jwt", "x-mass-tenant-id": tenantA } });
    const body = await response.json();
    assert.equal(body.session.role, "technician");
    assert.equal(body.session.tenantId, tenantA);
    assert.equal(body.session.preview, false);
    assert.equal(body.permittedRoutes.some(({ id }) => id === "administration"), false);
  } finally { server.close(); }
});

test("session boundary issues hardened cookies refreshes and rejects cross-origin login", async () => {
  const authBoundary = {
    signInWithPassword: async () => ({ accessToken: "access", refreshToken: "refresh", maxAge: 900 }),
    refreshSession: async ({ refreshToken }) => ({ accessToken: `new-${refreshToken}`, refreshToken: "next", maxAge: 900 })
  };
  const server = createServer(createProductRealizationHandler({ authBoundary, serveStatic: false }));
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    const denied = await fetch(`${origin}/api/session`, { method: "POST", headers: { origin: "https://attacker.example", "content-type": "application/json" }, body: JSON.stringify({ email: "qa@example.com", password: "secret" }) });
    assert.equal(denied.status, 403);
    const login = await fetch(`${origin}/api/session`, { method: "POST", headers: { origin, "x-forwarded-proto": "http", "content-type": "application/json" }, body: JSON.stringify({ email: "qa@example.com", password: "secret" }) });
    assert.equal(login.status, 200);
    const cookies = login.headers.get("set-cookie");
    assert.match(cookies, /__Host-mass_access=/);
    assert.match(cookies, /__Secure-mass_refresh=/);
    assert.match(cookies, /HttpOnly/);
    assert.match(cookies, /Secure/);
    assert.equal(cookies.includes("service"), false);
    const refreshed = await fetch(`${origin}/api/session`, { method: "PUT", headers: { origin, "x-forwarded-proto": "http", cookie: "__Secure-mass_refresh=refresh" } });
    assert.equal(refreshed.status, 200);
    assert.match(refreshed.headers.get("set-cookie"), /new-refresh/);
  } finally { server.close(); }
});

test("Railway server binds the existing static and authenticated API boundaries", async () => {
  const server = createRailwayServer({ environment: { SUPABASE_URL: "https://example.supabase.co", SUPABASE_PUBLISHABLE_KEY: "publishable-test-key", RAILWAY_PUBLIC_DOMAIN: "dispatch.example.test" }, fetchImpl: async () => jsonResponse({}) });
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    const health = await (await fetch(`${origin}/api/health`)).json();
    assert.equal(health.adapter, "railway-supabase");
    assert.equal(health.productionAccepted, false);
    assert.equal((await fetch(`${origin}/today`)).status, 200);
    assert.equal((await fetch(`${origin}/api/bootstrap`)).status, 401);
  } finally { server.close(); }
});
