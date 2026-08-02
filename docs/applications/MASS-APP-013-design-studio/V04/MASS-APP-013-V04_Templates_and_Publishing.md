# MASS-APP-013-V04 — Templates & Publishing

## Document Information

| Field | Value |
|-------|-------|
| Application | MASS-APP-013 — Design Studio |
| Volume | V04 |
| Title | Templates & Publishing |
| Version | 1.0 |
| Status | Complete |
| Work Order | WO-013-V04 |
| Manufacturing Date | 2026-08-02 |
| Authority | MASS Constitution → Engineering Library → Application Directives → Repository Canon → MASS V1 Manufacturing Guide |

## Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0 | 2026-08-02 | Initial manufacturing under Production Reset doctrine |

---

## 1. Purpose

Templates & Publishing establishes how reusable project templates are created, managed, and used to consistently produce engineering artifacts within Design Studio.

This volume defines template architecture, publishing workflows, document generation, and publication lifecycle. After implementation, users shall be able to create reusable templates, organize template libraries, publish projects into standardized deliverables, manage publication history, preserve document consistency, and reuse organizational standards.

This volume does not define AI document generation, brand asset management, media processing, live collaboration, enterprise knowledge visualization, or marketplace distribution.

## 2. Scope

### Included

- Template architecture
- Template lifecycle
- Template categorization
- Publishing workflow
- Publication metadata
- Output configuration
- Publishing history
- Document generation rules
- Engineering constraints

### Excluded

- AI document generation (future volume)
- Brand asset management (future volume)
- Media processing (future volume)
- Live collaboration (future volume)
- Enterprise knowledge visualization (future volume)
- Marketplace distribution (future volume)

## 3. Platform Consumption Map

| Platform Service | How V04 Consumes It |
|------------------|---------------------|
| ENG-002 Enterprise Core | Tenant context, entity ID generation, lifecycle state patterns |
| ENG-003 Identity Engine | User authentication, tenant resolution |
| ENG-004 Security Framework | Row Level Security policies |
| ENG-005 Event Bus Engine | Publishing lifecycle event publication |
| ENG-006 Workflow Engine | Publishing workflow orchestration patterns |
| ENG-008 Document Engine | Generated document persistence |
| ENG-012 Persistence Framework | PostgreSQL connection, migration patterns |
| ENG-015 API Framework | REST endpoint structure, request validation |

### Responsibilities Owned by V04

- Template CRUD and lifecycle operations
- Template categorization and discovery
- Publishing workflow definition and execution
- Publication generation and versioning
- Output format configuration
- Publication history tracking

### Responsibilities Delegated

- Authentication and tenant isolation → ENG-003, ENG-004
- Document storage for generated outputs → ENG-008
- Workflow orchestration patterns → ENG-006
- Event distribution → ENG-005
- API conventions → ENG-015
- Project and workspace context → V02
- Design tokens and component definitions → V03

### Enterprise Events Published

| Event | Trigger |
|-------|---------|
| `template.created` | New template registered |
| `template.updated` | Template metadata or content modified |
| `template.archived` | Template moved to archived state |
| `template.restored` | Template returned from archived state |
| `publication.draft.created` | Draft publication generated |
| `publication.preview.generated` | Publication preview rendered |
| `publication.published` | Final publication completed |
| `publication.archived` | Publication archived |
| `publish_job.started` | Publish job begins processing |
| `publish_job.completed` | Publish job finishes successfully |
| `publish_job.failed` | Publish job encounters an error |

### Enterprise Events Consumed

| Event | Response |
|-------|----------|
| `project.deleted` | Archive all publications for the project |
| `project.archived` | Prevent new publications; existing publications remain accessible |

## 4. Constitutional Boundary Statement

This volume owns template organization, publishing workflows, publication lifecycle, and output configuration within Design Studio. It does not own and shall not duplicate: document persistence (ENG-008), user authentication (ENG-003), security policy enforcement (ENG-004), event distribution (ENG-005), workflow orchestration patterns (ENG-006), or API framework conventions (ENG-015). Design tokens and component definitions are consumed from V03, never reimplemented. All platform capabilities are consumed through the Engineering Library, never reimplemented.

## 5. Template Architecture

### 5.1 Template Entity

