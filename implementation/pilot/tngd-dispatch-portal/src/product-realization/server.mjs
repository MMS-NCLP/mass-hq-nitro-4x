import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { operationalPulse, productRealizationContract, routesForRoles } from "./presentation.mjs";

const publicRoot = fileURLToPath(new URL("../../public/", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml" };
const securityHeaders = Object.freeze({
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "no-referrer",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "cross-origin-opener-policy": "same-origin",
  "content-security-policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-src https://www.openstreetmap.org; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"
});

const json = (response, status, body) => {
  response.writeHead(status, { ...securityHeaders, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(body));
};

const cookie = (request, name) => String(request.headers?.cookie || "")
  .split(";")
  .map((part) => part.trim().split("="))
  .find(([key]) => key === name)?.[1] || null;

const bearer = (request) => {
  const value = String(request.headers?.authorization || "");
  return value.startsWith("Bearer ") ? value.slice(7).trim() : null;
};

async function readJson(request) {
  if (request.body && typeof request.body === "object") return request.body;
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16 * 1024) throw Object.assign(new Error("request-body-too-large"), { statusCode: 413 });
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw Object.assign(new Error("invalid-json"), { statusCode: 400 }); }
}

const sessionCookies = ({ accessToken, refreshToken, maxAge = 3600 }) => [
  `__Host-mass_access=${encodeURIComponent(accessToken)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`,
  `__Secure-mass_refresh=${encodeURIComponent(refreshToken)}; Path=/api/session; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`
];

const clearedSessionCookies = () => [
  "__Host-mass_access=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
  "__Secure-mass_refresh=; Path=/api/session; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
];

const accessTokenFor = (request) => bearer(request) || (cookie(request, "__Host-mass_access") ? decodeURIComponent(cookie(request, "__Host-mass_access")) : null);

const requireSameOrigin = (request, configuredOrigin = null) => {
  const origin = request.headers?.origin;
  if (!origin) return;
  const forwardedProtocol = String(request.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
  const expected = configuredOrigin || `${forwardedProtocol}://${request.headers?.host}`;
  if (origin !== expected) throw Object.assign(new Error("cross-origin-session-request-denied"), { statusCode: 403 });
};

export function createProductRealizationHandler({ root = publicRoot, authBoundary = null, serveStatic = true, adapterName = null, allowedOrigin = null } = {}) {
  return async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://dispatch.local");
      if (url.pathname === "/api/health") {
        return json(response, 200, {
          status: "ready",
          phase: "pre-launch-live-qa-candidate",
          adapter: adapterName || (authBoundary ? "vercel-supabase" : "local-preview"),
          deploymentValidated: false,
          productionAccepted: false
        });
      }
      if (url.pathname === "/api/session" && request.method === "POST") {
        if (!authBoundary) return json(response, 503, { error: "authentication-provider-unavailable" });
        requireSameOrigin(request, allowedOrigin);
        const body = await readJson(request);
        const session = await authBoundary.signInWithPassword({ email: body.email, password: body.password });
        response.setHeader("set-cookie", sessionCookies(session));
        return json(response, 200, { authenticated: true, expiresIn: session.maxAge });
      }
      if (url.pathname === "/api/session" && request.method === "PUT") {
        if (!authBoundary) return json(response, 503, { error: "authentication-provider-unavailable" });
        requireSameOrigin(request, allowedOrigin);
        const refreshToken = cookie(request, "__Secure-mass_refresh");
        if (!refreshToken) return json(response, 401, { error: "refresh-session-required" });
        const session = await authBoundary.refreshSession({ refreshToken: decodeURIComponent(refreshToken) });
        response.setHeader("set-cookie", sessionCookies(session));
        return json(response, 200, { authenticated: true, expiresIn: session.maxAge });
      }
      if (url.pathname === "/api/session" && request.method === "DELETE") {
        requireSameOrigin(request, allowedOrigin);
        response.setHeader("set-cookie", clearedSessionCookies());
        return json(response, 200, { authenticated: false });
      }
      if (url.pathname === "/api/bootstrap") {
        if (request.method !== "GET") return json(response, 405, { error: "method-not-allowed" });
        if (authBoundary) {
          const accessToken = accessTokenFor(request);
          if (!accessToken) return json(response, 401, { error: "authentication-required" });
          const principal = await authBoundary.resolvePrincipal({
            accessToken,
            requestedTenantId: request.headers?.["x-mass-tenant-id"] || null
          });
          return json(response, 200, {
            ...productRealizationContract(),
            mode: "live-qa",
            session: {
              authenticated: true,
              role: principal.uiRole,
              roles: principal.roles,
              preview: false,
              tenantId: principal.tenantId,
              principalId: principal.id,
              email: principal.email,
              displayName: principal.displayName || null
            },
            permittedRoutes: routesForRoles([principal.uiRole]),
            pulse: operationalPulse({}),
            providers: { persistence: "supabase", authentication: "supabase", storage: "supabase" }
          });
        }
        const role = ["technician", "dispatcher", "administrator"].includes(url.searchParams.get("role")) ? url.searchParams.get("role") : "technician";
        return json(response, 200, {
          ...productRealizationContract(),
          session: { authenticated: true, role, preview: true, tenantId: "tngd-preview", principalId: `${role}-preview`, displayName: `Preview ${role}` },
          permittedRoutes: routesForRoles([role]),
          pulse: operationalPulse({ active: 2, attention: 1 })
        });
      }
      if (url.pathname.startsWith("/api/")) return json(response, 404, { error: "api-route-not-found" });
      if (!serveStatic) return json(response, 404, { error: "static-route-not-served-by-function" });
      const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
      let target = resolve(root, requested);
      if (!target.startsWith(`${resolve(root)}${sep}`) && target !== resolve(root, "index.html")) return json(response, 403, { error: "path-denied" });
      try { if ((await stat(target)).isDirectory()) target = resolve(target, "index.html"); } catch { if (!extname(requested)) target = resolve(root, "index.html"); }
      const body = await readFile(target);
      response.writeHead(200, { ...securityHeaders, "content-type": types[extname(target)] || "application/octet-stream", "cache-control": extname(target) === ".html" ? "no-store" : "public, max-age=3600" });
      response.end(body);
    } catch (error) {
      const status = error?.statusCode || 500;
      if (error?.code === "ENOENT") return json(response, 404, { error: "not-found" });
      if (status >= 400 && status < 500) return json(response, status, { error: error.message });
      json(response, 500, { error: "presentation-unavailable" });
    }
  };
}

export function createProductRealizationServer({ root = publicRoot } = {}) {
  return createServer(createProductRealizationHandler({ root }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4173);
  const host = process.env.MASS_BIND_HOST || "127.0.0.1";
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be a valid TCP port.");
  createProductRealizationServer().listen(port, host, () => process.stdout.write(`MASS Dispatch pre-launch candidate listening on ${host}:${port}\n`));
}
