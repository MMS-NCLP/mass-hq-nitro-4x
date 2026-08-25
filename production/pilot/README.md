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
- `active/` — primary Pilot packages currently being manufactured or held at a bounded owner/review checkpoint
- `review/` — completed packages and review evidence
- `done/` — accepted packages and completion evidence

## Continuous Operating Rules

1. Only repository-authorized work is manufactured; a clear Executive directive may be materialized into a repository-native work order under MPD-002 Section 6A.
2. Maintain at least three authorized future work orders whenever three roadmap packages remain.
3. Maintain one primary active manufacturing package per dependency chain. An unrelated or checkpointed active package is not a global production lock.
4. Process eligible work in dependency and filename order unless Executive Authority establishes a newer bounded sequence.
5. After a package or bounded slice passes manufacturing validation and its state is version-preserved, continue to the next eligible authorized package without waiting on unrelated review.
6. Routine Independent Review and Executive Acceptance proceed in parallel and do not idle manufacturing.
7. A submitted predecessor may be consumed provisionally when its validation passed, its contracts are committed or version-preserved, and no architecture-critical defect is known.
8. Localized findings become isolated LCO/refinement work and do not stop unrelated production.
9. An architecture-critical or active-dependency defect pauses only the affected chain.
10. If no feature package is eligible, select the next authorized correction, refinement, validation, migration, packaging, or readiness work order.
11. Never invent scope or bypass authority. When Executive Authority has already approved a clear bounded scope, materialize the missing WO instead of stopping for paperwork.
12. Pilot code remains reusable MASS capability; disposable CRM implementation is prohibited.
13. An empty `inbox/`, a routine visual-review checkpoint, or the mere existence of another `active/` package is not by itself a production blocker.
14. Surface/page prohibitions inside an older work order bind that work order only; they do not override a later explicit Executive authorization for a successor surface once the predecessor dependency is safely version-preserved.

## No-Hold / Baton Continuity Rule

When Executive Authority explicitly approves the next bounded surface, feature, correction, or slice and no architecture-critical dependency conflict exists, the production system shall:

1. capture that approval in the repository's established work-order format;
2. stamp predecessor SHA, scope, acceptance gate, and prohibitions;
3. place/activate the work order according to queue conventions; and
4. continue manufacturing.

Do **not** return a governance hold solely because the inbox was empty or because an earlier package still exists in `active/` for owner review.

A hold is appropriate only for a real blocker: explicit Executive pause, architecture-critical dependency defect, applicable failed validation, genuinely ambiguous scope that would require material invention, or unavailable credentials/providers/decisions required for safe execution.

## Current Status

The production frontier is governed by the repository's current committed packages, reconciliations, and latest Executive-authorized bounded work. This README intentionally does not hard-code a stale package number as the perpetual frontier.

Manufacturing must determine the current frontier from repository state and applicable Executive authority, then continue under MPD-002 without administrative idle.