A template is a reusable structural definition that standardizes how projects produce deliverables. Templates define layout, sections, required fields, and output formatting rules.

```
Template
├── Metadata (name, description, category, status, version)
├── Structure (sections, ordering, required/optional markers)
├── Output Rules (format defaults, styling references)
├── Token References (design tokens consumed for styling)
└── Revision History
```

### 5.2 Template Lifecycle

```
┌──────────┐    create    ┌──────────┐
│          │─────────────▶│          │
│  (none)  │              │  Draft   │
│          │              │          │
└──────────┘              └────┬─────┘
                               │
                            publish
                               │
                          ┌────▼─────┐
                  ┌──────▶│          │◀──────┐
                  │       │  Active  │       │
                  │       │          │       │
                  │       └────┬─────┘       │
                  │            │             │
               restore     archive      restore
                  │            │             │
                  │       ┌────▼─────┐       │
                  │       │          │       │
                  │       │ Archived │───────┘
                  │       │          │
                  │       └──────────┘
                  │
             ┌────┴─────┐
             │          │
             │  (from   │
             │ archived)│
             └──────────┘
```

**States:**

| State | Description | Transitions |
|-------|-------------|-------------|
| Draft | Under development. Not available for publishing. | → Active |
| Active | Available for use in publishing workflows. | → Archived |
| Archived | Read-only. Existing publications that used this template remain valid. | → Active (restore) |

**Lifecycle Rules:**
- Only tenant administrators or template authors may change lifecycle state
- Archiving a template does not invalidate existing publications created from it
- A template must have at least one defined section before it can be published to Active
- Duplicating an Active or Archived template creates a new Draft

### 5.3 Template Scope

Templates are tenant-scoped. All projects within a tenant share the same template library. This ensures consistent deliverable standards across the organization.

### 5.4 Template Structure

A template defines an ordered list of sections. Each section specifies:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Section identifier |
| name | VARCHAR(255) | Yes | Section heading |
| description | TEXT | No | Guidance for content authors |
| position | INTEGER | Yes | Order within template |
| is_required | BOOLEAN | Yes | Whether the section must be completed before publishing |
| default_content | TEXT | No | Pre-populated content for the section |
| content_type | VARCHAR(20) | Yes | text, table, diagram, metadata |

### 5.5 Template Categories

| Category | Description |
|----------|-------------|
| Engineering Manual | Multi-volume engineering specifications |
| Executive Brief | Concise executive-level summaries |
| Standards | Organizational standards and policies |
| Policy | Governance and compliance documents |
| Report | Analytical and status reports |
| Presentation | Structured presentation outlines |
| Proposal | Business or technical proposals |
| Technical Specification | Focused technical specifications |

Tenants may create additional categories. Categories cannot be deleted if templates are assigned to them.

## 6. Publishing Architecture

### 6.1 Publishing Workflow

Publishing transforms a project's workspace content into a standardized deliverable using a template.

```
┌─────────┐    select     ┌──────────┐    generate    ┌─────────┐
│         │──template────▶│          │───────────────▶│         │
│ Project │               │  Draft   │                │ Preview │
│         │               │          │                │         │
└─────────┘               └────┬─────┘                └────┬────┘
                               │                           │
                               │                      approve/reject
                               │                           │
                          ┌────┼───────────────────────────┘
                          │    │
                     rejected  approved
                          │    │
                          ▼    ▼
                     ┌─────────────┐    finalize    ┌───────────┐
                     │             │───────────────▶│           │
                     │  Revision   │                │ Published │
                     │             │                │           │
                     └─────────────┘                └───────────┘
```

**Workflow Steps:**

| Step | Description |
|------|-------------|
| Select Template | User chooses a template for the publication |
| Generate Draft | System populates template sections from project content |
| Preview | User reviews the rendered publication before committing |
| Approve/Reject | User approves for publication or returns to revision |
| Finalize | System generates the final output and records the publication |

### 6.2 Publication Immutability

Once a publication is finalized, its content is immutable. Corrections require a new publication version, not modification of the existing one. This preserves audit history and ensures published artifacts are reliable references.

### 6.3 Publication Versioning

Each publication tracks versions:

| Field | Description |
|-------|-------------|
| version_number | Sequential integer (1, 2, 3...) |
| change_summary | What changed from the previous version |
| published_by | Who finalized this version |
| published_at | When this version was finalized |
| output_references | Links to generated output files |

