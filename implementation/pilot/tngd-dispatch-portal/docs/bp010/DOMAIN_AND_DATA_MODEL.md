# BP-010 Domain and Data Model

`AuthorizationRequest` binds one tenant, customer, Service Case, and immutable BP-009 version. Its immutable `AuthorizationSnapshot` holds the presented scope, line items, price, terms, disclosures, diagnostic reference, and content hash. `CustomerAcknowledgment`, `SignatureEvidence`, and `AuthorizationDecision` preserve the governed adult decision. Amendments create new requests; receipts are customer-safe; history is append-only.
