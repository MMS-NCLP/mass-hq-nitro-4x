# MASS-APP-014-V01 — Creative Intelligence Foundation

## Document Information

| Field | Value |
|-------|-------|
| Application | MASS-APP-014 — Creative & Knowledge Intelligence |
| Volume | V01 |
| Title | Creative Intelligence Foundation |
| Version | 1.0 |
| Status | Complete |
| Work Order | WO-014-V01 |
| Manufacturing Date | 2026-08-02 |
| Authority | MASS Constitution → Engineering Library → Application Directives → Repository Canon → MASS V1 Manufacturing Guide |

## Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0 | 2026-08-02 | Initial manufacturing under Production Reset doctrine. |

---

## 1. Purpose

Creative Intelligence Foundation establishes the architectural foundation for MASS's enterprise creative intelligence capabilities. This application consumes the outputs of Design Studio (APP-013) and provides structured intelligence services that assist users in creating, organizing, understanding, and improving enterprise content.

After implementation, APP-014 shall provide:

- Creative assistance — content review, refinement, organization, writing assistance, design recommendations, documentation assistance
- Knowledge assistance — reference retrieval, specification lookup, constitutional guidance
- Content understanding — structured analysis of enterprise documents, assets, and design artifacts
- Creative recommendations — context-aware suggestions grounded in enterprise knowledge
- Organizational guidance — project structure, content taxonomy, design system alignment
- Context-aware intelligence — session-scoped awareness of user, tenant, project, workspace, and active documents
- Structured AI orchestration — governed prompt composition consuming ENG-009

**APP-014 does not create or govern projects, components, templates, publications, assets, visualizations, or workspaces.** Those responsibilities remain with MASS-APP-013. APP-014 consumes APP-013 artifacts as read-only references.

**APP-014 does not reimplement AI orchestration.** ENG-009 (AI Engine) owns model selection, prompt execution, token management, rate limiting, and response streaming. APP-014 defines the domain-specific prompt layers and session context that feed into ENG-009.

This volume does not define AI image generation, AI document generation, autonomous decision making, cross-tenant learning, Intent Intelligence, Relationship Intelligence, Learning Intelligence, Confidence Engine, marketplace capabilities, or agent orchestration beyond approved Engineering Library boundaries. These remain outside V1 scope.

## 2. Scope

### Included

- Application architecture and boundaries
- Creative Intelligence domain model
- User roles and permissions
- Capability model
- Intelligence sessions and lifecycle
- Context management
- Knowledge references
- Prompt governance and composition
- Creative assistance services
- Service architecture
- Engineering constraints

### Excluded

- AI image generation (future)
- AI document generation (future)
- Autonomous decision making (future)
- Cross-tenant learning (future)
- Intent Intelligence (future)
- Relationship Intelligence (future)
- Learning Intelligence (future)
- Confidence Engine (future)
- Marketplace capabilities (future)
- Agent orchestration beyond ENG-009 (future)

## 3. Platform Consumption Map

| Platform Service | How V01 Consumes It |
|------------------|---------------------|
| ENG-002 Enterprise Core | Tenant context, entity ID generation, lifecycle state patterns |
| ENG-003 Identity Engine | User authentication, tenant resolution |
| ENG-004 Security Framework | Row Level Security policies |
| ENG-005 Event Bus Engine | Session lifecycle event publication |
| ENG-007 Knowledge Engine | Enterprise knowledge retrieval for references |
| ENG-009 AI Engine | Prompt execution, model orchestration, token management, response streaming |
| ENG-010 Notification Engine | Session notifications where applicable |
| ENG-012 Persistence Framework | PostgreSQL connection, migration patterns |
| ENG-015 API Framework | REST endpoint structure, request validation |
| ENG-024 Analytics Engine | Analytics-source boundary (V01 does not perform analytics) |
| ENG-027 Executive Intelligence | Executive knowledge references where applicable |

### Application Consumption Map

| Application | How V01 Consumes It |
|-------------|---------------------|
| APP-013 V02 — Projects & Workspaces | Session context references projects and workspaces |
| APP-013 V03 — Components & Design System | Context references active components and tokens |
| APP-013 V04 — Templates & Publishing | Context references templates and publications |
| APP-013 V05 — Assets | Context references active assets |
| APP-013 V06 — Content | Context references active content items |
| APP-013 V07 — Visualizations | Context references active visualizations |

**Consumption Pattern:** APP-014 holds read-only references to APP-013 entities. It never creates, modifies, or deletes APP-013 records. If an APP-013 entity is archived or deleted, the reference in APP-014 is marked as stale.

### Responsibilities Owned by V01

- Creative session CRUD and lifecycle
- Session context assembly and management
- Knowledge reference retrieval and indexing
- Prompt layer definition and governance
- Prompt composition assembly
- Creative assistance request orchestration
- Session history persistence
- Intelligence workspace organization
- Session search and discovery

### Responsibilities Delegated

- AI model execution → ENG-009 (AI Engine)
- Knowledge retrieval → ENG-007 (Knowledge Engine)
- Authentication and tenant isolation → ENG-003, ENG-004
- Event distribution → ENG-005
- Notification transport → ENG-010
- API conventions → ENG-015
- Project/workspace context → APP-013 V02
- Component/token context → APP-013 V03
- Template/publication context → APP-013 V04
- Asset context → APP-013 V05
- Content context → APP-013 V06
- Visualization context → APP-013 V07

### Enterprise Events Published

| Event | Trigger |
|-------|---------|
| `creative_session.created` | New session created |
| `creative_session.updated` | Session metadata modified |
| `creative_session.archived` | Session archived |
| `creative_session.restored` | Session restored from archive |
| `creative_session.deleted` | Session soft-deleted |
| `creative_session.context.updated` | Session context changed |
| `creative_assistance.requested` | Assistance request initiated |
| `creative_assistance.completed` | Assistance response delivered |
| `knowledge_reference.created` | Knowledge reference added |
| `knowledge_reference.stale` | Referenced entity archived/deleted |

### Enterprise Events Consumed

| Event | Response |
|-------|----------|
| `project.deleted` | Mark project references in session contexts as stale |
| `asset.archived` | Mark asset references in session contexts as stale |
| `component.archived` | Mark component references in session contexts as stale |
| `content.archived` | Mark content references in session contexts as stale |
| `visualization.archived` | Mark visualization references in session contexts as stale |
| `publication.archived` | Mark publication references in session contexts as stale |