Re-publishing a project with the same template creates a new version, not a replacement.

## 7. Output Configuration

### 7.1 Output Types

| Type | Format | Description |
|------|--------|-------------|
| Markdown | `.md` | Structured markdown document |
| PDF | `.pdf` | Formatted PDF with styling from design tokens |
| HTML | `.html` | Standalone HTML document |
| JSON | `.json` | Structured data export of publication content |

### 7.2 Output Definition

Each output type is configured through an OutputDefinition:

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Output definition identifier |
| name | VARCHAR(100) | Display name (e.g., "Engineering PDF") |
| format | VARCHAR(20) | markdown, pdf, html, json |
| styling_tokens | JSONB | Design token references for formatting |
| page_settings | JSONB | Page size, margins, headers, footers (PDF/HTML) |
| is_default | BOOLEAN | Whether this is the default output for new publications |

### 7.3 Future Output Extensibility

The OutputDefinition model accepts new formats without schema changes. Adding a new output type requires:
1. A new format value
2. A rendering implementation
3. No data model or API changes

## 8. Publish Job

Publishing is an asynchronous operation managed through a job queue.

### 8.1 Job Lifecycle

```
Queued → Processing → Completed
                   → Failed → Retry (max 3) → Failed (terminal)
```

### 8.2 Job Record

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Job identifier |
| publication_id | UUID | Target publication |
| output_definition_id | UUID | Which output format to generate |
| status | VARCHAR(20) | queued, processing, completed, failed |
| started_at | TIMESTAMPTZ | When processing began |
| completed_at | TIMESTAMPTZ | When processing finished |
| error_message | TEXT | Failure reason (if failed) |
| retry_count | INTEGER | Number of retry attempts |
| created_at | TIMESTAMPTZ | When job was queued |

### 8.3 Job Rules

- A publish job is created for each output format requested
- Multiple output formats may be generated from a single publication action
- Failed jobs may be retried up to 3 times
- Job status is visible to the publishing user
- Completed jobs produce output files stored via ENG-008 (Document Engine)

## 9. Data Model

### 9.1 Entity Definitions

**Template**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(255) | No | — | Template name |
| description | TEXT | Yes | NULL | Template description |
| category_id | UUID | No | — | Category (FK) |
| status | VARCHAR(20) | No | 'draft' | Lifecycle state |
| author_id | UUID | No | — | Creator (FK) |
| version | INTEGER | No | 1 | Revision counter |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |
| archived_at | TIMESTAMPTZ | Yes | NULL | When archived |

**TemplateCategory**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(100) | No | — | Category name |
| description | TEXT | Yes | NULL | Category description |
| is_standard | BOOLEAN | No | false | Platform-standard category |
| position | INTEGER | No | 0 | Display order |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |

**TemplateSection**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| template_id | UUID | No | — | Parent template (FK) |
| name | VARCHAR(255) | No | — | Section heading |
| description | TEXT | Yes | NULL | Author guidance |
| position | INTEGER | No | 0 | Order within template |
| is_required | BOOLEAN | No | true | Required for publishing |
| default_content | TEXT | Yes | NULL | Pre-populated content |
| content_type | VARCHAR(20) | No | 'text' | text, table, diagram, metadata |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |

**Publication**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| project_id | UUID | No | — | Source project (FK) |
| template_id | UUID | No | — | Template used (FK) |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| status | VARCHAR(20) | No | 'draft' | draft, preview, published, archived |
| created_by | UUID | No | — | Who initiated (FK) |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |
| archived_at | TIMESTAMPTZ | Yes | NULL | When archived |

**PublicationVersion**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| publication_id | UUID | No | — | Parent publication (FK) |
| version_number | INTEGER | No | — | Sequential version |
| content | JSONB | No | — | Immutable snapshot of publication content |
| change_summary | TEXT | No | — | What changed |
| published_by | UUID | No | — | Who finalized (FK) |
| published_at | TIMESTAMPTZ | No | now() | When finalized |

**OutputDefinition**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(100) | No | — | Display name |
| format | VARCHAR(20) | No | — | markdown, pdf, html, json |
| styling_tokens | JSONB | No | '{}' | Design token references |
| page_settings | JSONB | No | '{}' | Layout configuration |
| is_default | BOOLEAN | No | false | Default output format |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |

