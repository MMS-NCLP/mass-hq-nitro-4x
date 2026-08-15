# TNGD-BP-007 Persistence Reference

An authorized implementation shall create tenant-owned dispatch work item, recommendation, assignment, history, exception, and handoff tables with UUID defaults, `UNIQUE(id, tenant_id)`, composite tenant-safe references, state constraints, immutable approval/history triggers, self-approval prevention, idempotency constraints, and `auth.jwt()` RLS. No database or routing provider is authorized by this reference.
