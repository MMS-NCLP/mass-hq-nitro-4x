import { mkdir, writeFile } from "node:fs/promises";
import { foundation } from "../src/foundation.mjs";
const { securityManifest } = await import("../src/security/index.mjs");
const { intakeManifest } = await import("../src/intake/index.mjs");
const { customerCaseManifest } = await import("../src/customer/index.mjs");
const { schedulingManifest } = await import("../src/scheduling/index.mjs");
const { capacityManifest } = await import("../src/capacity/index.mjs");
const { dispatchManifest } = await import("../src/dispatch/index.mjs");

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

await writeFile(
  new URL("../dist/customer-case-manifest.json", import.meta.url),
  `${JSON.stringify(customerCaseManifest, null, 2)}\n`,
  "utf8"
);

await writeFile(new URL("../dist/scheduling-manifest.json", import.meta.url), `${JSON.stringify(schedulingManifest, null, 2)}\n`, "utf8");
await writeFile(new URL("../dist/capacity-manifest.json", import.meta.url), `${JSON.stringify(capacityManifest, null, 2)}\n`, "utf8");
await writeFile(new URL("../dist/dispatch-manifest.json", import.meta.url), `${JSON.stringify(dispatchManifest, null, 2)}\n`, "utf8");

process.stdout.write(
  "Built foundation through BP-007 dispatch manifests\n"
);
