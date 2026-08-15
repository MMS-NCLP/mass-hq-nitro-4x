import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { foundation } from "../src/foundation.mjs";
import { securityManifest } from "../src/security/index.mjs";
import { intakeManifest } from "../src/intake/index.mjs";
import { customerCaseManifest } from "../src/customer/index.mjs";
import { schedulingManifest } from "../src/scheduling/index.mjs";
import { capacityManifest } from "../src/capacity/index.mjs";
import { dispatchManifest } from "../src/dispatch/index.mjs";
import { fieldWorkflowManifest } from "../src/field-workflow/index.mjs";

const requiredPaths = [
  ".env.example",
  ".gitignore",
  "package.json",
  "src/foundation.mjs",
  "scripts/build.mjs",
  "scripts/validate-repository.mjs",
  "tests/foundation.test.mjs",
  "tests/security.test.mjs",
  "tests/intake.test.mjs",
  "tests/guided-intake.test.mjs",
  "tests/customer-case.test.mjs",
  "tests/scheduling.test.mjs",
  "tests/capacity.test.mjs",
  "tests/dispatch.test.mjs","src/dispatch/index.mjs","src/dispatch/dispatch-service.mjs","src/dispatch/manifest.mjs",
  "docs/bp007/DOMAIN_AND_DATA_MODEL.md","docs/bp007/API_INVENTORY.md","docs/bp007/PERMISSION_MATRIX.md","docs/bp007/ASSIGNMENT_AND_DISPATCH_RULES.md","docs/bp007/ROUTE_RECOMMENDATION_BOUNDARY.md","docs/bp007/AUDIT_AND_EVENT_MODEL.md","docs/bp007/REVISION_LOG.md",
  "tests/field-workflow.test.mjs","src/field-workflow/index.mjs","src/field-workflow/field-workflow-service.mjs","src/field-workflow/manifest.mjs",
  "docs/bp008/DOMAIN_AND_DATA_MODEL.md","docs/bp008/API_INVENTORY.md","docs/bp008/PERMISSION_MATRIX.md","docs/bp008/MOBILE_WORKFLOW_AND_STATE_RULES.md","docs/bp008/INSPECTION_TEMPLATE_AND_VALIDATION_RULES.md","docs/bp008/DIAGNOSTIC_REPORT_AND_MEDIA_CONTRACT.md","docs/bp008/AUDIT_AND_EVENT_MODEL.md","docs/bp008/REVISION_LOG.md",
  "src/intake/index.mjs",
  "src/intake/guided-intake.mjs",
  "src/intake/intake-service.mjs",
  "src/intake/manifest.mjs",
  "docs/bp003/QUESTIONNAIRE_AND_RULES.md",
  "docs/bp003/DOMAIN_AND_DATA_MODEL.md",
  "docs/bp003/API_INVENTORY.md",
  "docs/bp003/PERMISSION_AUDIT_EVENT_MODEL.md",
  "docs/bp003/REVISION_LOG.md",
  "src/customer/index.mjs",
  "src/customer/customer-case-service.mjs",
  "src/customer/manifest.mjs",
  "docs/bp004/DOMAIN_AND_DATA_MODEL.md",
  "docs/bp004/API_INVENTORY.md",
  "docs/bp004/CONVERSION_AND_DEDUPLICATION_RULES.md",
  "docs/bp004/PERMISSION_AUDIT_EVENT_MODEL.md",
  "docs/bp004/REVISION_LOG.md",
  "src/scheduling/index.mjs",
  "src/scheduling/scheduling-service.mjs",
  "src/scheduling/calendar-gateway.mjs",
  "src/scheduling/manifest.mjs",
  "docs/bp005/DOMAIN_AND_DATA_MODEL.md",
  "docs/bp005/API_INVENTORY.md",
  "docs/bp005/SCHEDULING_CALENDAR_RULES.md",
  "docs/bp005/REVISION_LOG.md",
  "src/capacity/index.mjs", "src/capacity/capacity-service.mjs", "src/capacity/manifest.mjs",
  "docs/bp006/DOMAIN_AND_DATA_MODEL.md", "docs/bp006/API_INVENTORY.md", "docs/bp006/PERMISSION_MATRIX.md", "docs/bp006/CAPACITY_CALCULATION_RULES.md", "docs/bp006/AUDIT_AND_EVENT_MODEL.md", "docs/bp006/REVISION_LOG.md",
  "src/security/audit-log.mjs",
  "src/security/index.mjs",
  "src/security/manifest.mjs",
  "src/security/passwords.mjs",
  "src/security/portal-boundary.mjs",
  "src/security/secure-access.mjs",
  "migrations/README.md",
  "migrations/TNGD-BP-003_REFERENCE.md",
  "migrations/TNGD-BP-004_REFERENCE.md",
  "migrations/TNGD-BP-005_REFERENCE.md",
  "migrations/TNGD-BP-006_REFERENCE.md",
  "migrations/TNGD-BP-007_REFERENCE.md",
  "migrations/TNGD-BP-008_REFERENCE.md",
  "deployment/README.md"
];

