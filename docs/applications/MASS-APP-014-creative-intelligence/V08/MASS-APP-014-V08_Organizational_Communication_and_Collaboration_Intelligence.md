# MASS-APP-014-V08 - Organizational Communication & Collaboration Intelligence

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-APP-014-V08 |
| Version | 1.0 |
| Status | Production Baseline |
| Authority | EWO-MASS-APP-014-V08 |
| Date | 2026-08-03 |

## 1. Purpose

V08 defines the communication-intelligence room that converts authorized organizational context into coordinated communication intent, responsibility, collaboration, and downstream execution handoffs.

V08 does not select relationship recipients, govern consent, create final communication assets, deliver messages, or replace human authority.

## 2. Responsibility Boundary

| Owner | Responsibility |
|---|---|
| APP-014-V08 | Communication objective, context package, responsibility assignment, collaboration record, intelligence recommendation, governed handoff |
| Relationship Command | Recipient identity, relationship purpose, timing, relationship intelligence |
| APP-013-V06 | Communication content creation and approval |
| ENG-023 Communications | Communication policy, intent governance, channel coordination |
| ENG-010 Notification Engine | Transport, retries, delivery status |
| ENG-009 | NOVA, POPS, and AI advisory execution |

V08 publishes communication.intelligence.plan.ready, communication.responsibility.assigned, communication.collaboration.completed, and communication.handoff.created. It consumes decision.human.recorded, organizational.memory.preserved, communication.delivery.updated, and relationship.context.updated.

## 3. Role Mapping

V08 roles extend the APP-014 hierarchy and do not replace it.

| V08 role | Baseline | Specialized authority |
|---|---|---|
| Communication Owner | Steward, extending V01 Editor | Owns assigned communication-intelligence cases, context, collaboration, responsibility assignments, and eligible handoffs. |
| Communication Approver | Administrator, mapping to V01 Admin | Approves a defined communication plan or handoff after ENG-004 confirms scope. It does not grant tenant-wide administration. |

Viewer, Contributor, Steward, and Administrator retain prior definitions. Assignment narrows rather than expands authority.

## 4. Architecture and Lifecycle

Lifecycle: Draft -> Context Assembly -> Collaboration -> Ready for Approval -> Approved -> Handed Off -> Feedback Received -> Closed -> Archived.

Inputs are approved decisions, enterprise memory, relationship context, communication policy, intended outcomes, constraints, and urgency. Outputs are communication plans, message briefs, responsibility maps, collaboration evidence, approved handoffs, and feedback records.

V1 implements explicit cases, human assignments, structured context, asynchronous collaboration, approval gates, and typed handoffs. Future evolution may add communication-pattern recommendations and richer collaboration assistance without changing ownership.

## 5. Core Capabilities

- Communication framing: define objective, intended outcome, urgency, sensitivity, and success criteria.
- Context preservation: bind decisions, memory, source documents, relationship context, and policy references.
- Responsibility intelligence: identify accountable owner, contributors, reviewers, and downstream owner.
- Collaboration: preserve contributions, disagreements, decisions, and unresolved questions.
- Message briefing: prepare an approved brief for APP-013-V06 without writing final content.
- Channel recommendation: advisory recommendation consumed by ENG-023; never delivery authorization.
- NOVA advisory: enterprise context and consequence analysis through ENG-009.
- POPS advisory: stewardship, responsibility, continuity, and policy analysis through ENG-009.
- Feedback learning: preserve verified delivery and response outcomes through V02.

## 6. Collaboration Model

CollaborationThread is bound to one case. Contributions are append-only and identify author, role, source references, position, and timestamp. A Resolution records the human-approved conclusion and dissent.

No AI participant may close a thread, approve a plan, assign itself responsibility, or create a delivery instruction. NOVA and POPS remain advisory request types.

## 7. Handoff Contracts

Content handoff to APP-013-V06 contains objective, audience class reference, context, constraints, required sections, tone guidance, legal notes, approvers, and source citations.

Governance handoff to ENG-023 contains approved content reference, intended channel, relationship-purpose reference, policy context, urgency, and authorization record.

Delivery remains outside V08. Delivery feedback is read-only and may update case outcomes.

## 8. Security

- All entities contain tenant_id and use RLS.
- Child records use composite tenant foreign keys.
- Recipient identifiers are references owned by Relationship Command.
- Context access cannot exceed the most restrictive source.
- Approval decisions and collaboration resolutions are immutable.
- Self-approval is prohibited.
- Cross-tenant collaboration and learning are prohibited.

## 9. Data Model

| Entity | Purpose |
|---|---|
| CommunicationCase | Stable intelligence container |
| CommunicationObjective | Revisioned objective and outcome |
| CommunicationContext | Authorized context package |
| ContextReference | Read-only source reference |
| ResponsibilityAssignment | Accountable and contributing roles |
| CommunicationPlan | Governed coordination plan |
| MessageBrief | APP-013-V06 content brief |
| CollaborationThread | Case discussion boundary |
| CollaborationContribution | Append-only participant contribution |
| CollaborationResolution | Immutable human resolution |
| CommunicationApproval | Immutable approval decision |
| CommunicationHandoff | Idempotent downstream handoff |
| CommunicationFeedback | Verified downstream outcome |

## 10. API Inventory

| Method | Route | Purpose |
|---|---|---|
| GET, POST | /communication-cases | List or create cases |
| GET, PATCH | /communication-cases/{id} | Retrieve or edit case |
| POST | /communication-cases/{id}/archive | Archive case |
| GET, POST | /communication-cases/{id}/objectives | List or revise objective |
| GET, POST | /communication-cases/{id}/contexts | List or create context |
| GET, POST | /communication-cases/{id}/responsibilities | List or assign responsibility |
| GET, POST | /communication-cases/{id}/plans | List or create plan |
| GET, POST | /communication-cases/{id}/briefs | List or create message brief |
| GET, POST | /communication-cases/{id}/threads | List or create threads |
| POST | /threads/{id}/contributions | Add contribution |
| POST | /threads/{id}/resolve | Record human resolution |
| POST | /communication-cases/{id}/nova-advisory | Request NOVA |
| POST | /communication-cases/{id}/pops-advisory | Request POPS |
| POST | /communication-cases/{id}/approve | Record approval |
| POST | /communication-cases/{id}/handoffs/content | Hand off to APP-013-V06 |
| POST | /communication-cases/{id}/handoffs/governance | Hand off to ENG-023 |
| GET | /communication-cases/{id}/feedback | Retrieve downstream feedback |
| POST | /communication-cases/{id}/close | Close case |

Mutations require idempotency keys. Failed handoffs preserve approved case state for retry.

## 11. Folder Structure

V08 adds communication-cases, context, responsibilities, plans, briefs, collaboration, approvals, handoffs, and feedback. Gateways alone call Relationship Command, APP-013-V06, ENG-023, ENG-010, ENG-009, and V02.

## 12. Migration Reference

MASS-APP-014-V08_Migration_Reference.sql defines all tables, columns, foreign keys, indexes, constraints, triggers, and RLS policies. It is the implementation contract for V08 migrations.

## 13. Failure Behavior

Inaccessible context is rejected. Missing responsibility blocks approval. Conflicting contributions remain visible. Unauthorized approval is rejected. Downstream unavailability leaves an idempotent pending handoff. Delivery failure never rewrites the approved plan.

## 14. Constitutional Boundary Statement

V08 coordinates communication intelligence and collaboration. It does not own relationships, recipients, consent, final content, communication policy, transport, or delivery. Those responsibilities remain with their constitutional and engineering owners.
