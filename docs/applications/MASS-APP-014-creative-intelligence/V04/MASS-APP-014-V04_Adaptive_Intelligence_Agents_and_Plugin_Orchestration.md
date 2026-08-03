# MASS-APP-014-V04 - Adaptive Intelligence, Agents & Plugin Orchestration

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-APP-014-V04 |
| Version | 1.0 |
| Status | Production Baseline |
| Authority | EWO-MASS-APP-014-V04 |
| Date | 2026-08-03 |

## 1. Purpose

V04 defines the application room through which departments, approved agent profiles, plugins, NOVA, POPS, and future intelligence capabilities cooperate around authorized enterprise objectives.

V04 coordinates context, assignments, contributions, approvals, and traceability. It does not replace ENG-009 AI orchestration, ENG-006 workflow execution, the future Plugin Library, departmental authority, or executive judgment.

## 2. Scope

Included: agent lifecycle and application registry, department-intelligence bindings, skill routing, plugin bindings, future marketplace consumption, collaboration plans, human approval gates, adaptive-workflow recommendations, context sharing, memory utilization, Executive Cockpit integration, Dispatch integration, Design Studio integration, security, APIs, data model, and folder structure.

Excluded: model-provider orchestration, unrestricted agent autonomy, autonomous approval, direct workflow execution, plugin package certification, marketplace commerce, cross-tenant memory, department replacement, source-system mutation, and hidden chain-of-thought retention.

## 3. Platform Consumption Map

| Dependency | Consumed capability | Delegated responsibility |
|---|---|---|
| APP-014 V01-V03 | Sessions, memory, reasoning, decisions | Creative and decision intelligence |
| APP-013 | Projects, assets, content, publications, visualizations | Design stewardship |
| ENG-003/004/005 | Identity, authorization, events | Platform controls |
| ENG-006 | Durable workflows and tasks | Workflow execution |
| ENG-007 | Knowledge retrieval | Knowledge authority |
| ENG-009 | Agents, prompts, tools, providers, guardrails | AI execution and orchestration |
| ENG-010 | Assignment notifications | Notification delivery |
| ENG-014 | Feature and environment configuration | Runtime configuration |
| ENG-016/026 | Integration and interoperability | External connectivity |
| ENG-017-027 | Department and enterprise intelligence | Constitutional domain authority |
| Future Plugin Library | Plugin packages, certification, catalog, marketplace | Plugin governance and distribution |
| Future Executive Cockpit | Executive presentation and command surface | Executive user experience |

V04 owns application-level orchestration plans, approved participant bindings, context envelopes, contribution records, approval gates, and integration handoffs. It delegates execution and constitutional ownership.

Published events: intelligence.plan.created, intelligence.assignment.requested, intelligence.contribution.received, intelligence.gate.awaiting, intelligence.plan.approved, intelligence.plan.rejected, intelligence.handoff.created.

Consumed events: agent.execution.completed, agent.execution.failed, plugin.catalog.updated, organizational.memory.preserved, decision.human.recorded, workflow.state.changed, dispatch.mission.updated, design.publication.created.

## 4. Orchestration Model

An IntelligencePlan defines an objective, owner, authorized context, participant assignments, dependency graph, approval gates, output contract, and completion criteria. V04 submits each bounded assignment to its owning execution system and records signed contributions.

V04 never executes model calls, plugin code, or operational tasks directly. It coordinates contracts and state around those executions.

Lifecycle: Draft -> Validating -> Ready -> Running -> Awaiting Approval -> Approved or Rejected -> Completed -> Archived. Running may enter Paused, Failed, or Cancelled.

## 5. Capability Architecture

