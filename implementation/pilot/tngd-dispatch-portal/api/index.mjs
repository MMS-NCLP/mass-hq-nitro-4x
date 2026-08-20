import { createProductRealizationHandler } from "../src/product-realization/server.mjs";
import { loadDeploymentConfig } from "../src/deployment/config.mjs";
import { SupabaseAuthBoundary, SupabaseHttpClient } from "../src/deployment/supabase-client.mjs";

let handler;

export default async function dispatchVercelFunction(request, response) {
  if (!handler) {
    const config = loadDeploymentConfig(process.env);
    const client = new SupabaseHttpClient(config.supabase);
    handler = createProductRealizationHandler({
      authBoundary: new SupabaseAuthBoundary({ client }),
      serveStatic: false
    });
  }
  return handler(request, response);
}
