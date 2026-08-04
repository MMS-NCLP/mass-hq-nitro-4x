# MASS-TNGD-PILOT-001

## TNGD Dispatch User Portal — Operational Pilot Charter

**Document Type:** Product Mission, Vision, and Implementation Structure
**Status:** Pilot Planning Baseline v1.0
**Pilot Organization:** Top Notch Garage Doors LLC
**Platform:** MASS
**Primary Users:** Administrative staff, dispatchers, field technicians, managers, and executive leadership
**Purpose:** Establish the first production-operable slice of MASS and provide TNGD with a controlled path away from its current CRM.

---

## 1. Mission

The mission of the **TNGD Dispatch User Portal Operational Pilot** is to deliver the smallest complete version of MASS capable of running Top Notch Garage Doors’ daily service operation from initial customer contact through scheduling, dispatch, field service, payment, administrative reconciliation, and long-term customer follow-up.

The pilot shall replace unnecessary CRM complexity with a guided operating experience that helps staff complete the correct work in the correct order.

The portal shall not require employees to understand the architecture of MASS, choose among numerous applications, or manually reconstruct the next step in a customer’s lifecycle.

MASS shall guide each authorized user through their responsibilities based on:

* Their role
* The customer’s request
* The current job status
* Required company procedures
* Missing information
* Completed actions
* The next authorized action

The pilot shall become the first real operating implementation of MASS, not a disposable temporary CRM.

---

## 2. Product Vision

The TNGD Dispatch User Portal shall operate as a secure internal MASS environment that is separate from the public TNGD website.

The public website remains responsible for:

* Marketing
* Service information
* Customer education
* Lead generation
* Booking requests
* Estimate requests
* Public forms
* Customer-facing communication
* Approved payment and portal links

The website may collect information and transmit it through governed API boundaries.

The website shall not become the internal operating system.

The Dispatch User Portal shall be the authenticated environment where TNGD staff receive, organize, schedule, execute, reconcile, and follow up on customer work.

The public website is an external input and output surface.

MASS is the internal operating environment.

---

## 3. Pilot Objective

The pilot is successful when TNGD can discontinue normal daily dependence on its current CRM without losing the ability to:

* Receive customer requests
* Create and locate customer records
* Schedule appointments
* Assign technicians
* Communicate job information
* Perform field inspections
* Prepare estimates
* Record customer authorization
* Generate invoices
* Process or reconcile payments
* Document completed work
* Manage warranties and follow-up requirements
* Request customer reviews
* Maintain long-term customer relationships
* Review basic operational performance

The pilot does not require the entire MASS roadmap to be implemented.

It requires one complete and reliable operational loop.

---

## 4. Governing Design Principle

The employee experience shall remain simple even when the underlying operation is complex.

The core interaction standard is:

> **Choose one of three service paths. Complete no more than eight primary intake questions. Follow the next instruction presented by MASS.**

Complexity shall be handled through system rules, role permissions, conditional questions, status transitions, integrations, and automation behind the interface.

Complexity shall not be placed on the employee.

---

## 5. Pilot Users

### 5.1 Administrative and Dispatch User

The administrative user receives calls, enters new requests, identifies existing customers, schedules appointments, assigns technicians, manages exceptions, reconciles completed work, and performs follow-up.

For the TNGD pilot, this experience is designed primarily around Kenesha’s daily workflow.

### 5.2 Field Technician

The technician receives assigned work, reviews customer and job information, updates travel and onsite status, performs inspections, records findings, prepares recommendations, obtains authorization, documents work, records parts and payment activity, and returns the completed record to administration.

### 5.3 Manager

The manager monitors job flow, handles exceptions, reviews estimates, resolves customer concerns, oversees technicians, and verifies that jobs are completed according to TNGD policy.

### 5.4 Executive

The executive reviews company conditions, job activity, revenue signals, exceptions, unresolved estimates, callbacks, payment concerns, technician performance, and operational trends.

The executive interface is not required to operate the pilot’s basic dispatch loop but should be included before full pilot acceptance.

---

## 6. Opening User Experience

After authentication, the administrative user shall enter a deliberately simple intake screen.

The screen shall not open with charts, lengthy menus, or multiple pipelines.

It shall ask:

> **What is the customer contacting us about?**

