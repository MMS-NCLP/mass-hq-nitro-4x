# ENGINEERING WORK ORDER
## EWO-MASS-APP-015-V01

**Project:** MASS

**Application:** APP-015 — Plugin & Capability Framework

**Volume:** V01

**Title:** Plugin Foundation, Manifest & Capability Registration

**Status:** Approved for Manufacturing

**Target:** Production Baseline v1.0

## Mission

Manufacture the foundational architecture that allows MASS to recognize, describe, register, validate, and expose installable capabilities without modifying the platform core.

This volume formalizes the original MASS plugin concept as a governed equivalent to installable AI skills: versioned, tenant-aware, permission-bound, discoverable, traceable, and callable only through approved contracts.

## Required Scope

Define:

- Plugin identity and canonical naming
- Plugin manifest schema
- Capability declarations
- Capability categories and tags
- Inputs, outputs, errors, and side-effect declarations
- Tool, workflow, agent, template, knowledge, dashboard, form, event, and integration capability types
- Publisher and ownership metadata
- Version and compatibility metadata
- Required and optional dependencies
- Entry points and invocation contracts
- Human approval requirements
- Tenant applicability and installation eligibility
- Capability discovery and registry
- Validation states
- Manifest signing and provenance references
- Documentation and support metadata
- Deprecation and replacement references
- Internal, organization, partner, and third-party plugin classifications

## Platform Consumption

Consume:

- MASS Constitution
- ENG-001–ENG-027
- MASS-PLAN-001
- APP-013 Design Studio artifact contracts
- APP-014 intelligence and advisory contracts
- APP-021 administration contracts when available
- APP-022 security and governance contracts when available

Produce:

- Canonical plugin manifest
- Plugin and capability registry
- Validation findings
- Capability discovery records
- Invocation contract references
- Installation eligibility findings

## Human Authority

APP-015 V01 may validate, classify, register, expose, and recommend.

It shall never:

- Install or activate a plugin without authorized action
- Grant permissions beyond an approved scope
- Allow a plugin to approve itself
- Treat publisher claims as verified evidence
- Invoke undeclared capabilities
- Bypass application, engine, tenant, security, or executive authority

## Required Deliverables

1. Production Markdown
2. Production PDF
3. Mermaid Architecture Diagram
4. Folder Structure
5. API Inventory
6. Data Model
7. Migration Reference SQL
8. Plugin Manifest JSON Schema
9. Capability Type Registry
10. Build Manifest Update
11. Revision Log Update
12. Manufacturing Completion Report

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
- `UNIQUE(id, tenant_id)` on tenant-owned tables
- `auth.jwt()`-based RLS policies
- Composite tenant-safe foreign keys
- Immutable enforcement for signed manifests, published versions, validation decisions, and audit evidence
- Machine-readable manifest examples
- Clear distinction among plugin, capability, pack, integration, automation, agent, and template

## Production Constraints

Do not build the marketplace storefront.

Do not duplicate APP-020 external integration ownership.

Do not grant runtime execution authority beyond declared contracts.

Do not redesign APP-014 orchestration.

Label the package:

**Production Baseline v1.0**

## Manufacturing Authority

Move the work order through:

`production/inbox → production/active → production/review`

Manufacture, validate, synchronize, and continue production unless Executive Authority orders a pause.
