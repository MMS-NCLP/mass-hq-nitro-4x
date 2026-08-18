# TNGD-BP-015 — Metric and Report Inventory

## Pilot Operational Metrics

| Metric | Business Meaning | Source | Method | Time Basis | Freshness | Unavailable Behavior |
|---|---|---|---|---|---|---|
| new-requests | Count of intake submissions received | TNGD-BP-002 | count | event-time | point-in-time | report-as-unavailable |
| conversion-to-service-cases | Intake submissions converted to service cases | TNGD-BP-004 | count | event-time | point-in-time | report-as-unavailable |
| scheduled-appointments | Appointments created and confirmed | TNGD-BP-005 | count | event-time | point-in-time | report-as-unavailable |
| dispatched-jobs | Jobs dispatched to technicians | TNGD-BP-007 | count | event-time | point-in-time | report-as-unavailable |
| completed-jobs | Field jobs completed with evidence | TNGD-BP-008 | count | event-time | point-in-time | report-as-unavailable |
| estimates-awaiting-decision | Estimates pending customer decision | TNGD-BP-009 | count | event-time | point-in-time | report-as-unavailable |
| authorized-work | Work authorized by customer | TNGD-BP-010 | count | event-time | point-in-time | report-as-unavailable |
| invoices-issued | Invoices issued to customers | TNGD-BP-011 | count | event-time | point-in-time | report-as-unavailable |
| payments-confirmed | Payments confirmed via Square | TNGD-BP-011 | count | event-time | point-in-time | report-as-unavailable |
| open-exceptions | Unresolved reconciliation exceptions | TNGD-BP-012 | count | event-time | point-in-time | report-as-unavailable |
| active-warranty-obligations | Active warranty registrations | TNGD-BP-013 | count | event-time | point-in-time | report-as-unavailable |
| due-follow-ups | Follow-up activities in due status | TNGD-BP-014 | count | event-time | point-in-time | report-as-unavailable |
| completed-dispatch-loops | End-to-end dispatch loops completed | TNGD-BP-002 | count | event-time | point-in-time | report-as-unavailable |

## Calculation Methods

| Method | Description |
|---|---|
| count | Direct count of source records matching criteria |
| rate | Ratio: value / denominator from source data |
| sum | Arithmetic sum of source values |
| status-distribution | Object mapping status → count from source data |

## Permitted Dimensions

| Dimension | Description |
|---|---|
| date-range | Filter by reporting period with explicit timezone |
| technician | Filter by assigned technician |
| dispatcher | Filter by dispatching administrator |
| status | Filter by current entity status |
| category | Filter by service category or job type |
| job-type | Filter by type of work performed |

## Report Definitions

Report definitions group metrics into named operational views. The "Pilot Operations Dashboard" is the standard report covering all 13 pilot metrics across the complete dispatch loop from BP-002 through BP-014.

## Export Formats

| Format | Description |
|---|---|
| csv | Comma-separated values with metric names as headers |
| json | Structured JSON with full metric metadata |

Exports are authorized (operations.* required) and preserve the same tenant and role boundaries as interactive views.
