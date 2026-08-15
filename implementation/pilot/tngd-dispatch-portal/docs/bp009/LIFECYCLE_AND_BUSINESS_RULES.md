# BP-009 Lifecycle and Business Rules

The approved templates are exactly **Garage Door Repair | Service** and **New Garage Door Estimate**. Repair requires submitted BP-008 inspection evidence; Estimate permits an explicit no-inspection source. Draft versions accept recommendations, options, and line items. Finalization freezes a version; correction creates a new numbered draft while preserving the prior version.

Recommended, pending-authorization, performed, declined, deferred, and follow-up concepts remain distinct. Performed work requires an external authorization-evidence reference; BP-009 never creates that evidence. Estimate conversion is idempotent, preserves the finalized estimate, and reuses customer and Service Case identifiers.
