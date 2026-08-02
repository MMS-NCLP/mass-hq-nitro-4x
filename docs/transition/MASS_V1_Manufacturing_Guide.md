# MASS V1 Manufacturing Guide

## Document Information

| Field | Value |
|-------|-------|
| Document | MASS V1 Manufacturing Guide |
| Version | 1.0 |
| Status | Active |
| Established | 2026-08-02 |
| Authority | Production Reset Report → Builder Covenant → V1 Architectural Directive |

## Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0 | 2026-08-02 | Initial manufacturing guide, codifying governance established during Production Reset |

---

## 1. Manufacturing Doctrine

**"Build what we approved. Improve what we learn. Defer what we imagine."**

This doctrine governs all V1 production. It exists because MASS crossed from architecture to manufacturing without a formal mode change, and the project accumulated drift — production mixed with certification, future thinking leaked into present building, and the precise implementation checkpoint became uncertain.

The doctrine does not reject innovation. It puts innovation in the right place in the timeline.

### Operating Rules

- No unnecessary redesign
- No speculative architecture
- No premature optimization
- No interruption of the production conveyor unless the implementation violates the approved architecture
- Prefer reliable completion over theoretical optimization

### V1 Shall Be

- Complete
- Reliable
- Understandable
- Modular
- Extensible
- Production-ready

V1 shall not attempt to maximize capability. Future complexity earns its place through demonstrated need.

---

## 2. Repository Authority

The GitHub repository is the canonical source of truth for MASS.

- Conversations are not authoritative
- Architecture, specifications, and implementation artifacts derive from the repository
- If a conflict exists between something said in a conversation and what is committed in the repository, the repository wins
- Constitutional history is institutional knowledge and shall never be lost
- Never overwrite constitutional artifacts — preserve version history permanently

### Repository Location

`github.com/MMS-NCLP/mass-hq-nitro-4x`

### Repository Organization

```
docs/
  constitution/       Constitutional foundation and governance
  engineering/        Engineering Library v1.1 (ENG-001 through ENG-027)
  applications/       Application Architecture series
  standards/          Templates, registers, normalization records
  research/           Strategic vision and research notes
  transition/         Manufacturing governance (this document)

archive/              Read-only historical artifacts
  executive-briefs/   One-page Executive Engineering Briefs
  superseded-production/  Earlier production attempts
  numbering-errors/   Mismatched or incorrectly numbered artifacts
  duplicate-artifacts/ Duplicates consolidated during migration
  ideation/           Early-stage conceptual artifacts
```

### Canonical Location Rule

Once a file is committed to the repository, the repository copy is authoritative. External copies (local folders, conversation artifacts, exported PDFs) are backups, not sources.

---

## 3. Oak Covenant

Three roles govern MASS V1 production. Established August 2, 2026 after Project Lighthouse synthesis.

### Davon — Protects the Product

Never loses sight of the business owner.

Ask: *"Would someone actually use this every day?"*

Responsibility: Phase 4 — Acceptance & Continue. Controls production sequencing.

### Claude — Protects the Architecture

Never allows excitement to destabilize engineering.

Ask: *"Does this belong now?"*

Responsibility: Phase 2 — Manufacturing. Produces engineering packages. Reports completion honestly.

### Co-engineer — Protects the Future

Never stops discovering where MASS can go. Never allows tomorrow's ideas to compromise today's craftsmanship.

Ask: *"Can this wait until the foundation deserves it?"*

Responsibility: Phase 1 — Architectural Work Orders. Phase 3 — Engineering Spot Review.

### Shared Principle

**"Build today's foundation as if tomorrow's breakthroughs already have a place to belong."**

### V1 Philosophy

V1 is solid oak — warm, understandable, approachable, complete, repairable, extensible. Not marble. Wood accepts growth. Every beam intentional, every joint visible, every expansion anticipated.

---

## 4. Four-Phase Manufacturing Process

This process is frozen for the remainder of V1. It shall not be changed unless it demonstrably prevents manufacturing.

### Phase 1 — Architectural Work Order

**Owner:** Co-engineer

The Work Order is immutable once issued. It defines what is to be built.

A Work Order contains:
- Document ID (e.g., WO-013-V02)
- Application and volume identification
- Objective and purpose
- Scope (included and excluded)
- Dependencies
- Functional requirements
- Engineering constraints
- Data model requirements
- API requirements
- Folder structure requirements
- Deliverable list
- Acceptance criteria
- Manufacturing directive

No additional architectural expansion is authorized during manufacturing beyond what the Work Order specifies.

### Phase 2 — Manufacturing

**Owner:** Claude

Manufacturing includes:

1. **Pre-Build Diagnostic** — Confirm constitutional alignment, engineering dependencies, terminology consistency with prior volumes, and boundary correctness. Identify any conflicts before building. No implementation occurs during diagnostic.

2. **Build** — Produce the engineering package as specified by the Work Order. Standard deliverables:
   - Production Markdown
   - API Inventory (CSV)
   - Data Model (CSV)
   - Folder Structure (TXT)
   - Build Manifest Update
   - Revision Log Update

3. **Manufacturing Completion Report** — Honest summary of what was built, not independent verification. Reports: branch name, commit hash, generated files, manufacturing summary, blockers (if any).

Manufacturing shall not halt for improvement opportunities that do not violate the approved architecture. Improvement notes are recorded in the Completion Report for future consideration.

### Phase 3 — Engineering Spot Review

**Owner:** Co-engineer

