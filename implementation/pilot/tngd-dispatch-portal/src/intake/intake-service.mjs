import { randomUUID } from "node:crypto";

export const INTAKE_PATHS = Object.freeze({
  repair: "repair",
  estimate: "estimate",
  other_services: "other-services"
});

const REQUIRED_QUESTIONS = Object.freeze([
  "name",
  "phone",
  "email",
  "serviceAddress",
  "serviceCategory",
  "serviceNeed",
  "urgency",
  "preferredContact"
]);

function text(value) {
  return String(value ?? "").trim();
}

function normalizePath(value) {
  const candidate = text(value).toLowerCase().replaceAll("_", "-");
  if (!Object.values(INTAKE_PATHS).includes(candidate)) {
    throw new Error("Intake path must be repair, estimate, or other-services.");
  }
  return candidate;
}

function normalizeAnswers(input) {
  const answers = {
    name: text(input.name),
    phone: text(input.phone),
    email: text(input.email),
    serviceAddress: text(input.serviceAddress),
    serviceCategory: text(input.serviceCategory),
    serviceNeed: text(input.serviceNeed ?? input.summary),
    urgency: text(input.urgency),
    preferredContact: text(input.preferredContact)
  };

  const missing = REQUIRED_QUESTIONS.filter((field) => !answers[field]);
  if (missing.length) {
    throw new Error(`Intake requires all eight questions: ${missing.join(", ")}.`);
  }

  return Object.freeze(answers);
}

function customerKey(tenantId, answers) {
  const email = answers.email.toLowerCase();
  const phone = answers.phone.replace(/\D/g, "");
  return `${tenantId}:${email || phone}`;
}

export class IntakeService {
  #customers = new Map();
  #requests = new Map();
  #audit;
  #now;

  constructor({ auditLog, now = () => new Date() } = {}) {
    if (!auditLog || typeof auditLog.append !== "function") {
      throw new Error("Intake service requires the shared audit log.");
    }
    this.#audit = auditLog;
    this.#now = now;
  }

  submit({ tenantId, path, intake, source = "portal" }) {
    if (!tenantId) throw new Error("Tenant is required.");

    const normalizedPath = normalizePath(path ?? intake?.serviceCategory);
    const answers = normalizeAnswers(intake ?? {});
    const key = customerKey(tenantId, answers);
    const existing = this.#customers.get(key);
    const customer = existing ?? Object.freeze({
      id: randomUUID(),
      tenantId,
      name: answers.name,
      phone: answers.phone,
      email: answers.email,
      createdAt: this.#now().toISOString()
    });

    if (!existing) this.#customers.set(key, customer);

    const request = Object.freeze({
      id: randomUUID(),
      tenantId,
      customerId: customer.id,
      intakePath: normalizedPath,
      answers,
      source: text(source) || "portal",
      status: "received",
      createdAt: this.#now().toISOString()
    });
    this.#requests.set(request.id, request);

    this.#audit.append({
      tenantId,
      type: "ServiceRequestCreated",
      resource: `service-request:${request.id}`,
      outcome: "granted",
      metadata: {
        customerId: customer.id,
        intakePath: normalizedPath,
        source: request.source
      }
    });

    return Object.freeze({ customer, serviceRequest: request });
  }

  getCustomer({ tenantId, customerId }) {
    return [...this.#customers.values()].find(
      (record) => record.tenantId === tenantId && record.id === customerId
    ) ?? null;
  }

  getServiceRequest({ tenantId, requestId }) {
    const request = this.#requests.get(requestId);
    return request?.tenantId === tenantId ? request : null;
  }

  listServiceRequests({ tenantId }) {
    return Object.freeze(
      [...this.#requests.values()].filter((record) => record.tenantId === tenantId)
    );
  }
}
