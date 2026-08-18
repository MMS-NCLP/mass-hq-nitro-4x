# Dispatch Pilot Launch Prognosis

**Date:** 2026-08-17
**Project:** MASS-TNGD-PILOT-001
**Goal:** Launch the TNGD dispatch pilot with a seeded, validated MASS HQ control plane and a healthy supporting ecosystem

---

## Current State

| Area | Status |
|---|---|
| Pilot Packages (BP-000–011) | 12/16 accepted or in review |
| BP-012 Reconciliation | Manufactured, in Pilot Review |
| BP-013 Warranty Stewardship | Inbox |
| BP-014 Customer Follow-Up and Relationship Flywheel | Inbox |
| BP-015 Pilot Reporting and Operational Visibility | Inbox |
| MASS HQ Tests | 120/120 passing |
| MASS HQ Customer Data | 0 seeded (257 HCP + ~7 Square pending) |
| TNGD Live Site | Building, 6 high vulns, 1 purity violation |
| nc-local-pro | Build broken, 2 critical + 12 high vulns |
| Pilot Active | Empty |

---

## Phase 1 — Parallel Correction and Manufacturing

These two tracks run simultaneously. Neither blocks the other.

### Track A: Ecosystem Corrections (other sessions, other repos)

| Step | Repo | Prompt | Outcome |
|---|---|---|---|
| A1 | nc-local-pro | `NC-LOCAL-PRO_CORRECTION_PROMPT.md` | Build passes, critical vulns patched |
| A2 | Top-Notch-Garage-Doors | `TNGD_MAINTENANCE_PROMPT.md` | Purity fix, deps patched, injection removed |
| A3 | mass-hq-nitro-4x | Add to health audit agent scope | Future Monday briefs cover all repos |

### Track B: MASS Manufacturing (this repo, MASS sessions)

| Step | Work Order | Dependency | Deliverable |
|---|---|---|---|
| B1 | BP-012 Acceptance | Independent review | Move BP-012 from Review to Done |
| B2 | BP-013 Manufacturing | BP-012 accepted (warranty handoffs) | Warranty Stewardship service + tests |
| B3 | BP-013 Acceptance | Independent review | Move BP-013 from Review to Done |
| B4 | BP-014 Manufacturing | BP-013 accepted (follow-up handoffs) | Customer Follow-Up service + tests |
| B5 | BP-014 Acceptance | Independent review | Move BP-014 from Review to Done |
| B6 | BP-015 Manufacturing | BP-014 accepted (reporting needs all data) | Pilot Reporting service + tests |
| B7 | BP-015 Acceptance | Independent review | Move BP-015 from Review to Done |

**Manufacturing cadence:** Each work order follows the frozen four-phase process (Work Order, Manufacturing, Spot Review, Acceptance). Each passes `npm run check` before submission.

---

## Phase 2 — MASS Seeding

Begins after all 16 pilot packages (BP-000 through BP-015) are accepted.

| Step | Action | Detail |
|---|---|---|
| S1 | Issue BP-004 LCO | Expand CustomerRecord from 7 fields to match HCP's 37-field template. Add: firstName, lastName, company, role, multi-phone, additionalEmails, structured addresses (service + billing), customerType, isContractor, leadSource, tags, notes, doNotService, billsTo/acceptsBillsFrom |
| S2 | LCO Manufacturing | Implement schema expansion, update tests, run gate |
| S3 | LCO Acceptance | Independent review of schema changes |
| S4 | HCP Batch Import | Import 257 customers from HCP export (`TopNotchGarageDoorsLLC_customer_export.csv`) |
| S5 | Square Manual Entry | Add ~7 Square customers manually (limited field set) |
| S6 | Seeding Verification | Confirm all customer records are tenant-safe, deduplicated, and queryable |

---

## Phase 3 — Launch Readiness Gate

All items must be green before the dispatch pilot is declared launch-ready.

| Gate | Criterion |
|---|---|
| Pilot Complete | All 16 packages (BP-000–015) accepted in Done |
| Customer Data | 257+ HCP customers + ~7 Square customers seeded |
| Test Suite | All tests passing (expected ~140+ after BP-013–015) |
| Validator | Canonical BP-000 through BP-015 validation passes |
| TNGD Site | Build clean, 0 high vulns, purity violation fixed |
| nc-local-pro | Build passes (`next build`), 0 critical vulns |
| Audit Coverage | mass-hq-nitro-4x in Monday health brief scope |
| No Open LCOs | BP-004 schema expansion accepted |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Independent review backlog delays acceptance | Medium | Delays B1–B7 | Batch reviews where possible. BP-008–011 reviews already pending |
| nc-local-pro corrections surface deeper issues | Medium | Delays Track A only | Corrections scoped to build + vulns only. No refactoring |
| BP-013/014 scope reveals gaps in upstream contracts | Low | Could require LCOs against BP-011/012 | BP-012 handoff targets already declared for BP-013/014 |
| HCP import reveals data quality issues | Medium | Delays S4 | Schema expansion (S1) designed from actual HCP export, not assumptions |
| Next.js major version gap in nc-local-pro | Low (deferred) | Not a launch blocker | Explicitly excluded from correction scope. Separate initiative |

---

## Estimated Sequence (working sessions, not calendar days)

| Session | Work |
|---|---|
| 1 | BP-012 acceptance (if independent review available) |
| 2 | BP-013 manufacturing |
| 3 | BP-013 acceptance + BP-014 manufacturing |
| 4 | BP-014 acceptance + BP-015 manufacturing |
| 5 | BP-015 acceptance |
| 6 | BP-004 LCO + seeding |
| 7 | Launch readiness gate |

Track A corrections can happen in any session using the correction prompts — they are independent of the MASS manufacturing sequence.

---

## Governing Doctrine

Build what we approved. Improve what we learn. Defer what we imagine.

No constitutional, Engineering Library, or manufacturing process modifications are authorized by this prognosis. This document is a coordination artifact, not a work order. Each manufacturing step requires its own work order activation per MPD-002.
