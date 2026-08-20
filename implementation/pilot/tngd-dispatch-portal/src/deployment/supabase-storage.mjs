import { defineMediaAsset } from "../media/media-manifest.mjs";

const encodedPath = (value) => value.split("/").map(encodeURIComponent).join("/");

export class SupabaseStorageAdapter {
  constructor({ client, principal, bucket = "dispatch-media" }) {
    if (!principal?.accessToken || !principal?.tenantId) throw new Error("Verified principal is required.");
    this.client = client;
    this.principal = principal;
    this.bucket = bucket;
  }

  objectKey(asset) {
    const governed = defineMediaAsset(asset);
    if (governed.tenantId !== this.principal.tenantId) throw Object.assign(new Error("media-tenant-mismatch"), { statusCode: 403 });
    return `${this.principal.tenantId}/${governed.sourceKey}`;
  }

  async upload({ asset, content, upsert = false }) {
    const governed = defineMediaAsset(asset);
    const key = this.objectKey(governed);
    const response = await this.client.fetch(`${this.client.url}/storage/v1/object/${encodeURIComponent(this.bucket)}/${encodedPath(key)}`, {
      method: "POST",
      headers: {
        apikey: this.client.publishableKey,
        authorization: `Bearer ${this.principal.accessToken}`,
        "content-type": governed.mimeType,
        "x-upsert": String(upsert)
      },
      body: content
    });
    if (!response.ok) throw Object.assign(new Error("storage-upload-denied"), { statusCode: response.status });
    return Object.freeze({ bucket: this.bucket, key });
  }

  async registerMetadata({ asset }) {
    const governed = defineMediaAsset(asset);
    const key = this.objectKey(governed);
    await this.client.request("/rest/v1/dispatch_media_objects", {
      method: "POST",
      accessToken: this.principal.accessToken,
      headers: { prefer: "return=minimal" },
      body: {
        tenant_id: this.principal.tenantId,
        asset_id: governed.assetId,
        object_key: key,
        checksum: governed.checksum,
        mime_type: governed.mimeType,
        classification: governed.classification,
        approval_state: governed.approvalState,
        internal_eligible: governed.internalEligible,
        public_eligible: governed.publicEligible,
        lineage: governed.lineage,
        metadata: { associations: governed.associations, grade: governed.grade, portfolioEligible: governed.portfolioEligible, capturedAt: governed.capturedAt },
        created_by: this.principal.id
      }
    });
    return Object.freeze({ bucket: this.bucket, key, assetId: governed.assetId });
  }

  async createSignedUrl({ asset, expiresIn = 300, context = "internal" }) {
    const governed = defineMediaAsset(asset);
    if (governed.approvalState === "withdrawn" || governed.approvalState === "restricted") throw Object.assign(new Error("rights-restricted"), { statusCode: 403 });
    if (context === "public" && !governed.publicEligible) throw Object.assign(new Error("public-use-not-approved"), { statusCode: 403 });
    const key = this.objectKey(governed);
    const result = await this.client.request(`/storage/v1/object/sign/${encodeURIComponent(this.bucket)}/${encodedPath(key)}`, {
      method: "POST",
      accessToken: this.principal.accessToken,
      body: { expiresIn }
    });
    const signed = result.signedURL || result.signedUrl;
    const signedUrl = signed?.startsWith("/") ? `${this.client.url}/storage/v1${signed}` : signed;
    return Object.freeze({ key, signedUrl });
  }
}
