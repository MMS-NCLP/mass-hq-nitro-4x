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
import { repairEstimateManifest } from "../src/repair-estimate/index.mjs";
import { customerAuthorizationManifest } from "../src/customer-authorization/index.mjs";
import { invoicePaymentManifest } from "../src/invoicing/index.mjs";

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
  "tests/repair-estimate.test.mjs","src/repair-estimate/index.mjs","src/repair-estimate/repair-estimate-service.mjs","src/repair-estimate/manifest.mjs",
  "docs/bp009/DOMAIN_AND_DATA_MODEL.md","docs/bp009/API_INVENTORY.md","docs/bp009/PERMISSION_MATRIX.md","docs/bp009/LIFECYCLE_AND_BUSINESS_RULES.md","docs/bp009/AUDIT_AND_EVENT_MODEL.md","docs/bp009/REVISION_LOG.md",
  "tests/customer-authorization.test.mjs","src/customer-authorization/index.mjs","src/customer-authorization/customer-authorization-service.mjs","src/customer-authorization/manifest.mjs",
  "docs/bp010/DOMAIN_AND_DATA_MODEL.md","docs/bp010/API_INVENTORY.md","docs/bp010/PERMISSION_MATRIX.md","docs/bp010/LIFECYCLE_AND_BUSINESS_RULES.md","docs/bp010/AUDIT_AND_EVENT_MODEL.md","docs/bp010/REVISION_LOG.md",
  "tests/invoice-payment.test.mjs","src/invoicing/index.mjs","src/invoicing/invoice-payment-service.mjs","src/invoicing/manifest.mjs",
  "docs/bp011/DOMAIN_AND_DATA_MODEL.md","docs/bp011/API_INVENTORY.md","docs/bp011/PERMISSION_MATRIX.md","docs/bp011/LIFECYCLE_AND_BUSINESS_RULES.md","docs/bp011/AUDIT_AND_EVENT_MODEL.md","docs/bp011/REVISION_LOG.md",
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
  "migrations/TNGD-BP-009_REFERENCE.md",
  "migrations/TNGD-BP-010_REFERENCE.md",
  "migrations/TNGD-BP-011_REFERENCE.md",
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
  "node --test tests/foundation.test.mjs tests/security.test.mjs tests/intake.test.mjs tests/guided-intake.test.mjs tests/customer-case.test.mjs tests/scheduling.test.mjs tests/capacity.test.mjs tests/dispatch.test.mjs tests/field-workflow.test.mjs tests/repair-estimate.test.mjs tests/customer-authorization.test.mjs tests/invoice-payment.test.mjs";
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
if (!buildSource.includes("repair-estimate-manifest.json")) throw new Error("Build does not generate BP-009 repair-estimate manifest.");
if (!buildSource.includes("customer-authorization-manifest.json")) throw new Error("Build does not generate BP-010 customer-authorization manifest.");
if (!buildSource.includes("invoice-payment-manifest.json")) throw new Error("Build does not generate BP-011 invoice-payment manifest.");

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
const exactBp009Scope=["repair-service-template","new-door-estimate-template","draft-and-version-lifecycle","diagnostic-reference-lineage","recommendations-options-line-items","outcome-recording","idempotent-estimate-conversion","bp010-ready-authorization-package"];
if(!foundation.implementedPackages.includes("TNGD-BP-009")||JSON.stringify(foundation.bp009FeatureScope)!==JSON.stringify(exactBp009Scope)||repairEstimateManifest.workOrderId!=="TNGD-BP-009"||repairEstimateManifest.handoffTarget!=="TNGD-BP-010")throw new Error("BP-009 manifest authority is incorrect.");
const exactBp010Scope=["authorization-request-and-presentation","adult-acknowledgment","immutable-content-snapshot","signature-or-equivalent-evidence","decision-lifecycle","amendment-and-reauthorization","customer-safe-receipt","bp011-ready-financial-handoff"];
if(!foundation.implementedPackages.includes("TNGD-BP-010")||JSON.stringify(foundation.bp010FeatureScope)!==JSON.stringify(exactBp010Scope)||customerAuthorizationManifest.workOrderId!=="TNGD-BP-010"||customerAuthorizationManifest.handoffTarget!=="TNGD-BP-011")throw new Error("BP-010 manifest authority is incorrect.");

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
  throw new Error("BP-003 manifest does not p×N÷¶‰ËkºwµçM¥…¸ˆ°€‰½ÁÑ¥µ¥é•I½ÕÑ”ˆ°€‰‘¥ÍÁ…Ñ¡ÕÑ¡½É¥é•‰t¤¥˜€¡Í¡•‘Õ±¥¹M½ÕÉ”¹¥¹±Õ‘•Ì¡™½É‰¥‘‘•¸¤¤Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀÔ¥µÁÉ½Á•É±ä¥µÁ±•µ•¹ÑÌ	@´ÀÀØè€‘í™½É‰¥‘‘•¹õ€¤ì()½¹ÍĞÍ¡•‘Õ±¥¹Q•ÍÑÌ€ô…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½Ñ•ÍÑÌ½Í¡•‘Õ±¥¹œ¹Ñ•ÍĞ¹µ©Ìˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°€‰ÕÑ˜àˆ¤ì)™½È€¡½¹ÍĞ•Ù¥‘•¹”½˜l‰É•…Ñ•Ì½¹”Íå¹¡É½¹¥é•	@´ÀÀØµÉ•…‘ä…ÁÁ½¥¹Ñµ•¹Ğˆ°€‰¥‘•µÁ½Ñ•¹ĞÁ•ÈÑ•¹…¹ĞM•ÉÙ¥”…Í”ˆ°€‰½Ù•É±…ÁÁ¥¹œÑ•¹…¹Ğ…ÁÁ½¥¹Ñµ•¹ÑÌ…É”É•©•Ñ•ˆ°€‰É•Í¡•‘Õ±¥¹œÕÁ‘…Ñ•ÌÑ¡”Í…µ”…±•¹‘…È•Ù•¹Ğˆ°€‰Ñ•¡¹¥¥…¹Ì…¹¹½ĞÍ¡•‘Õ±”…¹	@´ÀÀØ‘¥ÍÁ…Ñ ¥Ì¹½Ğ¥µÁ±•µ•¹Ñ•‰t¤¥˜€ …Í¡•‘Õ±¥¹Q•ÍÑÌ¹¥¹±Õ‘•Ì¡•Ù¥‘•¹”¤¤Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÀÔ•Ù¥‘•¹”è€‘í•Ù¥‘•¹•õ€¤ì()½¹ÍĞ…Á…¥ÑåM½ÕÉ”€ô…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½ÍÉŒ½…Á…¥Ñä½…Á…¥ÑäµÍ•ÉÙ¥”¹µ©Ìˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°€‰ÕÑ˜àˆ¤ì)™½È€¡½¹ÍĞ‰½Õ¹‘…Éä½˜l‰½¹™¥ÕÉ•AÉ½™¥±•ÕÑ¡½É¥é•ˆ°€‰…‘‘á•ÁÑ¥½¹ÕÑ¡½É¥é•ˆ°€‰…‘‘=Ù•ÉÉ¥‘•ÕÑ¡½É¥é•ˆ°€‰…±Õ±…Ñ•ÕÑ¡½É¥é•ˆ°€Á•Éµ¥ÍÍ¥½¸è€‰‘¥ÍÁ…Ñ ¹µ…¹…”ˆœ°€Á•Éµ¥ÍÍ¥½¸è€‰Í¡•‘Õ±¥¹œ¹µ…¹…”ˆœ°€‘¥ÍÁ…Ñ è€‰Q9µ	@´ÀÀÜˆt¤¥˜€ ……Á…¥ÑåM½ÕÉ”¹¥¹±Õ‘•Ì¡‰½Õ¹‘…Éä¤¤Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀØ‰½Õ¹‘…Éäµ¥ÍÍ¥¹œè€‘í‰½Õ¹‘…Éåõ€¤ì)™½È€¡½¹ÍĞ™½É‰¥‘‘•¸½˜l‰…ÍÍ¥¹Q•¡¹¥¥…¹ÕÑ¡½É¥é•ˆ°€‰É½ÕÑ•=ÁÑ¥µ¥é…Ñ¥½¸ˆ°€‰‘¥ÍÁ…Ñ¡	½…É‰t¤¥˜€¡…Á…¥ÑåM½ÕÉ”¹¥¹±Õ‘•Ì¡™½É‰¥‘‘•¸¤¤Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀØ¥µÁÉ½Á•É±ä¥µÁ±•µ•¹ÑÌ	@´ÀÀÜè€‘í™½É‰¥‘‘•¹õ€¤ì)½¹ÍĞ…Á…¥ÑåQ•ÍÑÌ€ô…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½Ñ•ÍÑÌ½…Á…¥Ñä¹Ñ•ÍĞ¹µ©Ìˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°€‰ÕÑ˜àˆ¤ì)™½È€¡½¹ÍĞ•Ù¥‘•¹”½˜l‰Í¡¥™ĞÍ•ÑÕÀ•áÁ½Í•ÌÍ•ÉÙ¥”µ…Á…‰±”…Á…¥Ñäˆ°€‰AQ<…¹‰±…­½ÕĞ‘…Ñ•Ì‰±½¬…Á…¥Ñäˆ°€‰…Á…‰¥±¥Ñä°Í•ÉÙ¥”…É•„°•ÅÕ¥Áµ•¹Ğ°Ù•¡¥±”°…¹•µ•É•¹äÉ•ÅÕ¥É•µ•¹ÑÌˆ°€‰Í…µ”µ‘…ä±¥µ¥ÑÌ…¹½Ù•É±…ÁÁ¥¹œ…ÍÍ¥¹µ•¹ÑÌˆ°€‰…ÕÑ¡½É¥é•É•…Í½¹•½Ù•ÉÉ¥‘”¥¹É•…Í•ÌÑ•µÁ½É…Éä…Á…¥Ñäˆ°€‰Ñ•¹…¹Ğ…¹É½±”•¹™½É•µ•¹ĞÁÉ•Ù•¹ĞÑ•¡¹¥¥…¸…Á…¥Ñä…‘µ¥¹¥ÍÑÉ…Ñ¥½¸‰t¤¥˜€ ……Á…¥ÑåQ•ÍÑÌ¹¥¹±Õ‘•Ì¡•Ù¥‘•¹”¤¤Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÀØ•Ù¥‘•¹”è€‘í•Ù¥‘•¹•õ€¤ì)½¹ÍĞ‘¥ÍÁ…Ñ¡M½ÕÉ”õ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½ÍÉŒ½‘¥ÍÁ…Ñ ½‘¥ÍÁ…Ñ µÍ•ÉÙ¥”¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤í™½È¡½¹ÍĞˆ½˜l‰É•…Ñ•]½É­%Ñ•µÕÑ¡½É¥é•ˆ°‰É•½µµ•¹‘ÕÑ¡½É¥é•ˆ°‰…ÍÍ¥¹ÕÑ¡½É¥é•ˆ°‰É•…ÍÍ¥¹ÕÑ¡½É¥é•ˆ°‰É•ÑÕÉ¹Q½EÕ•Õ•ÕÑ¡½É¥é•ˆ°‰‘¥ÍÁ…Ñ¡ÕÑ¡½É¥é•ˆ°‰¡…¹‘½™™ÕÑ¡½É¥é•ˆ°‰I•½µµ•¹‘…Ñ¥½¸É•ÅÕ•ÍÑ•È…¹¹½Ğ…ÁÁÉ½Ù”‰t¥¥˜ …‘¥ÍÁ…Ñ¡M½ÕÉ”¹¥¹±Õ‘•Ì¡ˆ¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀÜ‰½Õ¹‘…Éäµ¥ÍÍ¥¹œè€‘í‰õ€¤í™½È¡½¹ÍĞ˜½˜l‰•á•ÕÑ•)½‰ÕÑ¡½É¥é•ˆ°‰É•…Ñ•ÍÑ¥µ…Ñ”ˆ°‰ÁÉ½•ÍÍA…åµ•¹Ğˆ°‰±¥Ù•QÉ…™™¥AÉ½Ù¥‘•È‰t¥¥˜¡‘¥ÍÁ…Ñ¡M½ÕÉ”¹¥¹±Õ‘•Ì¡˜¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀÜ™½É‰¥‘‘•¸Í½Á”è€‘í™õ€¤ì)½¹ÍĞ‘¥ÍÁ…Ñ¡Q•ÍÑÌõ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½Ñ•ÍÑÌ½‘¥ÍÁ…Ñ ¹Ñ•ÍĞ¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤í™½È¡½¹ÍĞ”½˜l‰¥‘•µÁ½Ñ•¹ĞÕ¹…ÍÍ¥¹•İ½É¬¥Ñ•´ˆ°‰…Á…¥Ñäµ…İ…É”É•½µµ•¹‘…Ñ¥½¸ˆ°‰¡Õµ…¸…ÁÁÉ½Ù…°Í•Á…É…Ñ¥½¸ˆ°‰¥µµÕÑ…‰±”…ÍÍ¥¹µ•¹Ğ¡¥ÍÑ½Éäˆ°‰É•ÑÕÉ¸Ñ¼ÅÕ•Õ”…¹‘¥ÍÁ…Ñ ±¥™•å±”ˆ°‰•á•ÁÑ¥½¹Ì…É”½Á•¹•…¹É•Í½±Ù•ˆ°‰…ÍÍ¥¹•Ñ•¡¹¥¥…¸É••¥Ù•Ì‰t¥¥˜ …‘¥ÍÁ…Ñ¡Q•ÍÑÌ¹¥¹±Õ‘•Ì¡”¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÀÜ•Ù¥‘•¹”è€‘í•õ€¤ì)½¹ÍĞ™¥•±‘M½ÕÉ”õ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½ÍÉŒ½™¥•±µİ½É­™±½Ü½™¥•±µİ½É­™±½ÜµÍ•ÉÙ¥”¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤ì)™½È¡½¹ÍĞ‰½Õ¹‘…Éä½˜l‰±¥ÍÑ)½‰ÍÕÑ¡½É¥é•ˆ°‰½Á•¹ÕÑ¡½É¥é•ˆ°‰ÑÉ…¹Í¥Ñ¥½¹ÕÑ¡½É¥é•ˆ°‰ÍÑ…ÉÑ%¹ÍÁ•Ñ¥½¹ÕÑ¡½É¥é•ˆ°‰É•½É‘%Ñ•µÕÑ¡½É¥é•ˆ°‰…ÑÑ…¡5•‘¥…I•™•É•¹•ÕÑ¡½É¥é•ˆ°‰ÍÕ‰µ¥ÑÕÑ¡½É¥é•ˆ°‰Í¡…É•¥…¹½ÍÑ¥I•Á½ÉÑÕÑ¡½É¥é•ˆ°‰…‘‘á•ÁÑ¥½¹ÕÑ¡½É¥é•ˆ°‰…‘µ¥¹¥ÍÑÉ…Ñ¥Ù•Y¥•İÕÑ¡½É¥é•ˆ°Ñ…É•ÑA…­…”è€‰Q9µ	@´ÀÀäˆœ°…Ñ¥½¸è€‰É•Á…¥Èµ½Èµ•ÍÑ¥µ…Ñ”µÁ•¹‘¥¹œˆœ°‰MÕ‰µ¥ÑÑ•¥¹ÍÁ•Ñ¥½¸•Ù¥‘•¹”¥Ì¥µµÕÑ…‰±”ˆ°‰I•Á…¥ÈÉ•ÅÕ¥É•ÌÑ¡”€ÈÔµA½¥¹Ğ%¹ÍÁ•Ñ¥½¸ˆ°‰½•Ì9½ĞÁÁ±äˆ°€‰±¥ÍÑ!…¹‘½™™ÍÕÑ¡½É¥é•‰t¥¥˜ …™¥•±‘M½ÕÉ”¹¥¹±Õ‘•Ì¡‰½Õ¹‘…Éä¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀà‰½Õ¹‘…Éäµ¥ÍÍ¥¹œè€‘í‰½Õ¹‘…Éåõ€¤ì)™½È¡½¹ÍĞ™½É‰¥‘‘•¸½˜l‰É•…Ñ•I•Á…¥ÉÕÑ¡½É¥é•ˆ°‰É•…Ñ•ÍÑ¥µ…Ñ•ÕÑ¡½É¥é•ˆ°‰…ÕÑ¡½É¥é•ÕÍÑ½µ•ÉÕÑ¡½É¥é•ˆ°‰É•…Ñ•%¹Ù½¥•ÕÑ¡½É¥é•ˆ°‰ÁÉ½•ÍÍA…åµ•¹ÑÕÑ¡½É¥é•ˆ°‰‘•Ñ•Éµ¥¹•]…ÉÉ…¹ÑåÕÑ¡½É¥é•ˆ°‰…É…•½½É=É‘•É½É´ˆ°‰½µÁÕÑ•ÉY¥Í¥½¸ˆ°‰…¥¥…¹½Í¥Ì‰t¥¥˜¡™¥•±‘M½ÕÉ”¹¥¹±Õ‘•Ì¡™½É‰¥‘‘•¸¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀà™½É‰¥‘‘•¸Í½Á”è€‘í™½É‰¥‘‘•¹õ€¤ì)½¹ÍĞ™¥•±‘Q•ÍÑÌõ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½Ñ•ÍÑÌ½™¥•±µİ½É­™±½Ü¹Ñ•ÍĞ¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤ì)™½È¡½¹ÍĞ•Ù¥‘•¹”½˜l‰…ÍÍ¥¹•Ñ•¡¹¥¥…¸É••¥Ù•ÌÑ½‘…ä°ÕÉÉ•¹Ğ°…¹¹•áĞÙ¥•İÌˆ°‰Õ¹…ÍÍ¥¹•Ñ•¡¹¥¥…¹Ì…¹¹½ĞÙ¥•Ü°½Á•¸°½ÈµÕÑ…Ñ”ˆ°‰™¥•±±¥™•å±”Á•Éµ¥ÑÌÁ…ÕÍ”…¹É•ÍÕµ”ˆ°‰•á…Ñ±ä¹¥¹•Ñ••¸Í½ÕÉ”½µÁ½¹•¹ÑÌ…¹™½ÕÈ½Ù•É¹•É•ÍÕ±ÑÌˆ°‰É•Á…¥ÈÍÕ‰µ¥ÍÍ¥½¸‰±½­Ìµ¥ÍÍ¥¹œ¥¹ÍÁ•Ñ¥½¸ˆ°‰ÍÕ‰µ¥ÑÌ¥µµÕÑ…‰±”•Ù¥‘•¹”…¹„	@´ÀÀäµÉ•…‘äÉ•™•É•¹”¡…¹‘½™˜ˆ°‰•ÍÑ¥µ…Ñ”¥¹ÍÁ•Ñ¥½¸¥Ì½ÁÑ¥½¹…°ˆ°‰½Ù•É¹•É•™•É•¹•Ìİ¥Ñ¡½ÕĞ‰¥¹…Éä‘ÕÁ±¥…Ñ¥½¸ˆ°‰•á±Õ‘”¥¹Ñ•É¹…°µ½¹±ä¹½Ñ•Ìˆ°‰•á•ÁÑ¥½¹ÌÉ•ÑÕÉ¸Ñ¼…‘µ¥¹¥ÍÑÉ…Ñ¥½¸ˆ°‰Ñ•¹…¹Ğ¥Í½±…Ñ¥½¸°É½±”•¹™½É•µ•¹Ğ°¥‘•µÁ½Ñ•¹ä°…¹…Õ‘¥Ğ¡¥ÍÑ½Éä‰t¥¥˜ …™¥•±‘Q•ÍÑÌ¹¥¹±Õ‘•Ì¡•Ù¥‘•¹”¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÀà•Ù¥‘•¹”è€‘í•Ù¥‘•¹•õ€¤ì)½¹ÍĞ•á•ÕÑ¥½¹M½ÕÉ”õ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½ÍÉŒ½É•Á…¥Èµ•ÍÑ¥µ…Ñ”½É•Á…¥Èµ•ÍÑ¥µ…Ñ”µÍ•ÉÙ¥”¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤ì)™½È¡½¹ÍĞ‰½Õ¹‘…Éä½˜l‰…É…”½½ÈI•Á…¥ÈğM•ÉÙ¥”ˆ°‰9•Ü…É…”½½ÈÍÑ¥µ…Ñ”ˆ°‰•á•ÕÑ¥½¹!…¹‘½™™ÕÑ¡½É¥é•ˆ°ˆÈÔµA½¥¹Ğ%¹ÍÁ•Ñ¥½¸ˆ°‰Ñİ¼µå•…ÈÁ…ÉÑÌİ…ÉÉ…¹Ñäˆ°ˆäÀµ‘…äÍ•ÉÙ¥”½Ù•É…”ˆ°‰™¥¹…±¥é•ˆ°‰É•Ù¥Í•ÕÑ¡½É¥é•ˆ°‰ÁÉ•Á…É•ÕÑ¡½É¥é…Ñ¥½¹A…­…•ÕÑ¡½É¥é•ˆ°‰Á•¹‘¥¹œµ…ÕÑ¡½É¥é…Ñ¥½¸ˆ°‰½¹Ù•ÉÑÍÑ¥µ…Ñ•ÕÑ¡½É¥é•ˆ°‰…ÕÑ¡½É¥é…Ñ¥½¹Ù¥‘•¹•I•™•É•¹•%‰t¥¥˜ …•á•ÕÑ¥½¹M½ÕÉ”¹¥¹±Õ‘•Ì¡‰½Õ¹‘…Éä¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀä‰½Õ¹‘…Éäµ¥ÍÍ¥¹œè€‘í‰½Õ¹‘…Éåõ€¤ì)™½È¡½¹ÍĞ™½É‰¥‘‘•¸½˜l‰…ÕÑ¡½É¥é•ÕÍÑ½µ•ÉÕÑ¡½É¥é•ˆ°‰É•…Ñ•%¹Ù½¥•ÕÑ¡½É¥é•ˆ°‰ÁÉ½•ÍÍA…åµ•¹ÑÕÑ¡½É¥é•ˆ°‰‘•Ñ•Éµ¥¹•]…ÉÉ…¹ÑåÕÑ¡½É¥é•ˆ°‰…É…•½½É=É‘•É½É´ˆ°‰…¥•¹•É…Ñ•‘AÉ¥¥¹œ‰t¥¥˜¡•á•ÕÑ¥½¹M½ÕÉ”¹¥¹±Õ‘•Ì¡™½É‰¥‘‘•¸¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀä™½É‰¥‘‘•¸Í½Á”è€‘í™½É‰¥‘‘•¹õ€¤ì)½¹ÍĞ•á•ÕÑ¥½¹Q•ÍÑÌõ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½Ñ•ÍÑÌ½É•Á…¥Èµ•ÍÑ¥µ…Ñ”¹Ñ•ÍĞ¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤ì)™½È¡½¹ÍĞ•Ù¥‘•¹”½˜l‰‰½Ñ …ÁÁÉ½Ù•Ñ•µÁ±…Ñ•Ì…¹•á…ĞÍÑ…¹‘…ÉM•ÉÙ¥”…¹]…ÉÉ…¹Ñä±¥¹”¥Ñ•µÌˆ°‰É•Á…¥ÈÉ•ÅÕ¥É•Ì	@´ÀÀà¥¹ÍÁ•Ñ¥½¸İ¡¥±”•ÍÑ¥µ…Ñ”¥¹ÍÁ•Ñ¥½¸É•µ…¥¹Ì½ÁÑ¥½¹…°ˆ°‰‘É…™ĞÉ•…Ñ¥½¸¥Ì¥‘•µÁ½Ñ•¹Ğ…¹ÁÉ•Í•ÉÙ•ÌÕÍÑ½µ•ÈM•ÉÙ¥”…Í”…¹•Ù¥‘•¹”É•™•É•¹•Ìˆ°‰™¥¹…±¥é•Ù•ÉÍ¥½¹Ì…É”¥µµÕÑ…‰±”…¹½ÉÉ•Ñ¥½¹ÌÉ•…Ñ”„¹•ÜÙ•ÉÍ¥½¸ˆ°‰	@´ÀÄÀÁ…­…”É•µ…¥¹ÌÁ•¹‘¥¹œ…¹‘½•Ì¹½Ğ…ÕÑ¡½É¥é”İ½É¬ˆ°‰…•ÁÑ••ÍÑ¥µ…Ñ”½¹Ù•ÉÍ¥½¸ÁÉ•Í•ÉÙ•Ì±¥¹•…”İ¥Ñ¡½ÕĞ‘ÕÁ±¥…Ñ”ÕÍÑ½µ•È½ÈM•ÉÙ¥”…Í”ˆ°‰Ñ•¹…¹Ğ…¹É½±”•¹™½É•µ•¹ĞÁ±ÕÌ…Õ‘¥Ğ¡¥ÍÑ½ÉäÉ•µ…¥¸¥¹Ñ…Ğˆ°‰¹¼…ÕÑ¡½É¥é…Ñ¥½¸¥¹Ù½¥”Á…åµ•¹Ğİ…ÉÉ…¹Ñä‘•¥Í¥½¸½È‘•Ñ…¥±•½É‘•È•á•ÕÑ¥½¸¥Ì•áÁ½Í•‰t¥¥˜ …•á•ÕÑ¥½¹Q•ÍÑÌ¹¥¹±Õ‘•Ì¡•Ù¥‘•¹”¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÀä•Ù¥‘•¹”è€‘í•Ù¥‘•¹•õ€¤ì)½¹ÍĞ…ÕÑ¡½É¥é…Ñ¥½¹M½ÕÉ”õ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½ÍÉŒ½ÕÍÑ½µ•Èµ…ÕÑ¡½É¥é…Ñ¥½¸½ÕÍÑ½µ•Èµ…ÕÑ¡½É¥é…Ñ¥½¸µÍ•ÉÙ¥”¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤ì)™½È¡½¹ÍĞ‰½Õ¹‘…Éä½˜l‰É•…Ñ•I•ÅÕ•ÍÑÕÑ¡½É¥é•ˆ°‰ÕÉÉ•¹Ğ¥µµÕÑ…‰±”	@´ÀÀäÙ•ÉÍ¥½¸ˆ°‰½¹Ñ•¹Ñ!…Í ˆ°‰…‘Õ±Ğ…”€Äà½È½±‘•Èˆ°‰Í¥¹…ÑÕÉ”½È…ÁÁÉ½Ù••ÅÕ¥Ù…±•¹Ğ•Ù¥‘•¹”ˆ°‰µÁ±½å••Ì°Ñ•¡¹¥¥…¹Ì°$°…¹É•ÅÕ•ÍÑ•ÉÌ…¹¹½Ğ…ÕÑ¡½É¥é”ˆ°‰•ÁÑ•…¹‘•±¥¹•…ÕÑ¡½É¥é…Ñ¥½¸•Ù¥‘•¹”¥Ì¥µµÕÑ…‰±”ˆ°‰…µ•¹‘ÕÑ¡½É¥é•ˆ°‰É••¥ÁĞˆ°‰™¥¹…¹¥…±!…¹‘½™™ÕÑ¡½É¥é•ˆ°Ñ…É•ÑA…­…”è‰Q9µ	@´ÀÄÄˆt¥¥˜ ……ÕÑ¡½É¥é…Ñ¥½¹M½ÕÉ”¹¥¹±Õ‘•Ì¡‰½Õ¹‘…Éä¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÄÀ‰½Õ¹‘…Éäµ¥ÍÍ¥¹œè€‘í‰½Õ¹‘…Éåõ€¤ì)™½È¡½¹ÍĞ™½É‰¥‘‘•¸½˜l‰É•…Ñ•%¹Ù½¥•ÕÑ¡½É¥é•ˆ°‰ÁÉ½•ÍÍA…åµ•¹ÑÕÑ¡½É¥é•ˆ°‰ÍÑ½É•…É‘ÕÑ¡½É¥é•ˆ°‰‘•Ñ•Éµ¥¹•]…ÉÉ…¹ÑåÕÑ¡½É¥é•ˆ°‰…É…•½½É=É‘•É½É´‰t¥¥˜¡…ÕÑ¡½É¥é…Ñ¥½¹M½ÕÉ”¹¥¹±Õ‘•Ì¡™½É‰¥‘‘•¸¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÄÀ™½É‰¥‘‘•¸Í½Á”è€‘í™½É‰¥‘‘•¹õ€¤ì)½¹ÍĞ…ÕÑ¡½É¥é…Ñ¥½¹Q•ÍÑÌõ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½Ñ•ÍÑÌ½ÕÍÑ½µ•Èµ…ÕÑ¡½É¥é…Ñ¥½¸¹Ñ•ÍĞ¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤ì)™½È¡½¹ÍĞ•Ù¥‘•¹”½˜l‰…ÕÑ¡½É¥é…Ñ¥½¸‰¥¹‘Ì½¹”¥µµÕÑ…‰±”	@´ÀÀäÙ•ÉÍ¥½¸…¹•á…ĞÁÉ•Í•¹Ñ•½¹Ñ•¹Ğ¡…Í ˆ°‰…ÕÑ¡½É¥é…Ñ¥½¸É•ÅÕ•ÍĞÉ•…Ñ¥½¸¥Ì¥‘•µÁ½Ñ•¹Ğİ¥Ñ¡½ÕĞÉ•Á±…å¥¹œÑÉ…¹Í…Ñ¥½¸Í•É•ÑÌˆ°‰…ÕÑ¡½É¥é•…‘Õ±Ğ…­¹½İ±•‘µ•¹Ğ…¹Í¥¹…ÑÕÉ”•Ù¥‘•¹”…É”É•ÅÕ¥É•ˆ°‰•µÁ±½å••ÌÑ•¡¹¥¥…¹Ì$…¹Õ¹…ÕÑ¡•¹Ñ¥…Ñ•…±±Ì…¹¹½Ğ…ÕÑ¡½É¥é”™½ÈÕÍÑ½µ•ÉÌˆ°‰…•ÁÑ•…¹‘•±¥¹••Ù¥‘•¹”¥Ì¥µµÕÑ…‰±”…¹É•ÑÉäµÍ…™”ˆ°‰¡…¹•Í½Á”½ÈÁÉ¥”É•ÅÕ¥É•Ì…µ•¹‘µ•¹ĞÑ¼„¹•Ü¥µµÕÑ…‰±”Ù•ÉÍ¥½¸ˆ°‰ÕÍÑ½µ•ÈµÍ…™”É••¥ÁĞ•á±Õ‘•ÌÑÉ…¹Í…Ñ¥½¸Ñ½­•¸…¹¥¹Ñ•É¹…°¡¥ÍÑ½Éäˆ°‰	@´ÀÄÄ¡…¹‘½™˜É•ÅÕ¥É•ÌÕÉÉ•¹Ğ…ÁÁÉ½Ù…°…¹Á•É™½ÉµÌ¹¼¥¹Ù½¥”½ÈÁ…åµ•¹Ğˆ°‰Ñ•¹…¹ĞÉ½±”…¹…Õ‘¥Ğ‰½Õ¹‘…É¥•ÌÉ•µ…¥¸¥¹Ñ…Ğİ¥Ñ ¹¼	@´ÀÄÄ•á•ÕÑ¥½¸‰t¥¥˜ ……ÕÑ¡½É¥é…Ñ¥½¹Q•ÍÑÌ¹¥¹±Õ‘•Ì¡•Ù¥‘•¹”¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÄÀ•Ù¥‘•¹”è€‘í•Ù¥‘•¹•õ€¤ì)½¹ÍĞ•á…Ñ	ÀÀÄÅM½Á”õl‰¥¹Ù½¥”µ‘É…™Ğµ…¹µ™¥¹…±¥é…Ñ¥½¸ˆ°‰…ÕÑ¡½É¥é•µÍ½Á”µ½¹ÍÕµÁÑ¥½¸ˆ°‰¥µµÕÑ…‰±”µ¥¹Ù½¥”µÙ•ÉÍ¥½¹Ìˆ°‰ÍÅÕ…É”µÁ…åµ•¹Ğµ…Ñ•İ…äˆ°‰¥‘•µÁ½Ñ•¹ĞµÁ…åµ•¹Ğµİ•‰¡½½­Ìˆ°‰ÑÉ…¹Í…Ñ¥½¸µÍ½Á•µÕÍÑ½µ•Èµ…•ÍÌˆ°‰É•™Õ¹µ…¹µ•á•ÁÑ¥½¸µ•Ù¥‘•¹”ˆ°‰‰ÀÀÄÈµÉ•…‘äµÉ•½¹¥±¥…Ñ¥½¸µ¡…¹‘½™˜‰tì)¥˜ …™½Õ¹‘…Ñ¥½¸¹¥µÁ±•µ•¹Ñ•‘A…­…•Ì¹¥¹±Õ‘•Ì ‰Q9µ	@´ÀÄÄˆ¥ññ)M=8¹ÍÑÉ¥¹¥™ä¡™½Õ¹‘…Ñ¥½¸¹‰ÀÀÄÅ•…ÑÕÉ•M½Á”¤„ôõ)M=8¹ÍÑÉ¥¹¥™ä¡•á…Ñ	ÀÀÄÅM½Á”¥ññ¥¹Ù½¥•A…åµ•¹Ñ5…¹¥™•ÍĞ¹İ½É­=É‘•É%„ôô‰Q9µ	@´ÀÄÄ‰ññ¥¹Ù½¥•A…åµ•¹Ñ5…¹¥™•ÍĞ¹ÁÉ½Ù¥‘•È„ôô‰ÍÅÕ…É”‰ññ¥¹Ù½¥•A…åµ•¹Ñ5…¹¥™•ÍĞ¹¡…¹‘½™™Q…É•Ğ„ôô‰Q9µ	@´ÀÄÈˆ¥Ñ¡É½Ü¹•ÜÉÉ½È ‰	@´ÀÄÄµ…¹¥™•ÍĞ…ÕÑ¡½É¥Ñä¥Ì¥¹½ÉÉ•Ğ¸ˆ¤ì)½¹ÍĞ¥¹Ù½¥•M½ÕÉ”õ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½ÍÉŒ½¥¹Ù½¥¥¹œ½¥¹Ù½¥”µÁ…åµ•¹ĞµÍ•ÉÙ¥”¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤ì)™½È¡½¹ÍĞ‰½Õ¹‘…Éä½˜l‰É•…Ñ•É…™ÑÕÑ¡½É¥é•ˆ°‰™¥¹…±¥é•ÕÑ¡½É¥é•ˆ°‰É•…Ñ•A…åµ•¹Ñ1¥¹­ÕÑ¡½É¥é•ˆ°‰ÁÉ½•ÍÍ]•‰¡½½¬ˆ°‰Ù•É¥™å]•‰¡½½¬ˆ°‰É•™Õ¹‘ÕÑ¡½É¥é•ˆ°‰ÕÍÑ½µ•ÉY¥•Üˆ°‰É•½¹¥±¥…Ñ¥½¹!…¹‘½™™ÕÑ¡½É¥é•ˆ°Ñ…É•ÑA…­…”è‰Q9µ	@´ÀÄÈˆœ°‰AÉ½¡¥‰¥Ñ•…É‘…Ñ„µÕÍĞ¹•Ù•È•¹Ñ•È5MLˆ°‰¥¹…±¥é•¥¹Ù½¥”¥ÌÉ•ÅÕ¥É•‰t¥¥˜ …¥¹Ù½¥•M½ÕÉ”¹¥¹±Õ‘•Ì¡‰½Õ¹‘…Éä¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÄÄ‰½Õ¹‘…Éäµ¥ÍÍ¥¹œè€‘í‰½Õ¹‘…Éåõ€¤ì)™½È¡½¹ÍĞ™½É‰¥‘‘•¸½˜l‰É•Í½±Ù•I•½¹¥±¥…Ñ¥½¹ÕÑ¡½É¥é•ˆ°‰‘•Ñ•Éµ¥¹•]…ÉÉ…¹ÑåÕÑ¡½É¥é•ˆ°‰™½±±½İUÁÕÑ¡½É¥é•ˆ°‰…É…•½½É=É‘•É½É´‰t¥¥˜¡¥¹Ù½¥•M½ÕÉ”¹¥¹±Õ‘•Ì¡™½É‰¥‘‘•¸¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÄÄ™½É‰¥‘‘•¸Í½Á”è€‘í™½É‰¥‘‘•¹õ€¤ì)½¹ÍĞ¥¹Ù½¥•Q•ÍÑÌõ…İ…¥ĞÉ•…‘¥±”¡¹•ÜUI0 ˆ¸¸½Ñ•ÍÑÌ½¥¹Ù½¥”µÁ…åµ•¹Ğ¹Ñ•ÍĞ¹µ©Ìˆ±¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°‰ÕÑ˜àˆ¤ì)™½È¡½¹ÍĞ•Ù¥‘•¹”½˜l‰…ÕÑ¡½É¥é•	@´ÀÄÀÍ½Á”ÁÉ½‘Õ•Ì½¹”Ñ•¹…¹ĞµÍ…™”¥¹Ù½¥”İ¥Ñ ½Ù•É¹•Ñ½Ñ…±Ìˆ°‰‘¥…¹½ÍÑ¥ŒÉ•Á½ÉĞ…ÑÑ…¡•Ì‰ä‘•™…Õ±Ğ…¹µ•‘¥„É•µ…¥¹ÌÉ•™•É•¹”µ½¹±äˆ°‰™¥¹…±¥é•¥¹Ù½¥”Ù•ÉÍ¥½¹Ì…É”¥µµÕÑ…‰±”…¹½¹Ñ•¹Ğµ¡…Í¡•ˆ°‰MÅÕ…É”Á…åµ•¹Ğ±¥¹­Ì…É”É•ÑÉäµÍ…™”İ¡¥±”5MLÉ•µ…¥¹Ì™¥¹…¹¥…°µÍÑ…Ñ”…ÕÑ¡½É¥Ñäˆ°‰İ•‰¡½½¬…ÕÑ¡•¹Ñ¥¥Ñä…¹¥‘•µÁ½Ñ•¹ä½Ù•É¸Á…åµ•¹ĞÍÑ…Ñ”ˆ°‰ÁÉ½¡¥‰¥Ñ•…É‘…Ñ„¥ÌÉ•©•Ñ•…¹¹•Ù•ÈÍÑ½É•ˆ°‰ÕÍÑ½µ•È¥¹Ù½¥”…•ÍÌ¥ÌÑÉ…¹Í…Ñ¥½¸µÍ½Á•…¹ÕÍÑ½µ•ÈµÍ…™”ˆ°‰É•™Õ¹É•ÅÕ¥É•Ì…ÕÑ¡½É¥é•¡Õµ…¸É•…Í½¸…¹É•½É‘Ì¥µµÕÑ…‰±”É•™•É•¹”ˆ°‰™…¥±ÕÉ•Ì…¹‘¥ÍÁÕÑ•ÌÁÉ½‘Õ”„	@´ÀÄÈÉ•™•É•¹”µ½¹±ä•á•ÁÑ¥½¸¡…¹‘½™˜ˆ°‰Ñ•¹…¹ĞÉ½±”…Õ‘¥Ğ…¹±…Ñ•ÈµÁ…­…”‰½Õ¹‘…É¥•ÌÉ•µ…¥¸¥¹Ñ…Ğ‰t¥¥˜ …¥¹Ù½¥•Q•ÍÑÌ¹¥¹±Õ‘•Ì¡•Ù¥‘•¹”¤¥Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÄÄ•Ù¥‘•¹”è€‘í•Ù¥‘•¹•õ€¤ì()™½È€¡½¹ÍĞ½ÉÉ•Ñ•‘	½Õ¹‘…Éä½˜l(€€‰Ñ¡¥Ì¸Í¡•‘Õ±¥¹œ¹±¥ÍÑÕÑ¡½É¥é•¡ìÍ•ÍÍ¥½¹Q½­•¸°Ñ•¹…¹Ñ%ô¤ˆ°(€€½Ù•É¹•‘¥ÍÑ…¹”¡ÑÉ…Ù•±¥ÍÑ…¹•5¥±•Ì°€‰QÉ…Ù•°‘¥ÍÑ…¹”ˆ¤œ°(€€½Ù•É¹•‘…Á…¥Ñå%¹Ñ••È¡‘…¥±å1¥µ¥Ğ°€‰…¥±ä…Á…¥Ñäˆ°€Ä¤œ°(€€½Ù•É¹•‘…Á…¥Ñå%¹Ñ••È¡Í…µ•…å1¥µ¥Ğ°€‰M…µ”µ‘…ä…Á…¥Ñäˆ¤œ°(€€½Ù•É¹•‘…Á…¥Ñå%¹Ñ••È¡•µ•É•¹å…¥±å1¥µ¥Ğ°€‰µ•É•¹ä…Á…¥Ñäˆ¤œ°(€€½Ù•É¹•‘…Á…¥Ñå%¹Ñ••È¡…‘‘¥Ñ¥½¹…±…Á…¥Ñä°€‰=Ù•ÉÉ¥‘”…Á…¥Ñäˆ¤œ°(€€‰½¹ÍĞ…ÍÍ¥¹•‘=¹…Ñ”€ô…ÍÍ¥¹•¹™¥±Ñ•Èˆ°(€€‰±¥µ¥Ğ€´…ÍÍ¥¹•‘=¹…Ñ”¹±•¹Ñ ˆ°(€€‰½Ù•ÉÉ¥‘•%è½Ù•ÉÉ¥‘”¹¥ˆ°(€€‰…‘‘¥Ñ¥½¹…±…Á…¥Ñäè½Ù•ÉÉ¥‘”¹…‘‘¥Ñ¥½¹…±…Á…¥Ñäˆ°(€€‰É•…Í½¸è½Ù•ÉÉ¥‘”¹É•…Í½¸ˆ)t¤ì(€¥˜€ ……Á…¥ÑåM½ÕÉ”¹¥¹±Õ‘•Ì¡½ÉÉ•Ñ•‘	½Õ¹‘…Éä¤¤ì(€€€Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÀØ¸È½ÉÉ•Ñ•‰½Õ¹‘…Éäè€‘í½ÉÉ•Ñ•‘	½Õ¹‘…Éåõ€¤ì(€ô)ô()™½È€¡½¹ÍĞ½ÉÉ•Ñ•‘Ù¥‘•¹”½˜l(€€‰Á…ÉÑ¥…°µ‘…ä•á•ÁÑ¥½¹Ì‰±½¬½¹±ä½Ù•É±…ÁÁ¥¹œ¥¹Ñ•ÉÙ…±Ìˆ°(€€‰½Ù•É¹•ÑÉ…Ù•°¥¹ÁÕĞÉ•©•ÑÌ½µ¥ÍÍ¥½¸…¹¥¹Ù…±¥‘¥ÍÑ…¹•Ìˆ°(€€‰É•µ…¥¹¥¹œ…Á…¥Ñä½Õ¹ÑÌ½¹±ä…ÁÁ½¥¹Ñµ•¹ÑÌ½¸Ñ¡”É•ÅÕ•ÍÑ•‘…Ñ”ˆ°(€€‰…Á…¥Ñä…¹½Ù•ÉÉ¥‘”…µ½Õ¹ÑÌÉ•©•Ğµ…±™½Éµ•½ÈÕ¹½Ù•É¹•¹Õµ•É¥ŒÙ…±Õ•Ìˆ°(€€‰…ÕÑ¡½É¥é•É•…Í½¹•½Ù•ÉÉ¥‘”¥¹É•…Í•ÌÑ•µÁ½É…Éä…Á…¥Ñä…¹É•µ…¥¹Ì…Õ‘¥Ñ…‰±”ˆ)t¤ì(€¥˜€ ……Á…¥ÑåQ•ÍÑÌ¹¥¹±Õ‘•Ì¡½ÉÉ•Ñ•‘Ù¥‘•¹”¤¤ì(€€€Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÀØ¸È½ÉÉ•Ñ¥½¸•Ù¥‘•¹”è€‘í½ÉÉ•Ñ•‘Ù¥‘•¹•õ€¤ì(€ô)ô()½¹ÍĞÁ½ÉÑ…±M½ÕÉ”€ô…İ…¥ĞÉ•…‘¥±” (€¹•ÜUI0 ˆ¸¸½ÍÉŒ½Í•ÕÉ¥Ñä½Á½ÉÑ…°µ‰½Õ¹‘…Éä¹µ©Ìˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°(€€‰ÕÑ˜àˆ(¤ì)¥˜€ …Á½ÉÑ…±M½ÕÉ”¹¥¹±Õ‘•Ì …Ñ¥½¸€„ôô€‰¥¹Ñ…­”¹ÍÕ‰µ¥Ğˆœ¤¤ì(€Ñ¡É½Ü¹•ÜÉÉ½È ‰AÕ‰±¥ŒÁ½ÉÑ…°µÕÍĞÉ•Ñ…¥¸Ñ¡”…ÁÁÉ½Ù•…Ñ¥½¸…±±½İ±¥ÍĞ¸ˆ¤ì)ô()½¹ÍĞ¥¹Ñ…­•M½ÕÉ”€ô…İ…¥ĞÉ•…‘¥±” (€¹•ÜUI0 ˆ¸¸½ÍÉŒ½¥¹Ñ…­”½¥¹Ñ…­”µÍ•ÉÙ¥”¹µ©Ìˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°(€€‰ÕÑ˜àˆ(¤ì)™½È€¡½¹ÍĞÉ•ÅÕ¥É•‘	½Õ¹‘…Éä½˜l(€€‰ÍÕ‰µ¥ÑÕÑ¡½É¥é•ˆ°(€€Á•Éµ¥ÍÍ¥½¸è€‰¥¹Ñ…­”¹É•…Ñ”ˆœ°(€€…Ñ¥½¸è€‰¥¹Ñ…­”¹É•…Ñ”ˆœ°(€€‰ÕÍÑ½µ•É-•ä¡Ñ•¹…¹Ñ%°…¹Íİ•ÉÌ¤ˆ)t¤ì(€¥˜€ …¥¹Ñ…­•M½ÕÉ”¹¥¹±Õ‘•Ì¡É•ÅÕ¥É•‘	½Õ¹‘…Éä¤¤ì(€€€Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀÈ¥¹Ñ…­”‰½Õ¹‘…Éä¥Ìµ¥ÍÍ¥¹œè€‘íÉ•ÅÕ¥É•‘	½Õ¹‘…Éåõ€¤ì(€ô)ô()½¹ÍĞ¥¹Ñ…­•Q•ÍÑM½ÕÉ”€ô…İ…¥ĞÉ•…‘¥±” (€¹•ÜUI0 ˆ¸¸½Ñ•ÍÑÌ½¥¹Ñ…­”¹Ñ•ÍĞ¹µ©Ìˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°(€€‰ÕÑ˜àˆ(¤ì)™½È€¡½¹ÍĞ•Ù¥‘•¹•9…µ”½˜l(€€‰…±°Ñ¡É•”…ÕÑ¡½É¥é•¥¹Ñ…­”Á…Ñ¡ÌÉ•…Ñ”Í•ÉÙ¥”É•ÅÕ•ÍÑÌˆ°(€€‰Ñ¡”¥¹Ñ…­”™½Õ¹‘…Ñ¥½¸É•ÅÕ¥É•Ì…±°•¥¡Ğ…ÕÑ¡½É¥é•…¹Íİ•ÉÌˆ°(€€‰¥¹¥Ñ¥…°ÕÍÑ½µ•È…ÁÑÕÉ”É•ÕÍ•Ì„Ñ•¹…¹ĞÕÍÑ½µ•È…¹¥Í½±…Ñ•ÌÑ•¹…¹ÑÌˆ°(€€‰…ÕÑ¡½É¥é•Á½ÉÑ…°ÕÍ•ÉÌÉ•…Ñ”¥¹Ñ…­”İ¡¥±”‘•¹¥•ÕÍ•ÉÌ…¹¹½ĞµÕÑ…Ñ”ÍÑ…Ñ”ˆ°(€€‰…ÁÁÉ½Ù•ÁÕ‰±¥Œ¥¹Ñ…­”¥¹Ñ•É…Ñ•ÌÑ¡É½Õ Ñ¡”Í•ÕÉ”Á½ÉÑ…°…±±½İ±¥ÍĞˆ)t¤ì(€¥˜€ …¥¹Ñ…­•Q•ÍÑM½ÕÉ”¹¥¹±Õ‘•Ì¡•Ù¥‘•¹•9…µ”¤¤ì(€€€Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÀÈ•Ù¥‘•¹”è€‘í•Ù¥‘•¹•9…µ•õ€¤ì(€ô)ô()½¹ÍĞÕ¥‘•‘%¹Ñ…­•M½ÕÉ”€ô…İ…¥ĞÉ•…‘¥±” (€¹•ÜUI0 ˆ¸¸½ÍÉŒ½¥¹Ñ…­”½Õ¥‘•µ¥¹Ñ…­”¹µ©Ìˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°(€€‰ÕÑ˜àˆ(¤ì)™½È€¡½¹ÍĞÉ•ÅÕ¥É•‘	½Õ¹‘…Éä½˜l(€€‰AI%5Ie}EUMQ%=9Lˆ°(€€‰ÍÑ…ÉÑÕÑ¡½É¥é•ˆ°(€€‰…¹Íİ•ÉÕÑ¡½É¥é•ˆ°(€€‰É•ÍÕµ•ÕÑ¡½É¥é•ˆ°(€€‰…ÑÑ…¡5•‘¥…ÕÑ¡½É¥é•ˆ°(€€‰½µÁ±•Ñ•ÕÑ¡½É¥é•ˆ°(€€Á•Éµ¥ÍÍ¥½¸è€‰¥¹Ñ…­”¹É•…Ñ”ˆœ°(€€Á•Éµ¥ÍÍ¥½¸è€‰¥¹Ñ…­”¹É•…ˆœ°(€€ÍÑ…ÑÕÌè€‰É•…‘äµ™½Èµ‰ÀÀÀĞˆœ°(€€Ñ…É•ÑA…­…”è€‰Q9µ	@´ÀÀĞˆœ°(€€œ‰Á¡½Ñ¼ˆ°€‰Ù½¥”µ¹½Ñ”ˆœ°(€€‰½É¥¥¹…±Ù¥‘•¹”ˆ°(€€‰…Õ‘¥ÑÙ•¹Ñ%‘Ìˆ)t¤ì(€¥˜€ …Õ¥‘•‘%¹Ñ…­•M½ÕÉ”¹¥¹±Õ‘•Ì¡É•ÅÕ¥É•‘	½Õ¹‘…Éä¤¤ì(€€€Ñ¡É½Ü¹•ÜÉÉ½È¡	@´ÀÀÌÕ¥‘•µ¥¹Ñ…­”‰½Õ¹‘…Éä¥Ìµ¥ÍÍ¥¹œè€‘íÉ•ÅÕ¥É•‘	½Õ¹‘…Éåõ€¤ì(€ô)ô()½¹ÍĞÕ¥‘•‘%¹Ñ…­•Q•ÍÑM½ÕÉ”€ô…İ…¥ĞÉ•…‘¥±” (€¹•ÜUI0 ˆ¸¸½Ñ•ÍÑÌ½Õ¥‘•µ¥¹Ñ…­”¹Ñ•ÍĞ¹µ©Ìˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°(€€‰ÕÑ˜àˆ(¤ì)™½È€¡½¹ÍĞ•Ù¥‘•¹•9…µ”½˜l(€€‰É•Á…¥È°•ÍÑ¥µ…Ñ”°…¹½Ñ¡•ÈµÍ•ÉÙ¥”Á…Ñ¡ÌÁÉ½‘Õ”	@´ÀÀĞµÉ•…‘äÉ•½É‘Ìˆ°(€€‰½¹”µ…Ğµ„µÑ¥µ”ÅÕ•ÍÑ¥½¹Ì•¹™½É”…‘…ÁÑ¥Ù”…¹½¹‘¥Ñ¥½¹…°É•ÅÕ¥É•µ•¹ÑÌˆ°(€€‰•Ù•Éä…¹Íİ•È…ÕÑ½Í…Ù•Ì…¹„Í•ÍÍ¥½¸É•ÍÕµ•Ì…ĞÑ¡”¹•áĞÅÕ•ÍÑ¥½¸ˆ°(€€‰Á¡½Ñ¼…¹Ù½¥”µ¹½Ñ”É•™•É•¹•ÌÉ•µ…¥¸¥µµÕÑ…‰±”½É¥¥¹…°•Ù¥‘•¹”ˆ°(€€‰Ñ•¹…¹Ğ…¹É½±”•¹™½É•µ•¹ĞÁÉ•Ù•¹ĞÕ¹…ÕÑ¡½É¥é•Õ¥‘•µ¥¹Ñ…­”µÕÑ…Ñ¥½¸ˆ°(€€‰½µÁ±•Ñ•É•½É‘ÌÉ•Ñ…¥¸ÕÍ•È°Í½ÕÉ”°Ñ¥µ•ÍÑ…µÁÌ°…¹Ù…±¥…Õ‘¥Ğ¡¥ÍÑ½Éäˆ)t¤ì(€¥˜€ …Õ¥‘•‘%¹Ñ…­•Q•ÍÑM½ÕÉ”¹¥¹±Õ‘•Ì¡•Ù¥‘•¹•9…µ”¤¤ì(€€€Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ	@´ÀÀÌ•Ù¥‘•¹”è€‘í•Ù¥‘•¹•9…µ•õ€¤ì(€ô)ô()½¹ÍĞ•¹Ù¥É½¹µ•¹Ğ€ô…İ…¥ĞÉ•…‘¥±” (€¹•ÜUI0 ˆ¸¸¼¹•¹Ø¹•á…µÁ±”ˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°(€€‰ÕÑ˜àˆ(¤ì()™½È€¡½¹ÍĞ¹…µ”½˜l(€€‰5MM}IU9Q%5}9Xˆ°(€€‰5MM}Q	M}UI0ˆ°(€€‰5MM}A1=e59Q}QIPˆ)t¤ì(€¥˜€ …•¹Ù¥É½¹µ•¹Ğ¹¥¹±Õ‘•Ì¡€‘í¹…µ•ôõ€¤¤ì(€€€Ñ¡É½Ü¹•ÜÉÉ½È¡5¥ÍÍ¥¹œ•¹Ù¥É½¹µ•¹Ğ‘•±…É…Ñ¥½¸è€‘í¹…µ•õ€¤ì(€ô)ô()ÑÉäì(€…İ…¥Ğ…•ÍÌ¡¹•ÜUI0 ˆ¸¸¼¹•¹Øˆ°¥µÁ½ÉĞ¹µ•Ñ„¹ÕÉ°¤°½¹ÍÑ…¹ÑÌ¹}=,¤ì(€Ñ¡É½Ü¹•ÜÉÉ½È ‰É•…°€¹•¹Ø™¥±”µÕÍĞ¹½Ğ‰”½µµ¥ÑÑ•¸ˆ¤ì)ô…Ñ €¡•ÉÉ½È¤ì(€¥˜€¡•ÉÉ½È¹½‘”€„ôô€‰9=9Pˆ¤ì(€€€Ñ¡É½Ü•ÉÉ½Èì(€ô)ô()ÁÉ½•ÍÌ¹ÍÑ‘½ÕĞ¹İÉ¥Ñ” ‰…¹½¹¥…°	@´ÀÀÀÑ¡É½Õ 	@´ÀÄÄÉ•Á½Í¥Ñ½ÉäÙ…±¥‘…Ñ¥½¸Á…ÍÍ•¹q¸ˆ¤ì(