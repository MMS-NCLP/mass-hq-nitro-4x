export const deploymentAdapterManifest = Object.freeze({
  phaseId: "TNGD-DISPATCH-V1-DEPLOYMENT-ADAPTER",
  startingCanonical: "3b006458e7bc1840abf9cf8c913fc3d211b3e05f",
  delivery: "github-vercel-node-supabase",
  domainKernelPreserved: true,
  productionAccepted: false,
  liveDeploymentValidated: false,
  providers: Object.freeze({
    web: "vercel",
    persistence: "supabase-postgres",
    authentication: "supabase-auth",
    storage: "supabase-storage"
  }),
  privilegedCredentials: "server-only",
  tenantAuthority: "verified-identity-plus-authoritative-membership",
  migration: "supabase/migrations/202608200001_dispatch_v1_adapter.sql"
});
