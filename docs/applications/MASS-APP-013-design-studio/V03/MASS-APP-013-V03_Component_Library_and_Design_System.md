# MASS-APP-013-V03 — Component Library & Design System

## Document Information

| Field | Value |
|-------|-------|
| Application | MASS-APP-013 — Design Studio |
| Volume | V03 |
| Title | Component Library & Design System |
| Version | 1.0 |
| Status | Complete |
| Work Order | WO-013-V03 |
| Manufacturing Date | 2026-08-02 |
| Authority | MASS Constitution → Engineering Library → Application Directives → Repository Canon |

## Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0 | 2026-08-02 | Initial manufacturing under Production Reset doctrine |

---

## 1. Purpose

Component Library & Design System establishes the reusable design foundation for every artifact created within Design Studio.

This volume defines how interface components, design tokens, styles, patterns, and reusable assets are organized and governed. After implementation, Design Studio shall support reusable UI components, standardized design tokens, centralized styling, component categorization, component version metadata, component documentation, and component dependency relationships.

This volume does not define publishing, AI-generated components, asset libraries, brand management, collaboration workflows, runtime rendering optimization, or marketplace functionality.

## 2. Scope

### Included

- Component architecture
- Design System organization
- Design Token structure
- Component metadata
- Component lifecycle
- Component categorization
- Styling standards
- Documentation requirements
- Dependency relationships
- Engineering constraints

### Excluded

- Publishing (future volume)
- AI-generated components (future volume)
- Asset libraries (future volume)
- Brand management (future volume)
- Collaboration workflows (future volume)
- Runtime rendering optimization (future volume)
- Marketplace functionality (future volume)

## 3. Platform Consumption Map

| Platform Service | How V03 Consumes It |
|------------------|---------------------|
| ENG-002 Enterprise Core | Tenant context, entity ID generation, lifecycle state patterns |
| ENG-003 Identity Engine | User authentication, tenant resolution |
| ENG-004 Security Framework | Row Level Security policies |
| ENG-005 Event Bus Engine | Component and token lifecycle event publication |
| ENG-007 Knowledge Engine | Structured documentation storage patterns |
| ENG-012 Persistence Framework | PostgreSQL connection, migration patterns |
| ENG-015 API Framework | REST endpoint structure, request validation |

### Responsibilities Owned by V03

- Component CRUD and lifecycle operations
- Design token definition and organization
- Component categorization and taxonomy
- Component documentation structure
- Component dependency tracking
- Component search and discovery

### Responsibilities Delegated

- Authentication and tenant isolation → ENG-003, ENG-004
- Event distribution → ENG-005
- API conventions → ENG-015
- Project and workspace context → V02

### Enterprise Events Published

| Event | Trigger |
|-------|---------|
| `component.created` | New component registered |
| `component.updated` | Component metadata or content modified |
| `component.archived` | Component moved to archived state |
| `component.restored` | Component returned from archived state |
| `component.deprecated` | Component marked as deprecated |
| `component.version.created` | New component version recorded |
| `token.created` | New design token defined |
| `token.updated` | Token value or metadata modified |
| `token.deleted` | Token removed |

### Enterprise Events Consumed

| Event | Response |
|-------|----------|
| `project.deleted` | Cascade-archive project-scoped components |

## 4. Constitutional Boundary Statement

This volume owns component organization, design token definitions, component documentation, and component dependency tracking within Design Studio. It does not own document persistence (ENG-008), user authentication (ENG-003), security policy enforcement (ENG-004), event distribution (ENG-005), enterprise knowledge persistence (ENG-007), or API framework conventions (ENG-015). No capability defined in this volume duplicates or replaces any Engineering Library responsibility.

## 5. Component Architecture

### 5.1 Component Entity

A component is a reusable design building block within Design Studio. Components are tenant-scoped and belong to the shared design system. They are available across all projects within a tenant.