## 4. Constitutional Boundary Statement

This volume owns creative session management, session context assembly, knowledge reference retrieval, prompt governance and composition, creative assistance orchestration, session history, intelligence workspace organization, and session discovery within Creative & Knowledge Intelligence. It does not own and shall not duplicate: the enterprise knowledge being referenced (ENG-007, ENG-027); AI model execution, prompt routing, token management, or response streaming (ENG-009); project, component, template, publication, asset, visualization, or workspace governance (APP-013); analytical calculation (ENG-024); communication delivery (ENG-023); user authentication (ENG-003); security policy enforcement (ENG-004); event distribution (ENG-005); notification transport (ENG-010); or API framework conventions (ENG-015).

**Consumer Application Boundary:** APP-014 is a consumer application, not a platform application. It leverages the Engineering Library and the completed Design Studio application rather than reimplementing their responsibilities. APP-014 assembles domain-specific context and prompt layers, then delegates execution to ENG-009. It receives structured responses and presents them to users. It does not manage model selection, token budgets, rate limits, or streaming infrastructure.

**No Autonomous Execution:** All creative assistance is advisory. APP-014 provides recommendations, reviews, refinements, and suggestions. It does not autonomously create, modify, or delete enterprise content. Users must explicitly act on recommendations through APP-013.

## 5. Application Architecture

### 5.1 Architectural Position

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│         Creative Intelligence Experience                 │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│              MASS-APP-014                                │
│        Creative & Knowledge Intelligence                 │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Creative  │  │ Knowledge│  │  Prompt  │              │
│  │ Sessions  │  │ Refs     │  │Governance│              │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘              │
│        │              │              │                   │
│  ┌─────▼──────────────▼──────────────▼────┐             │
│  │        Session Context Assembly         │             │
│  └─────────────────┬──────────────────────┘             │
│                    │                                     │
│  ┌─────────────────▼──────────────────────┐             │
│  │     Creative Assistance Orchestration   │             │
│  └─────────────────┬──────────────────────┘             │
└────────────────────┼────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼───┐  ┌────▼───┐  ┌────▼───┐
   │ENG-009 │  │ENG-007 │  │APP-013 │
   │AI      │  │Knowledge│ │Design  │
   │Engine  │  │Engine  │  │Studio  │
   └────────┘  └────────┘  └────────┘
