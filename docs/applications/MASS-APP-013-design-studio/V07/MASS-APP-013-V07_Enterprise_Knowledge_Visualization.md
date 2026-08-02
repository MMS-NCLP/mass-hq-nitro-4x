# MASS-APP-013-V07 — Enterprise Knowledge Visualization

## Document Information

| Field | Value |
|-------|-------|
| Application | MASS-APP-013 — Design Studio |
| Volume | V07 |
| Title | Enterprise Knowledge Visualization |
| Version | 1.0 |
| Status | Complete |
| Work Order | WO-013-V07 |
| Manufacturing Date | 2026-08-02 |
| Authority | MASS Constitution → Engineering Library → Application Directives → Repository Canon → MASS V1 Manufacturing Guide |
| Series Note | V07 completes the MASS-APP-013 Design Studio V1 series |

## Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0 | 2026-08-02 | Initial manufacturing under Production Reset doctrine. Final Design Studio volume. |

---

## 1. Purpose

Enterprise Knowledge Visualization establishes how Design Studio converts approved enterprise information into governed visual representations — diagrams, maps, charts, boards, and other structured visualizations that help users understand projects, relationships, processes, systems, and knowledge.

This volume defines visualization-document architecture, canvas metadata, node and connection models, visualization types, layouts and grouping, enterprise-source references, revision lifecycle, review and approval, and export/publishing handoff. After implementation, users shall be able to create knowledge-visualization documents, organize visualizations within projects and workspaces, place and configure visual nodes, connect nodes through governed relationships, construct diagrams from structured enterprise references, use reusable components, tokens, templates, and assets, preview and publish visualizations through V04, maintain revisions and approval history, and preserve source traceability.

This volume does not define AI-generated diagrams, automatic semantic inference, advanced graph analytics, live multi-user cursor collaboration, simulation or process execution, dashboard analytics owned by Enterprise Analytics, external visualization-platform integrations, or cross-tenant knowledge discovery.

**Mandatory Boundary:** V07 owns visual representation and creative stewardship. It does not own the authoritative enterprise knowledge itself, analytical calculation, relationship inference, operational workflow execution, or source-system mutation. A visualization may reference enterprise entities and knowledge records, but it shall not become their system of record.

## 2. Scope

### Included

- Visualization-document architecture
- Canvas and viewport metadata
- Node and connection models
- Visualization types
- Layouts and grouping
- Enterprise-source references
- Labels, annotations, and legends
- Revision lifecycle
- Review and approval
- Export and publishing handoff
- Search, filtering, and organization
- Tenant isolation and permissions

### Excluded

- AI-generated diagrams (future)
- Automatic semantic inference (future)
- Advanced graph analytics (future)
- Live multi-user cursor collaboration (future)
- Simulation or process execution (future)
- Dashboard analytics (ENG-024 / Enterprise Analytics)
- External visualization-platform integrations (future)
- Cross-tenant knowledge discovery (future)

## 3. Platform Consumption Map

| Platform Service | How V07 Consumes It |
|------------------|---------------------|
| ENG-002 Enterprise Core | Tenant context, entity ID generation, lifecycle state patterns |
| ENG-003 Identity Engine | User authentication, tenant resolution |
| ENG-004 Security Framework | Row Level Security policies |
| ENG-005 Event Bus Engine | Visualization lifecycle event publication |
| ENG-007 Knowledge Engine | Enterprise knowledge entity references |
| ENG-008 Document Engine | Visualization document persistence where required |
| ENG-010 Notification Engine | Review assignment notifications |
| ENG-012 Persistence Framework | PostgreSQL connection, migration patterns |
| ENG-015 API Framework | REST endpoint structure, request validation |
| ENG-024 Analytics Engine | Analytics-source boundary (V07 does not perform analytics) |
| ENG-027 Executive Intelligence | Executive knowledge references where applicable |

### Responsibilities Owned by V07

- Visualization document CRUD and lifecycle
- Canvas and viewport state
- Node placement, configuration, and styling
- Connection creation and visual relationship tracking
- Node grouping and layer management
- Visualization type taxonomy
- Revision management (immutable approved revisions)
- Review and approval workflow
- Enterprise-source reference tracking
- Export content preparation
- Publishing handoff to V04
- Visualization search and discovery

### Responsibilities Delegated

- Binary/document storage → ENG-008 (Document Engine)
- Authentication and tenant isolation → ENG-003, ENG-004
- Event distribution → ENG-005
- Review assignment notifications → ENG-010
- API conventions → ENG-015
- Project context → V02
- Component and token references → V03
- Publication records and output lifecycle → V04
- Asset references → V05
- Content references → V06

### Enterprise Events Published

| Event | Trigger |
|-------|---------|
| `visualization.created` | New visualization document created |
| `visualization.updated` | Visualization metadata modified |
| `visualization.submitted` | Visualization submitted for review |
| `visualization.approved` | Visualization approved by reviewer |
| `visualization.rejected` | Visualization rejected by reviewer |
| `visualization.returned_to_draft` | Visualization returned to draft |
| `visualization.archived` | Visualization archived |
| `visualization.restored` | Visualization restored from archive |
| `visualization.deleted` | Visualization soft-deleted |
| `visualization.duplicated` | Visualization duplicated |
| `visualization.revision.created` | New revision created |
| `visualization.review.created` | Review assigned |
| `visualization.review.commented` | Review comment added |
| `visualization.publish_handoff.created` | Publishing handoff initiated |
| `visualization.publish_handoff.updated` | Handoff status changed |

### Enterprise Events Consumed

| Event | Response |
|-------|----------|
| `project.deleted` | Remove project-scoped visualization references |
| `asset.archived` | Flag asset references within nodes as stale |
| `component.archived` | Flag component references within nodes as stale |
| `content.archived` | Flag content source references as stale |
| `publication.archived` | Preserve publication references as historical |

## 4. Constitutional Boundary Statement

This volume owns visualization document creation, canvas composition, node and connection governance, visual grouping and layering, visualization lifecycle, review and approval, revision history, enterprise-source reference tracking, export preparation, and publishing handoff within Design Studio. It does not own and shall not duplicate: the authoritative enterprise knowledge being visualized (ENG-007, ENG-027); analytical calculation (ENG-024); communication delivery (ENG-023); binary file storage (ENG-008); publication records and output lifecycle (V04); user authentication (ENG-003); security policy enforcement (ENG-004); event distribution (ENG-005); notification transport (ENG-010); or API framework conventions (ENG-015).

**Source-of-Truth Boundary:** Visualizations reference enterprise entities — they do not become authoritative records. Creating a node labeled "Customer Onboarding Process" that references a process record does not create, modify, or govern that process. The source system remains the system of record. If a referenced entity is archived or deleted in its source system, the node retains its visual representation but its source reference is marked as stale.

## 5. Visualization Architecture

### 5.1 Visualization Document

A visualization is a governed document containing a structured canvas of nodes, connections, groups, and layers. Visualizations are tenant-scoped and optionally associated with a project.

```
Visualization
├── Identity (ID, tenant, owner, project)
├── Classification (type, title, description)
├── Canvas (width, height, background, grid settings)
├── Composition
│   ├── Nodes (positioned visual elements)
│   ├── Connections (relationships between nodes)
│   ├── Groups (logical node groupings)
│   └── Layers (visual ordering and visibility)
├── Source References (links to enterprise entities)
├── Lifecycle (status, timestamps)
├── Revision History (immutable revision records)
├── Review History (reviewer decisions, comments)
├── Publishing Handoffs (export records to V04)
├── Tags (freeform categorization)
└── Favorites (user quick access)
```

### 5.2 Visualization Types

