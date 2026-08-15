# MASS PRODUCTION DIRECTIVE

## MPD-002 — Continuous Production Flywheel

| Field | Value |
|---|---|
| Project | MASS |
| Authority | Executive Production Directive |
| Status | Active |
| Effective | 2026-08-15 |
| Extends | MPD-001 — Dual Conveyor Manufacturing Strategy |

## 1. Purpose

MPD-001 established two independent, coordinated conveyors. MPD-002 establishes the operating flywheel that keeps both conveyors producing while review, acceptance, correction, and planning occur in parallel.

Production shall not become idle merely because:

- a completed package awaits Independent Review;
- localized corrections are being prepared;
- an acceptance record is pending;
- a reporting checkpoint has been reached;
- the next inbox requires replenishment.

Review protects production. It does not normally stop production.

## 2. Conveyor Functions

### Conveyor A — Platform Manufacturing

Conveyor A manufactures the permanent, reusable MASS platform:

- applications;
- plugins;
- rooms;
- platform services;
- contracts;
- policies and standards;
- platform corrections;
- implementation refinements;
- roadmap-authorized reusable capability.

Its governing question is:

**What will MASS become?**

### Conveyor B — Operational Pilot Manufacturing

Conveyor B manufactures the first operational implementation of MASS through the TNGD Dispatch User Portal:

- secure access;
- intake;
- customer records;
- scheduling;
- capacity;
- dispatch;
- technician workflow;
- repair and estimate execution;
- authorization;
- invoicing and payments;
- reconciliation;
- warranty;
- follow-up;
- reporting;
- launch and rollback readiness.

Its governing question is:

**How do we begin using MASS today?**

Conveyor B consumes Conveyor A capability. It does not redefine the platform.

## 3. Continuous Flywheel

Each conveyor operates as a rolling loop:

```text
Authorized Work
      |
      v
Manufacture -> Validate -> Submit to Review
      ^                         |
      |                         v
Next Authorized Work      Independent Review
      |                         |
      +---- Refine/LCO <--------+
```

Manufacturing, review, and localized correction are concurrent lanes of one production system.

## 4. Review-Without-Idle Rule

Once a package has:

1. completed its authorized scope;
2. passed its manufacturing validation;
3. been committed and synchronized; and
4. entered the appropriate review queue,

the conveyor may begin the next repository-authorized, dependency-ready work order without waiting for routine Independent Review or Executive Acceptance.

A pending review does not automatically block successor manufacturing.

Review findings are classified as:

- **Accepted / no findings** — record acceptance when available; production continues.
- **Localized correction** — create or use an authorized LCO/refinement work order; queue it without stopping unrelated manufacturing.
- **Architecture-critical or active-dependency defect** — pause only the affected package chain until corrected.
- **Cross-conveyor platform defect** — return it to Conveyor A while unaffected Conveyor B work continues where safe.

## 5. Dependency Interpretation

A manufactured predecessor submitted to review may serve as the provisional implementation baseline for its successor when:

- its complete validation gate passed;
- its interfaces and handoff contract are committed;
- no known architecture-critical defect exists;
- the successor does not conceal or duplicate unresolved responsibility.

If review later discovers a localized defect, the correction is applied through an isolated LCO and successor compatibility is revalidated.

No package may consume an uncommitted, failed, or architecture-critically defective predecessor.

## 6. Queue Continuity

Each conveyor shall maintain:

- no more than one active manufacturing package;
- at least three authorized future work orders in its inbox whenever three roadmap-authorized packages remain;
- review/refinement work orders as eligible queue items;
- clear separation among feature manufacturing, correction work, review evidence, and acceptance evidence.

Before activation would reduce an inbox below three, the Quarterback shall replenish it from the canonical roadmap through approved work orders.

If no new feature work order is dependency-ready, production shall select the next authorized correction, refinement, validation, packaging, migration, or readiness work order.

An empty inbox is a queue-maintenance failure, not a reason to invent scope. The Quarterback must replenish from approved roadmap authority.

## 7. Roles

### Executive Authority

- controls roadmap priorities, launch authority, and explicit production pauses;
- may authorize rolling successor manufacturing before routine review completion;
- resolves architecture-critical exceptions.

### Quarterback

- maintains the canonical production frontier;
- keeps both inboxes stocked;
- issues roadmap-grounded work orders;
- preserves dependency order and one-active-package limits;
- routes review findings into localized correction work;
- prevents either conveyor from idling unnecessarily.

### Codex — Manufacturing

- manufactures the first eligible repository-authorized work order;
- validates, commits, synchronizes, and submits it to review;
- immediately continues to the next eligible work order;
- never self-approves completed work;
- never invents scope or bypasses an architecture-critical stop.

### Claude — Architecture Protection and Independent Review

- reviews committed artifacts in parallel with continuing manufacturing;
- classifies findings accurately;
- issues localized findings without stopping production;
- recommends a pause only for architecture-critical or active-dependency defects.

## 8. Reporting Cadence

Batch and cadence checkpoints are reporting and Executive-awareness events. They do not automatically pause either conveyor.

Production stops only when:

- Executive Authority explicitly pauses it;
- no repository-authorized work exists and the Quarterback cannot replenish from approved roadmap authority;
- an architecture-critical defect blocks the active dependency chain;
- required credentials, providers, or decisions make safe manufacturing impossible.

## 9. Production Law

**Always build from authority. Always review in parallel. Always refine through the queue. Stop only for a real blocker.**

Manufacturing doctrine:

**Build what we approved. Improve what we learn. Defer what we imagine.**
