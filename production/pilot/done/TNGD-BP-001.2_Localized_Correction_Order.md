# LOCALIZED CORRECTION ORDER

## TNGD-BP-001.2 — Atomic Security Lifecycle Corrections

Project: MASS-TNGD-PILOT-001
Parent Package: TNGD-BP-001
Prior Correction: TNGD-BP-001.1
Conveyor: Operational Manufacturing (Conveyor B)
Status: Accepted — Independent Acceptance Complete
Authority: Executive Localized Correction Order
Authorized Baseline: `cea3ad4bd1a4fa5c8809211bfc138a8106b93b30`

### Objective
Correct two concurrency defects without redesigning or expanding BP-001.

### Required Correction
- Make tenant-administrator bootstrap atomic per tenant.
- Make password-reset token consumption atomic per token.
- Add deterministic tests proving exactly one concurrent bootstrap succeeds.
- Add deterministic tests proving exactly one concurrent reset succeeds.
- Prove unsuccessful competing requests do not corrupt valid identity or credential state.
- Run the complete `npm run check` gate against the exact corrected commit.

### Constraints
- Preserve the canonical `src/security/*` implementation.
- Preserve BP-001.1 scope, roles, tenant boundaries, public allowlist, audit chain, and password-recovery contract.
- Do not change BP-002 files or authority.
- Do not move any package to done.
- BP-002 remains blocked pending Independent Acceptance of BP-001.2.

### Completion Criteria
Concurrent operations produce one winner and one safe rejection; the winning identity/password remains usable; canonical validation passes; correction evidence records the exact commit and results; and BP-001.2 is submitted to review.

### Independent Acceptance

Accepted on 2026-08-07 against exact validated commit `95dcb8cf96e81058bd1173e0684be0662d3f572c`. The independent `npm.cmd run check` gate passed with 16 of 16 tests, including both deterministic concurrency tests, and canonical repository validation passed. BP-002 is cleared to enter Active manufacturing without any expansion of its authorized scope.