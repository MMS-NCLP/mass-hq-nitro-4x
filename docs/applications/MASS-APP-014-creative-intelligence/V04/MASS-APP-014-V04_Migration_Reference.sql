-- MASS-APP-014-V04 implementation-grade PostgreSQL reference.
-- Split into repository migrations 042 through 054 during implementation.

CREATE TABLE intelligence_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','validating','ready','running','paused','awaiting_approval','approved','rejected','completed','failed','cancelled','archived')),
  plan_owner_id uuid NOT NULL,
  output_contract jsonb NOT NULL DEFAULT '{}',
  completion_criteria jsonb NOT NULL DEFAULT '[]',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  UNIQUE (id, tenant_id)
);

CREATE TABLE plan_objective (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  revision_number integer NOT NULL CHECK (revision_number > 0),
  objective text NOT NULL,
  constraints jsonb NOT NULL DEFAULT '[]',
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (plan_id, revision_number),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX plan_objective_one_active_idx ON plan_objective(plan_id) WHERE active;

CREATE TABLE agent_binding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  agent_profile_id uuid NOT NULL,
  agent_version text NOT NULL,
  approved_skills text[] NOT NULL DEFAULT '{}',
  allowed_tools text[] NOT NULL DEFAULT '{}',
  context_policy jsonb NOT NULL DEFAULT '{}',
  cost_limit numeric(14,2) CHECK (cost_limit >= 0),
  concurrency_limit integer NOT NULL DEFAULT 1 CHECK (concurrency_limit > 0),
  status text NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed','approved','active','suspended','retired','revoked')),
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (tenant_id, agent_profile_id, agent_version)
);

CREATE TABLE department_binding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  department_code text NOT NULL,
  gateway_contract text NOT NULL,
  contract_version text NOT NULL,
  capabilities text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','retired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (tenant_id, department_code, contract_version)
);

CREATE TABLE skill_definition (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  code text NOT NULL,
  version text NOT NULL,
  input_schema jsonb NOT NULL,
  output_schema jsonb NOT NULL,
  sensitivity text NOT NULL,
  latency_class text,
  cost_class text,
  assurance_level text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','deprecated','retired')),
  UNIQUE (id, tenant_id),
  UNIQUE (tenant_id, code, version)
);

CREATE TABLE skill_route (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  skill_id uuid NOT NULL,
  selected_participant_type text CHECK (selected_participant_type IN ('agent','plugin','department')),
  selected_participant_id uuid,
  candidates jsonb NOT NULL DEFAULT '[]',
  exclusions jsonb NOT NULL DEFAULT '[]',
  rules_applied jsonb NOT NULL DEFAULT '[]',
  selected_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id, tenant_id) REFERENCES skill_definition(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE plugin_binding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  catalog_identifier text NOT NULL,
  package_version text NOT NULL,
  compatibility_range text NOT NULL,
  declared_capabilities text[] NOT NULL DEFAULT '{}',
  approved_scopes text[] NOT NULL DEFAULT '{}',
  configuration_reference text,
  status text NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed','approved','active','suspended','revoked')),
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (tenant_id, catalog_identifier, package_version)
);

