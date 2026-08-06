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
    /invalid or expired/
  );

  const recovered = await access.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: "new secure recovery phrase"
  });
  assert.equal(recovered.principal.email, "owner@example.com");
});
