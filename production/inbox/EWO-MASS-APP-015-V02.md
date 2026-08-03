# ENGINEERING WORK ORDER
## EWO-MASS-APP-015-V02

**Project:** MASS

**Application:** APP-015 — Plugin & Capability Framework

**Volume:** V02

**Title:** Plugin Lifecycle, Installation & Dependency Management

**Status:** Approved for Manufacturing

**Target:** Production Baseline v1.0

## Mission

Manufacture the governed lifecycle architecture responsible for installing, activating, suspending, upgrading, rolling back, disabling, and removing plugins while preserving tenant isolation, compatibility, traceability, and human authority.

V02 shall convert a validated plugin package into a controlled tenant installation without allowing hidden dependencies, silent privilege expansion, or irreversible state changes.

## Required Scope

Define:

- Installation request lifecycle
- Eligibility and compatibility checks
- Tenant installation records
- Environment and application prerequisites
- Dependency graph resolution
- Required, optional, peer, and conflicting dependencies
- Version negotiation and compatibility ranges
- Conflict detection and resolution recommendations
- Installation plans and approval gates
- Activation and suspension
- Upgrade, downgrade, rollback, and repair
- Configuration migration
- Data migration ownership boundaries
- Health and readiness checks
- License and entitlement references
- Installation evidence and provenance
- Partial-failure handling
- Recovery and safe removal
- Orphaned dependency handling
- Deprecation and end-of-support handling
- Organization-wide versus scoped installations
- Plugin state machine
- Lifecycle events and audit history

## Platform Consumption

Consume:

- APP-015 V01 plugin manifests and capability registry
- ENG-003 identity
- ENG-004 authorization
- ENG-005 events
- ENG-006 workflow
- ENG-011 audit and observability
- ENG-012 configuration
- ENG-015 API contracts
- ENG-016 deployment and environment contracts
- ENG-018 licensing and entitlement contracts where available
- ENG-027 information lineage
- APP-021 administration contracts when available
- APP-022 security and governance contracts when available

Produce:

- Installation plans
- Dependency resolution results
- Installation and activation records
- Upgrade and rollback plans
- Health findings
- Lifecycle events
- Removal and recovery records
- Advisory recommendations only where human approval is required

## Human Authority

V02 may validate, plan, compare, recommend, install when authorized, activate when authorized, suspend when authorized, and record lifecycle evidence.

V02 shall never:

- Expand permissions beyond the approved manifest and tenant grant
- Install undeclared dependencies
- Activate a plugin without required approval
- Remove data owned by another application or engine
- Hide failed lifecycle operations
- Bypass licensing, security, privacy, or policy controls
- Allow a plugin to approve its own installation or upgrade

## Required Deliverables

1. Production Markdown
2. Production PDF
3. Mermaid Architecture Diagram
4. Folder Structure
5. API Inventory
6. Data Model
7. Migration Reference SQL
8. Plugin Lifecycle State Machine
9. Dependency Resolution Rules
10. Installation and Rollback Contract Examples
11. Build Manifest Update
12. Revision Log Update
13. Manufacturing Completion Report

## Manufacturing Standards

Include:

- Document Control
- Role Mapping
- Platform Consumption Map
- Permanent Architecture vs V1 Implementation
- Constitutional Boundary Statement
- Complete gateway inventory
- Migration Reference SQL reference
- Complete Folder Structure
- `DEFAULT gen_random_uuid()` on all UUID primary keys
- `UNIQUE(id, tenant_id)` on all tenant-owned tables
- `auth.jwt()`-based RLS policies
- Composite tenant-safe foreign keys
- Database enforcement for immutable approvals, lifecycle decisions, version records, rollback evidence, and audit records
- Idempotent install, activate, suspend, upgrade, rollback, and remove operations
- Explicit partial-failure and recovery behavior

## Production Constraints

Do not duplicate deployment-engine ownership.

Do not define runtime capability invocation; that belongs to V03.

Do not build the marketplace storefront.

Do not allow installation to imply execution authority.

Label the package:

**Production Baseline v1.0**

## Manufacturing Authority

Move the work order through:

`production/inbox → production/active → production/review`

Manufacture, validate, synchronize, and continue production unless Executive Authority orders a pause.
