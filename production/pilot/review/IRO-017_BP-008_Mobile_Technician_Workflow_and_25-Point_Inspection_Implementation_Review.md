# IRO-017: TNGD-BP-008 — Mobile Technician Workflow and 25-Point Inspection — Independent Implementation Review

| Field | Value |
|---|---|
| Review Order | IRO-017 |
| Reviewer | Claude (Architecture Protection) |
| Scope | BP-008 complete implementation — field workflow, 25-Point Inspection, diagnostic report, media references, sharing, download, exceptions, BP-009 handoff |
| Canonical Review Head | `5c750f9` |
| Original Artifact Commit | `2d07a03910d07b9c6aa3b455719faa18ce115b76` (incomplete — omitted executable files) |
| Recovery Commit (BP-008.1) | `5a07b8fad9e83973b364dc8cc40c04b7bcd0a0c8` (complete canonical implementation) |
| BP-007 Extension | `listHandoffsAuthorized` read-only handoff listing added to `dispatch-service.mjs` |
| Review Date | 2026-08-15 |

## Provenance Note

The original artifact commit `2d07a03` contained BP-008 documentation and build/validator edits but omitted the executable implementation (`src/field-workflow/`, tests, migration reference, foundation/build updates). BP-008.1 (LCO) recovered the exact validated stash-backed files at commit `5a07b8f`. The recovery report confirms both stash blobs agreed, documents matched byte-for-byte, and both working-candidate and clean-tree gates passed 74 tests. This review examines the complete canonical state including the recovery.

## Artifacts Reviewed

| Artifact | Path | Lines |
|---|---|---|
| Field Workflow Service | `src/field-workflow/field-workflow-service.mjs` | 268 |
| Field Workflow Index | `src/field-workflow/index.mjs` | 2 |
| Field Workflow Manifest | `src/field-workflow/manifest.mjs` | 14 |
| Field Workflow Tests | `tests/field-workflow.test.mjs` | 161 |
| Dispatch Service (BP-007 extension) | `src/dispatch/dispatch-service.mjs` | 49 |
| Foundation | `src/foundation.mjs` | 96 |
| Foundation Tests | `tests/foundation.test.mjs` | 84 |
| Inspection Template and Validation Rules | `docs/bp008/INSPECTION_TEMPLATE_AND_VALIDATION_RULES.md` | 29 |
| Mobile Workflow and State Rules | `docs/bp008/MOBILE_WORKFLOW_AND_STATE_RULES.md` | 17 |
| Diagnostic Report and Media Contract | `docs/bp008/DIAGNOSTIC_REPORT_AND_MEDIA_CONTRACT.md` | 9 |
| Permission Matrix | `docs/bp008/PERMISSION_MATRIX.md` | 13 |
| Domain and Data Model | `docs/bp008/DOMAIN_AND_DATA_MODEL.md` | 9 |
| API Inventory | `docs/bp008/API_INVENTORY.md` | 25 |
| Audit and Event Model | `docs/bp008/AUDIT_AND_EVENT_MODEL.md` | 5 |
| Revision Log | `docs/bp008/REVISION_LOG.md` | 3 |
| Migration Reference | `migrations/TNGD-BP-008_REFERENCE.md` | 7 |
| Completion Report | `production/pilot/review/TNGD-BP-008_Completion_Report.md` | 56 |
| BP-008.1 Recovery Order | `production/pilot/review/TNGD-BP-008.1_Canonical_Artifact_Completeness_Recovery.md` | 72 |
| BP-008.1 Recovery Report | `production/pilot/review/TNGD-BP-008.1_Canonical_Artifact_Completeness_Recovery_Report.md` | 50 |
| Work Order | `production/pilot/review/TNGD-BP-008_Mobile_Technician_Workflow_and_25-Point_Inspection.md` | 317 |
| Canonical Validator | `scripts/validate-repository.mjs` | — |

