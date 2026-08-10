# IRO-009 — Implementation Review

## Review Control

| Field | Value |
|---|---|
| Review ID | IRO-009 |
| Review Date | 2026-08-10 |
| Reviewer | Architecture Protection (Claude) |
| Repository | `MMS-NCLP/mass-hq-nitro-4x` |
| Canonical Head | `677ab287ebfe847d3364bdaaa7fca77e97285e0f` |
| Packages Reviewed | 2 (TNGD-BP-002, MASS-APP-015 V02) |
| Review Type | Independent Implementation Review |

---

# Package 1: TNGD-BP-002 — Three-Path Intake and Lead Capture

## Commits Reviewed

| Purpose | SHA |
|---|---|
| Artifact commit | `2ccb62478d11b6a4e54b6b3d6c1fb9c00260a81b` |
| Review submission | `14ecad7888b455a83313c92eef138638ac98ed63` |

## Artifacts Reviewed

| File | Lines |
|---|---|
| `src/intake/intake-service.mjs` | 163 |
| `src/intake/index.mjs` | 3 |
| `src/intake/manifest.mjs` | 27 |
| `src/security/portal-boundary.mjs` | 87 |
| `src/foundation.mjs` | 55 |
| `tests/intake.test.mjs` | 163 |
| `tests/foundation.test.mjs` | 52 |
| `scripts/build.mjs` | Modified |
| `scripts/validate-repository.mjs` | Modified |
| `package.json` | Modified |
| `production/pilot/review/TNGD-BP-002_Completion_Report.md` | 50 |
| `production/pilot/review/TNGD-BP-002_Three_Path_Intake_and_Lead_Capture.md` | 35 |

## Validation Gate

```
npm run check
```

| Gate | Result |
|---|---|
| Build | Passed — foundation, security, and intake manifests generated |
| Tests | 21 passed, 0 failed, 0 skipped, 0 cancelled |
| Repository Validation | `Canonical BP-000/BP-001/BP-002 repository validation passed.` |
| Exit Code | 0 |

Tests independently inspected: 5 foundation tests (project, runtime, feature scope, BP-002 scope, persistence seams), 5 intake tests (three paths, eight answers, customer reuse/isolation, authenticated intake, public portal), 11 pre-existing BP-000/BP-001 security tests (authentication, roles, tenant isolation, portal separation, session management, audit chain, password recovery, identity keying, audit storage, concurrent bootstrap, concurrent reset).

## Requirement Verification

### Three Intake Paths

`INTAKE_PATHS` defines `repair`, `estimate`, and `other-services` (line 3-7). `normalizePath` validates input against these three values and rejects anything else (line 24-30). Test "all three authorized intake paths create service requests" iterates all three and verifies each creates a tenant-scoped service request with the correct path (line 32-48). **Verified.**

### Eight Required Answers

`REQUIRED_QUESTIONS` lists exactly: name, phone, email, serviceAddress, serviceCategory, serviceNeed, urgency, preferredContact (line 9-18). `normalizeAnswers` validates all eight are non-empty after trimming (line 32-50). Test "the intake foundation requires all eight authorized answers" removes each field individually and confirms a rejection containing the field name; verifies zero service requests survive (line 50-65). **Verified.**

### Tenant-Keyed Customer Reuse and Deduplication

`customerKey` constructs `${tenantId}:${email || phone}` (line 52-56). The `#customers` Map stores by this key and returns the existing customer on match (line 105-115). Test "initial customer capture reuses a tenant customer and isolates tenants" confirms: same tenant + same email reuses customer ID; different tenant + same email creates a new customer ID; cross-tenant lookups by customer ID and request ID return null (line 67-87). **Verified.**

### Authenticated and Approved-Public Intake Boundaries

**Authenticated:** `submitAuthorized` requires a `secureAccess` instance and calls `requirePermission` with `intake.create` before creating the request (line 78-96). The test bootstraps an admin, creates a technician, confirms the admin can create intake (`source: "internal-portal"`), and confirms the technician is denied with zero state mutation (line 89-134). **Verified.**

**Approved-public:** `PortalBoundary.submitPublic` restricts actions to `intake.submit` only, sanitizes payload through `sanitizePublicIntake` (strips to 9 allowlisted fields), and delegates to the intake service via a `publicIntakeSink` callback (portal-boundary.mjs line 1-65). The test confirms a valid public submission succeeds, extra fields don't cross the boundary (`ignoredField` absent from answers), and a non-allowlisted action (`intake.delete`) is denied with zero state mutation (line 137-162). Denied actions are recorded to the audit log before rejection. **Verified.**

