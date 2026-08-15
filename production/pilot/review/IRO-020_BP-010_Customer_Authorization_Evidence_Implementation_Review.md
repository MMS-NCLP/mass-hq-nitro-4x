# IRO-020: TNGD-BP-010 — Customer Authorization Evidence — Independent Implementation Review

| Field | Value |
|---|---|
| Review Order | IRO-020 |
| Reviewer | Claude (Architecture Protection) |
| Scope | BP-010 complete implementation — authorization request, immutable snapshot, adult acknowledgment, signature evidence, decision lifecycle, amendment, revocation, customer-safe receipt, BP-011 financial handoff |
| Canonical Review Head | `03ec4e6` |
| Artifact Commit | `5fe1ef2f7775425431233044a14e2120a77bd1e9` |
| Activation Commit | `bf7f8d3264b7f9e5f1df040542f13a1cc129c004` |
| Review Date | 2026-08-15 |

## Artifacts Reviewed

| Artifact | Path | Lines |
|---|---|---|
| Customer Authorization Service | `src/customer-authorization/customer-authorization-service.mjs` | 14 |
| Customer Authorization Index | `src/customer-authorization/index.mjs` | 1 |
| Customer Authorization Manifest | `src/customer-authorization/manifest.mjs` | 1 |
| Customer Authorization Tests | `tests/customer-authorization.test.mjs` | 14 |
| Foundation | `src/foundation.mjs` | 117 |
| Docs: Domain Model | `docs/bp010/DOMAIN_AND_DATA_MODEL.md` | — |
| Docs: API Inventory | `docs/bp010/API_INVENTORY.md` | — |
| Docs: Permission Matrix | `docs/bp010/PERMISSION_MATRIX.md` | — |
| Docs: Lifecycle Rules | `docs/bp010/LIFECYCLE_AND_BUSINESS_RULES.md` | — |
| Docs: Audit Model | `docs/bp010/AUDIT_AND_EVENT_MODEL.md` | — |
| Docs: Revision Log | `docs/bp010/REVISION_LOG.md` | — |
| Migration Reference | `migrations/TNGD-BP-010_REFERENCE.md` | — |
| Completion Report | `production/pilot/review/TNGD-BP-010_Completion_Report.md` | 43 |
| Work Order | `production/pilot/review/TNGD-BP-010_Customer_Authorization_Evidence.md` | — |

## Gate Results

| Gate | Result |
|---|---|
| `npm run check` (full) | **BLOCKED** — `validate-repository.mjs` and `invoice-payment-service.mjs` binary corruption from BP-011 commit `a2ae0b8` |
| BP-000 through BP-010 direct test run | **97/97 tests passed**, 0 failed/skipped/cancelled |
| BP-000 through BP-009 regression | All 87 prior tests passing |
| BP-010 tests | All 10 tests passing |
| Forbidden scope scan | No `createInvoiceAuthorized`, `processPaymentAuthorized`, `storeCardAuthorized`, `determineWarrantyAuthorized` on CustomerAuthorizationService |

### Full Gate Blocker

Both `validate-repository.mjs` and `invoice-payment-service.mjs` are corrupted at canonical HEAD. The validator at BP-010 manufacture (`5fe1ef2`) contained 11 non-ASCII bytes (line 285, inside string literals) but remained syntactically valid (`node --check` passed). The severe corruption breaking execution was introduced by BP-011 commit `a2ae0b8`.

## Independent Boundary Probes

52 probes executed independently of the test suite. All 52 passed.

### Probe 1 — Authorization binds immutable BP-009 version (7 probes)

Version ID bound to `version-1`. Snapshot is immutable. Price computed from line items (45000). Diagnostic report reference preserved. Content hash is 64-character SHA-256. Scope contains recommendations. Line items preserved.

### Probe 2 — Idempotent request without token replay (4 probes)

Repeat request returns same ID. First call provides transaction token. Replay returns `transactionToken: null`. Replay flag `replayed: true`.

### Probe 3 — Adult acknowledgment and signature evidence (4 probes)

`adultAcknowledged: false` rejected ("18 or older"). Approval without signature rejected ("signature"). Approval with signature succeeds. Decision is `immutable: true`.

### Probe 4 — Prohibited authorizers (4 probes)

Employee, technician, and AI approver types rejected ("cannot authorize"). Unauthenticated call (no token) rejected ("transaction access").

### Probe 5 — Requester self-authorization prevention (1 probe)

Approver identity matching `requestedBy` is rejected ("cannot authorize").

### Probe 6 — Immutable decisions and retry safety (2 probes)

Same idempotency key returns same decision object. Different idempotency key after decision rejected ("immutable").

### Probe 7 — Expired requests reject decisions (1 probe)

Decision after expiry rejected ("expired").

### Probe 8 — Revocation preserves evidence (4 probes)

Revoked request has `status: "revoked"`. Original decision `decision: "approved"` unchanged. Revocation carries reason. Idempotent second revoke returns revoked state.

### Probe 9 — Amendment requires new version (1 probe)

Amendment with same version ID rejected ("new immutable").

### Probe 10 — Customer-safe receipt (5 probes)

Receipt has `customerSafe: true`. No `transactionToken` field. No `history` field. Content hash matches snapshot. Price preserved.

### Probe 11 — BP-011 financial handoff (7 probes)

Handoff without prior approval rejected ("approved"). After approval: `targetPackage: "TNGD-BP-011"`, `status: "authorization-confirmed"`. No `invoiceId` or `paymentId`. `authorizedAmountCents: 45000`. Content hash matches snapshot.

### Probe 12 — Tenant isolation and role enforcement (2 probes)

