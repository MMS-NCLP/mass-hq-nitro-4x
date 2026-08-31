---
document-id: EWO-NCLP-V1-00
document-type: Engineering Work Order
title: NCLP V1 Launch Monetization Overlay
version: 0.1.0
status: Draft
classification: Proposed Production Authorization
effective-date: null
approved-date: null
source-authority: Executive Product Direction
governing-parent: EWO-MASS-002
planning-parent: MASS-PLAN-003
supersedes: null
superseded-by: null
revision-authority: Executive Governance Board
repository-authority: mass-hq
---

# EWO-NCLP-V1-00 — Launch Monetization Overlay

## 1. Purpose

Authorize, upon Executive approval, the governed design and implementation of a temporary launch monetization overlay for NC Local Pro V1.

This work order is governed by one sentence:

**We are changing how NCLP collects contractor revenue at launch, not what NCLP is.**

The objective is to support an aggressive marketplace take-off through a launch-period pay-per-lead commercial model while preserving the permanent tier architecture, trust architecture, marketplace architecture, and standard subscription economics already established by NC Local Pro.

This work order does not create a fifth permanent subscription tier. It does not redesign the platform. It does not authorize general feature expansion.

This Draft creates no manufacturing authority. Production of the governed artifacts in Section 5 and all implementation activity remain prohibited until Executive approval of this work order.

## 2. Governing Objective

Reduce contractor acquisition friction during marketplace cold start by allowing eligible launch contractors to participate without a recurring monthly subscription while paying authorized pay-per-lead charges.

The launch model shall preserve a clean separation between:

1. permanent provider identity and tier,
2. temporary commercial billing state, and
3. temporary launch access permissions.

The launch mechanism shall be reversible without redesigning permanent tier logic or migrating contractor identity merely to remove promotional access.

## 3. Traceability and Governing Authority

This work order shall trace to and remain subordinate to:

- MASS Master Governing Mission Statement, including marketplace and operational objectives applicable to NCLP.
- MASS-PLAN-003 — NCLP Unified V1 Roadmap.
- EWO-MASS-002 — NCLP Platform Convergence Baseline (PCB), which requires subsequent NCLP refinement work to identify the convergence objective it implements.
- PCB Preserve classifications governing Pricing & Commerce, Identity/Permission Matrix, Credits, Trust & Reputation, and other architecturally sound subsystems touched by this overlay.
- Applicable governance principles and executive directives currently registered in GMF-001.

### PCB Convergence Objective

V1-00 is a governed refinement of existing commercial and permission behavior. It shall improve launch cohesion without reopening Preserve subsystem architecture.

The work order shall treat existing permanent tier, trust, credits, and pricing architecture as preserved unless a narrowly documented implementation defect makes a correction unavoidable.

## 4. Scope and Three-Layer Identity Model

The launch architecture shall use three independent concerns:

```text
PERMANENT IDENTITY
ProviderTier = STARTER | CONTRACTOR | PRO | EXPERT

TEMPORARY COMMERCIAL STATE
CommercialMode = LAUNCH_PPL | STANDARD_SUBSCRIPTIONS

TEMPORARY ACCESS POLICY
EntitlementOverlay = LAUNCH_FOUNDING | NONE
```

A launch contractor shall not be promoted to CONTRACTOR, PRO, or EXPERT merely to receive launch access. The permanent provider tier remains authoritative for identity, tier history, and systems that are not explicitly authorized to consume the overlay.

The effective access model shall be resolved centrally, conceptually through a function such as:

```text
getEffectiveEntitlements(provider)
```

Implementation naming may differ where repository evidence justifies it, but entitlement resolution shall remain centralized and auditable.

### Lifecycle

```text
PRE-LAUNCH
ProviderTier = permanent assigned tier
CommercialMode = STANDARD_SUBSCRIPTIONS
EntitlementOverlay = NONE

        ↓ Executive activation

LAUNCH
ProviderTier = permanent assigned tier
CommercialMode = LAUNCH_PPL
EntitlementOverlay = LAUNCH_FOUNDING where authorized

        ↓ Executive conversion decision

TRANSITION
Provider chooses an authorized steady-state path:
- STARTER / normal PPL economics
- CONTRACTOR / standard subscription economics
- PRO / standard subscription economics
- EXPERT / standard subscription economics

        ↓ launch overlay sunset

STEADY STATE
CommercialMode = STANDARD_SUBSCRIPTIONS
EntitlementOverlay = NONE
Permanent tier rules govern access
```

### STANDARD_SUBSCRIPTIONS Clarification

