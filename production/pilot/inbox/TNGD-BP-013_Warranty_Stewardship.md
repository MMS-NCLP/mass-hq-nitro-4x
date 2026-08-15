# ENGINEERING WORK ORDER

## TNGD-BP-013 — Warranty Stewardship

**Project:** MASS — TNGD Dispatch User Portal Operational Pilot  
**Package:** TNGD-BP-013  
**Status:** Executive Authorized — Dependency-Gated Pilot Inbox  
**Authority:** MASS-PLAN-001 → MASS-TNGD-PILOT-001 → Pilot Implementation Backlog → MPD-001 → MPD-002 → Canonical Repository

## 1. Mission

Manufacture the governed Warranty Stewardship package for the TNGD Dispatch User Portal.

This package shall preserve warranty eligibility, source-work lineage, claim evidence, coverage decisions, resolution history, and the distinction between covered and non-covered outcomes.

It shall consume accepted prior pilot capabilities without redefining customer records, service cases, field diagnostics, estimates, repairs, authorization, invoices, payments, or administrative reconciliation.

## 2. Dependency Gate

Manufacturing may begin only when the canonical repository contains committed, usable contracts from:

- TNGD-BP-004 — Customer Record and Service Case Creation;
- TNGD-BP-009 — Repair and Estimate Workflow;
- TNGD-BP-012 — Administrative Reconciliation and Exceptions.

Routine Independent Review may proceed in parallel and does not block activation. An architecture-critical defect affecting this package's active dependency chain does block activation.

## 3. Objective

Provide a tenant-safe, auditable warranty record and claim workflow that:

- registers eligible completed work under the applicable warranty policy;
- preserves the exact policy version and covered source items;
- distinguishes the standard two-year parts warranty from the 90-day service coverage;
- accepts warranty concerns through governed intake;
- evaluates eligibility from authoritative evidence;
- preserves human approval boundaries;
- records covered, partially covered, and non-covered decisions;
- supports warranty-related appointments without owning scheduling;
- preserves immutable decision and resolution history.

## 4. Included Scope

### 4.1 Warranty Policy and Registration

Support:

- tenant-governed warranty policy definitions;
- effective dates and policy versioning;
- separate parts and service coverage periods;
- registration from eligible completed work;
- source-job, service-case, estimate/repair, authorization, invoice, and payment references where applicable;
- covered line-item or work-item references;
- calculated coverage start and expiration dates;
- active, expired, voided, and superseded registration states;
- explicit reasons for voiding or superseding a registration.

The standard pilot policy shall represent:

- two-year parts warranty coverage;
- 90-day service coverage.

Coverage dates shall be derived from governed completion or eligibility events and shall not be caller-supplied without authorization and evidence.

### 4.2 Warranty Claim Intake

Support:

- claim creation against a valid warranty registration;
- warranty concerns entering through the existing guided intake and service-case boundary;
- customer, service-case, source-work, and registration linkage;
- issue description;
- affected covered item references;
- diagnostic and media evidence references;
- appointment references when inspection is required;
- duplicate-claim and idempotency controls;
- tenant and role authorization.

### 4.3 Eligibility and Coverage Assessment

Support deterministic assessment of:

- registration status;
- claim date against coverage dates;
- parts versus service coverage;
- source-item inclusion;
- prior supersession or voiding;
- required evidence completeness;
- administrative exceptions produced by BP-012.

Automated assessment is advisory. Final warranty coverage disposition requires an authorized human decision.

### 4.4 Findings, Decision, and Resolution

Support:

- inspection findings;
- covered, partially covered, and non-covered outcomes;
- reason codes and explanatory notes;
- approved covered items and excluded items;
- resolution action and completion evidence;
- no-charge, customer-charge, or administrative-review classification without executing payment;
- immutable finalized decisions;
- corrections through a new superseding decision rather than mutation;
- preserved claim and decision history.

### 4.5 Lifecycle

Minimum claim lifecycle:

```text
Submitted → Under Review → Awaiting Evidence / Awaiting Appointment
          → Decision Pending → Approved / Partially Approved / Denied
          → Resolution In Progress → Resolved → Closed
```

Invalid transitions shall be rejected. Every transition shall be authorized, tenant-safe, timestamped, and auditable.

## 5. Roles and Authorization

Minimum participating roles:

- Administrator;
- Dispatcher;
- Technician;
- Authorized Warranty Approver;
- Read-only Auditor.

Manufacturing shall define the permission boundary for registration, claim creation, evidence attachment, assessment, approval, denial, resolution, reopening, voiding, and read access.

