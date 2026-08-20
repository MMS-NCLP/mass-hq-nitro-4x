import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const read = (path, encoding = "utf8") => readFile(new URL(`../${path}`, import.meta.url), encoding);
const html = await read("public/index.html");
const css = await read("public/app.css");
const js = await read("public/app.js");
const manifest = JSON.parse(await read("public/media/manifest.json"));

for (const required of ["primary-nav", "mobile-nav", "workspace", "theme-toggle", "role-select", "app.js", "app.css"]) {
  if (!html.includes(required)) throw new Error(`Browser shell reference missing: ${required}`);
}
for (const responsive of ["@media(max-width:1180px)", "@media(max-width:820px)", "@media(max-width:460px)", "prefers-reduced-motion", ".mobile-nav", ".job-brief", ".calendar-grid"]) {
  if (!css.includes(responsive)) throw new Error(`Responsive presentation boundary missing: ${responsive}`);
}
for (const state of ["loading-state", "Provider unavailable", "permission", "Unavailable", "Fallback", "Preview only"]) {
  if (!html.includes(state) && !js.includes(state)) throw new Error(`Required presentation state missing: ${state}`);
}
for (const forbidden of ["G:\\\\", "C:\\\\Users\\\\", "file://", "garageDoorOrderForm", "Adaptive Ambient Dynamic Pulse V2"]) {
  if (html.includes(forbidden) || css.includes(forbidden) || js.includes(forbidden)) throw new Error(`Forbidden UI scope or physical source path: ${forbidden}`);
}

for (const asset of manifest.assets) {
  const bytes = await read(`public/assets/${asset.sourceKey}`, null);
  const checksum = createHash("sha256").update(bytes).digest("hex").toUpperCase();
  if (checksum !== asset.checksum) throw new Error(`Approved asset checksum mismatch: ${asset.assetId}`);
}

if (manifest.deferredCollections.length !== 6) throw new Error("The six approved governed media collections must remain explicitly deferred until provider inventory.");
process.stdout.write("Product Realization static, responsive, state, and approved-asset validation passed.\n");