`STANDARD_SUBSCRIPTIONS` does **not** mean that every contractor must hold a paid recurring subscription and does **not** globally disable pay-per-lead economics.

Starter's ordinary pay-per-lead model is a permanent entry-level commercial model and predates the launch overlay. Under `STANDARD_SUBSCRIPTIONS`, Starter shall retain its governed normal PPL economics while Contractor, Pro, and Expert shall use their governed standard subscription economics.

The launch overlay is temporary. Starter PPL is not.

## 5. Required Pre-Implementation Governed Artifacts

No implementation shall begin until all five artifacts below have been manufactured, reviewed, and approved under the authority granted by this work order.

### Artifact 1 — Launch Entitlement Matrix

Produce an explicit, auditable `LAUNCH_FOUNDING` capability matrix.

Every relevant contractor capability shall be classified as:

- `ALLOW`
- `DENY`
- `LIMIT(n)` or an equivalently precise governed constraint

The matrix shall cover, at minimum, marketplace participation, lead access, community participation, content creation, profile/portfolio capability, endorsements, messaging, job tools, Blueprints, analytics, visibility/ranking effects, geographic access, notifications, administrative-visible state, and any other capability currently gated by permanent tier or permission logic.

The matrix shall identify which systems must ignore the overlay. Trust and E.C.P.R. calculations shall not receive an inflated permanent tier merely because launch access is active.

No capability shall be selected through implementation discretion after artifact approval.

### Artifact 2 — Commercial Mode Contract

Define authoritative behavior for:

- `LAUNCH_PPL`
- `STANDARD_SUBSCRIPTIONS`

The contract shall specify billing eligibility, recurring subscription expectations, lead-fee behavior, checkout/onboarding behavior, subscription-state interpretation, payment failure behavior, webhook expectations, account display behavior, and transition behavior.

It shall include the STANDARD_SUBSCRIPTIONS clarification in Section 4 verbatim or in substantively equivalent language.

### Artifact 3 — Conversion Readiness Policy

Define the data and governance mechanism used to evaluate when NCLP may transition from launch overlay operation toward standard commercial operation.

The system may expose readiness telemetry such as:

- active contractor density,
- homeowner lead volume,
- lead unlock rate,
- contractor response rate,
- job conversion rate,
- repeat participation,
- geographic/category liquidity,
- other approved marketplace-readiness measures.

Telemetry informs Executive decisions. It shall not independently activate paid subscription enforcement unless a later governed authorization explicitly permits automated activation.

The artifact shall support an Executive-controlled activation mechanism and shall permit thresholds or timing to be set or revised through governed configuration rather than scattered application logic.

### Artifact 4 — PPL Credit Validation Matrix

Validate the existing platform-points/credits system under launch conditions where authorized lead charges may become the primary contractor spend channel.

The matrix shall answer, at minimum:

- whether LAUNCH_FOUNDING contractors earn points,
- applicable earning caps,
- which PPL charges points may offset,
- maximum offset amount or percentage,
- whether contribution behavior can unintentionally enable indefinite free operation,
- whether expiration rules remain appropriate,
- whether balance visibility and transaction history are sufficient for launch use,
- whether current economics remain intentional under concentrated PPL spending.

This is a balance validation exercise, not authorization to redesign credits as currency or reopen the preserved credit architecture.

### Artifact 5 — Launch Overlay Sunset Plan

Produce the decommissioning drawing for temporary launch tooling.

The artifact shall identify:

- configuration flags or rows that become inactive,
- conditional branches eligible for removal,
- launch-only UI copy and presentation paths to retire,
- admin controls that simplify or retire,
- tests that change from launch-primary to standard-primary,
- telemetry or historical records that must remain,
- accounting/audit information that must be retained,
- any cleanup sequence required after `LAUNCH_FOUNDING` is removed.

Sunset shall not require a provider-tier migration merely to remove temporary launch access.

The plan shall distinguish deactivation from deletion: historical commercial and accounting evidence may remain even when launch behavior is no longer active.

## 6. Engineering Principles and Product Freeze

### Entitlement / Billing Separation

Permanent tier identity, commercial billing mode, and temporary entitlement overlays shall remain independent concerns.

Commercial state shall not be inferred solely from permission level, and permission level shall not be inferred solely from payment state.

### Centralized Resolution

Launch behavior shall not be implemented through scattered ad hoc checks across pages, APIs, services, or components.

Commercial-mode resolution and effective-entitlement resolution shall each have an authoritative source of truth suitable for testing and audit.

### Product Freeze Rule

**Upon approval of the five governed V1-00 artifacts, commercial policy, entitlement policy, credit balance rules, conversion mechanics, and launch-state behavior are frozen for implementation. Any substantive deviation requires documented revision authority and shall not be resolved through implementation discretion.**

