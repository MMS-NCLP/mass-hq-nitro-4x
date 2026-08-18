# LOCALIZED CORRECTION ORDER

## TNGD-BP-011.2 — Canonical Repository Validator Recovery

**Project:** MASS — TNGD Dispatch User Portal Operational Pilot
**Package:** TNGD-BP-011.2
**Status:** Executive Authorized — Immediate Correction
**Correction lane:** Pilot Review / Localized Correction
**Authority:** IRO-021 → LCO-1 recommendation → Executive Authority → Canonical Repository

## 1. Purpose

Restore and extend the canonical repository validator (`scripts/validate-repository.mjs`) after binary corruption was confirmed in the committed canonical blob at BP-011 commit `a2ae0b8`.

This is a supplementary artifact-integrity correction to BP-011.1. It does not authorize architectural redesign, business-logic changes, scope expansion, or later-package implementation.

## 2. Confirmed Defect

Canonical path:

`implementation/pilot/tngd-dispatch-portal/scripts/validate-repository.mjs`

Confirmed evidence:

- Corruption at line 273: `throw new Error("BP-003 manifest does not p` followed by binary garbage
- `SyntaxError: Invalid or unexpected token` prevents execution
- Consequence: repository validator cannot execute; full `npm run check` gate permanently blocked
- Corruption timeline: clean at BP-009 (`fea8086`), 11 non-ASCII bytes at BP-010 (`5fe1ef2`), severe corruption at BP-011 (`a2ae0b8`)
- Last clean version: commit `fea8086`, 497 lines, 0 non-ASCII bytes

## 3. Authorized Correction

Implement only the following:

1. Recover the validator from the clean BP-009 version at commit `fea8086`.
2. Preserve valid BP-010 and BP-011 additions already present in lines 1-272 of the corrupted file (imports, required paths, build manifest checks, foundation scope checks).
3. Restore the corrupted boundary/evidence/forbidden-scope check sections from clean BP-009 provenance.
4. Add BP-010 source boundary, forbidden-scope, and test-evidence checks following the established pattern (BP-004 through BP-009).
5. Add BP-011 source boundary, forbidden-scope, and test-evidence checks following the established pattern.
6. Add BP-011 foundation scope verification.
7. Update the final validation message from "BP-009" to "BP-011".
8. Do not rewrite, refactor, reinterpret, or improve any business logic.
9. Do not implement BP-012 or later behavior.

## 4. Required Validation

After restoration, run:

- UTF-8 and syntax validation for the restored file (`node --check`);
- complete `npm run check` (build + test + validate);
- 107/107 tests passing (BP-000 through BP-011);
- repository validator outputs "Canonical BP-000 through BP-011 repository validation passed.";
- `git diff --check`;
- no binary or non-ASCII content in the restored file.

## 5. Deliverables

Produce:

1. corrected canonical validator file;
2. TNGD-BP-011.2 Localized Correction Report;
3. source provenance evidence;
4. validation results;
5. correction commit SHA.

## 6. Acceptance Criteria

BP-011.2 passes when:

- the canonical validator file is syntactically valid and free of binary corruption;
- all boundary, forbidden-scope, and evidence checks through BP-011 execute correctly;
- the complete `npm run check` gate passes;
- no unrelated files or behavior change;
- no regression is introduced;
- BP-012 can resume against a valid canonical gate.

**No architectural redesign. No scope expansion. No self-approval.**
