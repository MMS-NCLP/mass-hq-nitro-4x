# LOCALIZED CORRECTION ORDER

## TNGD-BP-011.1 — Canonical Invoice-Payment Service Recovery

**Project:** MASS — TNGD Dispatch User Portal Operational Pilot  
**Package:** TNGD-BP-011.1  
**Status:** Executive Authorized — Immediate Correction  
**Correction lane:** Pilot Review / Localized Correction  
**Authority:** IRO-017 → MPD-002 → Executive Authority → Canonical Repository

## 1. Purpose

Restore the exact validated TNGD-BP-011 invoice-payment service source to canonical GitHub after binary corruption was confirmed in the committed canonical blob.

This is an isolated artifact-integrity correction. It does not authorize architectural redesign, business-logic changes, scope expansion, or later-package implementation.

## 2. Confirmed Defect

Canonical path:

`implementation/pilot/tngd-dispatch-portal/src/invoice-payment/invoice-payment-service.mjs`

Confirmed evidence:

- corrupted canonical blob prefix: `1b359130`;
- corrupted size: 2,733 bytes;
- canonical content: invalid UTF-8 and unloadable;
- validated source blob prefix: `12678ad4`;
- validated source size: 11,187 bytes;
- consequence: canonical build cannot load BP-011 and BP-012 cannot truthfully validate its dependency chain.

## 3. Authorized Correction

Implement only the following:

1. Recover the exact validated BP-011 source represented by blob prefix `12678ad4`.
2. Verify its complete hash and byte size before replacement.
3. Replace only the corrupted canonical service file.
4. Compare the recovered source against BP-011 tests, manifests, documentation, completion evidence, and expected exports.
5. Do not rewrite, refactor, reinterpret, or improve BP-011 business logic.
6. Do not alter BP-012 implementation during this correction.
7. Do not implement BP-013 or later behavior.

If the exact validated source cannot be proven, stop and create one Executive Attention record identifying the missing provenance evidence.

## 4. Required Validation

After restoration, run:

- UTF-8 and syntax validation for the restored file;
- exact blob/hash and byte-size verification;
- BP-011 direct tests;
- complete `npm run check`;
- canonical repository validator through BP-012 where the assembled BP-012 workspace permits;
- BP-000 through BP-010 regression tests;
- `git diff --check`;
- forbidden-scope scan;
- clean-tree or separately assembled clean-tree validation proving the committed canonical files—not untracked local files—supply the passing result.

## 5. Deliverables

Produce:

1. corrected canonical service file;
2. TNGD-BP-011.1 Localized Correction Report;
3. exact source provenance and hash evidence;
4. validation results;
5. correction commit SHA;
6. review-submission commit SHA, if separate.

## 6. Acceptance Criteria

BP-011.1 passes when:

- the canonical service file exactly matches the proven validated source;
- canonical Git can decode and load the file;
- the complete available gate passes from committed artifacts;
- no unrelated files or behavior change;
- no regression is introduced;
- BP-012 can resume against a valid canonical BP-011 dependency.

## 7. Conveyor Release

BP-012 remains the sole active Pilot package and is paused only at this dependency gate.

Immediately after BP-011.1 passes the complete canonical gate:

1. submit BP-011.1 evidence to `production/pilot/review`;
2. release BP-012 manufacturing;
3. complete BP-012 validation from canonical dependencies;
4. commit and submit BP-012 for Independent Review;
5. continue MPD-002 without waiting for routine BP-011.1 review unless the correction reveals a substantive defect.

**No architectural redesign. No scope expansion. No self-approval.**
