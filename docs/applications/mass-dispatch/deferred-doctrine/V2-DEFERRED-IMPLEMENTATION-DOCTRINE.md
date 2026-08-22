# MASS Dispatch — V2 Deferred Implementation Doctrine

Status: DEFERRED / GOVERNED PRODUCT MATURITY LAYER
Date: 2026-08-22

## Purpose

V2 is not permission to rebuild V1. V2 matures the stable operational system by making its behavior more configurable, integrated, measurable, and administratively governable.

## 1. Functional Settings Architecture

Adopt a settings model comparable in convenience to mature field-service platforms: each major functional sector has a relevant settings surface rather than one undifferentiated configuration dump.

Settings should cover appropriate categories such as company/profile, business hours/service area, roles and permissions, notifications, booking/intake, customer experience, estimates, authorization, invoices/payments, jobs, Pipeline/workflow, communications, inventory, scheduling, warranty, integrations, and operational resources.

Settings must expose only governed choices. They must not allow configuration that breaks canonical state transitions, evidence requirements, authorization rules, auditability, or provider truth.

## 2. Communications Maturation

Expand the V1 contextual Communication / Media & Activity foundation into a mature communications capability.

Priorities include RingCentral integration; call-event ingestion; recordings and transcript attachment; SMS/voice reconciliation; customer and employee conversation context; communication preferences/consent where applicable; provider identity and delivery status; searchable communication history; and reliable linkage to customer, Pipeline, estimate, job, and follow-up objects.

A unified communications center may be introduced if operationally justified, but it must remain a view over the same underlying communication objects—not a competing customer workflow.

## 3. Pipeline Configuration & Automation

V1 establishes the canonical TNGD workflow. V2 may expose governed configuration of portions of the Pipeline: permitted columns/stages, labels, SLA/aging rules, ownership/technician badges, follow-up cadence, re-queue rules, source-specific intake behavior, automation triggers, and templates.

External lead sources such as Thumbtack, Yelp, Google, Facebook and website callback forms should enter through provider-aware routing with source, arrival timestamp, urgency/intent, requested timing, last contact, next action, and reconciliation state.

The admin remains responsible for keeping the conveyor current; the system increasingly handles routing, reminders, re-queuing, and state hygiene.

## 4. Technician Field Work Queue Maturation

Mature the technician's field micro-queue (task/work manager concept) as the technician analogue to admin Pipeline without turning technicians into customer-relationship administrators.

Admin may assign time-sensitive operational matters directly to technicians. Items may or may not be customer-bound. Pulse adapts to urgency and due state. Permissions and escalation rules are configurable.

## 5. Reporting & Analytics Depth

Preserve the distinction:

- Pulse = immediate operational intelligence;
- Role Analytics = curated decision intelligence;
- Reports = deeper interrogation/export.

Expand report coverage for jobs, estimates, leads/source, invoices/payments, revenue, average job size, conversion, technician performance, job costing/profitability where data is trustworthy, line items, discounts, time tracking, warranty, inventory, customer/review metrics, and geographic/service-area performance.

V2 should prioritize useful governed reports and exports over a fully open-ended report builder.

## 6. Financial Intelligence — Bounded

MASS remains an operations platform, not a general accounting/banking product.

V2 may deepen payment reconciliation, transaction status, deposits, outstanding balances, refunds/adjustments where supported, payment-method/provider status, job profitability, revenue intelligence, and accounting-provider integration.

Do not automatically expand into banking, lending, insurance, tax preparation, full expense accounting, or payout-account administration. Those require separate strategic authorization.

## 7. Inventory / Items & Services Maturity

Expand the V1 items/services/inventory foundation into governed stock management: item/service catalog, SKUs/part numbers, cost/retail, stock counts, reorder points, low/out-of-stock state, purchase/order linkage, inventory valuation, truck/location allocation where justified, and job/estimate consumption reconciliation.

Inventory events may participate in Calendar and Operations without being forced into customer Pipeline semantics.

## 8. Warranty & Post-Service Lifecycle

Mature warranty registration, warranty record/history, applicable labor/parts terms, claim initiation, service eligibility evidence, customer-facing warranty resources, review capture, referrals, approved promotions/coupons, and routine relationship check-ins.

These should integrate with Pipeline lifecycle and Operations rather than become isolated modules.

## 9. Micro-Marketing Boundary

Admin-facing operational marketing may include review requests, referrals, coupons/offers, promotions, campaign-response/source visibility, and simple leaderboards where directly tied to service operations.

Do not turn MASS into a replacement for Momentum Marketing Solutions or a full marketing automation suite. Broader campaign strategy, creative production, media buying, advanced CRM marketing, SEO/social management and agency intelligence remain outside MASS unless deliberately governed later.

## 10. Integration Health & Governance

Mature integration status, credential/configuration health, event ingestion status, provider degradation, retry/reconciliation visibility, and administrator-facing integration settings. System Health should explain what is healthy, degraded, disconnected, queued, or failing without requiring developers to inspect raw infrastructure for ordinary operational diagnosis.

## V2 Completion Character

A satisfactory V2 should feel like the same MASS Dispatch product with significantly stronger configuration, integration, reporting, communications, and operational administration—not a feature pile and not an ERP rewrite.
