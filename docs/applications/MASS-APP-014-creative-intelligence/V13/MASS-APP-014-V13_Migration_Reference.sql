CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE learning_program (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, name text NOT NULL,
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','retired')),
 policy jsonb NOT NULL DEFAULT '{}', version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(id,tenant_id), UNIQUE(tenant_id,name,version)
);
CREATE TABLE outcome_observation (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, program_id uuid NOT NULL,
 source_type text NOT NULL, source_id text NOT NULL, source_version text, outcome_type text NOT NULL,
 responsible_domain text NOT NULL, observed_facts jsonb NOT NULL, verification_status text NOT NULL DEFAULT 'unverified'
 CHECK(verification_status IN('unverified','verified','rejected')), completed_at timestamptz NOT NULL,
 observed_by uuid NOT NULL, observed_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id),
 UNIQUE(tenant_id,source_type,source_id,source_version),
 FOREIGN KEY(program_id,tenant_id) REFERENCES learning_program(id,tenant_id)
);
CREATE TABLE evidence_reference (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, outcome_id uuid NOT NULL,
 source_type text NOT NULL, source_id text NOT NULL, source_version text, locator text NOT NULL,
 checksum text, lineage jsonb NOT NULL DEFAULT '{}', quality_status text NOT NULL DEFAULT 'pending'
 CHECK(quality_status IN('pending','validated','rejected')), validated_by uuid, validated_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id),
 UNIQUE(tenant_id,outcome_id,source_type,source_id,locator),
 FOREIGN KEY(outcome_id,tenant_id) REFERENCES outcome_observation(id,tenant_id)
);
CREATE TABLE learning_record (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, program_id uuid NOT NULL,
 learning_type text NOT NULL CHECK(learning_type IN('success','failure','lesson','opportunity','recurring_issue')),
 title text NOT NULL, status text NOT NULL DEFAULT 'proposed' CHECK(status IN('proposed','active','reopened','retired')),
 created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), retired_at timestamptz,
 UNIQUE(id,tenant_id), FOREIGN KEY(program_id,tenant_id) REFERENCES learning_program(id,tenant_id)
);
CREATE TABLE learning_version (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, learning_id uuid NOT NULL,
 version integer NOT NULL, statement text NOT NULL, scope jsonb NOT NULL DEFAULT '{}', limitations jsonb NOT NULL DEFAULT '[]',
 confidence numeric NOT NULL DEFAULT 0 CHECK(confidence BETWEEN 0 AND 1), confidence_method jsonb NOT NULL DEFAULT '{}',
 status text NOT NULL DEFAULT 'proposed' CHECK(status IN('proposed','approved','rejected','superseded')),
 proposed_by uuid NOT NULL, reviewed_by uuid, reviewed_at timestamptz, review_reason text,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id), UNIQUE(tenant_id,learning_id,version),
 FOREIGN KEY(learning_id,tenant_id) REFERENCES learning_record(id,tenant_id)
);
CREATE TABLE pattern_hypothesis (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, program_id uuid NOT NULL,
 title text NOT NULL, conditions jsonb NOT NULL, observed_relationship text NOT NULL, applicability jsonb NOT NULL DEFAULT '{}',
 population_size integer NOT NULL DEFAULT 0, observation_start timestamptz, observation_end timestamptz,
 confidence numeric NOT NULL DEFAULT 0 CHECK(confidence BETWEEN 0 AND 1),
 status text NOT NULL DEFAULT 'proposed' CHECK(status IN('proposed','approved','rejected','reopened','retired')),
 proposed_by uuid NOT NULL, reviewed_by uuid, reviewed_at timestamptz, UNIQUE(id,tenant_id),
 FOREIGN KEY(program_id,tenant_id) REFERENCES learning_program(id,tenant_id)
);
CREATE TABLE pattern_evidence (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, pattern_id uuid NOT NULL,
 evidence_id uuid NOT NULL, relationship text NOT NULL CHECK(relationship IN('supports','contradicts','qualifies')),
 weight numeric NOT NULL DEFAULT 1 CHECK(weight BETWEEN 0 AND 1), rationale text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id), UNIQUE(tenant_id,pattern_id,evidence_id),
 FOREIGN KEY(pattern_id,tenant_id) REFERENCES pattern_hypothesis(id,tenant_id),
 FOREIGN KEY(evidence_id,tenant_id) REFERENCES evidence_reference(id,tenant_id)
);
CREATE TABLE contradiction_record (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, learning_version_id uuid NOT NULL,
 evidence_id uuid NOT NULL, description text NOT NULL,
 status text NOT NULL DEFAULT 'open' CHECK(status IN('open','resolved','accepted_variance')),
 recorded_by uuid NOT NULL, recorded_at timestamptz NOT NULL DEFAULT now(),
 resolved_by uuid, resolved_at timestamptz, resolution text, UNIQUE(id,tenant_id),
 FOREIGN KEY(learning_version_id,tenant_id) REFERENCES learning_version(id,tenant_id),
 FOREIGN KEY(evidence_id,tenant_id) REFERENCES evidence_reference(id,tenant_id)
);
CREATE TABLE improvement_recommendation (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, learning_version_id uuid NOT NULL,
 title text NOT NULL, purpose text NOT NULL, affected_scope jsonb NOT NULL, expected_benefit jsonb NOT NULL,
 risks jsonb NOT NULL DEFAULT '[]', prerequisites jsonb NOT NULL DEFAULT '[]', alternatives jsonb NOT NULL DEFAULT '[]',
 confidence numeric NOT NULL CHECK(confidence BETWEEN 0 AND 1),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN('draft','ready','approved','rejected','retired')),
 prepared_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id),
 FOREIGN KEY(learning_version_id,tenant_id) REFERENCES learning_version(id,tenant_id)
);
CREATE TABLE recommendation_review (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, recommendation_id uuid NOT NULL,
 decision text NOT NULL CHECK(decision IN('approved','rejected','returned')),
 reviewer_id uuid NOT NULL, rationale text NOT NULL, decided_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(id,tenant_id), UNIQUE(tenant_id,recommendation_id),
 FOREIGN KEY(recommendation_id,tenant_id) REFERENCES improvement_recommendation(id,tenant_id)
);
CREATE TABLE improvement_backlog_item (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, recommendation_id uuid NOT NULL,
 owner_id uuid NOT NULL, owning_system text NOT NULL, priority text NOT NULL,
 status text NOT NULL DEFAULT 'candidate' CHECK(status IN('candidate','accepted','handed_off','declined','closed')),
 handoff_idempotency_key text NOT NULL, external_reference text, handed_off_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id), UNIQUE(tenant_id,handoff_idempotency_key),
 FOREIGN KEY(recommendation_id,tenant_id) REFERENCES improvement_recommendation(id,tenant_id)
);
CREATE TABLE maturity_assessment (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, program_id uuid NOT NULL,
 assessment_version integer NOT NULL, dimensions jsonb NOT NULL, overall_score numeric CHECK(overall_score BETWEEN 0 AND 1),
 calculation_version text NOT NULL, status text NOT NULL DEFAULT 'draft' CHECK(status IN('draft','issued','superseded')),
 assessed_by uuid NOT NULL, assessed_at timestamptz NOT NULL DEFAULT now(), issued_at timestamptz,
 UNIQUE(id,tenant_id), UNIQUE(tenant_id,program_id,assessment_version),
 FOREIGN KEY(program_id,tenant_id) REFERENCES learning_program(id,tenant_id)
);
CREATE TABLE executive_improvement_briefing (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, program_id uuid NOT NULL,
 title text NOT NULL, version integer NOT NULL, content jsonb NOT NULL, citations jsonb NOT NULL DEFAULT '[]',
 status text NOT NULL DEFAULT 'draft' CHECK(status IN('draft','ready','issued','superseded','archived')),
 prepared_by uuid NOT NULL, issued_by uuid, issued_at timestamptz, UNIQUE(id,tenant_id),
 UNIQUE(tenant_id,program_id,title,version), FOREIGN KEY(program_id,tenant_id) REFERENCES learning_program(id,tenant_id)
);
CREATE TABLE learning_advisory_request (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, program_id uuid NOT NULL,
 advisory_type text NOT NULL CHECK(advisory_type IN('nova','pops')), request_text text NOT NULL,
 evidence_ids jsonb NOT NULL DEFAULT '[]', status text NOT NULL DEFAULT 'requested'
 CHECK(status IN('requested','completed','failed','cancelled')), response jsonb, citations jsonb NOT NULL DEFAULT '[]',
 requested_by uuid NOT NULL, requested_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
 idempotency_key text NOT NULL, UNIQUE(id,tenant_id), UNIQUE(tenant_id,idempotency_key),
 FOREIGN KEY(program_id,tenant_id) REFERENCES learning_program(id,tenant_id)
);
CREATE TABLE learning_outbox (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, aggregate_type text NOT NULL,
 aggregate_id uuid NOT NULL, event_type text NOT NULL, payload jsonb NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN('pending','published','failed')),
 created_at timestamptz NOT NULL DEFAULT now(), published_at timestamptz, UNIQUE(id,tenant_id)
);