```

### 5.2 Request Flow

1. User opens or creates a creative session
2. APP-014 assembles session context from user state and APP-013 references
3. User issues a creative assistance request (review, refine, organize)
4. APP-014 composes the prompt from governance layers and session context
5. APP-014 sends the composed prompt to ENG-009 for execution
6. ENG-009 returns the structured response
7. APP-014 persists the exchange in session history
8. APP-014 presents the response to the user
9. User acts on recommendations through APP-013 (if applicable)

### 5.3 Capability Model

| Capability | Description | Consumes |
|------------|-------------|----------|
| Content Review | Analyze content for quality, consistency, tone, and completeness | APP-013 V06, ENG-009 |
| Content Refinement | Suggest improvements to existing content | APP-013 V06, ENG-009 |
| Content Organization | Recommend structure, taxonomy, and information architecture | APP-013 V02/V06, ENG-009 |
| Writing Assistance | Support drafting, editing, and style alignment | APP-013 V06, ENG-009 |
| Design Recommendations | Suggest component usage, layout, and design-system alignment | APP-013 V03/V07, ENG-009 |
| Documentation Assistance | Support specification, manual, and procedure drafting | ENG-007, ENG-009 |

All capabilities are advisory. None perform autonomous execution.

## 6. User Roles

| Role | Session Access | Assistance Access | Knowledge Access | Prompt Access | Workspace Access |
|------|---------------|-------------------|-----------------|---------------|-----------------|
| Viewer | View shared sessions | No | View references | No | View |
| Editor | Create, edit own sessions | Request assistance | View, create references | View composition | Create, edit |
| Admin | All sessions in tenant | Request assistance | Full reference management | Manage prompt layers | Full management |

## 7. Intelligence Sessions

### 7.1 Session Model

A creative session is a governed conversation container that holds context, history, and references. Sessions are tenant-scoped and user-owned.

```
CreativeSession
├── Identity (ID, tenant, owner)
├── Classification (title, description, purpose)
├── Context (project, workspace, active entities)
├── History (ordered exchange records)
├── Knowledge References (linked enterprise knowledge)
├── Prompt Composition (assembled governance layers)
├── Workspace (organizational container)
├── Tags (freeform categorization)
├── Favorites (user quick access)
└── Lifecycle (status, timestamps)
```

### 7.2 Session Lifecycle

| State | Description | Transitions |
|-------|-------------|-------------|
| Active | Session in use. Context and history are live. | → Archived |
| Archived | Session preserved for reference. Read-only. | → Active (restore) |
| Deleted | Soft-deleted. Not visible in listings. | Terminal |

Sessions do not have an approval workflow — they are working tools, not governed artifacts. The governed artifacts they help create live in APP-013.

### 7.3 Session Purpose

Each session declares a purpose that guides prompt composition and capability selection.

| Purpose | Description | Primary Capabilities |
|---------|-------------|---------------------|
| content_review | Review existing content | Content Review |
| content_creation | Assist with creating new content | Writing Assistance, Content Organization |
| content_refinement | Improve existing content | Content Refinement |
| design_review | Review design decisions | Design Recommendations |
| documentation | Assist with documentation | Documentation Assistance |
| general | General creative assistance | All capabilities |

## 8. Context Management

### 8.1 Session Context

Each session maintains a context object that tracks the user's working state. Context is assembled from tenant state and APP-013 entity references.

| Context Field | Source | Description |
|---------------|--------|-------------|
| user_id | ENG-003 | Authenticated user |
| tenant_id | ENG-003 | Tenant scope |
| project_ref | APP-013 V02 | Optional associated project |
| workspace_ref | APP-013 V02 | Optional associated workspace |
| active_documents | APP-013 V06 | Content items currently in focus |
| active_assets | APP-013 V05 | Assets currently in focus |
| active_components | APP-013 V03 | Components currently in focus |
| active_visualizations | APP-013 V07 | Visualizations currently in focus |
| active_templates | APP-013 V04 | Templates currently in focus |
| session_metadata | APP-014 | Additional session-specific key-value pairs |

### 8.2 Context Rules

- Context references are read-only pointers to APP-013 entities
- Adding a reference does not modify the referenced entity
- References are validated at creation: the entity must exist and belong to the same tenant
- If a referenced entity is archived or deleted, the reference is marked stale (via event consumption)
- Context is mutable while the session is Active
- Context is frozen when the session is Archived
- Maximum 20 active entity references per context field (to bound prompt assembly size)

### 8.3 Context Assembly

When a creative assistance request is made, APP-014 assembles the full context:

1. Read session context (project, workspace, active entities)
2. Fetch current state of referenced entities from APP-013 (metadata only, not full content)
3. Retrieve applicable knowledge references
4. Compose prompt layers in governance order
5. Package as structured input for ENG-009

## 9. Knowledge References

### 9.1 Knowledge Reference Model

Knowledge references connect sessions to enterprise knowledge for grounding AI responses.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | FK → creative_session |
| reference_type | VARCHAR(30) | Type of knowledge being referenced |
| reference_id | UUID | ID of the referenced knowledge entity |
| context | VARCHAR(100) | Usage context (NOT NULL DEFAULT '') |
| title | VARCHAR(255) | Display title (cached from source) |
| is_stale | BOOLEAN | Whether the source has been archived/deleted |
| created_by | UUID | Who created the reference |
| created_at | TIMESTAMPTZ | When created |

### 9.2 Reference Types

| Type | Description | Source |
|------|-------------|--------|
| engineering_spec | Engineering Library specification | ENG-007 |
| constitution | Constitutional document | ENG-007 |
| application_manual | Application production manual | ENG-007 |
| enterprise_document | Enterprise document | ENG-008 |
| design_artifact | Design Studio artifact (project, template, component, etc.) | APP-013 |

### 9.3 Reference Rules

- Knowledge references are read-only — APP-014 reads but never modifies referenced knowledge
- References are tenant-scoped — application-layer validation ensures same-tenant access
- `context` NOT NULL DEFAULT '' for uniqueness constraint integrity
- `UNIQUE (session_id, reference_type, reference_id, context)` prevents duplicate references
- Stale references are preserved with visual indicator, not deleted
- Reference retrieval flows through ENG-007 (Knowledge Engine), not direct database queries to other applications

## 10. Prompt Governance

### 10.1 Prompt Layers

Prompt governance defines how instructions are composed before being sent to ENG-009. Layers are assembled in a fixed order to ensure organizational policy takes precedence over individual preference.

| Layer | Scope | Description | Mutability |
|-------|-------|-------------|------------|
| System | Platform | Base system instructions from ENG-009 | Immutable (owned by ENG-009) |
| Organizational | Tenant | Tenant-wide policies, tone, terminology, brand guidelines | Admin only |
| Workspace | Workspace | Workspace-specific context and instructions | Admin or workspace owner |
| Session | Session | Session-specific instructions and context | Session owner |
| User | Request | Per-request user input | User at request time |

### 10.2 Prompt Layer Model

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| tenant_id | UUID | Tenant scope (FK) |
| layer_type | VARCHAR(20) | organizational, workspace, session |
| scope_id | UUID | Scoping entity ID (tenant, workspace, or session) |
| name | VARCHAR(255) | Layer name |
| content | TEXT | Prompt layer content |
| position | INTEGER | Order within layer type |
| is_active | BOOLEAN | Whether layer is active |
| created_by | UUID | Who created |
| created_at | TIMESTAMPTZ | When created |
| updated_at | TIMESTAMPTZ | When last modified |

### 10.3 Prompt Composition

Prompt composition is the assembled, ordered set of active prompt layers for a specific assistance request. APP-014 assembles the composition; ENG-009 executes it.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | FK → creative_session |
| composed_at | TIMESTAMPTZ | When assembled |
| layers | JSONB | Ordered array of layer references and content snapshots |
| context_snapshot | JSONB | Frozen context at composition time |
| token_estimate | INTEGER | Estimated token count |

### 10.4 Composition Rules

- System layer is always first — APP-014 does not modify it, ENG-009 provides it
- Organizational layers follow system, in position order
- Workspace layers follow organizational, in position order
- Session layers follow workspace, in position order
- User prompt is always last
- Inactive layers are excluded from composition
- Token estimate is computed before submission to ENG-009 for budget validation
- Composition is persisted as a snapshot for auditability — if layers change later, historical compositions are preserved

### 10.5 Governance Boundary

APP-014 defines the domain-specific prompt layer content (organizational policies, workspace context, session instructions). ENG-009 owns the system prompt, model selection, token management, rate limiting, response formatting, and streaming infrastructure. APP-014 assembles and submits; ENG-009 executes and returns.

## 11. Creative Assistance Services

### 11.1 Assistance Request Model

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | FK → creative_session |
| request_type | VARCHAR(30) | review, refine, organize, write, recommend, document |
| user_prompt | TEXT | User's request text |
| composition_id | UUID | FK → prompt_composition (snapshot used) |
| target_entity_type | VARCHAR(30) | Optional: type of entity being acted upon |
| target_entity_id | UUID | Optional: ID of entity being acted upon |
| status | VARCHAR(20) | pending, processing, completed, failed |
| created_at | TIMESTAMPTZ | When requested |
| completed_at | TIMESTAMPTZ | When response delivered |

### 11.2 Assistance Response Model

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| request_id | UUID | FK → assistance_request |
| response_body | TEXT | Structured response content |
| response_metadata | JSONB | Token usage, model, latency |
| created_at | TIMESTAMPTZ | When received from ENG-009 |

### 11.3 Request Types

| Type | Description | Input | Output |
|------|-------------|-------|--------|
| review | Analyze content for quality, consistency, tone | Content reference + criteria | Structured review with findings |
| refine | Suggest improvements to content | Content reference + direction | Refined content suggestions |
| organize | Recommend structure and taxonomy | Entity references + goals | Organization recommendations |
| write | Assist with drafting new content | Context + instructions | Draft content |
| recommend | Provide design or content recommendations | Context + question | Structured recommendations |
| document | Assist with documentation | Context + scope | Documentation draft |

### 11.4 Assistance Rules

- All assistance is advisory — responses are suggestions, not commands
- No autonomous execution: APP-014 never creates, modifies, or deletes APP-013 entities
- Users act on recommendations manually through APP-013
- Request and response are persisted as session history
- Failed requests are logged with failure reason
- Target entity references are optional — assistance may be context-only
- Response body is structured text, not raw model output — APP-014 formats ENG-009 responses

## 12. Session History

### 12.1 History Model

Session history is the ordered record of all exchanges within a session.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | FK → creative_session |
| sequence | INTEGER | Order within session |
| entry_type | VARCHAR(20) | request, response, context_change, note |
| request_id | UUID | Optional FK → assistance_request |
| response_id | UUID | Optional FK → assistance_response |
| summary | TEXT | Brief summary for display |
| created_at | TIMESTAMPTZ | When recorded |

### 12.2 History Rules

- History is append-only — entries are never modified or deleted
- Sequence numbers are monotonically increasing within a session
- Context changes are recorded as history entries for auditability
- History is frozen when the session is archived

## 13. Intelligence Workspace

### 13.1 Workspace Model

Intelligence workspaces organize sessions into logical groups. They are distinct from APP-013 project workspaces — an intelligence workspace may span multiple APP-013 projects.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| tenant_id | UUID | Tenant scope (FK) |
| name | VARCHAR(255) | Workspace name |
| description | TEXT | Optional description |
| owner_id | UUID | Workspace owner (FK) |
| created_at | TIMESTAMPTZ | When created |
| updated_at | TIMESTAMPTZ | When last modified |
| archived_at | TIMESTAMPTZ | When archived |

### 13.2 Workspace Rules

- Workspaces are tenant-scoped
- Sessions may optionally belong to a workspace
- Workspaces do not impose lifecycle constraints on sessions
- Workspace-scoped prompt layers apply to all sessions within the workspace
- Intelligence workspaces are organizational containers, not governance boundaries

## 14. Data Model

### 14.1 Entity Definitions

**CreativeSession**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| title | VARCHAR(255) | No | — | Session title |
| description | TEXT | Yes | NULL | Description |
| purpose | VARCHAR(30) | No | 'general' | Session purpose |
| workspace_id | UUID | Yes | NULL | Optional intelligence workspace (FK) |
| status | VARCHAR(20) | No | 'active' | active, archived, deleted |
| owner_id | UUID | No | — | Session owner (FK) |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |
| archived_at | TIMESTAMPTZ | Yes | NULL | When archived |
| deleted_at | TIMESTAMPTZ | Yes | NULL | When soft-deleted |

**SessionContext**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| session_id | UUID | No | — | FK → creative_session (UNIQUE) |
| project_ref | UUID | Yes | NULL | APP-013 project reference |
| workspace_ref | UUID | Yes | NULL | APP-013 workspace reference |
| active_documents | UUID[] | No | '{}' | APP-013 content item IDs |
| active_assets | UUID[] | No | '{}' | APP-013 asset IDs |
| active_components | UUID[] | No | '{}' | APP-013 component IDs |
| active_visualizations | UUID[] | No | '{}' | APP-013 visualization IDs |
| active_templates | UUID[] | No | '{}' | APP-013 template IDs |
| metadata | JSONB | Yes | NULL | Additional key-value pairs |
| updated_at | TIMESTAMPTZ | No | now() | When last modified |

**KnowledgeReference**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| session_id | UUID | No | — | FK → creative_session |
| reference_type | VARCHAR(30) | No | — | Reference type |
| reference_id | UUID | No | — | Referenced entity ID |
| context | VARCHAR(100) | No | '' | Usage context |
| title | VARCHAR(255) | No | — | Display title |
| is_stale | BOOLEAN | No | false | Source archived/deleted |
| created_by | UUID | No | — | Who created (FK) |
| created_at | TIMESTAMPTZ | No | now() | When created |

**PromptLayer**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| layer_type | VARCHAR(20) | No | — | organizational, workspace, session |
| scope_id | UUID | No | — | Scoping entity ID |
| name | VARCHAR(255) | No | — | Layer name |
| content | TEXT | No | — | Prompt layer content |
| position | INTEGER | No | 0 | Order within layer type |
| is_active | BOOLEAN | No | true | Whether active |
| created_by | UUID | No | — | Who created (FK) |
| created_at | TIMESTAMPTZ | No | now() | When created |
| updated_at | TIMESTAMPTZ | No | now() | When last modified |

**PromptComposition**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| session_id | UUID | No | — | FK → creative_session |
| composed_at | TIMESTAMPTZ | No | now() | When assembled |
| layers | JSONB | No | — | Ordered layer snapshots |
| context_snapshot | JSONB | No | — | Frozen context at composition |
| token_estimate | INTEGER | No | 0 | Estimated token count |

**AssistanceRequest**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| session_id | UUID | No | — | FK → creative_session |
| request_type | VARCHAR(30) | No | — | review, refine, organize, write, recommend, document |
| user_prompt | TEXT | No | — | User's request text |
| composition_id | UUID | No | — | FK → prompt_composition |
| target_entity_type | VARCHAR(30) | Yes | NULL | Entity type being acted upon |
| target_entity_id | UUID | Yes | NULL | Entity ID being acted upon |
| status | VARCHAR(20) | No | 'pending' | pending, processing, completed, failed |
| failure_reason | TEXT | Yes | NULL | Why failed |
| created_at | TIMESTAMPTZ | No | now() | When requested |
| completed_at | TIMESTAMPTZ | Yes | NULL | When response delivered |

**AssistanceResponse**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| request_id | UUID | No | — | FK → assistance_request (UNIQUE) |
| response_body | TEXT | No | — | Structured response content |
| response_metadata | JSONB | Yes | NULL | Token usage, model, latency |
| created_at | TIMESTAMPTZ | No | now() | When received |

**SessionHistory**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| session_id | UUID | No | — | FK → creative_session |
| sequence | INTEGER | No | — | Order within session |
| entry_type | VARCHAR(20) | No | — | request, response, context_change, note |
| request_id | UUID | Yes | NULL | FK → assistance_request |
| response_id | UUID | Yes | NULL | FK → assistance_response |
| summary | TEXT | No | — | Brief summary for display |
| created_at | TIMESTAMPTZ | No | now() | When recorded |

**IntelligenceWorkspace**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(255) | No | — | Workspace name |
| description | TEXT | Yes | NULL | Description |
| owner_id | UUID | No | — | Owner (FK) |
| created_at | TIMESTAMPTZ | No | now() | When created |
| updated_at | TIMESTAMPTZ | No | now() | When modified |
| archived_at | TIMESTAMPTZ | Yes | NULL | When archived |

**SessionTag**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| session_id | UUID | No | — | FK → creative_session |
| tag | VARCHAR(100) | No | — | Tag value |
| created_at | TIMESTAMPTZ | No | now() | When created |

**SessionFavorite**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| user_id | UUID | No | — | User (FK) |
| session_id | UUID | No | — | FK → creative_session |
| favorited_at | TIMESTAMPTZ | No | now() | When favorited |

### 14.2 Constraints

- `creative_session.tenant_id` + `creative_session.title` is unique
- `session_context.session_id` is unique (one context per session)
- `knowledge_reference.session_id` + `reference_type` + `reference_id` + `context` is unique
- `prompt_layer.tenant_id` + `layer_type` + `scope_id` + `name` is unique
- `session_history.session_id` + `session_history.sequence` is unique
- `assistance_response.request_id` is unique (one response per request)
- `intelligence_workspace.tenant_id` + `intelligence_workspace.name` is unique
- `session_tag.session_id` + `session_tag.tag` is unique
- `session_favorite.user_id` + `session_favorite.session_id` is primary key

### 14.3 Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| creative_session | idx_cs_tenant | tenant_id, status | Tenant listing |
| creative_session | idx_cs_owner | owner_id | Owner lookup |
| creative_session | idx_cs_workspace | workspace_id | Workspace filtering |
| creative_session | idx_cs_purpose | purpose | Purpose filtering |
| session_context | idx_sc_session | session_id | Context lookup |
| knowledge_reference | idx_kr_session | session_id | Refs per session |
| knowledge_reference | idx_kr_entity | reference_type, reference_id | Entity lookups |
| prompt_layer | idx_pl_tenant | tenant_id, layer_type | Tenant layer listing |
| prompt_layer | idx_pl_scope | scope_id | Scope lookup |
| prompt_composition | idx_pc_session | session_id | Compositions per session |
| assistance_request | idx_ar_session | session_id | Requests per session |
| assistance_request | idx_ar_status | status | Status filtering |
| assistance_response | idx_ares_request | request_id | Response lookup |
| session_history | idx_sh_session | session_id, sequence | History ordering |
| intelligence_workspace | idx_iw_tenant | tenant_id | Tenant listing |
| intelligence_workspace | idx_iw_owner | owner_id | Owner lookup |
| session_tag | idx_st_tag | tag | Tag lookup |

## 15. API Specification

### 15.1 Session Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /creative-sessions | List sessions (paginated, filterable) | Viewer |
| GET | /creative-sessions/{id} | Get session with context | Viewer |
| POST | /creative-sessions | Create session | Editor |
| PATCH | /creative-sessions/{id} | Update session metadata | Editor |
| DELETE | /creative-sessions/{id} | Soft-delete session | Admin |
| POST | /creative-sessions/{id}/archive | Archive session | Editor |
| POST | /creative-sessions/{id}/restore | Restore session | Editor |

### 15.2 Context Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /creative-sessions/{id}/context | Get session context | Viewer |
| PATCH | /creative-sessions/{id}/context | Update session context | Editor |

### 15.3 Knowledge Reference Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /creative-sessions/{id}/knowledge-references | List references for session | Viewer |
| POST | /creative-sessions/{id}/knowledge-references | Add knowledge reference | Editor |
| DELETE | /creative-sessions/{id}/knowledge-references/{refId} | Remove knowledge reference | Editor |
| POST | /knowledge-references/search | Search available knowledge | Viewer |

### 15.4 Prompt Layer Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /prompt-layers | List prompt layers for tenant | Viewer |
| GET | /prompt-layers/{id} | Get prompt layer | Viewer |
| POST | /prompt-layers | Create prompt layer | Admin |
| PATCH | /prompt-layers/{id} | Update prompt layer | Admin |
| DELETE | /prompt-layers/{id} | Delete prompt layer | Admin |

### 15.5 Prompt Composition Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| POST | /creative-sessions/{id}/compose | Compose prompt for session | Editor |
| GET | /creative-sessions/{id}/compositions | List past compositions | Viewer |

### 15.6 Creative Assistance Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| POST | /creative-sessions/{id}/assist/review | Request content review | Editor |
| POST | /creative-sessions/{id}/assist/refine | Request content refinement | Editor |
| POST | /creative-sessions/{id}/assist/organize | Request organization guidance | Editor |
| POST | /creative-sessions/{id}/assist/write | Request writing assistance | Editor |
| POST | /creative-sessions/{id}/assist/recommend | Request recommendations | Editor |
| POST | /creative-sessions/{id}/assist/document | Request documentation assistance | Editor |
| GET | /creative-sessions/{id}/history | Get session history | Viewer |

### 15.7 Workspace Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /intelligence-workspaces | List workspaces | Viewer |
| GET | /intelligence-workspaces/{id} | Get workspace | Viewer |
| POST | /intelligence-workspaces | Create workspace | Editor |
| PATCH | /intelligence-workspaces/{id} | Update workspace | Editor |
| DELETE | /intelligence-workspaces/{id} | Archive workspace | Admin |

### 15.8 Favorite Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| POST | /creative-sessions/{id}/favorite | Favorite | Viewer |
| DELETE | /creative-sessions/{id}/favorite | Unfavorite | Viewer |

### 15.9 Query Parameters — GET /creative-sessions

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: active, archived, all (default: active) |
| purpose | string | Filter by session purpose |
| search | string | Search by title and description |
| tag | string | Filter by tag |
| owner | UUID | Filter by owner |
| workspace | UUID | Filter by intelligence workspace |
| project_ref | UUID | Filter by APP-013 project reference |
| favorited | boolean | Filter to favorites |
| created_after | ISO date | Creation date lower bound |
| created_before | ISO date | Creation date upper bound |
| sort | string | title, created_at (default), updated_at |
| order | string | asc, desc (default) |
| limit | integer | Page size (default 25, max 100) |
| offset | integer | Pagination offset (default 0) |

### 15.10 Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400 | INVALID_INPUT | Missing required fields or invalid values |
| 400 | CONTEXT_LIMIT_EXCEEDED | More than 20 active entity references per field |
| 400 | INVALID_REQUEST_TYPE | Unknown assistance request type |
| 401 | UNAUTHORIZED | No valid session |
| 403 | FORBIDDEN | Insufficient role |
| 404 | NOT_FOUND | Entity not found or not accessible |
| 409 | CONFLICT | Duplicate session title within tenant |
| 409 | DUPLICATE_REFERENCE | Knowledge reference already exists |
| 422 | INVALID_STATE_TRANSITION | State transition not permitted |
| 422 | STALE_REFERENCE | Referenced entity is stale |
| 422 | SESSION_ARCHIVED | Action on archived session |
| 502 | AI_ENGINE_ERROR | ENG-009 returned an error |
| 504 | AI_ENGINE_TIMEOUT | ENG-009 did not respond in time |

## 16. Permission Model

| Role | Sessions | Context | Knowledge | Prompt Layers | Assistance | Workspaces |
|------|----------|---------|-----------|---------------|------------|------------|
| Viewer | View shared | View | View | View | No | View |
| Editor | Own CRUD | Own sessions | CRUD | View | Request | Own CRUD |
| Admin | All CRUD | All sessions | Full | Full CRUD | Request | Full CRUD |

Row Level Security enforces tenant isolation on all APP-014 tables.

## 17. Migration SQL Reference

```sql
-- 001_create_intelligence_workspaces.sql
CREATE TABLE intelligence_workspace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ,
  UNIQUE (tenant_id, name)
);