**PublishJob**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| publication_id | UUID | No | — | Target publication (FK) |
| publication_version_id | UUID | No | — | Specific version (FK) |
| output_definition_id | UUID | No | — | Output format (FK) |
| status | VARCHAR(20) | No | 'queued' | queued, processing, completed, failed |
| started_at | TIMESTAMPTZ | Yes | NULL | Processing start |
| completed_at | TIMESTAMPTZ | Yes | NULL | Processing end |
| error_message | TEXT | Yes | NULL | Failure reason |
| retry_count | INTEGER | No | 0 | Retry attempts |
| output_file_ref | TEXT | Yes | NULL | Reference to generated file in ENG-008 |
| created_at | TIMESTAMPTZ | No | now() | When queued |

### 9.2 Entity Relationships

```
┌──────────────────┐       ┌──────────────────┐
│TemplateCategory  │──1:N─▶│    Template      │
│                  │       │                   │
│  tenant_id (FK)  │       │  category_id (FK) │
└──────────────────┘       │  tenant_id (FK)   │
                           └──┬────────────────┘
                              │
                              │ 1:N
                              ▼
                        ┌──────────────────┐
                        │ TemplateSection  │
                        │                  │
                        │  template_id(FK) │
                        └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│    Project       │──1:N─▶│   Publication    │◀──N:1──┌──────────┐
│    (from V02)    │       │                  │        │ Template │
└──────────────────┘       │  project_id (FK) │        └──────────┘
                           │  template_id(FK) │
                           └──┬───────────────┘
                              │
                              │ 1:N
                              ▼
                        ┌──────────────────┐
                        │PublicationVersion│
                        │                  │
                        │  publication_id  │
                        │  content (JSONB) │
                        └──┬───────────────┘
                           │
                           │ 1:N
                           ▼
                     ┌──────────────────┐       ┌──────────────────┐
                     │   PublishJob     │──N:1─▶│OutputDefinition  │
                     │                  │       │                  │
                     │  pub_version(FK) │       │  tenant_id (FK)  │
                     │  output_def(FK)  │       │  format          │
                     └──────────────────┘       └──────────────────┘
```

**Constraints:**
- `template.tenant_id` + `template.name` is unique
- `template_category.tenant_id` + `template_category.name` is unique
- `template_section.template_id` + `template_section.position` is unique
- `publication_version.publication_id` + `publication_version.version_number` is unique
- `output_definition.tenant_id` + `output_definition.name` is unique
- `publish_job.publication_version_id` + `publish_job.output_definition_id` is unique per non-terminal status

### 9.3 Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| template | idx_template_tenant | tenant_id, status | Tenant-scoped listing |
| template | idx_template_category | category_id | Category filtering |
| template_section | idx_section_template | template_id | Section listing |
| publication | idx_pub_tenant | tenant_id, status | Tenant-scoped listing |
| publication | idx_pub_project | project_id | Project publications |
| publication | idx_pub_template | template_id | Template usage tracking |
| publication_version | idx_pv_publication | publication_id | Version history |
| publish_job | idx_job_status | status | Job queue processing |
| publish_job | idx_job_publication | publication_version_id | Job lookup |

## 10. API Specification

### 10.1 Template Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /templates | List templates (paginated, filterable) | Viewer |
| GET | /templates/{id} | Get template with sections | Viewer |
| POST | /templates | Create new template | Editor |
| PATCH | /templates/{id} | Update template metadata | Editor |
| DELETE | /templates/{id} | Archive template | Admin |
| POST | /templates/{id}/restore | Restore archived template | Admin |
| POST | /templates/{id}/duplicate | Create copy as new Draft | Editor |
| GET | /templates/{id}/sections | List template sections | Viewer |
| POST | /templates/{id}/sections | Add section to template | Editor |
| PATCH | /templates/{id}/sections/{sectionId} | Update section | Editor |
| DELETE | /templates/{id}/sections/{sectionId} | Remove section | Editor |
| PUT | /templates/{id}/sections/reorder | Reorder sections | Editor |
| GET | /template-categories | List all categories | Viewer |
| POST | /template-categories | Create custom category | Admin |

