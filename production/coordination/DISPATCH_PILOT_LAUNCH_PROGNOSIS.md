# Dispatch Pilot Launch Prognosis

**Date:** 2026-08-20
**Project:** MASS-TNGD-PILOT-001
**Goal:** Launch the TNGD dispatch pilot with a seeded, validated MASS HQ control plane and a healthy supporting ecosystem
**Current posture:** **V1 READY FOR PRE-LAUNCH PRODUCTION**

---

## Current State

| Area | Status |
|---|---|
| Pilot Packages (BP-000–015) | **16/16 accepted** |
| BP-004.1 Schema Expansion LCO | **Accepted** |
| HCP Batch Import | **Accepted** (tool validated, production import deferred) |
| MASS HQ Tests | **174/174 passing** |
| MASS HQ Customer Data | Import tool validated (218+104 records). Production seeding deferred until post-UI |
| Independent Review | Batch acceptance completed 2026-08-18 |
| Minor Corrections Opened | 3 (LC-001 through LC-003, none blocking) |
| Pilot Active | Empty |
| Pilot Inbox | Commerce Operations completion is the current executable pre-launch delta |
| UI/UX Layer | Product Realization follows Commerce checkpoint and Media Source Connection / Manifest |
| Visual Company | **V1 directive established** — real governed company media is production input |
| Operational Pulse | **V1 baseline authorized**; deeper adaptive health intelligence reserved for V2 |
| TNGD Media Interoperability | **V1 directive established** for Dispatch/HQ <-> governed media <-> TNGD website reuse |
| TNGD Live Site | Ecosystem correction prompt prepared |
| nc-local-pro | Ecosystem correction prompt prepared |

---

## Completed Phases

### Phase 1 — Manufacturing (COMPLETE)

All 16 pilot packages manufactured, reviewed, and accepted:

| Package | Title | Accepted |
|---|---|---|
| BP-000 | Pilot Implementation Foundation | 2026-08-18 |
| BP-001 | Secure Access, Roles, and Portal Separation | 2026-08-18 |
| BP-002 | Three-Path Intake and Lead Capture | Prior |
| BP-003 | Eight-Question Guided Intake | Prior |
| BP-004 | Customer Record and Service Case Creation | Prior |
| BP-005 | Scheduling and Calendar Integration | Prior |
| BP-006 | Technician Availability and Capacity | Prior |
| BP-007 | Route Optimization, Technician Assignment, and Dispatch Board | Prior |
| BP-008 | Mobile Technician Workflow and 25-Point Inspection | 2026-08-18 |
| BP-009 | Repair and Estimate Execution | 2026-08-18 |
| BP-010 | Customer Authorization Evidence | 2026-08-18 |
| BP-011 | Invoice and Square Payment Integration | 2026-08-18 |
| BP-012 | Administrative Reconciliation and Exceptions | 2026-08-18 |
| BP-013 | Warranty Stewardship | 2026-08-18 |
| BP-014 | Customer Follow-Up and Relationship Flywheel | 2026-08-18 |
| BP-015 | Pilot Reporting and Operational Visibility | 2026-08-18 |

Additional accepted work: BP-004.1 LCO (schema expansion), HCP-IMPORT (batch import tool).

### Phase 2 — Data Tooling (COMPLETE)

Customer import tool validated against both HCP primary export (218 created, 35 deduplicated, 3 skipped) and Square corrected export (104 created, 1 matched, 0 skipped). Production data seeding deferred until after UI implementation.

---

## Pre-Launch Production Sequence — AUTHORIZED

The remaining V1 sequence is intentionally narrow:

