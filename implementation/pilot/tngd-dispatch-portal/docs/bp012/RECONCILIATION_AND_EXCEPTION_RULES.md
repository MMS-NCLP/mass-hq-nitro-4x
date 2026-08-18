# BP-012 Reconciliation and Exception Rules

## Completion Review Lifecycle

`pending` -> `in-review` -> `exceptions-open` | `completed`

A review transitions to `exceptions-open` when any exception is created. It can only transition to `completed` when all exceptions are resolved. Idempotent queue operations deduplicate by tenant and idempotency key.

## Evidence Checklist

Six categories are checked: field, estimate, authorization, invoice, payment, dispatch. Each is marked as `unchecked`, `verified`, `missing`, `conflicting`, or `failed`.

## Exception Categories

callback, parts, estimate, payment, warranty, follow-up, field, dispatch, authorization, reconciliation

## Exception Lifecycle

`open` -> `assigned` -> `returned` | `escalated` | `resolved`
`returned` -> `assigned` | `escalated`
`escalated` -> `resolved`
`resolved` -> `reopened`
`reopened` -> `assigned`

## Exception Priorities

low, medium, high, critical

## Self-Approval Prevention

The principal who creates an exception (`createdBy`) cannot resolve it. A different authorized user must approve the resolution. This enforces separation of duties.

## Escalation

Escalation creates an immutable `EscalationRecord` with target, reason, and timestamp. Escalated exceptions remain resolvable by an authorized user.

## Resolution

Resolution creates an immutable `ResolutionDecision` with resolution text, evidence references, reason, and resolver identity. Decisions cannot be modified after creation.

## Reopen

Reopening creates a new immutable decision record and returns the exception to `reopened` status, allowing reassignment.

## Reconciliation Differences

Differences between MASS and external providers (e.g., Square) are recorded with field, MASS value, external value, and provider identity.

## Handoffs

Eligible outcomes route to BP-013 (warranty) or BP-014 (follow-up) with category (warranty, follow-up, callback, parts) and reference.

## Source Record Integrity

BP-012 consumes evidence from BP-004 through BP-011 by reference only. It never mutates authoritative source records.
