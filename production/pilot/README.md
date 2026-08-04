# MASS Operational Pilot Production Line

This queue is Conveyor B under [MPD-001 — Dual Conveyor Manufacturing Strategy](../../governance/directives/MPD-001_Dual_Conveyor_Manufacturing_Strategy.md).

## Authority

- Governing charter: [MASS-TNGD-PILOT-001](../../docs/research/tngd-pilot/MASS-TNGD-PILOT-001_TNGD_Dispatch_User_Portal_Operational_Pilot_Charter.md)
- Planning backlog: [MASS-TNGD-PILOT-001 Implementation Backlog](../../docs/research/tngd-pilot/MASS-TNGD-PILOT-001_Implementation_Backlog.md)
- Product roadmap: [MASS-PLAN-001](../../governance/MASS-PLAN-001_Master_Product_Roadmap.md)

## Queue

- `inbox/` — pilot build packages explicitly authorized by Executive Authority.
- `active/` — the pilot package currently being manufactured.
- `review/` — completed pilot packages awaiting implementation and readiness review.
- `done/` — accepted pilot packages and completion evidence.

## Operating Rules

1. No item enters `inbox/` without explicit Executive Authority.
2. The charter and backlog do not independently authorize manufacturing.
3. Pilot packages consume existing MASS applications, engines, and contracts whenever available.
4. Platform gaps return to Conveyor A through governed engineering review.
5. Pilot and platform commits remain clearly distinguishable.
6. Neither conveyor pauses the other without Executive Authority.
7. Pilot code must remain reusable MASS capability; disposable CRM implementation is prohibited.

## Current Status

Operational Manufacturing is adopted and authorized to prepare. No pilot package is active. The next executive action is issuance of the BP-001 Work Order into `production/pilot/inbox/`.
