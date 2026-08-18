# TNGD-BP-001.2 Independent Acceptance Record

## Decision

- Package: TNGD-BP-001.2 — Atomic Security Lifecycle Corrections
- Parent package: TNGD-BP-001
- Validated commit: `95dcb8cf96e81058bd1173e0684be0662d3f572c`
- Decision: Accepted
- Acceptance date: 2026-08-07
- Acceptance authority: Executive-requested Independent Acceptance
- Dependency result: BP-001 Secure Access is accepted for BP-002 consumption.

## Repository Integrity Review

The validated commit exists in the canonical repository and is an ancestor of the pre-acceptance repository head `e716044291802111ccc9e4c51cad8e5acf7a6a41`. The four intervening commits changed only correction-order, correction-report, and Executive Attention evidence. They did not change the implementation, tests, build, or validator evaluated at the validated commit.

The canonical reviewed implementation remains under `implementation/pilot/tngd-dispatch-portal/src/security/*` with `tests/security.test.mjs`. No competing secure-access implementation is present in the accepted artifact set.

## Independent Validation

A fresh temporary validation copy was reconstructed exclusively from the 16 repository-authorized package files at exact commit `95dcb8cf96e81058bd1173e0684be0662d3f572c`.

Command:

```text
npm.cmd run check
```

Environment: Node.js `v24.14.1`.

Result: exit code `0`.

- Build: passed; foundation and security manifests generated.
- Tests: 16 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo.
- Test duration: 2078.9612 ms.
- Repository validator: `Canonical BP-000/BP-001 repository validation passed.`

## Concurrency Acceptance Findings

- Tenant-administrator bootstrap acquires a synchronous per-tenant reservation before asynchronous credential work and releases it in `finally`.
- Exactly one concurrent bootstrap succeeds per tenant; the competitor is rejected and audited.
- Password-reset completion marks the token as being consumed before asynchronous password derivation.
- Exactly one concurrent reset succeeds per token; the competitor is rejected and audited.
- The winning bootstrap identity remains authenticatable; the losing identity is not created.
- The winning reset credential remains authenticatable; the losing and prior credentials fail, and prior sessions are revoked.
- Both tests confirm one success event, one rejection event, and a valid audit hash chain.

## Scope and Dependency Compliance

- BP-001 architecture and canonical implementation paths are unchanged.
- BP-001.1 tenant keys, public-portal allowlist, password recovery, and non-discarding audit requirements remain covered by the complete gate.
- BP-002 responsibilities and scope are unchanged.
- No package is moved to `production/pilot/done`.
- BP-002 was cleared and transitioned from `production/pilot/inbox` to `production/pilot/active`; no BP-002 implementation was performed during acceptance.
