import { createHash, randomBytes, randomUUID } from "node:crypto";
import { AuditLog } from "./audit-log.mjs";
import { hashPassword, verifyPassword } from "./passwords.mjs";

export const ROLE_PERMISSIONS = Object.freeze({
  tenant_admin: Object.freeze([
    "identity.users.manage",
    "identity.roles.manage",
    "security.audit.read",
    "sessions.revoke",
    "customers.*",
    "intake.*",
    "scheduling.*",
    "dispatch.*",
    "jobs.*",
    "operations.*",
    "reports.read"
  ]),
  admin_dispatch: Object.freeze([
    "customers.read",
    "customers.write",
    "intake.create",
    "intake.read",
    "scheduling.manage",
    "dispatch.manage",
    "jobs.read",
    "jobs.update",
    "operations.exceptions.manage"
  ]),
  technician: Object.freeze([
    "jobs.assigned.read",
    "jobs.assigned.update",
    "jobs.evidence.write"
  ]),
  manager: Object.freeze([
    "customers.read",
    "intake.read",
    "scheduling.manage",
    "dispatch.manage",
    "jobs.*",
    "operations.*",
    "reports.read"
  ]),
  executive: Object.freeze([
    "reports.read",
    "operations.read",
    "security.audit.read"
  ])
});