```
Component
├── Metadata (name, description, category, status, version, tags)
├── Documentation (purpose, usage, properties, constraints, notes)
├── Dependencies (references to other components this one requires)
├── Version History (revision metadata for each published iteration)
└── Tokens (design tokens consumed by this component)
```

### 5.2 Component Lifecycle

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
                  │       └──┬────┬──┘       │
                  │          │    │           │
               restore  deprecate archive    │
                  │          │    │           │
             ┌────┴─────┐   │  ┌─▼────────┐ │
             │          │   │  │           │ │
             │ Archived │   │  │           │ │
             │          │   │  └───────────┘ │
             └──────────┘   │                │
                            │           restore
                       ┌────▼─────┐          │
                       │          │──────────┘
                       │Deprecated│
                       │          │
                       └──────────┘
```

**States:**

| State | Description | Transitions |
|-------|-------------|-------------|
| Draft | Initial state. Under development. Not available for use in designs. | → Active |
| Active | Published and available for use across the tenant. | → Deprecated, → Archived |
| Deprecated | Still functional but marked for replacement. Displays deprecation notice. | → Active (restore) |
| Archived | Read-only. Not available for use in new designs. Existing references retained. | → Active (restore) |

**Lifecycle Rules:**
- Only tenant administrators or component authors may change lifecycle state
- Deprecating a component does not remove it from existing designs
- Archiving a component does not break existing references — existing usages continue to render
- A component with active dependents cannot be archived without confirmation

### 5.3 Component Scope

Components exist at the tenant level, not the project level. This means:
- All projects within a tenant share the same component library
- A component created by any authorized user is available to all projects
- Component permissions follow tenant-level roles, not project-level roles
- Project-specific customizations of shared components are not supported in V03

## 6. Design Token Structure

### 6.1 Token Organization

Design tokens are organized into groups that represent categories of design decisions.

```
Design System
├── Token Groups
│   ├── Colors
│   │   ├── primary
│   │   ├── secondary
│   │   ├── neutral
│   │   ├── success
│   │   ├── warning
│   │   ├── error
│   │   └── info
│   ├── Typography
│   │   ├── font-family
│   │   ├── font-size
│   │   ├── font-weight
│   │   ├── line-height
│   │   └── letter-spacing
│   ├── Spacing
│   │   ├── xs, sm, md, lg, xl, 2xl
│   │   └── (custom increments)
│   ├── Radius
│   │   ├── none, sm, md, lg, full
│   │   └── (custom values)
│   ├── Borders
│   │   ├── width
│   │   ├── style
│   │   └── color (references Colors)
│   ├── Shadows
│   │   ├── sm, md, lg, xl
│   │   └── (custom definitions)
│   ├── Elevation
│   │   ├── levels 0–5
│   │   └── (z-index mapping)
│   ├── Icons
│   │   ├── size
│   │   └── stroke-width
│   └── Motion
│       ├── duration
│       ├── easing
│       └── delay
└── (future: theme variants — not V03)
```

### 6.2 Token Definition

Each token consists of:

| Field | Description |
|-------|-------------|
| Name | Unique identifier within its group (e.g., `color-primary-500`) |
| Value | The resolved value (e.g., `#3B82F6`) |
| Type | Value type: color, dimension, font, number, string |
| Description | Human-readable explanation of intent |
| Group | Parent token group |

### 6.3 Token References

Tokens may reference other tokens to create semantic relationships:
- `color-border-default` → references `color-neutral-300`
- `shadow-card` → composed from `elevation-1` + `color-neutral-100`

Reference chains are resolved at read time. Circular references are prohibited and validated on save.

### 6.4 Token Scope

Design tokens are tenant-scoped. All projects within a tenant share the same token definitions. This ensures visual consistency across all Design Studio outputs within an organization.

## 7. Component Categories

### 7.1 Standard Categories

