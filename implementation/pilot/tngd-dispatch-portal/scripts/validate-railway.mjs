import { access, constants, readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const railway = JSON.parse(await read("railway.json"));
const packageJson = JSON.parse(await read("package.json"));
const server = await read("src/deployment/railway-server.mjs");
const environment = await read(".env.example");

if (railway.build?.builder !== "RAILPACK" || railway.build?.buildCommand !== "npm run build") throw new Error("Railway Railpack/build boundary is invalid.");
if (railway.deploy?.startCommand !== "npm run start:railway") throw new Error("Railway start command is invalid.");
if (railway.deploy?.healthcheckPath !== "/api/health" || railway.deploy?.healthcheckTimeout < 60) throw new Error("Railway health-check boundary is invalid.");
if (railway.deploy?.restartPolicyType !== "ON_FAILURE") throw new Error("Railway restart policy must remain failure-scoped.");
if (packageJson.scripts?.["start:railway"] !== "node src/deployment/railway-server.mjs") throw new Error("Railway package start script is missing.");
for (const boundary of ["process.env.PORT", '"0.0.0.0"', 'adapterName: "railway-supabase"', "SupabaseAuthBoundary", "allowedOrigin: config.publicOrigin", "serveStatic: true"]) {
  if (!server.includes(boundary)) throw new Error(`Railway server boundary missing: ${boundary}`);
}
for (const name of ["RAILWAY_PUBLIC_DOMAIN", "MASS_DEPLOYMENT_TARGET", "MASS_DEPLOYMENT_MODE", "SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"]) {
  if (!environment.includes(`${name}=`)) throw new Error(`Railway environment declaration missing: ${name}`);
}
for (const preserved of ["vercel.json", "api/index.mjs", "supabase/migrations/202608200001_dispatch_v1_adapter.sql"]) {
  await access(new URL(`../${preserved}`, import.meta.url), constants.F_OK);
}
const combined = [JSON.stringify(railway), server, environment].join("\n");
for (const forbidden of ["eyJhbGci", "service_role=", "SUPABASE_SERVICE_ROLE_KEY=ey", "G:\\\\", "C:\\\\Users\\\\"]) {
  if (combined.includes(forbidden)) throw new Error(`Railway secret or physical-path boundary violated: ${forbidden}`);
}

process.stdout.write("Railway hosting-adapter configuration and security validation passed.\n");
