# TNGD-BP-014 — Domain and Data Model

## Entities

### FollowUpPolicy
| Field | Type | Description |
|---|---|---|
| id | string | Unique policy identifier |
| tenantId | string | Owning tenant |
| name | string | Policy name |
| cadences | string[] | Enabled cadences |
| activityTypes | string[] | Enabled activity types |
| currentVersion | integer | Current version number |
| createdAt | ISO 8601 | Creation timestamp |
| createdBy | string | Creating principal |

### FollowUpPolicyVersion
| Field | Type | Description |
|---|---|---|
| id | string | Unique version identifier |
| policyId | string | Parent policy |
| tenantId | string | Owning tenant |
| version | integer | Version number |
| cadences | string[] | Cadences at this version |
| activityTypes | string[] | Activity types at this version |
| createdAt | ISO 8601 | Version timestamp |
| createdBy | string | Creating principal |

### FollowUpEligibility
| Field | Type | Description |
|---|---|---|
| id | string | Unique eligibility identifier |
| tenantId | string | Owning tenant |
| customerId | string | BP-004 customer reference |
| serviceCaseId | string | BP-004 service case reference |
| policyId | string | Evaluated policy |
| policyVersion | integer | Policy version at evaluation |
| cadence | enum | immediate, short-term, two-month, six-month, annual |
| activityType | enum | satisfaction, review-request, estimate, maintenance, relationship |
| consentGranted | boolean | Current consent state |
| eligible | boolean | Eligibility determination |
| reason | string | Eligibility reason |
| evaluatedAt | ISO 8601 | Evaluation timestamp |
| evaluatedBy | string | Evaluating principal |

### FollowUpActivity
| Field | Type | Description |
|---|---|---|
| id | string | Unique activity identifier |
| tenantId | string | Owning tenant |
| eligibilityId | string | Optional linked eligibility |
| cadence | enum | Activity cadence |
| activityType | enum | Activity purpose |
| customerId | string | BP-004 customer reference |
| serviceCaseId | string | BP-004 service case reference |
| sourceReferences | string[] | Source system references |
| status | enum | due, eligible, suppressed, handed-off, completed, failed, cancelled, superseded |
| dueAt | ISO 8601 | Calculated due date |
| reason | string | Status reason |
| supersedes | string | Optional superseded activity ID |
| idempotencyKey | string | Duplicate prevention |
| createdAt | ISO 8601 | Creation timestamp |
| createdBy | string | Creating principal |

### FollowUpSuppression
| Field | Type | Description |
|---|---|---|
| id | string | Unique suppression identifier |
| tenantId | string | Owning tenant |
| activityId | string | Suppressed activity |
| reason | string | Suppression reason (required) |
| source | enum | opt-out, consent-recheck, manual |
| suppressedAt | ISO 8601 | Suppression timestamp |
| suppressedBy | string | Suppressing principal |

### FollowUpTaskHandoff
| Field | Type | Description |
|---|---|---|
| id | string | Unique handoff identifier |
| tenantId | string | Owning tenant |
| activityId | string | Source activity |
| taskDescription | string | Task description |
| consentVerified | boolean | Always true at creation |
| handoffType | string | "task" |
| targetBoundary | string | APP-012 |
| idempotencyKey | string | Duplicate prevention |
| createdAt | ISO 8601 | Handoff timestamp |
| createdBy | string | Creating principal |

### CommunicationHandoff
| Field | Type | Description |
|---|---|---|
| id | string | Unique handoff identifier |
| tenantId | string | Owning tenant |
| activityId | string | Source activity |
| channel | string | Communication channel |
| templateReference | string | Optional template |
| consentVerified | boolean | Always true at creation |
| handoffType | string | "communication" |
| targetBoundary | string | APP-006 |
| idempotencyKey | string | Duplicate prevention |
| createdAt | ISO 8601 | Handoff timestamp |
| createdBy | string | Creating principal |

### FollowUpHistory
Composite append-only view of all events for a subject: policy changes, eligibility evaluations, activity scheduling, transitions, suppressions, handoffs, outcomes.

## Relationships

- FollowUpPolicy ← FollowUpPolicyVersion (one-to-many)
- FollowUpEligibility → FollowUpPolicy (many-to-one)
- FollowUpActivity ← FollowUpSuppression (one-to-many)
- FollowUpActivity ← FollowUpTaskHandoff (one-to-many)
- FollowUpActivity ← CommunicationHandoff (one-to-many)

## Persistence

V1 in-memory Maps with deep freeze. Migration reference at `migrations/TNGD-BP-014_REFERENCE.md`.
