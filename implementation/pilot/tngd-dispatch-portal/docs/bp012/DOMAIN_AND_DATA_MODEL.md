# BP-012 Domain and Data Model

MASS owns tenant-keyed `CompletionReview`, `ReconciliationChecklist`, `OperationalException`, `ExceptionAssignment`, `ExceptionEvidenceReference`, `ReconciliationDifference`, `ResolutionDecision`, `EscalationRecord`, `AdministrativeHistory`, and `ReconciliationHandoff`. Source records in BP-004 through BP-011 are consumed by reference only and never mutated.

A `CompletionReview` tracks one service case through reconciliation. It holds a `ReconciliationChecklist` covering six upstream evidence categories (field, estimate, authorization, invoice, payment, dispatch), a list of exception IDs, difference IDs, and handoff IDs.

An `OperationalException` is categorized (callback, parts, estimate, payment, warranty, follow-up, field, dispatch, authorization, reconciliation), prioritized, assigned to accountable roles, and resolved through governed `ResolutionDecision` records. The creator of an exception cannot approve its resolution (self-approval prevention). Escalation creates immutable `EscalationRecord` entries.

`ReconciliationDifference` captures MASS versus external provider discrepancies. `ReconciliationHandoff` routes eligible outcomes to BP-013 (warranty) or BP-014 (follow-up). All review, resolution, and escalation history is append-only and immutable.