| Category | Description |
|----------|-------------|
| Layout | Containers, grids, stacks, dividers |
| Navigation | Menus, tabs, breadcrumbs, sidebars |
| Forms | Form containers, field groups, validation displays |
| Buttons | Action triggers, icon buttons, button groups |
| Inputs | Text fields, selects, checkboxes, radios, toggles, date pickers |
| Data Display | Tables, lists, cards, stats, badges, avatars |
| Feedback | Alerts, toasts, progress bars, spinners, skeletons |
| Media | Images, video containers, carousels, galleries |
| Utilities | Tooltips, popovers, modals, drawers, accordions |

### 7.2 Custom Categories

Tenants may create additional categories beyond the standard set. Custom categories follow the same structure as standard categories. Categories cannot be deleted if components are assigned to them.

## 8. Component Documentation

Each component carries structured documentation:

| Section | Required | Description |
|---------|----------|-------------|
| Purpose | Yes | What the component does and when to use it |
| Usage | Yes | How to include the component in a design |
| Properties | Yes | Configurable properties with types, defaults, and constraints |
| Constraints | No | Known limitations or usage restrictions |
| Notes | No | Additional context, design rationale, or changelog |
| Revision Metadata | Yes | Version number, author, date, change summary |

Documentation is stored as structured JSON alongside the component, not as separate files.

## 9. Component Dependencies

### 9.1 Dependency Model

Components may declare dependencies on other components. Dependencies are directional: Component A depends on Component B means A requires B to function.

```
ComponentDependency
├── source_component_id    (the component that requires another)
├── target_component_id    (the required component)
├── dependency_type        (requires | optional | peer)
└── created_at
```

**Dependency Types:**

| Type | Meaning |
|------|---------|
| requires | Source cannot function without target |
| optional | Source can function without target but gains capability with it |
| peer | Source expects target to be available at the same version level |

### 9.2 Dependency Rules

- Circular dependencies are prohibited and validated on save
- Archiving a component with active `requires` dependents triggers a confirmation warning
- Deprecating a component notifies authors of all dependent components
- Dependency depth is limited to 10 levels

## 10. Data Model

### 10.1 Entity Definitions

**Component**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(255) | No | — | Component name |
| description | TEXT | Yes | NULL | Brief description |
| category_id | UUID | No | — | Category (FK) |
| status | VARCHAR(20) | No | 'draft' | Lifecycle state |
| author_id | UUID | No | — | Creator (FK) |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |
| archived_at | TIMESTAMPTZ | Yes | NULL | When archived |
| deprecated_at | TIMESTAMPTZ | Yes | NULL | When deprecated |
| deprecation_notice | TEXT | Yes | NULL | Reason for deprecation |

**ComponentCategory**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(100) | No | — | Category name |
| description | TEXT | Yes | NULL | Category description |
| is_standard | BOOLEAN | No | false | Whether this is a platform-standard category |
| position | INTEGER | No | 0 | Display order |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |

**ComponentVersion**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| component_id | UUID | No | — | Parent component (FK) |
| version_number | VARCHAR(20) | No | — | Semantic version (e.g., 1.0.0) |
| change_summary | TEXT | No | — | What changed in this version |
| documentation | JSONB | No | '{}' | Structured documentation |
| properties | JSONB | No | '[]' | Component property definitions |
| author_id | UUID | No | — | Who created this version (FK) |
| created_at | TIMESTAMPTZ | No | now() | Version creation timestamp |

**DesignToken**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| group_id | UUID | No | — | Token group (FK) |
| name | VARCHAR(255) | No | — | Token name |
| value | TEXT | No | — | Resolved value |
| type | VARCHAR(20) | No | — | Value type: color, dimension, font, number, string |
| description | TEXT | Yes | NULL | Token description |
| reference_token_id | UUID | Yes | NULL | Referenced token (FK, self-ref) |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |

**TokenGroup**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(100) | No | — | Group name (e.g., Colors, Typography) |
| description | TEXT | Yes | NULL | Group description |
| position | INTEGER | No | 0 | Display order |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |

**ComponentDependency**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| source_component_id | UUID | No | — | Dependent component (FK) |
| target_component_id | UUID | No | — | Required component (FK) |
| dependency_type | VARCHAR(20) | No | 'requires' | requires, optional, peer |
| created_at | TIMESTAMPTZ | No | now() | When dependency was declared |

**ComponentTag**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| component_id | UUID | No | — | Component (FK) |
| tag | VARCHAR(100) | No | — | Tag value |
| created_at | TIMESTAMPTZ | No | now() | When tag was applied |

### 10.2 Entity Relationships

```
┌──────────────────┐
│ ComponentCategory │
│                  │
│  id (PK)         │
│  tenant_id (FK)  │
└──────┬───────────┘
       │ 1:N
       ▼
┌──────────────────┐       ┌──────────────────┐
│    Component     │──────▶│ ComponentVersion  │
│                  │  1:N  │                   │
│  category_id(FK) │       │  component_id(FK) │
│  tenant_id (FK)  │       │  documentation    │
│  author_id (FK)  │       │  properties       │
└──┬───────┬───────┘       └───────────────────┘
   │       │
   │       │ N:M (via ComponentDependency)
   │       ▼
   │  ┌──────────────────┐
   │  │ComponentDependency│
   │  │                   │
   │  │  source (FK)      │
   │  │  target (FK)      │
   │  │  type             │
   │  └───────────────────┘
   │
   │ 1:N
   ▼
┌──────────────────┐
│  ComponentTag    │
│                  │
│  component_id(FK)│
│  tag             │
└──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│   TokenGroup     │──────▶│   DesignToken    │
│                  │  1:N  │                   │
│  tenant_id (FK)  │       │  group_id (FK)    │
└──────────────────┘       │  reference (self) │
                           └───────────────────┘
```

**Constraints:**
- `component.tenant_id` + `component.name` is unique
- `component_category.tenant_id` + `component_category.name` is unique
- `component_version.component_id` + `component_version.version_number` is unique
- `design_token.tenant_id` + `design_token.name` is unique
- `token_group.tenant_id` + `token_group.name` is unique
- `component_dependency.source_component_id` + `component_dependency.target_component_id` is unique
- `component_tag.component_id` + `component_tag.tag` is unique
- `design_token.reference_token_id` cannot create circular references (validated at application layer)

### 10.3 Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| component | idx_component_tenant | tenant_id, status | Tenant-scoped listing |
| component | idx_component_category | category_id | Category filtering |
| component | idx_component_author | author_id | Author lookup |
| component_version | idx_cv_component | component_id | Version history |
| design_token | idx_token_tenant | tenant_id | Tenant-scoped listing |
| design_token | idx_token_group | group_id | Group filtering |
| component_dependency | idx_dep_source | source_component_id | Forward dependencies |
| component_dependency | idx_dep_target | target_component_id | Reverse dependencies |
| component_tag | idx_ctag_value | tag | Tag search |

## 11. API Specification

### 11.1 Component Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /components | List components (paginated, filterable) | Viewer |
| GET | /components/{id} | Get component with current version | Viewer |
| POST | /components | Create new component | Editor |
| PATCH | /components/{id} | Update component metadata | Editor |
| DELETE | /components/{id} | Archive component | Admin |
| POST | /components/{id}/deprecate | Deprecate component | Admin |
| POST | /components/{id}/restore | Restore archived or deprecated component | Admin |
| GET | /components/{id}/versions | List component versions | Viewer |
| POST | /components/{id}/versions | Create new component version | Editor |
| GET | /components/{id}/dependencies | List component dependencies | Viewer |
| POST | /components/{id}/dependencies | Add dependency | Editor |
| DELETE | /components/{id}/dependencies/{depId} | Remove dependency | Editor |

