# TNGD-BP-009 Persistence Reference

Provider implementation shall create tenant-keyed repair records, estimate records, immutable estimate versions, options, line items, recommendations, outcome records, conversions, and append-only execution history. Every relationship uses `(id, tenant_id)` uniqueness and composite foreign keys. Finalized versions and history reject update/delete operations. Conversion uniqueness covers tenant plus idempotency key and finalized estimate version. BP-008 evidence is stored only as governed identifiers. No live provider is authorized by BP-009.
