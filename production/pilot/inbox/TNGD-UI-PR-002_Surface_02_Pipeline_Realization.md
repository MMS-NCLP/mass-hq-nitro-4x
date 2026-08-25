# TNGD-UI-PR-002 — Surface 02 Pipeline Realization

| Field | Value |
|---|---|
| Product | Nitro 4X \| Dispatch |
| Tenant | Top-Notch Garage Doors |
| Authority | Executive / Owner Authorized |
| Status | INBOX — ELIGIBLE |
| Effective | 2026-08-25 |
| Governing Baseline | Current canonical `main` at or after governance commit `6a932c9145a8dda5d0e1e658c3ac980110b9e645` |
| Predecessor | Surface 01 functional baseline / V1 RBAC checkpoint |
| Surface | 02 — Pipeline |
| Visual Authority | Owner-approved Pipeline reference supplied 2026-08-25 |
| Visual Fidelity Target | 95–98% at reference desktop viewport, except governed deviations |
| V1 Only | Yes |

## 1. Executive Authorization

Surface 02 — Pipeline is explicitly authorized for immediate controlled manufacturing.

This work order supersedes any older Surface 01-only prohibition **for the purpose of beginning Surface 02 once the predecessor state is version-preserved and its applicable validation gate passes**.

The continued presence of a Surface 01 package in `production/pilot/active/`, routine human visual review, an empty queue state, or missing successor paperwork shall not be interpreted as a global hold under MPD-002 Sections 6A–6B.

Surface 01 remains visually frozen except for compatibility corrections required to preserve shared shell/domain integrity.

## 2. Purpose

Realize the approved Pipeline reference as the canonical Nitro 4X | Dispatch Pipeline workspace while preserving the existing CRM/domain architecture.

Pipeline is the commercial lifecycle control surface connecting:

`Lead → Contacted → Qualified → Estimate Sent → Proposal Review → Won → Lost/Inactive`

and the post-job relationship lifecycle.

Pipeline must be a projection of governed CRM state, not a disconnected Kanban database.

## 3. Visual Realization Standard

Target 95–98% fidelity to the owner-approved Pipeline reference at the intended desktop viewport.

Preserve the reference's:

- light high-information workspace;
- seven-stage horizontal Pipeline Flow;
- KPI strip;
- card density and spacing;
- stage colors and numbering;
- lower analytics composition;
- follow-up lifecycle region;
- action region;
- precise typography, borders, elevation, alignment, icon scale, and hierarchy.

Do **not** reinterpret Pipeline into Surface 01's dark immersive command-dashboard aesthetic. Dispatch Today is the command environment; Pipeline is a sustained operational workspace.

The governed application shell, V1 RBAC, tenant identity, product identity, route authority, and existing functional contracts outrank reference-only shell details.

## 4. Required KPI Strip

Implement/derive:

1. Total Leads
2. New This Month
3. Estimates Sent
4. Jobs Won
5. Conversion Rate
6. Pipeline Value

Metrics must derive from governed records and documented calculation rules. Reference values are sample presentation data only.

## 5. Seven Governed Pipeline Stages

1. New Lead
2. Contacted
3. Qualified
4. Estimate Sent
5. Proposal Review
6. Won
7. Lost / Inactive

Each stage shall expose count, appropriate value, stage identity, and governed state color.

A record is one lifecycle entity progressing through governed transitions. Do not create seven disconnected collections.

Where transition truth depends on an underlying event (for example an estimate actually being sent), visual movement shall not bypass or counterfeit that event.

## 6. Record Integrity and Interaction

Pipeline cards shall resolve to existing canonical lead/customer/service-case/estimate/job identities.

Do not duplicate customer or opportunity records merely to populate Pipeline.

Card selection shall route to or expose the correct governed context.

`+ Add Lead` must use the canonical intake/lead creation mechanism and enter New Lead unless another governed initial state is explicitly valid.

## 7. Required Lifecycle Intelligence

Implement clean data support for:

- stage aging / time-in-stage;
- lead-source provenance retained through conversion;
- governed Lost / Inactive reason;
- expected/quoted/won values where supported;
- stage conversion counts and rates.

Loss reasons should support the existing authorized vocabulary or a controlled V1 set such as no response, price/budget, competitor, declined work, duplicate, outside scope/coverage, postponed, or other. Do not invent unsupported downstream automation.

## 8. Lower Analytics / Intelligence Regions

Realize the reference composition for:

### Pipeline Performance
Stage-volume visualization derived from the same Pipeline dataset.

