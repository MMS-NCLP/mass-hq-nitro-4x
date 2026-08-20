# TNGD-DISPATCH-V1-COMMERCE-OPS — Operational Commerce Completion

**Authority:** Executive Authority  
**Conveyor:** B — TNGD Dispatch Pilot / Product Realization  
**Status:** Approved for Manufacturing  
**Priority:** Launch-Critical V1 Completion  
**Production Baseline:** Existing accepted TNGD pilot packages; do not duplicate or replace BP-009 through BP-012.

## 1. Purpose

Complete the minimum day-to-day commerce administration capability required for TNGD Dispatch V1 to survive normal field and dispatch operations without engineering assistance.

This Work Order is an operability completion package, not a new commerce architecture. It shall extend and consume the accepted estimate, authorization, invoice, Square payment, and reconciliation capabilities already manufactured under BP-009 through BP-012.

## 2. Governing V1 Test

A normal authorized TNGD office user or technician must be able to complete legitimate daily commerce activity without calling a developer to alter code or seed data.

V1 shall support the practical reality that services, parts, configurations, discounts, deposits, tax treatment, and unexpected line items may need to be administered during ordinary business operations.

## 3. Required Capability

### 3.1 Item and Service Administration
Authorized administrative users shall be able to:

- Create a new item or service.
- Edit an existing item or service.
- Deactivate an item or service without destroying historical references.
- Assign item/service type.
- Assign governed category and optional subcategory.
- Maintain customer-facing description and internal identifier/SKU/task code where applicable.
- Maintain cost and sell price.
- Configure unit/quantity behavior.
- Configure active/inactive and availability state.

Categories and subcategories shall be reusable governed records rather than uncontrolled free-text duplication.

### 3.2 Tax Treatment
Each applicable catalog item/service shall support an explicit tax configuration suitable for estimate/invoice calculation. The user experience may present a simple taxable control, while the underlying model must preserve sufficient tax classification/reference for later reconciliation and jurisdiction-aware expansion.

Do not manufacture independent tax-compliance intelligence in this package.

### 3.3 Modifier Sets
Authorized users shall be able to create and reuse modifier groups and attach them to applicable catalog items/services.

Examples include door color, door configuration, frame/mesh color, rail system, spring system, operator options, accessories, and other selectable configuration choices.

Modifier selections must remain traceable on the commercial record on which they were used.

### 3.4 Discounts
Support controlled discounts sufficient for V1 operations:

- Fixed-dollar discount.
- Percentage discount.
- Item/line or transaction-level application where supported by the existing commercial model.
- Reusable named discounts/promotions where practical.
- Role/authority limits for discount application or override.
- Audit evidence identifying who applied or approved a discount.

Discount governance shall prevent an unauthorized user from silently bypassing established pricing authority.

### 3.5 Deposit Configuration
Support V1 deposit requirements using:

- No deposit.
- Fixed-dollar deposit.
- Percentage deposit.
- Authorized custom deposit.

Deposit requirements may be associated with the relevant estimate/job/service context. The resulting amount due shall pass into the existing invoice/payment pipeline rather than creating a second payment ledger.

### 3.6 On-the-Fly Commercial Line Items
An authorized technician or office user must be able to add a legitimate line item during estimate/invoice preparation when field conditions require it.

The implementation shall distinguish between:

1. selecting an existing governed catalog item/service; and
2. adding an authorized custom/ad-hoc line item.

Ad-hoc entries shall retain description, quantity, price, tax treatment, creator, timestamp, and appropriate authorization/audit evidence. Creating an ad-hoc transaction line shall not silently pollute the permanent pricebook unless an authorized user deliberately promotes/creates it as a catalog item.

### 3.7 Existing Commerce Pipeline Integration
Outputs from this package shall flow through the existing accepted capabilities:

- **BP-009:** Repair and Estimate Execution.
- **BP-010:** Customer Authorization Evidence.
- **BP-011:** Invoice and Square Payment.
- **BP-012:** Administrative Reconciliation and Exceptions.

No parallel estimate, invoice, payment, or reconciliation authority may be created.

Square remains the V1 payment/tender provider. Dispatch owns the commercial business record; Square executes supported tender/payment functions and returns payment evidence/state through the existing boundary.

## 4. V1 Acceptance Scenarios

Manufacturing evidence must demonstrate at minimum:

1. Admin creates a new service, categorizes it, assigns price/cost and tax treatment, and makes it available for use without code changes.
2. Admin creates or assigns a reusable modifier set to an item/service.
3. Technician creates an estimate using governed catalog line items and modifiers.
4. Technician encounters legitimate unexpected work and adds an authorized ad-hoc line item without developer intervention.
5. Authorized user applies a permitted fixed or percentage discount; unauthorized discount behavior is rejected or escalated according to authority.
6. A deposit requirement can be configured as none, fixed, percentage, or authorized custom amount.
7. Approved estimate/deposit information reaches the existing invoice/Square payment path without a duplicate payment ledger.
8. Historical commercial records retain their original item descriptions, prices, modifier selections, discounts, tax treatment, and deposit evidence even after catalog records are later edited or deactivated.
9. All material administrative changes and commercial overrides are attributable to an actor and timestamp.
10. Existing BP-009 through BP-012 acceptance behavior remains intact.

## 5. Explicitly Deferred / V2

Unless already available through accepted capabilities or achievable without expanding this package, the following are deferred:

- Rebuilding Square tender/payment UI.
- Processor-independent payment orchestration beyond the existing gateway boundary.
- Replacement of Square-native payment receipts.
- Advanced automated contract/document distribution.
- Branded completion packages combining photos, checklists, warranties, and final documentation.
- Sophisticated pricing intelligence or automatic market-price optimization.
- Full historical HCP/Square pricebook reconciliation as part of runtime commerce administration.
- Advanced jurisdictional tax engine.
- Enterprise promotion/campaign management.

These deferrals shall not prevent preservation of clean interfaces for later implementation.

## 6. Migration Compatibility

The commerce model must be capable of receiving the forthcoming reconciled TNGD launch catalog derived from legacy HCP pricing evidence, current Square catalog/transaction evidence, and the 2026 TNGD Pricing Blueprint without making any one legacy platform the permanent MASS authority.

Historical source identifiers should be preservable as external references where useful for migration and reconciliation.

## 7. Non-Negotiable Boundaries

- Do not duplicate BP-009 through BP-012.
- Do not make Square the system of record for TNGD commercial policy.
- Do not make Dispatch responsible for card-data handling that Square should perform.
- Do not require engineering intervention for ordinary catalog maintenance.
- Do not permit destructive catalog edits to rewrite historical estimates/invoices.
- Do not introduce V2 document automation merely because the commerce events could later trigger it.

## 8. Completion Standard

The package is complete when an authorized TNGD user can administer the practical V1 catalog and execute real-world estimate/invoice variations — including tax treatment, modifiers, discounts, deposits, and legitimate ad-hoc line items — through the already accepted Dispatch commerce pipeline without developer intervention.

The implementation must include appropriate tests, documentation, migration/schema references, boundary validation, and a completion report for independent review.

## 9. Updated Dispatch V1 Roadmap

The launch sequence is now:

**Phase A — Accepted Pilot Foundation**  
BP-000 through BP-015 and accepted localized corrections/import capability remain the governed platform baseline.

**Phase B — V1 Operational Commerce Completion — THIS WORK ORDER**  
Close the practical pricebook/catalog gap: item/service administration, categories, tax treatment, modifiers, discounts, deposits, and ad-hoc line items integrated into BP-009 through BP-012.

**Phase C — TNGD Data and Pricing Preparation**  
Preserve HCP migration exports and Square evidence; merge Square-only/new customers into the richer customer model; construct a reconciled launch pricebook using Square/current operational evidence plus the TNGD 2026 Pricing Blueprint, with HCP retained as historical evidence. Resolve material exceptions rather than requiring exhaustive pre-launch pricing research.

**Phase D — Product Realization / UI-UX and Functional Connectivity**  
Apply the existing held Product Realization Work Order and Final Functional Connectivity Addendum against the now-complete V1 operational requirements. The interface must expose the accepted capabilities as usable dispatch, office, technician, and customer workflows rather than merely proving backend existence.

**Phase E — Launch QC / E15–E20 and Field Readiness**  
Validate real user journeys, data integrity, role boundaries, estimate-to-authorization-to-invoice-to-Square payment flow, commerce administration, customer history, technician workflow, reconciliation, and launch-critical connectivity. Correct only defects or genuine operability gaps; do not expand scope for polish.

**Phase F — Controlled TNGD Field Launch**  
Deploy the smallest reliable Dispatch V1 capable of replacing the current CRM in normal daily TNGD operations. Square may continue providing tender, native receipts, and other useful payment-platform conveniences during V1.

**Phase G — V2 Evolution After Operational Proof**  
Consider native contract/scope automation, document distribution, completion packages with inspection/checklist/media evidence, processor portability enhancements, pricing intelligence/market optimization, deeper communications automation, and other improvements based on field evidence.

## 10. Executive Intent

V1 is not being expanded for feature accumulation. This Work Order exists because catalog maintenance, tax treatment, modifiers, discounts, deposits, and field-created legitimate line items are minimum operational controls for a real service company.

The governing launch principle remains:

> Build only what TNGD needs to operate a normal service day reliably without developer intervention; exploit proven external services such as Square where they reduce launch burden; defer sophistication until field operation proves the need.
