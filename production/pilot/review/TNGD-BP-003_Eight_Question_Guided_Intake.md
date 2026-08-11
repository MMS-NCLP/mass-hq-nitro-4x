# ENGINEERING WORK ORDER

## TNGD-BP-003 — Eight-Question Guided Intake

Project: MASS-TNGD-PILOT-001
Conveyor: Operational Manufacturing (Conveyor B)
Status: Manufacturing Complete — Pending Independent Review

### Objective
Manufacture the guided intake capability that converts the service-path selection from BP-002 into a complete, structured Intake Record using no more than eight primary questions.

### Scope
The workflow shall cover:
1. Customer identity
2. Contact information
3. Service address
4. Service subtype
5. Customer need or problem description
6. Safety, security, and urgency
7. Equipment or project details
8. Availability and authorization

Conditional subquestions may appear only when relevant to the selected path. The administrative experience must remain simple, mobile-friendly, resumable, and suitable for live phone intake.

### Functional Requirements
- Present one primary question at a time
- Adapt follow-up fields by service path
- Validate required responses
- Autosave progress
- Permit interruption and continuation
- Support photo attachment and practical voice-note capture
- Preserve original intake evidence
- Produce a structured Intake Record
- Route the completed record to BP-004 Customer Record and Service Case Creation
- Record tenant, user, timestamps, source, and audit history

### Platform Contract Declaration
Creates:
- Eight-Question Guided Intake Engine
- Structured Intake Record
- Conditional intake-question rules
- Intake validation and completion lifecycle

Consumes:
- BP-001 Authentication, roles, tenant isolation, and portal separation
- BP-002 Three-Path Guided Intake and Intake Session

Requires:
- BP-004 Customer Record and Service Case Creation

Missing or deferred:
- Scheduling belongs to BP-005
- Dispatch belongs to BP-006
- Intake media governance shall use APP-004 and APP-012 boundaries; APP-013 is not the owner of routine intake evidence

### Required Deliverables
- Production implementation
- Questionnaire and conditional-rule specification
- Domain and data model
- API inventory
- Database migration/reference
- Permission matrix
- Audit/event model
- Automated tests
- Acceptance evidence
- Build manifest update
- Revision log
- Completion report and review handoff

### Acceptance Evidence
Demonstrate:
- Repair intake completion
- Estimate intake completion
- Other-service intake completion
- Eight-primary-question limit
- Adaptive follow-up behavior
- Required-field validation
- Autosave and resume
- Media attachment handling
- Tenant and role enforcement
- Audit history
- Successful structured Intake Record handoff to BP-004

### Completion Criteria
BP-003 is complete when an authorized administrative user can complete a guided service intake in eight primary questions or fewer and produce a standardized, auditable Intake Record ready for Customer Record and Service Case creation without manual restructuring or duplicate entry.

Executive Authority: Approved for manufacturing after BP-001 and BP-002 dependency requirements are satisfied.

Activation Authority: IRO-009 Executive Acceptance of BP-002 on 2026-08-11 satisfied the final dependency. Activation does not expand this work order's scope.