1. **Commerce Operations Completion** — finish the bounded real-world commerce delta.
2. **Checkpoint** — verify the functional surface before visual realization.
3. **Media Source Connection / Manifest** — connect or identify authoritative TNGD media storage; establish governed references, classification, lineage, and approval boundaries. Do not perform an indiscriminate repository media dump.
4. **UI / Product Realization** — expose the accepted backend through the three operational modes using the approved reference language, Visual Company directive, and lightweight V1 Operational Pulse baseline.
5. **Live Deployment** — produce a reachable HTTPS pilot environment suitable for desktop and technician/mobile operation.
6. **Integration / Configuration Validation** — validate production-facing integrations and identify credential/configuration blockers without manufacturing workarounds that distort architecture.
7. **Live QA / Acceptance** — perform final independent review against the deployed product.
8. **Field Pilot** — operate TNGD Dispatch in real work and convert field evidence into controlled V1.x/V2 corrections.

### Office Mode
Today dashboard, customers, intake, schedule/dispatch board, jobs, estimates/invoices, reporting.

### Technician Mode
Today's jobs, customer/job details, navigation, arrival/status controls, inspection/workflow, photos/notes, estimate, authorization/signature, collect payment, complete job.

### Admin Mode
Users/roles, pricing/configuration, service capacity, reporting, import/reconciliation, system settings.

This is NOT another capability conveyor. It is pre-launch completion and presentation over established services.

---

## Media / Visual Company Gate

The governing companion artifact is:

`production/coordination/TNGD_MEDIA_INTEROPERABILITY_AND_VISUAL_COMPANY_V1.md`

Core rule: TNGD media is a governed company asset. Dispatch/HQ and the TNGD website should consume approved media through shared references/storage contracts rather than creating isolated media silos.

Real job/project/product media should be used where it improves comprehension. Public website reuse requires an explicit approval/rights boundary; operational media is not automatically marketing media.

The V1 media gate must not expand into a full DAM build. Deeper automatic curation/classification and cross-product intelligence remain post-V1 objectives.

---

## Launch Readiness Gate

The launch readiness gate executes against the **live deployed pilot**, not merely a local repository build. The acceptance test is:

> Davon can open TNGD Dispatch, create or find a customer, schedule a call, dispatch it, operate the technician experience, produce an estimate, obtain authorization, invoice/collect payment, close the job, and see the resulting reporting — without touching code or a terminal.

### Gate Criteria

| Gate | Criterion |
|---|---|
| Pilot Complete | All 16 packages accepted — **DONE** |
| Commerce Delta | Operational commerce completion — **PRE-LAUNCH** |
| Media Gate | Source/manifest + governed reuse path — **PRE-LAUNCH** |
| UI Operable | All three modes functional — **PRE-LAUNCH** |
| Live Pilot | HTTPS deployment reachable — **PRE-LAUNCH** |
| Customer Data | Production import executed — **PENDING** |
| Test Suite | All tests passing — **DONE** (174/174 baseline) |
| Validator | Canonical validation passes — **DONE** |
| TNGD Site | Build clean, 0 high vulns — **PENDING** (ecosystem) |
| nc-local-pro | Build passes, 0 critical vulns — **PENDING** (ecosystem) |
| No Open LCOs | All accepted — **DONE** |

---

## Deferred Items

| Item | Deferred To | Reason |
|---|---|---|
| RingCentral integration | V2 | Executive decision — not a pilot requirement |
| Full intelligent media/DAM layer | V2 | V1 uses governed source/manifest and existing assets |
| Adaptive Ambient Dynamic Pulse health engine | V2 | V1 receives lightweight dynamic baseline only |
| Production customer import | Post-UI | Import tool validated; data seeding follows UI |
| Ecosystem corrections (TNGD, nc-local-pro) | Parallel | Independent of MASS manufacturing |
| Minor corrections (LC-001–003) | Post-launch or parallel | None compromise pilot safety |

---

## Governing Doctrine

Build what we approved. Improve what we learn. Defer what we imagine.

**V1 is ready for pre-launch production.** No new speculative capability package is authorized by this prognosis. Remaining work is bounded completion, media connection, product realization, deployment, live validation, and field proof.
