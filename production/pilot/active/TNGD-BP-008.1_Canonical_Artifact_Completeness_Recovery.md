# LOCALIZED CORRECTION ORDER

## TNGD-BP-008.1 — Canonical Artifact Completeness Recovery

| Field | Value |
|---|---|
| Project | MASS-TNGD-PILOT-001 |
| Package | TNGD-BP-008 |
| Status | Executive Authorized — Active Correction |
| Authority | Executive Authority; MPD-002 |
| Blocking Chain | BP-009 and successors |
| Source Finding | ATTENTION-20260815-MASS-PILOT-BP008-INCOMPLETE-CANONICAL-ARTIFACT |

## Objective

Restore the exact validated BP-008 artifact set that was omitted from canonical commit `2d07a03910d07b9c6aa3b455719faa18ce115b76`, prove that repository HEAD contains the claimed implementation, and re-establish BP-008 as a consumable canonical predecessor.

## Authorized Corrections

Recover only the BP-008 files demonstrated by manufacturing evidence and recoverable local stash/history, including as applicable:

- `src/field-workflow/` service, template, index, and manifest;
- BP-007 read-only assigned-handoff extension in `src/dispatch/dispatch-service.mjs`;
- `tests/field-workflow.test.mjs`;
- `docs/bp008/` production documentation;
- `migrations/TNGD-BP-008_REFERENCE.md`;
- required `src/foundation.mjs`, foundation-test, build, package, and canonical-validator integration;
- BP-008 completion evidence corrected to reference the actual recovery commit.

## Recovery Rules

1. Recover from the exact local stash or historical working state that produced the reported 74-test result.
2. Inspect every recovered diff before staging.
3. Do not restore unrelated local or untracked files.
4. Do not redesign BP-008.
5. Do not add BP-009 behavior.
6. Do not implement the deferred detailed garage-door order form.
7. If recovered files differ materially from the completion report, stop and report the discrepancy rather than silently manufacturing replacement behavior.

## Validation

Run against the exact recovered canonical candidate:

- complete `npm.cmd run check`;
- BP-000 through BP-008 regression suite;
- canonical repository validator through BP-008;
- `git diff --check`;
- source-boundary scan confirming no BP-009 or later behavior;
- file-inventory comparison against the BP-008 completion report;
- clean-clone or clean-tree module-resolution verification proving `src/field-workflow/index.mjs` and every imported BP-008 module exist.

## Deliverables

- recovered canonical BP-008 artifact commit;
- updated BP-008 completion report;
- BP-008.1 correction report;
- exact changed-file inventory;
- validation results and test count;
- review submission for renewed Independent Review.

## Queue Direction

- This correction is the sole Pilot Active package.
- BP-009 returns to Pilot Inbox unchanged in scope and remains paused.
- After BP-008.1 passes the complete correction gate and enters Review, BP-009 may reactivate provisionally under MPD-002 while renewed Independent Review proceeds.
- BP-010 and later remain untouched.

No architectural redesign or scope expansion is authorized.
