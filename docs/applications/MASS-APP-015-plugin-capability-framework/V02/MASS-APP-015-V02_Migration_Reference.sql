-- MASS-APP-015-V02 Plugin Lifecycle, Installation & Dependency Management
-- Production Baseline v1.0 reference DDL. Requires pgcrypto and APP-015 V01 plugin_version.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE installation_request (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  plugin_version_id uuid NOT NULL, manifest_digest text NOT NULL,
  scope_type text NOT NULL CHECK (scope_type IN ('organization','workspace','project','user')),
  scope_id uuid NOT NULL, requested_permissions jsonb NOT NULL DEFAULT '[]',
  configuration_refs jsonb NOT NULL DEFAULT '[]', requested_by uuid NOT NULL,
  idempotency_key text NOT NULL, status text NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, idempotency_key),
  FOREIGN KEY (plugin_version_id, tenant_id) REFERENCES plugin_version(id, tenant_id)
);

CREATE TABLE prerequisite_finding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  request_id uuid NOT NULL, finding_type text NOT NULL,
  requirement_ref text NOT NULL, status text NOT NULL CHECK (status IN ('satisfied','unsatisfied','unavailable','waived')),
  detail jsonb NOT NULL, decided_by uuid, decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (request_id, tenant_id) REFERENCES installation_request(id, tenant_id)
);

CREATE TABLE dependency_resolution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  request_id uuid NOT NULL, input_digest text NOT NULL, graph_digest text,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running','resolved','blocked')),
  findings jsonb NOT NULL DEFAULT '[]', completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, request_id, input_digest),
  FOREIGN KEY (request_id, tenant_id) REFERENCES installation_request(id, tenant_id)
);

CREATE TABLE resolved_dependency (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  resolution_id uuid NOT NULL, parent_plugin_version_id uuid NOT NULL,
  dependency_plugin_version_id uuid, canonical_name text NOT NULL,
  dependency_kind text NOT NULL CHECK (dependency_kind IN ('required','optional','peer','conflict')),
  declared_range text NOT NULL, selected_version text, selected_digest text,
  disposition text NOT NULL CHECK (disposition IN ('selected','already_satisfied','omitted','blocked')),
  reason_chain jsonb NOT NULL, order_index integer,
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, resolution_id, canonical_name, dependency_kind),
  FOREIGN KEY (resolution_id, tenant_id) REFERENCES dependency_resolution(id, tenant_id),
  FOREIGN KEY (parent_plugin_version_id, tenant_id) REFERENCES plugin_version(id, tenant_id),
  FOREIGN KEY (dependency_plugin_version_id, tenant_id) REFERENCES plugin_version(id, tenant_id)
);

CREATE TABLE installation_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  request_id uuid NOT NULL, resolution_id uuid NOT NULL,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0), plan_digest text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','awaiting_approval','approved','rejected','expired','superseded')),
  steps jsonb NOT NULL, effective_permissions jsonb NOT NULL,
  migration_plan jsonb NOT NULL DEFAULT '[]', rollback_plan jsonb NOT NULL,
  required_approvals jsonb NOT NULL, created_by uuid NOT NULL,
  decided_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, request_id, revision), UNIQUE (tenant_id, plan_digest),
  FOREIGN KEY (request_id, tenant_id) REFERENCES installation_request(id, tenant_id),
  FOREIGN KEY (resolution_id, tenant_id) REFERENCES dependency_resolution(id, tenant_id)
);

CREATE TABLE plan_approval (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL, plan_digest text NOT NULL, approval_type text NOT NULL,
  decision text NOT NULL CHECK (decision IN ('approved','rejected')),
  decided_by uuid NOT NULL, rationale text NOT NULL, decided_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, plan_id, approval_type, decided_by),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES installation_plan(id, tenant_id)
);

CREATE TABLE plugin_installation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL, plugin_version_id uuid NOT NULL, manifest_digest text NOT NULL,
  scope_type text NOT NULL CHECK (scope_type IN ('organization','workspace','project','user')),
  scope_id uuid NOT NULL, state text NOT NULL DEFAULT 'requested'
    CHECK (state IN ('requested','planning','awaiting_approval','approved','installing','installed','activating','active','suspending','suspended','upgrading','rolling_back','repairing','removing','removed','recovery_required','failed')),
  revision bigint NOT NULL DEFAULT 1,
  installed_at timestamptz, activated_at timestamptz, suspended_at timestamptz, removed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, plugin_version_id, scope_type, scope_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES installation_plan(id, tenant_id),
  FOREIGN KEY (plugin_version_id, tenant_id) REFERENCES plugin_version(id, tenant_id)
);