## Gate Results

| Gate | Result |
|---|---|
| `npm run check` (full) | **BLOCKED** — build fails on BP-011 `invoice-payment-service.mjs` binary corruption (SyntaxError at line 9). This is a BP-011 manufacturing defect, not a BP-008 issue. |
| BP-000–BP-008 direct test run | **77/77 tests passed**, 0 failed/skipped/cancelled |
| BP-000–BP-007 regression | All 64 prior tests passing |
| BP-008 tests | All 13 tests passing |
| Forbidden scope scan | No `createRepairAuthorized`, `createEstimateAuthorized`, `processPaymentAuthorized`, `warrantyDeterminationAuthorized`, or `authorizeCustomerAuthorized` methods on FieldWorkflowService |

### BP-011 Build Blocker Detail

`src/invoicing/invoice-payment-service.mjs` contains binary corruption starting at line 9 (`Ta׍…` followed by non-UTF8 bytes). The `SyntaxError: Private field '#permit' must be declared` prevents module loading. Because `scripts/build.mjs` imports all package manifests through BP-011, the full `npm run check` gate cannot pass at current HEAD. This does NOT affect BP-008 functionality — BP-008 tests run successfully without the build step. The BP-011 corruption requires a separate manufacturing correction.

## Independent Boundary Probes

51 probes executed independently of the test suite. All 51 passed.

### Probe 1 — Assigned-technician-only access (4 probes)

Unassigned technician sees empty today view. Unassigned technician cannot open a field session (`not authorized`). Unassigned technician cannot transition a session (`not authorized`). Dispatcher cannot open a field session (`not authorized` / `Access denied`).

### Probe 2 — Today, current, and next views (4 probes)

Today view shows 1 assigned job. Current view is empty before first transition. After `en-route`, current view shows 1 job. Invalid view name (`all`) is rejected.

### Probe 3 — Governed field-status transitions (7 probes)

Cannot skip from `ready-for-field-execution` to `arrived`, `in-progress`, or `field-complete`. Pause and resume work from `in-progress`. `field-complete` transition succeeds. Idempotent re-transition returns same session.

### Probe 4 — One resumable inspection per visit (1 probe)

Second `startInspectionAuthorized` call returns the same inspection (same ID).

### Probe 5 — Result enforcement (3 probes)

Invalid result (`Needs Repair`) rejected with governed error. Unknown component ID rejected. `Does Not Apply` accepted as valid result.

### Probe 6 — Service type enforcement (2 probes)

Repair without inspection is rejected (`Repair requires`). Estimate without inspection succeeds with `inspectionPerformed: false`.

### Probe 7 — Required-evidence submission blocking (2 probes)

Missing item results block submission (`Every inspection component`). Missing door details block submission after items recorded (`door details`).

### Probe 8 — Immutable submitted evidence (3 probes)

Submitted report has `immutable: true`. Attempt to modify submitted inspection throws (`immutable`). Re-submission returns the same report object.

### Probe 9 — Diagnostic report sharing and downloading (4 probes)

Share token is a non-empty string. Shared report excludes internal-only notes. Invalid share token is rejected (`not found`). Download returns `application/json` media type.

### Probe 10 — Media references without binary duplication (3 probes)

Media reference does not store `base64` field even when passed. Duplicate asset+category pair returns existing inspection (not added). Non-image MIME type (`application/pdf`) is rejected.

### Probe 11 — BP-009-ready handoff (5 probes)

Handoff `targetPackage` is `TNGD-BP-009`. Handoff `action` is `repair-or-estimate-pending`. No `repairId`, `estimateId`, or `invoiceId` in handoff.

### Probe 12 — No BP-009+ behavior (5 probes)

FieldWorkflowService has none of: `createRepairAuthorized`, `createEstimateAuthorized`, `processPaymentAuthorized`, `warrantyDeterminationAuthorized`, `authorizeCustomerAuthorized`.

