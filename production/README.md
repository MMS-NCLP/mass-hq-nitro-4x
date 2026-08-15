# MASS Production Line

This folder is the shared production authority for Executive Authority, the Quarterback, Codex, and Claude.

## Queues

- `inbox/` — approved Platform work orders
- `active/` — the sole Platform package currently being manufactured
- `review/` — completed work, Independent Reviews, and localized refinement evidence
- `done/` — accepted work orders and completion evidence
- `backlog/` — deferred ideas; never manufacture directly
- `pilot/` — isolated Operational Pilot conveyor

## Governing Production Model

- [MPD-001](../governance/directives/MPD-001_Dual_Conveyor_Manufacturing_Strategy.md) establishes Conveyor A and Conveyor B.
- [MPD-002](../governance/directives/MPD-002_Continuous_Production_Flywheel.md) requires continuous manufacturing while review and correction proceed in parallel.

## Conveyor A — Platform Manufacturing

Conveyor A manufactures permanent reusable MASS capability: applications, plugins, rooms, services, contracts, standards, and authorized platform corrections.

Operating loop:

1. Select the first repository-authorized, dependency-ready work order.
2. Move only that work order to `active/`.
3. Manufacture, validate, commit, and synchronize it.
4. Submit the completed package to `review/`.
5. Continue immediately to the next eligible work order.
6. Independent Review proceeds in parallel.
7. Localized findings return as isolated LCO/refinement work orders without stopping unrelated production.
8. Only an architecture-critical defect, actual dependency failure, missing authority, or Executive pause stops the affected chain.

## Conveyor B — Operational Pilot Manufacturing

Conveyor B uses `production/pilot/` and follows the same continuous flywheel while consuming permanent Platform capability.

Neither conveyor pauses the other without Executive Authority.

## Queue Continuity

- No more than one active package per conveyor.
- Maintain at least three future authorized work orders per inbox whenever three roadmap-authorized packages remain.
- Replenish before activation would reduce the inbox below three.
- If no feature package is eligible, manufacture the next authorized correction, refinement, validation, migration, packaging, or readiness work order.
- Never invent work orders or manufacture directly from backlog.

## Review Rule

A package that passed its complete manufacturing gate and entered review may serve as a provisional successor baseline unless a known architecture-critical defect exists. Routine review and acceptance do not idle production.

Batch checkpoints are reporting events, not automatic production pauses.

## Repository Messaging and Executive Attention

[ENB-001](../governance/directives/ENB-001_Executive_Notification_Bridge_v1.0.md) governs Executive Attention:

- `messages/` carries governed production communication.
- `executive/attention/` contains unresolved Executive decisions.
- `executive/completed/` contains resolved attention records.
- Notifications report attention only; they never grant authority.
