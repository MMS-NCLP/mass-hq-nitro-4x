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
  "content-security-policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"
});

const json = (response, status, body) => {
  response.writeHead(status, { ...securityHeaders, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(body));
};

export function createProductRealizationServer({ root = publicRoot } = {}) {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://dispatch.local");
      if (url.pathname === "/api/health") return json(response, 200, { status: "ready", phase: "pre-launch-live-qa-candidate", deploymentValidated: false, productionAccepted: false });
      if (url.pathname === "/api/bootstrap") {
        const role = ["technician", "dispatcher", "administrator"].includes(url.searchParams.get("role")) ? url.searchParams.get("role") : "technician";
        return json(response, 200, {
          ...productRealizationContract(),
          session: { authenticated: true, role, preview: true, tenantId: "tngd-preview", principalId: `${role}-preview` },
          permittedRoutes: routesForRoles([role]),
          pulse: operationalPulse({ active: 2, attention: 1 })
        });
      }
      const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
      let target = resolve(root, requested);
      if (!target.startsWith(`${resolve(root)}${sep}`) && target !== resolve(root, "index.html")) return json(response, 403, { error: "path-denied" });
      try { if ((await stat(target)).isDirectory()) target = resolve(target, "index.html"); } catch { if (!extname(requested)) target = resolve(root, "index.html"); }
      const body = await readFile(target);
      response.writeHead(200, { ...securityHeaders, "content-type": types[extname(target)] || "application/octet-stream", "cache-control": extname(target) === ".html" ? "no-store" : "public, max-age=3600" });
      response.end(body);
    } catch (error) {
      if (error?.code === "ENOENT") return json(response, 404, { error: "not-found" });
      json(response, 500, { error: "presentation-unavailable" });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4173);
  const host = process.env.MASS_BIND_HOST || "127.0.0.1";
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be a valid TCP port.");
  createProductRealizationServer().listen(port, host, () => process.stdout.write(`MASS Dispatch pre-launch candidate listening on ${host}:${port}\n`));
}
