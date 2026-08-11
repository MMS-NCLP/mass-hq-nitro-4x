import { randomUUID } from "node:crypto";
import { INTAKE_PATHS } from "./intake-service.mjs";

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
}

export const PRIMARY_QUESTIONS = deepFreeze([
  {
    id: "customerIdentity",
    prompt: "Who is requesting service?",
    required: ["name"]
  },
  {
    id: "contactInformation",
    prompt: "How should we contact the customer?",
    required: ["phone", "email", "preferredContact"]
  },
  {
    id: "serviceAddress",
    prompt: "Where is service needed?",
    required: ["address"]
  },
  {
    id: "serviceSubtype",
    prompt: "What type of service is this?",
    required: ["serviceSubtype"]
  },
  {
    id: "customerNeed",
    prompt: "What does the customer need?",
    required: ["description"]
  },
  {
    id: "safetyUrgency",
    prompt: "Are there safety concerns or timing needs?",
    required: ["urgency", "safetyConcern"],
    conditional: { when: "safetyConcern=true", required: ["safetyDetails"] }
  },
  {
    id: "equipmentProjectDetails",
    prompt: "What equipment or project details are relevant?",
    requiredByPath: {
      repair: ["equipmentDetails"],
      estimate: ["projectDetails"],
      "other-services": ["serviceDetails"]
    }
  },
  {
    id: "availabilityAuthorization",
    prompt: "When is the customer available, and may the request proceed?",
    required: ["availability", "authorizedToProceed"]
  }
]);

const MEDIA_KINDS = Object.freeze(["photo", "voice-note"]);
const SOURCES = Object.freeze(["internal-portal", "phone"]);

function text(value) {
  return String(value ?? "").trim();
}

function normalizePath(value) {
  const path = text(value).toLowerCase().replaceAll("_", "-");
  if (!Object.values(INTAKE_PATHS).includes(path)) {
    throw new Error("Guided intake path must be repair, estimate, or other-services.");
  }
  return path;
}

function isPresent(value) {
  return typeof value === "boolean" || (value !== null && value !== undefined && text(value));
}