Visualization type governs defaults and presentation behavior, not separate storage architecture. All types share the same node, connection, group, and layer model.

| Type | Description | Default Node Types |
|------|-------------|-------------------|
| Architecture Diagram | System and component architecture | System, Entity, Document |
| Process Map | Workflow and process flows | Process, Decision, Event |
| Relationship Map | Entity relationships and connections | Entity, Person, Organization |
| Organization Map | Organizational structure | Person, Organization, Entity |
| Timeline | Chronological sequences | Event, Entity, Annotation |
| Journey Map | User or customer journeys | Process, Event, Entity, Annotation |
| Concept Map | Conceptual relationships | Entity, Annotation |
| Dependency Map | Dependency chains and impact | System, Entity, Document |
| Decision Tree | Decision paths and outcomes | Decision, Process, Entity |
| Freeform Board | Unrestricted canvas | All types available |

Custom visualization types may be created by tenant administrators.

### 5.3 Visualization Lifecycle

```
                              ┌──────────┐
                   create     │          │
              ────────────────▶  Draft   │◀─────────────────┐
                              │          │                  │
                              └────┬─────┘                  │
                                   │                        │
                             submit for                return to
                               review                    draft
                                   │                        │
                              ┌────▼─────┐            ┌─────┴────┐
                              │          │──reject───▶│          │
                              │In Review │            │ Rejected │
                              │          │            │          │
                              └────┬─────┘            └──────────┘
                                   │
                                approve
                                   │
                              ┌────▼─────┐
                              │          │
                              │ Approved │ (immutable)
                              │          │
                              └────┬─────┘
                                   │
                            publish handoff
                                   │
                              ┌────▼─────┐
                              │          │
                              │Published │
                              │          │
                              └────┬─────┘
                                   │
                                archive
                                   │
                              ┌────▼─────┐
                              │          │
                              │ Archived │
                              │          │
                              └────┬─────┘
                                   │
                                restore
                                   │
                              ┌────▼─────┐
                              │          │
                              │  Draft   │ (new revision)
                              │          │
                              └──────────┘
```

**States:**

| State | Description | Transitions |
|-------|-------------|-------------|
| Draft | Work in progress. Nodes, connections, groups, layers are editable. | → In Review |
| In Review | Submitted for evaluation. Read-only during review. | → Approved, → Rejected |
| Rejected | Review returned with rejection reason. | → Draft (return to draft) |
| Approved | Immutable. No modification to revision, nodes, connections, groups, or layers. | → Published |
| Published | Approved revision has been handed off to V04 for publication output. | → Archived |
| Archived | No longer active. Read-only. References and handoffs preserved. | → Draft (restore creates new revision) |

**Lifecycle Rules:**
- Approved revisions are immutable — enforced at the database level by triggers
- Any correction to an approved visualization creates a new revision in Draft state
- Restoring an archived visualization creates a new revision
- Published state indicates a V04 publishing handoff exists — the visualization remains immutable
- Self-review is prohibited — enforced at the database level by trigger

## 6. Canvas Model

### 6.1 Canvas Properties

Each visualization revision carries canvas metadata defining the drawing surface.

| Property | Type | Description |
|----------|------|-------------|
| width | INTEGER | Canvas width in logical units |
| height | INTEGER | Canvas height in logical units |
| background_color | VARCHAR(20) | Background color (hex or token reference) |
| grid_enabled | BOOLEAN | Whether grid is visible |
| grid_size | INTEGER | Grid spacing in logical units |
| snap_to_grid | BOOLEAN | Whether nodes snap to grid |
| zoom_level | DECIMAL | Default zoom level (1.0 = 100%) |
| viewport_x | DECIMAL | Default viewport X offset |
| viewport_y | DECIMAL | Default viewport Y offset |

Canvas properties are revision-scoped — each revision has its own canvas state.

## 7. Node Model

### 7.1 Node Entity

Nodes are the visual building blocks of a visualization. Each node belongs to a specific revision.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| revision_id | UUID | FK → visualization_revision |
| node_type | VARCHAR(30) | Node type identifier |
| label | VARCHAR(255) | Display label |
| description | TEXT | Optional description |
| position_x | DECIMAL | X coordinate on canvas |
| position_y | DECIMAL | Y coordinate on canvas |
| width | DECIMAL | Node width |
| height | DECIMAL | Node height |
| style_ref | VARCHAR(100) | Design token or style reference |
| component_ref | UUID | Optional V03 component reference |
| asset_ref | UUID | Optional V05 asset reference (icon, image) |
| source_ref_id | UUID | Optional FK → visualization_source_reference |
| group_id | UUID | Optional FK → visualization_group |
| layer_id | UUID | Optional FK → visualization_layer |
| display_order | INTEGER | Z-order within layer |
| metadata | JSONB | Additional node-specific data |

### 7.2 Node Types

| Node Type | Description | Typical Visual |
|-----------|-------------|---------------|
| entity | Business entity or concept | Rectangle |
| process | Workflow step or activity | Rounded rectangle |
| decision | Decision point or branch | Diamond |
| document | Document or artifact | Document shape |
| event | Temporal event or trigger | Circle |
| metric | Measurement or KPI | Gauge/badge |
| person | Individual | Person icon |
| organization | Organization or team | Building icon |
| system | Software system or service | Cylinder/box |
| annotation | Text note or callout | Note shape |

### 7.3 Node Rules

- Nodes belong to exactly one revision — they cannot be shared across revisions
- Nodes on approved revisions are immutable (database trigger enforced)
- Node position, size, and style may reference V03 design tokens
- Node icons and images may reference V05 assets
- A node's `source_ref_id` links to a `VisualizationSourceReference` for enterprise entity traceability

## 8. Connection Model

### 8.1 Connection Entity

Connections represent visual relationships between nodes within the same revision.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| revision_id | UUID | FK → visualization_revision |
| source_node_id | UUID | FK → visualization_node (same revision) |
| target_node_id | UUID | FK → visualization_node (same revision) |
| relationship_type | VARCHAR(50) | Type of visual relationship |
| direction | VARCHAR(10) | forward, reverse, bidirectional, none |
| label | VARCHAR(255) | Optional connection label |
| line_style | VARCHAR(20) | solid, dashed, dotted |
| source_anchor | VARCHAR(20) | top, right, bottom, left, auto |
| target_anchor | VARCHAR(20) | top, right, bottom, left, auto |
| display_order | INTEGER | Z-order |
| metadata | JSONB | Additional connection-specific data |

### 8.2 Connection Rules

- Both source and target nodes must belong to the same revision as the connection — the database enforces this through a trigger that validates `source_node.revision_id = connection.revision_id` and `target_node.revision_id = connection.revision_id`
- A connection cannot reference nodes from different revisions (cross-revision connections are prohibited)
- Connections on approved revisions are immutable (database trigger enforced)
- Connections are visual relationships — they do not create or modify authoritative enterprise relationships
- Self-connections (source_node_id = target_node_id) are permitted for self-referential diagrams

## 9. Groups and Layers

### 9.1 Group Model

Groups provide logical and visual clustering of nodes within a revision.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| revision_id | UUID | FK → visualization_revision |
| name | VARCHAR(255) | Group name |
| description | TEXT | Optional description |
| parent_group_id | UUID | Optional FK → visualization_group (nesting) |
| is_collapsed | BOOLEAN | Whether group is visually collapsed |
| position_x | DECIMAL | Group boundary X |
| position_y | DECIMAL | Group boundary Y |
| width | DECIMAL | Group boundary width |
| height | DECIMAL | Group boundary height |
| style_ref | VARCHAR(100) | Style reference |
| display_order | INTEGER | Z-order |