Technician read denied ("permission"). Cross-tenant access denied ("tenant").

### Probe 13 — Audit chain integrity (2 probes)

`auditLog.verify()` returns `true` after full lifecycle. History has events.

### Probe 14 — No BP-011+ implementation (4 probes)

`createInvoiceAuthorized`, `processPaymentAuthorized`, `storeCardAuthorized`, `determineWarrantyAuthorized` all absent.

### Probe 15 — Manifest integrity (4 probes)

Work order ID is `TNGD-BP-010`. Handoff target is `TNGD-BP-011`. Consumes `TNGD-BP-001`, `TNGD-BP-004`, `TNGD-BP-009`. In-memory persistence boundary.

## Requirement Verification

### R1: Authorization request and presentation

**VERIFIED.** `createRequestAuthorized` binds one immutable BP-009 version, validates version status (`finalized`), confirms `currentVersionId` match, and requires a pending BP-010 authorization package. It creates a frozen snapshot of the complete presented scope.

### R2: Authorized-adult acknowledgment

**VERIFIED.** `decide()` requires `adultAcknowledged: true`. Passing `false` throws "Approver must acknowledge being an authorized adult age 18 or older." This is a hard gate, not a soft field.

### R3: Scope, price, terms, and disclosure snapshot

**VERIFIED.** The snapshot includes `scope` (recommendations), `lineItems`, `priceCents` (computed from line item totals), `terms`, `disclosures`, and `diagnosticReportId`. The snapshot is frozen with `immutable: true` and has a SHA-256 `contentHash`.

### R4: Signature or approved equivalent evidence

**VERIFIED.** `decide()` with `decision: "approved"` requires non-empty `signatureEvidence`. Approval without signature throws "Approval requires signature or approved equivalent evidence."

### R5: Approval, decline, expiration, and revocation lifecycle

**VERIFIED.** Decisions support `approved` and `declined`. Expired requests (past `expiresAt`) reject new decisions. Approved requests can be revoked via `revoke()` with a required reason. Status transitions: `presented → approved/declined/expired`, `approved → revoked`.

### R6: Employee, technician, AI, and requester exclusion

**VERIFIED.** `decide()` rejects `approverType` values `employee`, `technician`, and `ai` with "Employees, technicians, AI, and requesters cannot authorize for the customer." Self-authorization prevention: `approverIdentity === request.requestedBy` also rejected. Only `customer` and `authorized-adult` types are accepted.

### R7: Amendment and reauthorization

**VERIFIED.** `amendAuthorized` requires a new `versionId` (different from prior request). Same version rejected with "Amendment requires a reason and new immutable BP-009 version." Creates a new request with `amendment.previousRequestId` reference. Prior request status set to `superseded`.

### R8: Customer-safe authorization receipt

**VERIFIED.** `receipt()` returns a frozen receipt with `customerSafe: true`. Receipt excludes `transactionToken` and `history`. Includes content hash, template name, scope, line items, price, terms, and disclosures.

### R9: Audit history and BP-011-ready handoff

**VERIFIED.** History accessible via `historyAuthorized`. Handoff via `financialHandoffAuthorized` requires `decision: "approved"` and `status: "approved"`. Handoff includes `targetPackage: "TNGD-BP-011"`, authorization IDs, snapshot ID, record/version IDs, `authorizedAmountCents`, content hash, and `status: "authorization-confirmed"`. No invoice or payment data.

### R10: Immutable decision evidence

**VERIFIED.** Decisions are frozen with `immutable: true`. Idempotent replay with same idempotency key returns same object. Different idempotency key after existing decision throws "Accepted and declined authorization evidence is immutable."

### R11: Transaction-scoped access

**VERIFIED.** All customer-facing operations (`decide`, `revoke`, `receipt`) require a valid transaction token. Invalid or missing tokens throw "Governed transaction access is required/invalid." Token is SHA-256 hashed internally (`tokenHash`). Token is never replayed on idempotent request replay.

### R12: BP-000 through BP-009 regression safety

**VERIFIED.** 97/97 tests pass across BP-000 through BP-010. All 87 predecessor tests remain green.

## Findings

### Finding 1: `validate-repository.mjs` Non-ASCII Byte Introduction (Manufacturing Artifact)

**Severity:** Observation (does not affect BP-010 functionality or acceptance).

The BP-010 manufacture at `5fe1ef2` introduced 11 non-ASCII bytes into `validate-repository.mjs` at line 285 (inside string literal content). The file remains syntactically valid (`node --check` passes). The BP-011 commit (`a2ae0b8`) subsequently introduced severe corruption at line 273 that breaks execution. The non-ASCII bytes at BP-010 are a manufacturing artifact — not a functional defect, but evidence that the encoding environment produced impure output.

**Localized Correction:** No separate BP-010 LCO is warranted. The BP-011.1 recovery should restore the validator from a clean pre-corruption state, which will also remove the BP-010-era byte artifacts.

## Disposition

**ACCEPTED — No functional defects.**

All 12 requirements verified. 97/97 BP-000–BP-010 tests pass. 52/52 independent boundary probes pass. BP-010 correctly binds immutable BP-009 versions, enforces adult acknowledgment, captures signature evidence, prevents employee/technician/AI/self-authorization, manages decision lifecycle with immutable evidence, supports amendment and revocation, produces customer-safe receipts, and creates reference-only BP-011 financial handoffs.

BP-010 is ready for Executive Acceptance. The validator non-ASCII bytes are a manufacturing artifact requiring no separate correction; the BP-011.1 recovery will restore the validator from clean provenance.
