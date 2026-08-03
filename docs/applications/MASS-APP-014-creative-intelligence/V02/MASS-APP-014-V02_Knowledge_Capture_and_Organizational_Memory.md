# MASS-APP-014-V02 - Knowledge Capture & Organizational Memory

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-APP-014-V02 |
| Version | 1.0 |
| Status | Production Baseline |
| Authority | EWO-MASS-APP-014-V02 |
| Date | 2026-08-02 |

## 1. Purpose and Scope

This volume defines the subsystem that captures organizational evidence and preserves it as traceable organizational memory. It converts notes, decisions, conversations, meetings, and document references into governed memory records without replacing authoritative sources.

APP-014-V02 owns capture coordination, memory assembly, confidence assessments, citations, inheritance rules, and application-level retrieval. ENG-007 remains the enterprise knowledge system of record and search provider. ENG-008 owns document persistence. ENG-009 owns AI orchestration.

The subsystem shall capture approved evidence, preserve immutable revisions, relate memories, attach citations, record transparent confidence evidence, apply explicit inheritance, synchronize with ENG-007, and provide governed NOVA and POPS advisory interactions.

It shall not own document binaries, enterprise search infrastructure, AI providers, executive authority, source records, cross-tenant learning, or autonomous decisions.

## 2. Platform Consumption Map

| Dependency | Consumed capability | Delegated responsibility |
|---|---|---|
| ENG-002 | Tenant context and lifecycle contracts | Platform lifecycle |
| ENG-003 | Authenticated principal | Authentication |
| ENG-004 | Authorization decisions | Security policy |
| ENG-005 | Lifecycle events | Event transport and delivery |
| ENG-007 | Index, search, retrieve, archive | Knowledge repository and search |
| ENG-008 | Document and revision references | Document persistence |
| ENG-009 | Governed NOVA and POPS execution | Providers, prompts, tools, guardrails |
| ENG-011 | Logs, metrics, traces, audit | Enterprise observability |
| ENG-012 | Repository and transaction conventions | Persistence infrastructure |
| ENG-013 | Standard errors | Error governance |
| ENG-015 | API conventions and versioning | API infrastructure |
| APP-013 | Read-only design artifacts | Design artifact stewardship |
| APP-014-V01 | Workspaces, sessions, contextual references | Creative intelligence foundation |

Owned responsibilities are capture envelopes, validation, memory records and revisions, citations, relationships, confidence assessments, inheritance, index synchronization state, and NOVA/POPS advisory requests.

Delegated responsibilities are authoritative knowledge and indexing to ENG-007, documents to ENG-008, AI execution to ENG-009, source entities to originating applications, and authentication and authorization to ENG-003 and ENG-004.

Published events: knowledge.capture.created, knowledge.capture.validated, organizational.memory.preserved, organizational.memory.superseded, organizational.memory.archived, organizational.memory.confidence.assessed, organizational.memory.index.requested, organizational.memory.source.stale.

Consumed events: enterprise.document.archived, enterprise.document.deleted, design.publication.archived, design.content.archived, knowledge.index.completed, knowledge.index.failed.

## 3. Architecture

The Capture Service accepts typed evidence, verifies source access, and records a capture envelope. Validation prepares a memory candidate. Preservation creates an immutable revision, citations, and initial confidence evidence in one transaction. The Index Gateway submits the revision to ENG-007. Retrieval delegates ranking to ENG-007, reapplies APP-014 authorization, and returns citations and confidence with every result.

## 4. Knowledge Capture Pipeline

1. Receive a typed capture request and idempotency key.
2. Resolve tenant and authenticated principal.
3. Authorize every referenced source.
4. Validate capture-type fields and source lifecycle.
5. Store the capture envelope and participants.
6. Assemble a memory candidate without mutating source content.
7. Resolve citations and initial confidence evidence.
8. Require an authorized preservation action.
9. Create revision, citations, and confidence transactionally.
10. Request ENG-007 indexing and track the result.

| Capture type | Required evidence |
|---|---|
| Note | Body, author, captured timestamp |
| Decision | Statement, decision maker, effective date, rationale or recorded absence |
| Conversation | Conversation reference, participants, timestamp, bounded excerpt or transcript reference |
| Meeting | Title, participants, start time, notes or source document, recorded outcomes |
| Document | Document ID, revision ID, locator, checksum or authoritative version marker |

Capture states are draft, pending_validation, validated, preserved, rejected, and archived. Rejection records a reason and does not delete evidence.

## 5. Organizational Memory Architecture

Lifecycle: Captured -> Validating -> Preserved -> Superseded -> Archived. Rejected branches from validation.

