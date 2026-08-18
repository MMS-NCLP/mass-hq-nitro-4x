# TNGD-BP-015 — Migration Reference

## Tables

### metric_definitions
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| name | text | NOT NULL |
| business_meaning | text | NOT NULL |
| authoritative_source | text | NOT NULL |
| inclusion_rules | text | NOT NULL DEFAULT 'all-records' |
| exclusion_rules | text | NOT NULL DEFAULT 'none' |
| calculation_method | text | NOT NULL CHECK (calculation_method IN ('count','rate','sum','status-distribution')) |
| time_basis | text | NOT NULL |
| freshness | text | NOT NULL |
| permitted_dimensions | text[] | DEFAULT '{}' |
| unavailable_data_behavior | text | NOT NULL |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

### report_definitions
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| name | text | NOT NULL |
| description | text | DEFAULT '' |
| metric_ids | uuid[] | NOT NULL |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| created_by | uuid | NOT NULL REFERENCES users(id) |

### operational_reports
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| definition_id | uuid | NOT NULL REFERENCES report_definitions(id) |
| definition_name | text | NOT NULL |
| generated_at | timestamptz | NOT NULL DEFAULT now() |
| generated_by | uuid | NOT NULL REFERENCES users(id) |
| filters | jsonb | DEFAULT '[]' |
| results | jsonb | NOT NULL |
| source_references | jsonb | NOT NULL |
| exceptions | jsonb | DEFAULT '[]' |
| status | text | NOT NULL DEFAULT 'generated' |
| finalized | boolean | NOT NULL DEFAULT false |
| idempotency_key | text | UNIQUE |

### report_snapshots
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| report_id | uuid | NOT NULL REFERENCES operational_reports(id) |
| report | jsonb | NOT NULL |
| finalized_at | timestamptz | NOT NULL DEFAULT now() |
| finalized_by | uuid | NOT NULL REFERENCES users(id) |
| immutable | boolean | NOT NULL DEFAULT true |

### report_exceptions
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| report_id | uuid | NOT NULL REFERENCES operational_reports(id) |
| metric_name | text | |
| type | text | NOT NULL |
| detail | text | NOT NULL CHECK (detail <> '') |
| recorded_at | timestamptz | NOT NULL DEFAULT now() |
| recorded_by | uuid | NOT NULL REFERENCES users(id) |

### report_exports
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| tenant_id | uuid | NOT NULL REFERENCES tenants(id) |
| snapshot_id | uuid | NOT NULL REFERENCES report_snapshots(id) |
| format | text | NOT NULL CHECK (format IN ('csv','json')) |
| status | text | NOT NULL DEFAULT 'completed' |
| exported_at | timestamptz | NOT NULL DEFAULT now() |
| exported_by | uuid | NOT NULL REFERENCES users(id) |
| evidence | jsonb | NOT NULL |
| idempotency_key | text | UNIQUE |

## Row-Level Security

All tables enable RLS with tenant_id filtering policies.

## Indexes

- metric_definitions(tenant_id, name)
- report_definitions(tenant_id)
- operational_reports(tenant_id, idempotency_key)
- operational_reports(tenant_id, status)
- report_snapshots(tenant_id, report_id)
- report_exceptions(report_id)
- report_exports(snapshot_id)

## V1 Note

This migration reference defines the production schema. V1 uses in-memory Maps per pilot standard.