### Probe 13 — Exception handling (4 probes)

Exception preserves previous field status (`en-route`). Exception captures evidence revision (> 0). Exception status is `returned-to-administration`. Administrative view retains service case reference.

### Probe 14 — Audit chain integrity (1 probe)

`auditLog.verify()` returns `true` after full lifecycle.

### Probe 15 — Execution handoff (3 probes)

`executionHandoffAuthorized` returns diagnostic report ID, finding IDs array, and no repair/estimate data.

## Requirement Verification

### R1: Assigned-technician-only access

**VERIFIED.** Every field operation calls `this.#assigned()` (line 52) which delegates to `dispatch.handoffAuthorized()`, enforcing `jobs.assigned.read` permission, technician role, dispatched status, and identity match. `listJobsAuthorized` (line 84) calls `dispatch.listHandoffsAuthorized()` which filters to the calling technician's dispatched assignments. Independent probes confirm unassigned technicians and dispatchers are denied.

### R2: Today, current, and next job views

**VERIFIED.** `listJobsAuthorized` (lines 84–96) implements three views: `today` filters to current date via `day()`, `current` filters to `ACTIVE_STATES` (en-route, arrived, in-progress, paused, field-complete), `next` filters to future `ready-for-field-execution` and takes first. Invalid views are rejected (line 85). Views consume BP-007 handoffs without creating or altering assignments.

### R3: Governed field-status transitions

**VERIFIED.** `TRANSITIONS` constant (lines 18–26) defines the exact valid transitions. `transitionAuthorized` (line 113) validates against this map and throws on invalid transitions. Idempotent re-transition returns existing session (line 112). Lifecycle: `ready-for-field-execution → en-route → arrived → in-progress ⇄ paused → field-complete`. Submission via `submitAuthorized` only — no direct transition to `submitted`.

### R4: One resumable inspection per assigned visit

**VERIFIED.** `startInspectionAuthorized` (line 121) checks `#inspectionBySession` Map — existing inspection is returned without creating a new one. Inspection is keyed by session ID, not inspection ID, ensuring one per visit.

### R5: Does Not Apply, Pass, Flag, and Fail result enforcement

**VERIFIED.** `ITEM_RESULTS` constant (line 10) defines exactly four valid results. `recordItemAuthorized` (line 133) validates against this set. `#validateInspection` (line 73) requires all 19 components to have exactly one governed result. Independent probe confirms `Needs Repair` is rejected and `Does Not Apply` is accepted.

### R6: Required inspection for Garage Door Repair | Service

**VERIFIED.** `submitAuthorized` (line 186): `if (session.serviceType === "repair" && !inspection) throw new Error("Repair requires the 25-Point Inspection.")`. Template declares `requiredFor: ["repair"]` (line 39). Independent probe confirms.

### R7: Optional inspection for New Garage Door Estimate

**VERIFIED.** `submitAuthorized` passes through when `serviceType !== "repair"` and no inspection exists — `inspection` is `null`, and the `#validateInspection` call is skipped (line 187: `if (inspection) this.#validateInspection(inspection)`). Report sets `inspectionPerformed: false`. Template declares `optionalFor: ["estimate"]` (line 39). Independent probe confirms.

### R8: Required-evidence submission blocking

**VERIFIED.** `#validateInspection` (lines 72–77) enforces: all 19 component results present, complete door details, before AND after photograph references, sticker/warranty disclosure confirmation, and referral card confirmation. Missing any blocks submission. Independent probes confirm sequential blocking at each evidence gate.

### R9: Immutable submitted inspection evidence

**VERIFIED.** `submitAuthorized` (line 189) creates a new frozen inspection with `status: "submitted"`. `#mutableInspection` (line 61) rejects modifications to submitted inspections. Report has `immutable: true`. Re-submission returns the same report (line 183). Independent probes confirm.

