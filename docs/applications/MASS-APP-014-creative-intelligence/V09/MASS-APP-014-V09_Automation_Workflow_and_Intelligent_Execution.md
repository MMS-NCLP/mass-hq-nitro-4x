# MASS-APP-014-V09 - Automation, Workflow & Intelligent Execution

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-APP-014-V09 |
| Version | 1.0 |
| Status | Production Baseline |
| Authority | EWO-MASS-APP-014-V09 |
| Date | 2026-08-03 |

## 1. Purpose

V09 defines how an approved human decision becomes a governed execution plan, coordinated work requests, monitored outcomes, and preserved learning.

V09 plans and supervises application-level execution. It does not execute workflows, dispatch personnel, authorize spending, publish communications, or replace operational owners.

## 2. Platform Boundaries

| Owner | Responsibility |
|---|---|
| APP-014-V09 | Decision-to-execution translation, execution plan, dependencies, approval gates, handoffs, monitoring view, exception intelligence |
| ENG-006 | Durable workflow and task execution |
| ENG-020 | Enterprise operations coordination |
| ENG-021 | Mission and field dispatch |
| ENG-022 | Financial transactions and expenditure authority |
| ENG-023/010 | Communication governance and delivery |
| ENG-025 | Automation governance and approval |
| ENG-009 | AI and agent advisory execution |

Published events: execution.plan.created, execution.plan.approved, execution.handoff.created, execution.exception.detected, execution.outcome.verified. Consumed events: decision.human.recorded, workflow.state.changed, mission.state.changed, automation.exception.raised, financial.authorization.updated.

## 3. Role Mapping

V09 roles extend and specialize the APP-014 hierarchy.

| V09 role | Baseline | Specialized authority |
|---|---|---|
| Execution Owner | Steward, extending V01 Editor | Owns assigned plans, dependencies, handoffs, monitoring, and exception responses. Cannot approve its own plan when separation is required. |
| Execution Approver | Administrator, mapping to V01 Admin | Approves defined execution plans and amendments after ENG-004 confirms scope. It does not grant unrestricted administration. |

Existing roles remain unchanged. Assignment narrows authority.

## 4. Lifecycle

Draft -> Validating -> Awaiting Approval -> Approved -> Handed Off -> Running -> Exception or Monitoring -> Outcome Verification -> Completed -> Archived.

The source HumanDecision is immutable. Plan amendments never rewrite the source decision. Material scope change returns to V03 for a new or amended human decision.

## 5. Capabilities

- Decision translation: derive objectives, constraints, conditions, owners, deadlines, and prohibited actions.
- Execution planning: define work packages, dependencies, required capabilities, resources, and success criteria.
- Workflow handoff: submit approved definitions to ENG-006.
- Operations handoff: submit coordinated work context to ENG-020.
- Dispatch handoff: submit mission requests to ENG-021 without assigning personnel.
- Automation handoff: submit approved automation requests to ENG-025.
- Financial gate: require ENG-022 authorization reference before cost-bearing work.
- Communication gate: route communication requirements through ENG-023.
- Monitoring: consume execution status without becoming system of record.
- Exception intelligence: explain blockers, impact, options, and required owner.
- Adaptive proposal: recommend a plan amendment; never apply it autonomously.
- Outcome verification: compare expected and verified results and preserve learning through V02.

V1 uses explicit plans, deterministic dependencies, typed handoffs, human approvals, status aggregation, and exception proposals. Future evolution may add policy-bounded dynamic replanning while retaining human authority.

## 6. Execution Plan

ExecutionPlan contains the decision reference, objective, conditions, success criteria, owner, time horizon, risk level, and required approvals.

WorkPackage contains one accountable owner, capability requirement, input contract, output contract, deadline, and completion criteria. Dependency edges are acyclic and tenant-local.

No package starts until prerequisite gates and dependencies are satisfied.

## 7. Approval and Adaptation

ExecutionApproval is immutable and records approver, authorization, decision, rationale, and conditions. Self-approval is prohibited where the requester and approver are the same.