### 11.2 Category Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /component-categories | List all categories | Viewer |
| POST | /component-categories | Create custom category | Admin |
| PATCH | /component-categories/{id} | Update category | Admin |
| DELETE | /component-categories/{id} | Delete category (only if empty) | Admin |

### 11.3 Design Token Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /design-tokens | List all tokens (grouped) | Viewer |
| GET | /design-tokens/{id} | Get single token | Viewer |
| POST | /design-tokens | Create token | Editor |
| PATCH | /design-tokens/{id} | Update token value or metadata | Editor |
| DELETE | /design-tokens/{id} | Delete token | Admin |
| GET | /token-groups | List token groups | Viewer |
| POST | /token-groups | Create token group | Admin |
| PATCH | /token-groups/{id} | Update token group | Admin |

### 11.4 Query Parameters — GET /components

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: draft, active, deprecated, archived, all (default: active) |
| category | UUID | Filter by category ID |
| search | string | Search by name (case-insensitive partial match) |
| tag | string | Filter by tag |
| sort | string | Sort: name, created_at (default), updated_at |
| order | string | Direction: asc, desc (default) |
| limit | integer | Page size (default 25, max 100) |
| offset | integer | Pagination offset (default 0) |

### 11.5 Request/Response Shapes

**POST /components — Create Component**

Request:
```json
{
  "name": "PrimaryButton",
  "description": "Standard primary action button with hover and disabled states",
  "category_id": "cat-uuid-buttons",
  "tags": ["action", "primary"],
  "documentation": {
    "purpose": "Primary call-to-action button for forms and dialogs",
    "usage": "Use for the main action in any form or confirmation dialog",
    "properties": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "Button text"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": false,
        "description": "Whether the button is interactive"
      },
      {
        "name": "size",
        "type": "enum",
        "required": false,
        "default": "md",
        "options": ["sm", "md", "lg"],
        "description": "Button size variant"
      }
    ],
    "constraints": "Do not use more than one primary button per view"
  }
}
```

Response (201):
```json
{
  "id": "comp-uuid-...",
  "tenant_id": "t-uuid-...",
  "name": "PrimaryButton",
  "description": "Standard primary action button with hover and disabled states",
  "category": {
    "id": "cat-uuid-buttons",
    "name": "Buttons"
  },
  "status": "draft",
  "author_id": "u-uuid-...",
  "created_at": "2026-08-02T12:00:00Z",
  "updated_at": "2026-08-02T12:00:00Z",
  "tags": ["action", "primary"],
  "current_version": {
    "id": "cv-uuid-...",
    "version_number": "0.1.0",
    "documentation": { "..." },
    "properties": [ "..." ],
    "created_at": "2026-08-02T12:00:00Z"
  },
  "dependencies": []
}
```

### 11.6 Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400 | INVALID_INPUT | Missing required fields or invalid values |
| 401 | UNAUTHORIZED | No valid session |
| 403 | FORBIDDEN | Insufficient role |
| 404 | NOT_FOUND | Entity not found or not accessible |
| 409 | CONFLICT | Duplicate name within tenant |
| 409 | CIRCULAR_DEPENDENCY | Dependency would create a cycle |
| 422 | CATEGORY_NOT_EMPTY | Attempt to delete category with assigned components |
| 422 | HAS_DEPENDENTS | Attempt to archive component with active dependents |

## 12. Permission Model

Component Library uses tenant-level roles (not project-level, since components are shared across projects):

| Role | Browse/Search | Create | Edit | Deprecate/Archive | Manage Categories |
|------|--------------|--------|------|-------------------|-------------------|
| Viewer | Yes | No | No | No | No |
| Editor | Yes | Yes | Own + assigned | No | No |
| Admin | Yes | Yes | All | Yes | Yes |

Row Level Security enforces tenant isolation on all component and token tables.

## 13. Styling Standards

### 13.1 Token Naming Convention

Tokens follow a hierarchical naming scheme:

```
{group}-{category}-{variant}
```