CREATE INDEX idx_iw_tenant ON intelligence_workspace(tenant_id);
CREATE INDEX idx_iw_owner ON intelligence_workspace(owner_id);

-- 002_create_creative_sessions.sql
CREATE TABLE creative_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  purpose VARCHAR(30) NOT NULL DEFAULT 'general'
    CHECK (purpose IN (
      'content_review', 'content_creation', 'content_refinement',
      'design_review', 'documentation', 'general'
    )),
  workspace_id UUID REFERENCES intelligence_workspace(id),
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'archived', 'deleted')),
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  UNIQUE (tenant_id, title)
);

CREATE INDEX idx_cs_tenant ON creative_session(tenant_id, status);
CREATE INDEX idx_cs_owner ON creative_session(owner_id);
CREATE INDEX idx_cs_workspace ON creative_session(workspace_id);
CREATE INDEX idx_cs_purpose ON creative_session(purpose);

-- 003_create_session_contexts.sql
CREATE TABLE session_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE REFERENCES creative_session(id) ON DELETE CASCADE,
  project_ref UUID,
  workspace_ref UUID,
  active_documents UUID[] NOT NULL DEFAULT '{}',
  active_assets UUID[] NOT NULL DEFAULT '{}',
  active_components UUID[] NOT NULL DEFAULT '{}',
  active_visualizations UUID[] NOT NULL DEFAULT '{}',
  active_templates UUID[] NOT NULL DEFAULT '{}',
  metadata JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sc_session ON session_context(session_id);

