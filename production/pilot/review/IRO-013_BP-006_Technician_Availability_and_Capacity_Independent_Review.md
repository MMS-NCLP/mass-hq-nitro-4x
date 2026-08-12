# IRO-013 — TNGD-BP-006 Technician Availability and Capacity Independent Review

| Field | Value |
|---|---|
| Review authority | Independent Review |
| Canonical review head | `5a6af618c155397a0dca4899ea8441a4896d5b93` |
| Artifact commit reviewed | `2a7f55a852c32ede357d61c39d1e047eaf23d9b2` |
| Review date | 2026-08-12 |
| Disposition | Not acceptance-ready — localized corrections required |

## Scope Reviewed

The review examined the committed BP-006 work order, completion report, capacity source and manifest, automated tests, BP-006 documentation, persistence reference, build integration, foundation metadata, and canonical validator at the stated review head. BP-007 was neither activated nor manufactured.

## Validation

From `implementation/pilot/tngd-dispatch-portal`:

- `npm.cmd run check`: exit 0
- Build: passed; foundation through BP-006 manifests generated
- Tests: 47 passed; 0 failed, skipped, cancelled, or todo
- Validator: `Canonical BP-000/BP-001/BP-002/BP-003/BP-004/BP-005/BP-006 repository validation passed.`
- `git diff --check`: passed
- Independent overlap probe: failed the work-order invariant. With a known overlapping BP-005 appointment omitted from caller-supplied `appointmentIds`, capacity returned `available: true`; supplying the same appointment ID returned `available: false` with reason `overlap`.
- Independent audit probe: the shared audit chain remained valid, but the `CapacityOverrideAuthorized` record had empty metadata and therefore did not preserve the override reason, date, amount, or override identifier.

The passing gate confirms no detected regression across the existing BP-000 through BP-005 test suites. It does not resolve the BP-006 findings below because the canonical BP-006 tests do not exercise the failing paths.

## Findings

### IRO-013-F01 — Blocking: appointment overlap and workload enforcement is caller-bypassable

`calculateAuthorized` evaluates only the appointment identifiers supplied by its caller. A caller may omit an existing BP-005 appointment, causing both overlap prevention and daily/same-day workload counts to ignore that appointment. This does not meet the requirement to calculate reliable, conflict-free capacity from BP-005 appointment and calendar records.

Localized correction: replace caller-selected appointment completeness with an authoritative, tenant-bound BP-005 scheduling query for the relevant date/window. Add deterministic tests proving omitted input cannot bypass overlap or workload limits and cross-tenant appointments cannot influence capacity.

### IRO-013-F02 — Blocking: travel-radius and skill filtering are declared but not implemented

Profiles store `travelRadiusMiles`, but capacity queries contain no destination distance or equivalent travel input and never compare any value with the configured radius. The implementation filters `serviceCapabilities`, equipment, and vehicles, but defines no distinct skill requirements or skill filter. Documentation and the completion report claim both travel constraints and capability/skill coverage beyond what the executable path enforces.

Localized correction: add the minimum tenant-bound travel-distance boundary and skill requirement/profile fields needed to enforce the existing work order. Add positive and negative tests for travel radius and skills, and reconcile the manifest, rules, domain model, API inventory, migration reference, validator, and completion evidence.

### IRO-013-F03 — Blocking: same-day and emergency capacity controls are caller assertions, not governed capacity rules

The same-day limit is selected by a caller-provided Boolean instead of being derived from the requested date and the service clock. Emergency handling is limited to an eligibility Boolean and provides no governed emergency-capacity limit or override rule. A caller can therefore request today's capacity without `sameDay: true` and receive the normal daily limit.

Localized correction: derive same-day status from the requested interval and injected clock, define the minimal emergency-capacity rule authorized by BP-006, validate numeric limits, and add deterministic boundary tests.

### IRO-013-F04 — Blocking: reasoned overrides are not auditable in the hash-chained event history

The in-memory override object contains a reason and author, but `CapacityOverrideAuthorized` is appended without metadata. The audit record does not preserve the override ID, date, reason, or capacity delta, so the documented reasoned, attributed audit history cannot be reconstructed from the audit chain.

Localized correction: include immutable override identity, effective date, reason, and capacity delta in the audit metadata and add a test that reads and verifies those fields while confirming the chain remains valid.

### IRO-013-F05 — Evidence mismatch: exception and control coverage is incomplete

The test named `PTO and blackout dates block capacity` creates only a PTO exception. No deterministic tests exercise blackout, training, administrative holds, partial-day exception intervals, travel radius, distinct skills, same-day date derivation, or emergency-capacity boundaries. The validator checks test names and source substrings rather than the behaviors, while the completion report states broader evidence was demonstrated.

Localized correction: add direct behavioral tests for every declared exception/control and update the validator and completion report so evidence claims match executed coverage.

## Verified Controls and Boundaries

- Technician profiles, service capabilities, recurring weekday shifts, service areas, equipment, vehicles, daily limits, exception type allowlisting, tenant filtering, permission checks, and the hash-chain implementation are present.
- PTO blocking, service-area/capability/equipment/vehicle filters, a same-day-limit branch, overlap detection when all relevant appointments are supplied, technician-role denial, and audit-chain verification have passing tests.
- BP-005 and BP-007 handoff identifiers are exposed, but the BP-005 appointment consumption defect in F01 prevents the handoff from being accepted as reliable. The BP-007 marker is only a future contract string, which is appropriate while BP-007 is unauthorized.
- No technician assignment, route optimization, or dispatch-board implementation was found.
- The source, manifest, documents, migration reference, tests, validator, and completion report are structurally present, but their claims are not behaviorally consistent in the areas identified above.

## Disposition

TNGD-BP-006 may not receive Executive Acceptance at this revision. A localized BP-006 correction should address IRO-013-F01 through IRO-013-F05, run the complete `npm.cmd run check` gate, and return to Independent Review. The corrections do not require an architectural redesign or any BP-007 implementation.

BP-007 remains unauthorized and must not be activated or manufactured.
