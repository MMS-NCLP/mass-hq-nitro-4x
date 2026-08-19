# TNGD-V1-FINAL-FUNCTIONAL-ADDENDUM-001
## MASS Dispatch V1 — Operational Connectivity & Relationship Completion

**Class:** Final Functional Fit / Connectivity Addendum  
**Product:** MASS Dispatch  
**Pilot Tenant:** Top Notch Garage Doors  
**Status:** AUTHORIZED — HOLD  
**Execution Position:** After current V1 roadmap, integrations, and White-Glove pilot-readiness validation; before Product Realization TNGD-UI-PR-001.

---

## 1. Purpose

Complete the small set of operational connections required for MASS Dispatch V1 to behave as one connected working product before architecture/functionality are frozen for Product Realization.

This addendum is intentionally narrow. It is not a new roadmap phase, architecture initiative, collaboration platform, analytics build, or V2 feature cycle.

The governing objective is practical field completeness without delaying launch.

**No more. No less.**

## 2. Entry Conditions

Do not execute this addendum during the active scheduled roadmap.

Begin only after:

- the existing V1 functional roadmap is complete;
- launch-critical integrations have been dispositioned/implemented;
- White-Glove security, permissions, settings, administration, dead-end, error-state and pilot-readiness review is complete;
- MASS Dispatch is independently capable of controlled pilot operation.

The pilot-ready baseline must exist underneath this addendum.

## 3. Scope A — Customer Relationship Depth

The customer profile shall function as a relationship index, not merely a contact card.

Where underlying V1 records exist and permissions allow, provide direct access from the customer context to relevant:

- past and current jobs;
- last service and service history;
- diagnosis and inspection records;
- estimates and authorization state;
- invoices and payment state/history;
- warranty registration/claim information;
- follow-up/lifecycle activity;
- communication history;
- upcoming appointments/work;
- existing acquisition/source context where available.

Do not manufacture missing business domains merely to populate the profile.

## 4. Scope B — Universal Contextual Linking

Existing operational records should be navigable wherever they are meaningfully referenced and the user is authorized.

Preferred relationship chain:

**Customer → Job → Diagnosis/Inspection → Estimate → Authorization → Invoice → Payment → Warranty → Follow-Up → Customer**

Navigation should work naturally in both directions where relationships exist.

A signal, summary, notification, message or Stage presentation that references an existing record should permit drill-through to its underlying evidence where authorized.

Do not create dead data.

## 5. Scope C — Lightweight Internal Messaging

Provide minimal operational staff messaging sufficient for pilot use.

Required fundamentals:

- sender;
- recipient/person or supported operational group;
- short message/thread;
- timestamp;
- unread/read state;
- relevant customer/job/record context link where applicable;
- filtered message/inbox view;
- direct navigation from message to authorized operational context.

The contextual Operations Stage may temporarily present an active conversation when appropriate.

This does NOT authorize a Slack replacement.

Explicitly defer unless already trivial and supported:

- channels/community spaces;
- reactions;
- presence;
- video/audio calling;
- advanced attachment collaboration;
- sophisticated full-text message search;
- collaboration bots/agents;
- complex thread governance.

## 6. Scope D — Customer Messaging Through Supported Existing Provider

TNGD already uses Square customer messaging. During the integration phase, determine whether the supported Square API/integration surface permits the required customer messaging workflow from MASS Dispatch.

If supported cleanly and safely, expose customer conversation access from appropriate customer/job context and retain appropriate communication linkage/history.

If Square does not expose the required programmatic capability, or implementation would require custom SMS infrastructure or material launch delay:

- preserve the interface/data boundary;
- record the limitation;
- defer provider implementation to V1.x/V2;
- do not build custom SMS infrastructure in this addendum.

Provider limitations must not hold the pilot hostage.

## 7. Scope E — V1 Notification Fundamentals

Implement a deliberately small operational notification foundation.

Initial V1 notification classes:

1. **New Job / Assignment** — assignment, reassignment, material reschedule, or cancellation relevant to the recipient.
2. **Message Received** — staff or customer message with sender/context and direct conversation/record access.
3. **Money / Authorization Event** — estimate approval/decline and meaningful authorized ticket/payment events appropriate to the recipient.
4. **Critical Schedule / Operational Change** — urgent same-day schedule change or governed operational exception requiring attention.