A preserved revision is immutable. Correction creates a new revision and supersedes the prior revision. Archival removes memory from default retrieval while retaining citations, history, and audit evidence.

A MemoryCollection defines an authorized organizational scope: organization, department, team, project, workspace, or session. Scope references are tenant-bound and validated. Collections do not recreate source-application hierarchies.

Relationship types are supports, contradicts, supersedes, clarifies, derived_from, and related_to. Both endpoints must share a tenant. Relationships provide context and never create authoritative enterprise relationships.

## 6. Citation and Reference Model

Every preserved factual memory shall have at least one citation unless classified uncited_observation. A citation records source type, identifier, revision, locator, authorized excerpt, checksum or version marker, access classification, and verification time.

Source deletion or archival never rewrites memory. Citation state becomes stale, archived, or unavailable. Retrieval exposes that state. Re-verification creates new verification evidence or a new memory revision.

Polymorphic source references are service-validated because one foreign key cannot span source-owned tables. Validation requires matching tenant, readable lifecycle state, and current authorization.

## 7. Knowledge Confidence

Confidence is evidence of reliability, not truth. Assessments are append-only and score source authority, corroboration, recency, completeness, and human verification from 0-20 each. The record includes total score, band, assessor, rationale, evidence, and timestamp.

Bands are 0-19 unverified, 20-39 low, 40-59 moderate, 60-79 high, and 80-100 verified. Verified requires human evidence; automation cannot grant it. NOVA and POPS may recommend values through ENG-009, but only an authorized action records an assessment.

## 8. Memory Inheritance

Inheritance is explicit, directional, and tenant-local. A rule identifies parent collection, child collection, classification, and mode:

- inherit: eligible parent memories may appear in the child scope;
- override: a child memory supersedes a named inherited memory in that scope;
- block: a named classification or memory is excluded.

Retrieval applies direct memories, inherited memories, overrides, blocks, sensitivity policy, and authorization in that order. Inheritance never bypasses ENG-004 and never crosses tenants.

## 9. Search and Index Strategy

APP-014 does not implement a search engine. Preservation submits permitted revision content, citations, scope, and security metadata to ENG-007. MemoryIndexState records pending, indexed, failed, or removed; the ENG-007 identifier; attempts; and error state.

Search delegates to ENG-007. APP-014 then verifies tenant, collection visibility, source restrictions, and inheritance. Results include revision identity, citation state, confidence, and index freshness. Index failure is retryable through ENG-005 and never loses preserved memory.

## 10. NOVA and POPS Interaction

NOVA may suggest summaries, classifications, relationships, citation gaps, and confidence inputs. POPS may identify stewardship, retention, sensitivity, unresolved-decision, and institutional-continuity concerns.

All requests execute through ENG-009. Responses are advisory, retain interaction references, and cannot preserve, supersede, archive, or disclose memory autonomously.

## 11. Security Boundaries

- Every tenant-owned table contains tenant_id and concrete Row Level Security.
- Parent-child relationships use composite (id, tenant_id) foreign keys.
- Polymorphic sources require service-level tenant and authorization validation.
- Preserved revisions, citations, and confidence assessments are database-immutable.
- Retrieval reauthorizes memory scope and cited source access.
- Sensitive excerpts may be omitted while preserving locator and integrity marker.
- Cross-tenant inheritance, indexing, relationships, and AI context are prohibited.

Concrete policy requirement:

    ALTER TABLE memory_record ENABLE ROW LEVEL SECURITY;
    CREATE POLICY memory_record_tenant_select ON memory_record
    FOR SELECT USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
    CREATE POLICY memory_record_tenant_write ON memory_record
    FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

Equivalent policies are required on every V02 tenant table. Service-role access is restricted to governed indexing and lifecycle handlers.

## 12. Data Model

| Entity | Purpose | Integrity |
|---|---|---|
| MemoryCollection | Organizational scope | Tenant composite key and scope validation |
| CaptureRecord | Typed evidence envelope | Tenant idempotency key; immutable after preservation |
| CaptureParticipant | Participant and role | Composite capture FK |
| CaptureSourceReference | Authoritative source locator | Non-null context; source authorization |
| MemoryRecord | Stable memory identity | Composite collection and capture FKs |
| MemoryRevision | Immutable snapshot | Unique memory revision; preservation trigger |
| MemoryCitation | Revision evidence | Direct revision FK; immutability trigger |
| MemoryRelationship | Memory context | Same-tenant endpoint FKs; no self-link |
| MemoryInheritanceRule | Scope visibility rule | Same-tenant collections; cycle prevention |
| MemoryConfidenceAssessment | Reliability evidence | Direct revision FK; score checks; append-only |
| MemoryIndexState | ENG-007 synchronization | One current state per revision |
| MemoryTag | Tenant memory tag | Unique normalized tag per memory |

