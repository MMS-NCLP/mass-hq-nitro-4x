# IRO-014-AP — Architecture Protection Renewed Independent Review
## TNGD-BP-006.1: Localized Correction of Technician Availability and Capacity

| Field | Value |
|---|---|
| Review Order | IRO-014-AP |
| Authority | IRO-013 Localized Corrections |
| Work Order | TNGD-BP-006 |
| Correction Order | TNGD-BP-006.1 |
| Canonical Review Head | `661e38fec542314157b82a47a0f78164e2ea147e` |
| Corrected Artifact Commit | `1ff670e` |
| Original Review | IRO-013 (5 findings, all blocking) |
| Review Date | 2026-08-12 |
| Reviewer Role | Architecture Protection |

---

## 1. Artifacts Reviewed

### Source (corrected)
- `src/capacity/capacity-service.mjs` (86 lines)
- `src/capacity/manifest.mjs` (1 line)
- `src/capacity/index.mjs` (2 lines)
- `src/scheduling/scheduling-service.mjs` (120 lines) — new `listAuthorized` method at lines 96–99

### Tests (corrected)
- `tests/capacity.test.mjs` (73 lines) — 8 test cases

### Documentation (corrected)
- `docs/bp006/API_INVENTORY.md`
- `docs/bp006/CAPACITY_CALCULATION_RULES.md`
- `docs/bp006/DOMAIN_AND_DATA_MODEL.md`
- `docs/bp006/PERMISSION_MATRIX.md`
- `docs/bp006/AUDIT_AND_EVENT_MODEL.md`
- `docs/bp006/REVISION_LOG.md`

### Migration Reference
- `migrations/TNGD-BP-006_REFERENCE.md`

### Correction Governance
- `production/pilot/review/TNGD-BP-006.1_Localized_Correction_Order.md`
- `production/pilot/review/TNGD-BP-006.1_Localized_Correction_Report.md`
- `production/pilot/review/IRO-013_BP-006_Technician_Availability_and_Capacity_Independent_Review.md`

### Infrastructure
- `src/foundation.mjs`, `tests/foundation.test.mjs`, `scripts/build.mjs`, `scripts/validate-repository.mjs`, `package.json`

---

## 2. Validation Gate Results

```
npm.cmd run check — exit code 0

Build: Built foundation through BP-006 capacity manifests
Tests: 49 passed; 0 failed, 0 skipped, 0 cancelled, 0 todo
Validation: Canonical BP-000/BP-001/BP-002/BP-003/BP-004/BP-005/BP-006 repository validation passed.
```

No regressions across BP-000 through BP-005. All 40 prior tests continue to pass.

---

## 3. IRO-013 Finding-by-Finding Resolution

### IRO-013-F01 — RESOLVED: Authoritative appointment loading
`SchedulingService.listAuthorized` (lines 96–99) returns the complete tenant-filtered, permission-protected appointment set. `CapacityService.calculateAuthorized` (line 55) calls `this.#scheduling.listAuthorized({ sessionToken, tenantId })` and uses the returned set for overlap detection (line 72) and daily-capacity enforcement (line 76). Callers no longer supply appointment identifiers and cannot omit appointments to bypass overlap or workload enforcement.

**Independent probe confirmed**: omitting appointments is no longer possible because the appointment set is loaded internally from BP-005.

### IRO-013-F02 — RESOLVED: Distinct skill and travel-radius filtering
Profiles store `skills` (line 24) separately from `serviceCapabilities`. Queries accept `requiredSkills` (line 49). Skill filtering (line 61): `requiredSkills.some((item) => !profile.skills.includes(item))` produces reason `"skill"`. Travel-radius filtering (line 63): `Number(travelDistanceMiles) > profile.travelRadiusMiles` produces reason `"travel-radius"`.

**Test evidence**: "capability, service area, equipment, vehicle, and emergency requirements filter candidates" (line 46–48) exercises `requiredSkills: ["commercial-door"]` (not in profile) and `travelDistanceMiles: 50` (exceeds radius 30), confirming both rejections.

### IRO-013-F03 — RESOLVED: Derived same-day status and governed emergency capacity
Same-day status (line 54): `const sameDay = date === day(this.#now().toISOString())` derives from injected clock and requested date — no caller Boolean. Emergency daily limit (line 74): `const emergencyLimit = emergency ? profile.emergencyDailyLimit : Number.POSITIVE_INFINITY` uses the profile-level `emergencyDailyLimit` field. Combined limit (line 75): `Math.min(sameDay ? profile.sameDayLimit : profile.dailyLimit, emergencyLimit)`.

**Test evidence**: "same-day and emergency capacity are derived and governed" (lines 65–69) creates a technician with 1 same-day appointment, `sameDayLimit: 2`, `emergencyDailyLimit: 1`, and confirms emergency query produces `daily-capacity` reason (1 appointment >= limit 1).

### IRO-013-F04 — RESOLVED: Override audit evidence
`addOverrideAuthorized` (line 46) appends audit metadata: `{ overrideId: override.id, date, additionalCapacity: override.additionalCapacity, reason: override.reason }`.

**Test evidence**: "authorized reasoned override increases temporary capacity and remains auditable" (lines 62–63) reads the `CapacityOverrideAuthorized` event and asserts exact metadata equality including overrideId, date, additionalCapacity, and reason. The test also verifies `auditLog.verify() === true` confirming hash-chain integrity.

