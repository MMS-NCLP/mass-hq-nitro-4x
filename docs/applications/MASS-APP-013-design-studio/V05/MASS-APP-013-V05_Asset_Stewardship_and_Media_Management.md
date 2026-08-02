# MASS-APP-013-V05 — Asset Stewardship & Media Management

## Document Information

| Field | Value |
|-------|-------|
| Application | MASS-APP-013 — Design Studio |
| Volume | V05 |
| Title | Asset Stewardship & Media Management |
| Version | 1.0 |
| Status | Complete |
| Work Order | WO-013-V05 |
| Manufacturing Date | 2026-08-02 |
| Authority | MASS Constitution → Engineering Library → Application Directives → Repository Canon → MASS V1 Manufacturing Guide |

## Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0 | 2026-08-02 | Initial manufacturing under Production Reset doctrine |

---

## 1. Purpose

Asset Stewardship & Media Management establishes how Design Studio stores, organizes, governs, and references digital assets used throughout the MASS platform.

This volume defines asset lifecycle management, media organization, metadata governance, storage architecture, and asset relationships. After implementation, users shall be able to organize reusable digital assets, categorize media, manage asset metadata, maintain asset versions, reference assets throughout projects, archive and restore assets, and preserve asset history.

This volume does not define AI media generation, image editing, video editing, brand intelligence, marketplace distribution, CDN optimization, or external digital asset management platform integration.

## 2. Scope

### Included

- Asset architecture
- Media library organization
- Asset lifecycle
- Metadata management
- Asset categorization
- Storage organization
- Version metadata
- Reference relationships
- Search and filtering
- Engineering constraints

### Excluded

- AI media generation (future volume)
- Image editing (future volume)
- Video editing (future volume)
- Brand intelligence (future volume)
- Marketplace distribution (future volume)
- CDN optimization (future volume)
- External DAM platforms (future volume)

## 3. Platform Consumption Map

| Platform Service | How V05 Consumes It |
|------------------|---------------------|
| ENG-002 Enterprise Core | Tenant context, entity ID generation, lifecycle state patterns |
| ENG-003 Identity Engine | User authentication, tenant resolution |
| ENG-004 Security Framework | Row Level Security policies |
| ENG-005 Event Bus Engine | Asset lifecycle event publication |
| ENG-008 Document Engine | Binary file storage, retrieval, and deletion |
| ENG-012 Persistence Framework | PostgreSQL connection, migration patterns |
| ENG-015 API Framework | REST endpoint structure, request validation |

### Responsibilities Owned by V05

- Asset metadata CRUD and lifecycle operations
- Asset categorization and taxonomy
- Asset version tracking
- Asset search and discovery
- Asset reference tracking across projects, templates, components, and publications
- Media library organization
- Checksum computation and integrity verification

### Responsibilities Delegated

- Binary file storage and retrieval → ENG-008 (Document Engine)
- Authentication and tenant isolation → ENG-003, ENG-004
- Event distribution → ENG-005
- API conventions → ENG-015
- Project and workspace context → V02
- Component asset references → V03
- Publication asset embedding → V04

### Enterprise Events Published

| Event | Trigger |
|-------|---------|
| `asset.created` | New asset uploaded and registered |
| `asset.updated` | Asset metadata modified |
| `asset.archived` | Asset moved to archived state |
| `asset.restored` | Asset returned from archived state |
| `asset.deprecated` | Asset marked as deprecated |
| `asset.deleted` | Asset soft-deleted |
| `asset.version.created` | New asset version uploaded |
| `asset.reference.created` | Asset linked to a project, component, template, or publication |
| `asset.reference.removed` | Asset link removed |

### Enterprise Events Consumed

| Event | Response |
|-------|----------|
| `project.deleted` | Remove project-scoped asset references (assets themselves remain) |
| `component.archived` | Flag component asset references as inactive |
| `publication.archived` | Preserve publication asset references as historical |

## 4. Constitutional Boundary Statement