### 10.2 Publication Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /publications | List publications | Viewer |
| GET | /publications/{id} | Get publication with current version | Viewer |
| POST | /publications | Create draft publication from project + template | Editor |
| POST | /publications/{id}/preview | Generate preview | Editor |
| POST | /publications/{id}/publish | Finalize and publish | Editor |
| POST | /publications/{id}/regenerate | Create new version | Editor |
| DELETE | /publications/{id} | Archive publication | Admin |
| GET | /publications/{id}/versions | List publication versions | Viewer |
| GET | /publications/{id}/versions/{versionId} | Get specific version | Viewer |
| GET | /publications/{id}/jobs | List publish jobs | Viewer |

### 10.3 Output Definition Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /output-definitions | List output definitions | Viewer |
| POST | /output-definitions | Create output definition | Admin |
| PATCH | /output-definitions/{id} | Update output definition | Admin |

### 10.4 Query Parameters — GET /templates

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: draft, active, archived, all (default: active) |
| category | UUID | Filter by category ID |
| search | string | Search by name |
| sort | string | Sort: name, created_at (default), updated_at |
| order | string | Direction: asc, desc (default) |
| limit | integer | Page size (default 25, max 100) |
| offset | integer | Pagination offset (default 0) |
| favorited | boolean | Filter to user's favorites |

### 10.5 Query Parameters — GET /publications

| Parameter | Type | Description |
|-----------|------|-------------|
| project_id | UUID | Filter by source project |
| template_id | UUID | Filter by template used |
| status | string | Filter: draft, preview, published, archived, all (default: published) |
| sort | string | Sort: created_at (default), updated_at |
| order | string | Direction: asc, desc (default) |
| limit | integer | Page size (default 25, max 100) |
| offset | integer | Pagination offset (default 0) |

### 10.6 Request/Response Shapes

**POST /publications — Create Draft Publication**

Request:
```json
{
  "project_id": "proj-uuid-...",
  "template_id": "tmpl-uuid-...",
  "output_definitions": ["outdef-uuid-md", "outdef-uuid-pdf"]
}
```

Response (201):
```json
{
  "id": "pub-uuid-...",
  "project_id": "proj-uuid-...",
  "template_id": "tmpl-uuid-...",
  "tenant_id": "t-uuid-...",
  "status": "draft",
  "created_by": "u-uuid-...",
  "created_at": "2026-08-02T12:00:00Z",
  "template": {
    "id": "tmpl-uuid-...",
    "name": "Engineering Manual",
    "sections": [
      { "id": "s1-...", "name": "Document Information", "is_required": true },
      { "id": "s2-...", "name": "Purpose", "is_required": true },
      { "id": "s3-...", "name": "Scope", "is_required": true }
    ]
  },
  "content": {},
  "output_definitions": [
    { "id": "outdef-uuid-md", "name": "Markdown", "format": "markdown" },
    { "id": "outdef-uuid-pdf", "name": "Engineering PDF", "format": "pdf" }
  ]
}
```

**POST /publications/{id}/publish — Finalize Publication**

Request:
```json
{
  "change_summary": "Initial publication of V02 Design Projects specification"
}
```

Response (200):
```json
{
  "id": "pub-uuid-...",
  "status": "published",
  "current_version": {
    "id": "pv-uuid-...",
    "version_number": 1,
    "change_summary": "Initial publication of V02 Design Projects specification",
    "published_by": "u-uuid-...",
    "published_at": "2026-08-02T12:05:00Z"
  },
  "jobs": [
    { "id": "job-1-...", "format": "markdown", "status": "queued" },
    { "id": "job-2-...", "format": "pdf", "status": "queued" }
  ]
}
```

### 10.7 Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400 | INVALID_INPUT | Missing required fields or invalid values |
| 400 | TEMPLATE_NOT_READY | Template is in Draft state; cannot be used for publishing |
| 400 | INCOMPLETE_SECTIONS | Required template sections not completed |
| 401 | UNAUTHORIZED | No valid session |
| 403 | FORBIDDEN | Insufficient role |
| 404 | NOT_FOUND | Entity not found or not accessible |
| 409 | CONFLICT | Duplicate name within tenant |
| 409 | PUBLICATION_IMMUTABLE | Attempt to modify a published version |
| 422 | CATEGORY_NOT_EMPTY | Attempt to delete category with assigned templates |
| 422 | PROJECT_ARCHIVED | Cannot publish from an archived project |