Examples:
- `color-primary-500`
- `spacing-md`
- `radius-lg`
- `shadow-card`
- `font-size-body`
- `motion-duration-normal`

### 13.2 Token Value Types

| Type | Format | Example |
|------|--------|---------|
| color | Hex, RGB, or HSL string | `#3B82F6` |
| dimension | Number with unit | `16px`, `1rem` |
| font | Font family string | `"Inter", sans-serif` |
| number | Unitless number | `1.5`, `400` |
| string | Arbitrary string | `ease-in-out` |

## 14. Folder Structure — Design Studio V03 Organization

```
apps/design-studio/
├── src/
│   ├── app/
│   │   ├── (projects)/
│   │   │   └── ...                           # V02 routes
│   │   ├── (design-system)/
│   │   │   ├── components/
│   │   │   │   ├── page.tsx                   # Component library browser
│   │   │   │   └── [componentId]/
│   │   │   │       ├── page.tsx               # Component detail
│   │   │   │       └── versions/
│   │   │   │           └── page.tsx           # Version history
│   │   │   └── tokens/
│   │   │       └── page.tsx                   # Token management
│   │   └── layout.tsx
│   ├── features/
│   │   ├── projects/                          # V02
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── api/
│   │   │   │   ├── components.ts              # Component API client
│   │   │   │   ├── categories.ts              # Category API client
│   │   │   │   ├── versions.ts                # Version API client
│   │   │   │   └── dependencies.ts            # Dependency API client
│   │   │   ├── components/
│   │   │   │   ├── ComponentBrowser.tsx
│   │   │   │   ├── ComponentCard.tsx
│   │   │   │   ├── ComponentDetail.tsx
│   │   │   │   ├── ComponentCreateDialog.tsx
│   │   │   │   ├── ComponentDocumentation.tsx
│   │   │   │   ├── DependencyGraph.tsx
│   │   │   │   └── VersionTimeline.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useComponents.ts
│   │   │   │   ├── useComponent.ts
│   │   │   │   ├── useCategories.ts
│   │   │   │   └── useDependencies.ts
│   │   │   └── types/
│   │   │       └── component.ts
│   │   └── design-tokens/
│   │       ├── api/
│   │       │   ├── tokens.ts                  # Token API client
│   │       │   └── groups.ts                  # Group API client
│   │       ├── components/
│   │       │   ├── TokenBrowser.tsx
│   │       │   ├── TokenGroupPanel.tsx
│   │       │   ├── TokenEditor.tsx
│   │       │   └── TokenPreview.tsx
│   │       ├── hooks/
│   │       │   ├── useTokens.ts
│   │       │   └── useTokenGroups.ts
│   │       └── types/
│   │           └── token.ts
│   └── lib/
│       └── supabase/
│           └── client.ts
├── supabase/
│   └── migrations/
│       ├── ...                                # V02 migrations (001-007)
│       ├── 008_create_component_categories.sql
│       ├── 009_create_components.sql
│       ├── 010_create_component_versions.sql
│       ├── 011_create_component_tags.sql
│       ├── 012_create_component_dependencies.sql
│       ├── 013_create_token_groups.sql
│       ├── 014_create_design_tokens.sql
│       ├── 015_seed_standard_categories.sql
│       └── 016_create_v03_rls_policies.sql
└── package.json
```

## 15. Migration SQL Reference