CREATE TABLE assignment_node (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  skill_id uuid NOT NULL,
  participant_type text NOT NULL CHECK (participant_type IN ('agent','plugin','department','nova_advisory','pops_advisory')),
  participant_id uuid,
  objective text NOT NULL,
  output_schema jsonb NOT NULL,
  timeout_seconds integer NOT NULL CHECK (timeout_seconds > 0),
  retry_limit integer NOT NULL DEFAULT 0 CHECK (retry_limit BETWEEN 0 AND 10),
  review_required boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','ready','running','completed','failed','cancelled','blocked')),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id, tenant_id) REFERENCES skill_definition(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE assignment_dependency (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  predecessor_id uuid NOT NULL,
  successor_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (predecessor_id, successor_id),
  CHECK (predecessor_id <> successor_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (predecessor_id, tenant_id) REFERENCES assignment_node(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (successor_id, tenant_id) REFERENCES assignment_node(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE context_envelope (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  assignment_id uuid NOT NULL,
  sensitivity text NOT NULL,
  permitted_uses text[] NOT NULL DEFAULT '{}',
  redactions jsonb NOT NULL DEFAULT '[]',
  authorization_snapshot jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  sealed_at timestamptz,
  revoked_at timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (assignment_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id, tenant_id) REFERENCES assignment_node(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE context_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  envelope_id uuid NOT NULL,
  source_type text NOT NULL,
  source_id uuid NOT NULL,
  source_revision text,
  locator text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (envelope_id, source_type, source_id, locator),
  FOREIGN KEY (envelope_id, tenant_id) REFERENCES context_envelope(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE contribution_record (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  assignment_id uuid NOT NULL,
  participant_type text NOT NULL,
  participant_id uuid,
  participant_version text,
  input_hash text NOT NULL,
  output jsonb NOT NULL,
  citations jsonb NOT NULL DEFAULT '[]',
  confidence_score smallint CHECK (confidence_score BETWEEN 0 AND 100),
  execution_reference text NOT NULL,
  status text NOT NULL CHECK (status IN ('completed','failed','timed_out')),
  received_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (assignment_id, execution_reference),
  FOREIGN KEY (assignment_id, tenant_id) REFERENCES assignment_node(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE approval_gate (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  name text NOT NULL,
  action_type text NOT NULL,
  eligible_roles text[] NOT NULL,
  quorum integer NOT NULL DEFAULT 1 CHECK (quorum > 0),
  evidence_package jsonb NOT NULL,
  originating_principal_id uuid,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','expired')),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE approval_decision (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  gate_id uuid NOT NULL,
  decision text NOT NULL CHECK (decision IN ('approve','reject','revision_required')),
  rationale text NOT NULL,
  decided_by uuid NOT NULL,
  authorization_reference text NOT NULL,
  decided_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (gate_id, decided_by),
  FOREIGN KEY (gate_id, tenant_id) REFERENCES approval_gate(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE adaptation_proposal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  trigger_type text NOT NULL,
  current_plan_hash text NOT NULL,
  proposed_change jsonb NOT NULL,
  expected_impact text,
  risk text,
  estimated_cost numeric(14,2) CHECK (estimated_cost >= 0),
  evidence jsonb NOT NULL DEFAULT '[]',
  required_approver_role text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','applied')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE orchestration_run (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  idempotency_key text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','paused','completed','failed','cancelled')),
  started_by uuid NOT NULL,
  started_at timestamptz,
  completed_at timestamptz,
  error text,
  UNIQUE (id, tenant_id),
  UNIQUE (tenant_id, idempotency_key),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE invocation_record (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  run_id uuid NOT NULL,
  assignment_id uuid NOT NULL,
  participant_type text NOT NULL,
  participant_id uuid,
  idempotency_key text NOT NULL,
  input_hash text NOT NULL,
  execution_reference text,
  status text NOT NULL CHECK (status IN ('pending','running','completed','failed','timed_out')),
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (id, tenant_id),
  UNIQUE (tenant_id, idempotency_key),
  FOREIGN KEY (run_id, tenant_id) REFERENCES orchestration_run(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id, tenant_id) REFERENCES assignment_node(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE memory_utilization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  memory_id uuid NOT NULL,
  memory_revision_id uuid NOT NULL,
  purpose text NOT NULL,
  retrieved_by uuid NOT NULL,
  retrieved_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (plan_id, memory_revision_id, purpose),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE integration_handoff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  destination text NOT NULL CHECK (destination IN ('executive_cockpit','dispatch','design_studio')),
  idempotency_key text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','accepted','rejected','failed')),
  requested_by uuid NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  external_reference text,
  UNIQUE (id, tenant_id),
  UNIQUE (tenant_id, destination, idempotency_key),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE plan_outcome (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  outcome jsonb NOT NULL,
  evidence_references jsonb NOT NULL DEFAULT '[]',
  verified_by uuid NOT NULL,
  verification_reference text NOT NULL,
  verified_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (plan_id),
  FOREIGN KEY (plan_id, tenant_id) REFERENCES intelligence_plan(id, tenant_id) ON DELETE RESTRICT
);

CREATE INDEX intelligence_plan_status_idx ON intelligence_plan(tenant_id, status, updated_at DESC);
CREATE INDEX assignment_plan_status_idx ON assignment_node(tenant_id, plan_id, status);
CREATE INDEX contribution_assignment_idx ON contribution_record(tenant_id, assignment_id);
CREATE INDEX gate_plan_status_idx ON approval_gate(tenant_id, plan_id, status);
CREATE INDEX handoff_status_idx ON integration_handoff(tenant_id, destination, status);

CREATE OR REPLACE FUNCTION v04_set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_intelligence_plan_updated BEFORE UPDATE ON intelligence_plan
FOR EACH ROW EXECUTE FUNCTION v04_set_updated_at();

CREATE OR REPLACE FUNCTION v04_prevent_immutable_mutation() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION '% records are immutable', TG_TABLE_NAME; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_contribution_immutable BEFORE UPDATE OR DELETE ON contribution_record
FOR EACH ROW EXECUTE FUNCTION v04_prevent_immutable_mutation();
CREATE TRIGGER trg_approval_decision_immutable BEFORE UPDATE OR DELETE ON approval_decision
FOR EACH ROW EXECUTE FUNCTION v04_prevent_immutable_mutation();
CREATE TRIGGER trg_plan_outcome_immutable BEFORE UPDATE OR DELETE ON plan_outcome
FOR EACH ROW EXECUTE FUNCTION v04_prevent_immutable_mutation();

CREATE OR REPLACE FUNCTION v04_protect_sealed_context() RETURNS trigger AS $$
BEGIN
  IF OLD.sealed_at IS NOT NULL THEN
    IF TG_OP = 'DELETE' THEN
      RAISE EXCEPTION 'Sealed context envelopes cannot be deleted';
    END IF;
    IF (to_jsonb(NEW) - 'revoked_at') <> (to_jsonb(OLD) - 'revoked_at') THEN
      RAISE EXCEPTION 'Sealed context envelopes are immutable except revocation';
    END IF;
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_context_envelope_immutable BEFORE UPDATE OR DELETE ON context_envelope
FOR EACH ROW EXECUTE FUNCTION v04_protect_sealed_context();

CREATE OR REPLACE FUNCTION v04_prevent_self_approval() RETURNS trigger AS $$
DECLARE originator uuid;
BEGIN
  SELECT originating_principal_id INTO originator FROM approval_gate
  WHERE id = NEW.gate_id AND tenant_id = NEW.tenant_id;
  IF originator IS NOT NULL AND originator = NEW.decided_by THEN
    RAISE EXCEPTION 'Self-approval is prohibited';
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_prevent_self_approval BEFORE INSERT ON approval_decision
FOR EACH ROW EXECUTE FUNCTION v04_prevent_self_approval();

CREATE OR REPLACE FUNCTION v04_prevent_assignment_cycle() RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    WITH RECURSIVE successors(id) AS (
      SELECT successor_id FROM assignment_dependency
      WHERE tenant_id = NEW.tenant_id AND predecessor_id = NEW.successor_id AND id <> NEW.id
      UNION
      SELECT d.successor_id FROM assignment_dependency d
      JOIN successors s ON d.predecessor_id = s.id
      WHERE d.tenant_id = NEW.tenant_id
    )
    SELECT 1 FROM successors WHERE id = NEW.predecessor_id
  ) THEN RAISE EXCEPTION 'Assignment dependency cycle is prohibited'; END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_assignment_dependency_no_cycle BEFORE INSERT OR UPDATE ON assignment_dependency
FOR EACH ROW EXECUTE FUNCTION v04_prevent_assignment_cycle();

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'intelligence_plan','plan_objective','agent_binding','department_binding','skill_definition',
    'skill_route','plugin_binding','assignment_node','assignment_dependency','context_envelope',
    'context_reference','contribution_record','approval_gate','approval_decision','adaptation_proposal',
    'orchestration_run','invocation_record','memory_utilization','integration_handoff','plan_outcome'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL USING (tenant_id = (auth.jwt() ->> ''tenant_id'')::uuid) WITH CHECK (tenant_id = (auth.jwt() ->> ''tenant_id'')::uuid)',
      t || '_tenant_policy', t
    );
  END LOOP;
END $$;
