# BP-010 Audit and Event Model

Events include `AuthorizationRequested`, `AuthorizationDecided`, `AuthorizationExpired`, `AuthorizationRevoked`, `AuthorizationSuperseded`, and `FinancialHandoffRead`. Every event is tenant-keyed, attributed, timestamped, and appended to the BP-001 hash chain. Snapshot hashes, decision identifiers, amendment reasons, and revocation reasons preserve evidence without silent mutation.
