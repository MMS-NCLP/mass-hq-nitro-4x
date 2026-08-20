# Commerce Operations Domain and Data Model

Commerce Operations extends the accepted BP-009 through BP-012 pipeline. Tenant-keyed `CommerceCategory`, `ModifierSet`, `CatalogItem`, and `DiscountDefinition` records are governed reusable configuration. Estimate versions contain immutable `CommercialLineSnapshot` and `DepositRequirement` evidence rather than live catalog pointers.

Catalog snapshots retain source kind, catalog identifier and revision, name, description, category, quantity, unit, unit price, total amount, tax classification/reference/rate, modifier selections, actor, timestamp, and external migration references where applicable. Editing or deactivating catalog configuration never rewrites a finalized estimate, authorization snapshot, invoice version, or payment record.

Amounts use non-negative safe integer cents. Percentage values use integer basis points. Dispatch remains the commercial system of record; Square remains the BP-011 tender provider.
