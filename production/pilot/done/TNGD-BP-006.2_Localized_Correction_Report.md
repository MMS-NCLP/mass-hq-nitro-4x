# TNGD-BP-006.2 Localized Correction Report

| Field | Value |
|---|---|
| Authority | Executive disposition; IRO-014 and IRO-014-AP |
| Corrected Artifact Commit | `cb6c10167cfbe0b3e78a3f5940e598d0304077fe` |
| Status | Executive Accepted — Archived |
| Date | 2026-08-12 |

## Corrections Completed

- Travel radius and capacity-query distance now require finite, non-negative numeric values. Missing, malformed, negative, `NaN`, and infinite values are rejected before calculation or profile mutation.
- Daily capacity requires a finite integer of at least one. Same-day, emergency, and override capacities require finite non-negative integers. Missing, malformed, fractional, negative, `NaN`, and infinite values are rejected.
- Remaining capacity now subtracts only authoritative BP-005 appointments occurring on the requested date. Authoritative tenant appointment loading, overlap detection, and daily-limit enforcement are preserved.
- Partial-day exceptions now have direct evidence proving an overlapping window is blocked and a non-overlapping window remains available. Direct PTO, blackout, training, and administrative-hold evidence remains in the complete suite.
- The canonical validator now requires the BP-006.2 implementation boundaries and behavioral evidence, including complete override audit metadata.
- Capacity rules, domain model, API inventory, audit/event model, migration reference, and revision log were reconciled with the corrected executable contract.

## Validation Evidence

From `implementation/pilot/tngd-dispatch-portal`:

- `npm.cmd run check`: exit 0
- Build: passed; foundation through BP-006 manifests generated
- Tests: 53 passed; 0 failed, skipped, cancelled, or todo
- Validator: `Canonical BP-000/BP-001/BP-002/BP-003/BP-004/BP-005/BP-006 repository validation passed.`
- `git diff --check`: passed
- BP-000 through BP-005 regression suites: passed
- Forbidden-scope scan: no BP-007 technician assignment, route optimization, dispatch operation, or dispatch-board implementation found

Live database execution remains deferred because no persistence provider is authorized. The reference migration contract was updated, but no deployed migration is claimed.

## Executive Acceptance

IRO-015 renewed Independent Review accepted BP-006.2 with no findings. Executive Authority formally accepted BP-006, including its approved BP-006.1 and BP-006.2 corrections, on 2026-08-14. This report is archived as part of the accepted operational baseline. BP-007 remains unauthorized and was neither activated nor manufactured.