### Decommissioning Principle

Temporary tooling must come with its decommissioning drawing.

For V1-00, the Launch Overlay Sunset Plan is a certification requirement. This principle is scoped to this work order. MASS-wide adoption, if desired, requires separate governance action and is not authorized here.

## 7. Authorized Implementation Areas

After Executive approval of this work order and subsequent approval/freeze of all five governed artifacts, implementation may occur only within the following areas to the extent necessary to execute those artifacts:

1. **Commercial Mode Resolution**
   - authoritative commercial-mode configuration and resolution,
   - launch activation/deactivation behavior,
   - compatibility with permanent Starter PPL economics.

2. **Entitlement Resolution**
   - centralized effective-entitlement resolution,
   - application of `LAUNCH_FOUNDING`,
   - prevention of permanent tier contamination.

3. **Launch Presentation and Acquisition Flow**
   - contractor onboarding/plan-selection presentation,
   - pricing and `/for-pros` presentation,
   - relevant dashboard/account messaging,
   - removal or bypass of recurring-subscription requirements where the Commercial Mode Contract authorizes it.

4. **PPL Transaction and Credit Validation**
   - authoritative lead-fee charging/unlock behavior,
   - points/credit offsets as approved,
   - transaction-state visibility and failure handling,
   - regression protection for standard commercial behavior.

5. **Admin and Readiness Controls**
   - visibility of permanent tier, commercial mode, and active overlay as separate states,
   - readiness telemetry required by Artifact 3,
   - Executive-controlled activation/deactivation mechanism,
   - auditability appropriate to commercial state changes.

Implementation shall prefer the smallest repository change set capable of satisfying the governed artifacts.

## 8. Explicit Exclusions

This work order does not authorize redesign or expansion of:

1. permanent Starter / Contractor / Pro / Expert tier definitions,
2. contractor matching philosophy or matching quality algorithms,
3. E.C.P.R. or Trust & Reputation architecture,
4. contractor verification architecture,
5. homeowner permissions or homeowner product model,
6. Community Hub architecture,
7. Blueprint architecture,
8. job lifecycle architecture,
9. messaging initiation/asymmetry rules,
10. administrative hierarchy,
11. Market Intelligence as a new product feature beyond telemetry strictly required by Artifact 3,
12. geographic/county marketplace architecture,
13. permanent standard subscription economics,
14. credit architecture beyond balance validation and narrowly authorized launch compatibility,
15. unrelated UI redesign, branding redesign, framework migration, schema redesign, repository restructuring, or platform expansion.

Stripe Connect, escrow, payout, or other payment architecture shall not be expanded unless repository evidence demonstrates that an existing launch-authorized transaction cannot function without a narrowly scoped correction. Such a condition requires documented variance/revision authority before scope expansion.

## 9. Dependency Inheritance and Conveyor Position

V1-00 shall precede the remaining NCLP V1 refinement/hardening work because it changes the launch-active commercial and entitlement test state.

Planned conveyor position:

```text
Dispatch
  → NCLP-V1-00 Launch Monetization Overlay
  → NCLP-V1-01 Intake Correctness & Auth Continuity
  → NCLP-V1-02 Admin Reliability
  → NCLP-V1-03 Contractor Response & Payment-State Integrity
  → NCLP-V1-04 Route & Legal Integrity
  → NCLP-V1-05 Trust, Geography & Marketplace Truth
  → NCLP-V1-06 Accessibility & Mobile Hardening
  → NCLP-V1-07 Production Certification & Code Health / Gold Master Candidate
```

### Downstream Certification Baseline

The following requirement shall be inherited by V1-01 through V1-07 unless superseded by later Executive authorization:

**Primary certification shall be performed with `LAUNCH_PPL` active and `LAUNCH_FOUNDING` entitlement resolution enabled. Standard subscription mode must remain regression-tested but is not the launch-active state.**

V1-00 therefore changes the downstream validation surface but does not authorize expansion of downstream WO scope.

## 10. Acceptance Criteria

V1-00 implementation shall not be considered complete until all applicable conditions below are satisfied:

1. All five governed artifacts exist and carry required approval/freeze state before implementation begins.
2. Permanent provider tier, commercial mode, and entitlement overlay are independently represented and resolvable.
3. A launch contractor can receive approved launch capabilities without being promoted to a higher permanent tier solely for launch access.
4. Trust/E.C.P.R. and other excluded systems are not unintentionally affected by temporary entitlement elevation.
5. `LAUNCH_PPL` supports the approved no-recurring-subscription launch path and authorized PPL charging behavior.
6. `STANDARD_SUBSCRIPTIONS` restores normal commercial operation while preserving Starter's permanent PPL economics.
7. Effective entitlements are centrally resolved and match the approved Launch Entitlement Matrix.
8. Launch pricing/onboarding/account presentation accurately reflects the active commercial state.
9. Lead-fee and credit/points behavior conforms to the approved PPL Credit Validation Matrix.
10. Readiness telemetry and Executive-controlled conversion activation conform to the approved Conversion Readiness Policy.
11. Standard subscription behavior remains regression-tested and recoverable.
12. Downstream V1-01 through V1-07 certification can execute against the launch-active baseline defined in Section 9.
13. The launch overlay can be deactivated without requiring a provider-tier migration solely for cleanup.
14. Sunset removability is demonstrated against the Launch Overlay Sunset Plan, including identification of temporary branches/configuration and retained historical evidence.

## 11. Evidence and Variance Standard

Every implementation decision affecting commercial behavior, entitlements, credits, conversion, or sunset shall trace to one of the five approved governed artifacts.

Acceptable evidence includes:

- approved artifact requirements,
- repository source code,
- schema and configuration evidence,
- automated test results,
- integration test results,
- payment/lead transaction test evidence,
- UI behavior evidence,
- audit/event evidence,
- production-like validation where authorized.

An unanswered commercial-policy or entitlement-policy question is not implementation discretion.

If implementation reveals a contradiction, missing governed decision, or required change outside the approved artifacts, work on that affected decision shall stop and a documented variance or revision request shall be raised. Unaffected authorized manufacturing may continue where safe and separable.

## 12. Manufacturing Execution

This section defines the intended execution envelope after approval.

```yaml
target-repositories:
  governance: mass-hq-nitro-4x
  implementation: nc-local-pro
source-branch: main
proposed-working-branch: nclp/v1-00-launch-monetization-overlay
status-at-issuance: Draft
manufacturing-authority-at-draft: none
phase-1-mode: governed artifact production
phase-2-mode: implementation only after artifact approval and freeze
permissions-after-authorization:
  - read NCLP repository and governing evidence
  - create governed V1-00 artifact documentation
  - create working branch for authorized implementation
  - modify only implementation surfaces required by approved artifacts
  - create tests and validation evidence
prohibited-before-EWO-approval:
  - manufacture the five governed artifacts as approved production artifacts
  - modify NCLP production code
  - modify NCLP schema or commercial behavior
  - activate launch commercial mode
prohibited-before-artifact-approval:
  - implementation of V1-00
  - production deployment
  - permanent tier redesign
  - unapproved commercial-policy decisions
required-governed-artifacts:
  - 01-launch-entitlement-matrix.md
  - 02-commercial-mode-contract.md
  - 03-conversion-readiness-policy.md
  - 04-ppl-credit-validation-matrix.md
  - 05-launch-overlay-sunset-plan.md
completion-protocol:
  - obtain Executive approval of EWO-NCLP-V1-00
  - manufacture all five governed artifacts
  - obtain Executive approval/freeze of all five artifacts
  - implement against approved artifacts only
  - execute launch-active and standard-mode regression validation
  - produce certification evidence including sunset removability
  - request Executive completion determination
```

Exact implementation and evidence paths shall be finalized from repository evidence during authorized artifact production and recorded in the governed artifacts or an approved execution manifest. Path selection shall not alter product policy.

## 13. Sizing and Manufacturing Boundary

Classification: **Medium, tightly governed.**

V1-00 is one commercial launch build. It is not authorization for a subscription-system rewrite, permanent tier redesign, or a new series of product features.

The five governed artifacts shall be produced and approved before implementation scope is finalized at file/change level. Their purpose is to remove policy ambiguity before engineers estimate and modify code.

Any implementation discovery that would transform V1-00 into a broad tier, trust, community, matching, credits, or payment-platform redesign shall be treated as evidence of scope breach and returned to governance.

## 14. Executive Authorization

Current status: **Draft — Awaiting Executive Approval.**

Approval of this work order authorizes production of the five governed pre-implementation artifacts in Section 5. Approval of this work order alone does **not** authorize NCLP implementation.

Implementation authority is created only after:

1. this EWO is approved,
2. all five governed artifacts are manufactured,
3. all five governed artifacts receive required Executive approval/freeze, and
4. the approved artifact set provides a complete implementation boundary.

The Launch Overlay Sunset Plan is a certification condition, not deferred housekeeping.

No launch overlay shall be certified without a defined and testable decommissioning path.

---

*End of EWO-NCLP-V1-00 — Draft*