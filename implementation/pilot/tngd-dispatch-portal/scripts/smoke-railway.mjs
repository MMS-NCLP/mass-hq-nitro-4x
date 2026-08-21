import { createHash, randomUUID } from "node:crypto";
import { loadDeploymentConfig } from "../src/deployment/config.mjs";
import { SupabaseAuthBoundary, SupabaseHttpClient, SupabasePersistenceAdapter } from "../src/deployment/supabase-client.mjs";

const required = (name) => {
  const value = String(process.env[name] || "").trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
};

const origin = required("MASS_SMOKE_ORIGIN").replace(/\/$/, "");
if (!origin.startsWith("https://") && !origin.startsWith("http://127.0.0.1:")) throw new Error("Railway smoke origin must use HTTPS.");
const results = [];
const passed = (name) => results.push({ name, status: "passed" });

const health = await fetch(`${origin}/api/health`);
const healthBody = await health.json();
if (health.status !== 200 || healthBody.adapter !== "railway-supabase" || healthBody.productionAccepted !== false) throw new Error("Railway health posture failed.");
passed("Railway health posture");

for (const path of ["/", "/today", "/app.js", "/assets/brands/mass-hq.png", "/assets/brands/tngd-primary.png"]) {
  const response = await fetch(`${origin}${path}`, { redirect: "error" });
  if (response.status !== 200) throw new Error(`Railway delivery failed: ${path}`);
}
passed("static assets and SPA history delivery");

const unauthorized = await fetch(`${origin}/api/bootstrap?role=administrator`);
if (unauthorized.status !== 401) throw new Error("Unauthenticated bootstrap was not rejected.");
passed("unauthorized access rejection");

const email = process.env.MASS_QA_USER_EMAIL;
const password = process.env.MASS_QA_USER_PASSWORD;
if (email && password) {
  const login = await fetch(`${origin}/api/session`, {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (login.status !== 200) throw new Error("QA authentication failed.");
  const setCookies = typeof login.headers.getSetCookie === "function" ? login.headers.getSetCookie() : [login.headers.get("set-cookie")];
  const cookie = setCookies.filter(Boolean).map((value) => value.split(";")[0]).join("; ");
  const tenantId = process.env.MASS_QA_TENANT_ID;
  const headers = { cookie, ...(tenantId ? { "x-mass-tenant-id": tenantId } : {}) };
  const bootstrap = await fetch(`${origin}/api/bootstrap`, { headers });
  if (bootstrap.status !== 200) throw new Error("Authenticated bootstrap failed.");
  const session = await bootstrap.json();
  if (session.session.preview !== false || (tenantId && session.session.tenantId !== tenantId)) throw new Error("Authoritative tenant session mismatch.");
  passed("Supabase authentication and authoritative membership");

  if (process.env.MASS_QA_FOREIGN_TENANT_ID) {
    const crossing = await fetch(`${origin}/api/bootstrap`, { headers: { cookie, "x-mass-tenant-id": process.env.MASS_QA_FOREIGN_TENANT_ID } });
    if (crossing.status !== 403) throw new Error("Cross-tenant selector was not rejected.");
    passed("tenant-isolation rejection");
  }

  if (process.env.MASS_QA_PERSISTENCE_SMOKE === "true") {
    const config = loadDeploymentConfig(process.env);
    const client = new SupabaseHttpClient(config.supabase);
    const auth = new SupabaseAuthBoundary({ client });
    const providerSession = await auth.signInWithPassword({ email, password });
    const principal = await auth.resolvePrincipal({ accessToken: providerSession.accessToken, requestedTenantId: tenantId || null });
    const adapter = new SupabasePersistenceAdapter({ client, principal });
    const aggregateId = randomUUID();
    const marker = createHash("sha256").update(`${aggregateId}:${Date.now()}`).digest("hex");
    await adapter.save({ aggregateType: "qa-smoke", aggregateId, expectedVersion: 0, state: { marker }, event: { type: "QaSmokeCreated", payload: { marker } }, idempotencyKey: `qa-smoke:${aggregateId}` });
    const loaded = await adapter.load({ aggregateType: "qa-smoke", aggregateId });
    if (loaded?.state?.marker !== marker) throw new Error("Supabase persistence smoke failed.");
    passed("Supabase persistence and RLS");
  }
}

process.stdout.write(`${JSON.stringify({ posture: "PRE-LAUNCH / LIVE QA", productionAccepted: false, results }, null, 2)}\n`);
