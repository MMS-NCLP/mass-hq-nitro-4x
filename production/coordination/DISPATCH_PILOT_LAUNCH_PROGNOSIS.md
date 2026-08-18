# Dispatch Pilot Launch Prognosis

**Date:** 2026-08-18
**Project:** MASS-TNGD-PILOT-001
**Goal:** Launch the TNGD dispatch pilot with a seeded, validated MASS HQ control plane and a healthy supporting ecosystem

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
| Pilot Active | Empty (all work accepted) |
| Pilot Inbox | Empty |
| UI/UX Layer | **Not yet implemented** — next authorized phase |
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

## Next Phase — UI/UX Implementation

The dispatch engine is fully manufactured. The next authorized phase is the Pilot Experience Implementation — a focused presentation/integration pass exposing the accepted backend through three operational modes:

### Office Mode
Today dashboard, customers, intake, schedule/dispatch board, jobs, estimates/invoices, reporting.

### Technician Mode
Today's jobs, customer/job details, navigation, arrival/status controls, inspection/workflow, photos/notes, estimate, authorization/signature, collect payment, complete job.

### Admin Mode
Users/roles, pricing/configuration, service capacity, reporting, import/reconciliation, system settings.

This is NOT another capability conveyor. It is the presentation layer over established services.

---

## Launch Readiness Gate (DEFERRED)

The launch readiness gate will execute after UI implementation is complete. The acceptance test is:

> Davon can open TNGD Dispatch, create or find a customer, schedule a call, dispatch it, operate the technician experience, produce an estimate, obtain authorization, invoice/collect payment, close the job, and see the resulting reporting — without touching code or a terminal.

### Gate Criteria

| Gate | Criterion |
|---|---|
| Pilot Complete | All 16 packages accepted — **DONE** |
| UI Operable | All three modes functional — **PENDING** |
| Customer Data | Production import executed — **PENDING** |
| Test Suite | All tests passing — **DONE** (174/174) |
| Validator | Canonical validation passes — **DONE** |
| TNGD Site | Build clean, 0 high vulns — **PENDING** (ecosystem) |
| nc-local-pro | Build passes, 0 critical vulns — **PENDING** (ecosystem) |
| No Open LCOs | All accepted — **DONE** |

---

## Deferred Items

| Item | Deferred To | Reason |
|---|---|---|
| RingCentral integration | V2 | Executive decision — not a pilot requirement |
| Production customer import | Post-UI | Import tool validated; data seeding follows UI |
| Ecosystem corrections (TNGD, nc-local-pro) | Parallel | Independent of MASS manufacturing |
| Minor corrections (LC-001–003) | Post-launch or parallel | None compromise pilot safety |

---

## Governing Doctrine

Build what we approved. Improve what we learn. Defer what we imagine.

No constitutional, Engineering Library, or manufacturing process modifications are authorized by this prognosis. This document is a coordination artifact, not a work order.
