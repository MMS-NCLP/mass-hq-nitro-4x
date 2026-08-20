# TNGD Commerce Operations Persistence Reference

Production persistence shall create tenant-keyed commerce category, modifier set/option, catalog item, item-modifier association, discount definition, and configuration-history tables. Estimate/invoice persistence shall store immutable commercial line snapshots, discount applications, deposit requirements, tax evidence, actor attribution, and external source references.

Every relationship requires composite `(id, tenant_id)` uniqueness and tenant-safe foreign keys. Required database controls include row-level tenant policies; non-negative integer-cent and basis-point checks; category-parent integrity; modifier selection bounds; unique tenant/internal-code and external-reference constraints where configured; append-only configuration history; and immutable finalized estimate, authorization, invoice, and payment evidence.

This is a provider-neutral reference. It does not select a database or create a second payment ledger. Square provider references remain governed by BP-011.
