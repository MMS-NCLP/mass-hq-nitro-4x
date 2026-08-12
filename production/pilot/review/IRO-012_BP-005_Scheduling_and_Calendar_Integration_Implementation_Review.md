# IRO-012 — Independent Implementation Review
## TNGD-BP-005: Scheduling and Calendar Integration

| Field | Value |
|---|---|
| Review Order | IRO-012 |
| Work Order | TNGD-BP-005 |
| Title | Scheduling and Calendar Integration |
| Canonical Review Head | `a87cbcefbdc5bd6177b10a0e2eb5e95a9868f696` |
| Artifact Commit Reviewed | `1cace1a` |
| Review Date | 2026-08-12 |
| Reviewer Role | Architecture Protection |

---

## 1. Artifacts Reviewed

### Source
- `src/scheduling/scheduling-service.mjs` (115 lines)
- `src/scheduling/calendar-gateway.mjs` (27 lines)
- `src/scheduling/manifest.mjs` (9 lines)
- `src/scheduling/index.mjs` (3 lines)

### Tests
- `tests/scheduling.test.mjs` (79 lines) — 5 test cases

### Documentation
- `docs/bp005/API_INVENTORY.md`
- `docs/bp005/DOMAIN_AND_DATA_MODEL.md`
- `docs/bp005/SCHEDULING_CALENDAR_RULES.md`
- `docs/bp005/REVISION_LOG.md`

### Migration Reference
- `migrations/TNGD-BP-005_REFERENCE.md`

### Foundation and Infrastructure (updated for BP-005)
- `src/foundation.mjs`
- `tests/foundation.test.mjs`
- `scripts/build.mjs`
- `scripts/validate-repository.mjs`
- `package.json`

### Production Documents
- `production/pilot/review/TNGD-BP-005_Completion_Report.md`
- `production/pilot/review/TNGD-BP-005_Scheduling_and_Calendar_Integration.md` (work order)

---

## 2. Validation Gate Results

```
npm.cmd run check — exit code 0

Build: Built foundation, security, intake, customer-case, and scheduling manifests
Tests: 40 passed; 0 failed, 0 skipped, 0 cancelled, 0 todo
Validation: Canonical BP-000/BP-001/BP-002/BP-003/BP-004/BP-005 repository validation passed.
```

All prior package tests (BP-001 through BP-004) continue to pass without regression.

---

## 3. Requirement Verification

### 3.1 BP-004 Service Case Dependency Integrity
**VERIFIED.** `scheduleAuthorized` (line 43) calls `customerCaseService.getServiceCaseAuthorized()` to retrieve the Service Case, then asserts `status === "ready-for-scheduling"` (line 44). This is the exact terminal status produced by BP-004. A missing or wrong-status case throws: `"A BP-004 scheduling-ready Service Case is required."` The constructor requires a `customerCaseService` dependency with `getServiceCaseAuthorized` (validated at line 29). Test "a BP-004 Service Case creates one synchronized BP-006-ready appointment" exercises the full pipeline from guided intake through customer conversion to scheduling.

### 3.2 Tenant Isolation and Scheduling Authorization
**VERIFIED.** The `#authorize()` helper (lines 105–107) delegates to `secureAccess.requirePermission()` with permission `"scheduling.manage"`. Read access uses `"customers.read"`. Every method receives `tenantId` and validates it against stored data: `getAuthorized` checks `value?.tenantId === tenantId` (line 93); `rescheduleAuthorized` checks `current.tenantId !== tenantId` (line 74). Conflict detection in `#assertNoConflict` is tenant-scoped (line 98). Test "technicians cannot schedule and BP-006 dispatch is not implemented" confirms role enforcement: a technician is denied `scheduling.manage`.

### 3.3 Idempotent Appointment Creation
**VERIFIED.** The `#byCase` Map keys on `${tenantId}:${serviceCaseId}` (line 41). If an appointment already exists for that key, the cached appointment is returned immediately (line 42) without creating duplicates. The calendar gateway also uses `idempotencyKey: ${tenantId}:${serviceCaseId}` (line 51), returning the existing event on repeat calls. Test "appointment creation is idempotent per tenant Service Case" asserts reference equality: `first === second`.

### 3.4 Calendar-Gateway Synchronization
**VERIFIED.** `InMemoryCalendarGateway` implements `createEvent` and `updateEvent` with idempotency-key-based deduplication. `createEvent` returns a frozen event with `provider: "approved-calendar-adapter"` and `externalEventId` (lines 7–16). `updateEvent` merges changes onto the existing event (lines 20–25). The scheduling service calls `createEvent` during initial scheduling (line 50) and `updateEvent` during rescheduling (line 77). The appointment stores the calendar reference. Test asserts `appointment.calendar.provider === "approved-calendar-adapter"` and rescheduling preserves the same `externalEventId`.

### 3.5 Appointment Conflict Detection
**VERIFIED.** `#assertNoConflict` (lines 96–103) iterates all appointments in the tenant and checks for interval overlap using `proposed.startsAt < appointment.endsAt && proposed.endsAt > appointment.startsAt`. Same-tenant overlaps throw: `"Appointment conflicts with an existing tenant calendar interval."` The `excludedId` parameter allows rescheduling to exclude the appointment being changed. Test "overlapping tenant appointments are rejected" creates two distinct service cases (via unique contact suffixes) and confirms the second overlapping schedule throws `/conflicts/`.