### Service-Request Creation and Audit Integration

`#createRequest` produces a frozen service request with `randomUUID()` ID, tenant isolation, customer reference, intake path, answers, source, and `status: "received"` (line 99-143). Every request appends a `ServiceRequestCreated` audit event with tenant, principal, resource, action, outcome, and metadata (line 129-141). All five intake tests verify audit log integrity; the authenticated and public tests explicitly assert `auditLog.verify() === true` (line 134, 161). **Verified.**

### BP-001 Security-Contract Consumption

`IntakeService` accepts a `secureAccess` parameter from BP-001 (line 65-71). `submitAuthorized` delegates permission enforcement to `secureAccess.requirePermission` (line 83-88). `PortalBoundary` uses `secureAccess` for public boundary recording and `runInternal` for authenticated gateway operations (portal-boundary.mjs line 29-86). Tests import `AuditLog`, `PortalBoundary`, and `SecureAccess` from `../src/security/index.mjs` (BP-001 exports). **Verified.**

### Concurrency and Tenant-Isolation Behavior

Customer and service-request Maps are keyed by tenant-prefixed identifiers. All read accessors (`getCustomer`, `getServiceRequest`, `listServiceRequests`) filter by `tenantId` and return `null` for mismatches (line 146-161). Pre-existing BP-001 tests verify: "exactly one concurrent tenant bootstrap succeeds without corrupting identity state" and "exactly one concurrent password reset succeeds without corrupting credentials" — both passed. Cross-tenant isolation tested at intake level (line 67-87). **Verified.**

### BP-003 or Later Scope

No scheduling, dispatch, job assignment, guided intake (beyond the 8 foundation questions), reporting, HTTP server, UI framework, persistence provider, deployment, or Jcode configuration was introduced. `foundation.bp002FeatureScope` lists exactly the six authorized responsibilities. Completion report explicitly states: "No persistence provider, HTTP server, UI framework, deployment provider, scheduling, dispatch, job, or reporting behavior was introduced." No APP-015, governance, or NCLP files were modified. **Verified — no scope creep.**

### In-Memory Persistence Boundary

`IntakeService` stores customers and requests in `#customers = new Map()` and `#requests = new Map()` — both are process-local private fields (line 59-60). `intakeManifest.persistence.boundary` is explicitly `"in-memory"` (manifest.mjs line 23-25). Completion report states: "BP-002 retains process-local, in-memory customer and service-request state. The work order does not authorize a database, durable schema, ORM, or migration runner, so no migration was added." No database connection, ORM, or durable persistence exists anywhere in the implementation tree. **Verified — explicitly bounded and not misrepresented.**

## BP-002 Findings

**No architectural, security, dependency, or integrity defects found.**

## BP-002 Disposition

**ACCEPTED**

No localized corrections required.

---

# Package 2: MASS-APP-015 V02 — Plugin Lifecycle, Installation & Dependency Management

## Commits Reviewed

| Purpose | SHA |
|---|---|
| Artifact commit | `23e547008110614cc1b8ccce1b61cdf9dcb67340` |
| Review submission | `677ab287ebfe847d3364bdaaa7fca77e97285e0f` |

## Artifacts Reviewed

| # | File | Content |
|---|---|---|
| 1 | `MASS-APP-015-V02_Plugin_Lifecycle_Installation_and_Dependency_Management.md` | 154-line production markdown |
| 2 | `MASS-APP-015-V02_Plugin_Lifecycle_Installation_and_Dependency_Management.pdf` | 6-page canonical PDF |
| 3 | `MASS-APP-015-V02_Architecture.mmd` | Flowchart LR — lifecycle architecture |
| 4 | `MASS-APP-015-V02_Plugin_Lifecycle_State_Machine.mmd` | StateDiagram-v2 — 17 states |
| 5 | `MASS-APP-015-V02_Dependency_Resolution_Rules.md` | Edge rules, cycle handling, scope rules, output contract |
| 6 | `MASS-APP-015-V02_Installation_and_Rollback_Contract_Examples.json` | Install request, plan, rollback request, rollback result |
| 7 | `MASS-APP-015-V02_API_Inventory.csv` | 21 rows (header + 20 endpoints) |
| 8 | `MASS-APP-015-V02_Data_Model.csv` | 18 rows (header + 17 entities) |
| 9 | `MASS-APP-015-V02_Migration_Reference.sql` | 296 lines — 17 tables, triggers, RLS, policies |
| 10 | `MASS-APP-015-V02_Folder_Structure.txt` | 25-line directory and reference listing |
| 11 | `MASS_Build_Manifest.md` | Updated — V02 checked |
| 12 | `MASS-APP-015_Revision_Log.md` | Updated — V02 entry added |
| 13 | `EWO-MASS-APP-015-V02_Completion_Report.md` | Manufacturing validation record |
| 14 | `EWO-MASS-APP-015-V02.md` | Work order (moved active → review) |