This volume owns asset metadata governance, media library organization, asset lifecycle, asset categorization, asset reference tracking, and asset version history within Design Studio. It does not own and shall not duplicate: binary file storage (ENG-008), user authentication (ENG-003), security policy enforcement (ENG-004), event distribution (ENG-005), or API framework conventions (ENG-015). Design Studio governs creative stewardship; ENG-008 governs document persistence. This boundary is mandated by Application Architecture Directive 4.

## 5. Asset Architecture

### 5.1 Asset Entity

An asset is a governed digital file with structured metadata. Assets are tenant-scoped and available across all projects within a tenant. The asset record contains metadata; the binary file is stored and retrieved through ENG-008 (Document Engine).

```
Asset
├── Metadata (name, description, category, file type, MIME type, size)
├── Storage Reference (pointer to binary in ENG-008)
├── Integrity (checksum for verification)
├── Lifecycle (status, timestamps)
├── Version History (revision records)
├── References (links to projects, components, templates, publications)
└── Tags (freeform categorization)
```

### 5.2 Metadata and Binary Separation

V05 enforces a strict separation between asset metadata and binary storage:

| Concern | Owner | Storage |
|---------|-------|---------|
| Asset name, description, category, tags | V05 | PostgreSQL |
| File type, MIME type, size, checksum | V05 | PostgreSQL |
| Lifecycle state, timestamps, ownership | V05 | PostgreSQL |
| Version history, reference tracking | V05 | PostgreSQL |
| Binary file content | ENG-008 | ENG-008 managed storage |

V05 stores a `storage_ref` — an opaque reference to the binary file managed by ENG-008. V05 never reads, writes, or streams binary content directly. All binary operations are delegated through the Document Engine interface.

### 5.3 Asset Lifecycle

```
┌──────────┐    upload    ┌──────────┐
│          │─────────────▶│          │
│  (none)  │              │  Draft   │
│          │              │          │
└──────────┘              └────┬─────┘
                               │
                            activate
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
                       └────┬─────┘
                            │
                        soft delete
                            │
                       ┌────▼─────┐
                       │          │
                       │ Deleted  │
                       │          │
                       └──────────┘
```

**States:**

| State | Description | Transitions |
|-------|-------------|-------------|
| Draft | Uploaded but not yet approved for use. Not visible in default asset searches. | → Active |
| Active | Available for use across the tenant. Appears in asset browsers and searches. | → Deprecated, → Archived |
| Deprecated | Still accessible but marked for replacement. Displays deprecation notice. | → Active (restore) |
| Archived | Read-only. Not available for new references. Existing references retained. | → Active (restore), → Deleted |
| Deleted | Soft-deleted. Not visible to users. Binary retained per compliance policy. | Terminal state |

**Lifecycle Rules:**
- Only asset owners or tenant administrators may change lifecycle state
- Deprecating an asset does not remove it from existing references
- Archiving an asset does not break existing references — existing usages continue to resolve
- An asset with active references cannot be deleted without confirmation
- Soft-deleted assets retain their binary in ENG-008 for compliance; hard deletion is never performed by the application layer

### 5.4 Asset Scope

Assets are tenant-scoped. All projects within a tenant share the same asset library. This ensures consistent brand and media resources across the organization.

## 6. Asset Categories

### 6.1 Standard Categories

| Category | Description | Typical File Types |
|----------|-------------|-------------------|
| Images | Photographs, screenshots, backgrounds | JPEG, PNG, WebP, TIFF |
| Documents | PDF documents, Word files, spreadsheets | PDF, DOCX, XLSX |
| Icons | UI icons, symbol sets | SVG, PNG |
| Logos | Brand marks, wordmarks, lockups | SVG, PNG, EPS |
| Illustrations | Custom illustrations, diagrams | SVG, PNG, AI |
| Videos | Video content, screen recordings | MP4, WebM, MOV |
| Audio | Sound files, voice recordings | MP3, WAV, OGG |
| Templates | File templates, starter files | Various |
| Attachments | General-purpose attached files | Any |
| Miscellaneous | Uncategorized assets | Any |

### 6.2 Custom Categories

Tenants may create additional categories. Custom categories follow the same structure as standard categories. Categories cannot be deleted if assets are assigned to them.

## 7. Asset Metadata

### 7.1 Core Metadata

Every asset carries the following metadata, managed entirely by V05:

| Field | Source | Description |
|-------|--------|-------------|
| Name | User-provided | Display name for the asset |
| Description | User-provided | Optional description of the asset |
| Category | User-selected | Organizational classification |
| File Type | System-detected | File extension (e.g., png, pdf, svg) |
| MIME Type | System-detected | Standard MIME type (e.g., image/png) |
| Size | System-detected | File size in bytes |
| Checksum | System-computed | SHA-256 hash of the binary content |
| Status | System-managed | Current lifecycle state |
| Owner | System-assigned | User who uploaded the asset |
| Tags | User-provided | Freeform labels for discovery |

### 7.2 Checksum Integrity

On upload, V05 computes a SHA-256 checksum of the binary content before delegating storage to ENG-008. The checksum serves two purposes:
1. **Duplicate detection** — If a file with the same checksum already exists in the tenant, the user is notified and may choose to reference the existing asset or upload as a new version
2. **Integrity verification** — On retrieval, the checksum can be recomputed to verify the stored binary has not been corrupted

## 8. Asset Versioning

### 8.1 Version Model

Assets support version tracking. When a user uploads a replacement file for an existing asset, a new version record is created. Previous versions remain accessible.

| Field | Description |
|-------|-------------|
| Version Number | Sequential integer (1, 2, 3...) |
| Storage Reference | Pointer to this version's binary in ENG-008 |
| File Type | File extension for this version |
| MIME Type | MIME type for this version |
| Size | File size for this version |
| Checksum | SHA-256 hash for this version |
| Change Note | Brief description of what changed |
| Uploaded By | Who uploaded this version |
| Uploaded At | When this version was uploaded |

### 8.2 Version Rules

- The latest version is the default when an asset is referenced
- Previous versions remain accessible for historical publications
- Version history cannot be deleted (compliance requirement)
- Reverting to an earlier version creates a new version (copy-forward, not rollback)

## 9. Asset References

### 9.1 Reference Model

Assets can be referenced by multiple entities across Design Studio. References are tracking relationships — they do not copy or move the asset.

```
AssetReference
├── asset_id          (the referenced asset)
├── entity_type       (project | component | template | publication)
├── entity_id         (ID of the referencing entity)
├── context           (where within the entity: e.g., "hero-image", "icon")
├── created_by        (who created the reference)
└── created_at        (when the reference was created)
```

### 9.2 Reference Rules

- An asset may be referenced by any number of entities
- Removing a reference does not affect the asset or other references
- Deleting an entity removes its references but does not affect the asset
- Asset reference counts are maintained for governance (identifying unused assets)
- References track context to distinguish how an asset is used (e.g., a logo used as a header image vs. a footer watermark)

### 9.3 Orphan Detection

Assets with zero references for a configurable period (default: 90 days) are flagged as potentially orphaned. Orphan detection is informational — it does not trigger automatic archival or deletion.

## 10. Search and Filtering

### 10.1 Search Capabilities

| Capability | Description |
|------------|-------------|
| Text search | Case-insensitive partial match on asset name and description |
| Category filter | Filter by one or more categories |
| File type filter | Filter by file extension or MIME type group |
| Tag filter | Filter by one or more tags |
| Status filter | Filter by lifecycle state (default: active) |
| Date range | Filter by upload date or modification date |
| Owner filter | Filter by uploading user |
| Size range | Filter by file size (min/max) |
| Reference filter | Filter to assets referenced by a specific entity |
| Orphan filter | Filter to assets with zero references |
| Favorites | Filter to user's favorited assets |

### 10.2 Sort Options

| Sort Field | Description |
|------------|-------------|
| name | Alphabetical by asset name |
| created_at | Upload date (default, newest first) |
| updated_at | Last modification date |
| size | File size |
| reference_count | Number of active references |

## 11. Data Model

### 11.1 Entity Definitions