| Capability | Purpose | Inputs | Outputs | Dependencies | V1 implementation | Future evolution |
|---|---|---|---|---|---|---|
| Agent Registry | Bind approved agent profiles to APP-014 | ENG-009 profile, tenant policy, skills | AgentBinding | ENG-009, ENG-004 | Tenant-approved bindings | Enterprise agent catalog |
| Agent Lifecycle | Govern availability and assignment | Binding, status, version | Active, suspended, retired states | ENG-009 | Manual lifecycle approval | Automated health-informed suspension |
| Department Intelligence | Request domain-owned intelligence | Objective, domain, context | Signed domain contribution | ENG-017-027 | Typed gateway requests | Broader cross-department federation |
| Skill Routing | Match work to approved capability | Task contract, required skills | Ranked route candidates | ENG-009, plugin catalog | Deterministic rules and explicit selection | Policy-calibrated routing |
| Plugin Binding | Connect approved plugins | Catalog item, permissions, configuration | Tenant PluginBinding | Future Plugin Library, ENG-004 | Internal approved bindings | Certified ecosystem plugins |
| Marketplace Consumption | Discover compatible approved packages | Catalog and compatibility metadata | Installation request | Future Plugin Library | Architectural contract only | Governed marketplace experience |
| Agent Collaboration | Coordinate bounded contributions | Plan graph, assignments, evidence | Signed contribution set | ENG-009 | Sequential and dependency-ordered calls | Governed parallel collaboration |
| Human Approval Gates | Protect accountable authority | Review package and principal | ApprovalDecision | ENG-003, ENG-004 | Mandatory gates | Remains mandatory |
| Adaptive Workflows | Recommend plan changes from evidence | Workflow state, failures, outcomes | AdaptationProposal | ENG-006, ENG-024 | Human-approved proposals | Policy-bounded dynamic adaptation |
| Context Sharing | Minimize and authorize shared context | Source refs, participant permissions | ContextEnvelope | V01, V02, ENG-004 | Immutable bounded envelopes | Fine-grained dynamic context negotiation |
| Memory Utilization | Retrieve precedent and preserve outcomes | Objective, scope, verified result | Memory references and preservation handoff | V02, ENG-007 | Explicit retrieval and handoff | Continuous approved learning |
| Executive Cockpit Handoff | Present status and approval packages | Plan summary, risks, decisions | Read model and approval request | Future Cockpit, V03 | API and event contract | Integrated executive command surface |
| Dispatch Handoff | Exchange mission intelligence | Mission ref, context, outcome | Read-only intelligence or approved request | ENG-021 | Typed handoff only | Rich field-intelligence feedback |
| Design Studio Handoff | Request or reference governed artifacts | APP-013 references, approved brief | Artifact request and references | APP-013 | Typed handoff only | Intelligence-assisted artifact workflows |

Complete architecture does not imply all future runtimes ship in V1.

## 6. Agent Registry and Lifecycle

AgentBinding references an ENG-009 governed agent profile and records tenant, version, approved skills, allowed tools, context policy, cost boundary, concurrency limit, approver, and lifecycle state.

States are proposed, approved, active, suspended, retired, and revoked. Only Administrator may approve or revoke. Suspension prevents new assignments but preserves history. Version changes require renewed compatibility and permission review.

The registry does not store model credentials or implement providers.

## 7. Skill Routing

A SkillRequirement identifies capability, input schema, output schema, sensitivity, latency class, cost class, and required assurance. SkillRoute evaluates only approved AgentBindings, PluginBindings, and department gateways.

V1 uses deterministic compatibility filters and explicit human selection. Future routing may rank candidates using performance evidence, but it cannot bypass permissions, cost limits, or approval policy.

Every routing decision stores candidates considered, exclusions, selected participant, rules applied, and selecting principal.

## 8. Plugin Framework and Marketplace Boundary

PluginBinding references a package governed by the future Plugin Library. It records catalog identifier, package version, compatibility range, declared capabilities, approved scopes, configuration reference, installation status, and tenant approver.

V04 defines invocation contracts and consumes catalog metadata. It does not own package storage, signing, certification, vulnerability review, marketplace commerce, licensing, installation runtime, or publisher relationships.

V1 permits only internally approved bindings. Marketplace discovery, procurement, ratings, billing, and external publishers are future Plugin Library capabilities with an established architectural home.

## 9. Collaboration Plans

An IntelligencePlan contains AssignmentNodes and dependency edges. Each assignment has one participant, bounded objective, authorized ContextEnvelope, output schema, timeout, retry policy, and review requirement.

V1 supports sequential and dependency-ordered execution. Parallel execution may be enabled only where assignments are independent and ENG-009 or the owning platform supports it.

ContributionRecord stores participant identity, version, input hash, output, citations, confidence, execution reference, timestamps, and error state. Contributions are advisory until accepted at a human gate.

## 10. Human Approval Boundaries

ApprovalGate defines the action requiring approval, eligible approver roles, quorum where required, evidence package, expiration, and downstream permission.

Agents, plugins, NOVA, POPS, and departments may recommend. They cannot approve their own contributions, change approval policy, authorize spending, communicate externally, dispatch personnel, publish artifacts, or mutate source systems.

