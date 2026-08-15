# ENGINEERING WORK ORDER

## TNGD-BP-007 — Route Optimization, Technician Assignment, and Dispatch Board

Project: MASS-TNGD-PILOT-001  
Conveyor: Operational Manufacturing (Conveyor B)  
Status: Executive Authorized — Pilot Inbox

### Authority

- MASS Constitution
- Engineering Library
- MASS-TNGD-PILOT-001 Operational Pilot Charter
- Pilot Implementation Backlog
- Repository Canon
- Accepted TNGD-BP-001 Secure Access baseline
- Accepted TNGD-BP-004 Customer Record and Service Case baseline
- Accepted TNGD-BP-005 Scheduling and Calendar baseline
- Accepted TNGD-BP-006 Technician Availability and Capacity baseline

### Objective

Create the governed operational dispatch capability that converts scheduling-ready appointments and verified technician capacity into dispatcher-approved technician assignments and visible field-work handoffs.

### Scope

- Dispatcher work queue
- Unassigned, recommended, assigned, and dispatched appointments
- Capacity-aware technician recommendations
- Technician assignment and reassignment
- Service-area and travel-constraint consumption
- Skill, equipment, vehicle, emergency, and capacity requirement consumption
- Assignment-conflict prevention
- Dispatch status lifecycle
- Technician handoff
- Exception handling and return to queue
- Immutable assignment history
- Audit and enterprise events
- Tenant isolation and role enforcement

### Required Lifecycle

```text
Unassigned → Recommended → Assigned → Dispatched
                 ↓             ↓
           Return to Queue  Reassigned
```

Cancellation and exception states shall preserve assignment history and audit evidence.

### Platform Contract Declaration

Creates:

- Dispatch Work Item
- Technician Assignment
- Assignment Recommendation
- Dispatch Exception
- Assignment History
- Technician Handoff

Consumes:

- BP-001 secure access, roles, tenant isolation, and audit
- BP-004 Customer Record and Service Case
- BP-005 Appointment and calendar state
- BP-006 technician availability, capability, and capacity

Prepares:

- Technician job execution and field workflow for a later authorized package

### Human Approval Boundary

Recommendations may rank or explain eligible technicians, but they shall not finalize assignments.

An authorized human dispatcher must approve every initial assignment, reassignment, dispatch action, cancellation, and governed return to queue.

### Route-Recommendation Boundary

BP-007 may calculate deterministic V1 route factors from approved service-area, travel-distance, appointment-window, and technician-capacity inputs.

BP-007 shall not:

- select an external routing provider;
- claim live traffic optimization;
- autonomously assign technicians;
- autonomously alter customer appointments;
- duplicate BP-005 scheduling or BP-006 capacity calculations.

Future routing providers shall attach through a governed gateway without changing the assignment authority boundary.

### Functional Requirements

Authorized dispatchers shall be able to:

- view scheduling-ready appointments;
- view eligible technicians and exclusion reasons;
- request a governed assignment recommendation;
- approve an assignment;
- reassign work with a required reason;
- return work to the unassigned queue;
- mark an assignment dispatched;
- record and resolve dispatch exceptions;
- inspect immutable assignment history;
- produce a technician handoff containing the approved appointment, Service Case, customer, evidence references, and operational requirements.

The system shall:

- consume the complete authoritative appointment and capacity state;
- prevent assignments outside technician availability;
- prevent overlapping assignments;
- enforce service capability, skill, service area, travel radius, equipment, vehicle, emergency, and workload constraints;
- preserve tenant isolation;
- enforce least-privilege roles;
- make assignment and dispatch operations idempotent where applicable;
- publish auditable assignment and dispatch events.

### Roles and Permissions

| Role | Authority |
|---|---|
| Tenant Administrator | Configure and inspect tenant dispatch operations |
| Dispatch Administrator | Recommend, assign, reassign, return, dispatch, and resolve exceptions |
| Manager | Approve and oversee assignments and exceptions |
| Technician | Read only their accepted handoffs; no assignment authority |
| Executive | Read governed operational summaries only |

Exact permissions and database/application enforcement shall be documented.

### Data Model

Minimum entities:

- DispatchWorkItem
- AssignmentRecommendation
- TechnicianAssignment
- AssignmentHistory
- DispatchException
- TechnicianHandoff

All tenant-owned relationships shall be tenant-safe. Assignment history and approval evidence shall be immutable.

### API Requirements

Minimum operations:

```text
GET    /dispatch/work-items
GET    /dispatch/work-items/{id}
POST   /dispatch/work-items/{id}/recommendations
POST   /dispatch/work-items/{id}/assign
POST   /dispatch/work-items/{id}/reassign
POST   /dispatch/work-items/{id}/return-to-queue
POST   /dispatch/work-items/{id}/dispatch
POST   /dispatch/work-items/{id}/cancel
GET    /dispatch/work-items/{id}/history
GET    /dispatch/work-items/{id}/handoff
POST   /dispatch/work-items/{id}/exceptions
POST   /dispatch/exceptions/{id}/resolve
```

### Engineering Constraints

Implementation shall:

- remain within the approved pilot modular boundary;
- consume BP-005 and BP-006 rather than duplicate them;
- use the shared BP-001 audit chain and authorization model;
- preserve in-memory/provider-neutral seams unless a persistence provider is separately authorized;
- prevent self-approval where recommendation and approval separation applies;
- avoid speculative optimization or external-provider integration;
- avoid BP-008 and later operational scope.

### Explicit Exclusions

- Technician job execution
- Estimate creation
- Customer authorization
- Invoicing
- Square payments
- Warranty administration
- Customer follow-up
- AI-autonomous assignment
- Live traffic optimization
- External routing-provider integration
- Cross-tenant dispatch
- BP-008 or later package behavior

### Required Deliverables

1. Production implementation
2. Domain and data model
3. API inventory
4. Permission matrix
5. Assignment and dispatch rules
6. Route-recommendation boundary
7. Audit and event model
8. Database migration/reference
9. Automated tests
10. Acceptance evidence
11. Build manifest update
12. Revision log
13. Completion report and review handoff

### Acceptance Evidence

Demonstrate:

- unassigned queue visibility;
- capacity-aware technician filtering;
- skill, service-area, travel, equipment, vehicle, emergency, availability, and workload enforcement;
- deterministic recommendation explanations;
- authorized assignment and reassignment;
- human approval enforcement;
- overlap and capacity protection;
- return-to-queue behavior;
- dispatch-state transition;
- exception handling;
- tenant and role isolation;
- immutable assignment history;
- valid audit chain;
- technician handoff;
- no autonomous assignment;
- no external routing provider;
- no BP-008 or later scope;
- no regressions across BP-000 through BP-006.

### Completion Criteria

BP-007 is complete when authorized dispatchers can convert scheduling-ready appointments into conflict-free, capacity-compliant, human-approved technician assignments; dispatch those assignments; preserve immutable history and audit evidence; and generate technician handoffs without implementing field execution.

### Manufacturing Directive

Codex shall:

1. Verify canonical dependency readiness.
2. Move this work order from `production/pilot/inbox` to `production/pilot/active`.
3. Manufacture only the authorized BP-007 scope.
4. Run the complete BP-000 through BP-007 validation gate.
5. Commit implementation separately from review evidence.
6. Move the work order and completion report to `production/pilot/review`.
7. Stop for Independent Review.

No package beyond BP-007 is authorized by this work order.

Manufacturing doctrine:

Build what we approved. Improve what we learn. Defer what we imagine.