The user shall receive three primary choices.

### 6.1 Garage Door Repair

Used for problems involving an existing garage door, opener, spring, cable, track, panel, roller, hinge, weather seal, remote, keypad, or related equipment.

Emergency conditions shall be identified within the Repair path rather than established as a separate top-level intake category.

### 6.2 Garage Door Estimate

Used for new doors, replacement doors, door upgrades, opener installations, screen doors, major projects, new construction, measurements, and other work requiring an estimate or onsite consultation.

### 6.3 Other Service

Used for pressure washing, junk removal, and any additional company service activated by authorized configuration.

These top-level service choices shall be configurable by organization. Other businesses using MASS may define their own primary service categories while preserving the same simplified intake pattern.

---

## 7. The Eight-Question Intake Standard

The pilot shall use no more than eight primary intake questions.

Conditional details may appear within a question when required by the selected service, but the employee shall experience one short and memorable intake sequence.

### Question 1 — Customer Identity

* Customer name
* Existing customer search
* Company name when applicable

### Question 2 — Contact Information

* Primary phone number
* Email address
* Preferred communication method

### Question 3 — Service Location

* Service address
* Billing address when different
* Access or gate instructions

### Question 4 — Service Category

* Repair
* Estimate
* Other activated service
* Relevant service subtype

### Question 5 — Customer Need

* What is happening?
* What is the customer trying to accomplish?
* Why are they contacting TNGD today?

The answer may be typed, selected, or captured as a voice note and summarized into structured text.

### Question 6 — Safety, Security, and Urgency

Examples include:

* Door stuck open
* Door stuck closed
* Door off track
* Vehicle trapped
* Property unsecured
* Broken spring
* Hanging cable
* Door at risk of falling
* Immediate access concern

MASS shall use this information to apply urgency indicators. Staff shall retain authority over scheduling and emergency classification.

### Question 7 — Equipment or Project Details

For repair requests, this may include:

* Garage door brand, if known
* Opener brand, if involved
* Approximate door size
* One-car or two-car door
* Door position
* Visible spring or cable condition
* Prior repair history
* Available photos

For estimates, this may include:

* Replacement or new construction
* Number of doors
* Approximate measurements
* Door style preference
* Insulation preference
* Window preference
* Opener requirement
* Available photos

For other services, the system shall load the corresponding configured mini-intake.

### Question 8 — Availability and Authorization

* Preferred appointment dates or time windows
* Adult availability
* Whether the person is authorized to approve the work
* Relevant scheduling constraints

---

## 8. Intake Assistance

The intake shall behave as a guided frame of logic rather than a passive form.

MASS shall:

* Reveal only relevant follow-up questions
* Warn when required information is missing
* Locate likely duplicate customers
* Identify prior service at the address
* Highlight possible emergency conditions
* Suggest the appropriate request type
* Display light troubleshooting prompts
* Permit photo attachment
* Permit voice-note capture
* Summarize the request for confirmation
* Recommend the next authorized action

MASS may advise.

The administrative user remains responsible for confirming the information and proceeding with the intake.

---

## 9. Request Classification

After intake, MASS shall create or update the appropriate records.

The request may become:

* New lead
* Existing customer inquiry
* Repair service request
* Estimate opportunity
* Emergency review request
* General callback
* Warranty concern
* Follow-up service
* Other configured service request
* Incomplete intake requiring additional information

A public website submission and an employee-entered phone call shall enter the same governed intake pipeline.

The source shall be recorded, but the operational handling shall remain consistent.

---

## 10. Customer Record

The pilot shall maintain one customer record capable of representing:

* Identity
* Contact information
* Service locations
* Communication preferences
* Service history
* Estimates
* Jobs
* Invoices
* Payments
* Photos
* Documents
* Warranty information
* Recommendations
* Review requests
* Follow-up activity
* Customer concerns
* Internal notes
* Marketing consent and communication restrictions

The customer record shall not disappear after a job is completed.

It shall become the continuing relationship timeline for future service.

---

## 11. Scheduling and Calendar

After intake, the administrative user shall move directly into scheduling when the request is ready.

The pilot shall support:

* Office calendar
* Technician availability
* Business hours
* Appointment windows
* Service duration rules
* Service territory
* Travel buffers
* Urgency indicators
* Technician skill or qualification
* Manual technician assignment
* Rescheduling
* Cancellation
* Appointment confirmation
* Reminder communication