ApprovalDecision is immutable. Correction creates an amendment. Rejection returns the plan to an explicitly authorized prior state.

## 11. Adaptive Workflows

V04 may create an AdaptationProposal when evidence changes, an assignment fails, risk exceeds policy, required context becomes stale, or a better approved route becomes available.

The proposal records trigger, current plan, proposed change, expected impact, risk, cost, evidence, and required approver. ENG-006 remains the workflow executor. No adaptation takes effect until required approval and a governed workflow command.

## 12. Context Sharing and Memory

ContextEnvelope is immutable and assignment-specific. It records source references, redactions, sensitivity, permitted uses, expiration, tenant, and authorization snapshot. Participants receive minimum necessary context.

V02 and ENG-007 provide organizational memory. V04 retrieves authorized precedent and stores only references in the plan. Verified completion outcomes may be handed to V02 for preservation after human confirmation.

Context never crosses tenants, and revocation prevents future use without deleting historical audit evidence.

## 13. Integration Contracts

### Executive Cockpit

V04 publishes plan status, blocked gates, risks, costs, recommendations, and approval packages. The Cockpit owns executive presentation. It may submit signed approvals through V04 APIs.

### Dispatch

V04 may read approved mission context and submit an intelligence handoff. Dispatch owns mission preparation, assignment, coordination, and field execution. No agent dispatches personnel.

### Design Studio

V04 may reference APP-013 artifacts or submit an approved creative brief. APP-013 owns projects, components, templates, assets, publications, content, and visualizations.

## 14. NOVA and POPS

NOVA and POPS are governed advisory participant types executed through ENG-009.

NOVA contributes enterprise context, dependencies, patterns, and consequences. POPS contributes stewardship, constitutional alignment, continuity, and accountability guidance.

They cannot approve gates, appoint agents, install plugins, or execute operational work.

## 15. Security Model

- Tenant RLS applies to every V04 entity.
- Composite tenant foreign keys protect all child relationships.
- Agent and plugin credentials remain in ENG-004 governed secret references.
- ContextEnvelope access is participant-specific and time-bounded.
- Tool, cost, data, and output permissions are deny-by-default.
- Execution references are signed and auditable.
- Self-approval and contribution approval by the originating participant are prohibited.
- Revoked bindings cannot receive new assignments.
- Cross-tenant context, memory, metrics, and adaptation are prohibited.

## 16. Data Model

| Entity | Purpose | Core integrity |
|---|---|---|
| IntelligencePlan | Orchestration container | Tenant lifecycle and human owner |
| PlanObjective | Revisioned objective | One active revision |
| AgentBinding | Approved ENG-009 profile | Version and permission approval |
| DepartmentBinding | Domain intelligence gateway | Constitutional owner retained |
| SkillDefinition | Required capability contract | Versioned schemas |
| SkillRoute | Auditable participant selection | Candidate and exclusion record |
| PluginBinding | Approved catalog binding | Package version and scopes |
| AssignmentNode | Bounded participant task | Plan dependency integrity |
| AssignmentDependency | Directed plan edge | Cycle prevention |
| ContextEnvelope | Immutable shared context | Sensitivity and expiration |
| ContextReference | Authorized source reference | Tenant and lifecycle validation |
| ContributionRecord | Signed participant output | Execution reference and citations |
| ApprovalGate | Required human checkpoint | Role and quorum policy |
| ApprovalDecision | Immutable human response | No self-approval |
| AdaptationProposal | Proposed plan change | Human approval required |
| OrchestrationRun | Execution attempt | Idempotency and status |
| InvocationRecord | Agent or plugin invocation | Input hash and output trace |
| MemoryUtilization | V02 memory reference | Read-only reference |
| IntegrationHandoff | Cockpit, Dispatch, or Design request | Idempotent destination contract |
| PlanOutcome | Verified result | Human verification required |

## 17. API Inventory