function keyForIdentity(tenantId, email) {
  return `${tenantId}:${String(email ?? "").trim().toLowerCase()}`;
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function permissionMatches(granted, requested) {
  return (
    granted === requested ||
    granted === "*" ||
    (granted.endsWith(".*") &&
      requested.startsWith(granted.slice(0, -1)))
  );
}

function publicPrincipal(user, tenantId) {
  return Object.freeze({
    id: user.id,
    email: user.email,
    tenantId,
    roles: Object.freeze([...(user.memberships.get(tenantId) ?? [])])
  });
}

export class SecureAccess {
  #users = new Map();
  #identities = new Map();
  #sessions = new Map();
  #passwordResets = new Map();
  #audit;
  #now;
  #sessionTtlMs;
  #passwordResetTtlMs;
  #passwordResetDelivery;

  constructor({
    auditLog = new AuditLog(),
    now = () => new Date(),
    sessionTtlMs = 8 * 60 * 60 * 1000,
    passwordResetTtlMs = 30 * 60 * 1000,
    passwordResetDelivery = async () => {}
  } = {}) {
    this.#audit = auditLog;
    this.#now = now;
    this.#sessionTtlMs = sessionTtlMs;
    this.#passwordResetTtlMs = passwordResetTtlMs;
    this.#passwordResetDelivery = passwordResetDelivery;
  }

  get auditLog() {
    return this.#audit;
  }

  async bootstrapTenantAdmin({ tenantId, email, password }) {
    if ([...this.#users.values()].some((user) => user.memberships.has(tenantId))) {
      throw new Error("Tenant bootstrap is already complete.");
    }

    const user = await this.#createUserRecord({
      tenantId,
      email,
      password,
      roles: ["tenant_admin"]
    });

    this.#audit.append({
      tenantId,
      principalId: user.id,
      type: "IdentityCreated",
      resource: `identity:${user.id}`,
      action: "identity.bootstrap",
      outcome: "granted",
      metadata: { roles: ["tenant_admin"] }
    });

    return publicPrincipal(user, tenantId);
  }

  async createUser({ actorSessionToken, tenantId, email, password, roles = [] }) {
    const actor = this.requirePermission({
      sessionToken: actorSessionToken,
      tenantId,
      permission: "identity.users.manage",
      resourceId: "identity:new"
    });

    for (const role of roles) {
      this.#assertRole(role);
    }

    const user = await this.#createUserRecord({
      tenantId,
      email,
      password,
      roles
    });

    this.#audit.append({
      tenantId,
      principalId: actor.id,
      type: "IdentityCreated",
      resource: `identity:${user.id}`,
      action: "identity.users.manage",
      outcome: "granted",
      metadata: { assignedRoles: roles }
    });

    return publicPrincipal(user, tenantId);
  }

  async #createUserRecord({ tenantId, email, password, roles }) {
    if (!tenantId || !email) {
      throw new Error("Tenant and email are required.");
    }

    const identityKey = keyForIdentity(tenantId, email);
    if (this.#identities.has(identityKey)) {
      throw new Error("Identity already exists for this tenant.");
    }

    const user = {
      id: randomUUID(),
      email: email.trim().toLowerCase(),
      passwordHash: await hashPassword(password),
      status: "active",
      memberships: new Map([[tenantId, new Set(roles)]])
    };

    this.#users.set(user.id, user);
    this.#identities.set(identityKey, user.id);
    return user;
  }

  assignRole({ actorSessionToken, tenantId, userId, role }) {
    this.#assertRole(role);
    const actor = this.requirePermission({
      sessionToken: actorSessionToken,
      tenantId,
      permission: "identity.roles.manage",
      resourceId: `identity:${userId}`
    });
    const user = this.#users.get(userId);

    if (!user?.memberships.has(tenantId)) {
      throw new Error("User is not a member of the requested tenant.");
    }

    user.memberships.get(tenantId).add(role);
    this.#audit.append({
      tenantId,
      principalId: actor.id,
      type: "RoleAssigned",
      resource: `identity:${userId}`,
      action: "identity.roles.manage",
      outcome: "granted",
      metadata: { role }
    });

    return publicPrincipal(user, tenantId);
  }

  revokeRole({ actorSessionToken, tenantId, userId, role }) {
    this.#assertRole(role);
    const actor = this.requirePermission({
      sessionToken: actorSessionToken,
      tenantId,
      permission: "identity.roles.manage",
      resourceId: `identity:${userId}`
    });
    const user = this.#users.get(userId);

    if (!user?.memberships.has(tenantId)) {
      throw new Error("User is not a member of the requested tenant.");
    }

    user.memberships.get(tenantId).delete(role);
    this.#audit.append({
      tenantId,
      principalId: actor.id,
      type: "RoleRevoked",
      resource: `identity:${userId}`,
      action: "identity.roles.manage",
      outcome: "granted",
      metadata: { role }
    });

    return publicPrincipal(user, tenantId);
  }

  async authenticate({ tenantId, email, password, client = {} }) {
    const userId = this.#identities.get(keyForIdentity(tenantId, email));
    const user = userId ? this.#users.get(userId) : null;
    const valid =
      user?.status === "active" &&
      user.memberships.has(tenantId) &&
      (await verifyPassword(password, user.passwordHash));

    if (!valid) {
      this.#audit.append({
        tenantId,
        type: "AuthenticationFailed",
        resource: "session:new",
        action: "identity.authenticate",
        outcome: "denied",
        metadata: { email: String(email).trim().toLowerCase(), client }
      });
      throw new Error("Invalid credentials.");
    }

    const token = randomBytes(32).toString("base64url");
    const session = {
      id: randomUUID(),
      tokenHash: hashToken(token),
      userId: user.id,
      tenantId,
      createdAt: this.#now(),
      expiresAt: new Date(this.#now().getTime() + this.#sessionTtlMs),
      revokedAt: null
    };
    this.#sessions.set(session.tokenHash, session);

    this.#audit.append({
      tenantId,
      principalId: user.id,
      type: "AuthenticationSucceeded",
      resource: `session:${session.id}`,
      action: "identity.authenticate",
      outcome: "granted",
      metadata: { client }
    });

    return Object.freeze({
      token,
      sessionId: session.id,
      expiresAt: session.expiresAt.toISOString(),
      principal: publicPrincipal(user, tenantId)
    });
  }

  validateSession(token) {
    const session = this.#sessions.get(hashToken(token));
    if (!session || session.revokedAt) {
      throw new Error("Session is not active.");
    }

    if (session.expiresAt.getTime() <= this.#now().getTime()) {
      throw new Error("Session has expired.");
    }

    const user = this.#users.get(session.userId);
    if (!user || user.status !== "active" || !user.memberships.has(session.tenantId)) {
      throw new Error("Session principal is not active.");
    }

    return publicPrincipal(user, session.tenantId);
  }

  logout(token) {
    const session = this.#sessions.get(hashToken(token));
    if (!session || session.revokedAt) {
      return false;
    }

    session.revokedAt = this.#now();
    this.#audit.append({
      tenantId: session.tenantId,
      principalId: session.userId,
      type: "SessionRevoked",
      resource: `session:${session.id}`,
      action: "sessions.revoke",
      outcome: "granted",
      metadata: { reason: "logout" }
    });
    return true;
  }

  async requestPasswordReset({ tenantId, email }) {
    const userId = this.#identities.get(keyForIdentity(tenantId, email));
    const user = userId ? this.#users.get(userId) : null;

    if (user?.status === "active" && user.memberships.has(tenantId)) {
      const token = randomBytes(32).toString("base64url");
      const reset = {
        tokenHash: hashToken(token),
        userId: user.id,
        tenantId,
        expiresAt: new Date(this.#now().getTime() + this.#passwordResetTtlMs),
        usedAt: null
      };
      this.#passwordResets.set(reset.tokenHash, reset);
      await this.#passwordResetDelivery({
        tenantId,
        userId: user.id,
        email: user.email,
        token,
        expiresAt: reset.expiresAt.toISOString()
      });
    }

    this.#audit.append({
      tenantId,
      principalId: user?.id ?? null,
      type: "PasswordResetRequested",
      resource: "credential:password",
      action: "identity.password.reset.request",
      outcome: "granted",
      metadata: {}
    });

    return Object.freeze({ accepted: true });
  }

  async completePasswordReset({ tenantId, token, newPassword }) {
    const reset = this.#passwordResets.get(hashToken(token));
    if (
      !reset ||
      reset.tenantId !== tenantId ||
      reset.usedAt ||
      reset.expiresAt.getTime() <= this.#now().getTime()
    ) {
      throw new Error("Password reset token is invalid or expired.");
    }

    const user = this.#users.get(reset.userId);
    if (!user || user.status !== "active") {
      throw new Error("Password reset principal is not active.");
    }

    user.passwordHash = await hashPassword(newPassword);
    reset.usedAt = this.#now();

    for (const session of this.#sessions.values()) {
      if (
        session.userId === user.id &&
        session.tenantId === tenantId &&
        !session.revokedAt
      ) {
        session.revokedAt = this.#now();
      }
    }

    this.#audit.append({
      tenantId,
      principalId: user.id,
      type: "PasswordResetCompleted",
      resource: `identity:${user.id}`,
      action: "identity.password.reset.complete",
      outcome: "granted",
      metadata: { sessionsRevoked: true }
    });

    return true;
  }

  authorize({ sessionToken, tenantId, permission, resourceId }) {
    let principal;

    try {
      principal = this.validateSession(sessionToken);
    } catch (error) {
      this.#audit.append({
        tenantId,
        type: "AuthorizationDenied",
        resource: resourceId,
        action: permission,
        outcome: "denied",
        metadata: { reason: error.message }
      });
      return Object.freeze({ granted: false, reason: error.message });
    }

    if (principal.tenantId !== tenantId) {
      this.#audit.append({
        tenantId: principal.tenantId,
        principalId: principal.id,
        type: "AuthorizationDenied",
        resource: resourceId,
        action: permission,
        outcome: "denied",
        metadata: { reason: "tenant-mismatch", requestedTenantId: tenantId }
      });
      return Object.freeze({ granted: false, reason: "tenant-mismatch" });
    }

    const granted = principal.roles.some((role) =>
      (ROLE_PERMISSIONS[role] ?? []).some((candidate) =>
        permissionMatches(candidate, permission)
      )
    );

    this.#audit.append({
      tenantId,
      principalId: principal.id,
      type: granted ? "AuthorizationGranted" : "AuthorizationDenied",
      resource: resourceId,
      action: permission,
      outcome: granted ? "granted" : "denied",
      metadata: { roles: principal.roles }
    });

    return Object.freeze({
      granted,
      reason: granted ? "role-permission" : "permission-not-granted",
      principal
    });
  }

  requirePermission(request) {
    const decision = this.authorize(request);
    if (!decision.granted) {
      throw new Error(`Access denied: ${decision.reason}`);
    }
    return decision.principal;
  }

  readAudit({ sessionToken, tenantId }) {
    this.requirePermission({
      sessionToken,
      tenantId,
      permission: "security.audit.read",
      resourceId: `audit:${tenantId}`
    });
    return this.#audit.list({ tenantId });
  }

  recordPublicBoundary({ tenantId, action, outcome, metadata = {} }) {
    return this.#audit.append({
      tenantId,
      type: outcome === "granted" ? "PublicActionAccepted" : "PublicActionRejected",
      resource: "portal:public",
      action,
      outcome,
      metadata
    });
  }

  #assertRole(role) {
    if (!ROLE_PERMISSIONS[role]) {
      throw new Error(`Unknown role: ${role}`);
    }
  }
}