### Initial Calendar Integration

The pilot may use Google Calendar as a synchronized scheduling and notification surface.

MASS shall remain the authoritative operational record.

Google Calendar may receive:

* Appointment date and time
* Technician assignment
* Customer name
* Service location
* Limited job summary
* Approved internal links

Sensitive customer and operational information shall not be unnecessarily duplicated in calendar descriptions.

---

## 12. Dispatch Board

The dispatch board shall provide a clear daily view of work requiring coordination.

The administrative user shall be able to view:

* Unscheduled requests
* Scheduled jobs
* Assigned jobs
* Unassigned jobs
* Technician availability
* En-route jobs
* Onsite jobs
* Delayed jobs
* Completed jobs
* Jobs requiring attention
* Follow-up work

The interface shall present human-friendly queues rather than forcing the user to manage every technical status manually.

The primary administrative queues should be:

### New

New calls, web requests, and incomplete intake.

### Scheduled

Appointments with dates and technician assignments.

### Attention Needed

Reschedules, missing information, delayed technicians, callbacks, unpaid invoices, unresolved estimates, warranty concerns, and customer complaints.

### Follow-Up

Completed jobs requiring courtesy calls, review requests, estimate follow-up, maintenance reminders, or relationship activity.

---

## 13. Dispatch Communication

Once a job is scheduled and assigned, MASS shall create the technician handoff.

The handoff may include:

* Customer name
* Service address
* Appointment window
* Request summary
* Urgency
* Access instructions
* Equipment details
* Prior service history
* Uploaded photos
* Internal notes
* Contact controls
* Navigation link

The pilot shall support:

* Internal comments
* Technician status updates
* ETA updates
* Administrative instructions
* Customer confirmation messages
* Approved SMS or email notifications
* Escalation when the technician cannot proceed

The system shall avoid requiring staff to copy the same information into multiple tools.

---

## 14. Technician User Experience

The technician experience shall be mobile-first and limited to authorized field responsibilities.

The technician home screen shall emphasize:

* Today’s jobs
* Current job
* Next stop
* Schedule changes
* Jobs requiring action
* Notifications from administration

For each job, the technician shall receive:

* Customer information
* Service address
* Navigation
* Appointment window
* Customer concern
* Intake summary
* Photos
* Equipment details
* Previous service history
* Warranty information
* Access instructions
* Contact controls

The technician shall not receive unrestricted administrative or company-wide information.

---

## 15. Technician Workflow

The field workflow shall use clear status actions.

Recommended pilot states include:

1. Assigned
2. Accepted
3. En route
4. Arrived
5. Inspection started
6. Findings recorded
7. Recommendation prepared
8. Awaiting customer authorization
9. Work authorized
10. Work in progress
11. Work completed
12. Follow-up required
13. Payment recorded
14. Submitted for administrative review

The technician shall use structured selections, photos, voice notes, checklists, measurements, and short comments wherever possible.

Long narrative entry shall not be the default.

---

## 16. Inspection and Diagnostic Record

The technician shall be able to document:

* Inspection checklist
* Observed condition
* Failed or worn components
* Safety concerns
* Door and opener details
* Measurements
* Photos
* Recommended repairs
* Declined recommendations
* Required parts
* Additional work
* Warranty applicability

TNGD’s inspection and service standards should be enforced through configured checklists and required evidence rather than employee memory alone.

---

## 17. Repair Workflow

For repair work, the pilot shall support:

* Diagnosis
* Recommended repair
* Parts
* Labor
* Service options
* Customer authorization
* Work performed
* Parts used
* Completion evidence
* Warranty assignment
* Declined work
* Follow-up requirement

The system shall distinguish between:

* Recommended
* Authorized
* Completed
* Declined
* Deferred

---

## 18. Estimate Workflow

For estimate requests, the pilot shall support:

* Measurements
* Existing door condition
* Product category
* Construction level
* Insulation preference
* Style
* Windows
* Color
* Opener requirement
* Site conditions
* Electrical considerations
* Photos
* Product options
* Estimate preparation
* Estimate delivery
* Customer response
* Follow-up schedule
* Acceptance and conversion into scheduled work