function validateAnswer(question, path, value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Question ${question.id} requires a structured answer.`);
  }

  const required = [
    ...(question.required ?? []),
    ...(question.requiredByPath?.[path] ?? [])
  ];
  if (question.id === "safetyUrgency" && value.safetyConcern === true) {
    required.push("safetyDetails");
  }

  const missing = required.filter((field) => !isPresent(value[field]));
  if (missing.length) {
    throw new Error(`Question ${question.id} requires: ${missing.join(", ")}.`);
  }

  return deepFreeze(structuredClone(value));
}

function snapshotQuestion(index, path) {
  const question = PRIMARY_QUESTIONS[index];
  if (!question) return null;
  return deepFreeze({
    number: index + 1,
    total: PRIMARY_QUESTIONS.length,
    path,
    ...structuredClone(question)
  });
}

export class GuidedIntakeService {
  #sessions = new Map();
  #records = new Map();
  #secureAccess;
  #audit;
  #now;

  constructor({ secureAccess, auditLog, now = () => new Date() } = {}) {
    if (!secureAccess || typeof secureAccess.requirePermission !== "function") {
      throw new Error("Guided intake requires secure access.");
    }
    if (!auditLog || typeof auditLog.append !== "function") {
      throw new Error("Guided intake requires the shared audit log.");
    }
    this.#secureAccess = secureAccess;
    this.#audit = auditLog;
    this.#now = now;
  }

  startAuthorized({ sessionToken, tenantId, path, source = "internal-portal" }) {
    const principal = this.#authorize({
      sessionToken,
      tenantId,
      permission: "intake.create",
      resourceId: "guided-intake:new"
    });
    const intakePath = normalizePath(path);
    if (!SOURCES.includes(source)) throw new Error("Guided intake source is not allowed.");

    const now = this.#now().toISOString();
    const session = {
      id: randomUUID(),
      tenantId,
      createdBy: principal.id,
      intakePath,
      source,
      status: "draft",
      currentQuestionIndex: 0,
      answers: {},
      attachments: [],
      originalEvidence: [],
      auditEventIds: [],
      createdAt: now,
      updatedAt: now,
      completedAt: null
    };
    this.#sessions.set(session.id, session);
    this.#auditSession(session, {
      principalId: principal.id,
      type: "GuidedIntakeStarted",
      action: "intake.create",
      metadata: { intakePath, source }
    });
    return this.#snapshot(session);
  }

  answerAuthorized({ sessionToken, tenantId, guidedSessionId, questionId, value }) {
    const session = this.#requireSession({ tenantId, guidedSessionId });
    const principal = this.#authorize({
      sessionToken,
      tenantId,
      permission: "intake.create",
      resourceId: `guided-intake:${session.id}`
    });
    this.#requireDraft(session);

    const question = PRIMARY_QUESTIONS[session.currentQuestionIndex];
    if (question?.id !== questionId) {
      throw new Error(`The current primary question is ${question?.id ?? "complete"}.`);
    }
    const answer = validateAnswer(question, session.intakePath, value);
    const recordedAt = this.#now().toISOString();
    session.answers[questionId] = answer;
    session.originalEvidence.push(deepFreeze({
      id: randomUUID(),
      kind: "answer",
      questionId,
      value: structuredClone(answer),
      recordedAt,
      recordedBy: principal.id
    }));
    session.currentQuestionIndex += 1;
    session.updatedAt = recordedAt;
    this.#auditSession(session, {
      principalId: principal.id,
      type: "GuidedIntakeAnswerSaved",
      action: "intake.create",
      metadata: { questionId, questionNumber: session.currentQuestionIndex }
    });
    return this.#snapshot(session);
  }

  resumeAuthorized({ sessionToken, tenantId, guidedSessionId }) {
    const session = this.#requireSession({ tenantId, guidedSessionId });
    const principal = this.#authorize({
      sessionToken,
      tenantId,
      permission: "intake.read",
      resourceId: `guided-intake:${session.id}`
    });
    this.#auditSession(session, {
      principalId: principal.id,
      type: "GuidedIntakeResumed",
      action: "intake.read",
      metadata: { nextQuestionNumber: session.currentQuestionIndex + 1 }
    });
    return this.#snapshot(session);
  }

  attachMediaAuthorized({
    sessionToken,
    tenantId,
    guidedSessionId,
    kind,
    mediaReference,
    metadata = {}
  }) {
    const session = this.#requireSession({ tenantId, guidedSessionId });
    const principal = this.#authorize({
      sessionToken,
      tenantId,
      permission: "intake.create",
      resourceId: `guided-intake:${session.id}:media`
    });
    this.#requireDraft(session);
    if (!MEDIA_KINDS.includes(kind)) throw new Error("Media must be a photo or voice-note.");
    if (!text(mediaReference)) throw new Error("A governed media reference is required.");

    const attachedAt = this.#now().toISOString();
    const attachment = deepFreeze({
      id: randomUUID(),
      kind,
      mediaReference: text(mediaReference),
      metadata: structuredClone(metadata),
      attachedAt,
      attachedBy: principal.id
    });
    session.attachments.push(attachment);
    session.originalEvidence.push(deepFreeze({
      id: randomUUID(),
      kind: "media-reference",
      attachment: structuredClone(attachment),
      recordedAt: attachedAt,
      recordedBy: principal.id
    }));
    session.updatedAt = attachedAt;
    this.#auditSession(session, {
      principalId: principal.id,
      type: "GuidedIntakeMediaAttached",
      action: "intake.create",
      metadata: { attachmentId: attachment.id, kind }
    });
    return attachment;
  }

  completeAuthorized({ sessionToken, tenantId, guidedSessionId }) {
    const session = this.#requireSession({ tenantId, guidedSessionId });
    const principal = this.#authorize({
      sessionToken,
      tenantId,
      permission: "intake.create",
      resourceId: `guided-intake:${session.id}:complete`
    });
    this.#requireDraft(session);
    if (session.currentQuestionIndex !== PRIMARY_QUESTIONS.length) {
      throw new Error("All eight primary questions must be completed.");
    }

    const completedAt = this.#now().toISOString();
    const intakeRecordId = randomUUID();
    session.status = "completed";
    session.updatedAt = completedAt;
    session.completedAt = completedAt;
    this.#auditSession(session, {
      principalId: principal.id,
      type: "GuidedIntakeCompleted",
      action: "intake.create",
      metadata: { intakeRecordId, targetPackage: "TNGD-BP-004" }
    });

    const intakeRecord = deepFreeze({
      id: intakeRecordId,
      tenantId,
      createdBy: session.createdBy,
      completedBy: principal.id,
      intakePath: session.intakePath,
      source: session.source,
      status: "ready-for-bp004",
      primaryQuestionCount: PRIMARY_QUESTIONS.length,
      answers: structuredClone(session.answers),
      attachments: structuredClone(session.attachments),
      originalEvidence: structuredClone(session.originalEvidence),
      auditEventIds: [...session.auditEventIds],
      startedAt: session.createdAt,
      completedAt
    });
    this.#records.set(intakeRecord.id, intakeRecord);

    return deepFreeze({
      intakeRecord,
      handoff: {
        targetPackage: "TNGD-BP-004",
        contract: "Customer Record and Service Case Creation",
        status: "ready",
        intakeRecordId: intakeRecord.id
      }
    });
  }

  getRecordAuthorized({ sessionToken, tenantId, intakeRecordId }) {
    this.#authorize({
      sessionToken,
      tenantId,
      permission: "intake.read",
      resourceId: `intake-record:${intakeRecordId}`
    });
    const record = this.#records.get(intakeRecordId);
    return record?.tenantId === tenantId ? record : null;
  }

  #authorize({ sessionToken, tenantId, permission, resourceId }) {
    return this.#secureAccess.requirePermission({
      sessionToken,
      tenantId,
      permission,
      resourceId
    });
  }

  #requireSession({ tenantId, guidedSessionId }) {
    const session = this.#sessions.get(guidedSessionId);
    if (!session || session.tenantId !== tenantId) {
      throw new Error("Guided intake session was not found for this tenant.");
    }
    return session;
  }

  #requireDraft(session) {
    if (session.status !== "draft") throw new Error("Guided intake is not editable.");
  }

  #auditSession(session, { principalId, type, action, metadata }) {
    const event = this.#audit.append({
      tenantId: session.tenantId,
      principalId,
      type,
      resource: `guided-intake:${session.id}`,
      action,
      outcome: "granted",
      metadata
    });
    session.auditEventIds.push(event.id);
    return event;
  }

  #snapshot(session) {
    return deepFreeze({
      id: session.id,
      tenantId: session.tenantId,
      createdBy: session.createdBy,
      intakePath: session.intakePath,
      source: session.source,
      status: session.status,
      currentQuestionIndex: session.currentQuestionIndex,
      answers: structuredClone(session.answers),
      attachments: structuredClone(session.attachments),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      completedAt: session.completedAt,
      nextQuestion: snapshotQuestion(session.currentQuestionIndex, session.intakePath)
    });
  }
}
