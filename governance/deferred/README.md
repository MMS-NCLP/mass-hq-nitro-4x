# MASS Deferred Implementation & Doctrine Registry

**Repository:** `MMS-NCLP/mass-hq-nitro-4x`  
**Authority Class:** Product Governance / Forward Architecture  
**Status:** Active Registry  
**Established:** 2026-08-22

## Purpose

This directory is the canonical repository location for approved concepts, doctrines, architectural intentions, and implementation requirements that belong to MASS but are intentionally deferred beyond the active production version.

Deferral is not deletion, rejection, or permission to dilute a requirement. A deferred item remains part of the governed product roadmap until it is implemented, superseded by an explicit governing decision, or formally retired.

This registry also contains a recovery layer for historical concepts that predate the registry itself. Recovered concepts must be distinguished from remembered-but-unverified concepts so MASS history is preserved without being rewritten from memory.

## Version hierarchy

MASS shall mature in deliberate generations:

- **V1 — Operational Foundation:** Observe + Execute.
- **V2 — Control & Optimization:** Govern + Optimize.
- **V3 — Predictive Intelligence:** Learn + Anticipate.
- **Future / V4 candidate — Governed Autonomy:** bounded autonomous execution only after sufficient governance, evidence, and authorization exist.

A capability required for a complete V1 workflow may not be reclassified as V2 merely because it is difficult or unfinished. Version deferral is an architectural decision, not an escape hatch for incomplete production work.

## Registry contents

### Active deferred doctrine

- `v2/MASS-V2-DOCTRINE_Control_Automation_Optimization.md` — domain Settings/control plane, policy/rules engine, lifecycle automation, operational optimization, advanced BI, integration administration, configuration governance.
- `v3/MASS-V3-DOCTRINE_Predictive_Intelligence.md` — predictive Pipeline/Dispatch/Pulse/customer/inventory/communications intelligence, learning loops, explainability, and anticipation.
- `future/MASS-FUTURE-DOCTRINE_Governed_Autonomy.md` — preserves the boundary between intelligence and autonomous execution.

### Historical reconciliation

- `HISTORICAL-DEFERRED-RECOVERY-AUDIT-2026-08-22.md` — reconciles the registry against MASS-PLAN-001 and the TNGD pilot backlog and identifies broader planned platform responsibilities that must remain preserved.

### Recovery pending

- `recovery-pending/HISTORICAL-CANDIDATES-Requiring-Provenance.md` — concepts recalled from earlier planning but not yet independently recovered from canonical evidence. These records prevent loss while explicitly withholding implementation authority until provenance is found.

## Filing convention

Deferred doctrines should identify: target version, originating decision/context, operational purpose, dependencies, non-goals, acceptance intent, and any relationship to active V1 functionality.

Recommended structure:

- `v2/` — control, configuration, deterministic automation, optimization, advanced operational BI, integration administration.
- `v3/` — predictive and learning systems dependent on trustworthy operational history.
- `future/` — concepts intentionally beyond the committed V2/V3 roadmap.
- `recovery-pending/` — remembered or discovered historical candidates awaiting source verification and classification.

Platform-wide responsibilities already canonically preserved in `MASS-PLAN-001` should not be duplicated into a numbered Dispatch version merely for convenience. This registry may point to them and record dependency relationships while leaving their canonical ownership intact.

## Historical recovery rule

When a prior concept is remembered but its original source has not yet been recovered, preserve it under `recovery-pending/` rather than silently manufacturing a new doctrine around the remembered name.

Once original evidence is recovered, reconcile the concept against current governance and classify it as:

**ACTIVE / SUPERSEDED / MERGED / DEFERRED / RETIRED.**

## Implementation rule

Before work begins on a later MASS version, this registry must be reviewed as an input to scope convergence. Implementers must not treat active deferred doctrines as optional brainstorming. Where a doctrine is still active, it is product intent that must be reconciled into the applicable engineering work orders and acceptance criteria.

> **Memory may trigger recovery. Canonical evidence establishes history. Active doctrine establishes engineering authority.**