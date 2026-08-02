# MASS-APP-013-V06 — Communications & Content Creation

## Document Information

| Field | Value |
|-------|-------|
| Application | MASS-APP-013 — Design Studio |
| Volume | V06 |
| Title | Communications & Content Creation |
| Version | 1.0 |
| Status | Complete |
| Work Order | WO-013-V06 |
| Manufacturing Date | 2026-08-02 |
| Authority | MASS Constitution → Engineering Library → Application Directives → Repository Canon → MASS V1 Manufacturing Guide |

## Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0 | 2026-08-02 | Initial manufacturing under Production Reset doctrine |

---

## 1. Purpose

Communications & Content Creation establishes how Design Studio creates, organizes, reviews, approves, and prepares communication content for downstream delivery systems.

This volume defines content composition, structured sections, content lifecycle, review and approval workflows, revision history, and downstream handoff records. After implementation, users shall be able to create structured content items, compose content from reusable sections, organize content by purpose and channel, maintain drafts and revisions, route content through lightweight review and approval, associate content with projects, templates, assets, and publications, and prepare approved content for downstream delivery systems.

This volume does not define email, SMS, push, or social delivery; audience selection or recipient governance; campaign orchestration; delivery scheduling; AI content generation; analytics attribution; live collaborative editing; or external CMS integrations.

**Mandatory Boundary:** V06 defines what communication content is created and approved. ENG-023 and applicable delivery systems govern recipients, consent, communication policies, transport, delivery status, suppression, and channel execution. V06 may prepare and hand off approved content, but it shall not send communications directly.

## 2. Scope

### Included

- Content-item architecture
- Structured content composition
- Content categories and channel profiles
- Draft lifecycle
- Revisions
- Review and approval
- Metadata, tags, and ownership
- Project, template, asset, and publication references
- Content preview
- Downstream handoff records
- Search and filtering

### Excluded

- Email, SMS, push, or social delivery (ENG-023 / delivery systems)
- Audience selection and recipient governance (ENG-023)
- Campaign orchestration (future volume)
- Delivery scheduling (ENG-023)
- AI content generation (future volume)
- Analytics attribution (future volume)
- Live collaborative editing (future volume)
- External CMS integrations (future volume)

## 3. Platform Consumption Map

| Platform Service | How V06 Consumes It |
|------------------|---------------------|
| ENG-002 Enterprise Core | Tenant context, entity ID generation, lifecycle state patterns |
| ENG-003 Identity Engine | User authentication, tenant resolution |
| ENG-004 Security Framework | Row Level Security policies |
| ENG-005 Event Bus Engine | Content lifecycle event publication |
| ENG-007 Knowledge Engine | Enterprise knowledge references within content |
| ENG-008 Document Engine | Document persistence for content attachments where required |
| ENG-010 Notification Engine | Review assignment notifications only |
| ENG-012 Persistence Framework | PostgreSQL connection, migration patterns |
| ENG-015 API Framework | REST endpoint structure, request validation |
| ENG-023 Communications Engine | Downstream delivery boundary — handoff target |

### Responsibilities Owned by V06

- Content item CRUD and lifecycle operations
- Structured content composition (sections)
- Content type taxonomy
- Content revision management
- Review and approval workflow
- Reviewer assignment and review history
- Content reference tracking across projects, templates, assets, and publications
- Downstream handoff record creation and tracking
- Content search and discovery
- Content preview rendering

### Responsibilities Delegated

- Binary file storage → ENG-008 (Document Engine)
- Communication delivery (recipients, consent, transport, status) → ENG-023 (Communications Engine)
- Authentication and tenant isolation → ENG-003, ENG-004
- Event distribution → ENG-005
- Review assignment notifications → ENG-010
- API conventions → ENG-015
- Project context → V02
- Asset references → V05
- Template composition → V04

### Enterprise Events Published

| Event | Trigger |
|-------|---------|
| `content.created` | New content item created |
| `content.updated` | Content metadata modified |
| `content.submitted` | Content submitted for review |
| `content.approved` | Content approved by reviewer |
| `content.rejected` | Content rejected by reviewer |
| `content.returned_to_draft` | Content returned to draft state |
| `content.archived` | Content moved to archived state |
| `content.restored` | Content returned from archived state |
| `content.deleted` | Content soft-deleted |
| `content.duplicated` | Content item duplicated |
| `content.revision.created` | New content revision created |
| `content.review.created` | Review record created |
| `content.review.commented` | Review comment added |
| `content.handoff.created` | Downstream handoff initiated |
| `content.handoff.updated` | Handoff status changed |

### Enterprise Events Consumed

| Event | Response |
|-------|----------|
| `project.deleted` | Remove project-scoped content references (content items remain) |
| `asset.archived` | Flag asset references within content as stale |
| `template.archived` | Flag template references within content as stale |
| `publication.archived` | Preserve publication references as historical |

## 4. Constitutional Boundary Statement

This volume owns content composition, structured content creation, content lifecycle, review and approval, revision history, downstream handoff records, and content reference tracking within Design Studio. It does not own and shall not duplicate: communication delivery, recipient governance, consent management, or transport execution (ENG-023); binary file storage (ENG-008); user authentication (ENG-003); security policy enforcement (ENG-004); event distribution (ENG-005); notification transport (ENG-010); or API framework conventions (ENG-015).

**Content/Delivery Boundary:** V06 creates and approves content. V06 does not send content. Handoff records track that approved content was made available to a downstream system — they do not represent delivery confirmation. Delivery status, if returned by the downstream system, is recorded on the handoff record for audit purposes only.

## 5. Content Architecture

### 5.1 Content Item Entity

A content item is a governed piece of communication content with structured composition, lifecycle management, and revision history. Content items are tenant-scoped.

```
ContentItem
├── Identity (ID, tenant, owner)
├── Classification (type, intended channel)
├── Composition (ordered sections)
├── Lifecycle (status, timestamps)
├── Revision History (immutable revision records)
├── Review History (reviewer decisions, comments)
├── References (links to projects, templates, assets, publications)
├── Handoffs (downstream delivery records)
├── Tags (freeform categorization)
└── Favorites (user quick access)
```