**Group Rules:**
- Group nesting depth is limited to 3 levels
- Groups belong to a revision and are immutable on approved revisions
- Collapsing a group hides its member nodes visually but does not delete them

### 9.2 Layer Model

Layers control visual ordering and visibility of nodes and connections.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| revision_id | UUID | FK → visualization_revision |
| name | VARCHAR(100) | Layer name |
| position | INTEGER | Layer order (higher = on top) |
| is_visible | BOOLEAN | Whether layer is currently visible |
| is_locked | BOOLEAN | Whether layer is locked for editing |
| opacity | DECIMAL | Layer opacity (0.0–1.0) |

**Layer Rules:**
- Every revision has at least one default layer
- Locked layers prevent node/connection editing within that layer (Draft state only — approved revisions are fully immutable regardless)
- Layer visibility is a display property — hidden nodes remain in the data model

## 10. Enterprise Source References

### 10.1 Source Reference Model

Nodes may reference approved enterprise entities for traceability. Source references are tracking relationships — they do not mutate source systems.

```
VisualizationSourceReference
├── id                (reference ID)
├── revision_id       (FK → visualization_revision)
├── entity_type       (project | person | organization | content | asset |
│                      publication | document | component | integration)
├── entity_id         (ID of the referenced enterprise entity)
├── context           (usage context, e.g., "primary-system", "stakeholder")
├── is_stale          (whether the source entity has been archived/deleted)
├── created_by        (who created the reference)
└── created_at        (when the reference was created)
```

### 10.2 Source Reference Rules

- `entity_id` is polymorphic. Tenant isolation is enforced by RLS and application-layer validation. The application verifies that the referenced entity exists, belongs to the same tenant, and is in a valid lifecycle state before creating a reference.
- `context` is NOT NULL DEFAULT '' to ensure uniqueness constraint integrity
- `UNIQUE (revision_id, entity_type, entity_id, context)` prevents duplicate references
- When a referenced entity is archived or deleted in its source system, the `is_stale` flag is set to `true` via event consumption — the node retains its visual representation
- Source references are revision-scoped — each revision carries its own set of references

## 11. Review and Approval

### 11.1 Review Model

Reviews follow the same pattern established in V06.1: reviews reference revisions directly via `revision_id` FK.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| revision_id | UUID | FK → visualization_revision |
| reviewer_id | UUID | Assigned reviewer (FK → users) |
| decision | VARCHAR(20) | pending, approved, rejected |
| rejection_reason | TEXT | Required when rejected |
| decided_at | TIMESTAMPTZ | When decided |
| created_at | TIMESTAMPTZ | When assigned |

### 11.2 Review Comments

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| review_id | UUID | FK → visualization_review |
| author_id | UUID | Comment author (FK → users) |
| body | TEXT | Comment text |
| node_id | UUID | Optional — specific node the comment addresses |
| created_at | TIMESTAMPTZ | When posted |

### 11.3 Review Rules

- Self-review is prohibited — database trigger enforced (same pattern as V06.1 `trg_prevent_self_review`)
- Reviews reference `revision_id` directly — no loose content_id + revision_number
- Only assigned reviewers may approve or reject
- Multiple reviewers may be assigned; a single approval suffices
- Review history is preserved permanently
- Review assignment triggers notification through ENG-010

## 12. Publishing Handoff

### 12.1 Publish Handoff Model

An approved visualization revision may be handed off to V04 for publication output generation.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| visualization_id | UUID | FK → visualization |
| revision_id | UUID | FK → visualization_revision (must be approved) |
| output_format | VARCHAR(20) | svg, png, pdf, html, json |
| status | VARCHAR(20) | pending, accepted, rejected, failed |
| requested_by | UUID | Who initiated (FK → users) |
| requested_at | TIMESTAMPTZ | When initiated |
| responded_at | TIMESTAMPTZ | When V04 responded |
| publication_id | UUID | V04 publication ID when accepted |
| failure_reason | TEXT | Why failed or rejected |
| idempotency_key | VARCHAR(255) | Unique key preventing duplicates |

### 12.2 Handoff Rules

- Only approved revisions may be handed off
- Idempotency key: `{visualization_id}_{revision_id}_{output_format}` — prevents duplicate handoffs
- Duplicate attempts return the existing handoff record
- Handoff records are never deleted (audit requirement)
- V07 defines export content; V04 governs publication records and output lifecycle
- A failed handoff does not change visualization lifecycle state

### 12.3 Failure Behavior

When V04 rejects a publishing handoff:
1. Handoff status set to `rejected` or `failed`, `failure_reason` populated
2. `visualization.publish_handoff.updated` event published
3. Visualization lifecycle state unchanged
4. User notified through ENG-010
5. User may correct the issue and initiate a new handoff

## 13. Search and Filtering

### 13.1 Search Capabilities

| Capability | Description |
|------------|-------------|
| Text search | Case-insensitive partial match on title and description |
| Type filter | Filter by visualization type |
| Status filter | Filter by lifecycle state (default: all non-deleted) |
| Tag filter | Filter by one or more tags |
| Owner filter | Filter by visualization owner |
| Project filter | Filter by associated project |
| Date range | Filter by creation or modification date |
| Reviewer filter | Filter to visualizations assigned to a specific reviewer |
| Review status | Filter by review decision |
| Source entity filter | Filter by referenced enterprise entity |
| Favorites | Filter to user's favorited visualizations |

### 13.2 Sort Options

| Sort Field | Description |
|------------|-------------|
| title | Alphabetical |
| created_at | Creation date (default, newest first) |
| updated_at | Last modification date |
| status | Lifecycle state |
| visualization_type | Type name |

## 14. Data Model

### 14.1 Entity Definitions

**Visualization**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| title | VARCHAR(255) | No | — | Visualization title |
| description | TEXT | Yes | NULL | Description |
| viz_type_id | UUID | No | — | Visualization type (composite FK with tenant_id) |
| project_id | UUID | Yes | NULL | Optional project association |
| status | VARCHAR(20) | No | 'draft' | Lifecycle state |
| owner_id | UUID | No | — | Owner (FK) |
| current_revision | INTEGER | No | 1 | Active revision number |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |
| archived_at | TIMESTAMPTZ | Yes | NULL | When archived |
| deleted_at | TIMESTAMPTZ | Yes | NULL | When soft-deleted |

**VisualizationType**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(100) | No | — | Type name |
| description | TEXT | Yes | NULL | Type description |
| is_standard | BOOLEAN | No | false | Platform-standard type |
| default_node_types | TEXT[] | Yes | NULL | Advisory default node types |
| position | INTEGER | No | 0 | Display order |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |

**VisualizationRevision**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| visualization_id | UUID | No | — | Parent visualization (FK) |
| revision_number | INTEGER | No | — | Sequential revision |
| status | VARCHAR(20) | No | 'draft' | Revision state |
| canvas_width | INTEGER | No | 2000 | Canvas width |
| canvas_height | INTEGER | No | 1500 | Canvas height |
| background_color | VARCHAR(20) | Yes | NULL | Background color |
| grid_enabled | BOOLEAN | No | true | Grid visible |
| grid_size | INTEGER | No | 20 | Grid spacing |
| snap_to_grid | BOOLEAN | No | true | Snap enabled |
| zoom_level | DECIMAL | No | 1.0 | Default zoom |
| viewport_x | DECIMAL | No | 0 | Default viewport X |
| viewport_y | DECIMAL | No | 0 | Default viewport Y |
| created_by | UUID | No | — | Who created (FK) |
| created_at | TIMESTAMPTZ | No | now() | Revision timestamp |
| approved_by | UUID | Yes | NULL | Who approved (FK) |
| approved_at | TIMESTAMPTZ | Yes | NULL | When approved |
| rejection_reason | TEXT | Yes | NULL | Why rejected |
| rejected_at | TIMESTAMPTZ | Yes | NULL | When rejected |

