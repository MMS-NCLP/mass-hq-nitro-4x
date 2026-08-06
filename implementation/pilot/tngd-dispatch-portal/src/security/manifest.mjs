export const securityManifest = Object.freeze({
  packageId: "TNGD-BP-001",
  capabilities: Object.freeze([
    "authentication",
    "password-recovery",
    "role-enforcement",
    "tenant-isolation",
    "public-internal-portal-separation",
    "audit-logging",
    "session-management"
  ]),
  runtimeAdapters: Object.freeze({
    identityRepository: "in-memory",
    sessionRepository: "in-memory",
    auditRepository: "tamper-evident-in-memory",
    passwordResetDelivery: "injected"
  }),
  deferred: Object.freeze([
    "database-provider",
    "external-identity-provider",
    "http-transport",
    "portal-ui",
    "deployment-provider"
  ])
});