No actor may approve their own exception or alter finalized evidence. Tenant isolation is mandatory.

## 6. Required Data Model

At minimum, define and implement:

- WarrantyPolicy;
- WarrantyRegistration;
- WarrantyCoverageItem;
- WarrantyClaim;
- WarrantyClaimEvidenceReference;
- WarrantyEligibilityAssessment;
- WarrantyFinding;
- WarrantyCoverageDecision;
- WarrantyResolution;
- WarrantyHistory;
- WarrantyHandoff or equivalent governed integration record.

All tenant-owned records shall use tenant-safe keys and relationships. Polymorphic references require explicit same-tenant and lifecycle validation.

## 7. Required Service and API Capabilities

At minimum, provide governed operations for:

- create and version warranty policy;
- register eligible completed work;
- retrieve warranty registration and current coverage;
- create and retrieve warranty claim;
- attach governed evidence references;
- evaluate eligibility;
- record findings;
- submit coverage decision;
- supersede an incorrect decision;
- begin and complete resolution;
- list claim history;
- produce downstream handoff without executing excluded capabilities.

All write operations shall define authorization, idempotency, validation, audit evidence, and failure behavior.

## 8. Integration Boundaries

Consume, without duplicating:

- BP-004 customer and service-case authority;
- BP-005 appointment references;
- BP-008 inspection, checklist, and media evidence;
- BP-009 estimate, repair, work-item, and completion evidence;
- BP-010 customer authorization evidence;
- BP-011 invoice and payment references;
- BP-012 reconciliation and exception evidence.

This package shall not mutate authoritative source records.

## 9. Explicit Exclusions

Do not implement:

- autonomous warranty adjudication;
- payment, refund, or charge execution;
- invoice stewardship;
- customer communication delivery;
- follow-up automation;
- reporting dashboards;
- AI-generated findings;
- cross-tenant learning;
- external warranty-provider integration;
- detailed garage-door order form;
- BP-014 or later package behavior.

## 10. Security and Evidence Requirements

Manufacturing shall provide:

- tenant isolation;
- least-privilege role enforcement;
- immutable finalized decisions and resolution evidence;
- self-approval prevention;
- idempotent registration and claim creation;
- source-reference validation;
- audit-chain integration;
- reason requirements for denial, partial approval, voiding, reopening, and supersession;
- database or repository-reference enforcement matching the established pilot implementation standard;
- no silent event or evidence loss.

## 11. Required Tests

Include direct tests for:

- tenant isolation;
- duplicate registration prevention;
- duplicate claim prevention;
- parts and service expiration boundaries;
- eligibility derived from authoritative dates;
- covered, partial, and denied decisions;
- missing-evidence behavior;
- invalid lifecycle transitions;
- self-approval prevention;
- immutable finalized decisions;
- superseding correction behavior;
- source-record non-mutation;
- appointment-reference behavior;
- BP-000 through BP-012 regressions where executable;
- absence of BP-014 and later behavior.

## 12. Deliverables

Produce:

1. Production implementation;
2. Production Markdown;
3. API Inventory;
4. Data Model;
5. Migration Reference;
6. Audit and Event Model;
7. Folder Structure;
8. Build Manifest update;
9. Revision Log update;
10. Automated tests;
11. Repository validator update;
12. Manufacturing Completion Report.

## 13. Acceptance Criteria

TNGD-BP-013 passes when:

- the standard two-year parts and 90-day service coverages are represented distinctly;
- registrations preserve exact policy and source-work lineage;
- warranty claims are tenant-safe, idempotent, and auditable;
- eligibility uses authoritative evidence and governed dates;
- final coverage decisions remain human-authorized;
- covered, partial, and non-covered outcomes are explicit;
- finalized evidence is immutable;
- corrections create superseding evidence;
- prior pilot capabilities are consumed without duplication;
- excluded capabilities remain absent;
- the full available validation gate passes;
- all deliverables and limitations are reported truthfully.

## 14. Conveyor Directive

When dependency-ready:

1. Move this Work Order from `production/pilot/inbox` to `production/pilot/active`.
2. Manufacture only this authorized scope.
3. Run the complete available validation gate.
4. Commit and synchronize the artifact set.
5. Move the Work Order and Completion Report to `production/pilot/review`.
6. Continue the MPD-002 flywheel without waiting for routine review, provided the active dependency chain remains sound and the Pilot Inbox minimum is preserved.

**Manufacturing doctrine:** Build what we approved. Improve what we learn. Defer what we imagine.
