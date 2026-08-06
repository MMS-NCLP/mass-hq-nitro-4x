# TNGD-BP-001.2 Localized Correction Report

## Package

- Correction: TNGD-BP-001.2 — Atomic Security Lifecycle Corrections
- Parent package: TNGD-BP-001
- Prior correction: TNGD-BP-001.1
- Authorized baseline: `cea3ad4bd1a4fa5c8809211bfc138a8106b93b30`
- Corrected artifact commit validated: `95dcb8cf96e81058bd1173e0684be0662d3f572c`
- Status: Corrected — Pending Independent Acceptance

## Changed Files

### Corrected Implementation and Tests

- `implementation/pilot/tngd-dispatch-portal/src/security/secure-access.mjs`
- `implementation/pilot/tngd-dispatch-portal/tests/security.test.mjs`
- `implementation/pilot/tngd-dispatch-portal/scripts/validate-repository.mjs`

### Updated Evidence

- `docs/transition/TNGD-BP-001_Secure_Access_Roles_and_Portal_Separation.md`
- `production/pilot/review/TNGD-BP-001_Completion_Report.md`
- `production/pilot/review/TNGD-BP-001.1_Localized_Correction_Report.md`
- `production/pilot/review/TNGD-BP-001.2_Localized_Correction_Order.md`
- `production/pilot/review/TNGD-BP-001.2_Localized_Correction_Report.md`

## Correction Results

### Tenant-Administrator Bootstrap

A synchronous per-tenant reservation is acquired before asynchronous password derivation or identity creation. Concurrent bootstrap requests for one tenant therefore produce exactly one winner. The competing request is rejected and audited. The reservation is released in `finally`, preserving retry safety when the winning operation itself fails.

### Password-Reset Consumption

A reset token is marked as being consumed before asynchronous replacement-password derivation. Concurrent uses produce exactly one winner. Competing uses are rejected and audited. Successful consumption installs one credential, marks the token used, and revokes prior sessions. Credential-derivation failure clears the reservation without replacing the valid password.

These guarantees apply to the canonical in-process runtime. Future durable or multi-process adapters must preserve them with authoritative transactional uniqueness or compare-and-set behavior.

## Exact Validation Results

A temporary validation copy was materialized exclusively from GitHub connector content at exact commit `95dcb8cf96e81058bd1173e0684be0662d3f572c`. Validation used Node.js `v24.14.1`, satisfying the Node.js 22+ requirement.

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

- Tests: 16
- Passed: 16
- Failed: 0
- Cancelled: 0
- Skipped: 0
- Todo: 0
- Duration: 1871.7512 ms

The two new deterministic tests passed:

- `exactly one concurrent tenant bootstrap succeeds without corrupting identity state`
- `exactly one concurrent password reset succeeds without corrupting credentials`

They verify one fulfillment and one rejection per race, successful authentication of the winner, failed authentication of the competitor, prior-session revocation after reset, one success/one rejection in audit history, and a valid audit hash chain.

### Repository Validator

```text
Canonical BP-000/BP-001 repository validation passed.
```

The validator now requires the per-tenant bootstrap reservation, reset-token consumption reservation, and both named concurrency tests.

The temporary validation files and generated manifests were removed after execution.

## Scope Compliance

- BP-001 architecture and canonical paths remain unchanged.
- BP-001.1 password recovery, tenant keys, public allowlist, and audit chain remain intact.
- BP-000 was not modified.
- BP-002 files and scope were not modified.
- No package was moved to done.

## Queue State

- Inbox: TNGD-BP-002 through TNGD-BP-006 remain unchanged.
- Active: empty.
- Review: BP-000, BP-001, BP-001.1, and BP-001.2 work orders and evidence.
- Done: unchanged.
- Batch count: remains 2 of 6; BP-001.2 is a localized correction.
- BP-002: blocked pending Independent Acceptance of BP-001.2.

## Acceptance Boundary

Manufacturing validation is complete. Independent Acceptance must review and accept BP-001.2 before BP-002 begins.