**VisualizationNode**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| revision_id | UUID | No | — | FK → visualization_revision |
| node_type | VARCHAR(30) | No | — | Node type |
| label | VARCHAR(255) | No | — | Display label |
| description | TEXT | Yes | NULL | Description |
| position_x | DECIMAL | No | 0 | X coordinate |
| position_y | DECIMAL | No | 0 | Y coordinate |
| width | DECIMAL | No | 120 | Width |
| height | DECIMAL | No | 80 | Height |
| style_ref | VARCHAR(100) | Yes | NULL | Design token/style reference |
| component_ref | UUID | Yes | NULL | V03 component reference |
| asset_ref | UUID | Yes | NULL | V05 asset reference |
| source_ref_id | UUID | Yes | NULL | FK → visualization_source_reference |
| group_id | UUID | Yes | NULL | FK → visualization_group |
| layer_id | UUID | Yes | NULL | FK → visualization_layer |
| display_order | INTEGER | No | 0 | Z-order |
| metadata | JSONB | Yes | NULL | Additional data |

**VisualizationConnection**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| revision_id | UUID | No | — | FK → visualization_revision |
| source_node_id | UUID | No | — | FK → visualization_node |
| target_node_id | UUID | No | — | FK → visualization_node |
| relationship_type | VARCHAR(50) | Yes | NULL | Relationship type |
| direction | VARCHAR(15) | No | 'forward' | forward, reverse, bidirectional, none |
| label | VARCHAR(255) | Yes | NULL | Connection label |
| line_style | VARCHAR(20) | No | 'solid' | solid, dashed, dotted |
| source_anchor | VARCHAR(20) | No | 'auto' | Anchor position |
| target_anchor | VARCHAR(20) | No | 'auto' | Anchor position |
| display_order | INTEGER | No | 0 | Z-order |
| metadata | JSONB | Yes | NULL | Additional data |

**VisualizationGroup**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| revision_id | UUID | No | — | FK → visualization_revision |
| name | VARCHAR(255) | No | — | Group name |
| description | TEXT | Yes | NULL | Description |
| parent_group_id | UUID | Yes | NULL | FK → visualization_group (nesting) |
| is_collapsed | BOOLEAN | No | false | Collapsed state |
| position_x | DECIMAL | No | 0 | Group boundary X |
| position_y | DECIMAL | No | 0 | Group boundary Y |
| width | DECIMAL | No | 200 | Group boundary width |
| height | DECIMAL | No | 150 | Group boundary height |
| style_ref | VARCHAR(100) | Yes | NULL | Style reference |
| display_order | INTEGER | No | 0 | Z-order |

**VisualizationLayer**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| revision_id | UUID | No | — | FK → visualization_revision |
| name | VARCHAR(100) | No | — | Layer name |
| position | INTEGER | No | 0 | Layer order (higher = on top) |
| is_visible | BOOLEAN | No | true | Visibility |
| is_locked | BOOLEAN | No | false | Lock state |
| opacity | DECIMAL | No | 1.0 | Opacity (0.0–1.0) |

**VisualizationSourceReference**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| revision_id | UUID | No | — | FK → visualization_revision |
| entity_type | VARCHAR(20) | No | — | Source entity type |
| entity_id | UUID | No | — | Source entity ID |
| context | VARCHAR(100) | No | '' | Usage context |
| is_stale | BOOLEAN | No | false | Source archived/deleted |
| created_by | UUID | No | — | Who created (FK) |
| created_at | TIMESTAMPTZ | No | now() | When created |

**VisualizationReview**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| revision_id | UUID | No | — | FK → visualization_revision |
| reviewer_id | UUID | No | — | Assigned reviewer (FK) |
| decision | VARCHAR(20) | No | 'pending' | pending, approved, rejected |
| rejection_reason | TEXT | Yes | NULL | Required when rejected |
| decided_at | TIMESTAMPTZ | Yes | NULL | When decided |
| created_at | TIMESTAMPTZ | No | now() | When assigned |

**VisualizationReviewComment**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| review_id | UUID | No | — | FK → visualization_review |
| author_id | UUID | No | — | Comment author (FK) |
| body | TEXT | No | — | Comment text |
| node_id | UUID | Yes | NULL | Optional node reference |
| created_at | TIMESTAMPTZ | No | now() | When posted |

**VisualizationFavorite**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| user_id | UUID | No | — | User (FK) |
| visualization_id | UUID | No | — | Favorited visualization (FK) |
| favorited_at | TIMESTAMPTZ | No | now() | When favorited |

**VisualizationPublishHandoff**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| visualization_id | UUID | No | — | FK → visualization |
| revision_id | UUID | No | — | FK → visualization_revision (must be approved) |
| output_format | VARCHAR(20) | No | — | svg, png, pdf, html, json |
| status | VARCHAR(20) | No | 'pending' | pending, accepted, rejected, failed |
| requested_by | UUID | No | — | Who initiated (FK) |
| requested_at | TIMESTAMPTZ | No | now() | When initiated |
| responded_at | TIMESTAMPTZ | Yes | NULL | When V04 responded |
| publication_id | UUID | Yes | NULL | V04 publication ID |
| failure_reason | TEXT | Yes | NULL | Why failed or rejected |
| idempotency_key | VARCHAR(255) | No | — | Unique key |

### 14.2 Constraints

- `visualization.tenant_id` + `visualization.title` is unique
- `visualization_type.tenant_id` + `visualization_type.name` is unique
- `visualization_type` has `UNIQUE (id, tenant_id)` for composite FK
- `visualization.viz_type_id` + `visualization.tenant_id` references `visualization_type(id, tenant_id)`
- `visualization_revision.visualization_id` + `visualization_revision.revision_number` is unique
- `visualization_node.revision_id` + `visualization_node.display_order` — no uniqueness (multiple nodes at same z-order permitted)
- `visualization_connection.source_node_id` != `visualization_connection.target_node_id` is NOT enforced (self-connections permitted)
- `visualization_connection.revision_id` must match `source_node.revision_id` and `target_node.revision_id` — trigger enforced
- `visualization_group` nesting depth ≤ 3 — application enforced
- `visualization_layer.revision_id` + `visualization_layer.position` is unique
- `visualization_source_reference.revision_id` + `entity_type` + `entity_id` + `context` is unique
- `visualization_review.revision_id` + `visualization_review.reviewer_id` is unique
- `visualization_favorite.user_id` + `visualization_favorite.visualization_id` is primary key
- `visualization_publish_handoff.idempotency_key` is unique

### 14.3 Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| visualization | idx_viz_tenant | tenant_id, status | Tenant listing |
| visualization | idx_viz_type | viz_type_id | Type filtering |
| visualization | idx_viz_owner | owner_id | Owner lookup |
| visualization | idx_viz_project | project_id | Project filtering |
| visualization_revision | idx_vr_viz | visualization_id | Revision history |
| visualization_node | idx_vn_revision | revision_id | Nodes per revision |
| visualization_node | idx_vn_group | group_id | Nodes per group |
| visualization_node | idx_vn_layer | layer_id | Nodes per layer |
| visualization_connection | idx_vc_revision | revision_id | Connections per revision |
| visualization_connection | idx_vc_source | source_node_id | Source lookups |
| visualization_connection | idx_vc_target | target_node_id | Target lookups |
| visualization_group | idx_vg_revision | revision_id | Groups per revision |
| visualization_layer | idx_vl_revision | revision_id | Layers per revision |
| visualization_source_reference | idx_vsr_revision | revision_id | Refs per revision |
| visualization_source_reference | idx_vsr_entity | entity_type, entity_id | Entity lookups |
| visualization_review | idx_vrv_revision | revision_id | Reviews per revision |
| visualization_review | idx_vrv_reviewer | reviewer_id, decision | Reviewer workload |
| visualization_review_comment | idx_vrc_review | review_id | Comments per review |
| visualization_publish_handoff | idx_vph_viz | visualization_id | Handoffs per viz |
| visualization_publish_handoff | idx_vph_idempotency | idempotency_key | Duplicate prevention |