CREATE TABLE installation_version_record (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  installation_id uuid NOT NULL, plan_id uuid NOT NULL,
  plugin_version_id uuid NOT NULL, manifest_digest text NOT NULL,
  version_sequence bigint NOT NULL CHECK (version_sequence > 0),
  lifecycle_action text NOT NULL CHECK (lifecycle_action IN ('installed','activated','upgraded','downgraded','rolled_back','removed')),
  reason text NOT NULL, recorded_by uuid NOT NULL, recorded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, installation_id, version_sequence),
  FOREIGN KEY (installation_id, tenant_id) REFERENCES plugin_installation(id, tenant_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES installation_plan(id, tenant_id),
  FOREIGN KEY (plugin_version_id, tenant_id) REFERENCES plugin_version(id, tenant_id)
);

CREATE TABLE installation_grant (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  installation_id uuid NOT NULL, permission_key text NOT NULL,
  manifest_declared boolean NOT NULL, tenant_approved boolean NOT NULL,
  granted_by uuid NOT NULL, granted_at timestamptz NOT NULL DEFAULT now(), revoked_at timestamptz,
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, installation_id, permission_key),
  FOREIGN KEY (installation_id, tenant_id) REFERENCES plugin_installation(id, tenant_id),
  CHECK (manifest_declared AND tenant_approved)
);

CREATE TABLE lifecycle_operation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  installation_id uuid NOT NULL, plan_id uuid NOT NULL,
  operation_type text NOT NULL CHECK (operation_type IN ('install','activate','suspend','resume','upgrade','downgrade','rollback','repair','remove')),
  expected_revision bigint NOT NULL, idempotency_key text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','succeeded','failed','recovery_required')),
  requested_by uuid NOT NULL, started_at timestamptz, completed_at timestamptz,
  outcome jsonb, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, idempotency_key),
  FOREIGN KEY (installation_id, tenant_id) REFERENCES plugin_installation(id, tenant_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES installation_plan(id, tenant_id)
);

CREATE TABLE lifecycle_step (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  operation_id uuid NOT NULL, step_index integer NOT NULL CHECK (step_index >= 0),
  step_type text NOT NULL, owner_ref text NOT NULL, input_digest text NOT NULL,
  idempotency_key text NOT NULL, status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','running','succeeded','failed','compensated','skipped_by_approved_plan')),
  result jsonb, started_at timestamptz, completed_at timestamptz,
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, operation_id, step_index), UNIQUE (tenant_id, idempotency_key),
  FOREIGN KEY (operation_id, tenant_id) REFERENCES lifecycle_operation(id, tenant_id)
);

CREATE TABLE migration_checkpoint (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  operation_id uuid NOT NULL, installation_id uuid NOT NULL,
  owner_ref text NOT NULL, migration_ref text NOT NULL, migration_checksum text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('forward','reverse','compensation')),
  status text NOT NULL CHECK (status IN ('prepared','applied','failed','compensated')),
  checkpoint_ref text NOT NULL, evidence jsonb NOT NULL, captured_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, operation_id, migration_ref, direction),
  FOREIGN KEY (operation_id, tenant_id) REFERENCES lifecycle_operation(id, tenant_id),
  FOREIGN KEY (installation_id, tenant_id) REFERENCES plugin_installation(id, tenant_id)
);

CREATE TABLE health_finding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  installation_id uuid NOT NULL, operation_id uuid,
  check_key text NOT NULL, stage text NOT NULL, required boolean NOT NULL,
  status text NOT NULL CHECK (status IN ('ready','degraded','not_ready','unavailable')),
  evidence jsonb NOT NULL, observed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (installation_id, tenant_id) REFERENCES plugin_installation(id, tenant_id),
  FOREIGN KEY (operation_id, tenant_id) REFERENCES lifecycle_operation(id, tenant_id)
);