### 5.2 Content Types

Content types describe composition intent and intended use. A content type does not authorize delivery.

| Content Type | Description | Typical Sections |
|-------------|-------------|------------------|
| Announcement | Organizational announcements | Heading, Body, Call to Action |
| Article | Long-form written content | Heading, Body, Image Reference, Quote |
| Email Content | Content prepared for email delivery | Heading, Body, Call to Action, Legal Note |
| SMS Content | Short-form content for SMS channel | Body (character-limited) |
| Social Post | Content for social media channels | Body, Image Reference, Call to Action |
| Web Content | Content for web publishing | Heading, Body, Image Reference, Table, List |
| Internal Notice | Internal organizational communications | Heading, Body, Metadata Block |
| Campaign Creative | Creative assets for marketing campaigns | Heading, Body, Image Reference, Asset Reference, Call to Action |
| Customer Education | Educational content for customers | Heading, Body, List, Table, Image Reference |
| General Content | Uncategorized content | Any sections |

Custom content types may be created by tenant administrators. Custom types follow the same structure as standard types.

### 5.3 Content Lifecycle

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
                              │ Approved │ (read-only)
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
| Draft | Work in progress. Editable. Not visible in default content listings unless filtered. | → In Review |
| In Review | Submitted for reviewer evaluation. Read-only during review. | → Approved, → Rejected |
| Rejected | Review returned with rejection reason. | → Draft (return to draft) |
| Approved | Content approved. Read-only and immutable. Any correction creates a new revision. | → Archived |
| Archived | No longer active. Read-only. Existing references and handoffs preserved. | → Draft (restore creates new revision) |

**Lifecycle Rules:**
- Only content owners or tenant administrators may submit content for review
- Only assigned reviewers may approve or reject content
- Approved content is immutable — any modification creates a new revision in Draft state
- Restoring archived content creates a new revision in Draft state (the approved revision remains immutable)
- Rejection requires a reason
- A content item with pending handoffs cannot be archived without confirmation

### 5.4 Content Scope

Content items are tenant-scoped. All users within a tenant (subject to role permissions) share the same content library. Content items may optionally be associated with a project for organizational purposes.

## 6. Structured Sections

### 6.1 Section Types

Content items are composed of ordered sections. Each section has a type that governs its structure and rendering.

| Section Type | Description | Content Field |
|-------------|-------------|---------------|
| Heading | Section title or headline | text (VARCHAR) |
| Body | Rich text paragraph content | text (TEXT) |
| Call to Action | Actionable prompt with optional link | text, url |
| Quote | Attributed quotation | text, attribution |
| List | Ordered or unordered list items | items (TEXT[]), list_type (ordered/unordered) |
| Table | Tabular data | headers (TEXT[]), rows (JSONB) |
| Image Reference | Reference to an asset (image) | asset_id (FK), alt_text, caption |
| Asset Reference | Reference to any asset type | asset_id (FK), display_label |
| Legal Note | Legal or compliance required text | text (TEXT) |
| Metadata Block | Structured key-value metadata | entries (JSONB) |

### 6.2 Section Ordering

- Sections are ordered by a `position` integer within their content item
- Position values are sequential starting from 0
- Reordering sections updates position values
- Sections belong to a specific content revision — modifying sections on an approved revision is prohibited

### 6.3 Section Rules

- A content item must have at least one section
- Section types are validated against the content type's typical sections (advisory, not enforced — all section types are available for all content types)
- Image Reference and Asset Reference sections store an `asset_id` linking to V05 assets
- Sections are revision-scoped: each revision carries its own set of sections

## 7. Content Revisions

### 7.1 Revision Model

Every content item maintains a revision history. Revisions are immutable once approved.

| Field | Description |
|-------|-------------|
| Revision Number | Sequential integer (1, 2, 3...) |
| Status | Draft, In Review, Approved, Rejected, Archived |
| Sections | Ordered set of content sections for this revision |
| Created By | Who created this revision |
| Created At | When this revision was created |
| Approved By | Who approved (null if not approved) |
| Approved At | When approved (null if not approved) |
| Rejection Reason | Why rejected (null if not rejected) |

### 7.2 Revision Rules

- The first save of a content item creates revision 1
- Submitting for review locks the current revision (read-only during review)
- Approval marks the revision as immutable — it cannot be modified after approval
- Rejection returns the revision to a rejectable state; the author may return it to draft
- Returning to draft from rejection creates a new revision that copies sections from the rejected revision
- Restoring an archived content item creates a new revision
- Revision history cannot be deleted (compliance requirement)

### 7.3 Immutability Enforcement

Approved revisions are immutable. The system shall reject any attempt to:
- Modify sections of an approved revision
- Change metadata of an approved revision (except lifecycle state transitions)
- Delete an approved revision
- Alter the approval record (approved_by, approved_at)

Any correction to approved content follows this path: create new revision → edit → submit → approve.

## 8. Review and Approval

### 8.1 Review Model

Content reviews are formal records of reviewer evaluation.

| Field | Description |
|-------|-------------|
| Review ID | Unique identifier |
| Content Item ID | Content being reviewed |
| Revision Number | Which revision is under review |
| Reviewer ID | Assigned reviewer |
| Decision | pending, approved, rejected |
| Rejection Reason | Required when decision is rejected |
| Decided At | When the decision was made |
| Created At | When the review was assigned |

### 8.2 Review Comments

Reviewers may attach comments to a review before or alongside their decision.

| Field | Description |
|-------|-------------|
| Comment ID | Unique identifier |
| Review ID | Parent review |
| Author ID | Comment author |
| Body | Comment text |
| Section ID | Optional — specific section the comment addresses |
| Created At | When the comment was posted |

### 8.3 Review Rules

