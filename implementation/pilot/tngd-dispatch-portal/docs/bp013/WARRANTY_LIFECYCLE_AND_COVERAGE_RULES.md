# TNGD-BP-013 — Warranty Lifecycle and Coverage Rules

## Standard Pilot Policy

| Coverage Type | Duration | Standard Value |
|---|---|---|
| Parts | partsCoverageDays | 730 days (2 years) |
| Service | serviceCoverageDays | 90 days |

Coverage start is the governed completion date of the source work. Expiration is calculated as: `completionDate + coverageDays`.

## Claim Lifecycle

```text
submitted → under-review → awaiting-evidence / awaiting-appointment
          → decision-pending → approved / partially-approved / denied
          → resolution-in-progress → resolved → closed
```

### Valid Transitions

| From | To |
|---|---|
| submitted | under-review |
| under-review | awaiting-evidence, awaiting-appointment, decision-pending |
| awaiting-evidence | under-review, decision-pending |
| awaiting-appointment | under-review, decision-pending |
| decision-pending | approved, partially-approved, denied |
| approved | resolution-in-progress |
| partially-approved | resolution-in-progress |
| resolution-in-progress | resolved |
| resolved | closed |

Invalid transitions are rejected with an error.

## Coverage Outcomes

| Outcome | Claim Status | Resolution Class Options |
|---|---|---|
| covered | approved | no-charge |
| partially-covered | partially-approved | customer-charge, no-charge |
| not-covered | denied | customer-charge, administrative-review |

## Decision Rules

- Automated eligibility assessment is advisory only (`advisory: true`)
- Final coverage decisions require an authorized human (operations.* permission)
- The claim creator cannot approve their own warranty decision (self-approval prevention)
- Corrections create a new superseding decision; the original is marked with `supersededBy`
- Finalized decisions are immutable

## Registration Rules

- Registration requires an active policy, valid service case, and source job
- Coverage dates are derived from the governed completion date, not caller-supplied
- Duplicate registrations (same idempotencyKey) return the existing registration
- Voiding requires a non-empty reason and only works on active registrations

## Handoff Rules

- BP-013 hands off to TNGD-BP-014 only
- Permitted categories: follow-up, callback
- Any other target package is rejected