**Asset**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(255) | No | — | Asset display name |
| description | TEXT | Yes | NULL | Asset description |
| category_id | UUID | No | — | Category (FK) |
| file_type | VARCHAR(20) | No | — | File extension |
| mime_type | VARCHAR(100) | No | — | MIME type |
| size_bytes | BIGINT | No | — | File size in bytes |
| storage_ref | TEXT | No | — | Reference to binary in ENG-008 |
| checksum | VARCHAR(64) | No | — | SHA-256 hash |
| status | VARCHAR(20) | No | 'draft' | Lifecycle state |
| owner_id | UUID | No | — | Uploader (FK) |
| created_at | TIMESTAMPTZ | No | now() | Upload timestamp |
| updated_at | TIMESTAMPTZ | No | now() | Last modification |
| archived_at | TIMESTAMPTZ | Yes | NULL | When archived |
| deprecated_at | TIMESTAMPTZ | Yes | NULL | When deprecated |
| deprecation_notice | TEXT | Yes | NULL | Reason for deprecation |
| deleted_at | TIMESTAMPTZ | Yes | NULL | When soft-deleted |
| reference_count | INTEGER | No | 0 | Cached count of active references |

**AssetCategory**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(100) | No | — | Category name |
| description | TEXT | Yes | NULL | Category description |
| is_standard | BOOLEAN | No | false | Platform-standard category |
| accepted_mime_types | TEXT[] | Yes | NULL | Allowed MIME types (null = any) |
| position | INTEGER | No | 0 | Display order |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |

**AssetVersion**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| asset_id | UUID | No | — | Parent asset (FK) |
| version_number | INTEGER | No | — | Sequential version |
| storage_ref | TEXT | No | — | Binary reference in ENG-008 |
| file_type | VARCHAR(20) | No | — | File extension for this version |
| mime_type | VARCHAR(100) | No | — | MIME type for this version |
| size_bytes | BIGINT | No | — | File size for this version |
| checksum | VARCHAR(64) | No | — | SHA-256 hash for this version |
| change_note | TEXT | Yes | NULL | What changed |
| uploaded_by | UUID | No | — | Who uploaded (FK) |
| uploaded_at | TIMESTAMPTZ | No | now() | Version timestamp |

**AssetTag**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| asset_id | UUID | No | — | Asset (FK) |
| tag | VARCHAR(100) | No | — | Tag value |
| created_at | TIMESTAMPTZ | No | now() | When applied |

**AssetReference**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| asset_id | UUID | No | — | Referenced asset (FK) |
| entity_type | VARCHAR(20) | No | — | project, component, template, publication |
| entity_id | UUID | No | — | ID of referencing entity |
| context | VARCHAR(100) | Yes | NULL | Usage context within entity |
| created_by | UUID | No | — | Who created reference (FK) |
| created_at | TIMESTAMPTZ | No | now() | When referenced |

**UserAssetFavorite**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| user_id | UUID | No | — | User (FK) |
| asset_id | UUID | No | — | Favorited asset (FK) |
| favorited_at | TIMESTAMPTZ | No | now() | When favorited |

**StorageLocation**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| tenant_id | UUID | No | — | Tenant scope (FK) |
| name | VARCHAR(100) | No | — | Location name |
| provider | VARCHAR(50) | No | — | Storage provider identifier |
| base_path | TEXT | No | — | Base path or bucket |
| is_default | BOOLEAN | No | false | Default location for new uploads |
| is_active | BOOLEAN | No | true | Whether this location accepts new uploads |
| created_at | TIMESTAMPTZ | No | now() | Creation timestamp |

**AssetChecksum**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| tenant_id | UUID | No | — | Tenant scope (FK) |
| checksum | VARCHAR(64) | No | — | SHA-256 hash |
| asset_id | UUID | No | — | Asset with this checksum (FK) |
| created_at | TIMESTAMPTZ | No | now() | When registered |

### 11.2 Entity Relationships

