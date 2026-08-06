# TNGD-BP-001.1 Localized Correction Report

## Package

- Correction: TNGD-BP-001.1 — Canonical Secure Access Reconciliation
- Parent package: TNGD-BP-001
- Authorized baseline: `54bc57e4414f142e4cd42fbde6440d1177878e72`
- Corrected artifact commit validated: `ddec4663a4304aa4af0265f8b442fb8f7862bc8e`
- Status: Corrected — Pending Independent Acceptance

## Changed Files

### Removed

- `implementation/pilot/tngd-dispatch-portal/src/secure-access.mjs`
- `implementation/pilot/tngd-dispatch-portal/tests/secure-access.test.mjs`

### Corrected

- `implementation/pilot/tngd-dispatch-portal/src/foundation.mjs`
- `implementation/pilot/tngd-dispatch-portal/tests/foundation.test.mjs`
- `implementation/pilot/tngd-dispatch-portal/tests/security.test.mjs`
- `implementation/pilot/tngd-dispatch-portal/scripts/validate-repository.mjs`
- `docs/transition/TNGD-BP-001_Secure_Access_Roles_and_Portal_Separation.md`
- `production/pilot/review/TNGD-BP-001_Completion_Report.md`

### Added for Auditability

- `production/pilot/review/TNGD-BP-001.1_Localized_Correction_Order.md`
- `production/pilot/review/TNGD-BP-001.1_Localized_Correction_Report.md`

## Correction Results

- `src/security/*` and `tests/security.test.mjs` are the only canonical BP-001 implementation and test paths.
- Repository validation fails if either discarded path reappears.
- Build and test commands reference only the canonical implementation.
- BP-001 feature metadata includes password recovery.
- BP-002 metadata is limited to Repair, Estimate, and Other Services paths; eight-question intake foundation; initial customer capture; and service-request creation.
- Identical normalized emails are directly tested as distinct identities across tenants.
- The public portal remains restricted to `intake.submit` and its field allowlist.
- Default audit storage uses the reviewed `AuditLog`; tests prove events are retained and the hash chain verifies.
- No BP-001 redesign or BP-002 implementation was introduced.

## Exact Validation Results

A temporary validation copy was materialized exclusively from GitHub connector content at exact commit `ddec4663a4304aa4af0265f8b442fb8f7862bc8e`. It used Node.js `v24.14.1`, satisfying the package requirement of Node.js 22 or newer.

Command:

```text
npm.cmd run check
```

Result: exit code `0`.

### Build

```text
Built dist/foundation-manifest.json and dist/security-manifest.json
```

### Tests

- Tests: 14
- Passed: 14
- Failed: 0
- Cancelled: 0
- Skipped: 0
- Todo: 0
- Duration: 1664.5248 ms

Passing coverage included:

- project, package, runtime, persistence, and deployment foundation;
- exact BP-001 feature authority;
- exact BP-002 deferral boundary;
- successful and failed authentication;
- least-privilege role enforcement;
- tenant-mismatch rejection;
- public/internal portal separation;
- session expiry and logout revocation;
- privileged-action audit hash-chain verification;
- single-use password recovery and session revocation;
- tenant-keyed identities with normalized duplicate email;
- non-discarding default audit storage.

### Repository Validator

```text
Canonical BP-000/BP-001 repository validation passed.
```

The temporary validation files and generated manifests were removed after execution.

## Queue State

- Inbox: TNGD-BP-002 through TNGD-BP-006 remain unchanged.
- Active: empty.
- Review: BP-000, BP-001, and BP-001.1 work orders and completion/correction reports.
- Done: unchanged; no package was approved or moved to done.
- Batch count: remains 2 of 6; BP-001.1 is a localized correction, not a new pilot package.
- BP-002: blocked pending Independent Acceptance of this exact correction.

## Acceptance Boundary

Manufacturing validation is complete. Independent Acceptance must review the corrected artifact and accept BP-001.1 before BP-002 begins.