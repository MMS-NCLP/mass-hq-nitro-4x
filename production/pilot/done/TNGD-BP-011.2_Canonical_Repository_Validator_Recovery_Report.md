# TNGD-BP-011.2 Localized Correction Report

| Field | Value |
|---|---|
| Correction | TNGD-BP-011.2 — Canonical Repository Validator Recovery |
| Status | Manufactured |
| Authority | IRO-021 LCO-1 recommendation |
| Prior Commit | `3b632a6` (IRO-018 through IRO-021 batch review) |
| Corrected Path | `implementation/pilot/tngd-dispatch-portal/scripts/validate-repository.mjs` |
| Clean Provenance | Commit `fea8086` (BP-009), 497 lines, 0 non-ASCII bytes |
| Corrected Size | 32,751 bytes, 523 lines |
| Corrected SHA-256 | `115057b7f85f60e1c5030363286bf810f43f02881db45854d8858d953c4e60bc` |
| Correction Date | 2026-08-15 |

## Defect and Cause

The BP-011 artifact commit `a2ae0b8` introduced binary corruption into `scripts/validate-repository.mjs` at line 273. The file was syntactically valid through BP-009 manufacture (`fea8086`, 0 non-ASCII bytes). BP-010 manufacture (`5fe1ef2`) introduced 11 non-ASCII bytes inside string literals (still parseable). BP-011 manufacture (`a2ae0b8`) worsened the corruption to a SyntaxError that prevented execution entirely.

The BP-011.1 LCO authorized recovery of only `invoice-payment-service.mjs`. IRO-021 identified the validator corruption as a separate defect requiring supplementary correction authority (LCO-1 recommendation).

## Reconstruction Method

Lines 1-272 of the corrupted file were verified syntactically valid. These lines already contained BP-010 and BP-011 additions from prior manufacturing: imports, required paths, build manifest checks, and foundation scope checks through BP-010.

The reconstruction:

1. Preserved valid lines 1-224 (imports through BP-010 foundation scope check).
2. Added BP-011 foundation scope verification (matching `foundation.bp011FeatureScope` and `invoicePaymentManifest` authority).
3. Preserved valid lines 225-272 (customerCaseManifest and intakeManifest checks through the guided-intake if-block).
4. Restored lines 273+ from the clean BP-009 version at commit `fea8086` (the throw statement completion through the environment checks and final message).
5. Added BP-010 source boundary checks: 13 boundaries, 4 forbidden scope, 10 test evidence strings.
6. Added BP-011 source boundary checks: 12 boundaries, 4 forbidden scope, 10 test evidence strings.
7. Updated the final validation message to "Canonical BP-000 through BP-011 repository validation passed."

All boundary strings were verified against the actual source files to ensure exact match (accounting for minified code formatting).

## Files Changed

- `implementation/pilot/tngd-dispatch-portal/scripts/validate-repository.mjs` (251 insertions, 1 deletion)

## Validation Evidence

- `node --check`: passed
- Build: `Built foundation through BP-011 invoice-payment manifests`
- Tests: 107 passed; 0 failed, skipped, cancelled, or todo
- Repository validator: `Canonical BP-000 through BP-011 repository validation passed.`
- Complete `npm run check`: passed
- BP-000 through BP-011 regression: absent

## New Boundary Checks Added

### BP-010 (Customer Authorization)

Source boundaries: `createRequestAuthorized`, `decide`, `revoke`, `amendAuthorized`, `receipt`, `financialHandoffAuthorized`, `immutable`, `adultAcknowledged`, `signatureEvidence`, `targetPackage:"TNGD-BP-011"`, `status:"authorization-confirmed"`, `cannot authorize for the customer`, `Governed transaction access`.

Forbidden scope: `createInvoiceAuthorized`, `processPaymentAuthorized`, `storeCardAuthorized`, `determineWarrantyAuthorized`.

Test evidence: 10 test-name substring matches verified against `tests/customer-authorization.test.mjs`.

### BP-011 (Invoice and Square Payment)

Source boundaries: `createDraftAuthorized`, `finalizeAuthorized`, `createPaymentLinkAuthorized`, `processWebhook`, `refundAuthorized`, `reconciliationHandoffAuthorized`, `customerView`, `issueCustomerAccessAuthorized`, `financialHandoffAuthorized`, `Prohibited card data`, `verifyWebhook`, `targetPackage:"TNGD-BP-012"`.

Forbidden scope: `resolveReconciliationAuthorized`, `determineWarrantyAuthorized`, `followUpAuthorized`, `garageDoorOrderForm`.

Test evidence: 10 test-name substring matches verified against `tests/invoice-payment.test.mjs`.

## Scope Confirmation

No payment-provider expansion, reconciliation resolution, warranty adjudication, customer follow-up, BP-012 behavior, or later-package implementation was introduced. The correction restores artifact integrity and extends the validator's boundary-check coverage to match the implemented package set (BP-000 through BP-011).
