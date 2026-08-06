const PUBLIC_INTAKE_FIELDS = Object.freeze([
  "name",
  "phone",
  "email",
  "serviceCategory",
  "summary"
]);

function sanitizePublicIntake(payload) {
  const record = {};

  for (const field of PUBLIC_INTAKE_FIELDS) {
    if (payload[field] !== undefined) {
      record[field] = String(payload[field]).trim();
    }
  }

  if (!record.name || !record.phone || !record.serviceCategory) {
    throw new Error("Public intake requires name, phone, and service category.");
  }

  return Object.freeze(record);
}

export class PortalBoundary {
  #secureAccess;
  #publicIntakeSink;

  constructor({ secureAccess, publicIntakeSink }) {
    if (!secureAccess || typeof publicIntakeSink !== "function") {
      throw new Error("Portal boundary requires secure access and a public intake sink.");
    }

    this.#secureAccess = secureAccess;
    this.#publicIntakeSink = publicIntakeSink;
  }

  async submitPublic({ tenantId, action, payload }) {
    if (action !== "intake.submit") {
      this.#secureAccess.recordPublicBoundary({
        tenantId,
        action,
        outcome: "denied",
        metadata: { reason: "public-action-not-allowed" }
      });
      throw new Error("Public portal action is not allowed.");
    }

    const intake = sanitizePublicIntake(payload);
    const result = await this.#publicIntakeSink({ tenantId, intake });

    this.#secureAccess.recordPublicBoundary({
      tenantId,
      action,
      outcome: "granted",
      metadata: { acceptedFields: Object.keys(intake) }
    });

    return result;
  }

  async runInternal({
    sessionToken,
    tenantId,
    permission,
    resourceId,
    handler
  }) {
    if (typeof handler !== "function") {
      throw new Error("Internal portal handler is required.");
    }

    const principal = this.#secureAccess.requirePermission({
      sessionToken,
      tenantId,
      permission,
      resourceId
    });

    return handler({ principal, tenantId, resourceId });
  }
}
