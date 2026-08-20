import { createHash } from "node:crypto";

const freeze = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) freeze(nested);
  return value;
};

export const MEDIA_CLASSIFICATIONS = freeze([
  "door", "opener", "part", "project", "before", "during", "after",
  "customer-job", "company-brand", "technician-team", "catalog-reference",
  "background", "archive"
]);
export const MEDIA_GRADES = freeze(["operational", "company", "portfolio"]);
export const APPROVAL_STATES = freeze(["unreviewed", "internal-approved", "public-approved", "restricted", "withdrawn"]);

const requiredText = (value, label) => {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
};

const normalizedKey = (value) => {
  const key = requiredText(value, "Media source key").replaceAll("\\", "/");
  if (key.startsWith("/") || /^[a-z]:/i.test(key) || key.includes("../")) {
    throw new Error("Media source keys must be provider-relative and traversal-free.");
  }
  return key;
};

export const sha256 = (content) => createHash("sha256").update(content).digest("hex").toUpperCase();

export function defineMediaAsset(input) {
  const classification = requiredText(input.classification, "Media classification");
  const grade = input.grade || "operational";
  const approvalState = input.approvalState || "unreviewed";
  if (!MEDIA_CLASSIFICATIONS.includes(classification)) throw new Error("Unsupported media classification.");
  if (!MEDIA_GRADES.includes(grade)) throw new Error("Unsupported media grade.");
  if (!APPROVAL_STATES.includes(approvalState)) throw new Error("Unsupported media approval state.");
  const publicEligible = approvalState === "public-approved" && input.publicEligible === true;
  if (input.publicEligible === true && !publicEligible) throw new Error("Public eligibility requires public approval.");
  return freeze({
    assetId: requiredText(input.assetId, "Media asset ID"),
    tenantId: requiredText(input.tenantId, "Media tenant"),
    sourceCollection: requiredText(input.sourceCollection, "Media source collection"),
    sourceKey: normalizedKey(input.sourceKey),
    checksum: input.checksum ? requiredText(input.checksum, "Media checksum").toUpperCase() : null,
    mimeType: requiredText(input.mimeType, "Media MIME type"),
    classification,
    grade,
    approvalState,
    internalEligible: approvalState !== "withdrawn" && input.internalEligible !== false,
    publicEligible,
    lineage: requiredText(input.lineage || "supplied-source", "Media lineage"),
    associations: freeze({
      jobId: input.associations?.jobId || null,
      customerId: input.associations?.customerId || null,
      projectId: input.associations?.projectId || null,
      productId: input.associations?.productId || null,
      relatedAssetId: input.associations?.relatedAssetId || null,
      relationship: input.associations?.relationship || null
    }),
    portfolioEligible: publicEligible && input.portfolioEligible === true,
    hero: publicEligible && input.hero === true,
    capturedAt: input.capturedAt || null
  });
}

export function defineMediaManifest({ version = 1, assets = [] } = {}) {
  const ids = new Set();
  const governed = assets.map((asset) => {
    const value = defineMediaAsset(asset);
    if (ids.has(value.assetId)) throw new Error(`Duplicate media asset ID: ${value.assetId}`);
    ids.add(value.assetId);
    return value;
  });
  return freeze({ schema: "mass.media-manifest.v1", version, assets: governed });
}

export class MediaSourceRegistry {
  #providers = new Map();
  register({ providerId, rootUrl, resolve }) {
    requiredText(providerId, "Media provider ID");
    if (!rootUrl && typeof resolve !== "function") throw new Error("A media provider requires a root URL or resolver.");
    this.#providers.set(providerId, freeze({ providerId, rootUrl: rootUrl?.replace(/\/$/, "") || null, resolve: resolve || null }));
    return this;
  }
  resolve({ providerId, asset, context = "internal" }) {
    const provider = this.#providers.get(providerId);
    if (!provider) return freeze({ status: "unavailable", reason: "provider-unavailable", assetId: asset?.assetId || null, url: null });
    if (!asset) return freeze({ status: "unavailable", reason: "asset-unavailable", assetId: null, url: null });
    if (asset.approvalState === "withdrawn" || asset.approvalState === "restricted") return freeze({ status: "denied", reason: "rights-restricted", assetId: asset.assetId, url: null });
    if (context === "public" && !asset.publicEligible) return freeze({ status: "denied", reason: "public-use-not-approved", assetId: asset.assetId, url: null });
    if (context === "internal" && !asset.internalEligible) return freeze({ status: "denied", reason: "internal-use-not-approved", assetId: asset.assetId, url: null });
    const url = provider.resolve ? provider.resolve(asset) : `${provider.rootUrl}/${asset.sourceKey.split("/").map(encodeURIComponent).join("/")}`;
    return freeze({ status: "available", reason: null, assetId: asset.assetId, url });
  }
}

export function createMediaCatalog({ manifest, registry, providerId }) {
  const byId = new Map(manifest.assets.map((asset) => [asset.assetId, asset]));
  return freeze({
    get(assetId) { return byId.get(assetId) || null; },
    find({ tenantId, classifications = [], context = "internal", limit = 24 } = {}) {
      return freeze(manifest.assets.filter((asset) => asset.tenantId === tenantId)
        .filter((asset) => classifications.length === 0 || classifications.includes(asset.classification))
        .map((asset) => freeze({ asset, resolution: registry.resolve({ providerId, asset, context }) }))
        .filter(({ resolution }) => resolution.status === "available").slice(0, limit));
    },
    resolve(assetId, context = "internal") { return registry.resolve({ providerId, asset: byId.get(assetId), context }); }
  });
}
