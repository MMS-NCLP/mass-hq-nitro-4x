CREATE TABLE discovery_session (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, user_id uuid NOT NULL,
 title text NOT NULL, status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived','deleted')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (id, tenant_id)
);
CREATE TABLE search_source (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, source_type text NOT NULL,
 adapter_key text NOT NULL, status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (id, tenant_id), UNIQUE (tenant_id, adapter_key)
);
CREATE TABLE search_query (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, session_id uuid NOT NULL, query_text text NOT NULL,
 filters jsonb NOT NULL DEFAULT '{}', status text NOT NULL DEFAULT 'received', idempotency_key text NOT NULL,
 requested_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
 UNIQUE (id, tenant_id), UNIQUE (tenant_id, idempotency_key),
 FOREIGN KEY (session_id, tenant_id) REFERENCES discovery_session(id, tenant_id)
);
CREATE TABLE query_source (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, query_id uuid NOT NULL, source_id uuid NOT NULL,
 selection_reason text NOT NULL, UNIQUE (tenant_id, query_id, source_id),
 FOREIGN KEY (query_id, tenant_id) REFERENCES search_query(id, tenant_id),
 FOREIGN KEY (source_id, tenant_id) REFERENCES search_source(id, tenant_id)
);
CREATE TABLE search_result (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, query_id uuid NOT NULL, source_id uuid NOT NULL,
 source_entity_type text NOT NULL, source_entity_id text NOT NULL, source_version text,
 title text NOT NULL, excerpt text, rank integer NOT NULL CHECK (rank > 0), score numeric NOT NULL,
 observed_at timestamptz NOT NULL DEFAULT now(), UNIQUE (id, tenant_id), UNIQUE (query_id, rank),
 FOREIGN KEY (query_id, tenant_id) REFERENCES search_query(id, tenant_id),
 FOREIGN KEY (source_id, tenant_id) REFERENCES search_source(id, tenant_id)
);
CREATE TABLE result_citation (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, result_id uuid NOT NULL, locator text NOT NULL,
 quoted_excerpt text, lineage jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY (result_id, tenant_id) REFERENCES search_result(id, tenant_id)
);
CREATE TABLE ranking_explanation (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, result_id uuid NOT NULL, signal text NOT NULL,
 contribution numeric NOT NULL, explanation text NOT NULL,
 FOREIGN KEY (result_id, tenant_id) REFERENCES search_result(id, tenant_id)
);
CREATE TABLE saved_search (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, owner_id uuid NOT NULL, name text NOT NULL,
 query_definition jsonb NOT NULL, deleted_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (id, tenant_id)
);
CREATE TABLE search_feedback (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, result_id uuid NOT NULL, user_id uuid NOT NULL,
 relevance smallint NOT NULL CHECK (relevance BETWEEN -1 AND 1), comment text,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id, result_id, user_id),
 FOREIGN KEY (result_id, tenant_id) REFERENCES search_result(id, tenant_id)
);
CREATE TABLE search_audit (
 id uuid PRIMARY KEY, tenant_id uuid NOT NULL, query_id uuid NOT NULL, actor_id uuid NOT NULL,
 action text NOT NULL, detail jsonb NOT NULL DEFAULT '{}', occurred_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY (query_id, tenant_id) REFERENCES search_query(id, tenant_id)
);
CREATE INDEX idx_search_query_tenant_status ON search_query(tenant_id,status);
CREATE INDEX idx_search_result_query_rank ON search_result(query_id,rank);
CREATE INDEX idx_saved_search_owner ON saved_search(tenant_id,owner_id) WHERE deleted_at IS NULL;

CREATE OR REPLACE FUNCTION prevent_completed_query_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN IF OLD.status = 'completed' THEN RAISE EXCEPTION 'completed query is immutable'; END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_completed_query_immutable BEFORE UPDATE OR DELETE ON search_query
FOR EACH ROW EXECUTE FUNCTION prevent_completed_query_mutation();

ALTER TABLE discovery_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_source ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_query ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_source ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_citation ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_explanation ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_search ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY discovery_session_tenant ON discovery_session USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
CREATE POLICY search_source_tenant ON search_source USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
CREATE POLICY search_query_tenant ON search_query USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
CREATE POLICY query_source_tenant ON query_source USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
CREATE POLICY search_result_tenant ON search_result USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
CREATE POLICY result_citation_tenant ON result_citation USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
CREATE POLICY ranking_explanation_tenant ON ranking_explanation USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
CREATE POLICY saved_search_tenant ON saved_search USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
CREATE POLICY search_feedback_tenant ON search_feedback USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
CREATE POLICY search_audit_tenant ON search_audit USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
