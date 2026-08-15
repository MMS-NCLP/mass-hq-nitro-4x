# IRO-016: TNGD-BP-007 — Route Optimization, Technician Assignment, and Dispatch Board — Independent Implementation Review

| Field | Value |
|---|---|
| Review Order | IRO-016 |
| Reviewer | Claude (Architecture Protection) |
| Scope | BP-007 complete implementation — dispatcher queue, recommendations, assignment, reassignment, dispatch, exceptions, history, technician handoff |
| Canonical Review Head | `58e7d5d` |
| Artifact Commit | `0fdc466` |
| Review Date | 2026-08-14 |

## Artifacts Reviewed

| Artifact | Path | Lines |
|---|---|---|
| Dispatch Service | `src/dispatch/dispatch-service.mjs` | 47 |
| Dispatch Index | `src/dispatch/index.mjs` | 2 |
| Dispatch Manifest | `src/dispatch/manifest.mjs` | 2 |
| Dispatch Tests | `tests/dispatch.test.mjs` | 18 |
| Foundation | `src/foundation.mjs` | 96 |
| Foundation Tests | `tests/foundation.test.mjs` | 84 |
| API Inventory | `docs/bp007/API_INVENTORY.md` | — |
| Assignment and Dispatch Rules | `docs/bp007/ASSIGNMENT_AND_DISPATCH_RULES.md` | — |
| Audit and Event Model | `docs/bp007/AUDIT_AND_EVENT_MODEL.md` | — |
| Domain and Data Model | `docs/bp007/DOMAIN_AND_DATA_MODEL.md` | — |
| Permission Matrix | `docs/bp007/PERMISSION_MATRIX.md` | — |
| Revision Log | `docs/bp007/REVISION_LOG.md` | — |
| Route Recommendation Boundary | `docs/bp007/ROUTE_RECOMMENDATION_BOUNDARY.md` | — |
| Migration Reference | `migrations/TNGD-BP-007_REFERENCE.md` | — |
| Completion Report | `production/pilot/review/TNGD-BP-007_Completion_Report.md` | — |
| Work Order | `production/pilot/review/TNGD-BP-007_Route_Optimization_Technician_Assignment_and_Dispatch_Board.md` | 249 |
| Canonical Validator | `scripts/validate-repository.mjs` | 474 |

## Gate Results

| Gate | Result |
|---|---|
| `npm run check` | Exit 0 — 61/61 tests passed, build passed, validation passed |
| `npm run validate` | `Canonical BP-000 through BP-007 repository validation passed.` |
| BP-000 through BP-006 regression | All passing (54 prior tests + 7 new BP-007 tests) |
| `git diff --check` | Clean |
| Forbidden scope scan | No `executeJobAuthorized`, `createEstimate`, `processPayment`, or `liveTrafficProvider` in dispatch source |

## Independent Boundary Probes

26 probes executed independently of the test suite. 25 passed outright; 1 probe matched a stricter guard than anticipated (correct behavior — see Probe 10 below).

### Probe 1 — Tenant isolation (1 probe)

Verified `listAuthorized` with a mismatched tenant ID throws `Access denied`. Dispatch operations are tenant-bound.

### Probe 2 — Self-approval prevention (2 probes)

Verified the dispatcher who requested a recommendation cannot approve their own assignment (error: `cannot approve`). A different principal (manager) can approve successfully with status `assigned`.

### Probe 3 — Idempotent work item creation (2 probes)

Verified calling `createWorkItemAuthorized` twice with the same appointment returns the identical object. Queue contains exactly one item.

### Probe 4 — Unscheduled appointment rejection (1 probe)

Verified a non-scheduled appointment (status `draft`) is rejected with `scheduled BP-005 appointment` error. Only scheduled BP-005 appointments enter the dispatch queue.

### Probe 5 — Ineligible technician rejection (1 probe)

Verified assigning a technician not in the recommendation's candidate list throws `not eligible`. Assignment is constrained to BP-006-eligible technicians.

### Probe 6 — Reassignment requires reason (1 probe)

Verified `reassignAuthorized` without a reason throws `reason` error.

### Probe 7 — Return to queue requires reason (1 probe)

Verified `returnToQueueAuthorized` without a reason throws `reason` error.

### Probe 8 — Cancellation requires reason (1 probe)

Verified `cancelAuthorized` without a reason throws `reason` error.

### Probe 9 — Dispatch requires assigned status (1 probe)

Verified dispatching an unassigned work item throws `assigned` error. Only assigned work may be dispatched.

### Probe 10 — Handoff restricted to assigned technician (4 probes)

A non-technician (dispatcher) attempting handoff was rejected at the permission layer (`Access denied: permission-not-granted`) because dispatchers lack `jobs.assigned.read` permission. This is stricter than the secondary role/identity check — correct behavior. The assigned technician successfully received a handoff with status `ready-for-field-execution`. Verified no `jobExecution` or `inspection` fields present (no BP-008 scope).

### Probe 11 — Immutable history (3 probes)

Verified history contains at least 4 events after a full lifecycle. Both the history array and individual entries are `Object.isFrozen`.

### Probe 12 — Audit chain integrity (1 probe)

Verified `auditLog.verify()` returns `true` after full dispatch lifecycle. Hash chain is intact.

### Probe 13 — Exception handling (3 probes)

Verified exception creation returns `open` status. Resolution returns `resolved` status. Cross-tenant exception resolution is denied.

### Probe 14 — No BP-008 behavior (4 probes)

Verified `DispatchService` instance has none of: `executeJobAuthorized`, `createEstimateAuthorized`, `processPaymentAuthorized`, `createInspectionAuthorized`.

## Requirement Verification

### R1: Tenant-safe technician assignment

