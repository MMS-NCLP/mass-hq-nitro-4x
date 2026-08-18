---
document-id: EWO-MASS-002
document-type: Engineering Work Order
title: NCLP Platform Convergence Baseline (PCB)
version: 1.0.0
status: Approved
classification: Production Authorization
effective-date: 2026-08-07
approved-date: 2026-08-07
source-authority: Executive Engineering Directive
governing-parent: GDR-001
supersedes: null
superseded-by: null
revision-authority: Executive Governance Board
repository-authority: mass-hq
---

# EWO-MASS-002 — NCLP Platform Convergence Baseline (PCB)

## 1. Purpose

Authorize the production of the NC Local Pro Platform Convergence Baseline (PCB).

This work order shall establish the first comprehensive, evidence-based convergence model for NC Local Pro, defining how the existing platform functions today, how it is intended to function as a unified experience, and what refinement work is required to achieve that objective.

This work order manufactures clarity, not software.

It does not redesign the platform.
It does not authorize feature expansion.
It does not replace existing engineering.
It converges existing capability into one intentional platform experience.

Upon completion, the Platform Convergence Baseline shall serve as the master refinement authority for NC Local Pro. Every subsequent refinement Engineering Work Order shall cite the PCB and identify the convergence objective it implements until the Platform Convergence Baseline has been substantially executed.

## 2. Governing Objective

Determine how every existing capability within NC Local Pro contributes to a single continuous user experience.

Every future engineering decision shall be capable of tracing its purpose back to the Platform Convergence Baseline.

## 3. Scope

This work order authorizes:

- Comprehensive read-only architectural analysis.
- Subsystem discovery and validation.
- Experience convergence analysis.
- Feature relationship and classification analysis.
- Workflow and journey analysis.
- Platform cohesion scoring.
- MASS integration boundary identification.
- Production refinement planning.

No production code shall be modified. No database schema shall be altered. No feature shall be redesigned. No implementation shall occur.

### Known Structural Conditions

The NC Local Pro codebase contains parallel implementations that emerged naturally through iterative development. Legacy and modern versions of the same capability coexist in multiple areas, including provider account management, administrative interfaces, and contact mechanics.

These parallel systems are not engineering failures. They are evidence that the platform matured faster than its governing experience model. The Platform Convergence Baseline shall document these conditions, recommend resolution paths, and classify each instance — without assigning fault to the engineering decisions that produced them.

## 4. Engineering Principle

This work order is governed by one manufacturing principle:

**Convergence, not innovation.**

Existing investment shall be preserved wherever practical. Engineering effort shall focus on improving cohesion rather than increasing feature count.

## 5. Required Deliverables (Tier I)

The following deliverables are mandatory. Completion of this work order is not achieved until all required deliverables have been produced.

### Deliverable 1 — Platform Narrative

Produce one continuous narrative describing NC Local Pro as one product.

The narrative shall explain the complete lifecycle from initial discovery through completed project and continuing community participation.

It shall describe the platform as users experience it — not as engineers implemented it.

### Deliverable 2 — Canonical Experience Model

Produce the governing experience model for the platform.

Every current feature shall map into one or more stages.

Initial lifecycle stages:

1. Discover
2. Learn
3. Plan
4. Compare
5. Hire
6. Manage
7. Complete
8. Share
9. Contribute
10. Improve

The model may be refined if evidence demonstrates a superior structure. No feature shall exist outside the Canonical Experience Model without explicit justification.

Every stage shall be classified by current maturity:

- **Supported** — The stage has substantial codebase implementation that functions within the platform experience.
- **Partially Supported** — The stage has implementation that exists but is incomplete, disconnected, or inconsistently integrated.
- **Architectural Gap** — The stage has little or no current codebase support. It represents a future engineering opportunity, not a current convergence target.

The PCB shall distinguish between stages that have features to converge and stages that represent architectural gaps requiring future engineering. Gaps shall be documented honestly, not fabricated into convergences.

### Deliverable 3 — Canonical Platform Map

Produce a conceptual relationship map showing how every major capability connects to every other major capability within the platform.

This is not a UI sitemap. It is not a navigation tree. It is the platform's conceptual wiring diagram — the authoritative reference for understanding how subsystems relate to each other and to the Canonical Experience Model.

The map shall document:

- Direct capability relationships (e.g., Blueprints → Boards, Editorial → Community).
- Data flow connections (e.g., Trust Engine → Contractor Profiles → Marketplace).
- Integration boundaries (e.g., platform capabilities that logically connect to MASS).
- Disconnected capabilities — subsystems that exist in isolation without observable relationships to other subsystems.

If a future engineer asks "Where does this feature belong?", the Canonical Platform Map should answer that question before any code is written.

### Deliverable 4 — Platform Cohesion Report

Evaluate every major subsystem within NC Local Pro.

The subsystem inventory shall not be predefined. The PCB shall first conduct a subsystem discovery process based on repository evidence — route structure, component directories, API surface, data models, and service boundaries — and produce a validated canonical subsystem inventory before evaluation begins.

For each discovered subsystem, identify:

- Purpose
- Inputs and outputs
- Dependencies
- User value
- Relationship to the Canonical Experience Model
- Current cohesion assessment
- Recommended convergence action

#### Platform Convergence Score

Each subsystem shall receive a measurable convergence score across the following dimensions:

| Dimension | Definition |
|---|---|
| Experience Integration | How well the subsystem participates in the end-to-end user journey |
| Domain Clarity | Whether the subsystem has a clear, non-overlapping responsibility |
| Navigation Consistency | Whether users can discover and access the subsystem through consistent navigation patterns |
| Data Cohesion | Whether the subsystem's data models connect meaningfully to related subsystems |
| Workflow Continuity | Whether workflows that cross subsystem boundaries complete without friction |
| Cross-System Connectivity | Whether the subsystem communicates with other subsystems through defined interfaces |
| Marketplace Alignment | Whether the subsystem strengthens the platform's marketplace value proposition |
| MASS Boundary Definition | Whether the subsystem has identifiable integration boundaries for future MASS connection |

This score is not a performance metric for engineers. It is a benchmark for platform maturity that future refinement work can measure improvement against over time.

### Deliverable 5 — Production Recommendations

Produce a governed manufacturing backlog.

Recommendations shall be prioritized according to platform impact. Each recommendation shall identify:

- Problem
- Root cause
- Proposed convergence action
- Expected platform benefit
- Recommended Engineering Work Order

Recommendations shall be implementation-neutral. They authorize future work. They do not perform it.

## 6. Supporting Deliverables (Tier II)

The following artifacts support Tier I but shall not delay completion if minor refinement remains.

- User Journey Maps
- Experience Inventory
- Navigation Architecture Review
- Feature Classification Matrix
- MASS Integration Boundary Identification
- Cross-reference diagrams
- Interaction inventories

### MASS Integration Boundary Identification

The PCB shall identify logical integration boundaries where NC Local Pro capabilities would naturally connect to MASS platform services, based on current architecture — API surface, event patterns, data models, and service boundaries.

This deliverable documents where future integration points logically exist. It does not prescribe how integration should be implemented. Integration architecture is the scope of a future Engineering Work Order, not this one.

These materials serve as engineering references rather than governing conclusions.

## 7. Evidence Standard

Every finding shall be supported by observable evidence.

Acceptable evidence includes:

- Existing source code
- Repository architecture
- Database schema
- Route structure
- Component relationships
- API behavior
- Live platform behavior
- Existing engineering documentation
- Verified production observations

Opinion alone shall not justify a convergence recommendation.

## 8. Classification Standard

Every evaluated feature, workflow, model, route, or subsystem shall receive one of the following classifications.

### Preserve

The implementation supports the Canonical Experience Model and should remain substantially unchanged. It is architecturally sound and already contributes to the unified platform experience.

### Converge

The implementation is valuable but disconnected, duplicated, inconsistent, or incomplete. Refinement should integrate it into the unified platform experience while preserving existing investment whenever practical.

### Retire

The implementation no longer supports the governing platform vision or has been superseded by a converged approach. Retirement recommendations shall include rationale and migration considerations.

## 9. Explicit Exclusions

This Engineering Work Order does not authorize:

- User interface redesign
- Visual branding changes
- Framework migration
- Database redesign
- New feature development
- Platform expansion
- Technology replacement
- Production deployment
- Repository restructuring
- Governance restructuring

Its purpose is convergence analysis only.

## 10. Acceptance Criteria

This work order shall be considered complete when:

- The Platform Narrative describes one continuous platform experience.
- The Canonical Experience Model maps every major feature and classifies every stage as Supported, Partially Supported, or Architectural Gap.
- The Canonical Platform Map documents capability relationships across the entire platform.
- The subsystem discovery process has produced a validated canonical subsystem inventory.
- Every discovered subsystem has been evaluated and scored.
- Every evaluated capability has been classified as Preserve, Converge, or Retire.
- Every major workflow maps into the Canonical Experience Model.
- The Platform Cohesion Report identifies architectural fragmentation with supporting evidence.
- A governed refinement backlog has been produced.
- Production recommendations are prioritized and suitable for future Engineering Work Orders.

## 11. Completion Statement

Successful completion of EWO-MASS-002 establishes the Platform Convergence Baseline as the authoritative reference for all refinement activities across NC Local Pro.

No subsequent refinement Engineering Work Order shall be authored without first referencing the Platform Convergence Baseline and identifying the convergence objective it implements.

The intent of this work order is to transition NC Local Pro from feature accumulation to intentional platform convergence.

## 12. Manufacturing Execution

This section provides everything a production engine requires to execute this work order without ambiguity.

```yaml
target-repository: nc-local-pro
source-branch: main
working-branch: pcb/platform-convergence
mode: read-only analysis
permissions:
  - repository read access
  - branch creation
  - documentation commits to working branch
output-format:
  - markdown
  - mermaid diagrams
  - structured data (YAML/JSON where scoring requires it)
prohibited:
  - production code modifications
  - schema changes
  - deployment actions
  - direct commits to main
deliverable-paths:
  - docs/pcb/01-platform-narrative.md
  - docs/pcb/02-canonical-experience-model.md
  - docs/pcb/03-canonical-platform-map.md
  - docs/pcb/04-platform-cohesion-report.md
  - docs/pcb/05-production-recommendations.md
  - docs/pcb/supporting/  (Tier II materials)
completion-protocol:
  - commit all deliverables to working branch
  - open pull request against main
  - request executive review
  - no merge without executive approval
```

Any authorized production engine — AI agent, human engineer, or hybrid team — shall be capable of executing this work order using only the information contained in this document and the target repository.

## 13. Executive Authorization

Upon approval, this work order authorizes a comprehensive read-only convergence assessment of NC Local Pro.

The resulting Platform Convergence Baseline shall become the governing reference for refinement manufacturing and future integration with MASS.

No production implementation is authorized by this work order.

---

*End of EWO-MASS-002*