```
┌──────────────────┐       ┌──────────────────┐
│  AssetCategory   │──1:N─▶│      Asset       │
│                  │       │                   │
│  tenant_id (FK)  │       │  category_id (FK) │
└──────────────────┘       │  tenant_id (FK)   │
                           │  owner_id (FK)    │
                           │  storage_ref      │
                           └──┬──┬──┬──────────┘
                              │  │  │
                    ┌─────────┘  │  └──────────┐
                    │            │              │
                    │ 1:N        │ 1:N          │ 1:N
                    ▼            ▼              ▼
             ┌────────────┐ ┌────────────┐ ┌────────────────┐
             │AssetVersion│ │  AssetTag  │ │ AssetReference │
             │            │ │            │ │                │
             │ asset_id   │ │ asset_id   │ │ asset_id       │
             │ storage_ref│ │ tag        │ │ entity_type    │
             │ checksum   │ └────────────┘ │ entity_id      │
             └────────────┘                │ context        │
                                           └────────────────┘

┌──────────────────┐       ┌──────────────────┐
│ StorageLocation  │       │  AssetChecksum   │
│                  │       │                  │
│  tenant_id (FK)  │       │  tenant_id (FK)  │
│  provider        │       │  checksum        │
│  base_path       │       │  asset_id (FK)   │
└──────────────────┘       └──────────────────┘

┌──────────────────┐
│UserAssetFavorite │
│                  │
│  user_id (FK)    │
│  asset_id (FK)   │
└──────────────────┘
```

**Constraints:**
- `asset.tenant_id` + `asset.name` is unique (no duplicate names within a tenant)
- `asset_category.tenant_id` + `asset_category.name` is unique
- `asset_version.asset_id` + `asset_version.version_number` is unique
- `asset_tag.asset_id` + `asset_tag.tag` is unique
- `asset_reference.asset_id` + `asset_reference.entity_type` + `asset_reference.entity_id` + `asset_reference.context` is unique
- `user_asset_favorite.user_id` + `user_asset_favorite.asset_id` is primary key
- `asset_checksum.tenant_id` + `asset_checksum.checksum` is unique (one asset per checksum per tenant)
- `storage_location.tenant_id` + `storage_location.name` is unique

### 11.3 Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| asset | idx_asset_tenant | tenant_id, status | Tenant-scoped listing |
| asset | idx_asset_category | category_id | Category filtering |
| asset | idx_asset_owner | owner_id | Owner lookup |
| asset | idx_asset_mime | mime_type | MIME type filtering |
| asset | idx_asset_checksum | checksum | Duplicate detection |
| asset_version | idx_av_asset | asset_id | Version history |
| asset_tag | idx_atag_value | tag | Tag search |
| asset_reference | idx_aref_asset | asset_id | Asset's references |
| asset_reference | idx_aref_entity | entity_type, entity_id | Entity's assets |
| asset_checksum | idx_achk_tenant | tenant_id, checksum | Duplicate lookup |

## 12. API Specification

### 12.1 Asset Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /assets | List assets (paginated, filterable) | Viewer |
| GET | /assets/{id} | Get asset with current version | Viewer |
| POST | /assets | Upload and create asset | Editor |
| PATCH | /assets/{id} | Update asset metadata | Editor |
| DELETE | /assets/{id} | Soft-delete asset | Admin |
| POST | /assets/{id}/archive | Archive asset | Admin |
| POST | /assets/{id}/restore | Restore archived or deprecated asset | Admin |
| POST | /assets/{id}/deprecate | Deprecate asset | Admin |
| GET | /assets/{id}/versions | List asset versions | Viewer |
| POST | /assets/{id}/versions | Upload new version | Editor |
| GET | /assets/{id}/versions/{versionId} | Get specific version | Viewer |
| GET | /assets/{id}/references | List asset references | Viewer |
| POST | /assets/{id}/references | Create asset reference | Editor |
| DELETE | /assets/{id}/references/{refId} | Remove asset reference | Editor |
| POST | /assets/{id}/favorite | Favorite asset | Viewer |
| DELETE | /assets/{id}/favorite | Unfavorite asset | Viewer |
| GET | /assets/search | Advanced asset search | Viewer |

### 12.2 Category Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /asset-categories | List all categories | Viewer |
| POST | /asset-categories | Create custom category | Admin |
| PATCH | /asset-categories/{id} | Update category | Admin |
| DELETE | /asset-categories/{id} | Delete category (only if empty) | Admin |

### 12.3 Storage Location Endpoints

| Method | Path | Description | Minimum Role |
|--------|------|-------------|-------------|
| GET | /storage-locations | List storage locations | Admin |
| POST | /storage-locations | Register storage location | Admin |
| PATCH | /storage-locations/{id} | Update storage location | Admin |

