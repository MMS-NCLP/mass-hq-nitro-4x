# MASS V2 Reference Doctrine — Control, Automation & Optimization

**Doctrine ID:** MASS-V2-DOCTRINE-001  
**Target:** MASS Dispatch V2  
**Classification:** Deferred Product Doctrine / Major Subsystem Reference  
**Status:** Approved Reference Baseline  
**Established:** 2026-08-22

## 1. Generational purpose

V1 establishes correct, dependable operation. V2 shall mature that operating system by making approved behavior safely configurable, governable, increasingly automated, measurable, and optimizable.

**V1 = Observe + Execute.**  
**V2 = Govern + Optimize.**  
**V3 = Learn + Anticipate.**

V2 is not the dumping ground for unfinished V1 functionality. Intake, Pipeline, Action Queue, Calendar, Dispatch, Jobs, Customers, Estimates, payments, inventory/items and services, warranty, communications, lifecycle routing, role-aware Pulse, and required operational integrations remain V1 obligations where already governed.

## 2. Build classification

The V2 control layer is a **major cross-system subsystem build**. It must not be implemented as a collection of disconnected settings forms. Its purpose is to provide a stable control plane over MASS domains and their deterministic rules.

## 3. Domain-oriented Settings doctrine

Every major operational domain that exposes legitimately configurable behavior shall have a corresponding Settings surface or Settings subsection. Configuration belongs with the domain it governs rather than in an unrelated catch-all screen.

Expected domains include:

- Company
- Users & Permissions
- Pipeline
- Action Queue
- Calendar & Scheduling
- Dispatch
- Jobs
- Intake
- Customers
- Estimates
- Invoices & Payments
- Inventory / Catalog / Items & Services
- Warranty
- Communications
- Follow-Up / Lifecycle Automation
- Pulse & Alerts
- Growth Intelligence
- Integrations
- Audit & Governance

The visible organization may evolve, but domain ownership must remain obvious.

## 4. Settings are operational controls, not decoration

A satisfactory V2 setting shall identify, where relevant:

- current value;
- default value;
- scope/inheritance;
- validation/type;
- who may edit it;
- who changed it;
- when it changed;
- which workflows consume it;
- dependencies/side effects;
- version/history;
- safe rollback for material changes.

Important configuration must not disappear into undocumented constants, scattered environment variables, or arbitrary code paths when it legitimately belongs under business control.

## 5. Configuration hierarchy and inheritance

V2 should support a governed hierarchy such as:

**System Default → Tenant/Company → Role → Team/Technician override (only where justified).**

Overrides must be explicit and traceable. Not every setting should be overridable at every level.

Example:

- Default callback SLA: 30 minutes.
- TNGD company override: 15 minutes.
- Emergency-service rule: 5 minutes.

The system must be able to determine the effective value and its provenance.

## 6. Configuration provenance

MASS should be able to explain why a value is in effect.

For material settings, the UI should be capable of presenting information such as:

> Pipeline Callback Retry — Attempt 1  
> Effective value: 2 hours  
> Scope: Company  
> Last changed by: Master Admin  
> Applies to: Website, Yelp, Thumbtack  
> Used by: Pipeline Router

This is intended to improve administration, support, QA, and development stability.

## 7. "Used By" and impact awareness

A configuration item should expose its consumers when practical.

Example:

**Pipeline SLA** may affect:

- Pipeline priority;
- Work Next ordering;
- Pulse thresholds;
- Admin notifications;
- SLA reporting.

Material changes should provide impact awareness before confirmation. Developers and administrators must not have to guess which subsystems consume a setting.

## 8. Settings classes

The architecture should distinguish at least:

### Business Settings
Company-controlled facts and policies such as hours, service areas, warranty durations, territories, and approved promotions.

### Operational Settings
Workflow behavior such as retry cadence, closeout requirements, priority thresholds, scheduling buffers, routing, and lifecycle rules.

