# ENGINEERING WORK ORDER

## TNGD-BP-014 — Customer Follow-Up and Relationship Flywheel

**Project:** MASS — TNGD Dispatch User Portal Operational Pilot  
**Package:** TNGD-BP-014  
**Status:** Executive Authorized — Dependency-Gated Pilot Inbox  
**Authority:** MASS-PLAN-001 → MASS-TNGD-PILOT-001 → Pilot Implementation Backlog → TNGD Pilot Package Sequence Reconciliation 001 → MPD-001 → MPD-002 → Canonical Repository

## 1. Mission

Manufacture the governed Customer Follow-Up and Relationship Flywheel package for the TNGD Dispatch User Portal.

This package shall convert completed service into governed satisfaction, review, estimate, maintenance, and continuing relationship activity while preserving consent, customer history, source-record ownership, and Communications delivery authority.

## 2. Dependency Gate

Manufacturing may begin only when the canonical repository contains committed, usable contracts from:

- TNGD-BP-004 — Customer Record and Service Case Creation;
- TNGD-BP-011 — Invoice and Square Payment Integration;
- TNGD-BP-012 — Administrative Reconciliation and Exceptions;
- TNGD-BP-013 — Warranty Stewardship.

Routine Independent Review may proceed in parallel and does not block activation. An architecture-critical defect affecting this package's active dependency chain does block activation.

## 3. Objective

Provide a tenant-safe, auditable follow-up policy and handoff boundary that:

- preserves follow-up after service-case and job closure;
- schedules immediate, short-term, two-month, six-month, and annual activity;
- derives eligibility from authoritative operational outcomes;
- enforces current consent and opt-out restrictions before every handoff;
- distinguishes satisfaction, review, estimate, maintenance, and relationship purposes;
- delegates every communication delivery to the governed Communications boundary;
- preserves immutable decision, suppression, and handoff evidence.

## 4. Included Scope

Support:

- tenant-governed follow-up policies and policy versions;
- immediate, short-term, two-month, six-month, and annual rules;
- eligibility based on completed service, invoice/payment state, reconciliation outcomes, estimates, and warranty state;
- customer and location relationship references;
- satisfaction, review-request, estimate, maintenance, and relationship activity types;
- due, eligible, suppressed, handed-off, completed, failed, cancelled, and superseded lifecycle evidence;
- consent checks at evaluation and handoff time;
- explicit opt-out and ineligible suppression reasons;
- governed task and Communications handoffs;
- idempotency and duplicate-handoff prevention;
- auditable rescheduling and supersession without mutating finalized evidence.

## 5. Roles and Authorization

At minimum, define least-privilege boundaries for Administrator, Dispatcher, authorized Customer-Relationship staff, and Read-only Auditor roles.

No actor may bypass consent, erase suppression evidence, or alter finalized handoff history. Tenant isolation is mandatory.

## 6. Required Data Model

At minimum, define and implement:

- FollowUpPolicy;
- FollowUpPolicyVersion;
- FollowUpEligibility;
- FollowUpActivity;
- FollowUpSuppression;
- FollowUpTaskHandoff;
- CommunicationHandoff;
- FollowUpHistory.

All tenant-owned records shall use tenant-safe keys and relationships. Source references require explicit same-tenant validation.

## 7. Required Service and API Capabilities

At minimum, provide governed operations to:

- create and version a follow-up policy;
- evaluate authoritative eligibility;
- schedule governed follow-up activity;
- recheck consent and suppress ineligible activity;
- produce task and Communications handoffs;
- record handoff outcome references;
- reschedule or supersede activity with reasoned evidence;
- retrieve current activity and immutable history.

All writes shall define authorization, idempotency, validation, audit evidence, and failure behavior.

## 8. Integration Boundaries

Consume, without duplicating:

- BP-004 customer, location, consent, service-case, and relationship timeline authority;
- BP-009 estimate and completed-work references where relevant;
- BP-011 invoice, payment, and receipt references;
- BP-012 reconciliation and exception outcomes;
- BP-013 warranty records and claim outcomes;
- APP-003 customer-record authority;
- APP-006 governed Communications delivery boundary;
- APP-012 workflow and operational orchestration boundary;
- APP-018 permitted relationship engagement boundary.

This package shall create governed handoffs only. Communications remains authoritative for delivery.

## 9. Explicit Exclusions

Do not implement:

- direct email, SMS, voice, or external-message delivery;
- consent creation or silent consent changes;
- autonomous review publication or customer impersonation;
- payment, refund, warranty, reconciliation, or estimate execution;
- reporting dashboards;
- predictive marketing or cross-tenant learning;
- detailed garage-door order form;
- BP-015 or later package behavior.

## 10. Security and Evidence Requirements

Manufacturing shall provide tenant isolation, least-privilege enforcement, authoritative consent loading, opt-out precedence, immutable finalized evidence, idempotent handoffs, source-reference validation, shared audit-chain integration, required reasons for suppression/rescheduling/supersession, and no silent event or evidence loss.

## 11. Required Tests

Include direct tests for tenant isolation; role enforcement; every required cadence; authoritative eligibility; current-consent recheck; opt-out suppression; follow-up survival after job closure; duplicate-handoff prevention; immutable evidence; reasoned rescheduling and supersession; Communications-only delivery; source-record non-mutation; BP-000 through BP-013 regressions where executable; and absence of BP-015 and later behavior.

## 12. Deliverables

Produce production implementation, Production Markdown, API Inventory, Data Model, Migration Reference, Audit and Event Model, Folder Structure, Build Manifest update, Revision Log update, automated tests, repository-validator update, and Manufacturing Completion Report.

## 13. Acceptance Criteria

TNGD-BP-014 passes when all five roadmap cadences are represented; eligibility uses authoritative records; opt-outs suppress communication; follow-up survives job closure; Communications governs every delivery; finalized evidence is immutable; prior packages are consumed without duplication; excluded capabilities remain absent; the full available validation gate passes; and all limitations are reported truthfully.

## 14. Conveyor Directive

When dependency-ready:

1. Move this Work Order from `production/pilot/inbox` to `production/pilot/active`.
2. Manufacture only this authorized scope.
3. Run the complete available validation gate.
4. Commit and synchronize the artifact set.
5. Move the Work Order and Completion Report to `production/pilot/review`.
6. Continue the MPD-002 flywheel without waiting for routine review, provided the active dependency chain remains sound and the Pilot Inbox minimum is preserved.

**Manufacturing doctrine:** Build what we approved. Improve what we learn. Defer what we imagine.