## 11. Permission Model

Templates and publications use tenant-level roles:

| Role | Browse | Create Templates | Create Publications | Publish | Manage Categories | Archive |
|------|--------|-----------------|--------------------|---------|--------------------|---------|
| Viewer | Yes | No | No | No | No | No |
| Editor | Yes | Yes | Yes | Yes | No | No |
| Admin | Yes | Yes | Yes | Yes | Yes | Yes |

Row Level Security enforces tenant isolation on all template, publication, and job tables.

### Template Favorites

Users can favorite templates for quick access. Favorites are user-level preferences:

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | User reference |
| template_id | UUID | Favorited template |
| favorited_at | TIMESTAMPTZ | When favorited |

## 12. Folder Structure — Design Studio V04 Organization

```
apps/design-studio/
├── src/
│   ├── app/
│   │   ├── (projects)/                        # V02 routes
│   │   │   └── ...
│   │   ├── (design-system)/                   # V03 routes
│   │   │   └── ...
│   │   ├── (templates)/
│   │   │   ├── page.tsx                       # Template library browser
│   │   │   └── [templateId]/
│   │   │       ├── page.tsx                   # Template editor
│   │   │       └── sections/
│   │   │           └── page.tsx               # Section management
│   │   ├── (publications)/
│   │   │   ├── page.tsx                       # Publication list
│   │   │   └── [publicationId]/
│   │   │       ├── page.tsx                   # Publication detail
│   │   │       ├── preview/
│   │   │       │   └── page.tsx               # Publication preview
│   │   │       └── versions/
│   │   │           └── page.tsx               # Version history
│   │   └── layout.tsx
│   ├── features/
│   │   ├── projects/                          # V02
│   │   ├── components/                        # V03
│   │   ├── design-tokens/                     # V03
│   │   ├── templates/
│   │   │   ├── api/
│   │   │   │   ├── templates.ts
│   │   │   │   ├── sections.ts
│   │   │   │   └── categories.ts
│   │   │   ├── components/
│   │   │   │   ├── TemplateBrowser.tsx
│   │   │   │   ├── TemplateCard.tsx
│   │   │   │   ├── TemplateEditor.tsx
│   │   │   │   ├── TemplateCreateDialog.tsx
│   │   │   │   ├── SectionList.tsx
│   │   │   │   └── SectionEditor.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useTemplates.ts
│   │   │   │   ├── useTemplate.ts
│   │   │   │   └── useCategories.ts
│   │   │   └── types/
│   │   │       └── template.ts
│   │   └── publications/
│   │       ├── api/
│   │       │   ├── publications.ts
│   │       │   ├── versions.ts
│   │       │   ├── jobs.ts
│   │       │   └── output-definitions.ts
│   │       ├── components/
│   │       │   ├── PublicationList.tsx
│   │       │   ├── PublicationDetail.tsx
│   │       │   ├── PublicationPreview.tsx
│   │       │   ├── PublishDialog.tsx
│   │       │   ├── VersionTimeline.tsx
│   │       │   └── JobStatusPanel.tsx
│   │       ├── hooks/
│   │       │   ├── usePublications.ts
│   │       │   ├── usePublication.ts
│   │       │   └── usePublishJobs.ts
│   │       └── types/
│   │           └── publication.ts
│   └── lib/
│       └── supabase/
│           └── client.ts
├── supabase/
│   └── migrations/
│       ├── ...                                # V02 (001-007), V03 (008-016)
│       ├── 017_create_template_categories.sql
│       ├── 018_create_templates.sql
│       ├── 019_create_template_sections.sql
│       ├── 020_create_output_definitions.sql
│       ├── 021_create_publications.sql
│       ├── 022_create_publication_versions.sql
│       ├── 023_create_publish_jobs.sql
│       ├── 024_create_template_favorites.sql
│       ├── 025_seed_template_categories.sql
│       └── 026_create_v04_rls_policies.sql
└── package.json
```

## 13. Migration SQL Reference

