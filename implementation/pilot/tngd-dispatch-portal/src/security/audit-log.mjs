import { createHash, randomUUID } from "node:crypto";

function digest(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function freezeMetadata(metadata) {
  return Object.freeze(structuredClone(metadata ?? {}));
}

export class AuditLog {
  #records = [];
  #now;

  constructor({ now = () => new Date() } = {}) {
    this.#now = now;
  }

  append({
    tenantId,
    principalId = null,
    type,
    resource,
    action,
    outcome,
    metadata = {}
  }) {
    if (!tenantId || !type || !resource || !action || !outcome) {
      throw new Error("Audit records require tenant, type, resource, action, and outcome.");
    }

    const previousHash = this.#records.at(-1)?.hash ?? null;
    const body = {
      id: randomUUID(),
      sequence: this.#records.length + 1,
      occurredAt: this.#now().toISOString(),
      tenantId,
      principalId,
      type,
      resource,
      action,
      outcome,
      metadata: freezeMetadata(metadata),
      previousHash
    };
    const record = Object.freeze({ ...body, hash: digest(body) });
    this.#records.push(record);
    return record;
  }

  list({ tenantId }) {
    return this.#records.filter((record) => record.tenantId === tenantId);
  }

  verify() {
    let previousHash = null;

    for (const record of this.#records) {
      const { hash, ...body } = record;
      if (body.previousHash !== previousHash || digest(body) !== hash) {
        return false;
      }
      previousHash = hash;
    }

    return true;
  }
}
