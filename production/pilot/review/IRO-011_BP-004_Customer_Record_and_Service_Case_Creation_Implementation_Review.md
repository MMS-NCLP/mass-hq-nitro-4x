# IRO-011 — Independent Implementation Review
## TNGD-BP-004: Customer Record and Service Case Creation

| Field | Value |
|---|---|
| Review Order | IRO-011 |
| Work Order | TNGD-BP-004 |
| Title | Customer Record and Service Case Creation |
| Canonical Review Head | `f5014712e3d8e3858ba455a4546e7900254fd3aa` |
| Artifact Commit Reviewed | `1fffbca02a1507fa0c53da43a538850b83574f68` |
| Review Date | 2026-08-11 |
| Reviewer Role | Architecture Protection |

---

## 1. Artifacts Reviewed

### Source
- `src/customer/customer-case-service.mjs` (214 lines)
- `src/customer/manifest.mjs` (17 lines)
- `src/customer/index.mjs` (3 lines)

### Tests
- `tests/customer-case.test.mjs` (116 lines) — 5 test cases

### Documentation
- `docs/bp004/API_INVENTORY.md`
- `docs/bp004/CONVERSION_AND_DEDUPLICATION_RULES.md`
- `docs/bp004/DOMAIN_AND_DATA_MODEL.md`
- `docs/bp004/PERMISSION_AUDIT_EVENT_MODEL.md`
- `docs/bp004/REVISION_LOG.md`

### Migration Reference
- `migrations/TNGD-BP-004_REFERENCE.md`

### Foundation and Infrastructure (updated for BP-004)
- `src/foundation.mjs`
- `tests/foundation.test.mjs`
- `scripts/build.mjs`
- `scripts/validate-repository.mjs`
- `package.json`

### Production Documents
- `production/pilot/review/TNGD-BP-004_Completion_Report.md`
- `production/pilot/review/TNGD-BP-004_Customer_Record_and_Service_Case_Creation.md` (work order)

---

## 2. Validation Gate Results

```
npm.cmd run check — exit code 0

Build: Built foundation, security, intake, and customer-case manifests
Tests: 34 passed; 0 failed, 0 skipped, 0 cancelled, 0 todo
Validation: Canonical BP-000/BP-001/BP-002/BP-003/BP-004 repository validation passed.
```

All prior package tests (BP-001 through BP-003) continue to pass without regression.

---

## 3. Requirement Verification

### 3.1 Tenant-Safe Customer Matching
**VERIFIED.** `identityKeys()` (line 26) constructs tenant-prefixed keys: `${tenantId}:email:${email}` and `${tenantId}:phone:${phone}`. The `#customerIdentityIndex` Map is keyed by these tenant-scoped identity strings. Email is lowercased; phone is stripped to digits only. A customer matched under one tenant cannot appear in another tenant's identity namespace.

### 3.2 Duplicate-Customer Prevention
**VERIFIED.** `identityKeys()` produces tenant-scoped keys for both email and phone. Before creating a new customer, `convertAuthorized` queries the identity index for all keys. If any key resolves to an existing customer ID, that customer is reused (line 100). New identity keys are registered after creation or match (line 116). Test "matching email or phone reuses the tenant customer while creating a new service case" confirms case-insensitive email matching and phone normalization reuse the same customer.

### 3.3 Identity-Conflict Handling
**VERIFIED.** When email and phone resolve to different existing customer IDs, `matchedIds.size > 1` (line 94) throws: `"Customer identity conflict requires governed stewardship."` The conflict is surfaced for human resolution — never silently merged. Documentation in CONVERSION_AND_DEDUPLICATION_RULES.md rule 5 confirms this design.

### 3.4 Idempotent Intake Conversion
**VERIFIED.** The conversion key is `${tenantId}:${intakeRecordId}` stored in `#conversions` (line 70). Repeat calls with the same tenant and intake record return the cached result without creating duplicate customers, cases, or timeline entries. Test "repeat conversion is idempotent and does not create duplicate cases" verifies `second === first` (reference equality).

### 3.5 Customer Record Creation or Reuse
**VERIFIED.** When no existing customer matches, a new `CustomerRecord` is created with `randomUUID()`, tenant, normalized contact fields, and `createdFromIntakeRecordId` (lines 102–111). The record is deep-frozen and stored. When a match exists, the existing customer is returned without modification. Tenant boundary is enforced at line 112: `customer.tenantId !== tenantId` throws.

### 3.6 Service Case and Initial Customer Timeline Creation
**VERIFIED.** Every successful conversion creates one Service Case (lines 118–135) with: `customerId`, `intakeRecordId`, `intakePath`, `status: "ready-for-scheduling"`, service details extracted from all 8 intake answers, and `createdBy` principal. One Customer Timeline (lines 136–149) with a single `ServiceCaseCreatedFromGuidedIntake` entry linking `sourceReference` to the intake record and `evidenceReferences` to original evidence IDs. Both are deep-frozen and stored by service case ID.

