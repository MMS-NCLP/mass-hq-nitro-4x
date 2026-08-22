# MASS Dispatch V1 — Final Post-UI-Overhaul Refinement Addendum

Status: FINAL REFINEMENT WORK ORDER / SUBORDINATE TO MASTER OVERHAUL
Date: 2026-08-22
Execution target: Claude, after completion of the approved UI overhaul
Scope character: Small, dedicated, convergence-preserving

## 1. Directive

Do not redesign the application and do not reopen settled V1 architecture. This addendum exists to close the final operational seams discovered during product-owner QA after the master overhaul was defined.

The approved MASS reference library remains the visual authority. Housecall Pro captures are supporting references for operational depth only.

## 2. No-Orphan-Interaction Standard

Audit every visible interactive element produced by the overhaul. Every button, dropdown, badge, card, metric, link, row, icon, quick action, drag target, and implied drill-down must resolve to exactly one legitimate outcome:

1. navigate to an existing governed destination;
2. open contextual detail/drawer/modal for the current object;
3. perform a governed action with visible state reconciliation; or
4. be explicitly unavailable/disabled with a truthful reason.

No decorative controls masquerading as functional controls. No generic placeholder destination created merely to satisfy a click. No duplicated page where an existing contextual surface is sufficient.

## 3. Pipeline Communication Evidence Destination

Pipeline is the admin operating conveyor, not merely a Kanban board. Each customer/lead/opportunity card must have a coherent destination for engagement evidence.

Provide a contextual Communication / Media & Activity surface associated with the underlying customer and pipeline object. It must be structurally capable of presenting:

- call attempts and outcomes;
- SMS/message history;
- email history;
- system-generated workflow events;
- notes left by admin for themselves/team as permitted;
- attachments/media;
- estimate sent/viewed/approved/declined events;
- authorization events;
- future RingCentral transcript and recording references.

V1 does not require completion of every future provider integration. It does require the destination and data relationship so Call, Message, Note, Estimate, and future provider events are not orphan actions.

A communication outcome that affects workflow must reconcile the Pipeline card: e.g. called/no answer, contacted, awaiting response, follow-up scheduled, estimate sent, authorized, re-queued. The system should return work to the proper queue according to governed state rather than forcing admin to remember it manually.

## 4. Estimate → Agreement → Authorization → Financial Handoff

Do not make Square the estimate authority. MASS owns the estimate/authorization workflow; Square is the present payment rail.

Use the established TNGD invoice visual family as the commercial-document master. Create the Estimate as a closely related document with appropriate title/status/layout differences rather than a separate design language.

Estimate presentation should include customer/job identity, estimate number, issue/validity information, scope, line items, pricing, discounts/tax/deposit where applicable, notes/disclosures, applicable warranty summary, and the versioned TNGD agreement/terms.

Routine authorization may use an explicit acknowledgement checkbox plus Approve Estimate action. Higher-risk/special-order/high-value work may require stronger signature evidence according to governed policy. Approval must bind to the exact immutable estimate and agreement version presented to the customer.

Expected state chain:

Estimate draft → finalized immutable estimate → sent → viewed where observable → approved/declined → authorization evidence/receipt → Pipeline reconciliation → scheduling/deposit/financial handoff as applicable → Square/payment rail.

Estimate delivery controls may expose Text, Email, and Copy Link where the configured provider supports them. Unsupported provider-backed actions must be truthful rather than simulated.

## 5. Commercial Legitimacy & Closeout Operations

Preserve customer authorization/signature evidence and agreement version with the commercial record. Post-job/admin-check-in and technician-closeout operational resources should be readily accessible when their workflow phase makes them relevant, including governed access to review capture, warranty registration, coupons, promotional/shareable collateral, and similar approved TNGD resources.

Do not overload the permanent navigation with phase-specific actions. Use the established Operations concept: operational items become available contextually during the work phase in which they are useful. Role permissions govern access.

## 6. Stage Job Preview

Where location context is available, Stage job preview may include a compact map/location preview in the spirit of the supplied HCP job reference. It is supporting job intelligence, not a new mapping product. Preserve the MASS Stage hierarchy and approved visual language.

## 7. Dashboard/Pulse Integrity

Do not add a second role-home page. Dashboard/Home is role-adaptive.

Pulse remains a signal system, not decoration. Pulse-worthy Stage and hero metrics inherit meaningful operational state: standard/active blue, healthy green, attention amber, critical red. Glow/ambience is reserved for meaningful signal reinforcement and must not turn the admin experience into a field of competing alerts.

Existing settled dashboard refinements remain authoritative: role-adaptive snapshot figures; rotating/curated Pulse views; coverage heatmap/history/forecast concepts where implemented; admin technician status rotation; tech personal performance context; Pipeline/action-queue hierarchy; admin tech-current-location view and technician route/current-jobs view.

## 8. Calendar/Pipeline Relationship

Calendar is the scheduling instrument; Pipeline is the customer-management backbone. Do not create a separate scheduling workflow for Pipeline activity.

Where supported by the overhaul, Pipeline/Pulse cards may be scheduled or re-queued through Calendar interaction, including drag/drop or a compact scheduling popup. Intake may remain directly accessible. Non-customer operational dates such as ordering/inventory events may use Calendar without forcing them into customer Pipeline semantics.

## 9. Acceptance Gate

This addendum is complete only when:

- primary V1 controls no longer terminate in dead or ambiguous interactions;
- Pipeline engagement actions have a coherent evidence/history destination;
- communication outcomes reconcile workflow state where applicable;
- the estimate has a real customer authorization path independent of Square;
- commercial agreement/version evidence is preserved;
- contextual Operations resources have destinations and role gates;
- no duplicate page is introduced where contextual UI is sufficient;
- provider-unavailable actions remain truthful;
- the master overhaul visual/convergence decisions remain intact.

This is the final refinement WO. Do not use it as authority for V2/V3 expansion.
