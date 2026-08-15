# TNGD-BP-011.1 Localized Correction Report

| Field | Value |
|---|---|
| Correction | TNGD-BP-011.1 — Canonical Invoice-Payment Service Recovery |
| Status | Submitted for Independent Review |
| Authority Commit | `03ec4e6acaac5f0b6e43fd6f7c12fd72295f09d3` |
| Correction Artifact Commit | `8d77f379d22eaccbacfa216856a13c66a6a12ece` |
| Corrected Path | `implementation/pilot/tngd-dispatch-portal/src/invoicing/invoice-payment-service.mjs` |
| Restored Git Blob | `12678ad414cc2a2fc8bfddbd53316aa0ffbcc9b3` |
| Restored Size | 11,187 bytes |
| Correction Date | 2026-08-15 |

## Defect and Cause

The BP-011 artifact commit recorded blob `1b3591304c6a9192ae3f871a74f08b87f4debdbf` at the canonical service path. That blob was only 2,733 bytes, was not valid UTF-8, and could not be parsed as JavaScript. The validated manufacturing source remained recoverable at 11,187 bytes with Git blob `12678ad414cc2a2fc8bfddbd53316aa0ffbcc9b3`.

All other BP-011 source, test, manifest, documentation, and migration hashes matched the validated manufacturing workspace. The evidence confines the defect to corruption during publication of the single large service blob. The lower-level transport failure cannot be proven further from repository history, so no more specific cause is claimed.

The Executive directive and initial LCO used `src/invoice-payment/`; canonical repository evidence shows that directory has never existed. The implementation index, manifest, tests, documentation, completion report, and artifact history all authorize `src/invoicing/invoice-payment-service.mjs`. No duplicate path was created.

## Exact Correction

Only the corrupted canonical service file was replaced. Its restored content exactly matches the verified manufacturing source:

- Git blob: `12678ad414cc2a2fc8bfddbd53316aa0ffbcc9b3`
- Byte length: 11,187
- SHA-256: `9F2607BC7254AD177CE1091A47F7D3438C9C4E87543515BB2937ED3851FD83A4`

No BP-011 business logic, architecture, tests, manifest, documentation, migration contract, or scope was redesigned. IRO-017 and all BP-008 evidence were unchanged.

## Files Changed

Artifact commit `8d77f379d22eaccbacfa216856a13c66a6a12ece`:

- `implementation/pilot/tngd-dispatch-portal/src/invoicing/invoice-payment-service.mjs`

Review-evidence submission appends this report and the BP-011 completion-history correction record only.

## Validation Evidence

Validation used a separately assembled BP-011-only tree excluding uncommitted BP-012 manufacturing work.

- UTF-8 decoding and `node --check`: passed
- Exact Git blob and byte-size verification: passed (`12678ad4…`, 11,187 bytes)
- BP-011 direct tests: 10 passed; 0 failed, skipped, cancelled, or todo
- Complete `npm.cmd run check`: passed
- Complete regression suite: 107 passed; 0 failed, skipped, cancelled, or todo
- BP-000 through BP-010 regressions: absent
- Repository validator: `Canonical BP-000 through BP-011 repository validation passed.`
- Source/test/documentation/manifest/completion-report comparison: passed
- `git diff --check`: passed
- Forbidden-scope scan: passed

Direct Git cloning was unavailable because the environment had no Git credential session. The permitted separately assembled clean-tree route was used, and canonical Git blob identity independently proves that the committed corrected service is the exact file validated.

## Scope Confirmation

No payment-provider expansion, reconciliation resolution, warranty adjudication, customer follow-up, BP-013 behavior, or detailed garage-door order form was introduced. BP-012 may resume against the corrected BP-011 dependency while Independent Review proceeds.
