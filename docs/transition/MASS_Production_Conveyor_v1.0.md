# MASS Production Conveyor v1.0

**Status:** Active Production Baseline  
**Authority:** Product Owner  
**Repository:** `MMS-NCLP/mass-hq-nitro-4x`  
**Purpose:** Convert approved business intent into governed, traceable production with the least possible executive burden.

---

## 1. Conveyor Objective

The MASS Production Conveyor exists to move work through a repeatable cycle:

> **Define → Authorize → Manufacture → Review → Implement → Test → Revise → Launch → Measure → Repeat**

The conveyor shall reduce uncertainty, preserve momentum, and prevent the business owner from having to reconstruct project state from conversations.

The system shall make the next governed action visible, assign ownership, request only the smallest necessary authorization, and preserve completion evidence in the repository.

---

## 2. Operating Principle

MASS shall make business owners less worried about their businesses by carrying operational memory, sequencing, accountability, and follow-through.

Every production action shall answer:

1. What is being done?
2. Why is it necessary now?
3. Who owns execution?
4. What authorization is required?
5. What proves completion?
6. What happens next?

No participant shall widen scope merely because future improvement is possible.

> **Build what is approved. Improve what is learned. Defer what is imagined.**

---

## 3. Roles

### 3.1 Product Owner — Davon

The Product Owner:

- sets priorities;
- authorizes work;
- accepts or rejects completed deliverables;
- controls sequencing;
- may pause, redirect, or close any action.

The Product Owner shall not be required to assemble workflows, reconcile status from multiple chats, or repeatedly request artifacts already implied by an approved objective.

### 3.2 Engineering Steward — ChatGPT

The Engineering Steward:

- interprets approved intent;
- produces bounded Engineering Work Orders;
- identifies dependencies and risks;
- performs engineering review;
- issues localized correction orders;
- maintains conveyor governance and decision records;
- protects time, momentum, architecture, and the finish line.

The Engineering Steward may execute approved repository documentation actions directly when authorization has already been granted.

### 3.3 Manufacturing Engineer — Codex

The Manufacturing Engineer:

- manufactures approved documents and code in the repository;
- validates outputs;
- commits and pushes work;
- reports exact completion evidence;
- records blockers without redesigning the assignment.

Codex shall not expand architecture, invent new scope, or replace a work order with an audit unless specifically instructed.

### 3.4 Implementation Engineer — Claude

The Implementation Engineer:

- consumes approved engineering artifacts;
- reviews implementation readiness;
- implements approved systems;
- reports integration findings and implementation constraints;
- produces a debrief when an implementation phase closes.

Claude shall not replace the Engineering Steward, redefine approved architecture, or manufacture a competing specification unless directed.

---

## 4. Action Lifecycle

Every governed action shall use one lifecycle:

```text
DRAFTED
  ↓
REQUESTED
  ↓
APPROVED / REJECTED / MODIFIED
  ↓
IN PRODUCTION
  ↓
READY FOR REVIEW
  ↓
ACCEPTED / CORRECTION REQUIRED
  ↓
IMPLEMENTED
  ↓
TESTED
  ↓
CLOSED
```

An action may also be marked:

- **BLOCKED** — execution cannot continue because a concrete dependency is unavailable;
- **DEFERRED** — intentionally moved outside the current production scope;
- **SUPERSEDED** — replaced by a later authorized action;
- **CANCELLED** — terminated by the Product Owner.

No action shall disappear silently.

---

## 5. Authorization Tiers

Only the smallest necessary authorization shall be requested.

### Tier 0 — Standing Authority

No additional approval is required when the action is already directly authorized by an active work order and does not change scope.

Examples:

- create an approved document;
- update an approved manifest;
- run validation;
- commit required companion artifacts;
- correct formatting or a trivial compile blocker necessary to validate approved work.

### Tier 1 — Low-Risk Repository Action

Explicit approval is required for a contained action with no architecture or production behavior change.

Examples:

- create a governance document;
- add a report;
- update a register;
- create a working branch;
- deprecate a clearly superseded artifact.

### Tier 2 — Production Modification

Explicit approval is required before modifying active application behavior, schemas, workflows, pricing, permissions, or deployment configuration.

### Tier 3 — Architectural Change

Explicit Product Owner approval is required before changing application boundaries, platform layers, constitutional meaning, major technology choices, or V1 scope.

---

## 6. Standard Action Record

Every action shall be recorded using the following minimum structure:

```text
Action ID:
Title:
Project:
Status:
Priority:
Requested By:
Owner:
Authorization Tier:
Objective:
Scope:
Out of Scope:
Dependencies:
Required Deliverables:
Acceptance Criteria:
Repository Location:
Branch:
Commits:
Validation:
Decision:
Next Action:
```

The action record may live in an application manifest, engineering register, issue, pull request, or dedicated action register, provided the repository preserves the authoritative state.

---

## 7. Work Order Rules

Every Engineering Work Order shall:

- identify one bounded objective;
- define the active repository and authority sources;
- state what shall not be changed;
- identify required deliverables;
- define validation;
- define acceptance criteria;
- name the expected commit strategy;
- state the exact completion report required.

A work order shall not require the Product Owner to infer the next step.

When the next prompt, command, or artifact is already known, it shall be provided in the same response as the decision that requires it.

---

## 8. Manufacturing Rules

Manufacturing shall proceed continuously unless:

- an approved architecture is directly violated;
- a required source is unavailable;
- credentials or permissions prevent execution;
- continuing would corrupt data, expose secrets, or create a false completion claim.

The following shall not stop production:

- possible future improvements;
- non-blocking polish;
- speculative V2 opportunities;
- preference for a different implementation style;
- a desire to re-certify already accepted work.

Discovered non-blocking issues shall be recorded and production shall continue.

---

## 9. Review Rules

Review shall produce one of two decisions:

- **ACCEPTED**
- **LOCALIZED CORRECTION REQUIRED**

Review shall not become a new design phase.

Correction orders shall identify:

- exact defect;
- exact location;
- required correction;
- validation required;
- whether the conveyor continues in parallel.

Accepted V1 work shall be frozen. Improvements that are not defects move to the V2 backlog.

---

## 10. Project Handoff Sequence

### 10.1 Near-Finished Product Stabilization — NCLP

```text
Codex implementation
  ↓
Claude implementation review and debrief
  ↓
Engineering decision
  ↓
Localized correction, if required
  ↓
Merge and close stabilization
  ↓
Return immediately to MASS
```

### 10.2 MASS Application Library

```text
Product Owner production order
  ↓
Engineering Work Order
  ↓
Codex manufactures full approved application package in repository
  ↓
Engineering review by Product Owner + Engineering Steward
  ↓
Claude implementation-readiness review
  ↓
Acceptance
  ↓
Next application or implementation phase
```

### 10.3 MASS Implementation

```text
Approved application library
  ↓
Claude implements
  ↓
Codex performs authorized repository revisions or targeted corrections
  ↓
Engineering review
  ↓
Test
  ↓
Launch
  ↓
Collect operational data
  ↓
V2 revision cycle
```

---

## 11. Conveyor Metrics

The conveyor shall measure practical production health through:

- time from request to authorized action;
- time from authorization to committed output;
- first-pass acceptance rate;
- correction count per artifact;
- reopened-action count;
- executive interventions required;
- blocked time;
- completed deliverables per production cycle;
- implementation defects traced to unclear specifications;
- lessons captured for the next cycle.

The goal is not maximum activity. The goal is dependable forward motion with decreasing executive burden.

---

## 12. Drift Prevention

The following are prohibited unless authorized:

- adding review stages;
- changing assigned roles;
- converting an implementation order into an audit;
- converting an audit into a redesign;
- introducing new scope because it appears beneficial;
- delaying production for future-proofing;
- creating parallel systems for an existing function;
- treating chat history as more authoritative than the repository.

When instructions appear ambiguous, the active project objective and latest Product Owner directive control.

---

## 13. Learning Loop

Every major production chapter may create reusable operational data.

Lessons shall be captured when they materially improve:

- decision clarity;
- authorization efficiency;
- role boundaries;
- workload reduction;
- production reliability;
- business-owner confidence.

The loop is:

> **Build → Implement → Test → Revise → Launch → Measure → Learn → Build Again**

The conveyor is successful when the business owner spends less time reconstructing operations and more time making the few decisions that genuinely require ownership judgment.

---

## 14. Active Directive

The conveyor is active immediately.

Current mission sequence:

1. Close the active NCLP stabilization stack.
2. Return to MASS without adding unrelated work.
3. Use Codex for high-throughput MASS Application Library manufacturing.
4. Review and accept manufactured applications.
5. Send approved applications to Claude for implementation.
6. Revise, test, launch, collect data, and begin V2.

No additional governance layer is required before production continues.