-- 004_create_knowledge_references.sql
CREATE TABLE knowledge_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES creative_session(id) ON DELETE CASCADE,
  reference_type VARCHAR(30) NOT NULL
    CHECK (reference_type IN (
      'engineering_spec', 'constitution', 'application_manual',
      'enterprise_document', 'design_artifact'
    )),
  reference_id UUID NOT NULL,
  context VARCHAR(100) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL,
  is_stale BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, reference_type, reference_id, context)
);

CREATE INDEX idx_kr_session ON knowledge_reference(session_id);
CREATE INDEX idx_kr_entity ON knowledge_reference(reference_type, reference_id);

-- 005_create_prompt_layers.sql
CREATE TABLE prompt_layer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  layer_type VARCHAR(20) NOT NULL
    CHECK (layer_type IN ('organizational', 'workspace', 'session')),
  scope_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, layer_type, scope_id, name)
);

CREATE INDEX idx_pl_tenant ON prompt_layer(tenant_id, layer_type);
CREATE INDEX idx_pl_scope ON prompt_layer(scope_id);

-- 006_create_prompt_compositions.sql
CREATE TABLE prompt_composition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES creative_session(id) ON DELETE CASCADE,
  composed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  layers JSONB NOT NULL,
  context_snapshot JSONB NOT NULL,
  token_estimate INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_pc_session ON prompt_composition(session_id);

