# MASS-APP-014-V10 — Knowledge Discovery & Enterprise Search

Version: 1.0  
Status: Production Baseline  
Authority: EWO-MASS-APP-014-V10

## 1. Purpose

V10 provides explainable, context-aware discovery across governed organizational knowledge. It retrieves references from authoritative systems without becoming their system of record, changing source content, or bypassing source authorization.

## 2. Architectural Boundary

V10 owns discovery sessions, query interpretation, source selection, result assembly, ranking evidence, citations, saved searches, and user feedback. ENG-007 owns enterprise knowledge; ENG-009 owns AI orchestration; ENG-015 governs APIs; ENG-024 owns enterprise analytics; APP-013 owns design artifacts. V10 neither copies these responsibilities nor performs autonomous action.

## 3. Platform Consumption Map

| Consumes | Use |
|---|---|
| ENG-003 / ENG-004 | Identity, tenant context, authorization |
| ENG-005 | Discovery lifecycle events |
| ENG-007 | Governed knowledge retrieval |
| ENG-009 | Query interpretation and synthesis |
| ENG-011 | Audit and observability |
| ENG-015 | API contracts |
| ENG-024 | Approved analytical references |
| ENG-027 | Information lineage and ontology context |
| APP-013 | Read-only artifact references |
| APP-014 V01–V04, V08–V09 | Sessions, memory, reasoning, agents, communication and execution context |

Published events: `discovery.started`, `discovery.completed`, `discovery.failed`, `saved-search.created`, `search-feedback.recorded`. Consumed events invalidate stale source snapshots without modifying the source.

## 4. Role Mapping

| V10 role | Baseline mapping | Authority |
|---|---|---|
| Search Viewer | Viewer specialization | Run searches and inspect authorized results |
| Search Contributor | Contributor specialization | Save searches and submit relevance feedback |
| Discovery Steward | Steward specialization | Govern source profiles, ranking policies, and review quality |
| Discovery Administrator | Administrator specialization | Configure tenant discovery controls and audit access |

These roles extend through specialization; they do not replace APP-014 baseline roles.

## 5. Capability Model

### Query Intake
Accepts natural-language or structured queries with tenant, user, filters, and optional session context. Outputs an immutable query record and correlation identifier.

### Source Resolution
Selects only registered, active sources the principal may access. Every result remains linked to its source type, source identifier, version, and observed timestamp.

### Retrieval and Ranking
Combines lexical, metadata, and governed semantic signals. Ranking records preserve signal contributions so ordering can be explained. V1 supports configurable weighted ranking; future models may improve ranking without changing result contracts.

### Synthesis and Citation
ENG-009 may summarize retrieved evidence. Each synthesized statement must retain citations to accessible source records. Unsupported conclusions are marked uncertain rather than presented as fact.

### Feedback and Saved Discovery
Users may save query definitions and record relevance feedback. Feedback informs tenant-local tuning only and never creates cross-tenant learning.

## 6. Discovery Lifecycle

`Received → Authorized → Resolved → Retrieved → Ranked → Synthesized → Delivered → Preserved`

Failures terminate with a governed error and audit event. Partial results identify unavailable sources and never silently imply completeness.

## 7. Data Model

| Entity | Responsibility |
|---|---|
| DiscoverySession | Tenant-scoped discovery context |
| SearchQuery | Immutable submitted query |
| SearchSource | Governed source registration |
| QuerySource | Sources selected for a query |
| SearchResult | Ranked source reference |
| ResultCitation | Evidence location and lineage |
| RankingExplanation | Signal contribution record |
| SavedSearch | Reusable query definition |
| SearchFeedback | User relevance assessment |
| SearchAudit | Security-relevant discovery history |

All tenant-owned foreign keys use tenant-safe composite relationships. Polymorphic source identifiers require application validation against the registered source adapter and current authorization.

## 8. API Contracts

| Method | Path | Purpose |
|---|---|---|
| POST | `/discovery/search` | Execute governed discovery |
| GET | `/discovery/queries/{id}` | Retrieve query and status |
| GET | `/discovery/queries/{id}/results` | Retrieve ranked results |
| GET | `/discovery/results/{id}/citations` | Retrieve evidence citations |
| GET | `/discovery/sources` | List authorized source profiles |
| POST | `/saved-searches` | Save a query definition |
| GET | `/saved-searches` | Browse saved searches |
| PATCH | `/saved-searches/{id}` | Update owned saved search |
| DELETE | `/saved-searches/{id}` | Soft-delete saved search |
| POST | `/discovery/results/{id}/feedback` | Record relevance feedback |
| GET | `/discovery/audit/{queryId}` | Steward audit view |

Search submission accepts an idempotency key. Repeated requests return the original query. Forbidden sources are omitted and recorded in the audit without disclosing their content.

## 9. Security and Integrity

- RLS applies to every tenant-owned table.
- Source authorization is evaluated at query time and result-read time.
- Search results contain references and permitted excerpts, not an uncontrolled shadow repository.
- Citations are immutable after query completion.
- Feedback cannot alter source truth or ranking history.
- Deleted or archived sources remain historically cited but are unavailable for fresh retrieval.

Implementation-grade definitions are in `MASS-APP-014-V10_Migration_Reference.sql`.

## 10. Failure Behavior

Unavailable sources yield explicit partial-completion metadata. Failed synthesis returns ranked evidence without synthesis. Authorization changes suppress inaccessible results on subsequent reads. Retry applies only to safe retrieval operations and does not duplicate queries.

## 11. V1 and Future Evolution

V1 implements tenant-scoped source registration, governed query execution, deterministic ranking configuration, citation-preserving synthesis, saved searches, and feedback. Future ranking refinement, richer federated discovery, and additional adapters attach through existing source and ranking contracts; they are not V1 requirements.

## 12. Constitutional Boundary Statement

V10 discovers and explains authorized enterprise knowledge. It does not own knowledge, documents, analytics, relationships, decisions, workflows, communication delivery, or source-system mutation. Human users retain interpretive and decision authority.

