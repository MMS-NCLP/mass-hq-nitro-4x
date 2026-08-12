# TNGD-BP-006.1 Localized Correction Report

| Field | Value |
|---|---|
| Authority | IRO-013 |
| Corrected Artifact Commit | `1ff670e` |
| Status | Submitted for Renewed Independent Review |
| Date | 2026-08-12 |

## Corrections

- BP-006 now loads all tenant appointments through BP-005 `listAuthorized`; appointment identifiers are no longer caller-controlled.
- Profiles and calculations now distinguish skills from service capabilities and enforce travel radius.
- Same-day status is derived from the governed clock and requested date.
- Emergency demand uses an explicit profile-level emergency daily limit.
- Override audit metadata now includes identifier, effective date, capacity amount, and reason.
- Tests now directly cover blackout, training, administrative holds, travel radius, skills, derived same-day behavior, emergency limits, and override metadata.

## Validation

- `npm.cmd run check`: exit 0
- Build: passed
- Tests: 49 passed; 0 failed, skipped, cancelled, or todo
- Repository validator: passed for BP-000 through BP-006
- `git diff --check`: passed

BP-007 remains unauthorized and unimplemented.
