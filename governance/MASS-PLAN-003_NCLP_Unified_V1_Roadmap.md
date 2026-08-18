# MASS-PLAN-003 — NCLP Unified V1 Roadmap

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-PLAN-003 |
| Title | NCLP Unified V1 Roadmap |
| Version | 1.0 |
| Status | Living Governance Document |
| Authority | Executive Planning |
| Repository Role | Canonical V1 manufacturing sequence for NC Local Pro and its MASS integration |
| Governing Parent | MASS-PLAN-001 |
| Last Updated | 2026-08-07 |

## 1. Purpose

MASS-PLAN-003 defines the unified V1 roadmap for NC Local Pro (NCLP) and its integration with MASS. It establishes the manufacturing sequence, phase boundaries, scope constraints, and acceptance criteria required to bring both platforms to a coordinated V1 launch.

It answers:

1. What constitutes a credible NCLP V1 launch.
2. How NCLP and MASS integrate at V1 scope.
3. What sequence the remaining work follows.
4. What is explicitly deferred to post-V1.
5. How AI and video capabilities are scoped for V1 cost control.

This roadmap governs NCLP V1 manufacturing order. It does not govern MASS platform manufacturing (see MASS-PLAN-001) or MASS governance structure (see GDR-001, pending).

## 2. V1 Definition

NCLP generates demand and matches opportunities. MASS executes the work. A homeowner can go from "I need help" to "a pro is scheduled" without leaving the ecosystem. Both platforms are stable, payments flow, trust is real, and the integration is event-based.

V1 is not the full vision. V1 is the minimum credible product where every core journey works end-to-end, money moves correctly, trust is earned rather than purchased, and the MASS bridge proves that marketplace intelligence and operational execution can share a feedback loop.

## 3. V1 Governing Principles

- No new features until existing journeys are certified end-to-end.
- Heavy AI and video components remain at basic implementation sufficient for a stable V1. Budget and feature power increase immediately following stabilization.
- NCLP and MASS integrate through versioned API contracts and domain events, never shared databases.
- Governance exists to enable production (GP-001). If governance and production compete for time, governance must justify its expansion through measurable production value.
- Thin governance, thick production (MP-001). Target ratio: 5% governance, 15% engineering standards, 80% production.

## 4. Current Platform Status

### NCLP (nc-local-pro)

| Area | Status |
|---|---|
| Database architecture | Substantially complete — Prisma schema covers marketplace, community, editorial, trust, commerce |
| API surface | 30+ route modules — broad but with 97 empty catch blocks and 337 scattered fetch calls |
| Frontend | 139 pages, 50 components — functional but 23 open stability findings from Pass 3 audit |
| Auth system | Working — registration, verification, JWT, RBAC |
| V1 journey corrections | 6 of 6 P0/P1 breakpoints resolved |
| Prisma singleton | Complete — 58 files migrated, zero rogue instances |
| Pass 2 stabilization | Complete — infrastructure and operational consistency |
| Commerce | Architecture exists; Stripe subscription checkout, Connect payouts, and webhook verification not yet validated end-to-end |
| Credential integrations | Code exists for Twilio, Postmark, Mux, Stripe, Checkr — none validated with live credentials |

### MASS (mass-hq-nitro-4x)

| Area | Status |
|---|---|
| Constitution | Ratified v1.0.1 |
| Engineering Library | 27 specifications complete |
| Application Library | APP-013 complete; APP-014 V01-V13 manufactured, review/correction active |
| Production Conveyor | Validated on NCLP stabilization |
| Pilot implementation | TNGD dispatch portal — intake and security foundations in place |
| NCLP integration | Zero integration points exist |

## 5. Manufacturing Phases

### Phase 1 — Foundation Lock

**Objective:** Both platforms reach stable, certifiable baselines. No new features. Make what exists work.

**NCLP deliverables:**