### 3.7 Preservation and Immutability of BP-003 Evidence
**VERIFIED.** The conversion reads from BP-003's `getRecordAuthorized` (line 74) — it never modifies the intake record. The result's `intakeEvidence` object (lines 173–178) carries `intakeRecordId`, `originalEvidence`, `attachments`, and `auditEventIds` as governed references. The entire result is deep-frozen (line 168). The timeline entry references evidence via IDs, not copies. Test "intake evidence remains immutable and scheduling behavior is not implemented" asserts `Object.isFrozen(result)` and `Object.isFrozen(result.intakeEvidence.originalEvidence)`.

### 3.8 Authorization and Tenant Isolation
**VERIFIED.** Every public method calls `#authorize()` (lines 210–212) which delegates to `secureAccess.requirePermission()`. `convertAuthorized` requires `customers.write`; read methods require `customers.read`. Tenant ID flows through every operation and is verified at the data layer (lines 112, 195, 200, 206). Test "tenant boundaries and customer permissions govern conversion and reads" demonstrates: cross-tenant conversion fails because no intake record exists in the other tenant, and a technician role is denied `customers.write` access.

### 3.9 Audit-Chain Integration
**VERIFIED.** `convertAuthorized` appends `IntakeConvertedToCustomerAndServiceCase` to the shared `AuditLog` (lines 153–166) with metadata including `intakeRecordId`, `customerId`, `customerMatched`, and `targetPackage: "TNGD-BP-005"`. The audit event ID is returned in the result. The main test verifies `auditLog.verify() === true` confirming hash-chain integrity.

### 3.10 BP-005-Ready Handoff
**VERIFIED.** The result includes a `handoff` object (lines 180–186): `targetPackage: "TNGD-BP-005"`, `contract: "Scheduling and Calendar Integration"`, `status: "ready"`, `customerId`, `serviceCaseId`. The manifest declares `handoffTarget: "TNGD-BP-005"` and `serviceCaseStatus: "ready-for-scheduling"`. Test asserts `result.handoff.targetPackage === "TNGD-BP-005"`.

### 3.11 Absence of Scheduling, Calendar, and Technician-Assignment Behavior
**VERIFIED.** Source code contains no `scheduledAt`, `calendarEventId`, or `technicianId` fields — the validate-repository script enforces this with explicit forbidden-boundary checks (lines 272–276). The service case status is `ready-for-scheduling` (terminal for BP-004). Test asserts `"appointmentId" in result.serviceCase === false` and `"scheduledAt" in result.serviceCase === false`. Documentation and manifest consistently state BP-004 does not schedule.

### 3.12 Consistency Across Implementation, Tests, Documentation, Manifest, and Migration Reference
**VERIFIED.**
- **Manifest capabilities** match `foundation.bp004FeatureScope` exactly (7 items, validated by repository script lines 154–168).
- **Manifest entities** are `["CustomerRecord", "ServiceCase", "CustomerTimeline"]` — matching the 3 domain objects in the implementation.
- **API Inventory** documents 4 operations matching the 4 public methods in `CustomerCaseService`.
- **Conversion rules** (8 rules) accurately describe the implementation logic.
- **Permission model** matches code: `customers.write` for conversion, `customers.read` for lookups, tenant-keyed audit event.
- **Domain model** describes 3 entities consistent with implementation fields and behaviors.
- **Migration reference** describes 9 persistence requirements consistent with the in-memory implementation.
- **Build script** generates `customer-case-manifest.json` alongside existing manifests.
- **Package.json** test command includes `customer-case.test.mjs` as the fifth test file.
- **Foundation test** includes BP-004 scope assertion.
- **Validate-repository** enforces BP-004 source boundaries, test evidence names, and manifest alignment.
- **Completion report** accurately describes 34 tests, lists all files produced, and correctly declares deferred persistence.

---

## 4. Findings

**No defects identified.**

The implementation is complete, correctly scoped, and internally consistent. All 12 verification requirements are satisfied. The package consumes BP-001 through BP-003 contracts without scope creep and prepares a clean BP-005 handoff without implementing scheduling behavior.

---

## 5. Disposition

| Package | Disposition |
|---|---|
| TNGD-BP-004 | **ACCEPTED** |

No Localized Corrections required.

---

## 6. Acceptance Recommendation

TNGD-BP-004 is recommended for Executive Acceptance. The manufacturing is complete, all tests pass with no regression, documentation is accurate, and scope boundaries are correct.

---

## 7. BP-005 Activation Status

**BP-005 (Scheduling and Calendar Integration) is cleared for activation** upon Executive Acceptance of BP-004. The handoff contract is defined: `customerId`, `serviceCaseId`, `status: "ready-for-scheduling"`, `targetPackage: "TNGD-BP-005"`.

---

## 8. Queue Observations

1. BP-003 has been accepted and moved to `production/pilot/done/` with Executive Acceptance record — confirmed in this pull.
2. `production/inbox/test.txt` remains at canonical head — previously noted, awaiting push of ED-6 housekeeping commit.
3. No outstanding LCOs in the pilot queue.