- Only users with Editor or Admin role may submit content for review
- Reviewers are explicitly assigned — any tenant user with Editor or Admin role may be assigned
- A reviewer cannot review their own content (the content owner cannot be assigned as reviewer)
- Multiple reviewers may be assigned; a single approval from any assigned reviewer is sufficient
- Rejection by any reviewer returns the content to Rejected state
- Review assignment triggers a notification through ENG-010
- Review history is preserved permanently — decisions and comments are never deleted
- A content item in Draft or Rejected state cannot receive review decisions

### 8.4 Review Authorization

The review workflow enforces separation of authorship and approval:
- Content owners create and edit content
- Reviewers evaluate and decide
- The system prevents self-approval
- Admin users may override and approve content they did not author

## 9. Content References

### 9.1 Reference Model

Content items may reference other Design Studio entities. References are tracking relationships.

```
ContentReference
├── content_id        (the content item)
├── entity_type       (project | template | asset | publication)
├── entity_id         (ID of the referenced entity)
├── context           (usage context: e.g., "featured-image", "source-template")
├── created_by        (who created the reference)
└── created_at        (when the reference was created)
```

### 9.2 Reference Rules

- A content item may reference any number of entities
- Removing a reference does not affect the content item or the referenced entity
- `entity_id` is polymorphic. Because PostgreSQL cannot enforce a foreign key across multiple target tables, tenant isolation for referenced entities is enforced by RLS policies and application-layer validation. The application must verify that the referenced entity exists, belongs to the same tenant, and is in a valid lifecycle state before creating a reference.
- `context` is NOT NULL DEFAULT '' to ensure uniqueness constraint integrity
- `UNIQUE (content_id, entity_type, entity_id, context)` prevents duplicate references

## 10. Downstream Handoffs

### 10.1 Handoff Model

An approved content revision may be handed off to a downstream delivery system. A handoff is an auditable record that approved content was made available — it does not represent delivery.

```
ContentHandoff
├── id                    (handoff record ID)
├── content_id            (content item)
├── revision_number       (which approved revision)
├── intended_channel      (email, sms, social, web, etc.)
├── destination_system    (identifier for the downstream system)
├── status                (pending | accepted | rejected | failed)
├── requested_by          (who initiated the handoff)
├── requested_at          (when the handoff was initiated)
├── responded_at          (when the downstream system responded)
├── external_ref          (reference ID returned by downstream system)
├── failure_reason        (why the handoff failed or was rejected)
└── idempotency_key       (unique key preventing duplicate handoffs)
```

### 10.2 Handoff Lifecycle

```
┌──────────┐    initiate    ┌──────────┐
│          │───────────────▶│          │
│  (none)  │                │ Pending  │
│          │                │          │
└──────────┘                └──┬───┬───┘
                               │   │
                         accepted  rejected/failed
                               │   │
                          ┌────▼─┐ ┌▼─────────┐
                          │      │ │           │
                          │Accept│ │Rejected/  │
                          │  ed  │ │  Failed   │
                          │      │ │           │
                          └──────┘ └───────────┘
```

**Handoff States:**

| State | Description |
|-------|-------------|
| Pending | Handoff initiated, awaiting downstream system response |
| Accepted | Downstream system accepted the content for processing |
| Rejected | Downstream system rejected the content (reason recorded) |
| Failed | Handoff transmission failed (reason recorded) |

### 10.3 Handoff Rules

- Only approved revisions may be handed off
- Handoffs are idempotent: the `idempotency_key` (composed of `content_id` + `revision_number` + `intended_channel` + `destination_system`) prevents duplicate handoffs for the same content to the same destination
- If a duplicate handoff is attempted, the system returns the existing handoff record rather than creating a new one
- A rejected or failed handoff may be retried by creating a new handoff record with a new idempotency key suffix (e.g., appending a retry counter)
- Handoff records are never deleted (audit requirement)
- V06 records the handoff and its status. It does not track whether the downstream system ultimately delivered the content to recipients — that responsibility belongs to ENG-023

### 10.4 Failure Behavior

When a downstream system rejects a handoff:
1. The handoff record status is set to `rejected` or `failed`
2. The `failure_reason` is populated from the downstream system's response
3. A `content.handoff.updated` event is published
4. The content item itself remains in its current lifecycle state — a handoff failure does not change content status
5. The user is notified through ENG-010 that the handoff was unsuccessful
6. The user may correct the issue and initiate a new handoff (retry)

## 11. Search and Filtering

### 11.1 Search Capabilities

| Capability | Description |
|------------|-------------|
| Text search | Case-insensitive partial match on title and description |
| Content type filter | Filter by one or more content types |
| Channel filter | Filter by intended channel |
| Status filter | Filter by lifecycle state (default: all non-deleted) |
| Tag filter | Filter by one or more tags |
| Owner filter | Filter by content owner |
| Project filter | Filter by associated project |
| Date range | Filter by creation or modification date |
| Reviewer filter | Filter to content assigned to a specific reviewer |
| Review status | Filter by review decision (pending, approved, rejected) |
| Handoff status | Filter by handoff state |
| Favorites | Filter to user's favorited content |

### 11.2 Sort Options

| Sort Field | Description |
|------------|-------------|
| title | Alphabetical by content title |
| created_at | Creation date (default, newest first) |
| updated_at | Last modification date |
| status | Lifecycle state |
| content_type | Content type name |

## 12. Data Model

### 12.1 Entity Definitions

**ContentItem**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| title | VARCHAR(255) | No | — | Content title |
| description | TEXT | Yes | NULL | Content description |
| content_type_id | UUID | No | — | Content type (composite FK with tenant_id → content_type) |
| intended_channel | VARCHAR(50) | Yes | NULL | Target channel (email, sms, social, web, etc.) |
| project_id | UUID | Yes | NULL | Optional project association |
| status | VARCHAR(20) | No | 'draft' | Lifecycle state |
| owner_id | UUID | No | — | Content owner (FK) |
| current_revision | INTEGER | No | 1 | Active revision number |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |
| approved_by | UUID | Yes | NULL | Who approved current revision |
| approved_at | TIMESTAMPTZ | Yes | NULL | When approved |
| archived_at | TIMESTAMPTZ | Yes | NULL | When archived |
| deleted_at | TIMESTAMPTZ | Yes | NULL | When soft-deleted |