-- 007_create_assistance_requests.sql
CREATE TABLE assistance_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES creative_session(id) ON DELETE CASCADE,
  request_type VARCHAR(30) NOT NULL
    CHECK (request_type IN (
      'review', 'refine', 'organize', 'write', 'recommend', 'document'
    )),
  user_prompt TEXT NOT NULL,
  composition_id UUID NOT NULL REFERENCES prompt_composition(id),
  target_entity_type VARCHAR(30),
  target_entity_id UUID,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_ar_session ON assistance_request(session_id);
CREATE INDEX idx_ar_status ON assistance_request(status);

-- 008_create_assistance_responses.sql
CREATE TABLE assistance_response (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL UNIQUE REFERENCES assistance_request(id) ON DELETE CASCADE,
  response_body TEXT NOT NULL,
  response_metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ares_request ON assistance_response(request_id);

-- 009_create_session_history.sql
CREATE TABLE session_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES creative_session(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  entry_type VARCHAR(20) NOT NULL
    CHECK (entry_type IN ('request', 'response', 'context_change', 'note')),
  request_id UUID REFERENCES assistance_request(id),
  response_id UUID REFERENCES assistance_response(id),
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, sequence)
);

CREATE INDEX idx_sh_session ON session_history(session_id, sequence);

-- 010_create_session_tags.sql
CREATE TABLE session_tag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES creative_session(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, tag)
);

CREATE INDEX idx_st_tag ON session_tag(tag);

-- 011_create_session_favorites.sql
CREATE TABLE session_favorite (
  user_id UUID NOT NULL REFERENCES users(id),
  session_id UUID NOT NULL REFERENCES creative_session(id) ON DELETE CASCADE,
  favorited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, session_id)
);

-- 012_create_v01_rls_policies.sql

