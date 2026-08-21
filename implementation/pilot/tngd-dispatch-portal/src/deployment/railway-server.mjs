import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { createProductRealizationHandler } from "../product-realization/server.mjs";
import { loadDeploymentConfig } from "./config.mjs";
import { SupabaseAuthBoundary, SupabaseHttpClient } from "./supabase-client.mjs";

export function createRailwayServer({ environment = process.env, fetchImpl = fetch } = {}) {
  const config = loadDeploymentConfig(environment);
  const client = new SupabaseHttpClient({ ...config.supabase, fetchImpl });
  return createServer(createProductRealizationHandler({
    authBoundary: new SupabaseAuthBoundary({ client }),
    adapterName: "railway-supabase",
    allowedOrigin: config.publicOrigin,
    serveStatic: true
  }));
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  const port = Number(process.env.PORT || 4173);
  const host = process.env.MASS_BIND_HOST || "0.0.0.0";
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be a valid TCP port.");
  createRailwayServer().listen(port, host, () => {
    process.stdout.write(`MASS Dispatch Railway PRE-LAUNCH / LIVE QA candidate listening on ${host}:${port}\n`);
  });
}
