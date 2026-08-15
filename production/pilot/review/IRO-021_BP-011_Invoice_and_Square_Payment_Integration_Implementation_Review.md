# IRO-021: TNGD-BP-011 — Invoice and Square Payment Integration — Independent Implementation Review

| Field | Value |
|---|---|
| Review Order | IRO-021 |
| Reviewer | Claude (Architecture Protection) |
| Scope | BP-011 implementation — invoice draft and finalization, Square payment gateway, webhook processing, refund, customer access, BP-012 reconciliation handoff |
| Canonical Review Head | `03ec4e6` |
| Artifact Commit | `a2ae0b855d39893fd4798f360463adbff2954ced` |
| Activation Commit | `8000df144162bb4a63f0325180e9430d13f2cb87` |
| BP-011.1 Recovery LCO | Authorized at `03ec4e6` — **NOT YET MANUFACTURED** |
| Review Date | 2026-08-15 |

## Critical Finding: Dual Binary Corruption

BP-011 artifact commit `a2ae0b8` introduced binary corruption to **two** canonical files:

### 1. `src/invoicing/invoice-payment-service.mjs`

- Valid content through line 9 (`createDraftAuthorized` method, through `money(taxCents,"Ta`)
- Binary garbage from offset ~2,540: non-UTF8 bytes replacing the remainder of the service class
- `SyntaxError: Private field '#permit' must be declared in an enclosing class`
- Canonical blob: `1b359130` prefix, 2,733 bytes (corrupted)
- Validated blob: `12678ad4` prefix, 11,187 bytes (per BP-011.1 LCO)
- **Result:** Module cannot be loaded. All 11 BP-011 tests fail.

### 2. `scripts/validate-repository.mjs`

- Valid content through line 273 (`throw new Error("BP-003 manifest does not p` then binary garbage)
- `SyntaxError: Invalid or unexpected token`
- Corruption at BP-011 commit extends the 11 non-ASCII bytes introduced at BP-010 commit into severe structural damage
- **Result:** Repository validator cannot execute. Full `npm run check` gate blocked for all packages.

### Corruption Timeline

| Commit | `validate-repository.mjs` | `invoice-payment-service.mjs` |
|---|---|---|
| `5a07b8f` (BP-008.1) | Clean (0 non-ASCII) | N/A |
| `fea8086` (BP-009) | Clean (0 non-ASCII) | N/A |
| `5fe1ef2` (BP-010) | 11 non-ASCII bytes at line 285 (inside strings; syntactically valid) | N/A |
| `a2ae0b8` (BP-011) | Severe corruption at line 273 (SyntaxError) | Severe corruption at line 9 (SyntaxError) |

## Artifacts Reviewed

| Artifact | Path | Status |
|---|---|---|
| Invoice Payment Service | `src/invoicing/invoice-payment-service.mjs` | **CORRUPTED** — valid through line 9 only |
| Invoice Payment Index | `src/invoicing/index.mjs` | Valid (1 line) |
| Invoice Payment Manifest | `src/invoicing/manifest.mjs` | Valid (1 line) |
| Invoice Payment Tests | `tests/invoice-payment.test.mjs` | Valid (13 lines) — **CANNOT EXECUTE** |
| Docs: All 6 BP-011 documents | `docs/bp011/` | Present |
| Migration Reference | `migrations/TNGD-BP-011_REFERENCE.md` | Present |
| Completion Report | `production/pilot/review/TNGD-BP-011_Completion_Report.md` | Present |
| Work Order | `production/pilot/review/TNGD-BP-011_Invoice_and_Square_Payment_Integration.md` | Present |
| BP-011.1 Recovery LCO | `production/pilot/review/TNGD-BP-011.1_Canonical_Invoice_Payment_Service_Recovery_LCO.md` | Authorized |

## Gate Results

| Gate | Result |
|---|---|
| `npm run check` (full) | **FAILED** — validator and service both have SyntaxError |
| BP-011 tests | **FAILED** — `SyntaxError: Private field '#permit' must be declared` prevents module load; 0/11 tests pass |
| BP-000 through BP-010 direct test run | **97/97 passed** — BP-011 corruption does not affect predecessor tests when run directly |
| Repository validator | **FAILED** — SyntaxError at line 273 |

## Partial Source Review