### 12.4 Query Parameters — GET /assets

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: draft, active, deprecated, archived, all (default: active) |
| category | UUID | Filter by category ID |
| search | string | Search by name and description |
| tag | string | Filter by tag |
| file_type | string | Filter by file extension |
| mime_group | string | Filter by MIME group (image, video, audio, document) |
| owner | UUID | Filter by owner |
| min_size | integer | Minimum file size in bytes |
| max_size | integer | Maximum file size in bytes |
| created_after | ISO date | Upload date lower bound |
| created_before | ISO date | Upload date upper bound |
| has_references | boolean | Filter by reference status |
| favorited | boolean | Filter to user's favorites |
| sort | string | Sort: name, created_at (default), updated_at, size, reference_count |
| order | string | Direction: asc, desc (default) |
| limit | integer | Page size (default 25, max 100) |
| offset | integer | Pagination offset (default 0) |

### 12.5 Request/Response Shapes

**POST /assets — Upload Asset**

Request (multipart/form-data):
```
name: "Brand Logo Primary"
description: "Primary brand logo for all official documents"
category_id: "cat-uuid-logos"
tags: ["brand", "official", "primary"]
file: (binary upload)
```

Response (201):
```json
{
  "id": "asset-uuid-...",
  "tenant_id": "t-uuid-...",
  "name": "Brand Logo Primary",
  "description": "Primary brand logo for all official documents",
  "category": {
    "id": "cat-uuid-logos",
    "name": "Logos"
  },
  "file_type": "svg",
  "mime_type": "image/svg+xml",
  "size_bytes": 24576,
  "checksum": "a3f2b8c9d4e5f6...",
  "status": "draft",
  "owner_id": "u-uuid-...",
  "created_at": "2026-08-02T12:00:00Z",
  "updated_at": "2026-08-02T12:00:00Z",
  "tags": ["brand", "official", "primary"],
  "current_version": {
    "id": "av-uuid-...",
    "version_number": 1,
    "file_type": "svg",
    "mime_type": "image/svg+xml",
    "size_bytes": 24576,
    "uploaded_at": "2026-08-02T12:00:00Z"
  },
  "reference_count": 0
}
```

**POST /assets/{id}/references — Create Reference**

Request:
```json
{
  "entity_type": "template",
  "entity_id": "tmpl-uuid-...",
  "context": "header-logo"
}
```

Response (201):
```json
{
  "id": "ref-uuid-...",
  "asset_id": "asset-uuid-...",
  "entity_type": "template",
  "entity_id": "tmpl-uuid-...",
  "context": "header-logo",
  "created_by": "u-uuid-...",
  "created_at": "2026-08-02T12:05:00Z"
}
```

### 12.6 Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 400 | INVALID_INPUT | Missing required fields or invalid values |
| 400 | UNSUPPORTED_FILE_TYPE | File type not accepted for the selected category |
| 401 | UNAUTHORIZED | No valid session |
| 403 | FORBIDDEN | Insufficient role |
| 404 | NOT_FOUND | Entity not found or not accessible |
| 409 | CONFLICT | Duplicate name within tenant |
| 409 | DUPLICATE_CHECKSUM | File with identical checksum already exists |
| 413 | FILE_TOO_LARGE | Upload exceeds maximum file size |
| 422 | CATEGORY_NOT_EMPTY | Attempt to delete category with assigned assets |
| 422 | HAS_REFERENCES | Attempt to delete asset with active references |

## 13. Permission Model

Asset Library uses tenant-level roles:

| Role | Browse/Search | Upload | Edit Metadata | Manage References | Deprecate/Archive/Delete | Manage Categories | Manage Storage |
|------|--------------|--------|--------------|-------------------|--------------------------|-------------------|---------------|
| Viewer | Yes | No | No | No | No | No | No |
| Editor | Yes | Yes | Own + assigned | Yes | No | No | No |
| Admin | Yes | Yes | All | Yes | Yes | Yes | Yes |

Row Level Security enforces tenant isolation on all asset tables.

## 14. Storage Architecture

### 14.1 Storage Locations

Storage locations represent configured destinations for binary files. V05 manages storage location metadata; actual storage operations are delegated to ENG-008.