CREATE TABLE rollback_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  operation_id uuid NOT NULL, installation_id uuid NOT NULL,
  source_version_id uuid NOT NULL, target_version_id uuid NOT NULL,
  approved_plan_digest text NOT NULL, checkpoint_id uuid NOT NULL,
  result text NOT NULL CHECK (result IN ('succeeded','failed','partial')),
  detail jsonb NOT NULL, recorded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, operation_id),
  FOREIGN KEY (operation_id, tenant_id) REFERENCES lifecycle_operation(id, tenant_id),
  FOREIGN KEY (installation_id, tenant_id) REFERENCES plugin_installation(id, tenant_id),
  FOREIGN KEY (source_version_id, tenant_id) REFERENCES plugin_version(id, tenant_id),
  FOREIGN KEY (target_version_id, tenant_id) REFERENCES plugin_version(id, tenant_id),
  FOREIGN KEY (checkpoint_id, tenant_id) REFERENCES migration_checkpoint(id, tenant_id)
);

CREATE TABLE removal_record (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  installation_id uuid NOT NULL, operation_id uuid NOT NULL,
  reverse_dependency_snapshot jsonb NOT NULL, orphan_candidates jsonb NOT NULL,
  retained_data_refs jsonb NOT NULL, tombstone jsonb NOT NULL,
  removed_by uuid NOT NULL, removed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, installation_id),
  FOREIGN KEY (installation_id, tenant_id) REFERENCES plugin_installation(id, tenant_id),
  FOREIGN KEY (operation_id, tenant_id) REFERENCES lifecycle_operation(id, tenant_id)
);

CREATE TABLE lifecycle_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  aggregate_id uuid NOT NULL, aggregate_revision bigint NOT NULL,
  event_type text NOT NULL, payload jsonb NOT NULL, correlation_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), published_at timestamptz,
  UNIQUE (id, tenant_id), UNIQUE (tenant_id, aggregate_id, aggregate_revision, event_type)
);

CREATE TABLE lifecycle_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL,
  installation_id uuid, operation_id uuid, actor_id uuid NOT NULL,
  action text NOT NULL, decision text, detail jsonb NOT NULL,
  correlation_id uuid NOT NULL, occurred_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (installation_id, tenant_id) REFERENCES plugin_installation(id, tenant_id),
  FOREIGN KEY (operation_id, tenant_id) REFERENCES lifecycle_operation(id, tenant_id)
);

CREATE INDEX idx_installation_scope ON plugin_installation(tenant_id, scope_type, scope_id, state);
CREATE INDEX idx_operation_queue ON lifecycle_operation(tenant_id, status, created_at);
CREATE INDEX idx_health_current ON health_finding(tenant_id, installation_id, observed_at DESC);
CREATE INDEX idx_outbox_unpublished ON lifecycle_outbox(tenant_id, created_at) WHERE published_at IS NULL;

CREATE OR REPLACE FUNCTION app015_v02_prevent_self_approval() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE requester uuid;
BEGIN
  SELECT ir.requested_by INTO requester
  FROM installation_plan ip JOIN installation_request ir ON ir.id=ip.request_id AND ir.tenant_id=ip.tenant_id
  WHERE ip.id=NEW.plan_id AND ip.tenant_id=NEW.tenant_id;
  IF requester IS NULL OR requester=NEW.decided_by THEN
    RAISE EXCEPTION 'plan approval requires an independent authorized human';
  END IF;
  IF NEW.plan_digest <> (SELECT plan_digest FROM installation_plan WHERE id=NEW.plan_id AND tenant_id=NEW.tenant_id) THEN
    RAISE EXCEPTION 'approval digest does not match plan';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_plan_approval_independent BEFORE INSERT ON plan_approval
FOR EACH ROW EXECUTE FUNCTION app015_v02_prevent_self_approval();

CREATE OR REPLACE FUNCTION app015_v02_protect_evidence() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is immutable lifecycle evidence', TG_TABLE_NAME;
END $$;

CREATE TRIGGER trg_approval_immutable BEFORE UPDATE OR DELETE ON plan_approval FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_evidence();
CREATE TRIGGER trg_migration_immutable BEFORE UPDATE OR DELETE ON migration_checkpoint FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_evidence();
CREATE TRIGGER trg_rollback_immutable BEFORE UPDATE OR DELETE ON rollback_evidence FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_evidence();
CREATE TRIGGER trg_removal_immutable BEFORE UPDATE OR DELETE ON removal_record FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_evidence();
CREATE TRIGGER trg_audit_immutable BEFORE UPDATE OR DELETE ON lifecycle_audit FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_evidence();
CREATE TRIGGER trg_health_immutable BEFORE UPDATE OR DELETE ON health_finding FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_evidence();
CREATE TRIGGER trg_version_record_immutable BEFORE UPDATE OR DELETE ON installation_version_record FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_evidence();

