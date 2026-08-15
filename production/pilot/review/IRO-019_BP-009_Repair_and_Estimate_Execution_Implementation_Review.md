# IRO-019: TNGD-BP-009 — Repair and Estimate Execution — Independent Implementation Review

| Field | Value |
|---|---|
| Review Order | IRO-019 |
| Reviewer | Claude (Architecture Protection) |
| Scope | BP-009 complete implementation — repair and estimate templates, draft lifecycle, diagnostic references, recommendations, options, line items, outcomes, estimate conversion, BP-010 authorization package |
| Canonical Review Head | `03ec4e6` |
| Artifact Commit | `fea8086cabca6ac684221777f8e26f158814f0dd` |
| Reactivation Commit | `a2c1c696c31aac22c6952e8ab9173700b1237963` |
| Review Date | 2026-08-15 |

## Artifacts Reviewed

| Artifact | Path | Lines |
|---|---|---|
| Repair Estimate Service | `src/repair-estimate/repair-estimate-service.mjs` | 27 |
| Repair Estimate Index | `src/repair-estimate/index.mjs` | 2 |
| Repair Estimate Manifest | `src/repair-estimate/manifest.mjs` | 8 |
| Repair Estimate Tests | `tests/repair-estimate.test.mjs` | 15 |
| Foundation | `src/foundation.mjs` | 117 |
| Docs: Domain Model | `docs/bp009/DOMAIN_AND_DATA_MODEL.md` | — |
| Docs: API Inventory | `docs/bp009/API_INVENTORY.md` | — |
| Docs: Permission Matrix | `docs/bp009/PERMISSION_MATRIX.md` | — |
| Docs: Lifecycle Rules | `docs/bp009/LIFECYCLE_AND_BUSINESS_RULES.md` | — |
| Docs: Audit Model | `docs/bp009/AUDIT_AND_EVENT_MODEL.md` | — |
| Docs: Revision Log | `docs/bp009/REVISION_LOG.md` | — |
| Migration Reference | `migrations/TNGD-BP-009_REFERENCE.md` | — |
| Completion Report | `production/pilot/review/TNGD-BP-009_Completion_Report.md` | 42 |
| Work Order | `production/pilot/review/TNGD-BP-009_Repair_and_Estimate_Execution.md` | — |

## Gate Results

| Gate | Result |
|---|---|
| `npm run check` (full) | **BLOCKED** — `validate-repository.mjs` and `invoice-payment-service.mjs` binary corruption from BP-011 commit `a2ae0b8` |
| BP-000 through BP-010 direct test run | **97/97 tests passed**, 0 failed/skipped/cancelled |
| BP-000 through BP-008 regression | All 77 prior tests passing |
| BP-009 tests | All 10 tests passing |
| Forbidden scope scan | No `authorizeCustomerAuthorized`, `createInvoiceAuthorized`, `processPaymentAuthorized`, `determineWarrantyAuthorized`, `createGarageDoorOrderAuthorized` on RepairEstimateService |

### Full Gate Blocker

Both `validate-repository.mjs` and `invoice-payment-service.mjs` are corrupted at canonical HEAD due to BP-011 commit `a2ae0b8`. The validator was clean at BP-009 manufacture (`fea8086`, verified 0 non-ASCII bytes). The corruption is a BP-010/BP-011 manufacturing defect, not a BP-009 issue. BP-009 tests run and pass without the build step.

## Independent Boundary Probes

57 probes executed independently of the test suite. All 57 passed.

### Probe 1 — Approved templates and standard items (5 probes)

Exactly two templates. Repair is "Garage Door Repair | Service" with `inspectionRequired: true`. Estimate is "New Garage Door Estimate" with `inspectionRequired: false`.

### Probe 2 — Repair requires submitted inspection (2 probes)

Repair without inspection handoff rejected (`requires`). Estimate without inspection succeeds with `kind: "estimate"`.

### Probe 3 — Idempotent draft with evidence references (5 probes)

Second draft call returns the same object. Customer ID, service case ID, diagnostic report ID, and finding item IDs preserved from BP-008 handoff.

### Probe 4 — Standard service and warranty items (6 probes)

Two standard items seeded. First is "25-Point Inspection" with "18 or older" adult authorization text. Second is warranty with coverage text. Both zero-cost. Both marked `standard: true`.

### Probe 5 — Recommendations bind BP-008 evidence (2 probes)

Invalid finding ID (`nonexistent`) rejected with `evidence` error. Valid finding ID (`component-01`) creates recommendation with `status: "recommended"`.

### Probe 6 — Governed line items (3 probes)

Negative amount rejected with `non-negative` error. Custom items marked `standard: false`. Amount preserved exactly.

### Probe 7 — Options restricted to estimates (1 probe)

Adding option to a repair record rejected with `estimate` error.

### Probe 8 — Immutable finalization and revision (6 probes)

Finalization sets `status: "finalized"`. Modification after finalization rejected (`immutable/Finalized`). Revision creates version 2 with `status: "draft"`. Version number incremented.

### Probe 9 — BP-010 authorization package (5 probes)

Unfinalized record rejected (`finalized`). Finalized record produces package with `targetPackage: "TNGD-BP-010"`, `status: "pending-authorization"`. No signature present. Adult minimum age 18.

### Probe 10 — Recommendation outcomes (5 probes)

