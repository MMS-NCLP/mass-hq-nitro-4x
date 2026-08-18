# TNGD-BP-013 — Domain and Data Model

## Entities

### WarrantyPolicy
| Field | Type | Description |
|---|---|---|
| id | string | Unique policy identifier |
| tenantId | string | Owning tenant |
| name | string | Policy name |
| partsCoverageDays | integer | Parts warranty duration (standard: 730) |
| serviceCoverageDays | integer | Service warranty duration (standard: 90) |
| version | integer | Monotonic version number |
| createdAt | ISO 8601 | Policy creation timestamp |
| createdBy | string | Creating principal |

### WarrantyRegistration
| Field | Type | Description |
|---|---|---|
| id | string | Unique registration identifier |
| tenantId | string | Owning tenant |
| policyId | string | Associated warranty policy |
| policyVersion | integer | Exact policy version at registration |
| serviceCaseId | string | BP-004 service case reference |
| sourceJobId | string | Source job reference |
| completionDate | ISO 8601 | Governed completion date |
| partsExpiration | ISO 8601 | Calculated parts coverage end |
| serviceExpiration | ISO 8601 | Calculated service coverage end |
| coveredItemIds | string[] | References to WarrantyCoverageItem records |
| status | enum | active, voided |
| voidedReason | string | Required when status is voided |
| idempotencyKey | string | Prevents duplicate registrations |
| createdAt | ISO 8601 | Registration timestamp |
| createdBy | string | Creating principal |

### WarrantyCoverageItem
| Field | Type | Description |
|---|---|---|
| id | string | Unique item identifier |
| registrationId | string | Parent registration |
| description | string | Covered item description |
| type | enum | parts, service |
| sourceReference | string | Optional BP-009 source reference |

### WarrantyClaim
| Field | Type | Description |
|---|---|---|
| id | string | Unique claim identifier |
| tenantId | string | Owning tenant |
| registrationId | string | Associated registration |
| serviceCaseId | string | BP-004 service case |
| issueDescription | string | Customer-reported issue |
| affectedItemIds | string[] | Covered items affected |
| status | enum | submitted, under-review, awaiting-evidence, awaiting-appointment, decision-pending, approved, partially-approved, denied, resolution-in-progress, resolved, closed |
| idempotencyKey | string | Prevents duplicate claims |
| createdAt | ISO 8601 | Claim creation timestamp |
| createdBy | string | Creating principal |

### WarrantyClaimEvidenceReference
| Field | Type | Description |
|---|---|---|
| id | string | Unique evidence reference identifier |
| claimId | string | Parent claim |
| sourceType | string | Evidence source (e.g., BP-005-appointment, BP-008-inspection) |
| sourceId | string | Source system identifier |
| description | string | Evidence description |
| attachedAt | ISO 8601 | Attachment timestamp |
| attachedBy | string | Attaching principal |

### WarrantyEligibilityAssessment
| Field | Type | Description |
|---|---|---|
| id | string | Unique assessment identifier |
| claimId | string | Assessed claim |
| registrationStatus | string | Registration status at assessment time |
| partsEligible | boolean | Parts coverage still active |
| serviceEligible | boolean | Service coverage still active |
| advisory | boolean | Always true — final disposition requires human |
| assessedAt | ISO 8601 | Assessment timestamp |
| assessedBy | string | Assessing principal |

### WarrantyFinding
| Field | Type | Description |
|---|---|---|
| id | string | Unique finding identifier |
| claimId | string | Parent claim |
| description | string | Finding description (required, non-empty) |
| evidenceReferences | string[] | Optional supporting evidence |
| recordedAt | ISO 8601 | Finding timestamp |
| recordedBy | string | Recording principal |

### WarrantyCoverageDecision
| Field | Type | Description |
|---|---|---|
| id | string | Unique decision identifier |
| claimId | string | Parent claim |
| outcome | enum | covered, partially-covered, not-covered |
| reason | string | Decision rationale |
| approvedItems | string[] | Item IDs approved for coverage |
| excludedItems | string[] | Item IDs excluded from coverage |
| resolutionClass | enum | no-charge, customer-charge, administrative-review |
| supersededBy | string | Null unless superseded by a correction |
| decidedAt | ISO 8601 | Decision timestamp |
| decidedBy | string | Deciding principal |

### WarrantyResolution
| Field | Type | Description |
|---|---|---|
| id | string | Unique resolution identifier |
| claimId | string | Parent claim |
| resolutionSummary | string | Completed resolution description |
| evidenceReferences | string[] | Resolution evidence |
| resolvedAt | ISO 8601 | Resolution completion timestamp |
| resolvedBy | string | Resolving principal |

### WarrantyHistory
Composite view of all events for a claim: creation, transitions, evidence attachments, assessments, findings, decisions, resolutions, and handoffs.

### WarrantyHandoff
| Field | Type | Description |
|---|---|---|
| id | string | Unique handoff identifier |
| claimId | string | Source claim |
| targetPackage | string | TNGD-BP-014 only |
| category | enum | follow-up, callback |
| referenceId | string | Source reference |
| createdAt | ISO 8601 | Handoff timestamp |
| createdBy | string | Creating principal |

## Relationships

- WarrantyPolicy ← WarrantyRegistration (one-to-many)
- WarrantyRegistration ← WarrantyCoverageItem (one-to-many)
- WarrantyRegistration ← WarrantyClaim (one-to-many)
- WarrantyClaim ← WarrantyClaimEvidenceReference (one-to-many)
- WarrantyClaim ← WarrantyEligibilityAssessment (one-to-many)
- WarrantyClaim ← WarrantyFinding (one-to-many)
- WarrantyClaim ← WarrantyCoverageDecision (one-to-many)
- WarrantyClaim ← WarrantyResolution (one-to-one)
- WarrantyClaim ← WarrantyHandoff (one-to-many)

## Persistence

V1 in-memory Maps with deep freeze. Migration reference at `migrations/TNGD-BP-013_REFERENCE.md`.
