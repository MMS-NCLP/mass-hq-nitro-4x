const required = (environment, name) => {
  const value = String(environment[name] || "").trim();
  if (!value) throw Object.assign(new Error(`Missing required deployment variable: ${name}`), { statusCode: 503 });
  return value;
};

const httpsUrl = (value, name) => {
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error(`${name} must be a valid URL.`); }
  if (parsed.protocol !== "https:" && parsed.hostname !== "127.0.0.1" && parsed.hostname !== "localhost") {
    throw new Error(`${name} must use HTTPS outside local development.`);
  }
  return parsed.toString().replace(/\/$/, "");
};

export function loadDeploymentConfig(environment = process.env, { requireSupabase = true } = {}) {
  const mode = String(environment.MASS_DEPLOYMENT_MODE || "pre-launch-live-qa");
  const inferredOrigin = environment.MASS_PUBLIC_ORIGIN || (environment.RAILWAY_PUBLIC_DOMAIN ? `https://${environment.RAILWAY_PUBLIC_DOMAIN}` : null);
  const base = {
    mode,
    productionAccepted: false,
    publicOrigin: inferredOrigin ? httpsUrl(inferredOrigin, "MASS_PUBLIC_ORIGIN") : null,
    square: Object.freeze({
      environment: environment.SQUARE_ENVIRONMENT || "sandbox",
      configured: Boolean(environment.SQUARE_ACCESS_TOKEN && environment.SQUARE_WEBHOOK_SIGNATURE_KEY)
    })
  };
  if (!requireSupabase) return Object.freeze(base);
  const url = httpsUrl(required(environment, "SUPABASE_URL"), "SUPABASE_URL");
  const publishableKey = required(environment, "SUPABASE_PUBLISHABLE_KEY");
  if (publishableKey === environment.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Publishable and service-role credentials must be distinct.");
  return Object.freeze({
    ...base,
    supabase: Object.freeze({
      url,
      publishableKey,
      storageBucket: environment.SUPABASE_STORAGE_BUCKET || "dispatch-media"
    })
  });
}

export function requireServerDeploymentSecrets(environment = process.env) {
  const serviceRoleKey = required(environment, "SUPABASE_SERVICE_ROLE_KEY");
  const databaseUrl = required(environment, "SUPABASE_DB_URL");
  return Object.freeze({ serviceRoleKey, databaseUrl });
}