"performed" without authorization evidence reference rejected. "declined", "deferred", "follow-up" accepted. "performed" with `authorizationEvidenceReferenceId` accepted.

### Probe 11 — Estimate conversion with lineage (5 probes)

Conversion is idempotent. Converted record has `kind: "repair"`. Customer and service case preserved. `convertedFromEstimateId` references original estimate.

### Probe 12 — Tenant isolation and role enforcement (2 probes)

Technician read denied (`permission`). Cross-tenant access denied (`tenant`).

### Probe 13 — Audit chain integrity (1 probe)

`auditLog.verify()` returns `true`.

### Probe 14 — No BP-010+ implementation (5 probes)

`authorizeCustomerAuthorized`, `createInvoiceAuthorized`, `processPaymentAuthorized`, `determineWarrantyAuthorized`, `createGarageDoorOrderAuthorized` all absent from service.

### Probe 15 — Manifest integrity (4 probes)

Work order ID is `TNGD-BP-009`. Handoff target is `TNGD-BP-010`. Consumes `TNGD-BP-003`, `TNGD-BP-004`, `TNGD-BP-008`. In-memory persistence boundary.

## Requirement Verification

### R1: Garage Door Repair | Service template

**VERIFIED.** `repairEstimateTemplates` exports exactly two templates. Repair template requires inspection (`inspectionRequired: true`). `createDraftAuthorized` with `templateName: "Garage Door Repair | Service"` creates a repair record only when `inspectionPerformed: true` from BP-008 handoff. Without inspection, the error "Garage Door Repair | Service requires a submitted 25-Point Inspection" is thrown.

### R2: New Garage Door Estimate template

**VERIFIED.** Estimate template does not require inspection (`inspectionRequired: false`). `createDraftAuthorized` succeeds with `inspectionPerformed: false`. Record has `kind: "estimate"`.

### R3: Repair and estimate draft lifecycle

**VERIFIED.** Drafts are created via `createDraftAuthorized` with idempotency key. Finalization via `finalizeVersionAuthorized` sets `status: "finalized"`. Finalized versions are immutable — modifications throw "Finalized estimate versions are immutable; create a revision." Revisions create new version objects with incremented `number`.

### R4: Diagnostic finding references

**VERIFIED.** `createDraftAuthorized` consumes `executionHandoffAuthorized()` from BP-008 field workflow and stores `diagnosticReportId`, `findingItemIds`, `measurementIds`, `mediaReferenceIds` in `source`. No raw diagnostic data is duplicated — only reference IDs.

### R5: Recommendations, options, and line items

**VERIFIED.** `addRecommendationAuthorized` validates finding IDs against BP-008 evidence references. `addLineItemAuthorized` requires non-negative integer amounts. `addOptionAuthorized` is restricted to estimate records only. All three create distinct frozen entities within the version.

### R6: Customer, company, and estimate metadata

**VERIFIED.** `createDraftAuthorized` preserves `customerId` and `serviceCaseId` from BP-008 handoff. Company profile is frozen at construction. `estimateMetadata` is accepted as a parameter.

### R7: Estimate-to-job conversion without duplicate records

**VERIFIED.** `convertEstimateAuthorized` creates a new repair record with `convertedFromEstimateId` lineage. Conversion is idempotent via idempotency key. Customer and service case are preserved, not duplicated. The conversion requires a finalized estimate and authorization evidence reference.

### R8: Performed, declined, deferred, and follow-up outcomes

**VERIFIED.** `recordOutcomeAuthorized` accepts exactly these four outcomes. "performed" requires `authorizationEvidenceReferenceId`. Other outcomes do not. The recommendation's `status` is updated to the outcome value.

### R9: Standard service and warranty line items

**VERIFIED.** `standardItems()` creates two frozen standard items: "25-Point Inspection" (with adult authorization disclosure) and "Standard Warranty" (two-year parts, 90-day service). Both are `amountCents: 0` and `standard: true`.

### R10: BP-010-ready authorization package

**VERIFIED.** `prepareAuthorizationPackageAuthorized` requires a finalized version. Creates a package with `targetPackage: "TNGD-BP-010"`, `status: "pending-authorization"`, `authorizedAdultMinimumAge: 18`, recommendation IDs, and line item IDs. No signature or authorization evidence.

### R11: No authorization, invoice, payment, warranty, or order implementation

**VERIFIED.** RepairEstimateService exposes no methods for customer authorization, invoice creation, payment processing, warranty determination, or garage door order forms. The BP-010 package is a reference-only handoff.

### R12: BP-000 through BP-008 regression safety

**VERIFIED.** 97/97 tests pass across all packages BP-000 through BP-010. All 77 predecessor tests remain green.

## Findings

No BP-009 defects found.

## Disposition

**ACCEPTED — No defects.**

All 12 requirements verified. 97/97 BP-000–BP-010 tests pass. 57/57 independent boundary probes pass. BP-009 correctly consumes BP-008 diagnostic handoff references, implements both approved templates with proper inspection governance, manages draft/finalize/revise lifecycle with version immutability, records explicit recommendation outcomes, converts estimates with lineage preservation, and prepares a reference-only BP-010 authorization package.

BP-009 is ready for Executive Acceptance. The full `npm run check` gate is blocked by BP-011 file corruption, which is independent of BP-009 scope.