Governing routing sequence:

**EVENT → SEVERITY → RECIPIENT → CHANNEL → ACKNOWLEDGMENT/RECORD**

Delivery priority:

- in-app notification as the canonical system record;
- phone/device push where the deployed platform supports it practically;
- email for appropriate critical/durable events.

Not every event must use every channel.

Notifications must be role- and relevance-aware. Routine noise must not be broadcast indiscriminately.

Provide basic user preferences where practical. Critical security/system notices may remain mandatory where governance requires.

Advanced quiet hours, escalation chains, digests, threshold subscriptions, SMS notification routing and sophisticated orchestration are V1.x/V2.

If true native/device push materially conflicts with deployment architecture, preserve the notification event/routing architecture and ship in-app + email rather than delaying the pilot.

## 8. Scope F — Operations Stage Functional Foundation

Establish the reusable **Operations Stage** as MASS Dispatch's contextual presentation viewport.

The Stage is not MASS HQ's Stage and must not blur the distinction between MASS HQ and the Dispatch add-on.

Its purpose is to provide substantial but controlled real estate for information relevant to the current operational context without permanently consuming dashboard space for every possible subject.

V1 shall support the Stage container/interface and populate it only with information and records already available from V1.

Potential existing-data presentations may include, where already supported:

- current job context;
- estimate/document presentation;
- diagnosis/inspection context;
- message/conversation;
- authorization/payment state;
- schedule/dispatch exception;
- follow-up/lifecycle context;
- existing revenue/performance summaries.

The Stage may change context according to user role, active record, requested information, or prudent operational signal.

A Stage item appears because it is:

- relevant now;
- explicitly requested;
- contextually associated with active work; or
- important enough to interrupt normal presentation.

The Stage must not become an information junk drawer.

## 9. Explicit V1.x / V2 Deferrals

This addendum does NOT authorize manufacturing:

- advanced marketing/Google analytics modules;
- predictive ticket/value intelligence;
- predictive pay/commission forecasting;
- advanced truck/inventory intelligence;
- market-rate/neighborhood prediction;
- custom SMS infrastructure;
- Slack-equivalent collaboration;
- advanced notification orchestration;
- new AI/agent systems;
- speculative Stage modules;
- new permanent dashboards for every integration.

The Stage architecture should permit future integration-fed modules without requiring fundamental layout redesign, but those modules are not part of this addendum unless their capability already exists in V1.

## 10. Engineering Boundary

Use existing V1 domains, records, services, permissions and integrations wherever possible.

Do not redesign core architecture to satisfy this addendum.

Only critical security, permission, data-integrity, or workflow-breaking defects justify broader correction.

If a requested micro-capability proves materially larger than this addendum presumes, document and defer it rather than expanding scope silently.

## 11. Acceptance

This addendum is complete when:

- customer profiles provide practical relationship navigation across existing authorized records;
- referenced operational records can be reached from meaningful contexts;
- lightweight internal messaging works without becoming a collaboration suite;
- Square customer messaging is either cleanly connected or explicitly deferred with the interface boundary preserved;
- the four V1 notification classes have governed routing and practical delivery;
- the Operations Stage functional container exists and can present existing contextual information;
- no advanced deferred intelligence was manufactured merely to populate the Stage;
- permissions and tenant isolation remain intact;
- regression gates remain green;
- no pilot-critical functionality regresses.

## 12. Exit

After acceptance:

1. declare MASS Dispatch V1 **FUNCTIONALLY FROZEN** except for critical defects;
2. preserve a clean regression baseline;
3. hand the completed machine to **TNGD-UI-PR-001 — MASS Dispatch V1 Product Realization Pass**;
4. Claude/development authority changes hats from functional engineering to product realization;
5. no further V1 feature expansion occurs unless absence prevents safe and practical TNGD pilot operation.

---

## Final Directive

Connect the machine.

Make its records reachable.

Make its people reachable.

Make important events capable of reaching the right people.

Give contextual information a deliberate place to appear.

Do not build the future merely because the foundation can support it.

**Complete V1. Freeze function. Then reveal the product.**