### 3.6 Governed Rescheduling
**VERIFIED.** `rescheduleAuthorized` (lines 71–88) requires `scheduling.manage`, validates tenant ownership, re-validates the interval, runs conflict detection excluding the current appointment, updates the calendar event via `updateEvent`, increments `revision`, records `rescheduledAt`, `rescheduledBy`, and `rescheduleReason`, and appends an `AppointmentRescheduled` audit event. The appointment is re-frozen after mutation. Test "rescheduling updates the same calendar event with revision evidence" confirms `next.id === first.id`, `next.revision === 2`, and same `externalEventId`.

### 3.7 Audit-Chain Evidence
**VERIFIED.** The `#record` helper (lines 109–114) appends to the shared `AuditLog` with `type` (`AppointmentScheduled` or `AppointmentRescheduled`), `action: "scheduling.manage"`, `outcome: "granted"`, and metadata including `serviceCaseId`, `revision`, and `targetPackage: "TNGD-BP-006"`. The main test asserts `auditLog.verify() === true` confirming hash-chain integrity after scheduling.

### 3.8 BP-006-Ready Handoff
**VERIFIED.** The appointment includes `technicianAssignmentStatus: "ready-for-bp006"` (line 62). Audit metadata includes `targetPackage: "TNGD-BP-006"`. The manifest declares `handoffTarget: "TNGD-BP-006"`. Test asserts `appointment.technicianAssignmentStatus === "ready-for-bp006"`.

### 3.9 No Technician Assignment, Dispatch, Routing, or Capacity Implementation
**VERIFIED.** The source contains no `assignTechnician`, `optimizeRoute`, `dispatchAuthorized`, `technicianId`, or `route` fields — the validate-repository script explicitly forbids these strings in the scheduling source (lines 311). Appointments carry `technicianAssignmentStatus: "ready-for-bp006"` as a readiness marker, not an assignment. Test asserts `"technicianId" in appointment === false` and `"route" in appointment === false`.

### 3.10 Consistency Across Source, Tests, Manifest, Documentation, and Migration Reference
**VERIFIED.**
- **Manifest capabilities** match `foundation.bp005FeatureScope` exactly (6 items, validated by repository script line 182).
- **Manifest** declares `entity: "Appointment"`, `states: ["scheduled"]`, `calendarBoundary: "approved-provider-gateway"`, `handoffTarget: "TNGD-BP-006"`, `persistence.boundary: "in-memory"`.
- **API Inventory** documents 3 operations (`scheduleAuthorized`, `rescheduleAuthorized`, `getAuthorized`) plus 2 gateway methods — matching implementation exactly.
- **Scheduling rules** (7 rules) accurately describe the implementation logic including status gate, idempotency, UTC storage, conflict detection, calendar gateway, audit, and BP-006 exclusion.
- **Domain model** describes the Appointment entity consistent with implementation fields.
- **Migration reference** describes tenant-owned appointment and revision records with UUID defaults, UNIQUE constraints, non-overlapping interval enforcement, RLS, and immutable audit evidence — consistent with the in-memory implementation.
- **Build script** generates `scheduling-manifest.json` alongside the 4 existing manifests.
- **Package.json** test command includes `scheduling.test.mjs` as the sixth test file.
- **Foundation** lists `TNGD-BP-005` in `implementedPackages` and declares `bp005FeatureScope`.
- **Foundation test** asserts exact BP-005 scope.
- **Validate-repository** enforces BP-005 source boundaries, test evidence names, manifest alignment, and forbidden dispatch/technician terms.

### 3.11 No Regressions Across BP-000 Through BP-004
**VERIFIED.** All 40 tests pass: 8 foundation (including BP-005 scope), 11 security (BP-001), 5 intake (BP-002), 6 guided-intake (BP-003), 5 customer-case (BP-004), 5 scheduling (BP-005). The repository validator enforces all prior package boundaries, source boundary checks, and test evidence names through BP-005 without relaxing any prior constraint.

---

## 4. Findings

**No defects identified.**

The implementation is complete, correctly scoped, and internally consistent. All 11 verification requirements are satisfied. BP-005 consumes the BP-004 handoff contract, synchronizes through a governed calendar gateway, and produces BP-006 readiness without implementing technician assignment, dispatch, routing, or capacity.

---

## 5. Disposition

| Package | Disposition |
|---|---|
| TNGD-BP-005 | **ACCEPTED** |

No Localized Corrections required.

---

## 6. Acceptance Recommendation

TNGD-BP-005 is recommended for Executive Acceptance. Manufacturing is complete, all 40 tests pass with no regression, documentation is accurate, scope boundaries are correct, and the six-package pilot cadence is complete.

---

## 7. Six-Package Production Checkpoint

This review completes the six-package pilot cadence (BP-000 through BP-005). Upon Executive Acceptance of BP-005:

- All 6 packages will reside in `production/pilot/done/`
- BP-006 (Dispatch Board) is the next dependency-ready target on Conveyor B
- BP-006 activation requires renewed Executive continuation approval — it is not automatically authorized by this review
- No outstanding LCOs remain in the pilot queue

---

## 8. Queue Observations

1. BP-004 has been accepted and moved to `production/pilot/done/` with Executive Acceptance record — confirmed in this pull.
2. `production/inbox/test.txt` status unchanged from prior reviews.
3. The pilot conveyor now holds 6 manufactured, reviewed packages (BP-000 through BP-005) pending BP-005 Executive Acceptance to complete the cadence.
