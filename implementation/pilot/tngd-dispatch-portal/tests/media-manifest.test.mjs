import test from "node:test";
import assert from "node:assert/strict";
import { MediaSourceRegistry, createMediaCatalog, defineMediaManifest } from "../src/media/index.mjs";

const tenantId = "tngd";
const manifest = defineMediaManifest({ assets: [
  { assetId: "brand:tngd", tenantId, sourceCollection: "approved-brand", sourceKey: "brands/tngd.png", mimeType: "image/png", classification: "company-brand", grade: "company", approvalState: "public-approved", internalEligible: true, publicEligible: true, lineage: "executive-supplied" },
  { assetId: "job:before", tenantId, sourceCollection: "repair-images", sourceKey: "jobs/a/before.jpg", mimeType: "image/jpeg", classification: "before", approvalState: "internal-approved", associations: { jobId: "job-a", relatedAssetId: "job:after", relationship: "before" } },
  { assetId: "restricted", tenantId, sourceCollection: "customer-portfolio", sourceKey: "private/customer.jpg", mimeType: "image/jpeg", classification: "customer-job", approvalState: "restricted" }
] });

test("media manifest is provider-independent and rejects physical or traversing paths", () => {
  assert.equal(manifest.schema, "mass.media-manifest.v1");
  for (const sourceKey of ["G:\\My Drive\\image.png", "../image.png", "/tmp/image.png"]) {
    assert.throws(() => defineMediaManifest({ assets: [{ ...manifest.assets[0], assetId: sourceKey, sourceKey }] }), /provider-relative|traversal-free/);
  }
});

test("media resolution changes provider root without rewriting governed references", () => {
  const registry = new MediaSourceRegistry().register({ providerId: "local", rootUrl: "/media" });
  const catalog = createMediaCatalog({ manifest, registry, providerId: "local" });
  assert.equal(catalog.resolve("brand:tngd", "public").url, "/media/brands/tngd.png");
  const moved = new MediaSourceRegistry().register({ providerId: "external", rootUrl: "https://assets.example.test/tngd" });
  assert.equal(createMediaCatalog({ manifest, registry: moved, providerId: "external" }).resolve("brand:tngd").url, "https://assets.example.test/tngd/brands/tngd.png");
});

test("rights boundaries deny public and restricted use while intentional fallback remains explicit", () => {
  const registry = new MediaSourceRegistry().register({ providerId: "local", rootUrl: "/media" });
  const catalog = createMediaCatalog({ manifest, registry, providerId: "local" });
  assert.equal(catalog.resolve("job:before", "public").reason, "public-use-not-approved");
  assert.equal(catalog.resolve("restricted").reason, "rights-restricted");
  assert.equal(catalog.resolve("missing").reason, "asset-unavailable");
  assert.equal(createMediaCatalog({ manifest, registry: new MediaSourceRegistry(), providerId: "missing" }).resolve("brand:tngd").reason, "provider-unavailable");
});