CREATE OR REPLACE FUNCTION app015_v02_protect_state_record() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_TABLE_NAME='dependency_resolution' AND OLD.status IN ('resolved','blocked') THEN RAISE EXCEPTION 'dependency resolution is immutable after completion'; END IF;
  IF TG_TABLE_NAME='resolved_dependency' AND EXISTS (SELECT 1 FROM dependency_resolution d WHERE d.id=OLD.resolution_id AND d.tenant_id=OLD.tenant_id AND d.status IN ('resolved','blocked')) THEN RAISE EXCEPTION 'resolved edge is immutable'; END IF;
  IF TG_TABLE_NAME='installation_plan' AND OLD.status IN ('approved','rejected','expired','superseded') THEN RAISE EXCEPTION 'decided plan is immutable'; END IF;
  IF TG_TABLE_NAME='lifecycle_operation' AND OLD.status IN ('succeeded','failed','recovery_required') THEN RAISE EXCEPTION 'terminal operation is immutable'; END IF;
  IF TG_TABLE_NAME='lifecycle_step' AND OLD.status IN ('succeeded','failed','compensated','skipped_by_approved_plan') THEN RAISE EXCEPTION 'terminal step evidence is immutable'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_resolution_protected BEFORE UPDATE OR DELETE ON dependency_resolution FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_state_record();
CREATE TRIGGER trg_edge_protected BEFORE UPDATE OR DELETE ON resolved_dependency FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_state_record();
CREATE TRIGGER trg_plan_protected BEFORE UPDATE OR DELETE ON installation_plan FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_state_record();
CREATE TRIGGER trg_operation_protected BEFORE UPDATE OR DELETE ON lifecycle_operation FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_state_record();
CREATE TRIGGER trg_step_protected BEFORE UPDATE OR DELETE ON lifecycle_step FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_state_record();

CREATE OR REPLACE FUNCTION app015_v02_protect_outbox() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP='DELETE' OR NEW.event_type<>OLD.event_type OR NEW.payload<>OLD.payload OR NEW.aggregate_id<>OLD.aggregate_id OR NEW.aggregate_revision<>OLD.aggregate_revision THEN
    RAISE EXCEPTION 'outbox event payload is immutable';
  END IF;
  IF OLD.published_at IS NOT NULL AND NEW.published_at IS DISTINCT FROM OLD.published_at THEN RAISE EXCEPTION 'published evidence is immutable'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_outbox_protected BEFORE UPDATE OR DELETE ON lifecycle_outbox FOR EACH ROW EXECUTE FUNCTION app015_v02_protect_outbox();

ALTER TABLE installation_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE prerequisite_finding ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependency_resolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE resolved_dependency ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_approval ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_installation ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_version_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_grant ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifecycle_operation ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifecycle_step ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_checkpoint ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_finding ENABLE ROW LEVEL SECURITY;
ALTER TABLE rollback_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE removal_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifecycle_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifecycle_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY installation_request_tenant ON installation_request USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY prerequisite_finding_tenant ON prerequisite_finding USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY dependency_resolution_tenant ON dependency_resolution USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY resolved_dependency_tenant ON resolved_dependency USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY installation_plan_tenant ON installation_plan USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY plan_approval_tenant ON plan_approval USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY plugin_installation_tenant ON plugin_installation USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY installation_version_record_tenant ON installation_version_record USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY installation_grant_tenant ON installation_grant USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY lifecycle_operation_tenant ON lifecycle_operation USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY lifecycle_step_tenant ON lifecycle_step USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY migration_checkpoint_tenant ON migration_checkpoint USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY health_finding_tenant ON health_finding USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY rollback_evidence_tenant ON rollback_evidence USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY removal_record_tenant ON removal_record USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY lifecycle_outbox_tenant ON lifecycle_outbox USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY lifecycle_audit_tenant ON lifecycle_audit USING (tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>'tenant_id')::uuid);
