# TNGD-BP-012 Database Migration Reference

V1 uses in-memory persistence. This reference documents the future database schema for production migration.

## Tables

### completion_reviews
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `tenant_id` UUID NOT NULL REFERENCES tenants(id)
- `service_case_id` UUID NOT NULL
- `invoice_id` UUID NOT NULL
- `status` TEXT NOT NULL CHECK (status IN ('pending', 'in-review', 'exceptions-open', 'completed'))
- `checklist` JSONB NOT NULL
- `created_by` UUID NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `completed_at` TIMESTAMPTZ
- `revision` INTEGER NOT NULL DEFAULT 1
- RLS: tenant_id = current_setting('app.tenant_id')

### operational_exceptions
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `tenant_id` UUID NOT NULL REFERENCES tenants(id)
- `review_id` UUID NOT NULL REFERENCES completion_reviews(id)
- `category` TEXT NOT NULL CHECK (category IN ('callback', 'parts', 'estimate', 'payment', 'warranty', 'follow-up', 'field', 'dispatch', 'authorization', 'reconciliation'))
- `type` TEXT NOT NULL
- `detail` TEXT NOT NULL
- `priority` TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical'))
- `due_date` TIMESTAMPTZ
- `status` TEXT NOT NULL CHECK (status IN ('open', 'assigned', 'returned', 'escalated', 'resolved', 'reopened'))
- `created_by` UUID NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `revision` INTEGER NOT NULL DEFAULT 1
- RLS: tenant_id = current_setting('app.tenant_id')

### exception_assignments
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `exception_id` UUID NOT NULL REFERENCES operational_exceptions(id)
- `assigned_role` TEXT NOT NULL
- `assigned_to` TEXT NOT NULL
- `assigned_by` UUID NOT NULL
- `assigned_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### exception_evidence_references
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `exception_id` UUID NOT NULL REFERENCES operational_exceptions(id)
- `source_type` TEXT NOT NULL
- `source_id` TEXT NOT NULL
- `tenant_id` UUID NOT NULL

### escalation_records (append-only)
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `exception_id` UUID NOT NULL REFERENCES operational_exceptions(id)
- `escalated_to` TEXT NOT NULL
- `reason` TEXT NOT NULL
- `escalated_by` UUID NOT NULL
- `escalated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### resolution_decisions (append-only)
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `exception_id` UUID NOT NULL REFERENCES operational_exceptions(id)
- `resolution` TEXT NOT NULL
- `evidence_references` JSONB NOT NULL DEFAULT '[]'
- `reason` TEXT NOT NULL
- `resolved_by` UUID NOT NULL
- `resolved_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### reconciliation_differences
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `review_id` UUID NOT NULL REFERENCES completion_reviews(id)
- `tenant_id` UUID NOT NULL
- `field` TEXT NOT NULL
- `mass_value` TEXT NOT NULL
- `external_value` TEXT NOT NULL
- `provider` TEXT NOT NULL DEFAULT 'square'
- `recorded_by` UUID NOT NULL
- `recorded_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### reconciliation_handoffs
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `review_id` UUID NOT NULL REFERENCES completion_reviews(id)
- `tenant_id` UUID NOT NULL
- `target_package` TEXT NOT NULL CHECK (target_package IN ('TNGD-BP-013', 'TNGD-BP-014'))
- `category` TEXT NOT NULL CHECK (category IN ('warranty', 'follow-up', 'callback', 'parts'))
- `reference_id` TEXT NOT NULL
- `service_case_id` UUID NOT NULL
- `created_by` UUID NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### administrative_history (append-only)
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `review_id` UUID NOT NULL REFERENCES completion_reviews(id)
- `type` TEXT NOT NULL
- `actor_id` TEXT NOT NULL
- `occurred_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `metadata` JSONB NOT NULL DEFAULT '{}'

## Self-Approval Prevention

The application layer enforces that `operational_exceptions.created_by != resolution_decisions.resolved_by` for the same exception. A database CHECK constraint or trigger should enforce this at the persistence layer in production.

## RLS Policy

All tenant-owned tables require `tenant_id = current_setting('app.tenant_id')::uuid` for SELECT, INSERT, UPDATE. Append-only tables (escalation_records, resolution_decisions, administrative_history) allow INSERT only, no UPDATE or DELETE.
