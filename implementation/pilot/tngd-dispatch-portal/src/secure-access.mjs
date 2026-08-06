import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual
} from "node:crypto";

export const PORTALS = Object.freeze({
  INTERNAL: "internal",
  PUBLIC: "public"
});

export class AccessDeniedError extends Error {
  constructor(code, message = "Access denied.") {
    super(message);
    this.name = "AccessDeniedError";
    this.code = code;
  }
}

const PASSWORD_MIN_LENGTH = 12;
const DEFAULT_SESSION_TTL_MS = 30 * 60 * 1000;
const SCRYPT_KEY_LENGTH = 64;
const DUMMY_CREDENTIAL = hashPassword("not-a-real-password");

function requireText(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${name} must be a non-empty string.`);
  }

  return value.trim();
}

function normalizeRoles(roles) {
  if (!Array.isArray(roles) || roles.length === 0) {
    throw new TypeError("roles must contain at least one role.");
  }

  return Object.freeze([...new Set(roles.map((role) => requireText(role, "role")))]);
}

function hashPassword(password, salt = randomBytes(16)) {
  const derived = scryptSync(password, salt, SCRYPT_KEY_LENGTH);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

function passwordMatches(password, credential) {
  const [saltHex, hashHex] = credential.split(":");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

function tokenDigest(token) {
  return createHash("sha256").update(token).digest("hex");
}

function freezeAuditEntry(entry) {
  return Object.freeze({
    auditId: randomUUID(),
    recordedAt: entry.recordedAt,
    event: entry.event,
    outcome: entry.outcome,
    actorId: entry.actorId ?? null,
    tenantId: entry.tenantId ?? null,
    role: entry.role ?? null,
    action: entry.action ?? null,
    reason: entry.reason ?? null
  });
}

export function createSecureAccessService({
  clock = () => Date.now(),
  sessionTtlMs = DEFAULT_SESSION_TTL_MS,
  auditSink = () => {}
} = {}) {
  if (typeof clock !== "function" || typeof auditSink !== "function") {
    throw new TypeError("clock and auditSink must be functions.");
  }

  if (!Number.isSafeInteger(sessionTtlMs) || sessionTtlMs <= 0) {
    throw new TypeError("sessionTtlMs must be a positive safe integer.");
  }

  const identities = new Map();
  const sessions = new Map();

  function audit(event) {
    const entry = freezeAuditEntry({
      ...event,
      recordedAt: new Date(clock()).toISOString()
    });
    auditSink(entry);
    return entry;
  }

  function deny(code, event) {
    audit({ ...event, outcome: "denied", reason: code });
    throw new AccessDeniedError(code);
  }

  function registerIdentity({ identityId, tenantId, password, roles }) {
    const normalizedIdentityId = requireText(identityId, "identityId");
    const normalizedTenantId = requireText(tenantId, "tenantId");

    if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
      throw new TypeError(
        `password must contain at least ${PASSWORD_MIN_LENGTH} characters.`
      );
    }

    if (identities.has(normalizedIdentityId)) {
      deny("IDENTITY_EXISTS", {
        event: "identity.register",
        actorId: normalizedIdentityId,
        tenantId: normalizedTenantId
      });
    }

    identities.set(
      normalizedIdentityId,
      Object.freeze({
        identityId: normalizedIdentityId,
        tenantId: normalizedTenantId,
        credential: hashPassword(password),
        roles: normalizeRoles(roles),
        enabled: true
      })
    );

    audit({
      event: "identity.register",
      outcome: "allowed",
      actorId: normalizedIdentityId,
      tenantId: normalizedTenantId
    });
  }

  function authenticate({ identityId, tenantId, password, portal }) {
    const normalizedIdentityId = requireText(identityId, "identityId");
    const normalizedTenantId = requireText(tenantId, "tenantId");

    if (portal !== PORTALS.INTERNAL) {
      deny("PORTAL_SEPARATION", {
        event: "session.authenticate",
        actorId: normalizedIdentityId,
        tenantId: normalizedTenantId
      });
    }

    const identity = identities.get(normalizedIdentityId);
    const suppliedPassword = typeof password === "string" ? password : "";
    const credential = identity?.credential ?? DUMMY_CREDENTIAL;
    const validPassword = passwordMatches(suppliedPassword, credential);

    if (
      !identity ||
      !identity.enabled ||
      identity.tenantId !== normalizedTenantId ||
      !validPassword
    ) {
      deny("INVALID_CREDENTIALS", {
        event: "session.authenticate",
        actorId: normalizedIdentityId,
        tenantId: normalizedTenantId
      });
    }

    const token = randomBytes(32).toString("base64url");
    const issuedAt = clock();
    sessions.set(
      tokenDigest(token),
      Object.freeze({
        sessionId: randomUUID(),
        identityId: identity.identityId,
        tenantId: identity.tenantId,
        roles: identity.roles,
        portal: PORTALS.INTERNAL,
        issuedAt,
        expiresAt: issuedAt + sessionTtlMs
      })
    );

    audit({
      event: "session.authenticate",
      outcome: "allowed",
      actorId: identity.identityId,
      tenantId: identity.tenantId
    });

    return Object.freeze({
      token,
      expiresAt: issuedAt + sessionTtlMs
    });
  }

  function authorize({ token, tenantId, portal, requiredRole, action }) {
    const normalizedTenantId = requireText(tenantId, "tenantId");
    const normalizedRole = requireText(requiredRole, "requiredRole");
    const normalizedAction = requireText(action, "action");

    if (portal !== PORTALS.INTERNAL) {
      deny("PORTAL_SEPARATION", {
        event: "access.authorize",
        tenantId: normalizedTenantId,
        role: normalizedRole,
        action: normalizedAction
      });
    }

    const session = sessions.get(tokenDigest(requireText(token, "token")));
    const auditContext = {
      event: "access.authorize",
      actorId: session?.identityId,
      tenantId: normalizedTenantId,
      role: normalizedRole,
      action: normalizedAction
    };

    if (!session) {
      deny("INVALID_SESSION", auditContext);
    }

    if (clock() >= session.expiresAt) {
      sessions.delete(tokenDigest(token));
      deny("SESSION_EXPIRED", auditContext);
    }

    if (session.portal !== portal) {
      deny("PORTAL_SEPARATION", auditContext);
    }

    if (session.tenantId !== normalizedTenantId) {
      deny("TENANT_ISOLATION", auditContext);
    }

    if (!session.roles.includes(normalizedRole)) {
      deny("ROLE_REQUIRED", auditContext);
    }

    audit({ ...auditContext, outcome: "allowed" });

    return Object.freeze({
      identityId: session.identityId,
      tenantId: session.tenantId,
      roles: session.roles,
      action: normalizedAction
    });
  }

  function accessPublicPortal({ token, action }) {
    const normalizedAction = requireText(action, "action");

    if (token !== undefined && token !== null) {
      deny("PORTAL_SEPARATION", {
        event: "public.access",
        action: normalizedAction
      });
    }

    audit({
      event: "public.access",
      outcome: "allowed",
      action: normalizedAction
    });

    return Object.freeze({
      portal: PORTALS.PUBLIC,
      action: normalizedAction,
      authenticated: false
    });
  }

  function revokeSession({ token, reason = "operator-request" }) {
    const digest = tokenDigest(requireText(token, "token"));
    const session = sessions.get(digest);

    if (!session) {
      deny("INVALID_SESSION", {
        event: "session.revoke",
        reason
      });
    }

    sessions.delete(digest);
    audit({
      event: "session.revoke",
      outcome: "allowed",
      actorId: session.identityId,
      tenantId: session.tenantId,
      reason: requireText(reason, "reason")
    });
  }

  return Object.freeze({
    registerIdentity,
    authenticate,
    authorize,
    accessPublicPortal,
    revokeSession
  });
}