### Conversion Funnel
New Lead → Contacted → Qualified → Estimate Sent → Proposal Review → Won, with counts and percentages derived from the same lifecycle data.

### Lead Source Breakdown
Use actual governed lead-source vocabulary and derived distribution.

### Top Services in Pipeline
Aggregate active opportunity/value by service category where supported.

No chart may be independently hard-coded away from the board data.

## 9. Post-Job Follow-Up Flow

Preserve the reference's three structural lifecycle bands:

- Immediate / 0–3 Days — post-job routine
- Approximately 2 Months — service check-in / maintenance relationship
- Approximately 1 Year — annual relationship / re-engagement

Do not claim automation is active unless canonical scheduling/automation capability actually supports it. Provider-dependent or deferred states must be truthful.

## 10. Follow-Up Performance

Where canonically derivable, support compact metrics for reviews generated, referral leads, and repeat business.

If a provider/domain source is unavailable, show governed preview/unavailable state rather than fabricated results.

## 11. Pipeline Actions

Realize the lower-right action area while classifying each reference action before wiring it:

- Functional now — wire it.
- Existing destination — navigate to it.
- Provider-dependent — show governed unavailable/preview state.
- Future/V2 — do not fake functionality.

Potential reference actions include Bulk Follow-Up, Send Promotion, Export Pipeline, View Automations, Lost Lead Report, Re-Engage Leads, Source Analysis, and operational insights.

## 12. V1 RBAC

Honor the frozen V1 role doctrine:

### Master Admin
First registrant / owner authority. Complete tenant authority. May also operate as Technician through additive capability without losing Master Admin permissions.

### Admin
Granted by Master Admin. Practical day-to-day CRM/operations authority, including operational commerce/revenue/payment functions. Does not automatically receive ownership transfer, sensitive tenant governance, organizational banking/finance, or V2 finance authority.

### Technician
Granted by Master Admin or Admin. Assignment-scoped field authority. No unrestricted company-wide Pipeline intelligence unless specifically exposed as job-context information.

Manager and Finance Officer are V2 and must not be introduced by this package.

## 13. Financial Boundary

Pipeline may expose operational commerce such as opportunity value, estimate value, won-job value, revenue implications, conversion value, and service mix.

It must not introduce organizational banking, account balances, owner distributions, tax/accounting administration, or Finance Officer V2 capabilities.

## 14. Responsive Behavior

Desktop fidelity is primary.

At narrower widths, preserve semantic left-to-right stage sequence and usable card dimensions. Horizontal board scrolling is acceptable and preferable to destructive compression. Lower analytics must reflow intentionally.

## 15. Truth / Evidence Doctrine

Maintain explicit distinctions among `LIVE`, `DERIVED`, `PREVIEW`, `PROVIDER-LIMITED`, `UNAVAILABLE`, and `FALLBACK` states.

Do not fabricate live GPS, communications, customer authorization, payments, marketing results, automation execution, provider status, or business intelligence to match the reference.

Architecture may anticipate future capability; V1 UI must not falsely claim it.

## 16. Validation and Acceptance

Before Surface 02 is submitted for owner inspection:

- preserve or raise the canonical regression floor;
- run applicable repository, UI/static, security/deployment, Railway, syntax, and diff validators;
- validate KPI derivation consistency;
- validate lifecycle transitions;
- validate identity continuity across Intake/Customer/Estimate/Job/Pipeline;
- validate stage aging, source provenance, and loss handling;
- validate RBAC;
- validate responsive behavior;
- verify no Surface 01 regression.

Passing tests do not constitute visual acceptance.

Owner localhost inspection is the final visual gate.

## 17. Scope Boundary

Authorized: Surface 02 — Pipeline only.

Not authorized:

- Surface 01 redesign;
- Surface 03 or later pages;
- bulk page propagation;
- Manager or Finance Officer V2;
- organizational-finance expansion;
- fake automation/providers/telemetry;
- alternate runtime or parallel application.

## 18. Stop Condition

When Pipeline reaches the required functional and 95–98% visual realization target, report:

- changed files;
- implemented domain behavior;
- intentional reference deviations and reason;
- test/validation results and new floor;
- commit/SHA status;
- localhost route;
- provider-backed functions still unavailable.

Then stop for owner inspection before beginning another surface.

## 19. Execution Law

**Use the approved reference as a near-direct page specification. Preserve canonical CRM truth. Build one coherent lifecycle, not another parallel CRM.**
