# BP-009 Domain and Data Model

Tenant-owned `RepairRecord` and `EstimateRecord` preserve the existing customer and Service Case identifiers. Each owns immutable finalized `EstimateVersion` records containing options, line items, recommendations, and explicit outcomes. `EstimateConversion` references both the finalized estimate version and one repair record without copying the customer, Service Case, or BP-008 evidence.

BP-008 source lineage is reference-only: field session, diagnostic report, finding item, measurement, and media-reference identifiers. Persistence remains the provider-neutral in-memory boundary with tenant-safe relational requirements documented in the migration reference.
