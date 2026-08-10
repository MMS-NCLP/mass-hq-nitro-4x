import assert from "node:assert/strict";
import test from "node:test";
import { INTAKE_PATHS, IntakeService } from "../src/intake/index.mjs";
import { AuditLog, PortalBoundary, SecureAccess } from "../src/security/index.mjs";

const TENANT_A = "tenant-tngd";
const TENANT_B = "tenant-other";
const PASSWORD = "correct horse battery staple";

function intake(overrides = {}) {
  return {
    name: "Taylor Customer",
    phone: "919-555-0100",
    email: "taylor@example.com",
    serviceAddress: "100 Main Street, Raleigh, NC",
    serviceCategory: "repair",
    serviceNeed: "Air conditioner is not cooling.",
    urgency: "today",
    preferredContact: "phone",
    ...overrides
  };
}

function service(options = {}) {
  const auditLog = options.auditLog ?? new AuditLog();
  return {
    auditLog,
    intakeService: new IntakeService({ auditLog, ...options })
  };
}

test("all three authorized intake paths create service requests", () => {
  const { intakeService } = service();

  for (const path of Object.values(INTAKE_PATHS)) {
    const result = intakeService.submit({
      tenantId: TENANT_A,
      path,
      intake: intake({ serviceCategory: path })
    });
    assert.equal(result.customer.tenantId, TENANT_A);
    assert.equal(result.serviceRequest.intakePath, path);
    assert.equal(result.serviceRequest.status, "received");
    assert.equal(Object.keys(result.serviceRequest.answers).length, 8);
  }

  assert.equal(intakeService.listServiceRequests({ tenantId: TENANT_A }).length, 3);
});

test("the intake foundation requires all eight authorized answers", () => {
  const { intakeService } = service();

  for (const field of Object.keys(intake())) {
    assert.throws(
      () => intakeService.submit({
        tenantId: TENANT_A,
        path: "repair",
        intake: intake({ [field]: "" })
      }),
      new RegExp(field)
    );
  }

  assert.equal(intakeService.listServiceRequests({ tenantId: TENANT_A }).length, 0);
});

test("initial customer capture reuses a tenant customer and isolates tenants", () => {
  const { intakeService } = service();
  const first = intakeService.submit({ tenantId: TENANT_A, path: "repair", intake: intake() });
  const second = intakeService.submit({
    tenantId: TENANT_A,
    path: "estimate",
    intake: intake({ serviceCategory: "estimate" })
  });
  const otherTenant = intakeService.submit({ tenantId: TENANT_B, path: "repair", intake: intake() });

  assert.equal(second.customer.id, first.customer.id);
  assert.notEqual(otherTenant.customer.id, first.customer.id);
  assert.equal(
    intakeService.getCustomer({ tenantId: TENANT_B, customerId: first.customer.id }),
    null
  );
  assert.equal(
    intakeService.getServiceRequest({ tenantId: TENANT_B, requestId: first.serviceRequest.id }),
    null
  );
});

test("authorized portal users create intake while denied users cannot mutate state", async () => {
  const auditLog = new AuditLog();
  const secureAccess = new SecureAccess({ auditLog });
  await secureAccess.bootstrapTenantAdmin({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: PASSWORD
  });
  const admin = await secureAccess.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: PASSWORD
  });
  const technician = await secureAccess.createUser({
    actorSessionToken: admin.token,
    tenantId: TENANT_A,
    email: "tech@example.com",
    password: PASSWORD,
    roles: ["technician"]
  });
  const technicianSession = await secureAccess.authenticate({
    tenantId: TENANT_A,
    email: technician.email,
    password: PASSWORD
  });
  const intakeService = new IntakeService({ auditLog, secureAccess });

  const created = intakeService.submitAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    path: "estimate",
    intake: intake({ serviceCategory: "estimate" })
  });
  assert.equal(created.serviceRequest.source, "internal-portal");

  assert.throws(
    () => intakeService.submitAuthorized({
      sessionToken: technicianSession.token,
      tenantId: TENANT_A,
      path: "repair",
      intake: intake({ email: "blocked@example.com" })
    }),
    /Access denied/
  );
  assert.equal(intakeService.listServiceRequests({ tenantId: TENANT_A }).length, 1);
  assert.equal(auditLog.verify(), true);
});

test("approved public intake integrates through the secure portal allowlist", async () => {
  const auditLog = new AuditLog();
  const secureAccess = new SecureAccess({ auditLog });
  const intakeService = new IntakeService({ auditLog });
  const portal = new PortalBoundary({
    secureAccess,
    publicIntakeSink: ({ tenantId, intake: accepted }) =>
      intakeService.submit({ tenantId, intake: accepted })
  });

  const created = await portal.submitPublic({
    tenantId: TENANT_A,
    action: "intake.submit",
    payload: { ...intake(), ignoredField: "must-not-cross-boundary" }
  });
  assert.equal(created.serviceRequest.intakePath, "repair");
  assert.equal(created.serviceRequest.answers.serviceNeed, intake().serviceNeed);
  assert.equal(created.serviceRequest.answers.ignoredField, undefined);

  await assert.rejects(
    portal.submitPublic({ tenantId: TENANT_A, action: "intake.delete", payload: intake() }),
    /not allowed/
  );
  assert.equal(intakeService.listServiceRequests({ tenantId: TENANT_A }).length, 1);
  assert.equal(auditLog.verify(), true);
});
