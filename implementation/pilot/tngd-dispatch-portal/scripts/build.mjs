import { mkdir, writeFile } from "node:fs/promises";
import { foundation } from "../src/foundation.mjs";
const { securityManifest } = await import("../src/security/index.mjs");
const { intakeManifest } = await import("../src/intake/index.mjs");

await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../dist/foundation-manifest.json", import.meta.url),
  `${JSON.stringify(foundation, null, 2)}\n`,
  "utf8"
);

await writeFile(
  new URL("../dist/security-manifest.json", import.meta.url),
  `${JSON.stringify(securityManifest, null, 2)}\n`,
  "utf8"
);

await writeFile(
  new URL("../dist/intake-manifest.json", import.meta.url),
  `${JSON.stringify(intakeManifest, null, 2)}\n`,
  "utf8"
);

process.stdout.write(
  "Built foundation, security, and intake manifests\n"
);
