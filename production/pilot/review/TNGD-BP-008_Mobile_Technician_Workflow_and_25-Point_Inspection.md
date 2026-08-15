# ENGINEERING WORK ORDER

## TNGD-BP-008 — Mobile Technician Workflow and 25-Point Inspection

Project: MASS-TNGD-PILOT-001  
Conveyor: Operational Manufacturing (Conveyor B)  
Status: Submitted for Independent Review

### Authority

- MASS Constitution
- Engineering Library
- MASS-TNGD-PILOT-001 Operational Pilot Charter
- MASS-TNGD-PILOT-001 Approved Operational Requirements Record
- TNGD Pilot Package Sequence Reconciliation 001
- Repository Canon
- Accepted TNGD-BP-001 Secure Access baseline
- Accepted TNGD-BP-004 Customer Record and Service Case baseline
- Accepted TNGD-BP-005 Scheduling baseline
- Accepted TNGD-BP-006 Technician Availability and Capacity baseline
- Accepted TNGD-BP-007 Dispatch and Technician Handoff baseline

### Objective

Create the governed mobile field workflow through which the assigned technician receives an authorized BP-007 handoff, progresses the assigned visit, completes the TNGD 25-Point Inspection, captures diagnostic evidence, and submits a traceable field record for later repair or estimate execution.

### Scope

- Assigned-technician mobile workflow
- Today, current, and next assigned-job views
- Arrival, start, pause, resume, and field-completion states
- 25-Point Inspection template and execution
- Itemized Does Not Apply, Pass, Flag, and Fail results
- Notes, measurements, door details, and governed media references
- Before, diagnostic, and after photographs
- Inspection validation, completion, sharing, and downloading
- Customer-facing diagnostic-report representation
- Immutable submitted inspection evidence
- Administrative visibility and exception return
- Audit events, tenant isolation, and role enforcement
- BP-009-ready repair or estimate handoff

### Explicit Diagnostic Rules

The diagnostic is named **25-Point Inspection**.

Every itemized inspection component shall accept exactly one result:

1. Does Not Apply
2. Pass
3. Flag
4. Fail

The itemized result list remains visible in the completed customer-facing diagnostic report.

The inspection is:

- required for **Garage Door Repair | Service**;
- optional for **New Garage Door Estimate**.

The approved inspection reference includes the following component checks:

1. Springs
2. Cables
3. Rollers
4. Hinges and Hardware
5. Pulleys or Drums
6. End Bearings
7. Center Bearing or Plate
8. Top and Bottom Brackets
9. Jamb Brackets
10. Vertical Tracks
11. Horizontal Tracks
12. Panels and Vinyl Trim
13. Bottom Rubber or Retainer
14. Operator
15. Rail, Trolley, Chain, or Belt
16. Safety Sensors
17. Wiring, Force, and Travel Limits
18. Keypad, Remotes, and Wall Button
19. Leveled Ground

The governed template shall also capture the operational evidence that completes the branded 25-point inspection experience, including notes, quantity, spring identification, door size, spring type, ground-level condition, required before/after media, sticker and warranty disclosure confirmation, and referral-card confirmation. These fields shall not be misrepresented as additional Pass/Flag/Fail component checks.

### Technician Workflow

Minimum lifecycle:

```text
Ready for Field Execution -> En Route -> Arrived -> In Progress
                                      -> Paused -> In Progress
                                      -> Field Complete -> Submitted
```

Exceptions shall preserve prior state and evidence. Submission shall be blocked when required inspection or media evidence is incomplete.

### Platform Contract Declaration

Creates:

- Field Work Session
- Technician Job View
- Inspection Template
- Inspection Item Definition
- Inspection Execution
- Inspection Item Result
- Field Note
- Measurement Record
- Media Reference
- Diagnostic Report
- Field Exception
- Field History

Consumes:

- BP-001 identity, authorization, tenant isolation, and audit chain
- BP-004 Customer Record and Service Case references
- BP-005 appointment state
- BP-007 assigned-technician handoff
- Approved asset/document persistence boundaries where references are required

Prepares:

- BP-009 Repair and Estimate Execution
- BP-011 invoice attachment through diagnostic-report and media references
- BP-013 warranty evidence
- BP-014 customer timeline and post-job album references

### Source-of-Truth Boundaries

BP-008 shall not duplicate or mutate BP-004 customer ownership, BP-005 scheduling, BP-006 capacity, or BP-007 assignment authority.

Photographs are captured once and referenced without duplicating the binary asset. Authorized references may later appear in the diagnostic report, estimate, job record, invoice, warranty record, customer timeline, and post-job album.

The detailed garage-door order form remains deferred.

### Functional Requirements

Assigned technicians shall be able to:

- view only their authorized today, current, and next work;
- open the BP-007 handoff;
- record governed field status transitions;
- create or resume one inspection execution for the assigned visit;
- record every component result;
- add notes and measurements;
- capture required door details;
- attach governed photographs and media references;
- identify Flag and Fail findings for later BP-009 action;
- submit the completed inspection;
- share or download the completed diagnostic report where authorized;
- return an exception to administration without closing the Service Case.

The system shall:

- prevent unassigned technicians from opening or changing field work;
- preserve tenant isolation;
- make field-state and inspection operations idempotent where applicable;
- require the inspection for Repair and allow it to remain optional for Estimate;
- reject incomplete required inspections;
- make submitted inspection evidence immutable;
- preserve all revisions, exceptions, and audit events;
- prevent customer-facing reports from exposing internal-only notes;
- produce a BP-009-ready handoff without creating repairs or estimates.

