# TNGD-BP-014 — Migration Reference

## Tables

### follow_up_policies
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| name | text | NOT NULL |
| cadences | text[] | NOT NULL |
| activity_types | text[] | NOT NULL |
| current_version | integer | NOT NULL DEFAULT 1 |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

### follow_up_policy_versions
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| policy_id | uuid | NOT NULL REFERENCES follow_up_policies(id) |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| version | integer | NOT NULL |
| cadences | text[] | NOT NULL |
| activity_types | text[] | NOT NULL |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

### follow_up_eligibilities
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| customer_id | uuid | NOT NULL |
| service_case_id | uuid | NOT NULL |
| policy_id | uuid | NOT NULL REFERENCES follow_up_policies(id) |
| policy_version | integer | NOT NULL |
| cadence | text | NOT NULL |
| activity_type | text | NOT NULL |
| consent_granted | boolean | NOT NULL |
| eligible | boolean | NOT NULL |
| reason | text | NOT NULL |
| evaluated_at | timestamptz | NOT NULL DEFAULT now() |
| evaluated_by | uuid | NOT NULL REFERENCES users(id) |

### follow_up_activities
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| eligibility_id | uuid | REFERENCES follow_up_eligibilities(id) |
| cadence | text | NOT NULL |
| activity_type | text | NOT NULL |
| customer_id | uuid | NOT NULL |
| service_case_id | uuid | NOT NULL |
| source_references | text[] | DEFAULT '{}' |
| status | text | NOT NULL DEFAULT 'due' |
| due_at | timestamptz | NOT NULL |
| reason | text | |
| supersedes | uuid | REFERENCES follow_up_activities(id) |
| idempotency_key | text | UNIQUE |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

### follow_up_suppressions
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| activity_id | uuid | NOT NULL REFERENCES follow_up_activities(id) |
| reason | text | NOT NULL CHECK (reason <> '') |
| source | text | NOT NULL |
| suppressed_at | timestamptz | NOT NULL DEFAULT now() |
| suppressed_by | uuid | NOT NULL REFERENCES users(id) |

### follow_up_task_handoffs
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| activity_id | uuid | NOT NULL REFERENCES follow_up_activities(id) |
| task_description | text | NOT NULL |
| consent_verified | boolean | NOT NULL DEFAULT true |
| handoff_type | text | NOT NULL DEFAULT 'task' |
| target_boundary | text | NOT NULL DEFAULT 'APP-012' |
| idempotency_key | text | UNIQUE |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

### communication_handoffs
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| activity_id | uuid | NOT NULL REFERENCES follow_up_activities(id) |
| channel | text | NOT NULL DEFAULT 'governed' |
| template_reference | text | |
| consent_verified | boolean | NOT NULL DEFAULT true |
| handoff_type | text | NOT NULL DEFAULT 'communication' |
| target_boundary | text | NOT NULL DEFAULT 'APP-006' |
| idempotency_key | text | UNIQUE |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

## Row-Level Security

All tables enable RLS with tenant_id filtering policies.

## Indexes

- follow_up_activities(tenant_id, customer_id)
- follow_up_activities(tenant_id, idempotency_key)
- follow_up_activities(tenant_id, status)
- follow_up_suppressions(activity_id)
- follow_up_task_handoffs(activity_id)
- communication_handoffs(activity_id)

## V1 Note

This migration reference defines the production schema. V1 uses in-memory Maps per pilot standard.