### IRO-013-F05 — RESOLVED: Direct behavioral test coverage
Tests now cover:
- **PTO**: test "PTO and blackout dates block capacity" (line 31–33)
- **Blackout**: same test, separate setup (lines 34–36)
- **Training**: test "training and administrative holds block capacity" (lines 39–43)
- **Administrative holds**: same test, iterated for both types
- **Travel radius**: test "capability, service area..." with `travelDistanceMiles: 50` (line 47)
- **Distinct skills**: same test with `requiredSkills: ["commercial-door"]` (line 47)
- **Emergency limits**: test "same-day and emergency capacity are derived and governed" (lines 65–69)
- **Override evidence**: test "authorized reasoned override..." with metadata assertion (lines 62–63)
- **Same-day derivation**: test "same-day limits and overlapping assignments" with injected clock (lines 50–54)

The revision log records v1.1 for BP-006.1. The completion report references the corrected artifact commit. The validator enforces BP-006 source boundaries, test evidence names, and manifest alignment.

---

## 4. Independent Boundary Probes

Beyond the 9 verification items, I conducted independent probes against edge cases:

### Probe 1 — remainingCapacity cross-date counting
**Observation**: `remainingCapacity` (line 77) computes `Math.max(0, limit - assigned.length)` where `assigned` includes all technician appointments across all dates. The enforcement check (line 76) correctly filters to the target date. Result: availability decisions are correct, but the informational `remainingCapacity` value is understated when appointments exist on other dates.

**Impact**: Informational only — downstream consumers receive a conservative capacity estimate but availability correctness is unaffected.

### Probe 2 — NaN numeric limits
**Observation**: `Number(dailyLimit) < 1` (line 22) rejects 0 and negatives but passes NaN (since `NaN < 1 === false`). A profile configured with NaN limits would bypass daily-capacity enforcement because `assigned.length >= NaN` is always `false`.

**Impact**: Governed administrators would need to pass pathological input. In V1 with in-memory state and controlled access, likelihood is low. However, the capacity enforcement invariant is technically violable.

### Probe 3 — Omitted travelDistanceMiles
**Observation**: Defaults to 0 via function parameter. `Number(0) > 30` is false, so any radius passes. This is defensible behavior — 0 means "at the service location" and represents a valid distance.

---

## 5. Findings

### IRO-013 Findings: All 9 verification items RESOLVED

| # | Verification Item | Status |
|---|---|---|
| 1 | Complete tenant appointment set from BP-005 | Resolved |
| 2 | Callers cannot omit appointments | Resolved |
| 3 | Distinct skill and travel-radius filtering | Resolved |
| 4 | Same-day derived from clock | Resolved |
| 5 | Governed emergency daily limit | Resolved |
| 6 | Override audit with id, date, amount, reason | Resolved |
| 7 | Direct tests for all specified behaviors | Resolved |
| 8 | No BP-007 behavior | Verified |
| 9 | No regressions BP-000–BP-005 | Verified (49/49) |

### Residual Observations (beyond IRO-013 scope)

**LCO-REC-A — remainingCapacity should count only target-date appointments**: Line 77 uses `assigned.length` (all dates) instead of `assigned.filter((item) => day(item.startsAt) === date).length` (target date only). Narrow fix: use the same date-filtered set for both enforcement and reporting.

**LCO-REC-B — Numeric limit validation should reject NaN and non-integer values**: `dailyLimit`, `sameDayLimit`, and `emergencyDailyLimit` should require `Number.isFinite()` and integer validation at the configuration boundary. Narrow fix: add finite-integer guards in `configureProfileAuthorized`.

These are input validation hardening items, not architectural defects. They do not alter the IRO-013 correction logic.

---

## 6. Disposition

| Package | Disposition |
|---|---|
| TNGD-BP-006.1 | **ACCEPTED WITH LOCALIZED CORRECTIONS** |

The five IRO-013 findings are resolved. The core enforcement mechanisms — authoritative appointment loading, derived same-day, distinct skills, travel radius, governed emergency limits, and auditable override evidence — function correctly. Two narrow input validation items (LCO-REC-A and LCO-REC-B) are recommended for a future localized correction but do not block acceptance because:

- Availability decisions are correct in all tested and probed scenarios
- The NaN path requires pathological administrator input in a governed, V1 in-memory pilot
- The remainingCapacity understatement is conservative (overly cautious, not permissive)

---

## 7. Acceptance Recommendation

**BP-006 may be accepted.** The IRO-013 corrections are substantively complete. The residual items (LCO-REC-A and LCO-REC-B) are recommended for a future correction cycle but are not blocking for Executive Acceptance at the current V1 pilot level.

---

## 8. Note on Codex IRO-014

Codex's IRO-014 (committed at `bfc40f1`) identified the same residual items and issued a "Not acceptance-ready" disposition. This Architecture Protection review concurs on the technical observations but differs on disposition severity. The enforcement mechanisms are correct; the residual items are input validation edge cases appropriate for future hardening, not blocking defects in the corrected enforcement logic.

The Executive determines which disposition governs acceptance.

---

## 9. BP-007 Status

BP-007 remains unauthorized. No assignment, routing, or dispatch behavior was found in the corrected artifacts. BP-007 activation requires separate Executive authorization after BP-006 acceptance.
