import { randomBytes, randomUUID } from "node:crypto";

const deepFreeze = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
};
const day = (value) => new Date(value).toISOString().slice(0, 10);
const ITEM_RESULTS = Object.freeze(["Does Not Apply", "Pass", "Flag", "Fail"]);
const COMPONENTS = Object.freeze([
  "Springs", "Cables", "Rollers", "Hinges and Hardware", "Pulleys or Drums",
  "End Bearings", "Center Bearing or Plate", "Top and Bottom Brackets", "Jamb Brackets",
  "Vertical Tracks", "Horizontal Tracks", "Panels and Vinyl Trim", "Bottom Rubber or Retainer",
  "Operator", "Rail, Trolley, Chain, or Belt", "Safety Sensors",
  "Wiring, Force, and Travel Limits", "Keypad, Remotes, and Wall Button", "Leveled Ground"
]);
const TRANSITIONS = Object.freeze({
  "ready-for-field-execution": Object.freeze(["en-route"]),
  "en-route": Object.freeze(["arrived"]),
  arrived: Object.freeze(["in-progress"]),
  "in-progress": Object.freeze(["paused", "field-complete"]),
  paused: Object.freeze(["in-progress"]),
  "field-complete": Object.freeze([]),
  submitted: Object.freeze([])
});
const ACTIVE_STATES = new Set(["en-route", "arrived", "in-progress", "paused", "field-complete"]);

export const inspectionTemplate = deepFreeze({
  id: "tngd-25-point-v1",
  name: "25-Point Inspection",
  version: 1,
  itemResults: ITEM_RESULTS,
  components: COMPONENTS.map((name, index) => ({ id: `component-${String(index + 1).padStart(2, "0")}`, position: index + 1, name })),
  operationalEvidence: Object.freeze([
    "notes", "quantity", "spring-identification", "door-size", "spring-type", "ground-level-condition",
    "before-and-after-media", "sticker-and-warranty-disclosure", "referral-card-confirmation"
  ]),
  requiredFor: Object.freeze(["repair"]), optionalFor: Object.freeze(["estimate"])
});