**ContentType**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(100) | No | — | Type name |
| description | TEXT | Yes | NULL | Type description |
| is_standard | BOOLEAN | No | false | Platform-standard type |
| typical_sections | TEXT[] | Yes | NULL | Advisory list of recommended section types |
| position | INTEGER | No | 0 | Display order |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |

**ContentRevision**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| content_id | UUID | No | — | Parent content item (FK) |
| revision_number | INTEGER | No | — | Sequential revision |
| status | VARCHAR(20) | No | 'draft' | Revision state |
| created_by | UUID | No | — | Who created (FK) |
| created_at | TIMESTAMPTZ | No | now() | Revision timestamp |
| approved_by | UUID | Yes | NULL | Who approved (FK) |
| approved_at | TIMESTAMPTZ | Yes | NULL | When approved |
| rejection_reason | TEXT | Yes | NULL | Why rejected |
| rejected_at | TIMESTAMPTZ | Yes | NULL | When rejected |

**ContentSection**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| revision_id | UUID | No | — | Parent revision (FK) |
| section_type | VARCHAR(30) | No | — | Section type identifier |
| position | INTEGER | No | 0 | Order within revision |
| text_content | TEXT | Yes | NULL | Text content (heading, body, quote, legal note) |
| url | VARCHAR(2048) | Yes | NULL | URL for call-to-action sections |
| attribution | VARCHAR(255) | Yes | NULL | Attribution for quote sections |
| list_items | TEXT[] | Yes | NULL | Items for list sections |
| list_type | VARCHAR(10) | Yes | NULL | ordered or unordered |
| table_headers | TEXT[] | Yes | NULL | Column headers for table sections |
| table_rows | JSONB | Yes | NULL | Row data for table sections |
| asset_id | UUID | Yes | NULL | Referenced asset for image/asset sections |
| alt_text | VARCHAR(255) | Yes | NULL | Alt text for image references |
| caption | VARCHAR(500) | Yes | NULL | Caption for image references |
| display_label | VARCHAR(255) | Yes | NULL | Display label for asset references |
| metadata_entries | JSONB | Yes | NULL | Key-value pairs for metadata block sections |

**ContentReview**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| content_id | UUID | No | — | Content being reviewed (FK) |
| revision_number | INTEGER | No | — | Which revision |
| reviewer_id | UUID | No | — | Assigned reviewer (FK) |
| decision | VARCHAR(20) | No | 'pending' | pending, approved, rejected |
| rejection_reason | TEXT | Yes | NULL | Required when rejected |
| decided_at | TIMESTAMPTZ | Yes | NULL | When decided |
| created_at | TIMESTAMPTZ | No | now() | When assigned |

**ContentReviewComment**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| review_id | UUID | No | — | Parent review (FK) |
| author_id | UUID | No | — | Comment author (FK) |
| body | TEXT | No | — | Comment text |
| section_id | UUID | Yes | NULL | Optional section reference |
| created_at | TIMESTAMPTZ | No | now() | When posted |

**ContentTag**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| content_id | UUID | No | — | Content item (FK) |
| tag | VARCHAR(100) | No | — | Tag value |
| created_at | TIMESTAMPTZ | No | now() | When applied |

**ContentReference**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| content_id | UUID | No | — | Content item (FK) |
| entity_type | VARCHAR(20) | No | — | project, template, asset, publication |
| entity_id | UUID | No | — | ID of referenced entity |
| context | VARCHAR(100) | No | '' | Usage context (empty string if unspecified) |
| created_by | UUID | No | — | Who created reference (FK) |
| created_at | TIMESTAMPTZ | No | now() | When referenced |

**ContentFavorite**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| user_id | UUID | No | — | User (FK) |
| content_id | UUID | No | — | Favorited content (FK) |
| favorited_at | TIMESTAMPTZ | No | now() | When favorited |

**ContentHandoff**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| content_id | UUID | No | — | Content item (FK) |
| revision_number | INTEGER | No | — | Approved revision handed off |
| intended_channel | VARCHAR(50) | No | — | Target channel |
| destination_system | VARCHAR(100) | No | — | Downstream system identifier |
| status | VARCHAR(20) | No | 'pending' | pending, accepted, rejected, failed |
| requested_by | UUID | No | — | Who initiated (FK) |
| requested_at | TIMESTAMPTZ | No | now() | When initiated |
| responded_at | TIMESTAMPTZ | Yes | NULL | When downstream responded |
| external_ref | VARCHAR(255) | Yes | NULL | Reference from downstream system |
| failure_reason | TEXT | Yes | NULL | Why failed or rejected |
| idempotency_key | VARCHAR(255) | No | — | Unique key preventing duplicates |

### 12.2 Entity Relationships

```
┌──────────────────┐       ┌──────────────────────┐
│   ContentType    │──1:N─▶│    ContentItem       │
│                  │       │                       │
│  tenant_id (FK)  │       │  content_type_id (FK) │
│                  │       │  tenant_id (FK)       │
│  UNIQUE(id,      │       │  owner_id (FK)        │
│    tenant_id)    │       │  project_id (FK, opt) │
└──────────────────┘       └──┬──┬──┬──┬──┬────────┘
                              │  │  │  │  │
              ┌───────────────┘  │  │  │  └────────────────┐
              │     ┌────────────┘  │  └───────────┐       │
              │     │               │              │       │
              │1:N  │1:N            │1:N           │1:N    │1:N
              ▼     ▼               ▼              ▼       ▼
      ┌─────────┐ ┌───────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
      │Content  │ │Content    │ │Content  │ │Content   │ │Content   │
      │Revision │ │Review     │ │Tag      │ │Reference │ │Handoff   │
      │         │ │           │ │         │ │          │ │          │
      │content_ │ │content_id │ │content_ │ │content_  │ │content_  │
      │  id(FK) │ │  (FK)     │ │  id(FK) │ │  id(FK)  │ │  id(FK)  │
      └──┬──────┘ └──┬────────┘ └─────────┘ └──────────┘ └──────────┘
         │            │
         │1:N         │1:N
         ▼            ▼
  ┌────────────┐ ┌──────────────┐
  │Content     │ │Content       │
  │Section     │ │ReviewComment │
  │            │ │              │
  │revision_id │ │review_id(FK) │
  │  (FK)      │ │              │
  └────────────┘ └──────────────┘

┌──────────────────┐
│ContentFavorite   │
│                  │
│  user_id (FK)    │
│  content_id (FK) │
└──────────────────┘
```