### R10: Customer-safe diagnostic report sharing and downloading

**VERIFIED.** `shareDiagnosticReportAuthorized` (line 213) generates a `randomBytes(24)` share token. `sharedDiagnosticReport` (line 217) returns the report via token lookup — no authentication required. Report's `customerNotes` (line 191) filters to `visibility: "customer"` only — internal notes are excluded. `downloadDiagnosticReportAuthorized` (line 222) returns `application/json` content. Independent probes confirm internal notes excluded and invalid tokens rejected.

### R11: Governed media references without binary duplication

**VERIFIED.** `attachMediaReferenceAuthorized` (line 165) stores only `category`, `assetId`, `mimeType`, `capturedBy`, `capturedAt`. No binary content is stored — `base64` parameter is ignored (not destructured). Duplicate detection by `assetId + category` (line 169). Only `image/*` MIME types accepted (line 168). Independent probes confirm.

### R12: BP-009-ready handoff

**VERIFIED.** `submitAuthorized` (lines 199–201) creates handoff with `targetPackage: "TNGD-BP-009"`, `serviceCaseId`, `fieldSessionId`, `diagnosticReportId`, `findingItemIds`, and `action: "repair-or-estimate-pending"`. `executionHandoffAuthorized` (lines 226–237) provides a structured handoff with diagnostic report reference, finding/measurement/media IDs, and source revision. No repair, estimate, authorization, or invoice content.

### R13: No repair, estimate, authorization, invoice, payment, warranty, or detailed door-order implementation

**VERIFIED.** FieldWorkflowService has no methods for repair creation, estimate execution, customer authorization, invoicing, payment processing, or warranty determination. Handoff contains references only. No detailed garage-door order form. Manifest confirms `handoffTarget: "TNGD-BP-009"` and `media: "references-only"`. Independent probes confirm absence of all forbidden methods.

### R14: BP-000 through BP-007 regression safety

**VERIFIED.** 77/77 tests pass directly (BP-000 through BP-008). All 64 prior package tests remain green. Foundation test confirms packages `TNGD-BP-000` through `TNGD-BP-011` in the implemented list (reflecting the current canonical state which includes BP-009–BP-011 foundation metadata).

## Findings

### Finding 1: BP-011 `invoice-payment-service.mjs` Binary Corruption (NON-BP-008)

**Severity:** Blocking for full `npm run check` gate; not a BP-008 defect.

The file `src/invoicing/invoice-payment-service.mjs` contains binary corruption starting at line 9 (`SyntaxError: Private field '#permit' must be declared`). Because `scripts/build.mjs` imports all manifests through BP-011, the full gate cannot pass. BP-008 tests pass when run directly. This requires a separate BP-011 manufacturing correction (LCO or re-manufacture).

**Recommendation:** The BP-011 file corruption should be reported as an Executive Attention item. It does not affect BP-008 acceptance but blocks the full canonical gate for all packages.

### Finding 2: "25-Point" Name vs. 19-Component Template

**Severity:** Observation (not a defect).

The diagnostic is named "25-Point Inspection" but contains 19 itemized component checks. This is the correct TNGD operational naming — the branded inspection historically counts 25 verification activities including the 6 operational-evidence fields (notes, quantity, spring ID, door size, spring type, ground level). The documentation explicitly states "The source checklist contains 19 itemized component checks" with the remainder being operational evidence. No correction needed.

## Disposition

**ACCEPTED — No BP-008 defects.**

All 14 verification requirements are satisfied. 77/77 BP-000–BP-008 tests pass. 51/51 independent boundary probes pass. BP-008 implementation is complete and correct. The BP-011 binary corruption is a separate manufacturing defect requiring its own correction.

BP-008 is ready for Executive Acceptance, contingent on acknowledgment that the full `npm run check` gate is blocked by the BP-011 file corruption (which is independent of BP-008 scope).

No later package has been activated or manufactured by this review.
