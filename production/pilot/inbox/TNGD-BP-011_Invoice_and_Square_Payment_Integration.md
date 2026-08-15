# ENGINEERING WORK ORDER

## TNGD-BP-011 — Invoice and Square Payment Integration

Project: MASS-TNGD-PILOT-001  
Conveyor: Operational Manufacturing (Conveyor B)  
Status: Executive Authorized — Dependency Gated Pilot Inbox

### Authority

- MASS Constitution
- Engineering Library
- MASS-TNGD-PILOT-001 Operational Pilot Charter
- MASS-TNGD-PILOT-001 Approved Operational Requirements Record
- TNGD Pilot Package Sequence Reconciliation 001
- Repository Canon
- Accepted TNGD-BP-010 Customer Authorization Evidence baseline

### Dependency Gate

This work order is authorized for the canonical Pilot Inbox, but manufacturing may not activate until every named predecessor has received Independent Review and Executive Acceptance. Only one pilot package may be active.

### Objective

Create authoritative MASS invoice and payment-state records while delegating card processing to Square through a governed gateway and preserving customer-safe evidence, reconciliation references, and diagnostic attachments.

### Scope

- Invoice draft and finalization
- Authorized scope and line-item consumption
- Taxes, discounts, deposits, balance, adjustments, and status
- Immutable finalized invoice versions
- Square payment gateway contract
- Payment-link and transaction references
- Idempotent webhook processing
- Payment, receipt, refund, failure, and dispute references
- Customer invoice access
- Default diagnostic-report attachment
- Governed photo and media references
- BP-012 reconciliation handoff

### Platform Contract Declaration

Creates:

- Invoice
- InvoiceVersion
- InvoiceLineItem
- InvoiceAttachmentReference
- PaymentIntentReference
- PaymentTransactionReference
- PaymentWebhookReceipt
- RefundReference
- ReceiptReference
- PaymentException
- FinancialHistory

Consumes:

- BP-004 Customer Record and Service Case
- BP-008 diagnostic report and media references
- BP-009 repair or estimate execution
- BP-010 valid customer authorization
- ENG-016 governed external-integration boundary
- Square as the explicitly authorized payment processor

### Functional Requirements

- Create an invoice only from valid authorized BP-010 scope or an explicitly governed administrative correction.
- Attach the BP-008 completed diagnostic report by default when available.
- Reference approved customer photographs without duplicating binary files.
- Keep MASS authoritative for invoice and operational payment state while Square remains authoritative for payment processing.
- Never store full card numbers, CVV, magnetic-stripe data, or other prohibited payment credentials.
- Use idempotency keys for payment creation, webhook receipt, refund, and retry handling.
- Verify webhook authenticity before changing MASS state.
- Record Square customer, payment, receipt, refund, and dispute identifiers only as governed external references.
- Make finalized invoice versions and accepted payment evidence immutable.
- Provide transaction-scoped customer access to invoice, receipt, and approved attachments.
- Route mismatches, failures, refunds, and disputes to a BP-012-ready reconciliation exception.

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
- Run the complete BP-000 through BP-011 regression and repository-validation gate.
- Do not manufacture later-package behavior.

### Explicit Exclusions

- Card-data storage
- Independent payment processing
- Administrative reconciliation resolution
- Warranty determination
- Customer follow-up
- Autonomous refunds
- BP-012 or later behavior

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

- Authorized scope produces a tenant-safe invoice
- Finalized invoice is immutable and versioned
- Diagnostic report is attached by default without media duplication
- Square gateway and failure boundaries are explicit
- Webhook and retry operations are idempotent
- Prohibited card data is absent
- Customer access is transaction-scoped
- Refund and exception evidence is auditable
- BP-012 handoff is complete
- No regressions through BP-010

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