**Constraints:**
- `content_item.tenant_id` + `content_item.title` is unique (no duplicate titles within a tenant)
- `content_type.tenant_id` + `content_type.name` is unique
- `content_type` has `UNIQUE (id, tenant_id)` to enable composite FK from `content_item`
- `content_item.content_type_id` + `content_item.tenant_id` references `content_type(id, tenant_id)` — tenant-safe composite FK
- `content_revision.content_id` + `content_revision.revision_number` is unique
- `content_section.revision_id` + `content_section.position` is unique
- `content_review.content_id` + `content_review.revision_number` + `content_review.reviewer_id` is unique (one review per reviewer per revision)
- `content_tag.content_id` + `content_tag.tag` is unique
- `content_reference.content_id` + `content_reference.entity_type` + `content_reference.entity_id` + `content_reference.context` is unique
- `content_favorite.user_id` + `content_favorite.content_id` is primary key
- `content_handoff.idempotency_key` is unique

### 12.3 Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| content_item | idx_ci_tenant | tenant_id, status | Tenant-scoped listing |
| content_item | idx_ci_type | content_type_id | Type filtering |
| content_item | idx_ci_owner | owner_id | Owner lookup |
| content_item | idx_ci_project | project_id | Project filtering |
| content_item | idx_ci_channel | intended_channel | Channel filtering |
| content_revision | idx_cr_content | content_id | Revision history |
| content_section | idx_cs_revision | revision_id, position | Section ordering |
| content_review | idx_crv_content | content_id, revision_number | Reviews for content |
| content_review | idx_crv_reviewer | reviewer_id, decision | Reviewer workload |
| content_review_comment | idx_crc_review | review_id | Comments for review |
| content_tag | idx_ctag_value | tag | Tag search |
| content_reference | idx_cref_content | content_id | Content's references |
| content_reference | idx_cref_entity | entity_type, entity_id | Entity's content |
| content_handoff | idx_ch_content | content_id | Content's handoffs |
| content_handoff | idx_ch_idempotency | idempotency_key | Duplicate prevention |
| content_handoff | idx_ch_status | status | Status filtering |

## 13. API Specification

### 13.1 Content Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /content | List content items (paginated, filterable) | Viewer |
| GET | /content/{id} | Get content item with current revision | Viewer |
| POST | /content | Create content item | Editor |
| PATCH | /content/{id} | Update content metadata | Editor |
| DELETE | /content/{id} | Soft-delete content item | Admin |
| POST | /content/{id}/duplicate | Duplicate content item | Editor |
| POST | /content/{id}/submit-review | Submit for review | Editor |
| POST | /content/{id}/approve | Approve content (reviewer only) | Editor |
| POST | /content/{id}/reject | Reject content (reviewer only) | Editor |
| POST | /content/{id}/return-to-draft | Return rejected content to draft | Editor |
| POST | /content/{id}/archive | Archive content | Admin |
| POST | /content/{id}/restore | Restore archived content (creates new revision) | Admin |

### 13.2 Revision Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /content/{id}/revisions | List all revisions | Viewer |
| POST | /content/{id}/revisions | Create new revision | Editor |

### 13.3 Review Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /content/{id}/reviews | List reviews for content | Viewer |
| POST | /content/{id}/reviews/{reviewId}/comments | Add review comment | Editor |

### 13.4 Reference Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /content-types | List all content types | Viewer |
| GET | /content/{id}/references | List content references | Viewer |
| POST | /content/{id}/references | Create content reference | Editor |
| DELETE | /content/{id}/references/{referenceId} | Remove content reference | Editor |

### 13.5 Favorite Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| POST | /content/{id}/favorite | Favorite content | Viewer |
| DELETE | /content/{id}/favorite | Unfavorite content | Viewer |

### 13.6 Handoff Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| POST | /content/{id}/handoffs | Initiate downstream handoff | Admin |
| GET | /content/{id}/handoffs | List handoffs for content | Viewer |

### 13.7 Query Parameters — GET /content

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: draft, in_review, approved, rejected, archived, all (default: all non-deleted) |
| content_type | UUID | Filter by content type ID |
| channel | string | Filter by intended channel |
| search | string | Search by title and description |
| tag | string | Filter by tag |
| owner | UUID | Filter by content owner |
| project | UUID | Filter by associated project |
| reviewer | UUID | Filter to content assigned to a specific reviewer |
| review_status | string | Filter by review decision: pending, approved, rejected |
| handoff_status | string | Filter by handoff state |
| favorited | boolean | Filter to user's favorites |
| created_after | ISO date | Creation date lower bound |
| created_before | ISO date | Creation date upper bound |
| sort | string | Sort: title, created_at (default), updated_at, status, content_type |
| order | string | Direction: asc, desc (default) |
| limit | integer | Page size (default 25, max 100) |
| offset | integer | Pagination offset (default 0) |

### 13.8 Request/Response Shapes

**POST /content — Create Content Item**