## Requirement Verification

### Lifecycle States and Transitions

Markdown Section 8 declares 17 primary states: `requested`, `planning`, `awaiting_approval`, `approved`, `installing`, `installed`, `activating`, `active`, `suspending`, `suspended`, `upgrading`, `rolling_back`, `repairing`, `removing`, `removed`, `recovery_required`, `failed`.

State Machine Mermaid (32 lines) defines all 17 states with transition guards. Key paths verified:
- Request → plan → approve → install → activate: `requested → planning → awaiting_approval → approved → installing → installed → activating → active`
- Suspend and resume: `active → suspending → suspended → activating → active`
- Upgrade and rollback: `active/suspended → upgrading → active` or `upgrading → rolling_back → active/recovery_required`
- Recovery: `recovery_required → repairing → installed/active/failed`
- Removal: `installed/suspended/failed → removing → removed`
- Failure paths: `planning/awaiting_approval → failed`, `installing/activating/rolling_back → recovery_required`

Transitions require expected state, revision, plan digest, authorization, and idempotency key (Markdown Section 8). **Verified.**

### Installation, Activation, Suspension, Upgrade, Rollback, and Uninstall Contracts

| Contract | Markdown Section | API Endpoint | Operation Type |
|---|---|---|---|
| Install | 9 | `POST /plugin-installations/{id}/install` | `install` |
| Activate | 9 | `POST /plugin-installations/{id}/activate` | `activate` |
| Suspend | 9 | `POST /plugin-installations/{id}/suspend` | `suspend` |
| Resume | 9 | `POST /plugin-installations/{id}/resume` | `resume` |
| Upgrade | 10 | `POST /plugin-installations/{id}/upgrade` | `upgrade` |
| Downgrade | 10 | `POST /plugin-installations/{id}/downgrade` | `downgrade` |
| Rollback | 10 | `POST /plugin-installations/{id}/rollback` | `rollback` |
| Repair | 10 | `POST /plugin-installations/{id}/repair` | `repair` |
| Remove | 13 | `POST /plugin-installations/{id}/remove` | `remove` |

All 9 operation types match the `lifecycle_operation.operation_type` CHECK constraint in SQL. JSON contract examples provide installation request, immutable plan, rollback request, and rollback result. **Verified.**

### Dependency Resolution and Partial-Failure Behavior

**Dependency resolution:** Companion document defines inputs, deterministic resolution algorithm (7 steps), edge rules for all 4 kinds (required/optional/peer/conflict), cycle handling, scope rules, human decision boundary, and output contract. SQL tables `dependency_resolution` and `resolved_dependency` capture resolution state, selected/omitted dispositions, and reason chains. Resolution status CHECK: running/resolved/blocked. Dependency kind CHECK: required/optional/peer/conflict. Disposition CHECK: selected/already_satisfied/omitted/blocked. **Verified.**

**Partial failure:** Markdown Section 12 states failure atomically records completed-step boundary and durable evidence before entering recovery. `lifecycle_step.status` CHECK includes `failed`, `compensated`, `skipped_by_approved_plan`. Recovery resumes from last verified checkpoint or executes approved compensation. If audit/outbox persistence fails, the state transition fails and remains retryable. Irreversible steps are never hidden. **Verified.**

### Tenant-Safe Schema Constraints

Performed independent SQL invariant verification:

| Invariant | Expected | Actual | Status |
|---|---|---|---|
| Tables with `DEFAULT gen_random_uuid()` PKs | 17 | 17 | Pass |
| Tables with `UNIQUE(id, tenant_id)` | 17 | 17 | Pass |
| Tables with `ENABLE ROW LEVEL SECURITY` | 17 | 17 | Pass |
| Tables with `auth.jwt()`-derived tenant policies | 17 | 17 | Pass |
| Composite tenant-safe foreign keys | 31 | 31 | Pass |
| Self-approval prevention trigger | 1 | 1 | Pass |
| Immutable evidence triggers | 7 tables | 7 tables | Pass |
| State-protected triggers | 5 tables | 5 tables | Pass |
| Outbox protection trigger | 1 | 1 | Pass |