CREATE INDEX idx_outcome_source ON outcome_observation(tenant_id,source_type,source_id);
CREATE INDEX idx_learning_status ON learning_record(tenant_id,status,learning_type);
CREATE INDEX idx_pattern_status ON pattern_hypothesis(tenant_id,status,confidence DESC);
CREATE INDEX idx_contradiction_open ON contradiction_record(tenant_id,status) WHERE status='open';
CREATE INDEX idx_recommendation_status ON improvement_recommendation(tenant_id,status,confidence DESC);
CREATE INDEX idx_backlog_owner ON improvement_backlog_item(tenant_id,owner_id,status);
CREATE INDEX idx_outbox_pending ON learning_outbox(status,created_at) WHERE status='pending';

CREATE OR REPLACE FUNCTION prevent_self_learning_approval() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.status IN ('approved','rejected') AND NEW.reviewed_by = NEW.proposed_by THEN
  RAISE EXCEPTION 'learning proposer cannot approve or reject own version';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER trg_learning_self_approval BEFORE INSERT OR UPDATE ON learning_version
FOR EACH ROW EXECUTE FUNCTION prevent_self_learning_approval();

CREATE OR REPLACE FUNCTION protect_learning_immutable_records() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_TABLE_NAME='learning_version' AND OLD.status IN('approved','rejected','superseded') THEN RAISE EXCEPTION 'reviewed learning version is immutable'; END IF;
 IF TG_TABLE_NAME='pattern_hypothesis' AND OLD.status IN('approved','rejected','retired') THEN RAISE EXCEPTION 'reviewed pattern is immutable'; END IF;
 IF TG_TABLE_NAME='contradiction_record' AND OLD.status IN('resolved','accepted_variance') THEN RAISE EXCEPTION 'resolved contradiction is immutable'; END IF;
 IF TG_TABLE_NAME='improvement_recommendation' AND OLD.status IN('approved','rejected','retired') THEN RAISE EXCEPTION 'decided recommendation is immutable'; END IF;
 IF TG_TABLE_NAME='improvement_backlog_item' AND OLD.status='handed_off' THEN RAISE EXCEPTION 'handed-off backlog item is immutable'; END IF;
 IF TG_TABLE_NAME='maturity_assessment' AND OLD.status IN('issued','superseded') THEN RAISE EXCEPTION 'issued maturity assessment is immutable'; END IF;
 IF TG_TABLE_NAME='executive_improvement_briefing' AND OLD.status IN('issued','superseded','archived') THEN RAISE EXCEPTION 'issued briefing is immutable'; END IF;
 IF TG_TABLE_NAME='learning_advisory_request' AND OLD.status='completed' THEN RAISE EXCEPTION 'completed advisory response is immutable'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER trg_learning_version_immutable BEFORE UPDATE OR DELETE ON learning_version FOR EACH ROW EXECUTE FUNCTION protect_learning_immutable_records();
