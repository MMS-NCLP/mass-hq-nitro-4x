# MASS Operational Pilot Production Line

This queue is Conveyor B under [MPD-001 — Dual Conveyor Manufacturing Strategy](../../governance/directives/MPD-001_Dual_Conveyor_Manufacturing_Strategy.md).

## Authority

- Governing charter: [MASS-TNGD-PILOT-001](../../docs/research/tngd-pilot/MASS-TNGD-PILOT-001_TNGD_Dispatch_User_Portal_Operational_Pilot_Charter.md)
- Planning backlog: [MASS-TNGD-PILOT-001 Implementation Backlog](../../docs/research/tngd-pilot/MASS-TNGD-PILOT-001_Implementation_Backlog.md)
- Product roadmap: [MASS-PLAN-001](../../governance/MASS-PLAN-001_Master_Product_Roadmap.md)
- Package numbering: [TNGD Pilot Package Sequence Reconciliation 001](../../governance/reconciliations/TNGD-PILOT-PACKAGE-SEQUENCE-RECONCILIATION-001.md)

## Queue

- `inbox/` — Executive-authorized pilot work orders, including dependency-gated future packages.
- `active/` — the sole pilot package currently being manufactured.
- `review/` — completed pilot packages awaiting Independent Review or Executive Acceptance.
- `done/` — accepted pilot packages and completion evidence.

## Operating Rules

1. No item enters `inbox/` without explicit Executive Authority.
2. Maintain at least three authorized future work orders in `inbox/` whenever three unmanufactured roadmap packages remain.
3. Inbox presence does not satisfy dependencies. A work order may activate only after every named predecessor receives Independent Review and Executive Acceptance.
4. Only one pilot package may be active at a time.
5. Process packages in canonical dependency and filename order.
6. The charter and backlog do not independently authorize manufacturing.
7. Pilot packages consume existing MASS applications, engines, and contracts whenever available.
8. Platform gaps return to Conveyor A through governed engineering review.
9. Pilot and platform commits remain clearly distinguishable.
10. Neither conveyor pauses the other without Executive Authority.
11. Pilot code must remain reusable MASS capability; disposable CRM implementation is prohibited.
12. Replenish the inbox before it falls below three authorized future work orders; replenishment does not bypass review or acceptance gates.

## Current Status

BP-008 — Mobile Technician Workflow and 25-Point Inspection — is submitted for Independent Review.

The dependency-gated Pilot Inbox contains:

1. BP-009 — Repair and Estimate Execution
2. BP-010 — Customer Authorization Evidence
3. BP-011 — Invoice and Square Payment Integration

BP-009 may not activate until BP-008 receives Independent Review and Executive Acceptance. BP-010 and BP-011 remain gated by their respective predecessors.
