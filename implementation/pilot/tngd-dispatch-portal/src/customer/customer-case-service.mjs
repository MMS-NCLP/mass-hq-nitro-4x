import { randomUUID } from "node:crypto";

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
}

function text(value) {
  return String(value ?? "").trim();
}

function digits(value) {
  return text(value).replace(/\D/g, "");
}

function answer(record, questionId) {
  const value = record?.answers?.[questionId];
  if (!value || typeof value !== "object") {
    throw new Error(`Intake evidence is missing ${questionId}.`);
  }
  return value;
}

function parseName(fullName) {
  const trimmed = text(fullName);
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  return { firstName: trimmed, lastName: "" };
}

function identityKeys(tenantId, contact) {
  const keys = [];
  const email = text(contact.email).toLowerCase();
  const phone = digits(contact.phone);
  if (email) keys.push(`${tenantId}:email:${email}`);
  if (phone) keys.push(`${tenantId}:phone:${phone}`);
  if (!keys.length) throw new Error("Customer matching requires an email or phone number.");
  return keys;
}

export class CustomerCaseService {
  #customers = new Map();
  #customerIdentityIndex = new Map();
  #cases = new Map();
  #timelines = new Map();
  #conversions = new Map();
  #secureAccess;
  #guidedIntake;
  #audit;
  #now;

  constructor({ secureAccess, guidedIntake, auditLog, now = () => new Date() } = {}) {
    if (!secureAccess || typeof secureAccess.requirePermission !== "function") {
      throw new Error("Customer conversion requires secure access.");
    }
    if (!guidedIntake || typeof guidedIntake.getRecordAuthorized !== "function") {
      throw new Error("Customer conversion requires the governed guided-intake source.");
    }
    if (!auditLog || typeof auditLog.append !== "function") {
      throw new Error("Customer conversion requires the shared audit log.");
    }
    this.#secureAccess = secureAccess;
    this.#guidedIntake = guidedIntake;
    this.#audit = auditLog;
    this.#now = now;
  }