export class FieldWorkflowService {
  #sessions = new Map(); #byWorkItem = new Map(); #inspections = new Map(); #inspectionBySession = new Map();
  #reports = new Map(); #shares = new Map(); #exceptions = new Map(); #history = new Map(); #templateEnabled = new Map();
  #secure; #dispatch; #audit; #now;
  #recordEvent = (session, actorId, type, metadata = {}) => {
    const event = deepFreeze({ id: randomUUID(), type, actorId, occurredAt: this.#now().toISOString(), fieldStatus: session.status, metadata: structuredClone(metadata) });
    this.#history.set(session.id, [...(this.#history.get(session.id) ?? []), event]);
    this.#audit.append({ tenantId: session.tenantId, principalId: actorId, type, resource: `field-session:${session.id}`, action: "jobs.assigned.update", outcome: "granted", metadata: event.metadata });
    return event;
  };
  #assigned = (sessionToken, tenantId, workItemId) => this.#dispatch.handoffAuthorized({ sessionToken, tenantId, workItemId });
  #session = (tenantId, id) => {
    const session = this.#sessions.get(id);
    if (!session || session.tenantId !== tenantId) throw new Error("Field session not found for tenant.");
    return session;
  };
  #mutableInspection = (tenantId, id) => {
    const inspection = this.#inspections.get(id);
    if (!inspection || inspection.tenantId !== tenantId) throw new Error("Inspection not found for tenant.");
    if (inspection.status === "submitted") throw new Error("Submitted inspection evidence is immutable.");
    return inspection;
  };
  #replaceSession = (session, changes, actorId, type, metadata = {}) => {
    const next = deepFreeze({ ...session, ...changes, revision: session.revision + 1, updatedAt: this.#now().toISOString() });
    this.#sessions.set(session.id, next); this.#recordEvent(next, actorId, type, metadata); return next;
  };
  #replaceInspection = (inspection, changes, session, actorId, type, metadata = {}) => {
    const next = deepFreeze({ ...inspection, ...changes, revision: inspection.revision + 1, updatedAt: this.#now().toISOString() });
    this.#inspections.set(inspection.id, next); this.#recordEvent(session, actorId, type, metadata); return next;
  };
  #validateInspection = (inspection) => {
    if (Object.keys(inspection.itemResults).length !== inspectionTemplate.components.length || inspectionTemplate.components.some((item) => !ITEM_RESULTS.includes(inspection.itemResults[item.id]?.result))) throw new Error("Every inspection component requires exactly one governed result.");
    if (!inspection.doorDetails) throw new Error("Complete door details are required.");
    if (!inspection.mediaReferences.some((item) => item.category === "before") || !inspection.mediaReferences.some((item) => item.category === "after")) throw new Error("Required before and after photograph references are incomplete.");
    if (!inspection.confirmations?.stickerWarrantyDisclosure || !inspection.confirmations?.referralCard) throw new Error("Required operational confirmations are incomplete.");
  };

  constructor({ secureAccess, dispatchService, auditLog, now = () => new Date() } = {}) {
    if (!secureAccess || !dispatchService || !auditLog) throw new Error("Field workflow requires security, dispatch handoff, and audit contracts.");
    this.#secure = secureAccess; this.#dispatch = dispatchService; this.#audit = auditLog; this.#now = now;
  }

  listJobsAuthorized({ sessionToken, tenantId, view }) {
    if (!["today", "current", "next"].includes(view)) throw new Error("Unsupported technician job view.");
    const handoffs = this.#dispatch.listHandoffsAuthorized({ sessionToken, tenantId });
    const now = this.#now().toISOString();
    let jobs = handoffs.map((handoff) => {
      const session = this.#sessions.get(this.#byWorkItem.get(`${tenantId}:${handoff.workItemId}`));
      return deepFreeze({ ...handoff, fieldSessionId: session?.id ?? null, fieldStatus: session?.status ?? "ready-for-field-execution" });
    }).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    if (view === "today") jobs = jobs.filter((job) => day(job.startsAt) === day(now));
    if (view === "current") jobs = jobs.filter((job) => ACTIVE_STATES.has(job.fieldStatus));
    if (view === "next") jobs = jobs.filter((job) => job.startsAt > now && job.fieldStatus === "ready-for-field-execution").slice(0, 1);
    return deepFreeze(jobs);
  }

  openAuthorized({ sessionToken, tenantId, workItemId }) {
    const handoff = this.#dispatch.handoffAuthorized({ sessionToken, tenantId, workItemId });
    const key = `${tenantId}:${workItemId}`; const existing = this.#byWorkItem.get(key);
    if (existing) return this.#sessions.get(existing);
    const session = deepFreeze({ id: randomUUID(), tenantId, workItemId, appointmentId: handoff.appointmentId,
      serviceCaseId: handoff.serviceCaseId, customerId: handoff.customerId, technicianId: handoff.technicianId,
      serviceType: handoff.requirements?.serviceType, startsAt: handoff.startsAt, endsAt: handoff.endsAt,
      status: "ready-for-field-execution", revision: 1, createdAt: this.#now().toISOString() });
    this.#sessions.set(session.id, session); this.#byWorkItem.set(key, session.id);
    this.#recordEvent(session, session.technicianId, "FieldWorkSessionOpened"); return session;
  }

  transitionAuthorized({ sessionToken, tenantId, fieldSessionId, status }) {
    const session = this.#session(tenantId, fieldSessionId); const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (session.status === status) return session;
    if (!(TRANSITIONS[session.status] ?? []).includes(status)) throw new Error(`Invalid field transition from ${session.status} to ${status}.`);
    return this.#replaceSession(session, { status }, handoff.technicianId, "FieldStatusChanged", { previousStatus: session.status, status });
  }

  startInspectionAuthorized({ sessionToken, tenantId, fieldSessionId }) {
    const session = this.#session(tenantId, fieldSessionId); const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (session.status === "submitted") throw new Error("Submitted field evidence is immutable.");
    if (this.#templateEnabled.get(tenantId) === false) throw new Error("The tenant inspection template is unavailable.");
    const existing = this.#inspectionBySession.get(session.id); if (existing) return this.#inspections.get(existing);
    const inspection = deepFreeze({ id: randomUUID(), tenantId, fieldSessionId: session.id, templateId: inspectionTemplate.id,
      technicianId: handoff.technicianId, status: "in-progress", itemResults: {}, notes: [], measurements: [], mediaReferences: [],
      doorDetails: null, confirmations: null, revision: 1, createdAt: this.#now().toISOString() });
    this.#inspections.set(inspection.id, inspection); this.#inspectionBySession.set(session.id, inspection.id);
    this.#recordEvent(session, handoff.technicianId, "InspectionStarted", { inspectionId: inspection.id }); return inspection;
  }

  recordItemAuthorized({ sessionToken, tenantId, inspectionId, itemId, result, note = "" }) {
    const inspection = this.#mutableInspection(tenantId, inspectionId); const session = this.#session(tenantId, inspection.fieldSessionId);
    const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (!inspectionTemplate.components.some((item) => item.id === itemId)) throw new Error("Unknown inspection component.");
    if (!ITEM_RESULTS.includes(result)) throw new Error("Inspection result must be Does Not Apply, Pass, Flag, or Fail.");
    const itemResults = { ...inspection.itemResults, [itemId]: deepFreeze({ itemId, result, note: String(note), recordedBy: handoff.technicianId, recordedAt: this.#now().toISOString() }) };
    return this.#replaceInspection(inspection, { itemResults }, session, handoff.technicianId, "InspectionItemRecorded", { itemId, result });
  }

  addNoteAuthorized({ sessionToken, tenantId, inspectionId, text, visibility = "internal" }) {
    const inspection = this.#mutableInspection(tenantId, inspectionId); const session = this.#session(tenantId, inspection.fieldSessionId);
    const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (!["internal", "customer"].includes(visibility) || !String(text || "").trim()) throw new Error("A governed note and visibility are required.");
    const note = deepFreeze({ id: randomUUID(), text: String(text), visibility, authorId: handoff.technicianId, createdAt: this.#now().toISOString() });
    return this.#replaceInspection(inspection, { notes: [...inspection.notes, note] }, session, handoff.technicianId, "FieldNoteAdded", { noteId: note.id, visibility });
  }

  addMeasurementAuthorized({ sessionToken, tenantId, inspectionId, name, value, unit }) {
    const inspection = this.#mutableInspection(tenantId, inspectionId); const session = this.#session(tenantId, inspection.fieldSessionId);
    const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (!String(name || "").trim() || !String(value ?? "").trim()) throw new Error("Measurement name and value are required.");
    const measurement = deepFreeze({ id: randomUUID(), name: String(name), value: String(value), unit: String(unit || ""), recordedBy: handoff.technicianId });
    return this.#replaceInspection(inspection, { measurements: [...inspection.measurements, measurement] }, session, handoff.technicianId, "MeasurementRecorded", { measurementId: measurement.id });
  }

  recordDoorDetailsAuthorized({ sessionToken, tenantId, inspectionId, quantity, springIdentification, doorSize, springType, groundLevelCondition }) {
    const inspection = this.#mutableInspection(tenantId, inspectionId); const session = this.#session(tenantId, inspection.fieldSessionId);
    const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (!Number.isInteger(quantity) || quantity < 1 || !String(springIdentification || "").trim() || !String(doorSize || "").trim() ||
      !["Torsion", "Extension", "Rear Torsion"].includes(springType) || !["Leveled", "Slightly unlevel", "Severely unlevel"].includes(groundLevelCondition)) {
      throw new Error("Complete governed door details are required.");
    }
    const doorDetails = deepFreeze({ quantity, springIdentification, doorSize, springType, groundLevelCondition, recordedBy: handoff.technicianId });
    return this.#replaceInspection(inspection, { doorDetails }, session, handoff.technicianId, "DoorDetailsRecorded");
  }

  attachMediaReferenceAuthorized({ sessionToken, tenantId, inspectionId, category, assetId, mimeType }) {
    const inspection = this.#mutableInspection(tenantId, inspectionId); const session = this.#session(tenantId, inspection.fieldSessionId);
    const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (!["before", "diagnostic", "after"].includes(category) || !String(assetId || "").trim() || !String(mimeType || "").startsWith("image/")) throw new Error("A governed photograph reference is required.");
    const existing = inspection.mediaReferences.find((item) => item.assetId === assetId && item.category === category); if (existing) return inspection;
    const reference = deepFreeze({ id: randomUUID(), category, assetId, mimeType, capturedBy: handoff.technicianId, capturedAt: this.#now().toISOString() });
    return this.#replaceInspection(inspection, { mediaReferences: [...inspection.mediaReferences, reference] }, session, handoff.technicianId, "MediaReferenceAttached", { referenceId: reference.id, category });
  }

  confirmOperationalEvidenceAuthorized({ sessionToken, tenantId, inspectionId, stickerWarrantyDisclosure, referralCard }) {
    const inspection = this.#mutableInspection(tenantId, inspectionId); const session = this.#session(tenantId, inspection.fieldSessionId);
    const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (stickerWarrantyDisclosure !== true || referralCard !== true) throw new Error("Warranty disclosure and referral-card confirmations are required.");
    return this.#replaceInspection(inspection, { confirmations: deepFreeze({ stickerWarrantyDisclosure, referralCard, confirmedBy: handoff.technicianId }) }, session, handoff.technicianId, "OperationalEvidenceConfirmed");
  }

  submitAuthorized({ sessionToken, tenantId, fieldSessionId }) {
    const session = this.#session(tenantId, fieldSessionId); const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (session.status === "submitted") return this.#reports.get(session.reportId);
    if (session.status !== "field-complete") throw new Error("Field work must be complete before submission.");
    const inspectionId = this.#inspectionBySession.get(session.id); const inspection = inspectionId ? this.#inspections.get(inspectionId) : null;
    if (session.serviceType === "repair" && !inspection) throw new Error("Repair requires the 25-Point Inspection.");
    if (inspection) this.#validateInspection(inspection);
    const submittedAt = this.#now().toISOString();
    const submittedInspection = inspection ? deepFreeze({ ...inspection, status: "submitted", submittedAt, revision: inspection.revision + 1 }) : null;
    if (submittedInspection) this.#inspections.set(submittedInspection.id, submittedInspection);
    const customerNotes = submittedInspection?.notes.filter((note) => note.visibility === "customer") ?? [];
    const itemResults = inspectionTemplate.components.map((component) => deepFreeze({ ...component, result: submittedInspection?.itemResults[component.id]?.result ?? null,
      note: submittedInspection?.itemResults[component.id]?.note ?? "" }));
    const report = deepFreeze({ id: randomUUID(), tenantId, fieldSessionId: session.id, diagnosticName: inspectionTemplate.name,
      inspectionPerformed: Boolean(submittedInspection), itemResults, customerNotes, measurements: submittedInspection?.measurements ?? [],
      doorDetails: submittedInspection?.doorDetails ?? null, mediaReferences: submittedInspection?.mediaReferences ?? [],
      findings: itemResults.filter((item) => ["Flag", "Fail"].includes(item.result)), createdAt: submittedAt, immutable: true });
    this.#reports.set(report.id, report);
    this.#replaceSession(session, { status: "submitted", reportId: report.id, submittedAt,
      handoff: deepFreeze({ targetPackage: "TNGD-BP-009", serviceCaseId: session.serviceCaseId, fieldSessionId: session.id,
        diagnosticReportId: report.id, findingItemIds: report.findings.map((item) => item.id), action: "repair-or-estimate-pending" }) }, handoff.technicianId, "FieldEvidenceSubmitted", { reportId: report.id });
    return report;
  }

  diagnosticReportAuthorized({ sessionToken, tenantId, fieldSessionId }) {
    const session = this.#session(tenantId, fieldSessionId); this.#assigned(sessionToken, tenantId, session.workItemId);
    const report = this.#reports.get(session.reportId); if (!report) throw new Error("Diagnostic report is not available."); return report;
  }

  shareDiagnosticReportAuthorized({ sessionToken, tenantId, fieldSessionId }) {
    const session = this.#session(tenantId, fieldSessionId); const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    const report = this.diagnosticReportAuthorized({ sessionToken, tenantId, fieldSessionId });
    const token = randomBytes(24).toString("hex"); const share = deepFreeze({ token, tenantId, reportId: report.id, sharedBy: handoff.technicianId, sharedAt: this.#now().toISOString() });
    this.#shares.set(token, share); this.#recordEvent(session, handoff.technicianId, "DiagnosticReportShared", { reportId: report.id }); return deepFreeze({ shareToken: token, reportId: report.id });
  }

  sharedDiagnosticReport({ shareToken }) {
    const share = this.#shares.get(shareToken); if (!share) throw new Error("Shared diagnostic report not found."); return this.#reports.get(share.reportId);
  }

  downloadDiagnosticReportAuthorized({ sessionToken, tenantId, fieldSessionId }) {
    const report = this.diagnosticReportAuthorized({ sessionToken, tenantId, fieldSessionId });
    return deepFreeze({ filename: `tngd-25-point-${report.id}.json`, mediaType: "application/json", content: JSON.stringify(report) });
  }

  executionHandoffAuthorized({ sessionToken, tenantId, fieldSessionId }) {
    const principal = this.#secure.requirePermission({ sessionToken, tenantId, permission: "jobs.read", resourceId: `field-session:${fieldSessionId}:execution-handoff` });
    const session = this.#session(tenantId, fieldSessionId);
    if (session.status !== "submitted" || !session.reportId) throw new Error("Submitted BP-008 evidence is required.");
    const report = this.#reports.get(session.reportId);
    const handoff = deepFreeze({ tenantId, fieldSessionId, serviceCaseId: session.serviceCaseId, customerId: session.customerId,
      serviceType: session.serviceType, diagnosticReportId: report.id, inspectionPerformed: report.inspectionPerformed,
      findingItemIds: report.findings.map((item) => item.id), measurementIds: report.measurements.map((item) => item.id),
      mediaReferenceIds: report.mediaReferences.map((item) => item.id), sourceRevision: session.revision, requestedBy: principal.id });
    this.#recordEvent(session, principal.id, "ExecutionHandoffRead", { diagnosticReportId: report.id });
    return handoff;
  }

  addExceptionAuthorized({ sessionToken, tenantId, fieldSessionId, type, detail }) {
    const session = this.#session(tenantId, fieldSessionId); const handoff = this.#assigned(sessionToken, tenantId, session.workItemId);
    if (!String(type || "").trim() || !String(detail || "").trim()) throw new Error("Field exception type and detail are required.");
    const exception = deepFreeze({ id: randomUUID(), tenantId, fieldSessionId, type, detail, previousStatus: session.status,
      evidenceRevision: this.#inspections.get(this.#inspectionBySession.get(session.id))?.revision ?? null,
      status: "returned-to-administration", openedBy: handoff.technicianId, openedAt: this.#now().toISOString() });
    this.#exceptions.set(exception.id, exception); this.#recordEvent(session, handoff.technicianId, "FieldExceptionReturned", { exceptionId: exception.id, type }); return exception;
  }

  administrativeViewAuthorized({ sessionToken, tenantId, fieldSessionId }) {
    const principal = this.#secure.requirePermission({ sessionToken, tenantId, permission: "jobs.read", resourceId: `field-session:${fieldSessionId}` });
    const session = this.#session(tenantId, fieldSessionId); const inspection = this.#inspections.get(this.#inspectionBySession.get(session.id));
    return deepFreeze({ session, inspection: inspection ?? null, exceptions: [...this.#exceptions.values()].filter((item) => item.fieldSessionId === session.id),
      history: [...(this.#history.get(session.id) ?? [])], viewedBy: principal.id });
  }

  setTemplateAvailabilityAuthorized({ sessionToken, tenantId, enabled }) {
    const principal = this.#secure.requirePermission({ sessionToken, tenantId, permission: "dispatch.manage", resourceId: "inspection-template:availability" });
    if (!principal.roles.includes("tenant_admin")) throw new Error("Only the tenant administrator may configure template availability.");
    this.#templateEnabled.set(tenantId, Boolean(enabled));
    this.#audit.append({ tenantId, principalId: principal.id, type: "InspectionTemplateAvailabilityChanged", resource: inspectionTemplate.id,
      action: "dispatch.manage", outcome: "granted", metadata: { enabled: Boolean(enabled) } }); return Boolean(enabled);
  }

  historyAuthorized({ sessionToken, tenantId, fieldSessionId }) {
    const session = this.#session(tenantId, fieldSessionId); this.#assigned(sessionToken, tenantId, session.workItemId);
    return deepFreeze([...(this.#history.get(session.id) ?? [])]);
  }

}