Request:
```json
{
  "title": "Q3 Product Launch Announcement",
  "description": "Customer-facing announcement for Q3 product launch",
  "content_type_id": "ct-uuid-announcement",
  "intended_channel": "email",
  "project_id": "proj-uuid-...",
  "tags": ["product-launch", "q3", "customer"],
  "sections": [
    {
      "section_type": "heading",
      "position": 0,
      "text_content": "Introducing Our Latest Innovation"
    },
    {
      "section_type": "body",
      "position": 1,
      "text_content": "We are excited to announce..."
    },
    {
      "section_type": "image_reference",
      "position": 2,
      "asset_id": "asset-uuid-...",
      "alt_text": "Product hero image",
      "caption": "The all-new product line"
    },
    {
      "section_type": "call_to_action",
      "position": 3,
      "text_content": "Learn More",
      "url": "https://example.com/launch"
    }
  ]
}
```

Response (201):
```json
{
  "id": "content-uuid-...",
  "tenant_id": "t-uuid-...",
  "title": "Q3 Product Launch Announcement",
  "description": "Customer-facing announcement for Q3 product launch",
  "content_type": {
    "id": "ct-uuid-announcement",
    "name": "Announcement"
  },
  "intended_channel": "email",
  "project_id": "proj-uuid-...",
  "status": "draft",
  "owner_id": "u-uuid-...",
  "current_revision": 1,
  "created_at": "2026-08-02T14:00:00Z",
  "updated_at": "2026-08-02T14:00:00Z",
  "tags": ["product-launch", "q3", "customer"],
  "sections": [
    {
      "id": "sec-uuid-...",
      "section_type": "heading",
      "position": 0,
      "text_content": "Introducing Our Latest Innovation"
    }
  ]
}
```

**POST /content/{id}/handoffs — Initiate Handoff**

Request:
```json
{
  "revision_number": 2,
  "intended_channel": "email",
  "destination_system": "eng-023-email-service"
}
```

Response (201):
```json
{
  "id": "handoff-uuid-...",
  "content_id": "content-uuid-...",
  "revision_number": 2,
  "intended_channel": "email",
  "destination_system": "eng-023-email-service",
  "status": "pending",
  "requested_by": "u-uuid-...",
  "requested_at": "2026-08-02T15:00:00Z",
  "idempotency_key": "content-uuid-..._2_email_eng-023-email-service"
}
```

Response (200 — duplicate detected):
```json
{
  "id": "handoff-uuid-existing-...",
  "content_id": "content-uuid-...",
  "status": "pending",
  "message": "Handoff already exists for this content, revision, channel, and destination"
}
```

### 13.9 Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400 | INVALID_INPUT | Missing required fields or invalid values |
| 400 | NO_SECTIONS | Content item has no sections |
| 400 | REVISION_NOT_APPROVED | Handoff attempted on non-approved revision |
| 400 | REJECTION_REASON_REQUIRED | Rejection without reason |
| 401 | UNAUTHORIZED | No valid session |
| 403 | FORBIDDEN | Insufficient role |
| 403 | SELF_REVIEW_PROHIBITED | Owner assigned as reviewer |
| 403 | NOT_ASSIGNED_REVIEWER | Approve/reject by non-assigned user |
| 404 | NOT_FOUND | Entity not found or not accessible |
| 409 | CONFLICT | Duplicate title within tenant |
| 409 | DUPLICATE_HANDOFF | Idempotent handoff already exists |
| 409 | REVISION_IMMUTABLE | Attempt to modify approved revision |
| 422 | INVALID_STATE_TRANSITION | Lifecycle state transition not permitted |
| 422 | CONTENT_NOT_IN_REVIEW | Approve/reject on content not in review |
| 422 | HAS_PENDING_HANDOFFS | Archive attempted with pending handoffs |

## 14. Permission Model

Content library uses tenant-level roles:

| Role | Browse/Search | Create/Edit | Submit Review | Review/Decide | Handoff | Archive/Delete | Manage Types |
|------|--------------|-------------|--------------|--------------|---------|----------------|-------------|
| Viewer | Yes | No | No | No | No | No | No |
| Editor | Yes | Yes | Yes | Yes (when assigned) | No | No | No |
| Admin | Yes | Yes | Yes | Yes (except own content) | Yes | Yes | Yes |

Row Level Security enforces tenant isolation on all content tables.

## 15. Folder Structure — Design Studio V06 Organization

```
apps/design-studio/
├── src/
│   ├── app/
│   │   ├── (projects)/                        # V02 routes
│   │   ├── (design-system)/                   # V03 routes
│   │   ├── (templates)/                       # V04 routes
│   │   ├── (publications)/                    # V04 routes
│   │   ├── (assets)/                          # V05 routes
│   │   ├── (content)/
│   │   │   ├── page.tsx                       # Content library
│   │   │   ├── new/
│   │   │   │   └── page.tsx                   # Create content
│   │   │   └── [contentId]/
│   │   │       ├── page.tsx                   # Content detail / editor
│   │   │       ├── preview/
│   │   │       │   └── page.tsx               # Content preview
│   │   │       ├── revisions/
│   │   │       │   └── page.tsx               # Revision history
│   │   │       ├── reviews/
│   │   │       │   └── page.tsx               # Review history
│   │   │       └── handoffs/
│   │   │           └── page.tsx               # Handoff records
│   │   └── layout.tsx
│   ├── features/
│   │   ├── projects/                          # V02
│   │   ├── components/                        # V03
│   │   ├── design-tokens/                     # V03
│   │   ├── templates/                         # V04
│   │   ├── publications/                      # V04
│   │   ├── assets/                            # V05
│   │   └── content/
│   │       ├── api/
│   │       │   ├── content.ts
│   │       │   ├── content-types.ts
│   │       │   ├── revisions.ts
│   │       │   ├── sections.ts
│   │       │   ├── reviews.ts
│   │       │   ├── references.ts
│   │       │   └── handoffs.ts
│   │       ├── components/
│   │       │   ├── ContentList.tsx
│   │       │   ├── ContentCard.tsx
│   │       │   ├── ContentEditor.tsx
│   │       │   ├── ContentPreview.tsx
│   │       │   ├── SectionEditor.tsx
│   │       │   ├── SectionRenderer.tsx
│   │       │   ├── RevisionHistory.tsx
│   │       │   ├── ReviewPanel.tsx
│   │       │   ├── ReviewCommentThread.tsx
│   │       │   ├── HandoffDialog.tsx
│   │       │   └── HandoffStatusBadge.tsx
│   │       ├── hooks/
│   │       │   ├── useContent.ts
│   │       │   ├── useContentList.ts
│   │       │   ├── useRevisions.ts
│   │       │   ├── useReviews.ts
│   │       │   ├── useHandoffs.ts
│   │       │   └── useContentTypes.ts
│   │       └── types/
│   │           └── content.ts
│   └── lib/
│       └── supabase/
│           └── client.ts
├── supabase/
│   └── migrations/
│       ├── ...                                # V02-V05 (001-036)
│       ├── 037_create_content_types.sql
│       ├── 038_create_content_items.sql
│       ├── 039_create_content_revisions.sql
│       ├── 040_create_content_sections.sql
│       ├── 041_create_content_reviews.sql
│       ├── 042_create_content_review_comments.sql
│       ├── 043_create_content_tags.sql
│       ├── 044_create_content_references.sql
│       ├── 045_create_content_favorites.sql
│       ├── 046_create_content_handoffs.sql
│       ├── 047_seed_content_types.sql
│       └── 048_create_v06_rls_policies.sql
└── package.json
```