The valid portion of `invoice-payment-service.mjs` (lines 1–9) reveals:

- **Constructor** requires `secureAccess`, `customerAuthorizationService`, `auditLog`, and `squareGateway` contracts
- **`createDraftAuthorized`** consumes BP-010 `financialHandoffAuthorized`, validates idempotency key, line items, forbidden card data regex (`card(number)?|cvv|cvc|magnetic|track.?data|pan`), normalizes line items with `money()` integer-cent governance
- The `money()` helper validates non-negative safe integers
- The `forbidden()` helper scans JSON-serialized content for card data patterns
- Architecture appears sound through the corruption boundary

### Manifest Review

The manifest is valid and complete:

- `workOrderId: "TNGD-BP-011"`
- 11 entities declared (Invoice, InvoiceVersion, InvoiceLineItem, etc.)
- `consumes: ["TNGD-BP-004", "TNGD-BP-008", "TNGD-BP-009", "TNGD-BP-010"]`
- `provider: "square"`, `massAuthority: "invoice-and-operational-payment-state"`, `providerAuthority: "payment-processing"`
- `handoffTarget: "TNGD-BP-012"`
- `persistence.media: "references-only"`

### Test File Review

The test file (`tests/invoice-payment.test.mjs`, 13 lines) is syntactically valid but cannot execute due to the service import failure. The test file reveals the intended behavior:

1. Governed totals from BP-010 scope (subtotal, tax, discount, deposit)
2. Diagnostic report attachment and reference-only media
3. Immutable content-hashed invoice versions
4. Retry-safe Square payment links (MASS retains financial-state authority)
5. Webhook authenticity and idempotency governance
6. Prohibited card data rejection
7. Transaction-scoped customer-safe invoice access
8. Reasoned human refund with immutable reference
9. BP-012 reference-only exception handoff for disputes
10. Tenant, role, and audit boundaries

### Completion Report Assessment

The completion report claims "Complete `npm.cmd run check`: passed" and "Tests: 107 passed." These claims were true at manufacturing time but are not reproducible at canonical HEAD. The corruption occurred during the commit process, not during manufacturing validation. The validated source exists in a non-canonical location (per BP-011.1 LCO: blob prefix `12678ad4`, 11,187 bytes).

## Recovery Status

BP-011.1 LCO was authorized at `03ec4e6` to restore the validated `invoice-payment-service.mjs`. However:

1. **BP-011.1 has NOT been manufactured.** The corrupted file still exists at HEAD.
2. **BP-011.1 scope is insufficient.** It authorizes recovery of `invoice-payment-service.mjs` only. The `validate-repository.mjs` corruption also requires recovery authority.

## Localized Correction Required

### LCO-1: Expand BP-011.1 to include `validate-repository.mjs`

The BP-011.1 recovery LCO must be expanded (or a supplementary LCO issued) to also recover `scripts/validate-repository.mjs` from a clean pre-corruption state. The last clean version is at BP-009 commit `fea8086` (0 non-ASCII bytes). Restoring from this baseline, then re-applying BP-010 and BP-011 validator additions from validated sources, is the correct recovery path.

Without this expansion, even a successful BP-011.1 service recovery will leave the full `npm run check` gate permanently blocked.

## Disposition

**NOT ACCEPTANCE-READY — Canonical artifacts corrupted.**

BP-011 cannot be accepted because:

1. The service implementation file is corrupted and cannot be loaded
2. All 11 BP-011 tests fail due to the corruption
3. The repository validator is also corrupted, blocking the full gate for all packages
4. BP-011.1 recovery has been authorized but not manufactured
5. BP-011.1 scope needs expansion to also cover `validate-repository.mjs`

**Required for re-review:**

1. Manufacture BP-011.1 (expanded to include both corrupted files)
2. Restore the exact validated service source (blob `12678ad4`, 11,187 bytes)
3. Restore `validate-repository.mjs` from clean provenance
4. Pass all 107 tests (or current equivalent)
5. Pass full `npm run check` including repository validator
6. Submit for renewed Independent Review

This review does not block BP-012 manufacturing under MPD-002, as BP-012 was activated before this review and the corruption is an artifact-integrity issue, not an architecture-critical defect. However, BP-012 cannot pass its own full canonical gate until BP-011.1 recovery is complete.

No later package has been activated or manufactured by this review.
