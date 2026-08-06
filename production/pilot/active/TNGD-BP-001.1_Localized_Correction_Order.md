# LOCALIZED CORRECTION ORDER

## TNGD-BP-001.1 — Canonical Secure Access Reconciliation

Project: MASS-TNGD-PILOT-001
Parent Package: TNGD-BP-001
Conveyor: Operational Manufacturing (Conveyor B)
Status: Active Manufacturing
Authority: Executive Localized Correction Order
Authorized Baseline: `54bc57e4414f142e4cd42fbde6440d1177878e72`

### Objective
Restore one canonical BP-001 implementation and validation set without redesigning BP-001 or expanding BP-002.

### Required Correction
- Retain `src/security/*` and `tests/security.test.mjs`.
- Remove `src/secure-access.mjs` and `tests/secure-access.test.mjs`.
- Remove or reconcile discarded-implementation references.
- Limit BP-002 metadata to its exact work-order responsibilities.
- Preserve password recovery, tenant-keyed identities, the public-action allowlist, and the reviewed audit hash chain.
- Prevent silent audit-event loss.
- Update validator, transition record, completion report, and validation evidence for the canonical implementation only.
- Run `npm run check` against the exact corrected commit when an executable environment is available.

### Constraints
- No BP-001 redesign.
- No BP-002 implementation or scope expansion.
- No package may move to done.
- BP-002 remains blocked until BP-001.1 is corrected, validated, submitted to review, and independently accepted.

### Completion Criteria
One BP-001 source tree and test suite remain; repository gates reject the discarded paths; metadata matches exact BP-001/BP-002 authority; evidence references the corrected canonical artifact set; and all available validation is reported without claiming unavailable execution.