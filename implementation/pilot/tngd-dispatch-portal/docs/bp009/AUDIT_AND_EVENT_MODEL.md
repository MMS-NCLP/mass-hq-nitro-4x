# BP-009 Audit and Event Model

Events include `ExecutionDraftCreated`, `WorkRecommendationAdded`, `LineItemAdded`, `EstimateOptionAdded`, `ExecutionVersionFinalized`, `ExecutionVersionRevised`, `AuthorizationPackagePrepared`, `RecommendationOutcomeRecorded`, and `EstimateConverted`. Each uses the shared tenant-keyed BP-001 hash chain with actor, resource, timestamp, and relevant reference metadata. Finalized evidence is never silently replaced.
