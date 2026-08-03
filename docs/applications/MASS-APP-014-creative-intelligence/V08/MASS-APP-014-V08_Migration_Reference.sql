CREATE TABLE communication_case (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, title text NOT NULL,
 status text NOT NULL DEFAULT 'draft' CHECK(status IN('draft','context_assembly','collaboration','ready_for_approval','approved','handed_off','feedback_received','closed','archived')),
 communication_owner_id uuid NOT NULL, created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id)
);
CREATE TABLE communication_objective (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, case_id uuid NOT NULL,
 revision_number integer NOT NULL CHECK(revision_number>0), objective text NOT NULL, intended_outcome text NOT NULL,
 urgency text, sensitivity text NOT NULL, success_criteria jsonb NOT NULL DEFAULT '[]', active boolean NOT NULL DEFAULT true,
 created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id), UNIQUE(case_id,revision_number),
 FOREIGN KEY(case_id,tenant_id) REFERENCES communication_case(id,tenant_id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX communication_objective_active_idx ON communication_objective(case_id) WHERE active;
CREATE TABLE communication_context (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, case_id uuid NOT NULL,
 summary text NOT NULL, constraints jsonb NOT NULL DEFAULT '[]', authorization_snapshot jsonb NOT NULL,
 status text NOT NULL DEFAULT 'draft' CHECK(status IN('draft','approved','superseded')), created_by uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id),
 FOREIGN KEY(case_id,tenant_id) REFERENCES communication_case(id,tenant_id) ON DELETE CASCADE
);
CREATE TABLE context_reference (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, context_id uuid NOT NULL,
 source_type text NOT NULL, source_id uuid NOT NULL, source_revision text, locator text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id), UNIQUE(context_id,source_type,source_id,locator),
 FOREIGN KEY(context_id,tenant_id) REFERENCES communication_context(id,tenant_id) ON DELETE CASCADE
);
CREATE TABLE responsibility_assignment (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, case_id uuid NOT NULL,
 principal_id uuid NOT NULL, responsibility text NOT NULL, assignment_type text NOT NULL CHECK(assignment_type IN('accountable','contributor','reviewer','downstream_owner')),
 assigned_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id), UNIQUE(case_id,principal_id,responsibility),
 FOREIGN KEY(case_id,tenant_id) REFERENCES communication_case(id,tenant_id) ON DELETE CASCADE
);
CREATE TABLE communication_plan (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, case_id uuid NOT NULL,
 context_id uuid NOT NULL, intended_channel text, timing_guidance text, policy_references jsonb NOT NULL DEFAULT '[]',
 status text NOT NULL DEFAULT 'draft' CHECK(status IN('draft','reviewed','approved','superseded')), created_by uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id),
 FOREIGN KEY(case_id,tenant_id) REFERENCES communication_case(id,tenant_id) ON DELETE CASCADE,
 FOREIGN KEY(context_id,tenant_id) REFERENCES communication_context(id,tenant_id) ON DELETE RESTRICT
);
CREATE TABLE message_brief (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, case_id uuid NOT NULL, plan_id uuid NOT NULL,
 audience_class_reference text NOT NULL, required_sections jsonb NOT NULL DEFAULT '[]', tone_guidance text,
 legal_notes text, source_citations jsonb NOT NULL DEFAULT '[]', created_by uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id),
 FOREIGN KEY(case_id,tenant_id) REFERENCES communication_case(id,tenant_id) ON DELETE CASCADE,
 FOREIGN KEY(plan_id,tenant_id) REFERENCES communication_plan(id,tenant_id) ON DELETE RESTRICT
);
CREATE TABLE collaboration_thread (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, case_id uuid NOT NULL,
 subject text NOT NULL, status text NOT NULL DEFAULT 'open' CHECK(status IN('open','resolved','archived')),
 created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id),
 FOREIGN KEY(case_id,tenant_id) REFERENCES communication_case(id,tenant_id) ON DELETE CASCADE
);
CREATE TABLE collaboration_contribution (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, thread_id uuid NOT NULL,
 author_id uuid NOT NULL, author_role text NOT NULL, body text NOT NULL, source_references jsonb NOT NULL DEFAULT '[]',
 position text, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id),
 FOREIGN KEY(thread_id,tenant_id) REFERENCES collaboration_thread(id,tenant_id) ON DELETE CASCADE
);
CREATE TABLE collaboration_resolution (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, thread_id uuid NOT NULL,
 resolution text NOT NULL, dissent jsonb NOT NULL DEFAULT '[]', resolved_by uuid NOT NULL,
 authorization_reference text NOT NULL, resolved_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(id,tenant_id), UNIQUE(thread_id),
 FOREIGN KEY(thread_id,tenant_id) REFERENCES collaboration_thread(id,tenant_id) ON DELETE RESTRICT
);
CREATE TABLE communication_approval (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, case_id uuid NOT NULL,
 decision text NOT NULL CHECK(decision IN('approve','reject','revision_required')), rationale text NOT NULL,
 requested_by uuid NOT NULL, decided_by uuid NOT NULL, authorization_reference text NOT NULL,
 decided_at timestamptz NOT NULL DEFAULT now(), CHECK(requested_by<>decided_by), UNIQUE(id,tenant_id),
 FOREIGN KEY(case_id,tenant_id) REFERENCES communication_case(id,tenant_id) ON DELETE RESTRICT
);
CREATE TABLE communication_handoff (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, case_id uuid NOT NULL,
 destination text NOT NULL CHECK(destination IN('app013_content','eng023_governance')), idempotency_key text NOT NULL,
 payload jsonb NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN('pending','sent','accepted','rejected','failed')),
 requested_by uuid NOT NULL, requested_at timestamptz NOT NULL DEFAULT now(), external_reference text,
 UNIQUE(id,tenant_id), UNIQUE(tenant_id,destination,idempotency_key),
 FOREIGN KEY(case_id,tenant_id) REFERENCES communication_case(id,tenant_id) ON DELETE RESTRICT
);
CREATE TABLE communication_feedback (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, handoff_id uuid NOT NULL,
 source_system text NOT NULL, feedback_type text NOT NULL, payload jsonb NOT NULL, verified boolean NOT NULL DEFAULT false,
 received_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id),
 FOREIGN KEY(handoff_id,tenant_id) REFERENCES communication_handoff(id,tenant_id) ON DELETE RESTRICT
);
CREATE INDEX communication_case_status_idx ON communication_case(tenant_id,status,updated_at DESC);
CREATE INDEX communication_context_case_idx ON communication_context(tenant_id,case_id,status);
CREATE INDEX contribution_thread_idx ON collaboration_contribution(tenant_id,thread_id,created_at);
CREATE INDEX handoff_status_idx ON communication_handoff(tenant_id,destination,status);
CREATE OR REPLACE FUNCTION v08_immutable() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION '% is immutable',TG_TABLE_NAME; END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_contribution_append_only BEFORE UPDATE OR DELETE ON collaboration_contribution FOR EACH ROW EXECUTE FUNCTION v08_immutable();
CREATE TRIGGER trg_resolution_immutable BEFORE UPDATE OR DELETE ON collaboration_resolution FOR EACH ROW EXECUTE FUNCTION v08_immutable();
CREATE TRIGGER trg_approval_immutable BEFORE UPDATE OR DELETE ON communication_approval FOR EACH ROW EXECUTE FUNCTION v08_immutable();
DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['communication_case','communication_objective','communication_context','context_reference','responsibility_assignment','communication_plan','message_brief','collaboration_thread','collaboration_contribution','collaboration_resolution','communication_approval','communication_handoff','communication_feedback'] LOOP EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY',t); EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id=(auth.jwt()->>''tenant_id'')::uuid) WITH CHECK (tenant_id=(auth.jwt()->>''tenant_id'')::uuid)',t||'_tenant_policy',t); END LOOP; END $$;
