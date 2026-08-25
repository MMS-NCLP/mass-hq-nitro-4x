# MASS PRODUCTION DIRECTIVE

## MPD-002 — Continuous Production Flywheel

| Field | Value |
|---|---|
| Project | MASS |
| Authority | Executive Production Directive |
| Status | Active |
| Effective | 2026-08-15 |
| Revised | 2026-08-25 — Executive Continuity Amendment |
| Extends | MPD-001 — Dual Conveyor Manufacturing Strategy |

## 1. Purpose

MPD-001 established two independent, coordinated conveyors. MPD-002 establishes the operating flywheel that keeps both conveyors producing while review, acceptance, correction, and planning occur in parallel.

Production shall not become idle merely because:

- a completed package awaits Independent Review;
- localized corrections are being prepared;
- an acceptance record is pending;
- a reporting checkpoint has been reached;
- the next inbox requires replenishment;
- an Executive-authorized successor has not yet been materialized as a repository work-order file;
- a prior package remains open for bounded review while its validated outputs no longer block the next authorized surface or workstream.

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

Once a package or bounded slice has:

1. completed its authorized scope or reached an Executive-accepted checkpoint;
2. passed its applicable manufacturing validation;
3. preserved its contracts and implementation state in version control; and
4. produced no known architecture-critical defect,

the conveyor may begin the next repository-authorized, dependency-ready work order without waiting for routine Independent Review or Executive Acceptance of unrelated details.

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

- one primary active manufacturing package per dependency chain;
- additional bounded successor or sibling work only when Executive Authority has explicitly authorized it and no active dependency conflict exists;
- at least three authorized future work orders in its inbox whenever three roadmap-authorized packages remain;
- review/refinement work orders as eligible queue items;
- clear separation among feature manufacturing, correction work, review evidence, and acceptance evidence.

The former interpretation that the mere presence of any file in `active/` blocks all successor or sibling production is superseded. The active-package rule protects dependency integrity; it is not a global production lock.

Before activation would reduce an inbox below three, the Quarterback shall replenish it from the canonical roadmap through approved work orders.

If no new feature work order is dependency-ready, production shall select the next authorized correction, refinement, validation, packaging, migration, or readiness work order.

An empty inbox is a queue-maintenance failure, not a production stop when Executive Authority has already issued a clear, bounded, roadmap-consistent directive. In that case, the Quarterback or manufacturing agent shall materialize the directive into the repository-native work-order format and continue, unless a real blocker exists.

## 6A. Executive Continuity / Auto-Materialization Rule

A clear Executive directive identifying the next bounded deliverable, surface, correction, or implementation slice is sufficient authority for the production system to create the corresponding repository work-order artifact.

The absence of a pre-existing inbox file shall not be used as a reason to hold production when all of the following are true:

1. Executive Authority has explicitly approved the next scope;
2. the scope is consistent with the canonical roadmap or current accepted production frontier;
3. the predecessor baseline is committed or otherwise version-preserved and has passed its applicable validation gate;
4. no architecture-critical dependency conflict is known; and
5. the new work can be represented faithfully in the repository's existing work-order schema.

Required behavior:

- materialize the Executive directive as a governed work order;
- stamp its authority, predecessor SHA, scope boundary, acceptance gate, and prohibited scope;
- place it in the correct queue state;
- proceed with manufacturing without requesting a second conversational authorization for the same already-approved scope.

This rule does **not** authorize invention of scope, bypass of failed validation, or work through an architecture-critical dependency. It removes administrative deadlock caused solely by missing queue paperwork.

## 6B. No-Hold Interpretation

The following are **not** valid production blockers by themselves:

- an empty `inbox/` when Executive Authority has already approved the next bounded scope;
- a predecessor package remaining in `active/` solely for human visual review after its accepted checkpoint is version-preserved and validated;
- routine review, visual polish, documentation cleanup, or provider-backed live QA that does not affect the successor's dependency contract;
- the absence of a successor WO file that can be deterministically materialized from explicit Executive direction.

A production hold is valid only for a real blocker defined in Section 8.

## 7. Roles

### Executive Authority

- controls roadmap priorities, launch authority, and explicit production pauses;
- may authorize rolling successor manufacturing before routine review completion;
- may authorize bounded successor/sibling work when no active dependency conflict exists;
- resolves architecture-critical exceptions.

### Quarterback

- maintains the canonical production frontier;
- keeps both inboxes stocked;
- issues or materializes roadmap-grounded work orders;
- preserves dependency order and bounded active-package discipline;
- routes review findings into localized correction work;
- prevents either conveyor from idling unnecessarily.

### Codex — Manufacturing

- manufactures the first eligible repository-authorized work order;
- when Executive Authority has already approved a bounded next scope but no WO exists, materializes that authority into the repository-native WO format and proceeds;
- validates, commits, synchronizes when available, and submits work to review;
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
- Executive direction is genuinely ambiguous and cannot be represented without inventing material scope;
- an architecture-critical defect blocks the active dependency chain;
- an applicable validation gate has failed and the failure affects the next dependency;
- required credentials, providers, or decisions make safe manufacturing impossible.

A missing work-order file, empty inbox, routine review state, or unrelated active package is not by itself a stop condition.

## 9. Production Law

**Always build from authority. Always materialize clear authority. Always review in parallel. Always refine through the queue. Stop only for a real blocker.**

Manufacturing doctrine:

**Build what we approved. Improve what we learn. Defer what we imagine.**
