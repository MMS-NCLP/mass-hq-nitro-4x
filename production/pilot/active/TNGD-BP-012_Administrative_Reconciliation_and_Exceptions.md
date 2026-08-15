# ENGINEERING WORK ORDER

## TNGD-BP-012 — Administrative Reconciliation and Exceptions

Project: MASS-TNGD-PILOT-001  
Conveyor: Operational Manufacturing (Conveyor B)  
Status: Active Manufacturing

### Authority

- MASS Constitution
- Engineering Library
- MPD-001 Dual Conveyor Manufacturing Strategy
- MPD-002 Continuous Production Flywheel
- MASS-TNGD-PILOT-001 Operational Pilot Charter
- Pilot Implementation Backlog
- Repository Canon

### Dependency Gate

Manufacturing may begin only after BP-007 through BP-011 have committed their required operational contracts and no known architecture-critical defect blocks reconciliation. Routine review may proceed in parallel under MPD-002.

### Objective

Create the governed administrative return lane that receives completed field, authorization, invoice, and payment evidence; verifies completion; identifies exceptions; assigns accountable resolution; and prevents unresolved work from silently closing.

### Scope

- Administrative completion-review queue
- Evidence completeness checks
- Repair, estimate, authorization, invoice, payment, warranty, callback, parts, and follow-up exceptions
- Exception ownership, priority, due date, status, escalation, notes, and resolution
- Reconciliation between MASS and governed external references
- Reopen and return-to-responsible-role behavior
- Immutable review and resolution history
- Operational aging and unresolved-work visibility
- BP-013 and BP-014-ready outcomes

### Platform Contract Declaration

Creates:

- CompletionReview
- ReconciliationChecklist
- OperationalException
- ExceptionAssignment
- ExceptionEvidenceReference
- ReconciliationDifference
- ResolutionDecision
- EscalationRecord
- AdministrativeHistory
- ReconciliationHandoff

Consumes:

- BP-004 Customer Record and Service Case
- BP-007 dispatch and assignment history
- BP-008 field and diagnostic evidence
- BP-009 repair and estimate outcomes
- BP-010 customer authorization evidence
- BP-011 invoice, payment, refund, and provider references
- Shared BP-001 authorization and audit chain

### Functional Requirements

Authorized administrative users shall be able to:

- view work awaiting reconciliation;
- inspect required evidence without reconstructing the job;
- identify missing, conflicting, failed, overdue, or disputed evidence;
- create and assign a governed exception;
- set priority and due date;
- return an exception to the responsible role;
- escalate unresolved exceptions;
- resolve an exception with required evidence and reason;
- reopen a resolution through a new immutable decision;
- distinguish callback, parts, estimate, payment, warranty, and follow-up outcomes;
- hand eligible warranty and follow-up outcomes to BP-013 and BP-014.

The system shall:

- prevent ordinary completion while blocking exceptions remain unresolved;
- preserve source references rather than duplicate authoritative records;
- enforce tenant isolation and least privilege;
- make exception creation and external reconciliation idempotent;
- preserve immutable review, escalation, and resolution history;
- make unresolved age and ownership visible;
- avoid silently changing invoice, payment, authorization, field, or warranty source records.

### Roles

| Role | Authority |
|---|---|
| Administrative Coordinator | Review completion evidence, create and route exceptions |
| Manager | Escalate, approve governed resolution, and reopen through a new decision |
| Dispatch Administrator | Respond to dispatch and assignment exceptions |
| Technician | Respond only to assigned field-evidence exceptions |
| Finance Steward | Respond to invoice, payment, refund, and reconciliation exceptions |
| Tenant Administrator | Configure tenant review rules and inspect all tenant records |
| Executive | Read governed summaries and unresolved-risk views |

No actor may approve their own exception resolution where separation of duties applies.

### Data and Enforcement Requirements

All tenant-owned tables require tenant-safe relationships and RLS. UUID primary keys require governed defaults. Immutable history, evidence, escalation, and resolution records require database or equivalent provider-bound enforcement. Polymorphic evidence references require explicit source type, identifier, tenant validation, and lifecycle validation.

### Minimum API Operations

```text
GET    /administration/reconciliation
GET    /administration/reconciliation/{id}
POST   /administration/reconciliation/{id}/review
POST   /administration/reconciliation/{id}/exceptions
GET    /administration/exceptions
GET    /administration/exceptions/{id}
POST   /administration/exceptions/{id}/assign
POST   /administration/exceptions/{id}/return
POST   /administration/exceptions/{id}/escalate
POST   /administration/exceptions/{id}/resolve
POST   /administration/exceptions/{id}/reopen
GET    /administration/exceptions/{id}/history
GET    /administration/outstanding
POST   /administration/reconciliation/{id}/handoffs
```

### Explicit Exclusions

- Mutation of authoritative BP-008 through BP-011 evidence
- Payment processing
- Autonomous exception resolution
- Warranty adjudication
- Customer follow-up delivery
- Advanced analytics or prediction
- BP-013 or later implementation

### Required Deliverables

1. Production implementation
2. Domain and data model
3. API inventory
4. Permission and separation-of-duty matrix
5. Reconciliation checklist and exception rules
6. Audit and event model
7. Database migration/reference
8. Automated tests and acceptance evidence
9. Build manifest update
10. Revision log
11. Completion report and review handoff

### Acceptance Evidence

Demonstrate tenant-safe completion review, evidence checks, exception categorization, accountable assignment, required reasons, escalation, immutable resolution history, self-approval prevention, idempotent reconciliation, unresolved-work visibility, BP-013/BP-014 handoffs, no source-record mutation, and no regressions through BP-011.

### Manufacturing Directive

Codex shall verify dependency readiness, move only this work order to Active, manufacture only authorized scope, run the complete validation gate, commit implementation separately from review evidence, submit the work order and completion report to Review, and continue the flywheel under MPD-002.

No package beyond BP-012 is authorized by this work order.

Manufacturing doctrine:

Build what we approved. Improve what we learn. Defer what we imagine.

### Activation Record

BP-012 entered Active Manufacturing on 2026-08-15 from canonical authority commit `5c750f9c4e3b0acc9d01346456ccf3880224ffd5`. BP-007 through BP-011 have committed their required operational contracts, Pilot Active was empty, and no repository-authorized architecture-critical dependency defect was present. BP-013 through BP-015 remain in Pilot Inbox, preserving three future authorized Work Orders. This activation does not authorize warranty adjudication, customer follow-up delivery, later-package behavior, or the deferred detailed garage-door order form.
