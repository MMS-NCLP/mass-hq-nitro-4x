# TNGD-BP-001 — Secure Access, Roles, and Portal Separation

## Document Control

| Field | Value |
|---|---|
| Package | TNGD-BP-001 |
| Project | MASS-TNGD-PILOT-001 |
| Status | Manufactured — Pending Independent Acceptance |
| Foundation | TNGD-BP-000 |
| Contracts consumed | MASS-ENG-003, MASS-ENG-004 |
| Implementation root | `implementation/pilot/tngd-dispatch-portal/` |

## Implemented Boundary

BP-001 adds reusable security modules under `src/security/` without selecting an external identity provider, database, web framework, or deployment provider.

## Identity and Authentication

- Tenant-scoped, case-normalized identities.
- Password credentials derived with Node.js `scrypt`, unique random salts, and timing-safe comparison.
- Minimum password length and maximum input bound.
- Explicit one-time tenant-administrator bootstrap.
- Failed and successful authentication audit events.
- Enumeration-resistant password-reset requests with injected delivery, expiring single-use tokens, password re-derivation, and active-session revocation.

Credential persistence remains behind the BP-000 persistence seam. The current executable module uses an in-memory repository so behavior can be independently tested without selecting a database provider.

## Role Matrix

| Role | Authorized responsibility |
|---|---|
| `tenant_admin` | Tenant user and role management, audit reading, session revocation, and pilot operations |
| `admin_dispatch` | Customer, intake, scheduling, dispatch, job, and operational-exception work |
| `technician` | Assigned-job reading/updating and evidence capture only |
| `manager` | Operational coordination, job management, scheduling, dispatch, and reports |
| `executive` | Read-only reports, operations awareness, and audit history |

Authorization denies by default. Exact permissions and namespace wildcards are defined in `ROLE_PERMISSIONS`.

## Tenant Isolation

Each authenticated principal is bound to one tenant for the active session. Every protected authorization request supplies the target tenant. A mismatch is denied before role evaluation and recorded as an authorization-denied audit event.

## Session Controls

- 256-bit opaque session tokens.
- Only SHA-256 token digests are retained by the session store.
- Configurable absolute lifetime with an eight-hour default.
- Expired, revoked, inactive-user, and invalid sessions are rejected.
- Logout revokes the session and records the action.

Persistent session storage, rotation policy, cookie transport, and browser controls require a later deployment-aware work order. Raw tokens must never be stored in persistence or audit metadata.

## Portal Separation

`PortalBoundary` exposes distinct methods:

- `submitPublic` accepts only `intake.submit`, copies a fixed safe field allowlist, and rejects internal actions.
- `runInternal` requires a valid session and successful tenant-scoped permission decision before invoking an internal handler.

BP-001 provides the enforcement boundary, not a public website, internal UI, HTTP route, or intake workflow.

## Audit Logging

Security events form an append-only SHA-256 hash chain with sequence number, timestamp, tenant, principal, resource, action, outcome, metadata, and previous-record hash.

The implementation records authentication, identity creation, role changes, session revocation, authorization grants/denials, audit reads, and public-boundary decisions. `AuditLog.verify()` checks chain continuity and content hashes.

Durable append-only storage and external monitoring remain deployment/persistence responsibilities; no provider is selected here.

## Validation Commands

From the canonical implementation root:

```text
npm run build
npm test
npm run validate
npm run check
```

The BP-001 tests cover valid and invalid authentication, password recovery and token reuse rejection, least-privilege enforcement, tenant mismatch denial, public/internal separation, session expiry and revocation, privileged-action auditing, and hash-chain verification.

## Explicit Deferrals

BP-001 does not add a portal UI, HTTP server, database schema, external identity provider, MFA, email delivery, password-recovery delivery channel, deployment provider, customer intake workflow, scheduling, dispatch, or later-package behavior.

## Localized Correction TNGD-BP-001.1

Authority accepted BP-001 for localized correction at repository head `54bc57e4414f142e4cd42fbde6440d1177878e72`.

### Canonical Implementation

The only authorized BP-001 source and test paths are:

- `src/security/passwords.mjs`
- `src/security/audit-log.mjs`
- `src/security/secure-access.mjs`
- `src/security/portal-boundary.mjs`
- `src/security/manifest.mjs`
- `src/security/index.mjs`
- `tests/security.test.mjs`

The competing `src/secure-access.mjs` and `tests/secure-access.test.mjs` paths were removed. Build, test, and repository-validation gates target only the canonical implementation and explicitly reject either discarded path.

### Corrected Authority Metadata

BP-001 feature metadata includes authentication, password recovery, role enforcement, tenant isolation, portal separation, audit logging, and session management.

BP-002 is limited to its exact authorized responsibilities: Repair, Estimate, and Other Services intake paths; the eight-question intake foundation; initial customer capture; and service-request creation. Customer relationship management, service-location ownership, and technician records are not assigned to BP-002 by this correction.

### Preserved Security Controls

- Identity lookup remains keyed by tenant plus normalized email.
- The public portal permits only `intake.submit` and sanitizes an explicit field allowlist.
- Security events use the internal `AuditLog` by default; callers cannot silently disable storage.
- Audit entries remain deeply immutable and SHA-256 hash chained.
- Password-reset requests remain enumeration-resistant, single-use, expiring, and session-revoking.
- Tests now explicitly cover tenant-distinct identical emails and non-discarding default audit storage.

### Correction Validation Gate

The corrected package must run:

```text
npm run check
```

Independent Acceptance must execute that command against the exact correction commit before BP-001.1 is accepted or BP-002 begins.