```sql
-- 017_create_template_categories.sql
CREATE TABLE template_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_standard BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

-- 018_create_templates.sql
CREATE TABLE template (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID NOT NULL REFERENCES template_category(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'archived')),
  author_id UUID NOT NULL REFERENCES users(id),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ,
  UNIQUE (tenant_id, name)
);

CREATE INDEX idx_template_tenant ON template(tenant_id, status);
CREATE INDEX idx_template_category ON template(category_id);

-- 019_create_template_sections.sql
CREATE TABLE template_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES template(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT true,
  default_content TEXT,
  content_type VARCHAR(20) NOT NULL DEFAULT 'text'
    CHECK (content_type IN ('text', 'table', 'diagram', 'metadata')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (template_id, position)
);

CREATE INDEX idx_section_template ON template_section(template_id);

-- 020_create_output_definitions.sql
CREATE TABLE output_definition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  format VARCHAR(20) NOT NULL
    CHECK (format IN ('markdown', 'pdf', 'html', 'json')),
  styling_tokens JSONB NOT NULL DEFAULT '{}',
  page_settings JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

-- 021_create_publications.sql
CREATE TABLE publication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(id),
  template_id UUID NOT NULL REFERENCES template(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'preview', 'published', 'archived')),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX idx_pub_tenant ON publication(tenant_id, status);
CREATE INDEX idx_pub_project ON publication(project_id);
CREATE INDEX idx_pub_template ON publication(template_id);

-- 022_create_publication_versions.sql
CREATE TABLE publication_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publication(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  change_summary TEXT NOT NULL,
  published_by UUID NOT NULL REFERENCES users(id),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (publication_id, version_number)
);

CREATE INDEX idx_pv_publication ON publication_version(publication_id);

-- 023_create_publish_jobs.sql
CREATE TABLE publish_job (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publication(id),
  publication_version_id UUID NOT NULL REFERENCES publication_version(id),
  output_definition_id UUID NOT NULL REFERENCES output_definition(id),
  status VARCHAR(20) NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  output_file_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_status ON publish_job(status);
CREATE INDEX idx_job_publication ON publish_job(publication_version_id);

-- 024_create_template_favorites.sql
CREATE TABLE user_template_favorite (
  user_id UUID NOT NULL REFERENCES users(id),
  template_id UUID NOT NULL REFERENCES template(id) ON DELETE CASCADE,
  favorited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, template_id)
);

-- 025_seed_template_categories.sql
-- Standard categories seeded per tenant on tenant creation:
-- Engineering Manual, Executive Brief, Standards, Policy,
-- Report, Presentation, Proposal, Technical Specification
-- Seeding logic runs as part of tenant provisioning.

-- 026_create_v04_rls_policies.sql
-- All V04 tables enforce tenant isolation:
-- template, template_category, template_section,
-- output_definition, publication, publication_version,
-- publish_job, user_template_favorite
```

## 14. Engineering Constraints

| Constraint | Specification |
|------------|--------------|
| Language | TypeScript (strict mode) |
| Architecture | Modular monolith |
| Database | Supabase PostgreSQL |
| Row Level Security | Mandatory on all tables |
| Feature boundaries | `features/templates/` and `features/publications/` |
| Migrations | Sequential, continue from V03 sequence (017+) |
| Publication immutability | Published versions cannot be modified |
| Async publishing | Publish jobs processed via job queue |
| Output extensibility | New formats require no schema changes |
| API validation | Zod schemas for all request bodies |

## 15. Future Volume Attachment Points

| Future Capability | Where It Attaches | Volume |
|-------------------|-------------------|--------|
| AI document generation | Publication content population | V05+ |
| Brand asset management | Output styling and token integration | V05+ |
| Collaborative editing | Publication draft collaboration | V05+ |
| Knowledge visualization | Output format extension | V05+ |
| Approval workflows | Pre-publish governance gates | V05+ |

No schema, API, or implementation is provided for these.

---

## Constitutional Boundary Statement

MASS-APP-013-V04 owns template organization, publishing workflows, publication lifecycle, output configuration, and publish job management within Design Studio. It does not own and shall not duplicate: document persistence (ENG-008), user authentication (ENG-003), security policy enforcement (ENG-004), event distribution (ENG-005), workflow orchestration patterns (ENG-006), or API framework conventions (ENG-015). Design tokens are consumed from V03. Project context is consumed from V02. All platform capabilities are consumed through the Engineering Library, never reimplemented.