| Method | Route | Purpose |
|---|---|---|
| GET, POST | /intelligence-plans | List or create plans |
| GET, PATCH | /intelligence-plans/{id} | Retrieve or edit plan |
| POST | /intelligence-plans/{id}/validate | Validate plan |
| POST | /intelligence-plans/{id}/start | Start approved run |
| POST | /intelligence-plans/{id}/pause | Pause run |
| POST | /intelligence-plans/{id}/cancel | Cancel run |
| POST | /intelligence-plans/{id}/archive | Archive plan |
| GET, POST | /agent-bindings | List or propose agent bindings |
| PATCH | /agent-bindings/{id} | Update eligible binding |
| POST | /agent-bindings/{id}/approve | Approve binding |
| POST | /agent-bindings/{id}/suspend | Suspend binding |
| POST | /agent-bindings/{id}/revoke | Revoke binding |
| GET | /department-bindings | List department gateways |
| GET | /skills | List skill contracts |
| POST | /skill-routes/evaluate | Evaluate routes |
| GET, POST | /plugin-bindings | List or propose plugin binding |
| POST | /plugin-bindings/{id}/approve | Approve binding |
| POST | /plugin-bindings/{id}/revoke | Revoke binding |
| GET, POST | /intelligence-plans/{id}/assignments | List or create assignments |
| POST | /intelligence-plans/{id}/assignments/{assignmentId}/invoke | Request execution |
| GET | /intelligence-plans/{id}/contributions | List contributions |
| GET, POST | /intelligence-plans/{id}/approval-gates | List or create gates |
| POST | /approval-gates/{id}/decisions | Record human decision |
| GET, POST | /intelligence-plans/{id}/adaptations | List or propose adaptations |
| POST | /adaptations/{id}/approve | Approve adaptation |
| GET, POST | /intelligence-plans/{id}/context-envelopes | List or create envelopes |
| POST | /intelligence-plans/{id}/memory-search | Retrieve V02 memory |
| POST | /intelligence-plans/{id}/nova-advisory | Request NOVA |
| POST | /intelligence-plans/{id}/pops-advisory | Request POPS |
| POST | /intelligence-plans/{id}/handoffs/executive-cockpit | Create Cockpit handoff |
| POST | /intelligence-plans/{id}/handoffs/dispatch | Create Dispatch handoff |
| POST | /intelligence-plans/{id}/handoffs/design-studio | Create Design Studio handoff |
| POST | /intelligence-plans/{id}/outcomes | Record verified outcome |
| GET | /intelligence-plans/{id}/audit | Retrieve orchestration audit |

All mutations use idempotency keys. Execution requests return platform execution references, never unmanaged local processes.

## 18. Folder Structure and Migrations

V04 adds plans, registry, skills, routing, plugins, assignments, context, contributions, approvals, adaptations, runs, memory, and integrations. Gateways alone call ENG-006, ENG-009, V02, departments, plugins, Cockpit, Dispatch, or APP-013.

Migrations continue from 042 through 054: plans, bindings, skills, routing, assignments, context, contributions, gates, adaptations, runs, handoffs, RLS, and enforcement triggers.

## 19. Failure Behavior

- No compatible route: block assignment and identify missing capability.
- Participant unavailable: retry within policy or request rerouting.
- Context revoked or stale: pause affected assignments.
- Plugin or agent failure: record failure; preserve plan and prior contributions.
- Gate expires: remain awaiting approval.
- Unauthorized approval: reject without state change.
- Adaptation rejected: retain current plan.
- Integration unavailable: retain idempotent handoff for retry.

## 20. V1 and Future Boundary

V1 implements tenant-approved agent bindings, deterministic routing, sequential plans, immutable context envelopes, contribution records, mandatory gates, adaptation proposals, memory references, and typed integration handoffs.

Future evolution includes certified plugin marketplaces, richer department federation, approved parallel agents, health-informed routing, and policy-bounded adaptive collaboration. Their architectural homes are defined; they are not V1 runtime requirements.

## 21. Acceptance Verification

- Application orchestration is distinct from ENG-009 and ENG-006 execution.
- Department intelligence retains constitutional ownership.
- Plugin governance and marketplace ownership remain with the future Plugin Library.
- Human approval cannot be bypassed.
- NOVA and POPS remain advisory request types.
- Context and memory remain tenant-bound.
- Executive Cockpit, Dispatch, and Design Studio boundaries are explicit.
- Complete future intent has an architectural home without expanding V1 implementation.

## 22. Constitutional Boundary Statement

V04 coordinates authorized intelligence contributions. It does not own departmental intelligence, enterprise knowledge, workflows, AI providers, plugins, marketplace governance, executive decisions, field operations, or design artifacts. It cannot authorize or execute enterprise action. Constitutional authority remains with accountable humans and owning enterprise capabilities.