| Field | Description |
|-------|-------------|
| Name | Human-readable identifier |
| Provider | Storage provider (e.g., supabase-storage) |
| Base Path | Root path or bucket for files |
| Is Default | Whether new uploads go here by default |
| Is Active | Whether this location accepts new uploads |

### 14.2 Storage Path Convention

Files are stored using a deterministic path structure:

```
{base_path}/{tenant_id}/assets/{asset_id}/{version_number}/{filename}
```

This ensures:
- Tenant isolation at the storage level
- Clean asset-to-file mapping
- Version coexistence without naming conflicts

### 14.3 Upload Flow

1. User submits file with metadata
2. V05 computes SHA-256 checksum
3. V05 checks for duplicate checksum within tenant
4. If no duplicate: V05 delegates binary storage to ENG-008, receives storage_ref
5. V05 creates Asset record with metadata and storage_ref
6. V05 creates initial AssetVersion record
7. V05 registers checksum in AssetChecksum table
8. V05 publishes `asset.created` event

## 15. Folder Structure — Design Studio V05 Organization

```
apps/design-studio/
├── src/
│   ├── app/
│   │   ├── (projects)/                        # V02 routes
│   │   ├── (design-system)/                   # V03 routes
│   │   ├── (templates)/                       # V04 routes
│   │   ├── (publications)/                    # V04 routes
│   │   ├── (assets)/
│   │   │   ├── page.tsx                       # Asset library browser
│   │   │   └── [assetId]/
│   │   │       ├── page.tsx                   # Asset detail
│   │   │       ├── versions/
│   │   │       │   └── page.tsx               # Version history
│   │   │       └── references/
│   │   │           └── page.tsx               # Reference tracking
│   │   └── layout.tsx
│   ├── features/
│   │   ├── projects/                          # V02
│   │   ├── components/                        # V03
│   │   ├── design-tokens/                     # V03
│   │   ├── templates/                         # V04
│   │   ├── publications/                      # V04
│   │   └── assets/
│   │       ├── api/
│   │       │   ├── assets.ts
│   │       │   ├── categories.ts
│   │       │   ├── versions.ts
│   │       │   ├── references.ts
│   │       │   └── storage-locations.ts
│   │       ├── components/
│   │       │   ├── AssetBrowser.tsx
│   │       │   ├── AssetCard.tsx
│   │       │   ├── AssetDetail.tsx
│   │       │   ├── AssetUploadDialog.tsx
│   │       │   ├── AssetMetadataForm.tsx
│   │       │   ├── VersionHistory.tsx
│   │       │   ├── ReferenceList.tsx
│   │       │   └── DuplicateWarning.tsx
│   │       ├── hooks/
│   │       │   ├── useAssets.ts
│   │       │   ├── useAsset.ts
│   │       │   ├── useAssetVersions.ts
│   │       │   ├── useAssetReferences.ts
│   │       │   └── useCategories.ts
│   │       └── types/
│   │           └── asset.ts
│   └── lib/
│       └── supabase/
│           └── client.ts
├── supabase/
│   └── migrations/
│       ├── ...                                # V02 (001-007), V03 (008-016), V04 (017-026)
│       ├── 027_create_asset_categories.sql
│       ├── 028_create_assets.sql
│       ├── 029_create_asset_versions.sql
│       ├── 030_create_asset_tags.sql
│       ├── 031_create_asset_references.sql
│       ├── 032_create_asset_checksums.sql
│       ├── 033_create_storage_locations.sql
│       ├── 034_create_asset_favorites.sql
│       ├── 035_seed_asset_categories.sql
│       └── 036_create_v05_rls_policies.sql
└── package.json
```

## 16. Migration SQL Reference