  convertAuthorized({ sessionToken, tenantId, intakeRecordId }) {
    const principal = this.#authorize({
      sessionToken,
      tenantId,
      permission: "customers.write",
      resourceId: `intake-record:${intakeRecordId}:convert`
    });
    const conversionKey = `${tenantId}:${intakeRecordId}`;
    const existingConversion = this.#conversions.get(conversionKey);
    if (existingConversion) return existingConversion;

    const intakeRecord = this.#guidedIntake.getRecordAuthorized({
      sessionToken,
      tenantId,
      intakeRecordId
    });
    if (!intakeRecord || intakeRecord.status !== "ready-for-bp004") {
      throw new Error("A completed BP-004-ready intake record is required.");
    }

    const identity = answer(intakeRecord, "customerIdentity");
    const contact = answer(intakeRecord, "contactInformation");
    const address = answer(intakeRecord, "serviceAddress");
    const subtype = answer(intakeRecord, "serviceSubtype");
    const need = answer(intakeRecord, "customerNeed");
    const urgency = answer(intakeRecord, "safetyUrgency");
    const equipment = answer(intakeRecord, "equipmentProjectDetails");
    const authorization = answer(intakeRecord, "availabilityAuthorization");
    const keys = identityKeys(tenantId, contact);

    const matchedIds = new Set(keys.map((key) => this.#customerIdentityIndex.get(key)).filter(Boolean));
    if (matchedIds.size > 1) {
      throw new Error("Customer identity conflict requires governed stewardship.");
    }

    const now = this.#now().toISOString();
    const existingCustomerId = [...matchedIds][0] ?? null;
    const { firstName, lastName } = parseName(identity.name);
    const customer = existingCustomerId
      ? this.#customers.get(existingCustomerId)
      : deepFreeze({
          id: randomUUID(),
          tenantId,
          firstName,
          lastName,
          displayName: text(identity.name),
          name: text(identity.name),
          email: text(contact.email).toLowerCase(),
          mobileNumber: digits(contact.phone) || null,
          homeNumber: null,
          workNumber: null,
          phone: text(contact.phone),
          additionalEmails: [],
          preferredContact: text(contact.preferredContact),
          company: null,
          role: null,
          customerType: "homeowner",
          isContractor: false,
          addresses: [{
            streetLine1: text(address.address),
            streetLine2: null,
            city: null,
            state: null,
            postalCode: null,
            isBilling: false,
            notes: null
          }],
          billsTo: null,
          acceptsBillsFrom: null,
          leadSource: intakeRecord.source || null,
          tags: [],
          notes: null,
          doNotService: false,
          notificationsEnabled: true,
          customerCreatedAt: now,
          lastServiceDate: null,
          lifetimeValue: 0,
          createdFromIntakeRecordId: intakeRecord.id,
          createdAt: now
        });
    if (!customer || customer.tenantId !== tenantId) {
      throw new Error("Customer match crossed the tenant boundary.");
    }
    if (!existingCustomerId) this.#customers.set(customer.id, customer);
    for (const key of keys) this.#customerIdentityIndex.set(key, customer.id);

    const serviceCase = deepFreeze({
      id: randomUUID(),
      tenantId,
      customerId: customer.id,
      intakeRecordId: intakeRecord.id,
      intakePath: intakeRecord.intakePath,
      status: "ready-for-scheduling",
      serviceAddress: text(address.address),
      serviceSubtype: text(subtype.serviceSubtype),
      customerNeed: text(need.description),
      urgency: structuredClone(urgency),
      equipmentProjectDetails: structuredClone(equipment),
      requestedAvailability: structuredClone(authorization.availability),
      authorizedToProceed: authorization.authorizedToProceed,
      source: intakeRecord.source,
      createdBy: principal.id,
      createdAt: now
    });
    const timeline = deepFreeze({
      id: randomUUID(),
      tenantId,
      customerId: customer.id,
      serviceCaseId: serviceCase.id,
      entries: [{
        id: randomUUID(),
        type: "ServiceCaseCreatedFromGuidedIntake",
        occurredAt: now,
        actorId: principal.id,
        sourceReference: `intake-record:${intakeRecord.id}`,
        evidenceReferences: intakeRecord.originalEvidence.map(({ id }) => `intake-evidence:${id}`)
      }]
    });
    this.#cases.set(serviceCase.id, serviceCase);
    this.#timelines.set(serviceCase.id, timeline);

    const event = this.#audit.append({
      tenantId,
      principalId: principal.id,
      type: "IntakeConvertedToCustomerAndServiceCase",
      resource: `service-case:${serviceCase.id}`,
      action: "customers.write",
      outcome: "granted",
      metadata: {
        intakeRecordId: intakeRecord.id,
        customerId: customer.id,
        customerMatched: Boolean(existingCustomerId),
        targetPackage: "TNGD-BP-005"
      }
    });

    const result = deepFreeze({
      customer,
      customerMatched: Boolean(existingCustomerId),
      serviceCase,
      timeline,
      intakeEvidence: {
        intakeRecordId: intakeRecord.id,
        originalEvidence: intakeRecord.originalEvidence,
        attachments: intakeRecord.attachments,
        auditEventIds: intakeRecord.auditEventIds
      },
      auditEventId: event.id,
      handoff: {
        targetPackage: "TNGD-BP-005",
        contract: "Scheduling and Calendar Integration",
        status: "ready",
        customerId: customer.id,
        serviceCaseId: serviceCase.id
      }
    });
    this.#conversions.set(conversionKey, result);
    return result;
  }

  getCustomerAuthorized({ sessionToken, tenantId, customerId }) {
    this.#authorize({ sessionToken, tenantId, permission: "customers.read", resourceId: `customer:${customerId}` });
    const customer = this.#customers.get(customerId);
    return customer?.tenantId === tenantId ? customer : null;
  }

  getServiceCaseAuthorized({ sessionToken, tenantId, serviceCaseId }) {
    this.#authorize({ sessionToken, tenantId, permission: "customers.read", resourceId: `service-case:${serviceCaseId}` });
    const serviceCase = this.#cases.get(serviceCaseId);
    return serviceCase?.tenantId === tenantId ? serviceCase : null;
  }

  getTimelineAuthorized({ sessionToken, tenantId, serviceCaseId }) {
    this.#authorize({ sessionToken, tenantId, permission: "customers.read", resourceId: `customer-timeline:${serviceCaseId}` });
    const timeline = this.#timelines.get(serviceCaseId);
    return timeline?.tenantId === tenantId ? timeline : null;
  }

  updateCustomerAuthorized({ sessionToken, tenantId, customerId, updates }) {
    const principal = this.#authorize({
      sessionToken, tenantId,
      permission: "customers.write",
      resourceId: `customer:${customerId}:update`
    });
    const existing = this.#customers.get(customerId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error("Customer not found in this tenant.");
    }
    const immutableFields = ["id", "tenantId", "createdFromIntakeRecordId", "createdAt"];
    for (const field of immutableFields) {
      if (field in updates && updates[field] !== existing[field]) {
        throw new Error(`Cannot modify immutable field: ${field}`);
      }
    }
    const updated = deepFreeze({ ...existing, ...updates });
    this.#customers.set(customerId, updated);
    if (updates.email || updates.phone || updates.mobileNumber) {
      const contact = {
        email: updated.email || "",
        phone: updated.mobileNumber || updated.phone || ""
      };
      const keys = identityKeys(tenantId, contact);
      for (const key of keys) this.#customerIdentityIndex.set(key, customerId);
    }
    this.#audit.append({
      tenantId,
      principalId: principal.id,
      type: "CustomerRecordUpdated",
      resource: `customer:${customerId}`,
      action: "customers.write",
      outcome: "granted",
      metadata: { updatedFields: Object.keys(updates) }
    });
    return updated;
  }

  #authorize({ sessionToken, tenantId, permission, resourceId }) {
    return this.#secureAccess.requirePermission({ sessionToken, tenantId, permission, resourceId });
  }
}

