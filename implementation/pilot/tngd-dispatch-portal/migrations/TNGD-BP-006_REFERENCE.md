# TNGD-BP-006 Persistence Reference

An authorized implementation shall create tenant-owned technician profile, recurring shift, capability, service-area, exception, capacity override, and capacity-event tables with UUID defaults, `UNIQUE(id, tenant_id)`, composite tenant-safe references, exclusion constraints for incompatible intervals, immutable audit evidence, and `auth.jwt()` RLS. This reference does not authorize a database provider or deployed migration.