```sql
-- 027_create_asset_categories.sql
CREATE TABLE asset_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_standard BOOLEAN NOT NULL DEFAULT false,
  accepted_mime_types TEXT[],
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

-- 028_create_assets.sql
CREATE TABLE asset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID NOT NULL REFERENCES asset_category(id),
  file_type VARCHAR(20) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_ref TEXT NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'deprecated', 'archived', 'deleted')),
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ,
  deprecated_at TIMESTAMPTZ,
  deprecation_notice TEXT,
  deleted_at TIMESTAMPTZ,
  reference_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE (tenant_id, name)
);

CREATE INDEX idx_asset_tenant ON asset(tenant_id, status);
CREATE INDEX idx_asset_category ON asset(category_id);
CREATE INDEX idx_asset_owner ON asset(owner_id);
CREATE INDEX idx_asset_mime ON asset(mime_type);
CREATE INDEX idx_asset_checksum ON asset(checksum);

-- 029_create_asset_versions.sql
CREATE TABLE asset_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  storage_ref TEXT NOT NULL,
  file_type VARCHAR(20) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  change_note TEXT,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (asset_id, version_number)
);

CREATE INDEX idx_av_asset ON asset_version(asset_id);

-- 030_create_asset_tags.sql
CREATE TABLE asset_tag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (asset_id, tag)
);

CREATE INDEX idx_atag_value ON asset_tag(tag);

-- 031_create_asset_references.sql
CREATE TABLE asset_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  entity_type VARCHAR(20) NOT NULL
    CHECK (entity_type IN ('project', 'component', 'template', 'publication')),
  entity_id UUID NOT NULL,
  context VARCHAR(100),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (asset_id, entity_type, entity_id, context)
);

CREATE INDEX idx_aref_asset ON asset_reference(asset_id);
CREATE INDEX idx_aref_entity ON asset_reference(entity_type, entity_id);

-- 032_create_asset_checksums.sql
CREATE TABLE asset_checksum (
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  checksum VARCHAR(64) NOT NULL,
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, checksum)
);

CREATE INDEX idx_achk_tenant ON asset_checksum(tenant_id, checksum);

-- 033_create_storage_locations.sql
CREATE TABLE storage_location (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  base_path TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

-- 034_create_asset_favorites.sql
CREATE TABLE user_asset_favorite (
  user_id UUID NOT NULL REFERENCES users(id),
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  favorited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, asset_id)
);

-- 035_seed_asset_categories.sql
-- Standard categories seeded per tenant on tenant creation:
-- Images, Documents, Icons, Logos, Illustrations,
-- Videos, Audio, Templates, Attachments, Miscellaneous
-- Seeding logic runs as part of tenant provisioning.

-- 036_create_v05_rls_policies.sql
-- All V05 tables enforce tenant isolation:
-- asset, asset_category, asset_version, asset_tag,
-- asset_reference, asset_checksum, storage_location,
-- user_asset_favorite
```

## 17. Engineering Constraints

| Constraint | Specification |
|------------|--------------|
| Language | TypeScript (strict mode) |
| Architecture | Modular monolith |
| Database | Supabase PostgreSQL |
| Row Level Security | Mandatory on all tables |
| Feature boundary | `features/assets/` |
| Migrations | Sequential, continue from V04 sequence (027+) |
| Binary separation | Metadata in PostgreSQL, binaries in ENG-008 |
| Checksum algorithm | SHA-256 |
| Upload validation | File type and size validated before storage |
| Reference integrity | Cached reference_count on asset for performance |
| API validation | Zod schemas for all request bodies |

## 18. Future Volume Attachment Points

| Future Capability | Where It Attaches | Volume |
|-------------------|-------------------|--------|
| AI media generation | Asset creation pipeline | V06+ |
| Image/video editing | Asset version creation | V06+ |
| Brand intelligence | Asset categorization and governance | V06+ |
| CDN optimization | Storage location and delivery | V06+ |
| External DAM | Storage location abstraction | V06+ |

No schema, API, or implementation is provided for these.

---

## Constitutional Boundary Statement

MASS-APP-013-V05 owns asset metadata governance, media library organization, asset lifecycle, asset categorization, asset reference tracking, asset version history, checksum integrity, and storage location management within Design Studio. It does not own and shall not duplicate: binary file storage and retrieval (ENG-008), user authentication (ENG-003), security policy enforcement (ENG-004), event distribution (ENG-005), or API framework conventions (ENG-015). Design Studio governs creative stewardship; ENG-008 governs document persistence. All platform capabilities are consumed through the Engineering Library, never reimplemented.