### System / Integration Settings
Provider authorization, sync behavior, event subscriptions, health, feature controls, and infrastructure-facing configuration.

These classes may share a settings experience but shall not automatically share permissions, audit requirements, or mutability.

## 9. Role-aware administration

Settings access shall be role governed.

A Technician may receive only personal/profile/notification/calendar/Action Queue preferences that are safe to delegate.

Admin may receive authorized operational configuration.

Master Admin receives organization-wide business/system controls, sensitive analytics configuration, integration authority, and policy-level controls as appropriate.

Permissions must be enforced functionally, not merely hidden in the UI.

## 10. Searchable Settings

Because the settings surface will become large, V2 should support settings search.

A search for `callback` should be capable of locating relevant settings across domains, for example:

- Pipeline → Callback Retry Rules
- Communications → Callback Templates
- Pulse → Callback SLA Thresholds
- Calendar → Callback Scheduling Defaults

Search must preserve domain context rather than flatten configuration into an unintelligible list.

## 11. Configurable Rules / Policy Engine

V2 should evolve deterministic V1 rules into governed configurable policies where safe.

Representative model:

**IF condition(s) → THEN governed action(s).**

Examples:

- IF source = Thumbtack AND urgency = High, THEN Pipeline priority = Priority AND response SLA = 15 minutes.
- IF job = Complete AND invoice = Paid, THEN create Post-Service Check-In after 24 hours.
- IF satisfaction = Positive, THEN create Review Request after configured delay.
- IF No Answer Attempt 1, THEN retry in 2 hours.
- IF No Answer Attempt 2, THEN send approved SMS and requeue next business day.

Rules must remain explainable, auditable, validated, permissioned, and protected against contradictory or recursive behavior.

## 12. Lifecycle Automation

V2 should deepen the V1 service flywheel through deterministic automation rather than prematurely relying on prediction.

The governed lifecycle remains conceptually:

**Inquiry → Contact → Appointment → Estimate → Job → Payment → Satisfaction → Review → Referral → Warranty → Check-In → Future Need → Re-entry.**

V2 may automate branching, requeue, reminders, escalation, post-service activity, review/referral actions, and other governed lifecycle movement while preserving human oversight where appropriate.

## 13. Pipeline maturity

V1 establishes the Pipeline engine and formula:

**SOURCE → STATE → SIGNAL → ACTION → OUTCOME → NEXT STATE → NEXT ACTION**

V2 should make appropriate portions configurable and optimizable, including:

- source routing;
- SLA policies;
- retry/requeue sequences;
- lifecycle automation;
- escalation;
- Work Next weighting;
- approved offer/review/referral flows;
- role/ownership rules;
- deterministic next-action recommendations.

V2 may recommend better actions using known facts and historical summaries, but predictive learning belongs primarily to V3.

## 14. Pulse maturity

V1 establishes the Pulse language:

- Neutral — no signal required;
- Blue — active/current/live;
- Green — meaningfully favorable/healthy;
- Amber — attention warranted/threshold approaching;
- Red — intervention/critical threshold.

V2 should make authorized thresholds and escalation logic configurable without reducing Pulse to decorative color controls.

Examples:

- Pipeline Amber: callbacks approaching SLA within configured interval.
- Pipeline Red: breached SLA.
- Inventory Amber: quantity at/below reorder point.
- Inventory Red: unavailable stock with active job demand.
- Technician Delay Amber/Red: configured delay thresholds with downstream schedule risk.

Pulse eligibility remains governed by operational significance. Signal state belongs to underlying data/condition, not independently invented components.

## 15. Operational optimization

V2 should add assistive, explainable optimization using trustworthy current/historical facts without claiming unsupported prediction.

Examples:

- technician assignment recommendations based on distance, skills, capacity, and conflicts;
- route and schedule optimization;
- workload balancing;
- inventory reorder recommendations based on known consumption and scheduled demand;
- capacity indicators;
- Pipeline priority recommendations based on governed factors.