### Roles and Permissions

| Role | Authority |
|---|---|
| Technician | Read assigned handoffs; update their field session; complete inspections and evidence |
| Dispatch Administrator | Read field progress; receive exceptions; no inspection-result authorship |
| Manager | Govern exceptions and inspect evidence; no silent mutation of submitted evidence |
| Tenant Administrator | Configure tenant template availability and inspect records |
| Customer | Receive only an explicitly shared customer-facing diagnostic report |
| Executive | Read governed summaries only |

Exact permissions and enforcement shall be documented and tested.

### Data Model

Minimum entities:

- FieldWorkSession
- TechnicianJobView
- InspectionTemplate
- InspectionItemDefinition
- InspectionExecution
- InspectionItemResult
- FieldNote
- MeasurementRecord
- MediaReference
- DiagnosticReport
- FieldException
- FieldHistory

All tenant-owned relationships shall be tenant-safe. Submitted inspection results, diagnostic reports, and field history shall be immutable through database or equivalent provider-bound enforcement.

### API Requirements

Minimum operations:

```text
GET    /technician/jobs/today
GET    /technician/jobs/current
GET    /technician/jobs/next
GET    /technician/jobs/{id}
POST   /technician/jobs/{id}/status
POST   /technician/jobs/{id}/exceptions
GET    /technician/jobs/{id}/inspection
POST   /technician/jobs/{id}/inspection
PATCH  /technician/jobs/{id}/inspection/items/{itemId}
POST   /technician/jobs/{id}/inspection/notes
POST   /technician/jobs/{id}/inspection/measurements
POST   /technician/jobs/{id}/inspection/media-references
POST   /technician/jobs/{id}/inspection/submit
GET    /technician/jobs/{id}/diagnostic-report
POST   /technician/jobs/{id}/diagnostic-report/share
GET    /technician/jobs/{id}/diagnostic-report/download
GET    /technician/jobs/{id}/history
```

### Engineering Constraints

Implementation shall:

- remain inside the approved pilot modular boundary;
- consume BP-007 handoffs rather than duplicate assignment;
- use the shared BP-001 authorization and audit model;
- preserve provider-neutral seams unless a provider is separately authorized;
- store governed media references rather than duplicate binary content;
- enforce immutable submitted evidence;
- remain mobile-first and usable with intermittent connectivity while avoiding unsupported synchronization claims;
- avoid speculative AI, computer vision, or automated diagnosis;
- avoid BP-009 and later operational scope.

### Explicit Exclusions

- Repair or estimate creation
- Estimate-to-job conversion
- Customer authorization
- Invoice creation or attachment execution
- Square payments
- Warranty determination
- Customer follow-up
- Detailed garage-door order form
- AI diagnosis or image interpretation
- Live collaborative editing
- Autonomous technician decisions
- BP-009 or later package behavior

### Required Deliverables

1. Production implementation
2. Domain and data model
3. API inventory
4. Permission matrix
5. Mobile workflow and state rules
6. 25-Point Inspection template and validation rules
7. Diagnostic report and media-reference contract
8. Audit and event model
9. Database migration/reference
10. Automated tests
11. Acceptance evidence
12. Build manifest update
13. Revision log
14. Completion report and review handoff

### Acceptance Evidence

Demonstrate:

- assigned-technician-only access;
- today, current, and next job views;
- authorized field status transitions;
- one resumable inspection per assigned visit;
- exactly Does Not Apply, Pass, Flag, or Fail per component;
- required Repair inspection and optional Estimate inspection;
- required-evidence submission blocking;
- immutable submitted results and report;
- governed photo/media references without binary duplication;
- customer-safe sharing and download;
- administrative exception return;
- tenant and role isolation;
- valid audit chain;
- BP-009-ready handoff;
- no repair, estimate, authorization, invoice, payment, warranty, or door-order implementation;
- no regressions across BP-000 through BP-007.

### Completion Criteria

BP-008 is complete when an assigned technician can receive a BP-007 handoff, progress the visit, complete and submit the required 25-Point Inspection with governed evidence, and produce a customer-safe diagnostic report and BP-009-ready handoff without implementing repair or estimate execution.

### Manufacturing Directive

Codex shall:

1. Verify canonical dependency readiness.
2. Move this work order from `production/pilot/inbox` to `production/pilot/active`.
3. Manufacture only the authorized BP-008 scope.
4. Run the complete BP-000 through BP-008 validation gate.
5. Commit implementation separately from review evidence.
6. Move the work order and completion report to `production/pilot/review`.
7. Stop for Independent Review.

No package beyond BP-008 is authorized by this work order.

Manufacturing doctrine:

Build what we approved. Improve what we learn. Defer what we imagine.

### Activation Record

BP-008 entered Active Manufacturing on 2026-08-14 from its canonical Pilot Inbox work order at authority commit `52adc2fd88742566f9080b9b94c38a8b16c0bd1a`. IRO-016 and Executive Acceptance of BP-007 satisfy its dependency gate. Pilot Active was empty before activation. This activation authorizes only the exact BP-008 scope; the detailed garage-door order form and BP-009 or later behavior remain deferred and unauthorized.

### Review Submission Record

Manufacturing completed on 2026-08-14 at artifact commit `2d07a03910d07b9c6aa3b455719faa18ce115b76`. The complete `npm.cmd run check` gate passed with 74 tests and canonical BP-000 through BP-008 repository validation. The work order and completion evidence were submitted to Pilot Review for Independent Review. BP-009 remains unauthorized.
