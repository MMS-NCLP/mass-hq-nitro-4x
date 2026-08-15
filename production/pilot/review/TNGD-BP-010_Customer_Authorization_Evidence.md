# ENGINEERING WORK ORDER

## TNGD-BP-010 — Customer Authorization Evidence

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
- Accepted TNGD-BP-009 Repair and Estimate Execution baseline

### Dependency Gate

This work order is authorized for the canonical Pilot Inbox, but manufacturing may not activate until every named predecessor has received Independent Review and Executive Acceptance. Only one pilot package may be active.

### Objective

Create immutable, transaction-specific evidence that an authorized customer approved a defined scope, price, terms, disclosures, and estimate or repair version before work proceeds.

### Scope

- Authorization request and presentation
- Authorized-adult acknowledgment
- Scope, price, terms, and disclosure snapshot
- Signature or approved equivalent evidence
- Approval, decline, expiration, and revocation lifecycle
- Amendment and reauthorization
- Technician and customer identity evidence
- Customer-safe authorization receipt
- Audit history and BP-011-ready handoff

### Platform Contract Declaration

Creates:

- AuthorizationRequest
- AuthorizationSnapshot
- CustomerAcknowledgment
- SignatureEvidence
- AuthorizationDecision
- AuthorizationAmendment
- AuthorizationReceipt
- AuthorizationHistory

Consumes:

- BP-001 identity, roles, tenant isolation, and audit
- BP-004 Customer Record
- BP-009 immutable repair or estimate version

### Functional Requirements

- Bind every authorization to one immutable BP-009 version.
- Require confirmation that the approving person is an authorized adult aged 18 or older.
- Present scope, line items, price, terms, warranty disclosure, and relevant diagnostic references before approval.
- Prevent employees, technicians, AI, and unauthenticated parties from authorizing on the customer's behalf.
- Record approver identity or governed transaction access, timestamp, method, presented content hash, and decision.
- Make accepted and declined evidence immutable.
- Require changed scope or price to create a new amendment and authorization request.
- Produce a customer-safe receipt and a BP-011-ready authorized financial handoff.
- Keep recommendation, presentation, and authorization authority separate.

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
- Run the complete BP-000 through BP-010 regression and repository-validation gate.
- Do not manufacture later-package behavior.

### Explicit Exclusions

- Repair or estimate editing
- Invoice creation
- Payment processing
- Stored card data
- Warranty adjudication
- AI authorization
- BP-011 or later behavior

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

- Authorization references a valid immutable BP-009 version
- Adult acknowledgment and presented-content evidence are preserved
- Self-authorization and employee substitution are rejected
- Amendments require new authorization
- Accepted evidence is immutable and auditable
- Customer receipt excludes internal-only data
- No invoicing or payment scope
- No regressions through BP-009

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

BP-010 entered Active Manufacturing on 2026-08-15 under MPD-002 after BP-009 passed its complete 85-test gate, committed its immutable version and pending-authorization contracts at `fea8086cabca6ac684221777f8e26f158814f0dd`, and entered Pilot Review at `087890d0aac41d0780241d4a9364512321087cb3`. No architecture-critical defect is known. This activation authorizes only BP-010 customer-authorization evidence; invoice, payment, warranty, later-package behavior, and the detailed garage-door order form remain excluded.

### Queue Continuity Hold

Final queue verification found that BP-010 activation reduced the Pilot Inbox below MPD-002's three-authorized-work-order minimum. No BP-010 implementation was manufactured. BP-010 returned to Pilot Inbox unchanged in scope pending Quarterback replenishment; it remains the next dependency-ready package.

### MPD-002 Reactivation Record

BP-010 entered Active Manufacturing on 2026-08-15 from canonical authority commit `20bb7a263ec372443313111068edb21033a28b68`. BP-009 is a committed provisional predecessor in Pilot Review with its 85-test gate passed and no known architecture-critical defect. Pilot Active was empty, and BP-011 through BP-013 remain authorized in Pilot Inbox, preserving the three-work-order minimum. This activation does not authorize invoice, payment, warranty, later-package behavior, or the deferred detailed garage-door order form.

### Review Submission Record

BP-010 manufacturing completed at artifact commit `5fe1ef2f7775425431233044a14e2120a77bd1e9`. The complete gate passed with 96 tests and canonical validation through BP-010. The work order and completion report entered Pilot Review on 2026-08-15. Invoice, payment, warranty, later-package behavior, and the detailed garage-door order form were not implemented.