**VERIFIED.** All operations require `sessionToken` and `tenantId`. `#permit()` (line 43) delegates to `secureAccess.requirePermission()` which enforces tenant-scoped access. `#item()` (line 42) validates `tenantId` match on work item lookup. `listAuthorized` (line 39) filters by tenant. Independent probe confirms cross-tenant rejection.

### R2: BP-006 availability and capacity consumption

**VERIFIED.** `recommendAuthorized` (line 21) calls `this.#capacity.calculateAuthorized()` with the work item's requirements — `serviceType`, `serviceArea`, `travelDistanceMiles`, `requiredSkills`, `requiredEquipment`, `requiredVehicle`, `emergency`. Only candidates with `available: true` are included in recommendations (line 22). No capacity calculation is duplicated — BP-006 is consumed, not reimplemented.

### R3: Assignment authorization and conflict prevention

**VERIFIED.** `assignAuthorized` (line 28) enforces: recommendation must match the work item and tenant; the requester of the recommendation cannot approve it (`rec.requestedBy === p.id` throws); the technician must appear in the recommendation's candidates. Idempotent re-assignment returns the existing assignment if the same technician is already assigned (line 29). Test suite and independent probes confirm all three guards.

### R4: Dispatch-board queue integrity

**VERIFIED.** `createWorkItemAuthorized` (line 13) is idempotent via `#byAppointment` Map keyed by `tenantId:appointmentId`. Only scheduled BP-005 appointments are accepted (line 14). `listAuthorized` (line 39) returns a frozen, tenant-filtered array. Queue status lifecycle is enforced: `unassigned → recommended → assigned → dispatched` with governed `return`, `reassign`, `cancel` paths. `recommendAuthorized` (line 19) requires `unassigned` or `recommended` status.

### R5: Route recommendation boundaries

**VERIFIED.** Manifest declares `routingBoundary: "deterministic-v1-no-external-provider"`. Ranking at line 22 sorts by `remainingCapacity` descending, then `technicianId` for stable deterministic ordering. Explanations include `["BP-006 eligible", "capacity available", "deterministic rank N"]`. No external routing provider, live traffic, or autonomous assignment is present. Documentation (`ROUTE_RECOMMENDATION_BOUNDARY.md`) confirms the V1 boundary.

### R6: Reasoned overrides and audit evidence

**VERIFIED.** `reassignAuthorized` (line 33) requires a non-empty reason. `returnToQueueAuthorized` (line 34) requires a reason. `cancelAuthorized` (line 36) requires a reason. `addOverrideAuthorized` on capacity (from BP-006) requires a reason. All operations emit audit events via `#append()` (line 45) which appends to both the work-item history and the shared audit log with actor, tenant, type, metadata, and timestamp. `CapacityOverrideAuthorized` events include `overrideId`, `date`, `additionalCapacity`, and `reason` metadata. Independent probe confirms audit chain validity.

### R7: Technician handoff integrity

**VERIFIED.** `handoffAuthorized` (line 41) enforces four guards: (1) `jobs.assigned.read` permission, (2) dispatched status, (3) technician role, (4) assigned technician identity match. Handoff returns `workItemId`, `appointmentId`, `serviceCaseId`, `customerId`, `technicianId`, `requirements`, and `status: "ready-for-field-execution"`. No `jobExecution`, `inspection`, `estimate`, or `invoice` fields — field execution is deferred. Independent probes confirm both the permission guard and the content boundary.

### R8: Idempotent operations

**VERIFIED.** Work item creation is idempotent via `#byAppointment` Map (line 13 — returns existing item). Assignment is idempotent when the same technician is already assigned (line 29). Recommendation is re-requestable when status is `recommended` (line 19). These are the appropriate idempotency points for the dispatch lifecycle.

### R9: BP-000 through BP-006 regression safety

**VERIFIED.** 61/61 tests passed — 54 tests from BP-000 through BP-006 plus 7 new BP-007 tests. Validator enforces all prior package boundaries. Foundation test confirms the complete package list `TNGD-BP-000` through `TNGD-BP-007`. No prior test was modified or removed.

### R10: Absence of BP-008 mobile workflow or inspection implementation

**VERIFIED.** No `executeJobAuthorized`, `createEstimate`, `processPayment`, `liveTrafficProvider`, `inspection`, or `mobileWorkflow` methods exist on the DispatchService. Validator explicitly checks for forbidden identifiers. Handoff produces `ready-for-field-execution` status but no job execution content. Manifest declares 6 entities (DispatchWorkItem, AssignmentRecommendation, TechnicianAssignment, AssignmentHistory, DispatchException, TechnicianHandoff) — none are BP-008 entities.

## Architectural Notes

The implementation is dense (47 lines of source) but complete. The dispatch service properly consumes BP-005 scheduling and BP-006 capacity without duplicating either. The recommendation-to-assignment separation enforces human approval. The lifecycle state machine (`unassigned → recommended → assigned → dispatched`) is clean with governed exit paths (`return`, `reassign`, `cancel`). Exception handling uses a separate permission (`operations.exceptions.manage`), which is the correct separation of operational concerns.

The manifest correctly declares `humanApprovalRequired: true` and `routingBoundary: "deterministic-v1-no-external-provider"`, which will guide V2+ routing-provider integration without changing the assignment authority boundary.

## Findings

**No findings.**

## Disposition

**ACCEPTED.**

All 10 verification requirements are satisfied. 61/61 tests pass. 26/26 independent boundary probes confirm correct behavior. No regressions. No BP-008 scope intrusion. Human approval separation is enforced. Route recommendation remains within the deterministic V1 boundary. Audit chain integrity is maintained.

BP-007 is ready for Executive Acceptance.

No later package has been activated, manufactured, or prepared.
