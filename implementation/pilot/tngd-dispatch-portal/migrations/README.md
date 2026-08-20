# Pilot Migrations

This directory is the canonical location for ordered, immutable TNGD pilot persistence changes.

BP-000 does not select a database, driver, ORM, schema, or migration runner. No migration may be added until an authorized work order defines the persistence technology and the migration's ownership, forward behavior, validation, and rollback behavior.

Once a migration is applied to a shared environment, it must not be edited in place.

## BP-002 Persistence Boundary

BP-002 creates tenant-keyed customer and service-request records through the package's in-memory runtime boundary. The work order does not authorize a database provider or durable schema, so BP-002 adds no migration. Durable persistence remains at this canonical migration seam pending explicit authority.

BP-003 adds the provider-neutral logical reference in `TNGD-BP-003_REFERENCE.md`. It does not select a provider or represent the current process-local autosave boundary as durable.

BP-011 adds the provider-neutral invoice and Square payment-reference contract in `TNGD-BP-011_REFERENCE.md`. It does not select a database provider.

Commerce Operations adds the provider-neutral catalog, modifiers, tax, discount, deposit, and immutable commercial-snapshot contract in `TNGD-COMMERCE-OPS_REFERENCE.md`. It does not select a database provider.

## Executable Supabase V1 Adapter Migration

Deployment Adapter authority selects Supabase Postgres for the V1 QA persistence boundary. The immutable executable migration is maintained under `supabase/migrations/202608200001_dispatch_v1_adapter.sql` so the Supabase CLI can apply and track it. Existing package reference documents remain historical logical contracts; they are not rewritten or represented as already-applied SQL.

The executable migration supplies tenant membership, aggregate persistence, optimistic version enforcement, idempotency records, chained audit evidence, governed media metadata, RLS on every exposed tenant table, and the private tenant-folder Storage policies. Once applied to a shared environment, it must not be edited in place.