**Self-approval prevention:** `app015_v02_prevent_self_approval()` trigger on `plan_approval` joins through `installation_plan` → `installation_request` to retrieve `requested_by`, then rejects if `requester = decided_by` or if `plan_digest` doesn't match the plan. **Verified.**

**Immutable evidence:** `app015_v02_protect_evidence()` applies BEFORE UPDATE OR DELETE on: `plan_approval`, `migration_checkpoint`, `rollback_evidence`, `removal_record`, `lifecycle_audit`, `health_finding`, `installation_version_record`. **Verified.**

**State-conditioned immutability:** `app015_v02_protect_state_record()` prevents mutation of: resolved/blocked dependency resolutions, resolved edges, approved/rejected/expired/superseded plans, succeeded/failed/recovery_required operations, terminal steps. **Verified.**

**Outbox protection:** `app015_v02_protect_outbox()` prevents payload rewrite, event type change, aggregate change, and deletion. Only `published_at` can be set once. **Verified.**

### API, Data Model, SQL, Markdown, Diagrams, Folder Structure, Manifest, and Revision Log Agreement

| Artifact Pair | Agreement |
|---|---|
| API CSV (20 endpoints) ↔ Markdown §15 | Endpoints match; Markdown references CSV |
| Data Model CSV (17 entities) ↔ SQL (17 tables) | Entity names and purposes correspond 1:1 |
| SQL columns ↔ Markdown entity descriptions | All described fields present in SQL |
| Mermaid architecture ↔ Markdown §4-5 | Gateway flow matches consumption map |
| Mermaid state machine ↔ Markdown §8 | 17 states match; transitions consistent |
| Folder structure ↔ actual files | All 9 artifacts and 4 update references present |
| Build Manifest | V02 checked with correct authority and date |
| Revision Log | V02 entry added with scope description |
| Completion Report | Artifact count (13), commit SHA, validation record all correct |

**Verified — all artifacts agree.**

### V01 Contracts Consumed Without Duplication