## 15. API Specification

### 15.1 Visualization Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /visualizations | List visualizations (paginated, filterable) | Viewer |
| GET | /visualizations/{id} | Get visualization with current revision | Viewer |
| POST | /visualizations | Create visualization | Editor |
| PATCH | /visualizations/{id} | Update visualization metadata | Editor |
| DELETE | /visualizations/{id} | Soft-delete visualization | Admin |
| POST | /visualizations/{id}/duplicate | Duplicate visualization | Editor |
| POST | /visualizations/{id}/submit-review | Submit for review | Editor |
| POST | /visualizations/{id}/approve | Approve (reviewer only) | Editor |
| POST | /visualizations/{id}/reject | Reject (reviewer only) | Editor |
| POST | /visualizations/{id}/return-to-draft | Return rejected to draft | Editor |
| POST | /visualizations/{id}/archive | Archive | Admin |
| POST | /visualizations/{id}/restore | Restore (creates new revision) | Admin |

### 15.2 Revision Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /visualizations/{id}/revisions | List all revisions | Viewer |
| POST | /visualizations/{id}/revisions | Create new revision | Editor |

### 15.3 Node Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /visualizations/{id}/nodes | List nodes for current revision | Viewer |
| POST | /visualizations/{id}/nodes | Create node | Editor |
| PATCH | /visualizations/{id}/nodes/{nodeId} | Update node | Editor |
| DELETE | /visualizations/{id}/nodes/{nodeId} | Delete node | Editor |

### 15.4 Connection Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /visualizations/{id}/connections | List connections for current revision | Viewer |
| POST | /visualizations/{id}/connections | Create connection | Editor |
| PATCH | /visualizations/{id}/connections/{connectionId} | Update connection | Editor |
| DELETE | /visualizations/{id}/connections/{connectionId} | Delete connection | Editor |

### 15.5 Review Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /visualizations/{id}/reviews | List reviews | Viewer |
| POST | /visualizations/{id}/reviews/{reviewId}/comments | Add review comment | Editor |

### 15.6 Source Reference Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /visualization-types | List visualization types | Viewer |
| GET | /visualizations/{id}/source-references | List source references | Viewer |
| POST | /visualizations/{id}/source-references | Create source reference | Editor |
| DELETE | /visualizations/{id}/source-references/{referenceId} | Remove source reference | Editor |

### 15.7 Favorite Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| POST | /visualizations/{id}/favorite | Favorite | Viewer |
| DELETE | /visualizations/{id}/favorite | Unfavorite | Viewer |

### 15.8 Publishing Handoff Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| POST | /visualizations/{id}/publish-handoffs | Initiate publishing handoff | Admin |
| GET | /visualizations/{id}/publish-handoffs | List handoffs | Viewer |

### 15.9 Query Parameters — GET /visualizations

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: draft, in_review, approved, published, archived, all (default: all non-deleted) |
| viz_type | UUID | Filter by visualization type ID |
| search | string | Search by title and description |
| tag | string | Filter by tag |
| owner | UUID | Filter by owner |
| project | UUID | Filter by associated project |
| reviewer | UUID | Filter to assigned reviewer |
| review_status | string | pending, approved, rejected |
| source_entity_type | string | Filter by referenced entity type |
| source_entity_id | UUID | Filter by specific referenced entity |
| favorited | boolean | Filter to favorites |
| created_after | ISO date | Creation date lower bound |
| created_before | ISO date | Creation date upper bound |
| sort | string | title, created_at (default), updated_at, status, visualization_type |
| order | string | asc, desc (default) |
| limit | integer | Page size (default 25, max 100) |
| offset | integer | Pagination offset (default 0) |

### 15.10 Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400 | INVALID_INPUT | Missing required fields or invalid values |
| 400 | REVISION_NOT_APPROVED | Handoff on non-approved revision |
| 400 | REJECTION_REASON_REQUIRED | Rejection without reason |
| 400 | CROSS_REVISION_CONNECTION | Connection nodes from different revisions |
| 401 | UNAUTHORIZED | No valid session |
| 403 | FORBIDDEN | Insufficient role |
| 403 | SELF_REVIEW_PROHIBITED | Owner assigned as reviewer |
| 403 | NOT_ASSIGNED_REVIEWER | Decision by non-assigned user |
| 404 | NOT_FOUND | Entity not found or not accessible |
| 409 | CONFLICT | Duplicate title within tenant |
| 409 | DUPLICATE_HANDOFF | Idempotent handoff exists |
| 409 | REVISION_IMMUTABLE | Modify approved revision |
| 422 | INVALID_STATE_TRANSITION | State transition not permitted |
| 422 | GROUP_NESTING_EXCEEDED | Group nesting depth > 3 |

## 16. Permission Model

| Role | Browse | Create/Edit | Submit Review | Review/Decide | Publish Handoff | Archive/Delete | Manage Types |
|------|--------|-------------|--------------|--------------|----------------|----------------|-------------|
| Viewer | Yes | No | No | No | No | No | No |
| Editor | Yes | Yes | Yes | Yes (when assigned) | No | No | No |
| Admin | Yes | Yes | Yes | Yes (except own) | Yes | Yes | Yes |

Row Level Security enforces tenant isolation on all visualization tables.

## 17. Folder Structure — Design Studio V07 Organization

