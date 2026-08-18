# TNGD-BP-004 Provider-Neutral Persistence Reference

No persistence provider is authorized. A future governed migration must preserve:

- tenant-keyed Customer Records with normalized email and phone identity indexes;
- uniqueness of tenant plus source Intake Record conversion;
- tenant-safe foreign keys from Service Case to Customer and Intake Record;
- immutable intake evidence references and initial timeline entries;
- atomic customer match/create and case conversion;
- conflict rejection when email and phone resolve to different customers;
- RLS or equivalent tenant enforcement;
- immutable audit and outbox evidence;
- `ready-for-scheduling` as the BP-004 terminal handoff state.

## BP-004.1 LCO — HCP Template Schema Expansion

The `customer_records` table must include the following columns beyond the V1 slim schema:

| Column | Type | Default | Notes |
|---|---|---|---|
| first_name | text | NOT NULL | Split from original name |
| last_name | text | NOT NULL | Split from original name |
| display_name | text | NOT NULL | Full display name |
| mobile_number | text | NULL | Normalized digits |
| home_number | text | NULL | |
| work_number | text | NULL | |
| additional_emails | jsonb | '[]' | Array of strings |
| company | text | NULL | |
| role | text | NULL | |
| customer_type | text | 'homeowner' | homeowner or business |
| is_contractor | boolean | false | |
| addresses | jsonb | '[]' | Array of address objects |
| bills_to | text | NULL | Customer ID reference |
| accepts_bills_from | text | NULL | Customer ID reference |
| lead_source | text | NULL | |
| tags | jsonb | '[]' | Array of strings |
| notes | text | NULL | |
| do_not_service | boolean | false | |
| notifications_enabled | boolean | true | |
| customer_created_at | timestamptz | NOW() | Source system creation date |
| last_service_date | timestamptz | NULL | |
| lifetime_value | numeric | 0 | |

Each address object: `{ streetLine1, streetLine2, city, state, postalCode, isBilling, notes }`.

Immutable fields (never updated): `id`, `tenant_id`, `created_from_intake_record_id`, `created_at`.