The co-engineer reviews committed repository artifacts — not Claude's summary.

Purpose:
- Verify the artifacts satisfy the Work Order
- Identify localized corrections

Rules:
- Findings become revision tickets, not production blockers
- The only exception: a finding that reveals a genuine constitutional or engineering violation stops production
- The spot review should not attempt to perfect the build — its purpose is to protect it

### Phase 4 — Acceptance & Continue

**Owner:** Davon

Davon decides whether the volume is accepted. If accepted, the next Work Order is issued immediately. Minor revisions, if any, are tracked independently and do not stop the conveyor.

---

## 5. Work Order Standard

Every Application Library volume is manufactured against an Architectural Work Order. The Work Order is the complete architectural authority for that volume.

### Required Sections

1. **Document ID** — Format: `WO-{app}-V{nn}` (e.g., WO-013-V02)
2. **Application and Volume** — Which application series and volume number
3. **Status** — "Approved for Manufacturing"
4. **Authority** — Chain: MASS Constitution → Engineering Library → Application Directives → Repository Canon
5. **Objective** — What this volume establishes (one paragraph)
6. **Purpose** — What a user can do after implementation
7. **Scope** — Explicit inclusions and exclusions
8. **Dependencies** — Required inputs (prior volumes, engineering specs, standards)
9. **Functional Requirements** — What the implementation shall support
10. **Engineering Constraints** — Technology and architectural boundaries
11. **Data Model** — Minimum entities and relationships
12. **API Requirements** — Minimum endpoints
13. **Folder Structure** — Internal organization requirements
14. **Deliverables** — What manufacturing must produce
15. **Acceptance Criteria** — When the volume is accepted
16. **Manufacturing Directive** — Execution sequence
17. **Closing Directive** — Confirms no additional expansion is authorized

### Closing Statement

Every Work Order ends with:

*"This work order is the complete architectural authority for [volume]. No additional architectural expansion is authorized during manufacturing."*

Followed by the Manufacturing Doctrine.

---

## 6. Spot Review Standard

The Engineering Spot Review is a lightweight verification step, not a comprehensive audit.

### What to Review

- Open the committed files in the repository (not Claude's summary)
- Confirm sections match the Work Order scope
- Confirm API Inventory matches endpoints in the specification
- Confirm Data Model matches entity definitions
- Flag anything that looks incorrect

### Time Target

A spot review should take approximately 10 minutes per volume. If it takes significantly longer, the Work Order was insufficiently specific or the manufacturing introduced scope that shouldn't exist.

### Findings

- **Non-blocking findings** — Recorded as revision tickets. Do not stop production. Addressed independently or incorporated into future volumes.
- **Blocking findings** — Only issued when a genuine constitutional violation or engineering conflict is discovered. Stops the conveyor until resolved.

### Conveyor Rule

The next Work Order may be issued while the spot review is in progress. Production does not wait for review completion unless a blocking finding is raised.

---

## 7. Acceptance Rules

### Volume Acceptance Criteria

A volume is accepted when:

1. Every required deliverable exists
2. Engineering content is original (not copied from prior volumes)
3. Sections are non-duplicative within the volume
4. Terminology is consistent with prior volumes in the same application series
5. Implementation guidance is actionable
6. No speculative V2+ capabilities are introduced
7. Repository standards are maintained

### What Acceptance Means

- The volume is committed to the repository
- The Build Manifest is updated
- The Revision Log is updated
- The next Work Order may be issued
- The volume is not retroactively modified unless a later volume exposes a genuine dependency problem

### What Acceptance Does Not Mean

- The volume is perfect
- The volume will never need revision
- All improvement opportunities have been addressed

---

## 8. V1 Scope Discipline

### Two Parallel Roadmaps

- **Product Roadmap** — What ships in V1, V2, V3
- **Research Roadmap** — Ideas that shape V2, V5, V10

These must remain separate. V1 stays polished and complete. Breakthrough ideas mature on the Research Roadmap without creating premature inclusion pressure.

### Scope Boundaries

- The Constitution, Engineering Library, and repository structure are approved and frozen
- No new Engineering Specifications or constitutional amendments during V1 production
- Intelligence compositions (Intent, Relationship, Learning, Confidence) are future orchestration patterns, not V1 requirements
- Project Lighthouse is accepted as strategic vision, preserved as guidance, not implemented in V1
- Platform Foundation (ENG-002 through ENG-016) is Foundation Stable — no new infrastructure

### Application Library Discipline

- Complete APP-013 (Design Studio) before beginning APP-014
- One completed application series teaches more about the manufacturing process than five partial ones
- Each application series follows the same four-phase process
- Application Architecture Directives (7 directives) govern all Application Blueprints

### The Question That Governs

When an exciting idea emerges during production:

**"Does this belong now?"**

If it strengthens V1's foundation, incorporate it. If it's a future composition, preserve it on the Research Roadmap and protect V1's elegance.

---

## Appendix: Production Status

| Application | Volume | Title | Status |
|-------------|--------|-------|--------|
| APP-013 | V01 | Design Studio Production Reference Manual | Complete |
| APP-013 | V02 | Design Projects & Workspaces | Complete |
| APP-013 | V03 | Component Library & Design System | Complete (awaiting spot review) |
| APP-013 | V04 | TBD | Pending Work Order |
| APP-013 | V05 | TBD | Pending Work Order |
| APP-013 | V06 | TBD | Pending Work Order |
| APP-013 | V07 | TBD | Pending Work Order |