```
apps/design-studio/
├── src/
│   ├── app/
│   │   ├── (projects)/                        # V02
│   │   ├── (design-system)/                   # V03
│   │   ├── (templates)/                       # V04
│   │   ├── (publications)/                    # V04
│   │   ├── (assets)/                          # V05
│   │   ├── (content)/                         # V06
│   │   ├── (visualizations)/
│   │   │   ├── page.tsx                       # Visualization library
│   │   │   ├── new/
│   │   │   │   └── page.tsx                   # Create visualization
│   │   │   └── [vizId]/
│   │   │       ├── page.tsx                   # Visualization canvas/editor
│   │   │       ├── preview/
│   │   │       │   └── page.tsx               # Preview
│   │   │       ├── revisions/
│   │   │       │   └── page.tsx               # Revision history
│   │   │       ├── reviews/
│   │   │       │   └── page.tsx               # Review history
│   │   │       └── publish/
│   │   │           └── page.tsx               # Publishing handoffs
│   │   └── layout.tsx
│   ├── features/
│   │   ├── projects/                          # V02
│   │   ├── components/                        # V03
│   │   ├── design-tokens/                     # V03
│   │   ├── templates/                         # V04
│   │   ├── publications/                      # V04
│   │   ├── assets/                            # V05
│   │   ├── content/                           # V06
│   │   └── visualizations/
│   │       ├── api/
│   │       │   ├── visualizations.ts
│   │       │   ├── visualization-types.ts
│   │       │   ├── revisions.ts
│   │       │   ├── nodes.ts
│   │       │   ├── connections.ts
│   │       │   ├── groups.ts
│   │       │   ├── layers.ts
│   │       │   ├── source-references.ts
│   │       │   ├── reviews.ts
│   │       │   └── publish-handoffs.ts
│   │       ├── components/
│   │       │   ├── VisualizationList.tsx
│   │       │   ├── VisualizationCard.tsx
│   │       │   ├── VisualizationCanvas.tsx
│   │       │   ├── VisualizationPreview.tsx
│   │       │   ├── NodeEditor.tsx
│   │       │   ├── NodeRenderer.tsx
│   │       │   ├── ConnectionEditor.tsx
│   │       │   ├── ConnectionRenderer.tsx
│   │       │   ├── GroupPanel.tsx
│   │       │   ├── LayerPanel.tsx
│   │       │   ├── SourceReferencePanel.tsx
│   │       │   ├── RevisionHistory.tsx
│   │       │   ├── ReviewPanel.tsx
│   │       │   ├── ReviewCommentThread.tsx
│   │       │   ├── PublishHandoffDialog.tsx
│   │       │   └── ToolPalette.tsx
│   │       ├── hooks/
│   │       │   ├── useVisualization.ts
│   │       │   ├── useVisualizationList.ts
│   │       │   ├── useNodes.ts
│   │       │   ├── useConnections.ts
│   │       │   ├── useGroups.ts
│   │       │   ├── useLayers.ts
│   │       │   ├── useSourceReferences.ts
│   │       │   ├── useRevisions.ts
│   │       │   ├── useReviews.ts
│   │       │   ├── usePublishHandoffs.ts
│   │       │   └── useVisualizationTypes.ts
│   │       └── types/
│   │           └── visualization.ts
│   └── lib/
│       └── supabase/
│           └── client.ts
├── supabase/
│   └── migrations/
│       ├── ...                                # V02-V06 (001-049)
│       ├── 050_create_visualization_types.sql
│       ├── 051_create_visualizations.sql
│       ├── 052_create_visualization_revisions.sql
│       ├── 053_create_visualization_groups.sql
│       ├── 054_create_visualization_layers.sql
│       ├── 055_create_visualization_nodes.sql
│       ├── 056_create_visualization_connections.sql
│       ├── 057_create_visualization_source_references.sql
│       ├── 058_create_visualization_reviews.sql
│       ├── 059_create_visualization_review_comments.sql
│       ├── 060_create_visualization_favorites.sql
│       ├── 061_create_visualization_publish_handoffs.sql
│       ├── 062_create_visualization_tags.sql
│       ├── 063_seed_visualization_types.sql
│       ├── 064_create_v07_rls_policies.sql
│       └── 065_create_v07_enforcement_triggers.sql
└── package.json
```

## 18. Migration SQL Reference