## 16. Migration SQL Reference

```sql
-- 037_create_content_types.sql
CREATE TABLE content_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_standard BOOLEAN NOT NULL DEFAULT false,
  typical_sections TEXT[],
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name),
  UNIQUE (id, tenant_id)  -- enables composite FK from content_item
);

-- 038_create_content_items.sql
CREATE TABLE content_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type_id UUID NOT NULL,
  FOREIGN KEY (content_type_id, tenant_id) REFERENCES content_type(id, tenant_id),
  intended_channel VARCHAR(50),
  project_id UUID,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_review', 'approved', 'rejected', 'archived', 'deleted')),
  owner_id UUID NOT NULL REFERENCES users(id),
  current_revision INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  UNIQUE (tenant_id, title)
);

CREATE INDEX idx_ci_tenant ON content_item(tenant_id, status);
CREATE INDEX idx_ci_type ON content_item(content_type_id);
CREATE INDEX idx_ci_owner ON content_item(owner_id);
CREATE INDEX idx_ci_project ON content_item(project_id);
CREATE INDEX idx_ci_channel ON content_item(intended_channel);

-- 039_create_content_revisions.sql
CREATE TABLE content_revision (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_item(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_review', 'approved', 'rejected', 'archived')),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  rejected_at TIMESTAMPTZ,
  UNIQUE (content_id, revision_number)
);

CREATE INDEX idx_cr_content ON content_revision(content_id);

-- 040_create_content_sections.sql
CREATE TABLE content_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES content_revision(id) ON DELETE CASCADE,
  section_type VARCHAR(30) NOT NULL
    CHECK (section_type IN (
      'heading', 'body', 'call_to_action', 'quote', 'list',
      'table', 'image_reference', 'asset_reference',
      'legal_note', 'metadata_block'
    )),
  position INTEGER NOT NULL DEFAULT 0,
  text_content TEXT,
  url VARCHAR(2048),
  attribution VARCHAR(255),
  list_items TEXT[],
  list_type VARCHAR(10) CHECK (list_type IN ('ordered', 'unordered')),
  table_headers TEXT[],
  table_rows JSONB,
  asset_id UUID,
  alt_text VARCHAR(255),
  caption VARCHAR(500),
  display_label VARCHAR(255),
  metadata_entries JSONB,
  UNIQUE (revision_id, position)
);

CREATE INDEX idx_cs_revision ON content_section(revision_id, position);

-- 041_create_content_reviews.sql
CREATE TABLE content_review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_item(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  reviewer_id UUID NOT NULL REFERENCES users(id),
  decision VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (decision IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_id, revision_number, reviewer_id)
);

CREATE INDEX idx_crv_content ON content_review(content_id, revision_number);
CREATE INDEX idx_crv_reviewer ON content_review(reviewer_id, decision);

-- 042_create_content_review_comments.sql
CREATE TABLE content_review_comment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES content_review(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  section_id UUID REFERENCES content_section(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_crc_review ON content_review_comment(review_id);

-- 043_create_content_tags.sql
CREATE TABLE content_tag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_item(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_id, tag)
);

CREATE INDEX idx_ctag_value ON content_tag(tag);

-- 044_create_content_references.sql
CREATE TABLE content_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_item(id) ON DELETE CASCADE,
  entity_type VARCHAR(20) NOT NULL
    CHECK (entity_type IN ('project', 'template', 'asset', 'publication')),
  entity_id UUID NOT NULL,
  context VARCHAR(100) NOT NULL DEFAULT '',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_id, entity_type, entity_id, context)
);

CREATE INDEX idx_cref_content ON content_reference(content_id);
CREATE INDEX idx_cref_entity ON content_reference(entity_type, entity_id);

-- 045_create_content_favorites.sql
CREATE TABLE content_favorite (
  user_id UUID NOT NULL REFERENCES users(id),
  content_id UUID NOT NULL REFERENCES content_item(id) ON DELETE CASCADE,
  favorited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, content_id)
);

-- 046_create_content_handoffs.sql
CREATE TABLE content_handoff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_item(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  intended_channel VARCHAR(50) NOT NULL,
  destination_system VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'failed')),
  requested_by UUID NOT NULL REFERENCES users(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  external_ref VARCHAR(255),
  failure_reason TEXT,
  idempotency_key VARCHAR(255) NOT NULL UNIQUE
);

CREATE INDEX idx_ch_content ON content_handoff(content_id);
CREATE INDEX idx_ch_idempotency ON content_handoff(idempotency_key);
CREATE INDEX idx_ch_status ON content_handoff(status);

-- 047_seed_content_types.sql
-- Standard content types seeded per tenant on tenant creation:
-- Announcement, Article, Email Content, SMS Content, Social Post,
-- Web Content, Internal Notice, Campaign Creative,
-- Customer Education, General Content
-- Seeding logic runs as part of tenant provisioning.

-- 048_create_v06_rls_policies.sql

ALTER TABLE content_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_revision ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_review ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_review_comment ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_favorite ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_handoff ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON content_type
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_isolation ON content_item
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY tenant_isolation ON content_revision
  USING (content_id IN (
    SELECT id FROM content_item WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON content_section
  USING (revision_id IN (
    SELECT cr.id FROM content_revision cr
    JOIN content_item ci ON cr.content_id = ci.id
    WHERE ci.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON content_review
  USING (content_id IN (
    SELECT id FROM content_item WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON content_review_comment
  USING (review_id IN (
    SELECT crv.id FROM content_review crv
    JOIN content_item ci ON crv.content_id = ci.id
    WHERE ci.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON content_tag
  USING (content_id IN (
    SELECT id FROM content_item WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON content_reference
  USING (content_id IN (
    SELECT id FROM content_item WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON content_favorite
  USING (content_id IN (
    SELECT id FROM content_item WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON content_handoff
  USING (content_id IN (
    SELECT id FROM content_item WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  ));
```

