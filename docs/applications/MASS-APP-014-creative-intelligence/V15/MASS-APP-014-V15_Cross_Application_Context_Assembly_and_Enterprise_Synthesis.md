# MASS-APP-014-V15 — Cross-Application Context Assembly & Enterprise Synthesis

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-APP-014-V15 |
| Version | 1.0 |
| Status | Production Baseline v1.0 |
| Authority | EWO-MASS-APP-014-V15 |
| Date | 2026-08-03 |

## 1. Purpose

V15 assembles authorized references from multiple MASS applications, engines, and governed integrations into a traceable working picture for human decisions. It reduces fragmented understanding without becoming a shadow system of record, bypassing source permissions, or converting uncertainty into truth.

## 2. Permanent Architecture

V15 owns context requests, assembly plans, eligible-source decisions, authorization evidence, reference resolution, context snapshots, contradiction reports, completeness and confidence indicators, redaction records, synthesis packets, and retirement. Source applications own their records; ENG-009 owns AI orchestration; ENG-024 owns analytics; ENG-027 owns lineage.

Every assembly is point-in-time, cited, tenant-scoped, purpose-bound, and immutable after issuance. Refresh creates a new snapshot. Missing, stale, forbidden, and contradictory sources remain visible as metadata rather than silently omitted.

## 3. Role Mapping

| Role | Baseline Mapping | Authority |
|---|---|---|
| Context Viewer | Viewer specialization | Read authorized assemblies |
| Context Requester | Contributor specialization | Request purpose-bound context |
| Context Steward | Steward specialization | Govern plans, quality, redaction, and issuance |
| Source Liaison | Contributor extension | Resolve source metadata without granting access |
| Synthesis Approver | Administrator specialization | Issue executive synthesis packets |
| Context Administrator | Administrator specialization | Configure gateways and tenant policy |

These roles specialize APP-014 roles. Requesters cannot approve their own executive synthesis.

## 4. Platform Consumption Map

| Source | Consumption | Ownership Preserved |
|---|---|---|
| APP-001–APP-014 | Authorized record and capability references | Each application remains system of record |
| ENG-003/004/005 | Identity, authorization, events | Platform-owned |
| ENG-007/008/009 | Knowledge, documents, synthesis | Platform-owned |
| ENG-011/015 | Audit and APIs | Platform-owned |
| ENG-024/027 | Analytics, lineage, quality | Capability-owned |
| Approved integrations | Governed external references | External source remains authoritative |

Publishes `context.requested`, `context.partial`, `context.contradiction.detected`, `context.snapshot.issued`, `context.retired`.

## 5. Gateway Inventory

| Gateway | Contract | Failure Behavior |
|---|---|---|
| IdentityGateway / AuthorizationGateway | ENG-003/004 principal and decision | Deny source access; preserve denial metadata |
| ApplicationContextGateway | APP-001–014 read contracts | Mark unavailable or stale source |
| KnowledgeGateway / DocumentGateway | ENG-007/008 references | Partial assembly with cited gap |
| AIOrchestrationGateway | ENG-009 synthesis | Return unsynthesized evidence packet |
| AnalyticsGateway | ENG-024 indicators | Exclude metric and reduce completeness |
| LineageGateway | ENG-027 lineage validation | Block issuance when mandatory lineage fails |
| IntegrationGateway | Approved external adapters | No direct connector ownership in V15 |
| EventGateway / AuditGateway | ENG-005/011 | Outbox and retry-safe audit delivery |

## 6. Context Request Lifecycle

`Requested → Purpose Authorized → Sources Discovered → Eligibility Evaluated → Assembly Planned → References Resolved → Contradictions Analyzed → Redacted → Synthesized → Human Reviewed → Issued → Retired`

The request records purpose, audience, subject, time horizon, required source classes, requested freshness, and permitted sensitivity. Purpose limitation is reevaluated on refresh.

## 7. Assembly, Freshness, and Contradiction

Source eligibility requires tenant match, principal authorization, valid purpose, active gateway, and acceptable source lifecycle. Each included reference records source type, identifier, version, observed time, freshness policy, permission decision, lineage, and citation locator.