```sql
-- 050_create_visualization_types.sql
CREATE TABLE visualization_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_standard BOOLEAN NOT NULL DEFAULT false,
  default_node_types TEXT[],
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name),
  UNIQUE (id, tenant_id)
);

-- 051_create_visualizations.sql
CREATE TABLE visualization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  viz_type_id UUID NOT NULL,
  FOREIGN KEY (viz_type_id, tenant_id) REFERENCES visualization_type(id, tenant_id),
  project_id UUID,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_review', 'approved', 'rejected', 'published', 'archived', 'deleted')),
  owner_id UUID NOT NULL REFERENCES users(id),
  current_revision INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  UNIQUE (tenant_id, title)
);

CREATE INDEX idx_viz_tenant ON visualization(tenant_id, status);
CREATE INDEX idx_viz_type ON visualization(viz_type_id);
CREATE INDEX idx_viz_owner ON visualization(owner_id);
CREATE INDEX idx_viz_project ON visualization(project_id);

-- 052_create_visualization_revisions.sql
CREATE TABLE visualization_revision (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visualization_id UUID NOT NULL REFERENCES visualization(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_review', 'approved', 'rejected', 'published', 'archived')),
  canvas_width INTEGER NOT NULL DEFAULT 2000,
  canvas_height INTEGER NOT NULL DEFAULT 1500,
  background_color VARCHAR(20),
  grid_enabled BOOLEAN NOT NULL DEFAULT true,
  grid_size INTEGER NOT NULL DEFAULT 20,
  snap_to_grid BOOLEAN NOT NULL DEFAULT true,
  zoom_level DECIMAL NOT NULL DEFAULT 1.0,
  viewport_x DECIMAL NOT NULL DEFAULT 0,
  viewport_y DECIMAL NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  rejected_at TIMESTAMPTZ,
  UNIQUE (visualization_id, revision_number)
);

CREATE INDEX idx_vr_viz ON visualization_revision(visualization_id);

-- 053_create_visualization_groups.sql
CREATE TABLE visualization_group (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES visualization_revision(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_group_id UUID REFERENCES visualization_group(id),
  is_collapsed BOOLEAN NOT NULL DEFAULT false,
  position_x DECIMAL NOT NULL DEFAULT 0,
  position_y DECIMAL NOT NULL DEFAULT 0,
  width DECIMAL NOT NULL DEFAULT 200,
  height DECIMAL NOT NULL DEFAULT 150,
  style_ref VARCHAR(100),
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_vg_revision ON visualization_group(revision_id);

-- 054_create_visualization_layers.sql
CREATE TABLE visualization_layer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES visualization_revision(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  opacity DECIMAL NOT NULL DEFAULT 1.0,
  UNIQUE (revision_id, position)
);

CREATE INDEX idx_vl_revision ON visualization_layer(revision_id);

-- 055_create_visualization_nodes.sql
CREATE TABLE visualization_node (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES visualization_revision(id) ON DELETE CASCADE,
  node_type VARCHAR(30) NOT NULL
    CHECK (node_type IN (
      'entity', 'process', 'decision', 'document', 'event',
      'metric', 'person', 'organization', 'system', 'annotation'
    )),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  position_x DECIMAL NOT NULL DEFAULT 0,
  position_y DECIMAL NOT NULL DEFAULT 0,
  width DECIMAL NOT NULL DEFAULT 120,
  height DECIMAL NOT NULL DEFAULT 80,
  style_ref VARCHAR(100),
  component_ref UUID,
  asset_ref UUID,
  source_ref_id UUID,
  group_id UUID REFERENCES visualization_group(id),
  layer_id UUID REFERENCES visualization_layer(id),
  display_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB
);

CREATE INDEX idx_vn_revision ON visualization_node(revision_id);
CREATE INDEX idx_vn_group ON visualization_node(group_id);
CREATE INDEX idx_vn_layer ON visualization_node(layer_id);

-- 056_create_visualization_connections.sql
CREATE TABLE visualization_connection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES visualization_revision(id) ON DELETE CASCADE,
  source_node_id UUID NOT NULL REFERENCES visualization_node(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES visualization_node(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50),
  direction VARCHAR(15) NOT NULL DEFAULT 'forward'
    CHECK (direction IN ('forward', 'reverse', 'bidirectional', 'none')),
  label VARCHAR(255),
  line_style VARCHAR(20) NOT NULL DEFAULT 'solid'
    CHECK (line_style IN ('solid', 'dashed', 'dotted')),
  source_anchor VARCHAR(20) NOT NULL DEFAULT 'auto'
    CHECK (source_anchor IN ('top', 'right', 'bottom', 'left', 'auto')),
  target_anchor VARCHAR(20) NOT NULL DEFAULT 'auto'
    CHECK (target_anchor IN ('top', 'right', 'bottom', 'left', 'auto')),
  display_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB
);

CREATE INDEX idx_vc_revision ON visualization_connection(revision_id);
CREATE INDEX idx_vc_source ON visualization_connection(source_node_id);
CREATE INDEX idx_vc_target ON visualization_connection(target_node_id);

-- 057_create_visualization_source_references.sql
CREATE TABLE visualization_source_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES visualization_revision(id) ON DELETE CASCADE,
  entity_type VARCHAR(20) NOT NULL
    CHECK (entity_type IN (
      'project', 'person', 'organization', 'content', 'asset',
      'publication', 'document', 'component', 'integration'
    )),
  entity_id UUID NOT NULL,
  context VARCHAR(100) NOT NULL DEFAULT '',
  is_stale BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (revision_id, entity_type, entity_id, context)
);

CREATE INDEX idx_vsr_revision ON visualization_source_reference(revision_id);
CREATE INDEX idx_vsr_entity ON visualization_source_reference(entity_type, entity_id);

-- 058_create_visualization_reviews.sql
CREATE TABLE visualization_review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES visualization_revision(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id),
  decision VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (decision IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (revision_id, reviewer_id)
);

CREATE INDEX idx_vrv_revision ON visualization_review(revision_id);
CREATE INDEX idx_vrv_reviewer ON visualization_review(reviewer_id, decision);

-- 059_create_visualization_review_comments.sql
CREATE TABLE visualization_review_comment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES visualization_review(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  node_id UUID REFERENCES visualization_node(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vrc_review ON visualization_review_comment(review_id);

-- 060_create_visualization_favorites.sql
CREATE TABLE visualization_favorite (
  user_id UUID NOT NULL REFERENCES users(id),
  visualization_id UUID NOT NULL REFERENCES visualization(id) ON DELETE CASCADE,
  favorited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, visualization_id)
);

-- 061_create_visualization_publish_handoffs.sql
CREATE TABLE visualization_publish_handoff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visualization_id UUID NOT NULL REFERENCES visualization(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES visualization_revision(id),
  output_format VARCHAR(20) NOT NULL
    CHECK (output_format IN ('svg', 'png', 'pdf', 'html', 'json')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'failed')),
  requested_by UUID NOT NULL REFERENCES users(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  publication_id UUID,
  failure_reason TEXT,
  idempotency_key VARCHAR(255) NOT NULL UNIQUE
);

CREATE INDEX idx_vph_viz ON visualization_publish_handoff(visualization_id);
CREATE INDEX idx_vph_idempotency ON visualization_publish_handoff(idempotency_key);

-- 062_create_visualization_tags.sql
CREATE TABLE visualization_tag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visualization_id UUID NOT NULL REFERENCES visualization(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (visualization_id, tag)
);

CREATE INDEX idx_vtag_value ON visualization_tag(tag);

-- 063_seed_visualization_types.sql
-- Standard visualization types seeded per tenant on tenant creation:
-- Architecture Diagram, Process Map, Relationship Map, Organization Map,
-- Timeline, Journey Map, Concept Map, Dependency Map,
-- Decision Tree, Freeform Board
-- Seeding logic runs as part of tenant provisioning.

-- 064_create_v07_rls_policies.sql

ALTER TABLE visualization_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_revision ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_node ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_connection ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_group ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_layer ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_source_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_review ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_review_comment ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_favorite ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_publish_handoff ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_tag ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON visualization_type
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_isolation ON visualization
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_isolation ON visualization_revision
  USING (visualization_id IN (
    SELECT id FROM visualization WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_node
  USING (revision_id IN (
    SELECT vr.id FROM visualization_revision vr
    JOIN visualization v ON vr.visualization_id = v.id
    WHERE v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_connection
  USING (revision_id IN (
    SELECT vr.id FROM visualization_revision vr
    JOIN visualization v ON vr.visualization_id = v.id
    WHERE v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_group
  USING (revision_id IN (
    SELECT vr.id FROM visualization_revision vr
    JOIN visualization v ON vr.visualization_id = v.id
    WHERE v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_layer
  USING (revision_id IN (
    SELECT vr.id FROM visualization_revision vr
    JOIN visualization v ON vr.visualization_id = v.id
    WHERE v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_source_reference
  USING (revision_id IN (
    SELECT vr.id FROM visualization_revision vr
    JOIN visualization v ON vr.visualization_id = v.id
    WHERE v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_review
  USING (revision_id IN (
    SELECT vr.id FROM visualization_revision vr
    JOIN visualization v ON vr.visualization_id = v.id
    WHERE v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_review_comment
  USING (review_id IN (
    SELECT vrv.id FROM visualization_review vrv
    JOIN visualization_revision vr ON vrv.revision_id = vr.id
    JOIN visualization v ON vr.visualization_id = v.id
    WHERE v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_favorite
  USING (visualization_id IN (
    SELECT id FROM visualization WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_publish_handoff
  USING (visualization_id IN (
    SELECT id FROM visualization WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON visualization_tag
  USING (visualization_id IN (
    SELECT id FROM visualization WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

-- 065_create_v07_enforcement_triggers.sql

-- Approved-revision immutability (same pattern as V06.1 migration 049)
CREATE OR REPLACE FUNCTION prevent_approved_viz_revision_mutation()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.status = 'approved' OR OLD.status = 'published' THEN
      RAISE EXCEPTION 'Cannot delete an approved/published revision (revision_id: %)', OLD.id;
    END IF;
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'approved' OR OLD.status = 'published' THEN
      RAISE EXCEPTION 'Cannot modify an approved/published revision (revision_id: %)', OLD.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_approved_viz_revision_immutable
  BEFORE UPDATE OR DELETE ON visualization_revision
  FOR EACH ROW
  EXECUTE FUNCTION prevent_approved_viz_revision_mutation();

-- Immutability for nodes on approved revisions
CREATE OR REPLACE FUNCTION prevent_approved_viz_node_mutation()
RETURNS TRIGGER AS $$
DECLARE
  rev_status VARCHAR(20);
BEGIN
  SELECT status INTO rev_status FROM visualization_revision
    WHERE id = COALESCE(OLD.revision_id, NEW.revision_id);
  IF rev_status IN ('approved', 'published') THEN
    RAISE EXCEPTION 'Cannot modify nodes of an approved/published revision';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_approved_viz_node_immutable
  BEFORE UPDATE OR DELETE ON visualization_node
  FOR EACH ROW
  EXECUTE FUNCTION prevent_approved_viz_node_mutation();

-- Immutability for connections on approved revisions
CREATE OR REPLACE FUNCTION prevent_approved_viz_connection_mutation()
RETURNS TRIGGER AS $$
DECLARE
  rev_status VARCHAR(20);
BEGIN
  SELECT status INTO rev_status FROM visualization_revision
    WHERE id = COALESCE(OLD.revision_id, NEW.revision_id);
  IF rev_status IN ('approved', 'published') THEN
    RAISE EXCEPTION 'Cannot modify connections of an approved/published revision';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_approved_viz_connection_immutable
  BEFORE UPDATE OR DELETE ON visualization_connection
  FOR EACH ROW
  EXECUTE FUNCTION prevent_approved_viz_connection_mutation();

-- Immutability for groups on approved revisions
CREATE OR REPLACE FUNCTION prevent_approved_viz_group_mutation()
RETURNS TRIGGER AS $$
DECLARE
  rev_status VARCHAR(20);
BEGIN
  SELECT status INTO rev_status FROM visualization_revision
    WHERE id = COALESCE(OLD.revision_id, NEW.revision_id);
  IF rev_status IN ('approved', 'published') THEN
    RAISE EXCEPTION 'Cannot modify groups of an approved/published revision';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_approved_viz_group_immutable
  BEFORE UPDATE OR DELETE ON visualization_group
  FOR EACH ROW
  EXECUTE FUNCTION prevent_approved_viz_group_mutation();

-- Immutability for layers on approved revisions
CREATE OR REPLACE FUNCTION prevent_approved_viz_layer_mutation()
RETURNS TRIGGER AS $$
DECLARE
  rev_status VARCHAR(20);
BEGIN
  SELECT status INTO rev_status FROM visualization_revision
    WHERE id = COALESCE(OLD.revision_id, NEW.revision_id);
  IF rev_status IN ('approved', 'published') THEN
    RAISE EXCEPTION 'Cannot modify layers of an approved/published revision';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_approved_viz_layer_immutable
  BEFORE UPDATE OR DELETE ON visualization_layer
  FOR EACH ROW
  EXECUTE FUNCTION prevent_approved_viz_layer_mutation();

-- Cross-revision connection prevention
CREATE OR REPLACE FUNCTION prevent_cross_revision_connection()
RETURNS TRIGGER AS $$
DECLARE
  source_rev UUID;
  target_rev UUID;
BEGIN
  SELECT revision_id INTO source_rev FROM visualization_node WHERE id = NEW.source_node_id;
  SELECT revision_id INTO target_rev FROM visualization_node WHERE id = NEW.target_node_id;

  IF source_rev != NEW.revision_id OR target_rev != NEW.revision_id THEN
    RAISE EXCEPTION 'Connection nodes must belong to the same revision as the connection';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_cross_revision_connection
  BEFORE INSERT OR UPDATE ON visualization_connection
  FOR EACH ROW
  EXECUTE FUNCTION prevent_cross_revision_connection();

-- Self-review prevention (same pattern as V06.1)
CREATE OR REPLACE FUNCTION prevent_viz_self_review()
RETURNS TRIGGER AS $$
DECLARE
  viz_owner_id UUID;
  rev_viz_id UUID;
BEGIN
  SELECT visualization_id INTO rev_viz_id FROM visualization_revision WHERE id = NEW.revision_id;
  SELECT owner_id INTO viz_owner_id FROM visualization WHERE id = rev_viz_id;

  IF NEW.reviewer_id = viz_owner_id THEN
    RAISE EXCEPTION 'Self-review prohibited: visualization owner (%) cannot be assigned as reviewer',
      viz_owner_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_viz_self_review
  BEFORE INSERT ON visualization_review
  FOR EACH ROW
  EXECUTE FUNCTION prevent_viz_self_review();
```

