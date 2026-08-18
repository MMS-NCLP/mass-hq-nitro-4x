# TNGD-BP-015 — Source and Calculation Map

## Source Package Mapping

| Metric | Source Package | Source Entity | Calculation |
|---|---|---|---|
| new-requests | TNGD-BP-002 | ServiceRequest | Count of submissions in period |
| conversion-to-service-cases | TNGD-BP-004 | ServiceCase | Count of converted intakes |
| scheduled-appointments | TNGD-BP-005 | Appointment | Count of confirmed appointments |
| dispatched-jobs | TNGD-BP-007 | WorkItem | Count of dispatched items |
| completed-jobs | TNGD-BP-008 | FieldJob | Count of completed with evidence |
| estimates-awaiting-decision | TNGD-BP-009 | RepairEstimate | Count with status pending-authorization |
| authorized-work | TNGD-BP-010 | AuthorizationRequest | Count with status authorization-confirmed |
| invoices-issued | TNGD-BP-011 | Invoice | Count of finalized invoices |
| payments-confirmed | TNGD-BP-011 | Payment | Count with status confirmed |
| open-exceptions | TNGD-BP-012 | ReconciliationException | Count with status unresolved |
| active-warranty-obligations | TNGD-BP-013 | WarrantyRegistration | Count with status active |
| due-follow-ups | TNGD-BP-014 | FollowUpActivity | Count with status due |
| completed-dispatch-loops | TNGD-BP-002→014 | End-to-end | Count of fully completed loops |

## Data Flow

```text
BP-002 (Intake) ─────────────────────────────────┐
BP-003 (Guided Intake) ──────────────────────────┤
BP-004 (Customer/Case) ─────────────────────────┤
BP-005 (Scheduling) ────────────────────────────┤
BP-006 (Capacity) ──────────────────────────────┤
BP-007 (Dispatch) ──────────────────────────────┤ → BP-015 (Reporting)
BP-008 (Field Workflow) ────────────────────────┤   - Reads source evidence
BP-009 (Repair/Estimate) ──────────────────────┤   - Calculates measures
BP-010 (Authorization) ────────────────────────┤   - Presents results
BP-011 (Invoice/Payment) ─────────────────────┤   - Preserves traceability
BP-012 (Reconciliation) ──────────────────────┤
BP-013 (Warranty) ────────────────────────────┤
BP-014 (Follow-Up) ──────────────────────────┘
```

## Ownership Boundaries

BP-015 operates as a **read-only consumer** of source evidence. It:

- Reads source evidence via governed source-data inputs
- Calculates defined operational measures deterministically
- Presents and exports authorized results
- Preserves traceability via source references
- Records data quality exceptions

BP-015 does **not**:

- Mutate source records
- Schedule or dispatch work
- Change authorization or payment states
- Resolve reconciliation exceptions
- Decide warranty coverage
- Execute customer follow-up

## Data Quality Rules

| Situation | Behavior |
|---|---|
| Missing source data | Report as unavailable; record exception |
| Stale source data | Include with stale flag; record exception |
| Conflicting status evidence | Record exception for manual review |
| Incomplete source lineage | Record exception; do not fabricate data |

The service never silently converts missing or uncertain evidence into successful performance.