const discardedPaths = [
  "src/secure-access.mjs",
  "tests/secure-access.test.mjs"
];

for (const path of requiredPaths) {
  await access(new URL(`../${path}`, import.meta.url), constants.R_OK);
}

for (const path of discardedPaths) {
  try {
    await access(new URL(`../${path}`, import.meta.url), constants.F_OK);
    throw new Error(`Discarded BP-001 implementation path remains: ${path}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8")
);

if (packageJson.private !== true) {
  throw new Error("Pilot package must remain private.");
}

if (packageJson.dependencies || packageJson.devDependencies) {
  throw new Error("Pilot package must remain dependency-free.");
}

for (const script of ["build", "test", "validate", "check", "start"]) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`Missing required script: ${script}`);
  }
}

const canonicalTestCommand =
  "node --test tests/foundation.test.mjs tests/security.test.mjs tests/intake.test.mjs tests/guided-intake.test.mjs tests/customer-case.test.mjs tests/scheduling.test.mjs tests/capacity.test.mjs tests/dispatch.test.mjs tests/field-workflow.test.mjs";
if (packageJson.scripts.test !== canonicalTestCommand) {
  throw new Error("Test command must target canonical BP-000 through BP-008 tests.");
}

const buildSource = await readFile(
  new URL("./build.mjs", import.meta.url),
  "utf8"
);
if (buildSource.includes("../src/secure-access.mjs")) {
  throw new Error("Build references the discarded BP-001 implementation.");
}
if (!buildSource.includes("intake-manifest.json")) {
  throw new Error("Build does not generate the canonical BP-002 intake manifest.");
}
if (!buildSource.includes("customer-case-manifest.json")) {
  throw new Error("Build does not generate the canonical BP-004 customer-case manifest.");
}
if (!buildSource.includes("scheduling-manifest.json")) throw new Error("Build does not generate BP-005 scheduling manifest.");
if (!buildSource.includes("capacity-manifest.json")) throw new Error("Build does not generate BP-006 capacity manifest.");
if (!buildSource.includes("dispatch-manifest.json")) throw new Error("Build does not generate BP-007 dispatch manifest.");
if (!buildSource.includes("field-workflow-manifest.json")) throw new Error("Build does not generate BP-008 field-workflow manifest.");

const requiredBp001Scope = [
  "authentication",
  "password-recovery",
  "role-enforcement",
  "tenant-isolation",
  "portal-separation",
  "audit-logging",
  "session-management"
];
if (
  JSON.stringify(foundation.authorizedFeatureScope) !==
  JSON.stringify(requiredBp001Scope)
) {
  throw new Error("Foundation BP-001 feature scope does not match authority.");
}

const exactBp002Scope = [
  "repair-intake",
  "estimate-intake",
  "other-services-intake",
  "eight-question-intake-foundation",
  "initial-customer-capture",
  "service-request-creation"
];
if (JSON.stringify(foundation.bp002FeatureScope) !== JSON.stringify(exactBp002Scope)) {
  throw new Error("Foundation metadata expands or omits BP-002 authority.");
}

if (!foundation.implementedPackages.includes("TNGD-BP-002")) {
  throw new Error("Foundation does not identify BP-002 as implemented.");
}

const exactBp003Scope = [
  "eight-question-guided-intake",
  "conditional-intake-rules",
  "autosave-and-resume",
  "intake-media-references",
  "structured-intake-record",
  "bp004-ready-handoff"
];
if (JSON.stringify(foundation.bp003FeatureScope) !== JSON.stringify(exactBp003Scope)) {
  throw new Error("Foundation metadata expands or omits BP-003 authority.");
}
if (!foundation.implementedPackages.includes("TNGD-BP-003")) {
  throw new Error("Foundation does not identify BP-003 as implemented.");
}

const exactBp004Scope = [
  "intake-to-customer-conversion",
  "tenant-customer-matching",
  "duplicate-customer-prevention",
  "initial-service-case-creation",
  "initial-customer-timeline",
  "intake-evidence-preservation",
  "bp005-ready-handoff"
];
if (JSON.stringify(foundation.bp004FeatureScope) !== JSON.stringify(exactBp004Scope)) {
  throw new Error("Foundation metadata expands or omits BP-004 authority.");
}
if (!foundation.implementedPackages.includes("TNGD-BP-004")) {
  throw new Error("Foundation does not identify BP-004 as implemented.");
}
const exactBp005Scope = ["appointment-creation", "calendar-synchronization", "conflict-detection", "rescheduling", "dispatch-readiness", "scheduling-audit"];
if (JSON.stringify(foundation.bp005FeatureScope) !== JSON.stringify(exactBp005Scope) || !foundation.implementedPackages.includes("TNGD-BP-005")) throw new Error("Foundation BP-005 authority is incorrect.");
if (JSON.stringify(schedulingManifest.capabilities) !== JSON.stringify(exactBp005Scope) || schedulingManifest.handoffTarget !== "TNGD-BP-006" || schedulingManifest.calendarBoundary !== "approved-provider-gateway") throw new Error("BP-005 scheduling manifest is incorrect.");
const exactBp006Scope = ["technician-availability-profiles", "capacity-calculation", "availability-exceptions", "temporary-capacity-overrides", "capability-and-area-filtering", "bp005-bp007-capacity-handoff"];
if (JSON.stringify(foundation.bp006FeatureScope) !== JSON.stringify(exactBp006Scope) || !foundation.implementedPackages.includes("TNGD-BP-006")) throw new Error("Foundation BP-006 authority is incorrect.");
if (capacityManifest.workOrderId !== "TNGD-BP-006" || !capacityManifest.consumers.includes("TNGD-BP-007")) throw new Error("BP-006 capacity manifest is incorrect.");
if(!foundation.implementedPackages.includes("TNGD-BP-007")||dispatchManifest.workOrderId!=="TNGD-BP-007"||dispatchManifest.humanApprovalRequired!==true)throw new Error("BP-007 manifest authority is incorrect.");
const exactBp008Scope=["assigned-technician-mobile-workflow","today-current-next-job-views","field-lifecycle-and-exceptions","25-point-inspection","governed-diagnostic-evidence","immutable-submission","customer-safe-report","bp009-ready-reference-handoff"];
if(!foundation.implementedPackages.includes("TNGD-BP-008")||JSON.stringify(foundation.bp008FeatureScope)!==JSON.stringify(exactBp008Scope)||fieldWorkflowManifest.workOrderId!=="TNGD-BP-008"||fieldWorkflowManifest.componentCount!==19||fieldWorkflowManifest.handoffTarget!=="TNGD-BP-009"||fieldWorkflowManifest.persistence.media!=="references-only")throw new Error("BP-008 manifest authority is incorrect.");

if (
  customerCaseManifest.workOrderId !== "TNGD-BP-004" ||
  JSON.stringify(customerCaseManifest.capabilities) !== JSON.stringify(exactBp004Scope) ||
  JSON.stringify(customerCaseManifest.entities) !==
    JSON.stringify(["CustomerRecord", "ServiceCase", "CustomerTimeline"]) ||
  customerCaseManifest.serviceCaseStatus !== "ready-for-scheduling" ||
  customerCaseManifest.handoffTarget !== "TNGD-BP-005" ||
  customerCaseManifest.persistence.boundary !== "in-memory"
) {
  throw new Error("BP-004 customer-case manifest does not match authority.");
}

if (JSON.stringify(intakeManifest.paths) !== JSON.stringify(["repair", "estimate", "other-services"])) {
  throw new Error("Intake manifest does not expose exactly the three authorized paths.");
}

const exactIntakeQuestions = [
  "name",
  "phone",
  "email",
  "serviceAddress",
  "serviceCategory",
  "serviceNeed",
  "urgency",
  "preferredContact"
];
if (JSON.stringify(intakeManifest.questions) !== JSON.stringify(exactIntakeQuestions)) {
  throw new Error("Intake manifest must expose exactly the eight authorized questions.");
}

if (intakeManifest.persistence.boundary !== "in-memory") {
  throw new Error("BP-002 must not select an unauthorized persistence provider.");
}

if (
  JSON.stringify(intakeManifest.workOrderIds) !==
  JSON.stringify(["TNGD-BP-002", "TNGD-BP-003"])
) {
  throw new Error("Intake manifest work-order ownership is incorrect.");
}
if (
  intakeManifest.guidedIntake.primaryQuestionCount !== 8 ||
  intakeManifest.guidedIntake.questions.length !== 8 ||
  intakeManifest.guidedIntake.presentation !== "one-at-a-time" ||
  intakeManifest.guidedIntake.autosave !== "after-each-answer" ||
  intakeManifest.guidedIntake.handoffTarget !== "TNGD-BP-004"
) {
  throw new Error("BP-003 manifest does not preserve the guided-intake contract.");
}

if (!securityManifest.capabilities.includes("password-recovery")) {
  throw new Error("BP-001 password-recovery capability is missing.");
}

const secureAccessSource = await readFile(
  new URL("../src/security/secure-access.mjs", import.meta.url),
  "utf8"
);
if (!secureAccessSource.includes("new AuditLog()")) {
  throw new Error("Secure access must retain non-discarding default audit storage.");
}
if (!secureAccessSource.includes("keyForIdentity(tenantId, email)")) {
  throw new Error("Identity lookup must remain tenant-keyed.");
}
if (!secureAccessSource.includes("#tenantBootstrapReservations")) {
  throw new Error("Tenant bootstrap must retain an atomic per-tenant reservation.");
}
if (!secureAccessSource.includes("reset.consumingAt")) {
  throw new Error("Password reset must retain atomic token consumption.");
}

const securityTestSource = await readFile(
  new URL("../tests/security.test.mjs", import.meta.url),
  "utf8"
);
for (const evidenceName of [
  "exactly one concurrent tenant bootstrap succeeds",
  "exactly one concurrent password reset succeeds"
]) {
  if (!securityTestSource.includes(evidenceName)) {
    throw new Error(`Missing concurrency evidence: ${evidenceName}`);
  }
}

const customerCaseSource = await readFile(
  new URL("../src/customer/customer-case-service.mjs", import.meta.url),
  "utf8"
);
for (const requiredBoundary of [
  "convertAuthorized",
  'permission: "customers.write"',
  "getRecordAuthorized",
  "#customerIdentityIndex",
  'status: "ready-for-scheduling"',
  'targetPackage: "TNGD-BP-005"',
  "originalEvidence",
  "auditEventIds"
]) {
  if (!customerCaseSource.includes(requiredBoundary)) {
    throw new Error(`BP-004 customer-case boundary is missing: ${requiredBoundary}`);
  }
}
for (const forbiddenBoundary of ["scheduledAt", "calendarEventId", "technicianId"]) {
  if (customerCaseSource.includes(forbiddenBoundary)) {
    throw new Error(`BP-004 improperly implements scheduling: ${forbiddenBoundary}`);
  }
}

const customerCaseTestSource = await readFile(
  new URL("../tests/customer-case.test.mjs", import.meta.url),
  "utf8"
);
for (const evidenceName of [
  "completed guided intake creates one governed customer, service case, timeline, and BP-005 handoff",
  "repeat conversion is idempotent and does not create duplicate cases",
  "matching email or phone reuses the tenant customer while creating a new service case",
  "tenant boundaries and customer permissions govern conversion and reads",
  "intake evidence remains immutable and scheduling behavior is not implemented"
]) {
  if (!customerCaseTestSource.includes(evidenceName)) {
    throw new Error(`Missing BP-004 evidence: ${evidenceName}`);
  }
}

const schedulingSource = await readFile(new URL("../src/scheduling/scheduling-service.mjs", import.meta.url), "utf8");
for (const boundary of ["scheduleAuthorized", "rescheduleAuthorized", 'permission: "scheduling.manage"', "#assertNoConflict", 'status: "scheduled"', 'technicianAssignmentStatus: "ready-for-bp006"', 'targetPackage: "TNGD-BP-006"']) if (!schedulingSource.includes(boundary)) throw new Error(`BP-005 boundary missing: ${boundary}`);
for (const forbidden of ["assignTechnician", "optimizeRoute", "dispatchAuthorized"]) if (schedulingSource.includes(forbidden)) throw new Error(`BP-005 improperly implements BP-006: ${forbidden}`);

const schedulingTests = await readFile(new URL("../tests/scheduling.test.mjs", import.meta.url), "utf8");
for (const evidence of ["creates one synchronized BP-006-ready appointment", "idempotent per tenant Service Case", "overlapping tenant a…15162 tokens truncated…is.#replaceInspection(inspection, { measurements: [...inspection.measurements, measurement] }, session, handoff.technicianId, "MeasurementRecorded", { measurementId: measurement.id });
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
