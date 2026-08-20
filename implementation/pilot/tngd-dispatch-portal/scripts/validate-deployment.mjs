import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const vercel = JSON.parse(await read("vercel.json"));
const migration = await read("supabase/migrations/202608200001_dispatch_v1_adapter.sql");
const environment = await read(".env.example");
const api = await read("api/index.mjs");
const apiCatchAll = await read("api/[...path].mjs");
const auth = await read("src/deployment/supabase-client.mjs");
const storage = await read("src/deployment/supabase-storage.mjs");
const browser = await read("public/app.js");

if (vercel.outputDirectory !== "public" || vercel.buildCommand !== "npm run build") throw new Error("Vercel static/build boundary is invalid.");
const globalHeaders = vercel.headers.find(({ source }) => source === "/(.*)")?.headers || [];
for (const header of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy", "Content-Security-Policy"]) {
  if (!globalHeaders.some(({ key }) => key === header)) throw new Error(`Vercel security header missing: ${header}`);
}
if (!apiCatchAll.includes('export { default } from "./index.mjs"')) throw new Error("Vercel API catch-all adapter is missing.");
for (const route of ["/today", "/customers", "/dispatch", "/inspection", "/invoices", "/reports", "/administration"]) {
  if (!vercel.rewrites.some((entry) => entry.source === route && entry.destination === "/index.html")) throw new Error(`Vercel SPA route missing: ${route}`);
}
for (const table of ["dispatch_tenants", "dispatch_tenant_memberships", "dispatch_aggregates", "dispatch_audit_events", "dispatch_idempotency_keys", "dispatch_media_objects"]) {
  if (!migration.includes(`alter table public.${table} enable row level security`)) throw new Error(`RLS missing for ${table}`);
}
for (const boundary of [
  "dispatch_has_tenant_access", "dispatch_has_permission", "auth.uid()", "dispatch_save_aggregate",
  "p_expected_version", "pg_advisory_xact_lock", "previous_hash", "dispatch_storage_authorized_insert",
  "service role required", "revoke all", "grant execute"
]) if (!migration.includes(boundary)) throw new Error(`Supabase migration boundary missing: ${boundary}`);

for (const name of [
  "SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_DB_URL",
  "SUPABASE_STORAGE_BUCKET", "MASS_BOOTSTRAP_TENANT_ID", "MASS_BOOTSTRAP_TENANT_NAME",
  "MASS_BOOTSTRAP_USER_ID", "MASS_BOOTSTRAP_USER_EMAIL", "SQUARE_ACCESS_TOKEN",
  "SQUARE_WEBHOOK_SIGNATURE_KEY", "SQUARE_ENVIRONMENT"
]) if (!environment.includes(`${name}=`)) throw new Error(`Deployment environment declaration missing: ${name}`);

if (!api.includes("serveStatic: false") || !api.includes("SupabaseAuthBoundary")) throw new Error("Thin Vercel function adapter is missing.");
if (!auth.includes("/auth/v1/user") || !auth.includes("dispatch_tenant_memberships") || !auth.includes("active-tenant-membership-required")) throw new Error("Verified identity and authoritative membership boundary is incomplete.");
if (auth.includes("user_metadata") || auth.includes("raw_user_meta_data")) throw new Error("User-editable metadata must not confer authorization.");
if (!storage.includes("defineMediaAsset") || !storage.includes("media-tenant-mismatch") || !storage.includes("public-use-not-approved") || !storage.includes("dispatch_media_objects")) throw new Error("Governed storage/media boundary is incomplete.");
if (!browser.includes("credentials:\"same-origin\"") || !browser.includes("Secure sign in")) throw new Error("Browser session boundary is missing.");

const combined = [api, auth, storage, browser, environment].join("\n");
for (const forbidden of ["service_role=", "eyJhbGci", "G:\\\\", "C:\\\\Users\\\\", "supabase.co/rest/v1"]) {
  if (combined.includes(forbidden)) throw new Error(`Hardcoded secret or environment-specific path detected: ${forbidden}`);
}

process.stdout.write("Vercel and Supabase deployment-adapter security validation passed.\n");
