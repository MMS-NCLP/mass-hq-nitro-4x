import assert from "node:assert/strict";
import test from "node:test";
import { AuditLog, PortalBoundary, SecureAccess } from "../src/security/index.mjs";

const TENANT_A = "tenant-tngd";
const TENANT_B = "tenant-other";
const ADMIN_PASSWORD = "correct horse battery staple";
const USER_PASSWORD = "portable secure access phrase";

async function setup() {
  const auditLog = new AuditLog();
  const access = new SecureAccess({ auditLog });
  const admin = await access.bootstrapTenantAdmin({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });
  const adminSession = await access.authenticate({
    tenantId: TENANT_A,
    email: admin.email,
    password: ADMIN_PASSWORD
  });
  return { access, auditLog, admin, adminSession };
}

test("users authenticate and invalid credentials are rejected", async () => {
  const { access, auditLog } = await setup();

  await assert.rejects(
    access.authenticate({
      tenantId: TENANT_A,
      email: "owner@example.com",
      password: "incorrect password"
    }),
    /Invalid credentials/
  );

  assert.ok(
    auditLog
      .list({ tenantId: TENANT_A })
      .some((record) => record.type === "AuthenticationFailed")
  );
});

test("roles enforce least privilege", async () => {
  const { access, adminSession } = await setup();
  const technician = await access.createUser({
    actorSessionToken: adminSession.token,
    tenantId: TENANT_A,
    email: "tech@example.com",
    password: USER_PASSWORD,
    roles: ["technician"]
  });
  const technicianSession = await access.authenticate({
    tenantId: TENANT_A,
    email: technician.email,
    password: USER_PASSWORD
  });

  assert.equal(
    access.authorize({
      sessionToken: technicianSession.token,
      tenantId: TENANT_A,
      permission: "jobs.assigned.read",
      resourceId: "job:assigned"
    }).granted,
    true
  );

  assert.equal(
    access.authorize({
      sessionToken: technicianSession.token,
      tenantId: TENANT_A,
      permission: "identity.roles.manage",
      resourceId: `identity:${technician.id}`
    }).granted,
    false
  );
});

test("tenant mismatch is denied", async () => {
  const { access, adminSession } = await setup();

  const decision = access.authorize({
    sessionToken: adminSession.token,
    tenantId: TENANT_B,
    permission: "customers.read",
    resourceId: "customer:outside-tenant"
  });

  assert.equal(decision.granted, false);
  assert.equal(decision.reason, "tenant-mismatch");
});

test("public and internal portal actions remain separated", async () => {
  const { access, adminSession } = await setup();
  const accepted = [];
  const portal = new PortalBoundary({
    secureAccess: access,
    publicIntakeSink: async (record) => {
      accepted.push(record);
      return { accepted: true };
    }
  });

  const result = await portal.submitPublic({
    tenantId: TENANT_A,
    action: "intake.submit",
    payload: {
      name: "Customer",
      phone: "555-0100",
      serviceCategory: "repair",
      internalRole: "tenant_admin"
    }
  });

  assert.deepEqual(result, { accepted: true });
  assert.equal(accepted[0].intake.internalRole, undefined);

  await assert.rejects(
    portal.submitPublic({
      tenantId: TENANT_A,
      action: "identity.roles.manage",
      payload: {}
    }),
    /not allowed/
  );

  const internalResult = await portal.runInternal({
    sessionToken: adminSession.token,
    tenantId: TENANT_A,
    permission: "customers.read",
    resourceId: "customer:1",
    handler: ({ principal }) => principal.email
  });

  assert.equal(internalResult, "owner@example.com");
});

test("sessions expire and logout revokes active sessions", async () => {
  let clock = new Date("2026-08-06T00:00:00.000Z");
  const access = new SecureAccess({
    now: () => clock,
    sessionTtlMs: 1000
  });

  await access.bootstrapTenantAdmin({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });
  const first = await access.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });

  clock = new Date("2026-08-06T00:00:02.000Z");
  assert.throws(() => access.validateSession(first.token), /expired/);

  clock = new Date("2026-08-06T00:00:03.000Z");
  const second = await access.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });
  assert.equal(access.logout(second.token), true);
  assert.throws(() => access.validateSession(second.token), /not active/);
});

test("privileged actions are audited in a valid hash chain", async () => {
  const { access, auditLog, adminSession } = await setup();
  const user = await access.createUser({
    actorSessionToken: adminSession.token,
    tenantId: TENANT_A,
    email: "dispatcher@example.com",
    password: USER_PASSWORD,
    roles: ["admin_dispatch"]
  });

  access.assignRole({
    actorSessionToken: adminSession.token,
    tenantId: TENANT_A,
    userId: user.id,
    role: "manager"
  });

  const records = access.readAudit({
    sessionToken: adminSession.token,
    tenantId: TENANT_A
  });

  assert.ok(records.some((record) => record.type === "RoleAssigned"));
  assert.ok(records.some((record) => record.action === "security.audit.read"));
  assert.equal(auditLog.verify(), true);
});


test("password recovery is single-use and revokes existing sessions", async () => {
  const deliveries = [];
  const access = new SecureAccess({
    passwordResetDelivery: async (delivery) => deliveries.push(delivery)
  });

  await access.bootstrapTenantAdmin({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });
  const existing = await access.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });

  assert.deepEqual(
    await access.requestPasswordReset({
      tenantId: TENANT_A,
      email: "owner@example.com"
    }),
    { accepted: true }
  );
  assert.equal(deliveries.length, 1);

  await access.completePasswordReset({
    tenantId: TENANT_A,
    token: deliveries[0].token,
    newPassword: "new secure recovery phrase"
  });

  assert.throws(() => access.validateSession(existing.token), /not active/);
  await assert.rejects(
    access.completePasswordReset({
      tenantId: TENANT_A,
      token: deliveries[0].token,
      newPassword: "another secure recovery phrase"
    }),
    /invalid.*expired/
  );

  const recovered = await access.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: "new secure recovery phrase"
  });
  assert.equal(recovered.principal.email, "owner@example.com");
});

