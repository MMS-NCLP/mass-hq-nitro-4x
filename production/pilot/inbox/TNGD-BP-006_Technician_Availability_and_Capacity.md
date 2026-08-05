# ENGINEERING WORK ORDER

## TNGD-BP-006 — Technician Availability and Capacity

Project: MASS-TNGD-PILOT-001
Conveyor: Operational Manufacturing (Conveyor B)
Status: Executive Authorized

### Objective
Create the technician availability and capacity layer required to convert service cases and appointment requests into assignable field work.

### Scope
- Technician profiles and service capabilities
- Standard shifts and recurring availability
- PTO, blackout dates, training blocks, and administrative holds
- Service-area and travel-radius constraints
- Daily appointment capacity and workload limits
- Emergency and same-day capacity controls
- Skill, equipment, and vehicle requirements
- Capacity visibility for scheduling and dispatch

### Functional Requirements
- Permit authorized administrators to configure technician working hours and exceptions
- Calculate available capacity by date, time window, service type, and service area
- Prevent overlapping assignments and assignments outside authorized hours
- Support temporary overrides with reason, author, and audit history
- Expose availability to BP-005 scheduling and BP-007 dispatch
- Preserve tenant isolation and role enforcement
- Publish auditable availability and capacity events

### Platform Contract Declaration
Creates:
- Technician Availability Profile
- Capacity Window
- Availability Exception
- Technician Capability Matrix

Consumes:
- BP-001 secure access and tenant isolation
- BP-004 service cases
- BP-005 appointment and calendar records

Requires:
- BP-007 route optimization and dispatch board

### Required Deliverables
- Production implementation
- Domain and data model
- API inventory
- Permission matrix
- Capacity calculation rules
- Database migration/reference
- Audit and event model
- Automated tests
- Acceptance evidence
- Build manifest update
- Revision log
- Completion report and review handoff

### Acceptance Evidence
Demonstrate shift setup, PTO blocking, blackout dates, capability filtering, service-area filtering, same-day capacity, overlap prevention, authorized override, tenant isolation, and successful availability handoff to scheduling and dispatch.

### Completion Criteria
BP-006 is complete when authorized users can maintain reliable technician availability and the system can calculate auditable, conflict-free capacity for scheduling and dispatch.