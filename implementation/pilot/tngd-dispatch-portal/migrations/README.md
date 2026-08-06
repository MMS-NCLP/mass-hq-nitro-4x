# Pilot Migrations

This directory is the canonical location for ordered, immutable TNGD pilot persistence changes.

BP-000 does not select a database, driver, ORM, schema, or migration runner. No migration may be added until an authorized work order defines the persistence technology and the migration's ownership, forward behavior, validation, and rollback behavior.

Once a migration is applied to a shared environment, it must not be edited in place.
