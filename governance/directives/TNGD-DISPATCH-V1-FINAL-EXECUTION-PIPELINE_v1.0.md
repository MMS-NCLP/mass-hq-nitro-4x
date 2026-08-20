# TNGD Dispatch V1 — Final Execution Pipeline v1.0

**Status:** SEALED — Governing Launch Sequence  
**Authority:** Executive Authority  
**Date:** 2026-08-20  
**Applies To:** MASS-TNGD Dispatch V1 realization, final QC, migration preparation, and controlled field launch

## 1. Executive Intent

This directive seals the final TNGD Dispatch V1 execution pipeline. The product is no longer in open-ended feature discovery. Remaining work exists to graduate the accepted manufactured pilot from a technically proven baseline into a credible, field-operable Version 1.

V1 does not need maximum depth in every future capability. V1 must, however, be structurally complete across the major functions and permission boundaries required for ordinary TNGD operations. A user should not routinely discover that an expected day-to-day control simply does not exist.

The governing test is:

> Can TNGD operate a normal service day reliably without developer intervention?

Features that satisfy that test are V1 completion work. Sophistication that is not required to satisfy it is deferred to V2 and informed by field evidence.

## 2. Canonical Final Sequence

The authorized sequence remains:

**E15 → E16 → E17 → E18 → E19 → E20 → Final UI/Product Realization → Functional Connectivity → Final Launch Validation → Controlled TNGD Field Launch → Field Evidence → V2**

The Commerce Operations correction, migration preparation, pricing preparation, profile/account completeness, and bounded executive snapshot requirements do not replace or restart E15–E20. They are parallel launch-completeness work and/or corrections discovered during final inspection.

## 3. E15–E20 Final QC Discipline

Continue E15 through E20 without manufacturing speculative scope. Check what is readily verifiable, document evidence, and correct only actual defects or genuine operability gaps.

Where evidence is incomplete or an action belongs to Architecture Protection or another reserved authority, defer cleanly rather than forcing acceptance.

### Golden Path Routing Check

E15–E20 shall include a lightweight workflow-routing integrity check. This is not an exhaustive page-by-page UX audit.

Validate three practical loops:

1. **Technician Day Loop** — Today/Jobs → Job → Arrival/Start → Diagnosis/Inspection → Estimate/Authorization → Work → Completion → Invoice/Tender → Completion State → Next Job or Today.
2. **Admin/Dispatch Loop** — Operations/Today → Intake → Customer → Schedule → Dispatch → Technician Progress → Completion → Payment/Reconciliation/Follow-Up → Operations/Today.
3. **Customer Service-History Loop** — Customer → Job History → Job → Estimate → Invoice → Payment → Warranty/Follow-Up → Customer.

At each material transition verify:
- expected destination versus actual destination;
- an obvious next action exists;
- the user can return to the role's operational home in one obvious move;
- no technically valid but operationally inappropriate routing loop exists.

404/500/error testing alone does not satisfy this requirement.

## 4. Operational Commerce Completion

`TNGD-DISPATCH-V1-COMMERCE-OPS — Operational Commerce Completion` is a launch-critical correction layered over accepted BP-009 through BP-012. It shall not create a parallel commerce system.

Minimum V1 commerce administration includes:
- create/edit/deactivate items and services;
- governed categories/subcategories;
- price/cost and quantity/unit behavior;
- applicable tax configuration;
- reusable modifier sets;
- fixed-dollar and percentage discounts with authority/audit controls;
- deposit configuration: none, fixed, percentage, authorized custom;
- governed catalog line items and legitimate authorized ad-hoc line items;
- preservation of historical commercial evidence;
- integration into the accepted estimate → authorization → invoice → Square payment → reconciliation pipeline.

Square remains the V1 tender/payment provider. Dispatch owns the commercial business record; Square executes tender and may continue providing its native payment receipt and other useful payment-platform conveniences.

## 5. Customer, Migration, and Pricing Preparation

### Customer Authority

The HCP customer export is the preferred rich customer-master baseline. Square is used to identify newer or Square-only customers. Those records are normalized into the MASS/TNGD customer model rather than degrading the master model to Square's thinner contact structure.

### Historical Operational Evidence

Preserve HCP Customers, Jobs, Estimates, Invoices, and legacy Pricebook exports as immutable migration/source evidence. Do not edit original source exports.

### Launch Pricebook

Do not blindly promote the HCP or Square pricebook as permanent MASS authority.

Use:
- HCP pricebook as historical/broad legacy evidence;
- Square catalog as current operational/catalog evidence;
- recent Square transactions as real-world exception evidence where needed;
- the TNGD 2026 Pricing Blueprint/report as current management and market-informed pricing doctrine.

Construct a reconciled TNGD Launch Pricebook. Automate obvious matches and focus executive review on material conflicts/exceptions. Broad market research is not a launch requirement for every SKU.

## 6. Basic Profile and Account Completeness

Before field launch, verify that authenticated users can perform ordinary account/profile maintenance without engineering intervention, subject to role/security boundaries.