- Close remaining Pass 3 P0/P1 findings:
  - F-001 (P0): Location truth — /get-matched ZIP-to-county resolution
  - F-004 (P1): /start wizard auth state persistence
  - F-009 (P1): Contractors page error/empty-state distinction
  - F-010 (P1): Forgot-password flow (implement or remove dead link)
- Create canonical API client to replace 337 scattered fetch calls
- ESLint configuration (completed)
- Production build certification and deploy verification
- Credential provisioning: Stripe live keys, Twilio, Postmark

**MASS deliverables:**

- GDR-001: Foundation Authority Establishment (pending)
- Repository identity normalization
- Mission Statement and Universal Preface integration (EWO-MASS-001)
- Platform Governance directory structure established

**Exit criteria:** NCLP V1 journeys pass end-to-end trace with no P0/P1 open findings. MASS governance chain established. Both repositories clean and building.

### Phase 2 — Commerce Certification

**Objective:** NCLP becomes a revenue-generating platform, not a demo.

**Deliverables:**

- Stripe subscription checkout — contractors can pay for tiers
- Lead unlock / pay-per-lead flow validated end-to-end
- Webhook signature verification — Stripe events properly confirmed
- Invoice generation and history
- Refund flow validated
- Credit system verified against real transactions
- Stripe Connect — basic contractor payout onboarding. Manual admin-triggered payouts acceptable for V1. Full automation deferred.

**Exit criteria:** A contractor can subscribe, receive leads, pay for unlocks, and receive a payout. A homeowner can submit a project and see real charges flow. Refund path works. All financial events produce audit records.

### Phase 3 — NCLP-MASS Integration Bridge

**Objective:** Minimum viable integration between marketplace and operations. Clean API contracts, not infrastructure.

**Deliverables:**

- Define core domain events:
  - `OpportunityCreated` — NCLP publishes when a project is submitted
  - `ContractorMatched` — NCLP publishes when matching completes
  - `JobAwarded` — NCLP publishes when a contractor is selected
  - `JobCompleted` — MASS publishes when work is finished
  - `FeedbackSubmitted` — NCLP publishes when homeowner leaves review
- NCLP publishes events via REST webhooks when projects move through lifecycle stages
- MASS consumes events to create work orders in the dispatch system (TNGD pilot portal)
- MASS publishes completion and status events back to NCLP
- NCLP displays operational status to homeowners and contractors
- Event contract versioning established

**Scope constraints:** REST webhook calls between systems. No message queue, no event bus, no shared database. V1 integration is synchronous POST with retry. Infrastructure sophistication comes from revenue.

**Exit criteria:** A project awarded in NCLP creates a work order in MASS. A status change in MASS is visible in NCLP. Event contracts are versioned and documented.

### Phase 4 — Trust and Reputation Certification

**Objective:** Trust architecture is real, verifiable, and publicly explainable.

**Deliverables:**

- E.C.P.R. scoring verified against real data patterns
- Admin verification workflow confirmed end-to-end
- Public trust methodology page published
- Marketing claims either sourced from live platform data or removed
- Contractor rankings confirmed independent of subscription tier
- Trust Score audit trail verified

**Exit criteria:** A contractor's trust score is explainable. No marketing claim lacks a data source. Subscription tier does not influence trust ranking.

### Phase 5 — Content and Community Stabilization

**Objective:** Community and editorial features work end-to-end and produce real content.

**Deliverables:**

- Editorial engine producing articles from platform activity (deterministic templates for V1)
- Board and Blueprint features verified end-to-end
- Community moderation tools working
- SEO pages published only when backed by real local data
- Content moderation and safety flags operational

**Exit criteria:** A contractor can publish a showcase. A homeowner can post on a board. The editorial engine can produce a county/trade article from real platform activity. Moderation tools can flag and remove content.

### Phase 6 — AI and Video (Basic Implementation)

**Objective:** External integrations work at basic level. Cost-controlled. No advanced intelligence.

**Deliverables:**