An accepted estimate shall not require staff to recreate the customer and project information.

It shall convert into an authorized job using the existing record.

---

## 19. Customer Authorization

The pilot shall record customer approval for work and estimates.

Authorization evidence should include:

* Customer identity
* Authorized scope
* Price
* Discounts
* Terms
* Date and time
* Signature or equivalent approved acknowledgment
* Technician identity
* Declined recommendations
* Relevant policies and warranties presented

The system shall prevent employees or AI participants from approving work on behalf of the customer.

---

## 20. Invoice and Payment Portal

The pilot shall provide a clear financial completion path without requiring MASS V1 to replace Square.

### MASS Responsibilities

MASS shall maintain:

* Job financial summary
* Line items
* Parts
* Labor
* Discounts
* Coupons
* Applicable taxes
* Deposits
* Balance due
* Payment status
* Payment method reference
* Invoice status
* Reconciliation status
* Receipt reference

### Square Responsibilities

Square may provide:

* Card processing
* Payment links
* Digital receipts
* Stored payment capabilities where authorized
* Financing options where available
* Transaction records
* Refund processing

### Supported Payment Methods

* Card
* Payment link
* Cash
* Check
* Financing
* Partial payment
* Deposit

MASS shall receive and store the resulting payment state without storing prohibited card data.

### Customer Payment Portal

The customer-facing payment portal should allow an authorized customer to:

* View the applicable invoice
* Review approved line items
* See amount paid and balance due
* Submit payment through Square
* Retrieve a receipt
* Contact TNGD regarding a discrepancy

The customer payment portal shall expose only the records authorized for that customer and transaction.

---

## 21. Administrative Reconciliation

After the technician submits the completed job, the record shall return to the administrative workflow.

The administrative user shall review:

* Work completion
* Required photos
* Inspection completion
* Customer authorization
* Invoice accuracy
* Payment status
* Parts or follow-up requirements
* Warranty details
* Customer concern
* Technician notes
* Estimate or return-visit requirements

The administrative user should manage exceptions rather than reconstructing every completed job.

Possible outcomes include:

* Administratively closed
* Payment follow-up required
* Customer callback required
* Estimate pending
* Parts ordered
* Return visit required
* Warranty review required
* Management escalation required

---

## 22. Customer Flywheel

The pilot shall preserve the customer relationship after job completion.

The customer flywheel shall transform completed service into scheduled follow-up activity.

### Immediate Completion

* Receipt
* Thank-you communication
* Completion summary
* Warranty information
* Internal follow-up task when required

### Short-Term Follow-Up

* Satisfaction check
* Service concern resolution
* Review request when eligible
* Estimate reminder when work remains open

### Two-Month Follow-Up

* Courtesy check-in
* Unresolved recommendation follow-up
* Relevant seasonal service communication

### Six-Month Follow-Up

* Maintenance reminder
* Tune-up offer
* Product or service recommendation
* Warranty or performance check where applicable

### Annual Relationship Activity

* Annual maintenance reminder
* Service anniversary
* Seasonal campaign
* Replacement or upgrade opportunity
* Customer-specific communication based on history and consent

Follow-up timing, eligibility, channels, and messages shall be configurable.

The flywheel shall respect customer consent, communication preferences, and opt-out requirements.

---

## 23. Warranty Management

The pilot shall support:

* Service warranty dates
* TNGD parts warranty
* Manufacturer warranty references
* Warranty eligibility
* Original job and invoice link
* Warranty claim intake
* Warranty service appointment
* Findings
* Covered and non-covered work
* Resolution
* Customer communication

A warranty concern shall enter the same guided intake system but follow the appropriate warranty workflow.

---

## 24. Reporting and Owner Visibility

The pilot shall provide basic operational reporting sufficient to run TNGD.

Initial reporting should include:

* New calls and requests
* Repair requests
* Estimate requests
* Other-service requests
* Scheduled jobs
* Completed jobs
* Rescheduled or cancelled jobs
* Revenue
* Payments pending
* Estimates open
* Estimates accepted
* Average ticket
* Callbacks
* Warranty jobs
* Review requests
* Reviews received
* Follow-up due
* Technician workload
* Technician completion activity

Advanced predictive intelligence is not required for soft launch.

---

## 25. AI Role in the Pilot

AI may assist with:

* Summarizing customer calls
* Structuring voice notes
* Suggesting service classification
* Identifying missing intake information
* Presenting troubleshooting prompts
* Preparing technician summaries
* Drafting customer communication
* Highlighting conflicting information
* Recommending next steps
* Summarizing daily operations
* Identifying records requiring attention

AI shall not:

* Approve work
* Authorize discounts
* Assign itself operational authority
* Confirm technical diagnosis without technician review
* Modify financial records without authorized action
* Close jobs independently
* Send unapproved sensitive communication
* Override scheduling or company policy
* Conceal uncertainty

Human authority remains absolute.

---

## 26. Security and Separation

The Dispatch User Portal shall remain separate from the public TNGD website.

The website may submit requests through authenticated, rate-limited, validated API boundaries.

The internal portal shall require authentication and role-based authorization.

Required security capabilities include:

* Tenant isolation
* Role-based access
* Least-privilege permissions
* Secure sessions
* Audit history
* Sensitive-field restrictions
* File-access controls
* API validation
* Rate limiting
* Input sanitization
* Secret management
* Logging and monitoring
* Backup and recovery
* Controlled administrative access

No public website request shall directly create privileged operational actions.

Public submissions shall create intake records requiring governed processing.

---

## 27. Core Operational Lifecycle

The pilot shall support the complete progression from first contact to active customer relationship.

Canonical lifecycle:

1. New inquiry
2. Intake in progress
3. Intake complete
4. Ready to schedule
5. Scheduled
6. Assigned
7. Dispatched
8. En route
9. Arrived
10. Inspection underway
11. Findings recorded
12. Awaiting approval
13. Authorized
14. Work in progress
15. Completed
16. Payment pending or paid
17. Administrative review
18. Closed
19. Follow-up due
20. Customer relationship active

Detailed system statuses may exist behind the interface.

Users shall see only the statuses and queues needed for their work.

---

## 28. Soft Pilot Scope

The soft pilot shall focus on a limited operating group.

Recommended initial participants:

* One administrative or dispatch user
* Davon as technician and executive
* One additional technician when stable
* Limited management access
* Selected real customer jobs

The pilot shall begin with garage door repair and estimate workflows.

Other services may be activated after the primary workflows prove stable.

---

## 29. Soft Launch Readiness Requirements

TNGD may begin the controlled soft pilot when the following capabilities are operational and tested:

### Access and Security

* Secure staff login
* Administrative role
* Technician role
* Executive role
* Password recovery
* Role permissions
* Audit logging

### Intake

* Three-option opening screen
* Eight-question intake
* Existing customer search
* Customer creation
* Service-address creation
* Repair path
* Estimate path
* Other-service configuration
* Urgency indicator
* Photo attachment
* Voice-note support or practical alternative
* Intake confirmation

### Scheduling

* Appointment creation
* Technician availability
* Calendar view
* Google Calendar integration or approved scheduling replacement
* Rescheduling
* Cancellation
* Customer confirmation
* Appointment reminders

### Dispatch

* Daily dispatch board
* Job assignment
* Technician handoff
* Status updates
* Internal notes
* Customer and technician communication
* Attention-needed queue

### Field Operations

* Technician mobile view
* Job details
* Navigation
* Customer contact
* Inspection checklist
* Photos
* Findings
* Recommendations
* Customer authorization
* Work-completion record
* Parts used
* Follow-up requirement

### Financial Completion

* Estimate record
* Invoice line items
* Discounts and coupons
* Payment-state tracking
* Square connection
* Payment portal or payment link
* Receipt reference
* Administrative reconciliation

### Post-Service Flywheel

* Completed-job queue
* Courtesy follow-up
* Review request
* Estimate follow-up
* Two-month follow-up
* Six-month reminder
* Customer timeline
* Communication preferences and opt-out handling

### Management

* Basic operational reporting
* Open exceptions
* Outstanding estimates
* Unpaid balances
* Callback and warranty visibility
* Data export
* Backup and recovery verification

---

## 30. Pilot Launch Gates

Soft launch shall require confirmation that:

* The complete customer-to-follow-up loop works
* No critical customer record is lost
* Scheduling conflicts are visible
* Technician updates return to administration
* Payments can be reconciled
* Completed jobs enter follow-up
* Permissions prevent unauthorized access
* Public website traffic remains separated from internal operations
* Backup and recovery procedures are tested
* Staff can perform the primary workflow without developer assistance
* The old CRM remains available for short-term reference during controlled transition
* A rollback procedure exists

---

## 31. Pilot Success Measures

The pilot shall be considered operationally successful when TNGD can demonstrate:

* Consistent intake completion
* Reduced missing customer information
* Reliable scheduling
* Clear technician assignments
* Fewer manual texts and duplicate entries
* Complete job records
* Timely payment reconciliation
* Completed customer follow-up
* Reduced administrative confusion
* Faster staff training
* Reliable daily use
* Reduced dependence on the current CRM

The pilot shall be evaluated by whether it improves real business execution—not by the number of features manufactured.

---

## 32. Out of Scope for Initial Soft Launch

The following shall not block initial pilot deployment:

* Full plugin marketplace
* Broad third-party marketplace distribution
* Advanced route optimization
* Autonomous dispatch
* Predictive scheduling
* Complex inventory management
* Full accounting replacement
* Payroll
* Advanced marketing automation
* Complete APP-001–APP-024 implementation
* Native mobile applications
* Multi-industry configuration UI
* Full AI workforce
* Advanced NOVA executive intelligence
* Large-scale customer self-service portal
* Public commercial launch of MASS

These capabilities remain within the broader MASS roadmap.

---

## 33. Relationship to the MASS Roadmap

The TNGD Dispatch User Portal is not a replacement for the MASS roadmap.

It is the first controlled deployment milestone built from required MASS capabilities.

The pilot draws from or accelerates implementation of:

* Identity and tenant administration
* People and customer records
* Calendar and scheduling
* Communications
* Tasks and workflow
* Customer and service operations
* Financial records and payment references
* Asset and resource information
* Security and governance
* Mobile field access
* Analytics
* Room-based user experiences
* Plugin and integration contracts

The architectural roadmap remains intact.

The implementation order may be rearranged to support the TNGD pilot sooner.

---

## 34. Manufacturing Directive for Codex

Codex shall treat this charter as the governing product brief for the TNGD Dispatch User Portal pilot.

Codex shall:

* Inspect existing MASS architecture and repositories before creating duplicate capabilities
* Identify reusable contracts, entities, engines, and application specifications
* Separate immediate pilot implementation from permanent architecture
* Preserve tenant isolation and human authority
* Manufacture work in small, testable, repository-authorized increments
* Maintain an itemized implementation backlog
* Update the pilot readiness checklist as capabilities are delivered
* Produce test evidence
* Avoid unnecessary abstraction before the TNGD workflow operates
* Keep public website integration separate from internal portal access
* Prefer controlled integration with Google Calendar and Square rather than rebuilding their specialist capabilities
* Preserve migration paths for future MASS applications and rooms
* Never pause authorized production without Executive Authority

---

## 35. Review Directive for Claude

Claude shall review the pilot as both an operational product and an implementation of MASS architecture.

Claude shall evaluate:

* Whether the employee experience remains simple
* Whether each stage has clear ownership
* Whether public and internal systems remain separated
* Whether role permissions preserve least privilege
* Whether human authority is preserved
* Whether the intake supports the three-option and eight-question standard
* Whether the full customer lifecycle is represented
* Whether payment, scheduling, dispatch, field work, reconciliation, and follow-up form one complete loop
* Whether the pilot creates permanent reusable MASS capability rather than throwaway software
* Whether TNGD can safely reduce dependence on the current CRM
* Whether deferred capabilities are honestly identified
* Whether launch gates have supporting evidence

Claude may issue localized corrections.

Claude shall not expand the soft pilot into full-platform completion unless a missing capability directly prevents safe operation.

---

## 36. Final Product Statement

The TNGD Dispatch User Portal shall make daily operations feel simple:

* Select the service path
* Ask the eight questions
* Schedule the work
* Dispatch the technician
* Complete the service
* Collect or reconcile payment
* Return the record to administration
* Follow up with the customer
* Preserve the relationship
* Repeat

This is the operational flywheel.

The portal shall become the first useful, secure, production-operable surface of MASS and the controlled bridge that allows Top Notch Garage Doors to move away from its current CRM without abandoning the larger MASS vision.