Humans remain responsible for material decisions unless a specific deterministic automation is explicitly authorized.

## 16. Growth Intelligence maturity

MASS owns operational customer-lifecycle intelligence, not general-purpose marketing execution.

V2 may deepen:

- source attribution;
- lead → estimate → job conversion;
- revenue by source;
- review velocity;
- referral performance;
- approved promotion/coupon attribution;
- repeat-customer indicators;
- service mix;
- geographic demand;
- Pipeline conversion;
- technician contribution to customer advocacy outcomes.

MASS shall not become a broad ad-buying, creative-production, social-publishing, SEO, or audience-management platform merely because it possesses growth data.

## 17. Advanced operational BI

Master Admin should receive stronger organization-wide intelligence such as:

- revenue and conversion trends;
- source performance;
- technician/service profitability where data supports it;
- operational throughput;
- lifecycle conversion;
- comparative periods;
- service/category performance;
- capacity and exception trends.

BI must derive from persisted operational truth rather than hard-coded demonstration data.

## 18. Integration administration

V2 should mature integrations from operational connections into governed provider administration.

Where provider capability allows, Settings may expose:

- Connected / Disconnected / Degraded state;
- authorization status;
- scopes/capabilities;
- last sync;
- webhook/event health;
- field mappings;
- sync direction;
- provider-specific rules;
- retry/recovery controls;
- event/integration logs;
- test/live environment distinction;
- reconnect/configure actions.

Provider terminology does not become the authoritative MASS domain model. External events normalize into MASS-owned concepts.

## 19. Communications maturity

V2 may deepen RingCentral and other communications integrations through better workflow automation, provider administration, transcript/recording handling, and deterministic outcome support.

Predictive conversation intelligence, inferred intent, sentiment, and learning-based automatic reconciliation are primarily V3 concerns unless implemented as explicitly bounded deterministic features.

## 20. Central configuration registry

Implementation should use a disciplined configuration model rather than unrelated bespoke storage for every page.

The registry should conceptually support fields such as:

- setting key;
- domain;
- scope;
- value;
- default;
- type/schema;
- validation;
- permissions;
- consumers;
- version;
- updated by;
- updated at.

Exact schema is an engineering decision, but the architecture must make configuration discoverable, auditable, and consumable through stable interfaces.

## 21. Audit, versioning, rollback

Material configuration changes should create audit evidence. Important policy/configuration should be versionable, and high-impact changes should support a safe restoration strategy.

The system should be able to answer:

- What changed?
- From what to what?
- Who changed it?
- When?
- At what scope?
- What did it affect?

## 22. V2 non-goals / V3 boundary

The following are primarily V3 and should not inflate V2 unless separately authorized:

- learning-based conversion prediction;
- optimal-contact-time prediction;
- predictive demand/capacity forecasting;
- adaptive technician/job affinity learned from outcomes;
- customer lifetime/retention prediction;
- predictive inventory consumption;
- conversation sentiment/intent inference as an autonomous workflow authority;
- predictive Pulse that warns of likely future failures;
- self-learning optimization loops.

V2 may prepare the data, configuration, audit, and event architecture required for these systems.

## 23. Acceptance doctrine

A V2 setting is not complete because a control renders.

For material configuration, acceptance should prove:

**User change → validation → permission check → persistence → effective-value resolution → consuming workflow behavior → audit event → visible result → safe error/rollback behavior where required.**

A rule is not complete because an IF/THEN editor exists. Its trigger, execution, consequences, conflicts, audit history, and downstream behavior must function.

## 24. Governing principle

> **V1 establishes correct behavior. V2 makes approved behavior safely configurable, governable, automatable, measurable, and optimizable.**

The visible Settings pages are only the control surface. The actual V2 product is the governed configuration and policy architecture beneath them.