V02 references V01 through `plugin_version_id` foreign keys (composite tenant-safe FKs to `plugin_version(id, tenant_id)` — V01's table). V02 does not create its own plugin, version, capability, or manifest tables. Markdown §2 states "V01 remains authoritative for manifests, versions, capabilities, and declared dependencies." Markdown §4 Platform Consumption Map lists V01 as a consumed source. **Verified — no duplication.**

### LCO-008-A/B/C Status

LCO-008-A/B/C are corrections for APP-015 V01, not V02. Searched all V02 artifacts for any claim of LCO-008 application:
- Completion Report: No mention
- Work Order: No mention
- Build Manifest: No mention
- Revision Log: V02 entry does not reference LCO-008

Production State Report and PRR-001 both independently confirm LCO-008-A/B/C remain unapplied. **Verified — not falsely represented as applied.**

### PDF Visual Inspection

Six-page Letter-format PDF inspected:

| Page | Content | Rendering |
|---|---|---|
| 1 | Title, document control, mission statement | Clean — no clipping, overlap, or artifacts |
| 2 | Mission/ownership table, permanent architecture, human authority, role mapping | Clean — tables render correctly |
| 3 | Controlled installation flow (7-step table), dependency resolution, scope rules | Clean — tables and bullet lists render correctly |
| 4 | Lifecycle state and recovery, upgrade/rollback/repair, partial failure, safe removal | Clean — phase table renders correctly |
| 5 | Platform gateways (11-row table), database enforcement, migration ownership | Clean — no clipping |
| 6 | Contract surface (7-row API table), constitutional boundary, artifact references | Clean — complete |

Headers consistent: "MASS HQ / APP-015 PLUGIN & CAPABILITY FRAMEWORK". Footers consistent: "Production Baseline v1.0 | EWO-MASS-APP-015-V02 | 2026-08-10 [page]". No black squares, broken tables, unreadable text, or orphaned content. **Verified — structurally sound.**

### Unavailable Validation Disclosure

Completion Report explicitly states: "A live PostgreSQL/Supabase migration was not executed because the artifact package provides reference DDL and the repository documents no V02 database harness or connection. Mermaid CLI rendering is not claimed; source-level graph checks were completed." **Verified — properly disclosed.**

## APP-015 V02 Findings

### Finding 1 — `plugin_installation.state` Missing CHECK Constraint

**Location:** `MASS-APP-015-V02_Migration_Reference.sql` line 79

`plugin_installation.state` is declared as `text NOT NULL DEFAULT 'requested'` without a CHECK constraint limiting it to the 17 declared lifecycle states. Every other status/state/disposition column in the V02 SQL uses a CHECK constraint:

| Column | Table | CHECK Present |
|---|---|---|
| `status` | `prerequisite_finding` | Yes |
| `status` | `dependency_resolution` | Yes |
| `disposition` | `resolved_dependency` | Yes |
| `status` | `installation_plan` | Yes |
| `decision` | `plan_approval` | Yes |
| **`state`** | **`plugin_installation`** | **No** |
| `status` | `lifecycle_operation` | Yes |
| `status` | `lifecycle_step` | Yes |
| `status` | `migration_checkpoint` | Yes |
| `status` | `health_finding` | Yes |
| `result` | `rollback_evidence` | Yes |

Without the CHECK, any string can be inserted as a state value. The 17-value CHECK is long but consistent with the established pattern. The application layer and state-machine triggers provide partial protection, but database-level enforcement is the documented standard.

**Classification:** Consistency defect — not architectural or security-blocking.

**Required correction:** Add CHECK constraint:
```sql
CHECK (state IN ('requested','planning','awaiting_approval','approved','installing',
  'installed','activating','active','suspending','suspended','upgrading',
  'rolling_back','repairing','removing','removed','recovery_required','failed'))
```

### Finding 2 — PDF Role Table Omits Entitlement Approver

**Location:** PDF page 2, Role Mapping table

The authoritative Markdown (Section 3) defines 8 roles:

1. Installation Viewer
2. Installation Requester
3. Plugin Operator
4. Lifecycle Steward
5. Installation Approver
6. Security Approver
7. Entitlement Approver
8. Executive Approver

The PDF (page 2) shows 6 rows:

1. Installation Viewer
2. Installation Requester
3. Plugin Operator
4. Lifecycle Steward
5. Installation / Security Approver (consolidated)
6. Executive Approver

The Entitlement Approver role is absent from the PDF. Security Approver is merged into a single row with Installation Approver. A reader using only the PDF would not know that entitlement confirmation requires a specialized approver role, or that Security Approver is a distinct Administrator specialization.

**Classification:** Content discrepancy between authoritative source and derived artifact. Not architectural — the Markdown is authoritative and correct.

**Required correction:** Regenerate the PDF to include all 8 roles as defined in the Markdown.

## APP-015 V02 Disposition

**Accepted with Localized Corrections**

| LCO | Finding | Scope |
|---|---|---|
| LCO-009-A | Add CHECK constraint to `plugin_installation.state` for 17 declared lifecycle values | `Migration_Reference.sql` line 79 |
| LCO-009-B | Regenerate PDF to include all 8 roles (Entitlement Approver missing, Security Approver consolidated) | PDF page 2 |

Neither finding blocks manufacturing or creates an architectural, security, or dependency defect. Both are localized corrections to a single SQL line and a derived PDF artifact.

---

## Cross-Package Assessment

The two packages share no direct dependency. BP-002 (Conveyor B / Pilot) operates in `implementation/pilot/tngd-dispatch-portal` with in-memory state. APP-015 V02 (Conveyor A / Platform) operates in `docs/applications/MASS-APP-015-plugin-capability-framework/V02` with reference DDL. Neither finding on one package affects the other. Neither package modifies the other's files. **No cross-dependency defects.**

## Outstanding LCOs (All Conveyors)

| LCO | Package | Correction | Status |
|---|---|---|---|
| LCO-007-A | APP-014 V15 | Add `prevent_context_self_approval()` trigger | Awaiting Codex |
| LCO-008-A | APP-015 V01 | Manifest contract completeness | Awaiting Codex |
| LCO-008-B | APP-015 V01 | State-conditioned immutability correction | Awaiting Codex |
| LCO-008-C | APP-015 V01 | Canonical PDF regeneration | Awaiting Codex |
| **LCO-009-A** | **APP-015 V02** | **Add state CHECK constraint** | **New — this review** |
| **LCO-009-B** | **APP-015 V02** | **Regenerate PDF with complete role table** | **New — this review** |

## Next Dependency-Ready Target

| Conveyor | Next Target | Dependency | Status |
|---|---|---|---|
| A (Platform) | LCO-007-A + LCO-008-A/B/C + LCO-009-A/B batch | None — all are independent localized corrections | Ready for Codex |
| A (Platform) | APP-015 V03 — Runtime Capability Invocation | Requires new work order and separate Executive authority | Not yet authorized |
| B (Pilot) | TNGD-BP-003 — Eight-Question Guided Intake | BP-002 acceptance | Ready upon acceptance |

---

*End of IRO-009 Implementation Review.*