```sql
-- 008_create_component_categories.sql
CREATE TABLE component_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_standard BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

-- 009_create_components.sql
CREATE TABLE component (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID NOT NULL REFERENCES component_category(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'deprecated', 'archived')),
  author_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ,
  deprecated_at TIMESTAMPTZ,
  deprecation_notice TEXT,
  UNIQUE (tenant_id, name)
);

CREATE INDEX idx_component_tenant ON component(tenant_id, status);
CREATE INDEX idx_component_category ON component(category_id);
CREATE INDEX idx_component_author ON component(author_id);

-- 010_create_component_versions.sql
CREATE TABLE component_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES component(id) ON DELETE CASCADE,
  version_number VARCHAR(20) NOT NULL,
  change_summary TEXT NOT NULL,
  documentation JSONB NOT NULL DEFAULT '{}',
  properties JSONB NOT NULL DEFAULT '[]',
  author_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (component_id, version_number)
);

CREATE INDEX idx_cv_component ON component_version(component_id);

-- 011_create_component_tags.sql
CREATE TABLE component_tag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES component(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (component_id, tag)
);

CREATE INDEX idx_ctag_value ON component_tag(tag);

-- 012_create_component_dependencies.sql
CREATE TABLE component_dependency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_component_id UUID NOT NULL REFERENCES component(id) ON DELETE CASCADE,
  target_component_id UUID NOT NULL REFERENCES component(id) ON DELETE CASCADE,
  dependency_type VARCHAR(20) NOT NULL DEFAULT 'requires'
    CHECK (dependency_type IN ('requires', 'optional', 'peer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_component_id, target_component_id),
  CHECK (source_component_id != target_component_id)
);

CREATE INDEX idx_dep_source ON component_dependency(source_component_id);
CREATE INDEX idx_dep_target ON component_dependency(target_component_id);

-- 013_create_token_groups.sql
CREATE TABLE token_group (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

-- 014_create_design_tokens.sql
CREATE TABLE design_token (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  group_id UUID NOT NULL REFERENCES token_group(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) NOT NULL
    CHECK (type IN ('color', 'dimension', 'font', 'number', 'string')),
  description TEXT,
  reference_token_id UUID REFERENCES design_token(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

CREATE INDEX idx_token_tenant ON design_token(tenant_id);
CREATE INDEX idx_token_group ON design_token(group_id);

-- 015_seed_standard_categories.sql
-- Standard categories seeded per tenant on tenant creation
-- Layout, Navigation, Forms, Buttons, Inputs, Data Display,
-- Feedback, Media, Utilities
-- Seeding logic runs as part of tenant provisioning, not as a
-- standalone migration insert.

-- 016_create_v03_rls_policies.sql
-- All V03 tables enforce tenant isolation:
-- component, component_category, component_version,
-- component_tag, component_dependency, token_group, design_token
```

## 16. Engineering Constraints

| Constraint | Specification |
|------------|--------------|
| Language | TypeScript (strict mode) |
| Architecture | Modular monolith — feature boundaries within single deployment |
| Database | Supabase PostgreSQL |
| Row Level Security | Mandatory on all tables |
| Feature boundaries | `features/components/` and `features/design-tokens/` |
| Migrations | Sequential, numbered, continue from V02 sequence (008+) |
| API validation | Zod schemas for all request bodies |
| Circular dependency detection | Application-layer validation on dependency creation |
| Documentation storage | JSONB columns for structured component documentation |
| Token reference resolution | Application-layer with cycle detection |

## 17. Future Volume Attachment Points

| Future Capability | Where It Attaches | Volume |
|-------------------|-------------------|--------|
| Templates | Component composition patterns | V04+ |
| Publishing | Component export and distribution | V04+ |
| AI generation | Component creation from prompts | V04+ |
| Asset libraries | Component visual asset management | V04+ |
| Brand management | Token theme variants | V04+ |
| Marketplace | Component sharing across tenants | V04+ |

No schema, API, or implementation is provided for these.

---

## Constitutional Boundary Statement

MASS-APP-013-V03 owns component organization, design token definitions, component documentation, component categorization, and component dependency tracking within Design Studio. It does not own and shall not duplicate: document persistence (ENG-008), user authentication (ENG-003), security policy enforcement (ENG-004), event distribution (ENG-005), enterprise knowledge persistence (ENG-007), or API framework conventions (ENG-015). All platform capabilities are consumed through the Engineering Library, never reimplemented.
