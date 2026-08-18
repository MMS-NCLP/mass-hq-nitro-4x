# TNGD-BP-013 — Migration Reference

## Tables

### warranty_policies
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| name | text | NOT NULL |
| parts_coverage_days | integer | NOT NULL DEFAULT 730 |
| service_coverage_days | integer | NOT NULL DEFAULT 90 |
| version | integer | NOT NULL DEFAULT 1 |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

### warranty_registrations
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| policy_id | uuid | NOT NULL REFERENCES warranty_policies(id) |
| policy_version | integer | NOT NULL |
| service_case_id | uuid | NOT NULL |
| source_job_id | text | NOT NULL |
| completion_date | timestamptz | NOT NULL |
| parts_expiration | timestamptz | NOT NULL |
| service_expiration | timestamptz | NOT NULL |
| status | text | NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'voided')) |
| voided_reason | text | |
| idempotency_key | text | NOT NULL UNIQUE |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

### warranty_coverage_items
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| registration_id | uuid | NOT NULL REFERENCES warranty_registrations(id) |
| description | text | NOT NULL |
| type | text | NOT NULL CHECK (type IN ('parts', 'service')) |
| source_reference | text | |

### warranty_claims
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| registration_id | uuid | NOT NULL REFERENCES warranty_registrations(id) |
| service_case_id | uuid | NOT NULL |
| issue_description | text | NOT NULL |
| affected_item_ids | uuid[] | NOT NULL |
| status | text | NOT NULL DEFAULT 'submitted' |
| idempotency_key | text | NOT NULL UNIQUE |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

### warranty_claim_evidence_references
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| claim_id | uuid | NOT NULL REFERENCES warranty_claims(id) |
| source_type | text | NOT NULL |
| source_id | text | NOT NULL |
| description | text | NOT NULL |
| attached_at | timestamptz | NOT NULL DEFAULT now() |
| attached_by | uuid | NOT NULL REFERENCES users(id) |

### warranty_eligibility_assessments
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| claim_id | uuid | NOT NULL REFERENCES warranty_claims(id) |
| registration_status | text | NOT NULL |
| parts_eligible | boolean | NOT NULL |
| service_eligible | boolean | NOT NULL |
| advisory | boolean | NOT NULL DEFAULT true |
| assessed_at | timestamptz | NOT NULL DEFAULT now() |
| assessed_by | uuid | NOT NULL REFERENCES users(id) |

### warranty_findings
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| claim_id | uuid | NOT NULL REFERENCES warranty_claims(id) |
| description | text | NOT NULL CHECK (description <> '') |
| evidence_references | text[] | DEFAULT '{}' |
| recorded_at | timestamptz | NOT NULL DEFAULT now() |
| recorded_by | uuid | NOT NULL REFERENCES users(id) |

### warranty_coverage_decisions
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| claim_id | uuid | NOT NULL REFERENCES warranty_claims(id) |
| outcome | text | NOT NULL CHECK (outcome IN ('covered', 'partially-covered', 'not-covered')) |
| reason | text | NOT NULL |
| approved_items | uuid[] | NOT NULL DEFAULT '{}' |
| excluded_items | uuid[] | NOT NULL DEFAULT '{}' |
| resolution_class | text | NOT NULL CHECK (resolution_class IN ('no-charge', 'customer-charge', 'administrative-review')) |
| superseded_by | uuid | REFERENCES warranty_coverage_decisions(id) |
| decided_at | timestamptz | NOT NULL DEFAULT now() |
| decided_by | uuid | NOT NULL REFERENCES users(id) |

### warranty_resolutions
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| claim_id | uuid | NOT NULL REFERENCES warranty_claims(id) UNIQUE |
| resolution_summary | text | NOT NULL |
| evidence_references | text[] | DEFAULT '{}' |
| resolved_at | timestamptz | NOT NULL DEFAULT now() |
| resolved_by | uuid | NOT NULL REFERENCES users(id) |

### warranty_handoffs
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| claim_id | uuid | NOT NULL REFERENCES warranty_claims(id) |
| target_package | text | NOT NULL CHECK (target_package = 'TNGD-BP-014') |
| category | text | NOT NULL CHECK (category IN ('follow-up', 'callback')) |
| reference_id | text | |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

## Row-Level Security

All tables enable RLS with tenant_id filtering policies matching the authenticated user's tenant.

## Indexes

- warranty_registrations(tenant_id, idempotency_key)
- warranty_registrations(tenant_id, service_case_id)
- warranty_claims(tenant_id, idempotency_key)
- warranty_claims(tenant_id, registration_id)
- warranty_coverage_decisions(claim_id)
- warranty_handoffs(claim_id)

## V1 Note

This migration reference defines the production schema. V1 implementation uses in-memory Maps per the pilot standard. This file serves as the authoritative schema reference for the production Supabase migration.