test("identity records are keyed by tenant and normalized email", async () => {
  const access = new SecureAccess();

  await access.bootstrapTenantAdmin({
    tenantId: TENANT_A,
    email: "OWNER@EXAMPLE.COM",
    password: ADMIN_PASSWORD
  });
  await access.bootstrapTenantAdmin({
    tenantId: TENANT_B,
    email: "owner@example.com",
    password: USER_PASSWORD
  });

  const tenantA = await access.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });
  const tenantB = await access.authenticate({
    tenantId: TENANT_B,
    email: "OWNER@EXAMPLE.COM",
    password: USER_PASSWORD
  });

  assert.equal(tenantA.principal.tenantId, TENANT_A);
  assert.equal(tenantB.principal.tenantId, TENANT_B);
  assert.notEqual(tenantA.principal.id, tenantB.principal.id);
});

test("default audit storage cannot silently discard security events", async () => {
  const access = new SecureAccess();

  await access.bootstrapTenantAdmin({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });
  await access.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });

  const records = access.auditLog.list({ tenantId: TENANT_A });
  assert.ok(records.length >= 2);
  assert.ok(records.some((record) => record.type === "IdentityCreated"));
  assert.ok(records.some((record) => record.type === "AuthenticationSucceeded"));
  assert.equal(access.auditLog.verify(), true);
});

test("exactly one concurrent tenant bootstrap succeeds without corrupting identity state", async () => {
  const access = new SecureAccess();
  const attempts = [
    {
      tenantId: TENANT_A,
      email: "first-admin@example.com",
      password: ADMIN_PASSWORD
    },
    {
      tenantId: TENANT_A,
      email: "second-admin@example.com",
      password: USER_PASSWORD
    }
  ];

  const results = await Promise.allSettled(
    attempts.map((attempt) => access.bootstrapTenantAdmin(attempt))
  );
  const fulfilled = results
    .map((result, index) => ({ result, index }))
    .filter(({ result }) => result.status === "fulfilled");
  const rejected = results
    .map((result, index) => ({ result, index }))
    .filter(({ result }) => result.status === "rejected");

  assert.equal(fulfilled.length, 1);
  assert.equal(rejected.length, 1);

  const winner = attempts[fulfilled[0].index];
  const loser = attempts[rejected[0].index];
  const session = await access.authenticate({
    tenantId: winner.tenantId,
    email: winner.email,
    password: winner.password
  });

  assert.equal(session.principal.email, winner.email);
  await assert.rejects(
    access.authenticate({
      tenantId: loser.tenantId,
      email: loser.email,
      password: loser.password
    }),
    /Invalid credentials/
  );

  const audit = access.auditLog.list({ tenantId: TENANT_A });
  assert.equal(
    audit.filter((record) => record.type === "IdentityCreated").length,
    1
  );
  assert.equal(
    audit.filter((record) => record.type === "IdentityBootstrapDenied").length,
    1
  );
  assert.equal(access.auditLog.verify(), true);
});

test("exactly one concurrent password reset succeeds without corrupting credentials", async () => {
  const deliveries = [];
  const access = new SecureAccess({
    passwordResetDelivery: async (delivery) => deliveries.push(delivery)
  });

  await access.bootstrapTenantAdmin({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });
  const existing = await access.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: ADMIN_PASSWORD
  });
  await access.requestPasswordReset({
    tenantId: TENANT_A,
    email: "owner@example.com"
  });

  const candidatePasswords = [
    "first concurrent recovery phrase",
    "second concurrent recovery phrase"
  ];
  const results = await Promise.allSettled(
    candidatePasswords.map((newPassword) =>
      access.completePasswordReset({
        tenantId: TENANT_A,
        token: deliveries[0].token,
        newPassword
      })
    )
  );
  const fulfilled = results
    .map((result, index) => ({ result, index }))
    .filter(({ result }) => result.status === "fulfilled");
  const rejected = results
    .map((result, index) => ({ result, index }))
    .filter(({ result }) => result.status === "rejected");

  assert.equal(fulfilled.length, 1);
  assert.equal(rejected.length, 1);

  const winningPassword = candidatePasswords[fulfilled[0].index];
  const losingPassword = candidatePasswords[rejected[0].index];

  assert.throws(() => access.validateSession(existing.token), /not active/);
  const recovered = await access.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: winningPassword
  });
  assert.equal(recovered.principal.email, "owner@example.com");

  await assert.rejects(
    access.authenticate({
      tenantId: TENANT_A,
      email: "owner@example.com",
      password: losingPassword
    }),
    /Invalid credentials/
  );
  await assert.rejects(
    access.authenticate({
      tenantId: TENANT_A,
      email: "owner@example.com",
      password: ADMIN_PASSWORD
    }),
    /Invalid credentials/
  );

  const audit = access.auditLog.list({ tenantId: TENANT_A });
  assert.equal(
    audit.filter((record) => record.type === "PasswordResetCompleted").length,
    1
  );
  assert.equal(
    audit.filter((record) => record.type === "PasswordResetRejected").length,
    1
  );
  assert.equal(access.auditLog.verify(), true);
});