ALTER TABLE intelligence_workspace ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_layer ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_composition ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistance_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistance_response ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_favorite ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON intelligence_workspace
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_isolation ON creative_session
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_isolation ON session_context
  USING (session_id IN (
    SELECT id FROM creative_session WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON knowledge_reference
  USING (session_id IN (
    SELECT id FROM creative_session WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON prompt_layer
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_isolation ON prompt_composition
  USING (session_id IN (
    SELECT id FROM creative_session WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON assistance_request
  USING (session_id IN (
    SELECT id FROM creative_session WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON assistance_response
  USING (request_id IN (
    SELECT ar.id FROM assistance_request ar
    JOIN creative_session cs ON ar.session_id = cs.id
    WHERE cs.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON session_history
  USING (session_id IN (
    SELECT id FROM creative_session WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON session_tag
  USING (session_id IN (
    SELECT id FROM creative_session WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON session_favorite
  USING (session_id IN (
    SELECT id FROM creative_session WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

-- 013_create_v01_enforcement_triggers.sql

-- Prevent modifications to archived sessions
CREATE OR REPLACE FUNCTION prevent_archived_session_mutation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'archived' AND NEW.status = 'archived' THEN
    RAISE EXCEPTION 'Cannot modify an archived session (session_id: %)', OLD.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_archived_session_immutable
  BEFORE UPDATE ON creative_session
  FOR EACH ROW
  EXECUTE FUNCTION prevent_archived_session_mutation();

-- Prevent context changes on archived sessions
CREATE OR REPLACE FUNCTION prevent_archived_context_mutation()
RETURNS TRIGGER AS $$
DECLARE
  session_status VARCHAR(20);
BEGIN
  SELECT status INTO session_status FROM creative_session
    WHERE id = COALESCE(OLD.session_id, NEW.session_id);
  IF session_status = 'archived' THEN
    RAISE EXCEPTION 'Cannot modify context of an archived session';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_archived_context_immutable
  BEFORE UPDATE OR DELETE ON session_context
  FOR EACH ROW
  EXECUTE FUNCTION prevent_archived_context_mutation();

-- Enforce append-only session history
CREATE OR REPLACE FUNCTION prevent_history_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Session history is append-only and cannot be modified or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_history_append_only
  BEFORE UPDATE OR DELETE ON session_history
  FOR EACH ROW
  EXECUTE FUNCTION prevent_history_mutation();

-- Enforce context array size limits (max 20 per field)
CREATE OR REPLACE FUNCTION enforce_context_array_limits()
RETURNS TRIGGER AS $$
BEGIN
  IF array_length(NEW.active_documents, 1) > 20 THEN
    RAISE EXCEPTION 'active_documents exceeds maximum of 20 references';
  END IF;
  IF array_length(NEW.active_assets, 1) > 20 THEN
    RAISE EXCEPTION 'active_assets exceeds maximum of 20 references';
  END IF;
  IF array_length(NEW.active_components, 1) > 20 THEN
    RAISE EXCEPTION 'active_components exceeds maximum of 20 references';
  END IF;
  IF array_length(NEW.active_visualizations, 1) > 20 THEN
    RAISE EXCEPTION 'active_visualizations exceeds maximum of 20 references';
  END IF;
  IF array_length(NEW.active_templates, 1) > 20 THEN
    RAISE EXCEPTION 'active_templates exceeds maximum of 20 references';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_context_array_limits
  BEFORE INSERT OR UPDATE ON session_context
  FOR EACH ROW
  EXECUTE FUNCTION enforce_context_array_limits();
```

## 18. Folder Structure — Creative Intelligence V01

```
apps/creative-intelligence/
├── src/
│   ├── app/
│   │   ├── (sessions)/
│   │   │   ├── page.tsx                       # Session library
│   │   │   ├── new/
│   │   │   │   └── page.tsx                   # Create session
│   │   │   └── [sessionId]/
│   │   │       ├── page.tsx                   # Session workspace
│   │   │       ├── history/
│   │   │       │   └── page.tsx               # Session history
│   │   │       └── references/
│   │   │           └── page.tsx               # Knowledge references
│   │   ├── (workspaces)/
│   │   │   ├── page.tsx                       # Workspace listing
│   │   │   └── [workspaceId]/
│   │   │       └── page.tsx                   # Workspace detail
│   │   ├── (prompt-governance)/
│   │   │   └── page.tsx                       # Prompt layer management
│   │   └── layout.tsx
│   ├── features/
│   │   ├── sessions/
│   │   │   ├── api/
│   │   │   │   ├── sessions.ts
│   │   │   │   ├── context.ts
│   │   │   │   └── history.ts
│   │   │   ├── components/
│   │   │   │   ├── SessionList.tsx
│   │   │   │   ├── SessionCard.tsx
│   │   │   │   ├── SessionWorkspace.tsx
│   │   │   │   ├── ContextPanel.tsx
│   │   │   │   ├── HistoryTimeline.tsx
│   │   │   │   └── PurposeSelector.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSession.ts
│   │   │   │   ├── useSessionList.ts
│   │   │   │   ├── useContext.ts
│   │   │   │   └── useHistory.ts
│   │   │   └── types/
│   │   │       └── session.ts
│   │   ├── knowledge/
│   │   │   ├── api/
│   │   │   │   ├── references.ts
│   │   │   │   └── search.ts
│   │   │   ├── components/
│   │   │   │   ├── ReferenceList.tsx
│   │   │   │   ├── ReferenceCard.tsx
│   │   │   │   └── KnowledgeSearch.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useReferences.ts
│   │   │   │   └── useKnowledgeSearch.ts
│   │   │   └── types/
│   │   │       └── knowledge.ts
│   │   ├── prompts/
│   │   │   ├── api/
│   │   │   │   ├── layers.ts
│   │   │   │   └── composition.ts
│   │   │   ├── components/
│   │   │   │   ├── PromptLayerList.tsx
│   │   │   │   ├── PromptLayerEditor.tsx
│   │   │   │   └── CompositionPreview.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePromptLayers.ts
│   │   │   │   └── useComposition.ts
│   │   │   └── types/
│   │   │       └── prompt.ts
│   │   ├── assistance/
│   │   │   ├── api/
│   │   │   │   └── assistance.ts
│   │   │   ├── components/
│   │   │   │   ├── AssistancePanel.tsx
│   │   │   │   ├── ReviewResult.tsx
│   │   │   │   ├── RefinementResult.tsx
│   │   │   │   ├── OrganizationResult.tsx
│   │   │   │   ├── WritingResult.tsx
│   │   │   │   ├── RecommendationResult.tsx
│   │   │   │   └── DocumentationResult.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAssistance.ts
│   │   │   └── types/
│   │   │       └── assistance.ts
│   │   └── workspaces/
│   │       ├── api/
│   │       │   └── workspaces.ts
│   │       ├── components/
│   │       │   ├── WorkspaceList.tsx
│   │       │   └── WorkspaceCard.tsx
│   │       ├── hooks/
│   │       │   └── useWorkspaces.ts
│   │       └── types/
│   │           └── workspace.ts
│   └── lib/
│       └── supabase/
│           └── client.ts
├── supabase/
│   └── migrations/
│       ├── 001_create_intelligence_workspaces.sql
│       ├── 002_create_creative_sessions.sql
│       ├── 003_create_session_contexts.sql
│       ├── 004_create_knowledge_references.sql
│       ├── 005_create_prompt_layers.sql
│       ├── 006_create_prompt_compositions.sql
│       ├── 007_create_assistance_requests.sql
│       ├── 008_create_assistance_responses.sql
│       ├── 009_create_session_history.sql
│       ├── 010_create_session_tags.sql
│       ├── 011_create_session_favorites.sql
│       ├── 012_create_v01_rls_policies.sql
│       └── 013_create_v01_enforcement_triggers.sql
└── package.json
```

## 19. Engineering Decisions

### 19.1 Consumer Application Architecture

APP-014 is a consumer application that assembles domain-specific context and prompt layers, delegates execution to ENG-009, and presents structured responses. It does not own model selection, token management, rate limiting, or streaming infrastructure. This separation ensures that AI orchestration improvements in ENG-009 automatically benefit APP-014 without modification.

### 19.2 Session Context via Array References

Active entity references (documents, assets, components, visualizations, templates) are stored as UUID arrays rather than junction tables. This reflects the context's nature as a working set rather than a relational model — the arrays are bounded (max 20), frequently rewritten as a whole, and used as input for prompt assembly rather than queried individually. Application-layer validation ensures referenced entities exist and belong to the same tenant.

### 19.3 Prompt Composition Snapshots

Prompt compositions are persisted as frozen snapshots (JSONB) rather than live references to prompt layers. This ensures auditability — when a user or administrator reviews what the AI received, the composition shows the exact layers and context at the time of the request, regardless of subsequent layer modifications.

### 19.4 Append-Only Session History

Session history is enforced as append-only by database trigger. This preserves a complete audit trail of all exchanges, context changes, and notes within a session. History cannot be rewritten or selectively deleted.

### 19.5 No Autonomous Execution

APP-014 returns advisory responses. It never calls APP-013 APIs to create, modify, or delete enterprise artifacts. Users must explicitly act on recommendations through APP-013. This boundary is architectural, not just policy — APP-014 has no write access to APP-013 entities.

### 19.6 Stale Reference Handling

When an APP-013 entity is archived or deleted, APP-014 event handlers set `is_stale = true` on matching knowledge references and flag context array entries. Stale references are preserved with a visual indicator — they are not automatically removed, because the session history that references them would become incoherent.

### 19.7 Concrete RLS Policies

All 11 APP-014 tables have explicit RLS policies in migration 012. Tables with direct tenant columns use equality checks. Child tables use subquery joins through creative_session.

### 19.8 Database-Enforced Constraints

Four enforcement triggers protect data integrity:
- Archived session immutability (prevents metadata changes on archived sessions)
- Archived context immutability (prevents context changes on archived sessions)
- Append-only session history (prevents modification or deletion of history entries)
- Context array limits (enforces maximum 20 references per field)

### 19.9 Intelligence Workspace vs APP-013 Workspace

Intelligence workspaces are organizational containers within APP-014 that group sessions. They are distinct from APP-013 project workspaces. A single intelligence workspace may reference sessions that span multiple APP-013 projects. The naming collision is intentional — both concepts represent "a place where related work is organized" within their respective domains.

## 20. Engineering Constraints

| Constraint | Specification |
|------------|--------------|
| Language | TypeScript (strict mode) |
| Architecture | Modular monolith |
| Application type | Consumer application (not platform) |
| Database | Supabase PostgreSQL |
| Row Level Security | Mandatory on all 11 tables — concrete policies defined |
| AI orchestration | Consumed via ENG-009, never reimplemented |
| Knowledge retrieval | Consumed via ENG-007, never reimplemented |
| APP-013 consumption | Read-only references, no write access |
| Autonomous execution | Prohibited — all assistance is advisory |
| Cross-tenant learning | Prohibited |
| Feature boundary | `features/sessions/`, `features/knowledge/`, `features/prompts/`, `features/assistance/`, `features/workspaces/` |
| Migrations | Sequential, APP-014-specific numbering (001+) |
| Session history | Append-only, database trigger enforced |
| Context array limits | Maximum 20 per field, database trigger enforced |
| Prompt governance | APP-014 composes, ENG-009 executes |
| API validation | Zod schemas for all request bodies |

---

## Constitutional Boundary Statement

MASS-APP-014-V01 owns creative session management, session context assembly, knowledge reference retrieval, prompt governance and composition, creative assistance orchestration, session history, intelligence workspace organization, and session discovery within Creative & Knowledge Intelligence. It does not own and shall not duplicate: the enterprise knowledge being referenced (ENG-007, ENG-027); AI model execution, prompt routing, token management, or response streaming (ENG-009); project, component, template, publication, asset, visualization, or workspace governance (APP-013); analytical calculation (ENG-024); communication delivery (ENG-023); user authentication (ENG-003); security policy enforcement (ENG-004); event distribution (ENG-005); notification transport (ENG-010); or API framework conventions (ENG-015). APP-014 is a consumer application. It assembles and submits; platform services execute and return. All creative assistance is advisory — no autonomous execution is permitted.

---

## Packaging Debt

| Item | Status | Notes |
|------|--------|-------|
| Production PDF | Deferred | Current manufacturing environment cannot generate PDF. Markdown is canonical. |
| Mermaid architecture diagram | Deferred | Architecture diagram documented in Section 5.1 as text. To be generated when tooling supports it. |