All parent tables declare UNIQUE (id, tenant_id). Children carry tenant_id and composite foreign keys. Citations, confidence, and index state reference memory_revision.id directly. Reference context is NOT NULL DEFAULT ''.

Database triggers reject mutation of preserved revisions and citations, reject confidence mutation, prevent inheritance cycles, and prevent self-relationships.

## 13. API Contracts

| Method | Route | Purpose |
|---|---|---|
| GET, POST | /memory-collections | List or create collections |
| GET, PATCH | /memory-collections/{id} | Retrieve or update collection |
| GET, POST | /captures | List or create captures |
| GET, PATCH | /captures/{id} | Retrieve or edit eligible capture |
| POST | /captures/{id}/validate | Validate source and structure |
| POST | /captures/{id}/reject | Reject with reason |
| POST | /captures/{id}/preserve | Preserve memory revision |
| POST | /captures/{id}/archive | Archive capture |
| GET | /memories | List accessible memories |
| GET | /memories/{id} | Retrieve memory |
| GET, POST | /memories/{id}/revisions | List or create revisions |
| POST | /memories/{id}/archive | Archive memory |
| POST | /memories/{id}/restore | Restore memory |
| POST | /memory-search | Search through ENG-007 |
| GET | /memories/{id}/citations | Retrieve citations |
| POST | /memories/{id}/relationships | Create relationship |
| DELETE | /memories/{id}/relationships/{relationshipId} | Remove relationship |
| GET | /memories/{id}/confidence | Retrieve confidence history |
| POST | /memories/{id}/confidence-assessments | Record assessment |
| GET, POST | /memory-inheritance-rules | List or create rules |
| PATCH, DELETE | /memory-inheritance-rules/{id} | Update or disable rule |
| POST | /memories/{id}/nova-advisory | Request NOVA advisory |
| POST | /memories/{id}/pops-review | Request POPS advisory |

Preservation requires an idempotency key. Repeated successful calls return the existing revision. Failure cannot leave a partial revision.

## 14. Folder Structure

V02 adds capture, memory, citations, confidence, inheritance, search, and advisory feature modules. Controllers own HTTP coordination, services own rules, repositories consume ENG-012, and gateways alone call ENG-007, ENG-009, APP-013, NOVA, or POPS contracts.

The complete structure is supplied in MASS-APP-014-V02_Folder_Structure.txt.

## 15. Failure Behavior

- Invalid or inaccessible source: reject validation and preserve nothing.
- Duplicate capture key: return the existing capture.
- Preservation failure: roll back revision, citations, confidence, and index request.
- ENG-007 unavailable: preserve memory, mark indexing failed, retry via ENG-005.
- Source unavailable later: mark citation stale and retain history.
- ENG-009 unavailable: fail the advisory only; memory remains unchanged.
- Inheritance cycle: reject the rule.
- Authorization change: immediately affect retrieval without rewriting history.

## 16. Example Flows

Meeting decision: capture meeting and ENG-008 notes reference; validate tenant, source, and fields; select a decision; preserve revision, citations, and confidence; index through ENG-007; retrieve with evidence.

NOVA advisory: request citation-gap analysis; compose authorized context; execute through ENG-009; store advisory reference without changing memory; allow an authorized user to create a correction revision.

## 17. Migration Sequence

V02 continues after V01: 014 memory collections; 015 capture records; 016 capture participants; 017 capture source references; 018 memory records; 019 memory revisions; 020 memory citations; 021 memory relationships; 022 memory inheritance rules; 023 confidence assessments; 024 index states; 025 memory tags; 026 composite constraints and indexes; 027 concrete RLS policies; 028 immutability and integrity triggers.

Migrations are forward-only and repository-controlled.

## 18. Acceptance Verification

- Capture types and validation are explicit.
- Preserved revisions and evidence are database-immutable.
- Search and knowledge authority remain with ENG-007.
- AI execution remains with ENG-009.
- APP-013 entities are referenced, not duplicated.
- Confidence is transparent evidence rather than autonomous truth.
- Inheritance is explicit, authorized, and tenant-local.
- Citations retain source traceability and stale status.
- RLS and composite tenant constraints are actionable.
- NOVA and POPS remain advisory.

## 19. Constitutional Boundary Statement

APP-014-V02 preserves organizational memory; it does not become the authority for the enterprise facts it cites. It does not own documents, design artifacts, source applications, enterprise relationships, analytical calculation, AI orchestration, executive judgment, or security policy. It consumes those capabilities through governed interfaces and preserves their ownership boundaries.
