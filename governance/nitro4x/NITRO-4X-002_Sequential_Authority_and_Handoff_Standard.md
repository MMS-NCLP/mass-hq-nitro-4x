---
document-id: NITRO-4X-002
document-type: Governance Standard
title: Nitro 4X Sequential Authority and Handoff Standard
version: 1.0.0
status: Proposed Governing Standard
effective-date: 2026-08-23
source-authority: Executive Direction
repository-authority: mass-hq
governing-parent: NITRO-4X-001
activation-mode: prospective-nonretroactive
---

# NITRO-4X-002 — Sequential Authority and Handoff Standard

## 1. Purpose

This standard establishes a visible, machine-readable baton for all governed MASS production. It exists so two production systems and one Engineering Steward can work sequentially without reconstructing state from conversation history.

The problem this standard eliminates is simple:

> Producer A completes state 3. Producer B must not accidentally resume from state 1 because both states still exist in the same repository or working tree.

The sequence stamp shall make the authoritative inheritance point obvious in filenames, document headers, repository registers, completion receipts, and expected-successor instructions.

## 2. Canonical Production Sequence Stamp

The canonical stamp format is:

`N4X-{STREAM}-S{####}-P{#}-{YYYYMMDD}-{STATE}`

Example:

`N4X-DISPATCH-V1-S0042-P3-20260823-PROVEN`

Where:
- `N4X` = Nitro 4X governed production;
- `STREAM` = bounded product/workstream identity;
- `S####` = monotonic sequence number within that stream;
- `P#` = Nitro 4X pass (1 Realize, 2 Reconcile, 3 Prove, 4 Release);
- `YYYYMMDD` = stamp date;
- `STATE` = canonical state token.

Canonical state tokens:

`DRAFT | REALIZED | RECONCILED | PROVEN | CORRECTION | ACCEPTED | RELEASED | BLOCKED | DEFERRED | SUPERSEDED`

## 3. Required Five-Fold Stamp Presence

Every governed production artifact created after activation shall carry the sequence in at least five locations where the artifact type permits:

### Marker A — Filename

Prefix or embed the sequence stamp.

Example:

`N4X-DISPATCH-V1-S0042-P3_Visual-Convergence-Report.md`

### Marker B — Machine Metadata

YAML/frontmatter/JSON fields shall include:

```yaml
nitro4x:
  stream: DISPATCH-V1
  sequence: 42
  pass: 3
  coordinates: E3-R3-P3-Q3
  state: PROVEN
  stamped_at: 2026-08-23
  predecessor: N4X-DISPATCH-V1-S0041-P2-20260823-RECONCILED
  expected_successor: N4X-DISPATCH-V1-S0043-P4-YYYYMMDD-ACCEPTED
```

### Marker C — Human Heading

The first visible heading shall show a compact stamp:

`[N4X · DISPATCH-V1 · S0042 · P3/4 · PROVEN]`

### Marker D — Authority / Handoff Block

Near the beginning of the artifact:

```text
INHERITS: N4X-DISPATCH-V1-S0041-P2-20260823-RECONCILED
PRODUCER: Claude
QB / STEWARD: ChatGPT
CURRENT PASS: P3 — PROVE
EXPECTED NEXT: S0043 / P4 — RELEASE
NEXT PRODUCER: Codex or assigned production system
CANONICAL COMMIT: <sha when committed>
```

### Marker E — Completion Receipt

The artifact ends with a receipt declaring actual evidence and next inheritance point.

```text
NITRO 4X COMPLETION RECEIPT
Sequence: S0042
Pass: 3/4
Coordinates: E3-R3-P3-Q3
Decision: PROVEN
Regression/Test Evidence: ...
Canonical Commit: ...
Outstanding Delta: ...
Expected Successor: S0043/P4
```

These five markers intentionally make sequence loss difficult even when a file is copied, rendered, exported, summarized, or consumed by another production system.

## 4. Stream Identity

A stream is a bounded production lineage, not merely a repository.

Examples:
- `MASS-CORE`
- `DISPATCH-V1`
- `NCLP-V1`
- `MASS-HQ-UI`
- `STUDIO-V1`
- `GOVERNANCE`

A repository may contain many streams. Sequence numbers are monotonic within a stream.

Two parallel efforts shall not share a stream unless one is explicitly a branch of the same governed sequence.

## 5. Baton Rule

Before production begins, the producer must resolve four facts from repository authority:

1. What is the current stream?
2. What is the highest accepted/current sequence?
3. What pass and Core 4 coordinates have already been earned?
4. What exact successor was expected?

Production shall stop as an **authority resolution blocker** if two artifacts both claim to be the current successor and precedence cannot be resolved from commit history, manifest, or Product Owner directive.

Production shall not stop merely because older artifacts exist.

## 6. Producer Transition Rule

When work passes between Claude, Codex, ChatGPT, or a future production system, the outgoing producer must issue the completion receipt before the incoming producer claims the next pass.

The incoming producer must echo the inherited stamp in its first committed artifact or implementation record.

Example:

Claude closes:

`N4X-DISPATCH-V1-S0042-P3-20260823-PROVEN`

with:

`EXPECTED NEXT: N4X-DISPATCH-V1-S0043-P4-YYYYMMDD-ACCEPTED`

Codex begins by declaring:

`INHERITS: N4X-DISPATCH-V1-S0042-P3-20260823-PROVEN`

and may not silently substitute an older UI/runtime/reference as production authority.

## 7. Quarterback Responsibility

The Engineering Steward / QB is responsible for sequence integrity, not for re-performing every production task.

The QB shall:
- confirm the current baton before issuing a new work order;
- prevent competing successors;
- distinguish correction of the current sequence from creation of the next sequence;
- preserve accepted evidence credit;
- update or require update of the Sequence Register;
- identify the expected next producer/pass;
- detect visual/runtime/source divergence before handoff acceptance.

The QB is not permitted to call a handoff complete when repository evidence cannot identify what runtime, UI, code, and governing artifacts the next producer must inherit.

## 8. Work Order Stamp

Every new Engineering Work Order shall include:

```text
NITRO 4X STREAM:
CURRENT SEQUENCE:
INHERITED PASS / COORDINATES:
THIS WORK ORDER TARGET PASS:
PREDECESSOR STAMP:
EXPECTED SUCCESSOR STAMP:
CANONICAL RUNTIME / PATH:
CANONICAL VISUAL / REFERENCE BASELINE:
DO-NOT-REGRESS BASELINE:
```

The `DO-NOT-REGRESS BASELINE` field shall name measurable inherited truth such as:
- test floor;
- accepted screenshots/reference set;
- runtime path;
- deployment adapter;
- API count;
- functional walkthrough status;
- authoritative document version.

## 9. Correction Sequences

A correction does not erase earned sequence history.

If S0042/P3 exposes a defect, the correction may be stamped:

`N4X-DISPATCH-V1-S0042C1-P3-20260823-CORRECTION`

After correction passes, the parent sequence may be re-stamped PROVEN with a receipt referencing `C1`.

Use `C1`, `C2`, etc. only for localized corrections to the same intended outcome. A material scope change requires a new sequence number.

## 10. Delta QA Rule

QA scope shall shrink as evidence accumulates.

A production receipt must maintain a ledger of:
- verified items;
- changed/touched items;
- invalidated evidence;
- remaining unverified items.

Only changed or previously unverified items automatically re-enter QA. Full revalidation is reserved for a change that affects shared architecture, security, persistence, or another dependency broad enough to invalidate earlier proof.

## 11. Runtime and Presentation Provenance

For executable applications, the sequence stamp must name both:

`CANONICAL RUNTIME`

and

`CANONICAL PRESENTATION BASELINE`

This rule exists because code can remain in one repository while different entrypoints render different generations of the product.

A convergence or handoff is incomplete if it merges backend/runtime behavior but silently changes which accepted presentation is served.

At minimum, release evidence shall identify:
- executable entrypoint;
- application path;
- presentation implementation path;
- latest accepted visual baseline/reference artifact;
- commit SHA containing that presentation;
- any intentional divergence.

## 12. Grandfathering

Existing artifacts are not required to be renamed retroactively.

At the next active handoff for each stream, the QB shall create a **Sequence Adoption Record** that establishes:
- current canonical baseline;
- inherited evidence;
- current commit/runtime;
- current visual baseline;
- next sequence number.

From that adoption point forward, the stream follows this standard.

## 13. Non-Bureaucracy Rule

The stamp shall be generated from known production state whenever possible. Producers shall not spend significant creative effort formatting sequence metadata.

The standard is successful when it reduces reconstruction work, not when it increases clerical work.

## 14. Release Principle

A Nitro 4X handoff is not:

> "Here is what I did."

It is:

> **"Here is the exact authoritative state I inherited, the refinement I added, the proof I earned, and the exact state the next producer must continue from."**