CREATE TRIGGER trg_pattern_immutable BEFORE UPDATE OR DELETE ON pattern_hypothesis FOR EACH ROW EXECUTE FUNCTION protect_learning_immutable_records();
CREATE TRIGGER trg_contradiction_immutable BEFORE UPDATE OR DELETE ON contradiction_record FOR EACH ROW EXECUTE FUNCTION protect_learning_immutable_records();
CREATE TRIGGER trg_recommendation_immutable BEFORE UPDATE OR DELETE ON improvement_recommendation FOR EACH ROW EXECUTE FUNCTION protect_learning_immutable_records();
CREATE TRIGGER trg_backlog_immutable BEFORE UPDATE OR DELETE ON improvement_backlog_item FOR EACH ROW EXECUTE FUNCTION protect_learning_immutable_records();
CREATE TRIGGER trg_maturity_immutable BEFORE UPDATE OR DELETE ON maturity_assessment FOR EACH ROW EXECUTE FUNCTION protect_learning_immutable_records();
CREATE TRIGGER trg_briefing_immutable BEFORE UPDATE OR DELETE ON executive_improvement_briefing FOR EACH ROW EXECUTE FUNCTION protect_learning_immutable_records();
CREATE TRIGGER trg_advisory_immutable BEFORE UPDATE OR DELETE ON learning_advisory_request FOR EACH ROW EXECUTE FUNCTION protect_learning_immutable_records();

CREATE OR REPLACE FUNCTION protect_validated_evidence() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN IF OLD.quality_status='validated' THEN RAISE EXCEPTION 'validated evidence is immutable'; END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_evidence_immutable BEFORE UPDATE OR DELETE ON evidence_reference FOR EACH ROW EXECUTE FUNCTION protect_validated_evidence();

ALTER TABLE learning_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_observation ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_hypothesis ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE contradiction_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_recommendation ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_review ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_backlog_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE maturity_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_improvement_briefing ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_advisory_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY learning_program_tenant ON learning_program USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY outcome_observation_tenant ON outcome_observation USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY evidence_reference_tenant ON evidence_reference USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY learning_record_tenant ON learning_record USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY learning_version_tenant ON learning_version USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY pattern_hypothesis_tenant ON pattern_hypothesis USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY pattern_evidence_tenant ON pattern_evidence USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY contradiction_record_tenant ON contradiction_record USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY improvement_recommendation_tenant ON improvement_recommendation USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY recommendation_review_tenant ON recommendation_review USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY improvement_backlog_tenant ON improvement_backlog_item USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY maturity_assessment_tenant ON maturity_assessment USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY executive_briefing_tenant ON executive_improvement_briefing USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY learning_advisory_tenant ON learning_advisory_request USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY learning_outbox_tenant ON learning_outbox USING(tenant_id=(auth.jwt()->>'tenant_id')::uuid) WITH CHECK(tenant_id=(auth.jwt()->>'tenant_id')::uuid);