## 19. Engineering Decisions

### 19.1 Tenant-Safe Visualization-Type Relationships

`visualization.viz_type_id` uses a composite FK `(viz_type_id, tenant_id) → visualization_type(id, tenant_id)` preventing cross-tenant type assignment.

### 19.2 Immutable Approved Revisions

Database triggers on `visualization_revision`, `visualization_node`, `visualization_connection`, `visualization_group`, and `visualization_layer` reject UPDATE/DELETE when the revision status is `approved` or `published`. Application layer validates before writes.

### 19.3 Revision Ownership

Nodes, connections, groups, layers, and source references all carry `revision_id` FK. Each revision contains its own complete set of visual elements. Duplicating a revision copies all child elements.

### 19.4 Database-Enforced Review-to-Revision Integrity

`visualization_review.revision_id` is a direct FK to `visualization_revision(id)`. Reviews cannot exist for nonexistent revisions. Same pattern as V06.1.

### 19.5 Self-Review Prevention

Database trigger `trg_prevent_viz_self_review` rejects INSERT on `visualization_review` when the reviewer matches the visualization owner. Application layer validates before the insert attempt.

### 19.6 Connection Referential Integrity and Cross-Revision Prevention

Database trigger `trg_prevent_cross_revision_connection` validates that `source_node.revision_id` and `target_node.revision_id` both match `connection.revision_id` on INSERT and UPDATE. Connections cannot span revisions or tenants.

### 19.7 Same-Tenant Validation for Source References

`visualization_source_reference.entity_id` is polymorphic. Tenant isolation enforced by RLS and application-layer validation. The application verifies the referenced entity exists and belongs to the same tenant.

### 19.8 Idempotent Publication Handoffs

Idempotency key: `{visualization_id}_{revision_id}_{output_format}`. Duplicate attempts return the existing record. Retries use a new key with retry suffix.

### 19.9 Source-of-Truth Boundaries

Visualizations reference enterprise entities — they never become authoritative records. Creating, modifying, or deleting a visualization node has no effect on the referenced enterprise entity. If a source entity is archived or deleted, the node's `source_ref.is_stale` flag is set to `true`; the visual representation is preserved.

### 19.10 Concrete RLS Policies

All 13 V07 tables have explicit RLS policies in migration 064. Tables with direct tenant columns use equality checks. Child tables use subquery joins.

### 19.11 Stale Source Reference Behavior

When a referenced enterprise entity is archived or deleted:
1. The consuming event handler sets `is_stale = true` on the matching source reference
2. The node retains its visual representation with a stale indicator
3. No automatic deletion of nodes or connections
4. Users are informed via the visualization UI that a source reference is stale

## 20. Engineering Constraints

| Constraint | Specification |
|------------|--------------|
| Language | TypeScript (strict mode) |
| Architecture | Modular monolith |
| Database | Supabase PostgreSQL |
| Row Level Security | Mandatory on all 13 tables — concrete policies defined |
| Feature boundary | `features/visualizations/` |
| Migrations | Sequential, continue from V06 sequence (050+) |
| Approved revisions | Immutable — database trigger + application layer |
| Self-review prevention | Database trigger + application layer |
| Cross-revision connections | Prohibited — database trigger enforced |
| Source-of-truth boundary | Visualizations reference, never own, enterprise knowledge |
| Polymorphic references | Application-layer tenant validation |
| Tenant-safe type FK | Composite FK prevents cross-tenant type reference |
| Group nesting | Maximum depth 3 — application enforced |
| Publishing boundary | V07 prepares export, V04 governs publication lifecycle |
| API validation | Zod schemas for all request bodies |

---

## Constitutional Boundary Statement

MASS-APP-013-V07 owns visualization document creation, canvas composition, node and connection governance, visual grouping and layering, visualization lifecycle, review and approval, revision history, enterprise-source reference tracking, export preparation, and publishing handoff within Design Studio. It does not own and shall not duplicate: the authoritative enterprise knowledge being visualized (ENG-007, ENG-027); analytical calculation (ENG-024); communication delivery (ENG-023); publication records and output lifecycle (V04); binary file storage (ENG-008); user authentication (ENG-003); security policy enforcement (ENG-004); event distribution (ENG-005); notification transport (ENG-010); or API framework conventions (ENG-015). Visualizations reference enterprise entities — they do not become their system of record. All platform capabilities are consumed through the Engineering Library, never reimplemented.

---

## Packaging Debt

| Item | Status | Notes |
|------|--------|-------|
| Production PDF | Deferred | Current manufacturing environment cannot generate PDF. Markdown is canonical. |
| Mermaid architecture diagram | Deferred | To be generated when tooling supports it. Entity relationships documented in Section 14. |

---

## APP-013 Series Completion

With V07, the MASS-APP-013 Design Studio V1 series is complete.

| Volume | Title | Status |
|--------|-------|--------|
| V01 | Design Studio Production Reference Manual | Complete |
| V02 | Design Projects & Workspaces | Complete |
| V03 | Component Library & Design System | Complete |
| V04 | Templates & Publishing | Complete |
| V05 | Asset Stewardship & Media Management | Complete (v1.1) |
| V06 | Communications & Content Creation | Complete (v1.1) |
| V07 | Enterprise Knowledge Visualization | Complete |

Total migrations: 065 (001–065)
Total API endpoints across series: V02(16) + V03(24) + V04(27) + V05(24) + V06(24) + V07(34) = 149
Total data model entities: V02(7) + V03(7) + V04(8) + V05(8) + V06(10) + V07(12) = 52
