# TNGD-BP-005 Persistence Reference

An authorized persistence implementation shall create tenant-owned `appointment` and `appointment_revision` records with UUID defaults, `UNIQUE(id, tenant_id)`, composite tenant-safe Service Case references, non-overlapping active interval enforcement, immutable revision/audit evidence, and `auth.jwt()` tenant RLS. Calendar credentials remain outside these tables and are consumed only by the approved gateway. This reference does not authorize a database provider or deployed migration.
