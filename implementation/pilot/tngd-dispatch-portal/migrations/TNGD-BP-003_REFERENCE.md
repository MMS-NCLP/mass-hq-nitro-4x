# TNGD-BP-003 Persistence Reference

This is a provider-neutral persistence reference, not an executable migration. BP-003 does not authorize a database, ORM, migration runner, or media-storage provider.

## Logical Collections

### `guided_intake_sessions`

Primary key: `id`. Required tenant access key: `(tenant_id, id)`. Stores path, source, creating user, lifecycle status, current question index, autosaved answers, media references, original evidence, audit identifiers, and timestamps.

### `structured_intake_records`

Primary key: `id`. Required tenant access key: `(tenant_id, id)`. Stores the immutable completion projection, `ready-for-bp004` status, and handoff target. A future durable implementation must prohibit in-place mutation of original evidence.

## Migration Requirements for a Future Authorized Provider

- Enforce tenant-keyed access and identifiers.
- Preserve append-only original answer and media-reference evidence.
- Commit each answer autosave atomically with its progress position.
- Prevent a completed session from returning to draft.
- Preserve audit-event identifiers and timestamps.
- Store media references and metadata only; never copy governed media content into these records.
- Provide forward, rollback, backup, restore, and concurrency validation before shared deployment.

Until that authority exists, the executable implementation remains explicitly process-local and non-durable.