Completeness reports eligible, included, missing, forbidden, stale, failed, and contradictory source counts. Confidence is an explainable synthesis indicator based on source quality, freshness, coverage, and contradiction. It is not factual certification.

Contradictions preserve both claims, sources, timing, and scope. V15 may explain differences but only an authorized human or owning source can resolve them.

## 8. Snapshots and Synthesis Views

Snapshots are immutable point-in-time manifests of references and indicators. Executive views emphasize enterprise state, decisions required, risks, opportunities, and missing evidence. Operational views emphasize current context, dependencies, constraints, and source freshness. Both remain advisory.

NOVA synthesis and POPS historical continuity are advisory request types executed through ENG-009 and must cite the snapshot evidence.

## 9. Data Model

| Entity | Purpose | Immutable Condition |
|---|---|---|
| ContextRequest | Purpose-bound request | After authorization |
| ContextSourceProfile | Governed source contract | Versioned after activation |
| ContextAssemblyPlan | Required and optional source plan | After execution begins |
| SourceEligibilityDecision | Authorization and purpose result | Always |
| ContextReference | Resolved source reference | After snapshot issuance |
| ContextSnapshot | Point-in-time assembly | After issuance |
| ContextCitation | Evidence locator and lineage | After issuance |
| ContextContradiction | Conflicting claims | After disposition |
| ContextRedaction | Restricted-field action | Always |
| ContextIndicator | Completeness/confidence/freshness | After issuance |
| SynthesisPacket | Executive or operational view | After issuance |
| ContextAdvisoryRequest | NOVA/POPS request | After completion |
| ContextOutbox | Reliable events | After publication |

## 10. API Contracts

| Method | Path | Purpose | Role |
|---|---|---|---|
| POST/GET | `/context-requests` | Request or browse context | Requester/Viewer |
| GET | `/context-requests/{id}` | Read request status | Context Viewer |
| POST | `/context-requests/{id}/authorize` | Authorize purpose | Context Steward |
| POST | `/context-requests/{id}/assemble` | Execute assembly plan | Context Steward |
| GET | `/context-snapshots/{id}` | Read snapshot | Context Viewer |
| POST | `/context-snapshots/{id}/refresh` | Create refreshed snapshot | Context Requester |
| GET | `/context-snapshots/{id}/citations` | Read citations | Context Viewer |
| GET | `/context-snapshots/{id}/contradictions` | Read contradictions | Context Viewer |
| POST | `/context-contradictions/{id}/disposition` | Record human disposition | Synthesis Approver |
| POST | `/context-snapshots/{id}/issue` | Issue immutable snapshot | Context Steward |
| POST | `/synthesis-packets/{id}/issue` | Issue synthesis packet | Synthesis Approver |
| POST | `/context-advisory-requests` | Request NOVA/POPS synthesis | Context Steward |

## 11. Security and Failure Behavior

RLS uses tenant identity from `auth.jwt()`. Source authorization is checked during discovery, resolution, snapshot read, and citation expansion. Restricted fields are redacted before persistence in a synthesis packet. Immutable snapshots, citations, eligibility decisions, redactions, issued packets, dispositions, and completed advisory outputs are database-enforced.

Unavailable sources produce partial context. Forbidden sources are counted without revealing content. Stale sources remain labeled. Failed synthesis returns the evidence manifest. Duplicate assembly and refresh operations use idempotency keys.

Implementation-grade schema is in `MASS-APP-014-V15_Migration_Reference.sql`.

## 12. V1 Implementation

V1 supports configured source profiles, explicit assembly plans, authorization checks, reference manifests, freshness policies, contradictions, redaction, completeness and confidence indicators, immutable snapshots, executive/operational packets, and governed NOVA/POPS synthesis.

## 13. Future Evolution

Additional application gateways, richer temporal synthesis, privacy-preserving external federation, and expanded contradiction analysis attach through existing gateway and snapshot contracts. No future capability may create a universal shadow database.

## 14. Constitutional Boundary Statement

V15 assembles context; it does not own, alter, approve, or execute source truth. It cannot override permissions, resolve factual or policy conflict without human authority, or represent incomplete information as certainty.

