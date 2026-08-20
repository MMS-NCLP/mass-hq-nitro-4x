import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicRoot = resolve(root, "dist/public");
const files = [];
const walk = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else {
      const bytes = await readFile(path);
      files.push(Object.freeze({ path: relative(publicRoot, path).replaceAll("\\", "/"), bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex").toUpperCase() }));
    }
  }
};
await walk(publicRoot);
files.sort((a, b) => a.path.localeCompare(b.path));
const manifest = Object.freeze({
  schema: "mass.dispatch.live-qa-candidate.v1",
  startingCanonical: "05038d2a1ab638cbd0662fba65c0af6b94be01cd",
  candidateCommit: process.env.MASS_RELEASE_SHA || "set-after-candidate-commit",
  generatedAt: new Date().toISOString(),
  runtime: { engine: "node", minimumMajor: 22, start: "npm start" },
  posture: { phase: "pre-launch-live-qa", productionAccepted: false, liveData: false },
  requiredEnvironment: ["MASS_RUNTIME_ENV", "MASS_DEPLOYMENT_TARGET", "MASS_DEPLOYMENT_MODE", "MASS_BIND_HOST"],
  optionalProviderEnvironment: ["MASS_DATABASE_URL", "MASS_MEDIA_SOURCE_ROOT", "MASS_PUBLIC_ORIGIN"],
  blockers: ["hosting-provider-unselected", "production-session-provider-unselected", "durable-persistence-unselected", "rendered-browser-qa-blocked"],
  files
});
await mkdir(resolve(root, "dist"), { recursive: true });
await writeFile(resolve(root, "dist/live-qa-candidate-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(`Packaged pre-launch live QA candidate manifest for ${files.length} browser assets.\n`);
