import assert from "node:assert/strict";
import test from "node:test";
import {
  AccessDeniedError,
  PORTALS,
  createSecureAccessService
} from "../src/secure-access.mjs";

function fixture() {
  let now = Date.parse("2026-08-06T00:00:00Z");
  const audit = [];
  const access = createSecureAccessService({
    clock: () => now,
    sessionTtlMs: 60_000,
    auditSink: (entry) => audit.push(entry)
  });

  access.registerIdentity({
    identityId: "dispatcher-1",
    tenantId: "tenant-a",
    password: "correct horse battery staple",
    roles: ["dispatcher"]
  });

  return {
    access,
    audit,
    advance(milliseconds) {
      now += milliseconds;
    }
  };
}

function expectDenied(code, operation) {
  assert.throws(operation, (error) => {
    assert.ok(error instanceof AccessDeniedError);
    assert.equal(error.code, code);
    return true;
  });
}

test("authenticates an internal user and enforces a required role", () => {
  const { access, audit } = fixture();
  const session = access.authenticate({
    identityId: "dispatcher-1",
    tenantId: "tenant-a",
    password: "correct horse battery staple",
    portal: PORTALS.INTERNAL
  });

  const decision = access.authorize({
    token: session.token,
    tenantId: "tenant-a",
    portal: PORTALS.INTERNAL,
    requiredRole: "dispatcher",
    action: "dispatch.read"
  });

  assert.equal(decision.identityId, "dispatcher-1");
  assert.equal(decision.tenantId, "tenant-a");
  assert.equal(decision.action, "dispatch.read");
  assert.ok(audit.some((entry) =>
    entry.event === "access.authorize" && entry.outcome === "allowed"
  ));
});

test("does not issue a session for an invalid password or tenant", () => {
  const { access, audit } = fixture();

  expectDenied("INVALID_CREDENTIALS", () =>
    access.authenticate({
      identityId: "dispatcher-1",
      tenantId: "tenant-b",
      password: "correct horse battery staple",
      portal: PORTALS.INTERNAL
    })
  );

  expectDenied("INVALID_CREDENTIALS", () =>
    access.authenticate({
      identityId: "dispatcher-1",
      tenantId: "tenant-a",
      password: "this password is incorrect",
      portal: PORTALS.INTERNAL
    })
  );

  assert.equal(
    audit.filter((entry) =>
      entry.event === "session.authenticate" && entry.outcome === "denied"
    ).length,
    2
  );
});

test("enforces tenant isolation after authentication", () => {
  const { access, audit } = fixture();
  const { token } = access.authenticate({
    identityId: "dispatcher-1",
    tenantId: "tenant-a",
    password: "correct horse battery staple",
    portal: PORTALS.INTERNAL
  });

  expectDenied("TENANT_ISOLATION", () =>
    access.authorize({
      token,
      tenantId: "tenant-b",
      portal: PORTALS.INTERNAL,
      requiredRole: "dispatcher",
      action: "dispatch.read"
    })
  );

  assert.ok(audit.some((entry) => entry.reason === "TENANT_ISOLATION"));
});

test("denies actions when the session lacks the required role", () => {
  const { access, audit } = fixture();
  const { token } = access.authenticate({
    identityId: "dispatcher-1",
    tenantId: "tenant-a",
    password: "correct horse battery staple",
    portal: PORTALS.INTERNAL
  });

  expectDenied("ROLE_REQUIRED", () =>
    access.authorize({
      token,
      tenantId: "tenant-a",
      portal: PORTALS.INTERNAL,
      requiredRole: "administrator",
      action: "identity.manage"
    })
  );

  assert.ok(audit.some((entry) => entry.reason === "ROLE_REQUIRED"));
});

test("keeps public and internal portal access separated", () => {
  const { access, audit } = fixture();

  expectDenied("PORTAL_SEPARATION", () =>
    access.authenticate({
      identityId: "dispatcher-1",
      tenantId: "tenant-a",
      password: "correct horse battery staple",
      portal: PORTALS.PUBLIC
    })
  );

  const publicDecision = access.accessPublicPortal({
    action: "service-request.create"
  });
  assert.equal(publicDecision.authenticated, false);

  expectDenied("PORTAL_SEPARATION", () =>
    access.accessPublicPortal({
      token: "internal-token-must-not-cross",
      action: "service-request.create"
    })
  );

  assert.ok(audit.some((entry) =>
    entry.event === "public.access" && entry.outcome === "allowed"
  ));
});

test("expires and revokes sessions", () => {
  const first = fixture();
  const firstSession = first.access.authenticate({
    identityId: "dispatcher-1",
    tenantId: "tenant-a",
    password: "correct horse battery staple",
    portal: PORTALS.INTERNAL
  });
  first.advance(60_000);

  expectDenied("SESSION_EXPIRED", () =>
    first.access.authorize({
      token: firstSession.token,
      tenantId: "tenant-a",
      portal: PORTALS.INTERNAL,
      requiredRole: "dispatcher",
      action: "dispatch.read"
    })
  );

  const second = fixture();
  const secondSession = second.access.authenticate({
    identityId: "dispatcher-1",
    tenantId: "tenant-a",
    password: "correct horse battery staple",
    portal: PORTALS.INTERNAL
  });
  second.access.revokeSession({
    token: secondSession.token,
    reason: "security-review"
  });

  expectDenied("INVALID_SESSION", () =>
    second.access.authorize({
      token: secondSession.token,
      tenantId: "tenant-a",
      portal: PORTALS.INTERNAL,
      requiredRole: "dispatcher",
      action: "dispatch.read"
    })
  );

  assert.ok(second.audit.some((entry) =>
    entry.event === "session.revoke" && entry.outcome === "allowed"
  ));
});

test("audit records omit passwords and session tokens", () => {
  const { access, audit } = fixture();
  const { token } = access.authenticate({
    identityId: "dispatcher-1",
    tenantId: "tenant-a",
    password: "correct horse battery staple",
    portal: PORTALS.INTERNAL
  });

  access.authorize({
    token,
    tenantId: "tenant-a",
    portal: PORTALS.INTERNAL,
    requiredRole: "dispatcher",
    action: "dispatch.read"
  });

  const serialized = JSON.stringify(audit);
  assert.doesNotMatch(serialized, /correct horse battery staple/);
  assert.doesNotMatch(serialized, new RegExp(token));
});
