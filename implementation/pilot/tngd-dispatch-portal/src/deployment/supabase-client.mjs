import { createHash } from "node:crypto";

const requiredText = (value, label) => {
  if (typeof value !== "string" || !value.trim()) throw Object.assign(new Error(`${label} is required.`), { statusCode: 400 });
  return value.trim();
};

const uuid = (value, label) => {
  const normalized = requiredText(value, label);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized)) {
    throw Object.assign(new Error(`${label} must be a UUID.`), { statusCode: 400 });
  }
  return normalized;
};

const responseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
};

const sessionAge = (value) => Number.isInteger(value) && value >= 60 ? Math.min(value, 3600) : 3600;

export class SupabaseHttpClient {
  constructor({ url, publishableKey, fetchImpl = fetch }) {
    this.url = requiredText(url, "Supabase URL").replace(/\/$/, "");
    this.publishableKey = requiredText(publishableKey, "Supabase publishable key");
    this.fetch = fetchImpl;
  }

  async request(path, { method = "GET", accessToken, body, headers = {} } = {}) {
    const response = await this.fetch(`${this.url}${path}`, {
      method,
      headers: {
        apikey: this.publishableKey,
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
        ...(body === undefined ? {} : { "content-type": "application/json" }),
        ...headers
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const value = await responseBody(response);
    if (!response.ok) {
      const message = typeof value === "object" ? value?.message || value?.error_description || value?.error || "supabase-request-failed" : value || "supabase-request-failed";
      throw Object.assign(new Error(String(message)), { statusCode: response.status, provider: "supabase" });
    }
    return value;
  }
}

const allowedUiRoles = new Set(["technician", "dispatcher", "administrator"]);

export class SupabaseAuthBoundary {
  constructor({ client }) { this.client = client; }

  async signInWithPassword({ email, password }) {
    let result;
    try {
      result = await this.client.request("/auth/v1/token?grant_type=password", {
        method: "POST",
        body: { email: requiredText(email, "Email"), password: requiredText(password, "Password") }
      });
    } catch (error) {
      if (error.statusCode === 400) error.statusCode = 401;
      throw error;
    }
    return Object.freeze({
      accessToken: requiredText(result.access_token, "Supabase access token"),
      refreshToken: requiredText(result.refresh_token, "Supabase refresh token"),
      maxAge: sessionAge(result.expires_in)
    });
  }

  async refreshSession({ refreshToken }) {
    const result = await this.client.request("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: requiredText(refreshToken, "Refresh token") }
    });
    return Object.freeze({
      accessToken: requiredText(result.access_token, "Supabase access token"),
      refreshToken: requiredText(result.refresh_token, "Supabase refresh token"),
      maxAge: sessionAge(result.expires_in)
    });
  }

  async resolvePrincipal({ accessToken, requestedTenantId = null }) {
    requiredText(accessToken, "Access token");
    const identity = await this.client.request("/auth/v1/user", { accessToken });
    const userId = uuid(identity.id, "Verified user ID");
    const query = new URLSearchParams({
      user_id: `eq.${userId}`,
      active: "is.true",
      select: "tenant_id,email,ui_role,roles,permissions"
    });
    if (requestedTenantId) query.set("tenant_id", `eq.${uuid(requestedTenantId, "Requested tenant")}`);
    const memberships = await this.client.request(`/rest/v1/dispatch_tenant_memberships?${query}`, { accessToken });
    if (!Array.isArray(memberships) || memberships.length === 0) throw Object.assign(new Error("active-tenant-membership-required"), { statusCode: 403 });
    if (!requestedTenantId && memberships.length !== 1) throw Object.assign(new Error("tenant-selection-required"), { statusCode: 409 });
    const membership = memberships[0];
    if (!allowedUiRoles.has(membership.ui_role)) throw Object.assign(new Error("membership-ui-role-invalid"), { statusCode: 403 });
    return Object.freeze({
      id: userId,
      tenantId: uuid(membership.tenant_id, "Authoritative tenant"),
      uiRole: membership.ui_role,
      roles: Object.freeze([...(membership.roles || [])]),
      permissions: Object.freeze([...(membership.permissions || [])]),
      email: requiredText(membership.email || identity.email, "Authoritative identity email"),
      accessToken
    });
  }
}

export class SupabasePersistenceAdapter {
  constructor({ client, principal }) {
    if (!principal?.accessToken || !principal?.tenantId) throw new Error("Verified principal is required.");
    this.client = client;
    this.principal = principal;
  }

  async load({ aggregateType, aggregateId }) {
    const query = new URLSearchParams({
      tenant_id: `eq.${this.principal.tenantId}`,
      aggregate_type: `eq.${requiredText(aggregateType, "Aggregate type")}`,
      aggregate_id: `eq.${uuid(aggregateId, "Aggregate ID")}`,
      select: "aggregate_type,aggregate_id,version,state,created_at,updated_at"
    });
    const rows = await this.client.request(`/rest/v1/dispatch_aggregates?${query}`, { accessToken: this.principal.accessToken });
    return rows[0] || null;
  }

  async save({ aggregateType, aggregateId, expectedVersion, state, event, idempotencyKey }) {
    if (!Number.isInteger(expectedVersion) || expectedVersion < 0) throw new Error("Expected version must be a non-negative integer.");
    if (!state || typeof state !== "object" || Array.isArray(state)) throw new Error("Aggregate state must be an object.");
    const operation = {
      tenantId: this.principal.tenantId,
      aggregateType: requiredText(aggregateType, "Aggregate type"),
      aggregateId: uuid(aggregateId, "Aggregate ID"),
      expectedVersion,
      state,
      eventType: requiredText(event?.type, "Event type"),
      eventPayload: event?.payload || {}
    };
    const requestHash = createHash("sha256").update(JSON.stringify(operation)).digest("hex");
    return this.client.request("/rest/v1/rpc/dispatch_save_aggregate", {
      method: "POST",
      accessToken: this.principal.accessToken,
      body: {
        p_tenant_id: operation.tenantId,
        p_aggregate_type: operation.aggregateType,
        p_aggregate_id: operation.aggregateId,
        p_expected_version: expectedVersion,
        p_state: state,
        p_event_type: operation.eventType,
        p_event_payload: operation.eventPayload,
        p_idempotency_key: requiredText(idempotencyKey, "Idempotency key"),
        p_request_hash: requestHash
      }
    });
  }
}