ExecutionAmendmentProposal records trigger, current plan hash, proposed change, impact, risk, cost, evidence, and required authority. Approved amendments create a new plan revision.

Agents, NOVA, and POPS may advise through ENG-009. They cannot approve or invoke operational execution.

## 8. Monitoring and Exceptions

ExecutionStatusReference stores owning-system identifiers, status, version, observed time, and freshness. It is not the authoritative workflow or mission state.

ExecutionException records source, category, severity, affected packages, impact, evidence, owner, and resolution status. V09 presents practical options and routes the exception to its owner.

## 9. Security

- Every entity is tenant-bound and protected by RLS.
- Composite foreign keys protect child records.
- Decisions, approvals, status observations, and verified outcomes are immutable.
- Handoffs are idempotent and destination-scoped.
- Financial, communication, dispatch, and automation authority references are mandatory where applicable.
- Cross-tenant execution and learning are prohibited.

## 10. Data Model

| Entity | Purpose |
|---|---|
| ExecutionPlan | Stable execution container |
| ExecutionPlanRevision | Immutable plan revision |
| WorkPackage | Bounded accountable work |
| WorkDependency | Acyclic package dependency |
| ExecutionGate | Required authorization or condition |
| ExecutionApproval | Immutable human approval |
| ExecutionHandoff | Idempotent owning-system request |
| ExecutionStatusReference | Read-only status observation |
| ExecutionException | Governed exception record |
| AmendmentProposal | Proposed plan revision |
| ResourceRequirement | Required capacity or resource |
| ExecutionOutcome | Human-verified result |
| ExecutionAuditEvent | Append-only lifecycle evidence |

## 11. API Inventory

| Method | Route | Purpose |
|---|---|---|
| GET, POST | /execution-plans | List or create plans |
| GET, PATCH | /execution-plans/{id} | Retrieve or edit draft plan |
| GET, POST | /execution-plans/{id}/revisions | List or create revisions |
| GET, POST | /execution-plans/{id}/work-packages | List or create packages |
| POST | /execution-plans/{id}/dependencies | Create dependency |
| DELETE | /execution-plans/{id}/dependencies/{dependencyId} | Remove draft dependency |
| GET, POST | /execution-plans/{id}/gates | List or create gates |
| POST | /execution-plans/{id}/approve | Record approval |
| POST | /execution-plans/{id}/handoffs/workflow | Handoff to ENG-006 |
| POST | /execution-plans/{id}/handoffs/operations | Handoff to ENG-020 |
| POST | /execution-plans/{id}/handoffs/dispatch | Handoff to ENG-021 |
| POST | /execution-plans/{id}/handoffs/automation | Handoff to ENG-025 |
| GET | /execution-plans/{id}/status | Aggregate status |
| GET | /execution-plans/{id}/exceptions | List exceptions |
| POST | /execution-plans/{id}/exceptions/{exceptionId}/options | Request advisory options |
| GET, POST | /execution-plans/{id}/amendments | List or propose amendments |
| POST | /amendments/{id}/approve | Approve amendment |
| POST | /execution-plans/{id}/outcomes | Record verified outcome |
| POST | /execution-plans/{id}/complete | Complete plan |
| POST | /execution-plans/{id}/archive | Archive plan |

All mutations require idempotency keys.

## 12. Migration Reference

MASS-APP-014-V09_Migration_Reference.sql defines tables, columns, foreign keys, indexes, constraints, triggers, and RLS policies.

## 13. Failure Behavior

Invalid decision authority blocks plan creation. Missing gate blocks handoff. Dependency cycles are rejected. Downstream failures retain retry-safe handoffs. Stale status is displayed as unverified. Material amendments return to human approval.

## 14. Constitutional Boundary Statement

V09 coordinates approved intent into execution contracts. It does not own workflows, operations, dispatch, finance, communications, automation, or executive authority. Owning systems execute; accountable humans approve.
