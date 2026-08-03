# ENGINEERING WORK ORDER
## EWO-MASS-APP-014-V15

**Project:** MASS

**Application:** APP-014 — Creative & Knowledge Intelligence

**Volume:** V15

**Title:** Cross-Application Context Assembly & Enterprise Synthesis

**Status:** Approved for Manufacturing

**Target:** Production Baseline v1.0

## Mission

Manufacture the governed intelligence responsible for assembling authorized context from multiple MASS applications, engines, records, and external systems into a single traceable working picture for human decision-making.

V15 shall reduce fragmented executive understanding without creating a shadow system of record, bypassing source permissions, or silently merging contradictory information.

## Required Scope

Define:

- Context request lifecycle
- Source discovery and eligibility
- Context assembly plans
- Source authorization checks
- Cross-application reference resolution
- Freshness and staleness handling
- Contradiction detection
- Confidence and completeness indicators
- Context snapshots
- Executive and operational synthesis views
- Citation and lineage preservation
- Tenant isolation
- Restricted-field redaction
- Missing-source and partial-context behavior
- Context refresh and retirement
- NOVA synthesis advisory
- POPS historical continuity contribution

## Platform Consumption

Consume authorized references from:

- APP-001 through APP-014 where available
- ENG-003 and ENG-004 identity and authorization
- ENG-005 events
- ENG-007 knowledge
- ENG-008 documents
- ENG-009 AI orchestration
- ENG-011 audit and observability
- ENG-015 API contracts
- ENG-024 analytics
- ENG-027 information lineage
- Approved external integrations through governed gateways

Produce:

- Traceable context assemblies
- Evidence-backed synthesis packets
- Completeness and confidence indicators
- Contradiction reports
- Executive and operational context briefs
- Advisory context only

## Human Authority

V15 may assemble, compare, explain, summarize, and identify missing or conflicting information.

V15 shall never:

- Alter source records
- Override source permissions
- Resolve policy or factual conflicts without human authority
- Convert uncertain information into asserted truth
- Approve decisions
- Execute downstream work

## Required Deliverables

1. Production Markdown
2. Production PDF
3. Mermaid Architecture Diagram
4. Folder Structure
5. API Inventory
6. Data Model
7. Migration Reference SQL
8. Build Manifest Update
9. Revision Log Update
10. Manufacturing Completion Report

## Manufacturing Standards

Include:

- Document Control
- Role Mapping
- Platform Consumption Map
- Permanent Architecture vs V1 Implementation
- Constitutional Boundary Statement
- Gateway inventory for every consumed service
- Migration Reference SQL reference
- Complete Folder Structure
- `DEFAULT gen_random_uuid()` on all primary keys
- `UNIQUE(id, tenant_id)` on all tenant-owned tables
- `auth.jwt()`-based RLS policies
- Composite tenant-safe foreign keys
- Database enforcement for immutable snapshots, citations, approvals, and audit records
- Explicit partial-context and failure behavior

## Production Constraints

Do not duplicate source ownership held by other applications or engines.

Do not create a universal shadow database.

Do not redesign prior APP-014 volumes.

Label the package:

**Production Baseline v1.0**

## Manufacturing Authority

Move the work order through:

`production/inbox → production/active → production/review`

Manufacture, validate, synchronize, and continue production unless Executive Authority orders a pause.