## 17. Engineering Constraints

| Constraint | Specification |
|------------|--------------|
| Language | TypeScript (strict mode) |
| Architecture | Modular monolith |
| Database | Supabase PostgreSQL |
| Row Level Security | Mandatory on all tables — concrete policies defined |
| Feature boundary | `features/content/` |
| Migrations | Sequential, continue from V05 sequence (037+) |
| Approved revisions | Immutable — no modification after approval |
| Review authorization | Self-review prohibited; owner cannot approve own content |
| Handoff idempotency | Composite idempotency key prevents duplicate handoffs |
| Content/delivery boundary | V06 creates and approves; ENG-023 delivers |
| Polymorphic references | Application-layer tenant validation where composite FK is impossible |
| Tenant-safe type FK | Composite FK (content_type_id, tenant_id) prevents cross-tenant type reference |
| Section ordering | Sequential position integers, unique per revision |
| API validation | Zod schemas for all request bodies |

## 18. Engineering Decisions

### 18.1 Immutable Approved Revisions

Once a content revision reaches `approved` status, its record and all associated sections are immutable. The application layer rejects any UPDATE or DELETE operation on an approved revision or its sections. Any correction creates a new revision.

### 18.2 Tenant-Safe References

- `content_item.content_type_id` uses a composite FK `(content_type_id, tenant_id) → content_type(id, tenant_id)` preventing cross-tenant type assignment
- `content_reference.entity_id` is polymorphic — tenant isolation enforced by RLS and application-layer validation
- `content_section.asset_id` references V05 assets — validated at application layer to ensure same-tenant ownership

### 18.3 Review Authorization

- The system checks `content_item.owner_id != content_review.reviewer_id` on review creation
- Admin users may approve content they did not author but cannot self-approve
- Review assignment is explicit — only assigned reviewers may issue decisions

### 18.4 Idempotent Downstream Handoffs

The `idempotency_key` is composed as: `{content_id}_{revision_number}_{intended_channel}_{destination_system}`. If a handoff with the same key exists, the system returns the existing record (HTTP 200) instead of creating a duplicate (preventing double-sends). Retries after failure use a new key with an appended retry suffix.

### 18.5 Content Approval vs. Delivery Authorization

Content approval (V06) means "this content is correct and ready." Delivery authorization (ENG-023) means "this content may be sent to these recipients through this channel." These are separate decisions made by separate systems. V06 never evaluates recipient eligibility, consent status, or channel availability.

### 18.6 Structured Section Ordering

Sections use integer `position` values, unique per revision. Reordering is a bulk update of position values. The unique constraint `(revision_id, position)` prevents ordering conflicts.

### 18.7 Audit Events

All lifecycle transitions, review decisions, and handoff state changes publish events through ENG-005. Events are published after the database transaction commits. Event payloads include the acting user, timestamp, and relevant entity IDs.

### 18.8 Concrete RLS Policy Requirements

All V06 tables enforce tenant isolation through Supabase RLS policies. Tables with direct `tenant_id` columns use equality checks. Child tables (sections, comments) use subquery joins to their parent's tenant. Policies are defined in migration 048.

### 18.9 Handoff Failure Behavior

Downstream rejection does not alter content lifecycle state. The handoff record captures the failure reason. The user is notified through ENG-010. A new handoff may be initiated after the underlying issue is resolved — this creates a new handoff record with a retry-suffixed idempotency key.

## 19. Future Volume Attachment Points

| Future Capability | Where It Attaches | Volume |
|-------------------|-------------------|--------|
| AI content generation | Content creation pipeline | V07+ |
| Campaign orchestration | Content handoff + audience | V07+ |
| Live collaborative editing | Content section editing | V07+ |
| Analytics attribution | Content handoff tracking | V07+ |
| External CMS integration | Content import/export | V07+ |

No schema, API, or implementation is provided for these.

---

## Constitutional Boundary Statement

MASS-APP-013-V06 owns content composition, structured content creation, content lifecycle, review and approval, revision history, downstream handoff records, content reference tracking, and content type taxonomy within Design Studio. It does not own and shall not duplicate: communication delivery, recipient governance, consent management, transport execution, or delivery status tracking (ENG-023); binary file storage (ENG-008); user authentication (ENG-003); security policy enforcement (ENG-004); event distribution (ENG-005); notification transport (ENG-010); or API framework conventions (ENG-015). V06 creates and approves content. V06 does not send content. All platform capabilities are consumed through the Engineering Library, never reimplemented.

---

## Packaging Debt

| Item | Status | Notes |
|------|--------|-------|
| Production PDF | Deferred | Current manufacturing environment cannot generate PDF. Markdown is canonical. |
| Mermaid architecture diagram | Deferred | To be generated when tooling supports it. Entity relationships documented in Section 12.2. |