Minimum practical controls:
- display/name information where permitted;
- profile photo/avatar;
- relevant contact information;
- password/security-change workflow;
- role/title and optional short bio where appropriate;
- authorized administrative employee/profile maintenance.

Do not allow ordinary profile editing to bypass identity, authorization, audit, or historical-record integrity.

### Technician Seed/Demo Identity

Jason is no longer a current TNGD employee and shall not be represented as an active real-world TNGD technician. For demo/test technician purposes, the seed identity may be renamed to **Bart Simpson**, provided historical evidence is not falsely rewritten. The demo identity should be clearly distinguishable from production personnel where necessary.

A future technician profile should be editable/reassignable through normal authorized administration rather than engineering changes.

## 7. Executive Growth / Visibility Snapshot

Dispatch shall not become the MASS Marketing application in V1.

However, the Executive Stage should preserve bounded executive peripheral vision sufficient for an owner operating primarily from Dispatch to understand whether the front of the funnel is healthy.

Preferred V1 snapshot inputs:
- Google Search Console: impressions, clicks, CTR, average position/trend;
- Google Analytics: users/sessions, traffic trend, conversions/key events where available;
- Dispatch-native lead flow: recent leads, lead sources, booking/conversion signal, and useful operational trend indicators.

The presentation should be digestible at a glance and may include a concise trend/synthesis statement. It must not expand into keyword research, campaign management, SEO production, competitor intelligence, or a full marketing suite.

Administration may receive a smaller operational lead-source/conversion snapshot where permissions justify it.

Architecturally, Dispatch should consume a bounded Executive/Growth Snapshot contract rather than becoming permanently coupled to every future marketing intelligence source. A future MASS marketing capability may later become the richer provider behind the same boundary.

### Launch-Hold Rule

If Search Console/Analytics integration is straightforward within existing integration/security boundaries, activate it for V1. If it becomes disproportionate OAuth/infrastructure work, do not hold field launch solely for live marketing feeds. Preserve the Stage surface/contract and activate the feed immediately after launch.

## 8. Document, Contract, and Receipt Boundary

For V1, exploit Square where it already reduces launch burden.

Dispatch/MASS should ultimately own the TNGD customer-document and communication lifecycle: estimates, approvals, scopes, contracts, work records, completion documentation, warranties, and related workflow communications.

Square owns payment execution, processor transaction evidence, and may continue native payment receipts in V1.

Advanced native contract/scope distribution, branded completion packages combining checklists and before/after media, processor-independent receipt generation, and deeper document automation are V2 unless already available without expanding launch scope.

The architecture must not make future replacement of Square require rebuilding TNGD's entire customer lifecycle.

## 9. Final UI / Product Realization

After E15–E20 and parallel launch-critical corrections reach satisfactory evidence, apply the held Product Realization package. Expose verified capabilities through coherent role-specific experiences for executive, admin/dispatch, technician, and customer users.

Product realization must not hide missing functionality behind visual polish.

## 10. Functional Connectivity

Apply the held Final Functional Connectivity Addendum after the relevant prerequisites are satisfied. Resolve launch-critical dead ends, false destinations, disconnected controls, and integration gaps. Connectivity work connects existing capability; it does not authorize feature expansion.

## 11. Final Launch Validation

Before controlled field launch, verify at minimum:
- role and tenant boundaries;
- practical profile/account controls;
- customer/intake/scheduling/dispatch continuity;
- technician Today → Job → Completion → Next Job loop;
- estimate/authorization/commercial flow;
- tax/modifier/discount/deposit/ad-hoc line-item operability;
- Square tender and payment-state reconciliation;
- customer/history/migration integrity;
- admin operational loop;
- no launch-critical false-routing loops;
- final UI exposes rather than obscures required capability;
- rollback/reference path remains available for transition.

## 12. Controlled Field Launch

Once final validation passes, launch Dispatch V1 into controlled TNGD field operation. Do not continue delaying launch to manufacture speculative V2 sophistication.

Real field use becomes the primary source of truth for subsequent corrections and V2 prioritization.

## 13. V2 Parking Lot

Unless field evidence promotes them, the following remain V2 candidates:
- advanced native contracts and automated scope distribution;
- automated completion packages with inspection/checklist/before-and-after media;
- processor portability enhancements beyond the clean V1 gateway boundary;
- sophisticated pricing intelligence and automated market optimization;
- deeper marketing/SEO/campaign intelligence inside MASS;
- advanced communications automation;
- other improvements demonstrated by field operation.

## 14. Closure Statement

This directive is the sealed V1 execution roadmap. New ideas discovered before launch must be evaluated against the normal-service-day operability test. They may be admitted only as narrowly scoped launch corrections when their absence prevents credible V1 operation, security, permissions, routing integrity, data integrity, or required user control.

Everything else is captured for V2.

**The objective is no longer to imagine Dispatch. The objective is to finish, realize, validate, and launch it.**
