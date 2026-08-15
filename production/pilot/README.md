# MASS Operational Pilot Production Line

This queue is Conveyor B under:

- [MPD-001 — Dual Conveyor Manufacturing Strategy](../../governance/directives/MPD-001_Dual_Conveyor_Manufacturing_Strategy.md)
- [MPD-002 — Continuous Production Flywheel](../../governance/directives/MPD-002_Continuous_Production_Flywheel.md)

## Authority

- [MASS-TNGD-PILOT-001 Charter](../../docs/research/tngd-pilot/MASS-TNGD-PILOT-001_TNGD_Dispatch_User_Portal_Operational_Pilot_Charter.md)
- [Pilot Implementation Backlog](../../docs/research/tngd-pilot/MASS-TNGD-PILOT-001_Implementation_Backlog.md)
- [MASS-PLAN-001](../../governance/MASS-PLAN-001_Master_Product_Roadmap.md)
- [Package Sequence Reconciliation 001](../../governance/reconciliations/TNGD-PILOT-PACKAGE-SEQUENCE-RECONCILIATION-001.md)

## Queue

- `inbox/` — Executive-authorized feature, correction, refinement, validation, or readiness work orders
- `active/` — the sole Pilot package currently being manufactured
- `review/` — completed packages and review evidence
- `done/` — accepted packages and completion evidence

## Continuous Operating Rules

1. Only repository-authorized work enters the inbox.
2. Maintain at least three authorized future work orders whenever three roadmap packages remain.
3. Only one Pilot package may be active.
4. Process eligible work in dependency and filename order.
5. After a package passes manufacturing validation and enters review, continue to the next eligible authorized package.
6. Routine Independent Review and Executive Acceptance proceed in parallel and do not idle manufacturing.
7. A submitted predecessor may be consumed provisionally when its validation passed, its contracts are committed, and no architecture-critical defect is known.
8. Localized findings become isolated LCO/refinement work and do not stop unrelated production.
9. An architecture-critical or active-dependency defect pauses only the affected chain.
10. If no feature package is eligible, select the next authorized correction, refinement, validation, migration, packaging, or readiness work order.
11. Never invent scope, bypass authority, or manufacture from backlog.
12. Pilot code remains reusable MASS capability; disposable CRM implementation is prohibited.

## Current Status

BP-008 — Mobile Technician Workflow and 25-Point Inspection — is submitted for Independent Review and may serve as the provisional BP-009 baseline because its complete manufacturing gate passed and no architecture-critical defect is known.

The Pilot Inbox contains:

1. BP-009 — Repair and Estimate Execution
2. BP-010 — Customer Authorization Evidence
3. BP-011 — Invoice and Square Payment Integration

Under MPD-002, BP-009 may activate without waiting for routine BP-008 review completion. BP-010 and BP-011 remain eligible only after their manufactured predecessor contracts are committed and no architecture-critical defect is known.
