-- MASS-APP-014-V03 implementation-grade PostgreSQL reference.
-- Split into repository migrations 029 through 041 during implementation.

CREATE TABLE decision_case (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','evidence_gathering','analysis','ready_for_review','decided','outcome_pending','closed','archived')),
  decision_owner_id uuid NOT NULL,
  affected_domains text[] NOT NULL DEFAULT '{}',
  deadline_at timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  UNIQUE (id, tenant_id)
);

CREATE TABLE decision_question (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  revision_number integer NOT NULL CHECK (revision_number > 0),
  question text NOT NULL,
  objectives jsonb NOT NULL DEFAULT '[]',
  constraints jsonb NOT NULL DEFAULT '[]',
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (case_id, revision_number),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX decision_question_one_active_idx ON decision_question(case_id) WHERE active;

CREATE TABLE evidence_item (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  source_type text NOT NULL,
  source_id uuid NOT NULL,
  source_revision text,
  locator text NOT NULL,
  relationship text NOT NULL CHECK (relationship IN ('supports','contradicts','qualifies','contextualizes','unknown')),
  confidence_score smallint CHECK (confidence_score BETWEEN 0 AND 100),
  stale boolean NOT NULL DEFAULT false,
  added_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (case_id, source_type, source_id, locator),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE evidence_chain (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  name text NOT NULL,
  revision_number integer NOT NULL DEFAULT 1 CHECK (revision_number > 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','reviewed','superseded')),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  UNIQUE (id, tenant_id),
  UNIQUE (case_id, name, revision_number),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE evidence_chain_link (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  chain_id uuid NOT NULL,
  evidence_id uuid NOT NULL,
  claim text NOT NULL,
  relationship text NOT NULL CHECK (relationship IN ('supports','contradicts','qualifies','contextualizes','unknown')),
  display_order integer NOT NULL CHECK (display_order >= 0),
  assumption boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (chain_id, display_order),
  FOREIGN KEY (chain_id, tenant_id) REFERENCES evidence_chain(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (evidence_id, tenant_id) REFERENCES evidence_item(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE decision_synthesis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','reviewed','superseded')),
  agreements jsonb NOT NULL DEFAULT '[]',
  conflicts jsonb NOT NULL DEFAULT '[]',
  omissions jsonb NOT NULL DEFAULT '[]',
  assumptions jsonb NOT NULL DEFAULT '[]',
  interaction_reference text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE decision_insight (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  synthesis_id uuid,
  statement text NOT NULL,
  insight_type text NOT NULL,
  assumption boolean NOT NULL DEFAULT false,
  confidence_score smallint CHECK (confidence_score BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'candidate' CHECK (status IN ('candidate','reviewed','rejected')),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (synthesis_id, tenant_id) REFERENCES decision_synthesis(id, tenant_id) ON DELETE SET NULL
);

CREATE TABLE decision_recommendation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  expected_benefit text,
  expected_cost text,
  reversibility text,
  time_horizon text,
  status text NOT NULL DEFAULT 'candidate' CHECK (status IN ('candidate','reviewed','selected','rejected')),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE decision_score (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  recommendation_id uuid NOT NULL,
  dimension text NOT NULL CHECK (dimension IN ('evidence_quality','expected_impact','urgency','strategic_alignment','reversibility','execution_feasibility','risk_exposure','uncertainty')),
  value numeric(6,2) NOT NULL CHECK (value BETWEEN 0 AND 100),
  weight numeric(6,4) NOT NULL CHECK (weight BETWEEN 0 AND 1),
  rationale text NOT NULL,
  evidence_ids uuid[] NOT NULL DEFAULT '{}',
  scored_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (recommendation_id, dimension),
  FOREIGN KEY (recommendation_id, tenant_id) REFERENCES decision_recommendation(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE risk_signal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  origin text NOT NULL,
  affected_scope text NOT NULL,
  severity smallint NOT NULL CHECK (severity BETWEEN 1 AND 5),
  likelihood numeric(5,4) CHECK (likelihood BETWEEN 0 AND 1),
  confidence_score smallint CHECK (confidence_score BETWEEN 0 AND 100),
  evidence_ids uuid[] NOT NULL DEFAULT '{}',
  owner_handoff_status text NOT NULL DEFAULT 'pending' CHECK (owner_handoff_status IN ('pending','sent','accepted','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE opportunity_signal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  origin text NOT NULL,
  affected_scope text NOT NULL,
  estimated_value text,
  likelihood numeric(5,4) CHECK (likelihood BETWEEN 0 AND 1),
  confidence_score smallint CHECK (confidence_score BETWEEN 0 AND 100),
  evidence_ids uuid[] NOT NULL DEFAULT '{}',
  owner_handoff_status text NOT NULL DEFAULT 'pending' CHECK (owner_handoff_status IN ('pending','sent','accepted','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE decision_scenario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  recommendation_id uuid,
  name text NOT NULL,
  assumptions jsonb NOT NULL DEFAULT '[]',
  variables jsonb NOT NULL DEFAULT '{}',
  constraints jsonb NOT NULL DEFAULT '[]',
  horizon text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (recommendation_id, tenant_id) REFERENCES decision_recommendation(id, tenant_id) ON DELETE SET NULL
);

CREATE TABLE scenario_outcome (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  scenario_id uuid NOT NULL,
  benefit_range jsonb NOT NULL DEFAULT '{}',
  cost_range jsonb NOT NULL DEFAULT '{}',
  risks jsonb NOT NULL DEFAULT '[]',
  dependencies jsonb NOT NULL DEFAULT '[]',
  uncertainty jsonb NOT NULL DEFAULT '{}',
  analytics_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (scenario_id, tenant_id) REFERENCES decision_scenario(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE forecast_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  analytics_forecast_id uuid NOT NULL,
  source_version text NOT NULL,
  method text NOT NULL,
  baseline_date date NOT NULL,
  horizon text NOT NULL,
  low_value numeric,
  base_value numeric,
  high_value numeric,
  assumptions jsonb NOT NULL DEFAULT '[]',
  drivers jsonb NOT NULL DEFAULT '[]',
  confidence_score smallint CHECK (confidence_score BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (case_id, analytics_forecast_id, source_version),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE pattern_candidate (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  description text NOT NULL,
  sample_size integer NOT NULL CHECK (sample_size > 0),
  range_start date,
  range_end date,
  confidence_score smallint CHECK (confidence_score BETWEEN 0 AND 100),
  source_case_ids uuid[] NOT NULL DEFAULT '{}',
  counterexamples jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'candidate' CHECK (status IN ('candidate','verified','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE reasoning_trace (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  question_revision_id uuid NOT NULL,
  claims jsonb NOT NULL DEFAULT '[]',
  assumptions jsonb NOT NULL DEFAULT '[]',
  alternatives jsonb NOT NULL DEFAULT '[]',
  uncertainties jsonb NOT NULL DEFAULT '[]',
  interaction_references text[] NOT NULL DEFAULT '{}',
  human_edits jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE,
  FOREIGN KEY (question_revision_id, tenant_id) REFERENCES decision_question(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE human_decision (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  selected_recommendation_id uuid,
  decision_type text NOT NULL CHECK (decision_type IN ('select','reject_all','defer','request_evidence')),
  rationale text NOT NULL,
  conditions jsonb NOT NULL DEFAULT '[]',
  dissent jsonb NOT NULL DEFAULT '[]',
  decided_by uuid NOT NULL,
  authorization_reference text NOT NULL,
  decided_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (case_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE RESTRICT,
  FOREIGN KEY (selected_recommendation_id, tenant_id) REFERENCES decision_recommendation(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE decision_amendment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  decision_id uuid NOT NULL,
  amendment_number integer NOT NULL CHECK (amendment_number > 0),
  reason text NOT NULL,
  changed_fields jsonb NOT NULL,
  amended_by uuid NOT NULL,
  authorization_reference text NOT NULL,
  amended_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (decision_id, amendment_number),
  FOREIGN KEY (decision_id, tenant_id) REFERENCES human_decision(id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE extension_invocation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  extension_id text NOT NULL,
  extension_version text NOT NULL,
  contribution_type text NOT NULL CHECK (contribution_type IN ('evidence_candidate','signal_candidate','score_candidate','option_candidate')),
  idempotency_key text NOT NULL,
  input_hash text NOT NULL,
  output jsonb,
  citations jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL CHECK (status IN ('pending','completed','failed','timed_out')),
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, tenant_id),
  UNIQUE (tenant_id, idempotency_key),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE agent_contribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  case_id uuid NOT NULL,
  agent_profile_id uuid NOT NULL,
  agent_version text NOT NULL,
  objective text NOT NULL,
  allowed_evidence_ids uuid[] NOT NULL DEFAULT '{}',
  output jsonb,
  citations jsonb NOT NULL DEFAULT '[]',
  interaction_reference text,
  status text NOT NULL CHECK (status IN ('pending','completed','failed','timed_out')),
  requested_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (id, tenant_id),
  FOREIGN KEY (case_id, tenant_id) REFERENCES decision_case(id, tenant_id) ON DELETE CASCADE
);

CREATE INDEX decision_case_status_idx ON decision_case(tenant_id, status, updated_at DESC);
CREATE INDEX evidence_item_source_idx ON evidence_item(tenant_id, source_type, source_id);
CREATE INDEX recommendation_case_idx ON decision_recommendation(tenant_id, case_id, status);
CREATE INDEX risk_case_idx ON risk_signal(tenant_id, case_id, severity DESC);
CREATE INDEX opportunity_case_idx ON opportunity_signal(tenant_id, case_id);
CREATE INDEX extension_case_idx ON extension_invocation(tenant_id, case_id, status);

CREATE OR REPLACE FUNCTION v03_set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_decision_case_updated BEFORE UPDATE ON decision_case
FOR EACH ROW EXECUTE FUNCTION v03_set_updated_at();

CREATE OR REPLACE FUNCTION v03_prevent_immutable_mutation() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION '% records are immutable', TG_TABLE_NAME; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_human_decision_immutable BEFORE UPDATE OR DELETE ON human_decision
FOR EACH ROW EXECUTE FUNCTION v03_prevent_immutable_mutation();
CREATE TRIGGER trg_decision_amendment_append_only BEFORE UPDATE OR DELETE ON decision_amendment
FOR EACH ROW EXECUTE FUNCTION v03_prevent_immutable_mutation();
CREATE TRIGGER trg_reasoning_trace_immutable BEFORE UPDATE OR DELETE ON reasoning_trace
FOR EACH ROW EXECUTE FUNCTION v03_prevent_immutable_mutation();

CREATE OR REPLACE FUNCTION v03_prevent_reviewed_chain_mutation() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND OLD.status = 'reviewed'
     AND NEW.status = 'superseded'
     AND (to_jsonb(NEW) - 'status') = (to_jsonb(OLD) - 'status') THEN
    RETURN NEW;
  END IF;
  IF OLD.status IN ('reviewed','superseded') THEN RAISE EXCEPTION 'Reviewed evidence chains are immutable'; END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_reviewed_chain_immutable BEFORE UPDATE OR DELETE ON evidence_chain
FOR EACH ROW EXECUTE FUNCTION v03_prevent_reviewed_chain_mutation();

CREATE OR REPLACE FUNCTION v03_require_human_decision() RETURNS trigger AS $$
BEGIN
  IF NEW.decided_by IS NULL OR NEW.authorization_reference IS NULL THEN
    RAISE EXCEPTION 'Human decision authority is required';
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_require_human_decision BEFORE INSERT ON human_decision
FOR EACH ROW EXECUTE FUNCTION v03_require_human_decision();

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'decision_case','decision_question','evidence_item','evidence_chain','evidence_chain_link',
    'decision_synthesis','decision_insight','decision_recommendation','decision_score','risk_signal',
    'opportunity_signal','decision_scenario','scenario_outcome','forecast_reference','pattern_candidate',
    'reasoning_trace','human_decision','decision_amendment','extension_invocation','agent_contribution'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL USING (tenant_id = (auth.jwt() ->> ''tenant_id'')::uuid) WITH CHECK (tenant_id = (auth.jwt() ->> ''tenant_id'')::uuid)',
      t || '_tenant_policy', t
    );
  END LOOP;
END $$;
