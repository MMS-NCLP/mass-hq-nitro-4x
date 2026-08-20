import { loadDeploymentConfig } from "../src/deployment/config.mjs";
import { SupabaseHttpClient } from "../src/deployment/supabase-client.mjs";

const required = (name) => {
  const value = String(process.env[name] || "").trim();
  if (!value) throw new Error(`${name} is required for tenant bootstrap.`);
  return value;
};

const config = loadDeploymentConfig(process.env);
const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");
if (serviceRoleKey === config.supabase.publishableKey) throw new Error("Service-role and publishable credentials must be distinct.");

const client = new SupabaseHttpClient({
  url: config.supabase.url,
  publishableKey: serviceRoleKey
});

await client.request("/rest/v1/rpc/dispatch_bootstrap_tenant", {
  method: "POST",
  accessToken: serviceRoleKey,
  body: {
    p_tenant_id: required("MASS_BOOTSTRAP_TENANT_ID"),
    p_tenant_name: required("MASS_BOOTSTRAP_TENANT_NAME"),
    p_user_id: required("MASS_BOOTSTRAP_USER_ID"),
    p_email: required("MASS_BOOTSTRAP_USER_EMAIL")
  }
});

process.stdout.write("Supabase tenant and initial administrator membership bootstrapped without emitting credentials.\n");