| Integration | V1 Scope | Explicitly Deferred |
|---|---|---|
| AI Advisor | Claude API with structured prompts + NCLP context injection. Rate-limited. Answers homeowner project questions using platform data. | Custom models, fine-tuning, conversational memory, predictive recommendations |
| Mux Video | Upload and playback for contractor portfolios. Mux handles transcoding. | AI video analysis, automated showcase generation, video search |
| Checkr | Submit background check, receive webhook result, update verification status. | Custom screening packages, continuous monitoring |
| Phone OTP | Twilio Verify — send code, confirm code, mark verified. | Advanced fraud detection, device fingerprinting |

**Exit criteria:** Each integration connects, performs its basic function, and handles failure gracefully. No silent failures. Each is a single work order with hard scope boundaries.

## 6. Explicitly Deferred to Post-V1

These items are acknowledged, architecturally anticipated, and intentionally excluded from V1 manufacturing:

- Dynamic Data derived intelligence layer (aggregation, provenance, published insights)
- AI-powered editorial generation (replacing template interpolation with LLM)
- Predictive search and recommendation intelligence
- Dynamic lead pricing (algorithmic, demand-responsive)
- Full MASS operational telemetry feeding into NCLP intelligence
- Advanced AI Advisor with project-specific context and conversational memory
- Video analysis and AI-generated showcase content
- Unified Opportunity model (consolidating Projects and Leads into canonical entity)
- National expansion beyond North Carolina
- Full automation of contractor payouts
- Advanced Stripe Connect features (instant payouts, split payments)
- IoT and predictive maintenance integrations
- Manufacturer and supplier marketplace extensions

These items are not removed from the product vision. They are governed by MASS-PLAN-001 and will enter manufacturing when V1 revenue and stability justify the investment.

## 7. Timeline Estimate

| Phase | Estimated Sprints | Dependencies |
|---|---|---|
| Phase 1 — Foundation Lock | 3–4 | GDR-001 approval (MASS side) |
| Phase 2 — Commerce Certification | 3–4 | Phase 1 complete; Stripe live credentials |
| Phase 3 — Integration Bridge | 2 | Phase 1 complete; TNGD pilot foundations |
| Phase 4 — Trust Certification | 2–3 | Phase 2 complete (need real transaction data) |
| Phase 5 — Content Stabilization | 2–3 | Phase 1 complete |
| Phase 6 — AI and Video | 2 | Phase 1 complete; API credentials provisioned |
| **Total** | **10–14 sprints** | Phases 3–6 may partially overlap |

Phases 3, 4, 5, and 6 have limited interdependence and may execute in parallel where engineering capacity allows. Phase 2 must complete before Phase 4 (trust certification requires real transaction patterns).

## 8. Relationship to Other Governing Documents

| Document | Relationship |
|---|---|
| MASS-PLAN-001 | Parent roadmap — MASS-PLAN-003 governs NCLP-specific manufacturing within the broader MASS product vision |
| GDR-001 (pending) | Foundation authority — establishes the governance chain this roadmap operates within |
| NCLP SGPAM (planned) | Platform constitution — establishes the principles this roadmap implements |
| NCLP CDD (planned) | Domain dictionary — provides canonical terminology this roadmap references |
| V1_JOURNEY_AUDIT.md | Engineering reference — documents the V1 journey corrections this roadmap builds upon |
| PASS_3_FRONTEND_STABILITY_AUDIT.md | Engineering reference — documents the remaining P0/P1 findings Phase 1 must close |

## 9. Change Control

MASS-PLAN-003 is a living document.

Changes must:

- Preserve the V1 scope boundary. Features may not migrate from "Deferred" to "V1" without explicit executive approval.
- Record why a phase, deliverable, or timeline estimate was modified.
- Distinguish completed work from planned work.
- Never rewrite completed history.
- Maintain the governing principle: ship V1 before expanding V1.

No AI participant may independently add features to V1 scope, remove acceptance criteria, or reclassify deferred items as V1 requirements.
