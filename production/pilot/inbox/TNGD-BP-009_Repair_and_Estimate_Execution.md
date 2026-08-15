# ENGINEERING WORK ORDER

## TNGD-BP-009 — Repair and Estimate Execution

Project: MASS-TNGD-PILOT-001  
Conveyor: Operational Manufacturing (Conveyor B)  
Status: Paused — Architecture-Critical Dependency Artifact Incomplete

### Authority

- MASS Constitution
- Engineering Library
- MASS-TNGD-PILOT-001 Operational Pilot Charter
- MASS-TNGD-PILOT-001 Approved Operational Requirements Record
- TNGD Pilot Package Sequence Reconciliation 001
- Repository Canon
- Accepted TNGD-BP-008 Mobile Technician Workflow and 25-Point Inspection baseline

### Dependency Gate

This work order is authorized for the canonical Pilot Inbox, but manufacturing may not activate until every named predecessor has received Independent Review and Executive Acceptance. Only one pilot package may be active.

### Objective

Create the governed operational records and workflows that convert BP-008 diagnostic findings into repair work or a New Garage Door Estimate while preserving recommendations, approvals, performed work, declined work, and source lineage.

### Scope

- Garage Door Repair | Service template
- New Garage Door Estimate template
- Repair and estimate draft lifecycle
- Diagnostic finding references
- Recommendations, options, and line items
- Customer, company, and estimate metadata
- Estimate-to-job conversion without duplicate records
- Performed, declined, deferred, and follow-up outcomes
- Standard service and warranty line items
- BP-010-ready authorization package

### Platform Contract Declaration

Creates:

- RepairRecord
- EstimateRecord
- EstimateVersion
- EstimateOption
- LineItem
- WorkRecommendation
- PerformedWork
- DeclinedWork
- EstimateConversion
- ExecutionHistory

Consumes:

- BP-003 intake classification
- BP-004 Customer Record and Service Case
- BP-008 inspection, diagnostic report, measurements, and media references

### Functional Requirements

- Create the two approved foundational templates exactly as named.
- Require a submitted BP-008 25-Point Inspection for Garage Door Repair | Service and permit it to remain optional for New Garage Door Estimate.
- Prepopulate customer, company, and estimate information.
- Prepopulate a Service line item describing the 25-Point Inspection and the requirement that an authorized adult aged 18 or older approve work.
- Prepopulate a Warranty line item describing the standard two-year parts warranty and 90-day service coverage.
- Preserve diagnostic findings as references rather than copied evidence.
- Keep recommended, authorized, performed, declined, and deferred states distinct.
- Convert an accepted estimate into job execution by preserving the estimate and reusing the existing customer and Service Case.
- Make finalized estimate versions immutable; corrections create a new version.
- Prepare authorization evidence for BP-010 without authorizing work.

### Trust and Source-of-Truth Boundaries

- Tenant isolation and least-privilege authorization are mandatory.
- Existing customer, Service Case, appointment, assignment, inspection, and financial ownership shall be consumed rather than duplicated.
- Human approval evidence shall remain distinct from recommendation or employee action.
- Audit events shall use the shared governed audit chain.
- Idempotency shall protect externally retried and lifecycle-changing operations.
- Provider-neutral seams shall remain unless a provider is explicitly authorized by this work order.

### Engineering Constraints

- Remain inside the approved pilot modular boundary.
- Preserve provider-neutral and in-memory seams where no runtime provider is authorized.
- Define tenant-safe relational constraints, immutable evidence enforcement, API inventory, permissions, migration/reference, tests, and failure behavior.
- Run the complete BP-000 through BP-009 regression and repository-validation gate.
- Do not manufacture later-package behavior.

### Explicit Exclusions

- Detailed garage-door order form
- Customer signature or authorization execution
- Invoice creation
- Square payments
- Warranty claim determination
- AI-generated pricing or autonomous recommendations
- BP-010 or later behavior

### Required Deliverables

1. Production implementation
2. Domain and data model
3. API inventory
4. Permission matrix
5. Lifecycle and business rules
6. Audit and event model
7. Database migration/reference
8. Automated tests and acceptance evidence
9. Build manifest update
10. Revision log
11. Completion report and review handoff

### Acceptance Evidence

- Both templates are present and correctly seeded
- Repair inspection rule and Estimate optionality are enforced
- Standard Service and Warranty line items are exact and reusable
- Estimate versions and source evidence remain immutable
- Conversion preserves lineage without duplicate customer or Service Case records
- No authorization, invoice, payment, or door-order scope
- No regressions through BP-008

### Manufacturing Directive

Codex shall:

1. Verify dependency readiness against canonical repository evidence.
2. Move only this work order from `production/pilot/inbox` to `production/pilot/active`.
3. Manufacture only the authorized scope.
4. Run the complete validation gate.
5. Commit implementation separately from review evidence.
6. Move the work order and completion report to `production/pilot/review`.
7. Stop for Independent Review.

No later package is authorized by this work order.

Manufacturing doctrine:

Build what we approved. Improve what we learn. Defer what we imagine.

### Activation Record

BP-009 entered Active Manufacturing on 2026-08-15 under MPD-002 at canonical authority commit `5220068f41b94d2414fba9a2c181b02c99b35f74`. BP-008 is a committed provisional predecessor baseline: its complete manufacturing gate passed with 74 tests, it is in Pilot Review, and no architecture-critical or active-dependency defect is known. Pilot Active was empty before activation. This activation authorizes only the exact BP-009 scope; BP-010 behavior and the detailed garage-door order form remain excluded.

### Architecture-Critical Pause Record

Canonical post-activation inspection found that BP-008 artifact commit `2d07a03910d07b9c6aa3b455719faa18ce115b76` does not contain the field-workflow source, automated BP-008 test, migration reference, dispatch handoff extension, or foundation updates required by its completion report. Because BP-009 must consume those committed contracts, MPD-002 requires the affected dependency chain to pause. No BP-009 implementation was manufactured. Executive Attention `ATTENTION-20260815-MASS-PILOT-BP008-INCOMPLETE-CANONICAL-ARTIFACT` records the required resolution.
