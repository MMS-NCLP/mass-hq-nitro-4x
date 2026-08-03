-- MASS-APP-014-V02 - Knowledge Capture & Organizational Memory
-- Implementation-grade PostgreSQL reference for migrations 014 through 028.
-- Requires pgcrypto and Supabase auth.jwt().

CREATE TABLE memory_collection (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    scope_type text NOT NULL CHECK (scope_type IN ('organization','department','team','project','workspace','session')),
    scope_id uuid NOT NULL,
    classification text NOT NULL DEFAULT 'internal',
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
    created_by uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    archived_at timestamptz,
    UNIQUE (id, tenant_id),
    UNIQUE (tenant_id, scope_type, scope_id, name)
);

CREATE TABLE capture_record (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    collection_id uuid NOT NULL,
    capture_type text NOT NULL CHECK (capture_type IN ('note','decision','conversation','meeting','document')),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_validation','validated','preserved','rejected','archived')),
    title text NOT NULL,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    idempotency_key text NOT NULL,
    captured_by uuid NOT NULL,
    captured_at timestamptz NOT NULL DEFAULT now(),
    validated_by uuid,
    validated_at timestamptz,
    rejection_reason text,
    archived_at timestamptz,
    UNIQUE (id, tenant_id),
    UNIQUE (tenant_id, idempotency_key),
    FOREIGN KEY (collection_id, tenant_id)
        REFERENCES memory_collection (id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE capture_participant (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    capture_id uuid NOT NULL,
    participant_type text NOT NULL CHECK (participant_type IN ('person','organization','system')),
    participant_id uuid NOT NULL,
    role text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, tenant_id),
    UNIQUE (capture_id, participant_type, participant_id, role),
    FOREIGN KEY (capture_id, tenant_id)
        REFERENCES capture_record (id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE capture_source_reference (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    capture_id uuid NOT NULL,
    source_type text NOT NULL,
    source_id uuid NOT NULL,
    source_revision text,
    locator text NOT NULL,
    context text NOT NULL DEFAULT '',
    source_hash text,
    verification_status text NOT NULL DEFAULT 'current'
        CHECK (verification_status IN ('current','stale','archived','unavailable')),
    verified_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, tenant_id),
    UNIQUE (capture_id, source_type, source_id, locator, context),
    FOREIGN KEY (capture_id, tenant_id)
        REFERENCES capture_record (id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE memory_record (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    collection_id uuid NOT NULL,
    source_capture_id uuid,
    title text NOT NULL,
    classification text NOT NULL DEFAULT 'internal',
    status text NOT NULL DEFAULT 'preserved'
        CHECK (status IN ('preserved','superseded','archived')),
    current_revision_id uuid,
    created_by uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    archived_at timestamptz,
    UNIQUE (id, tenant_id),
    FOREIGN KEY (collection_id, tenant_id)
        REFERENCES memory_collection (id, tenant_id) ON DELETE RESTRICT,
    FOREIGN KEY (source_capture_id, tenant_id)
        REFERENCES capture_record (id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE memory_revision (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    memory_id uuid NOT NULL,
    revision_number integer NOT NULL CHECK (revision_number > 0),
    body text NOT NULL,
    summary text,
    status text NOT NULL DEFAULT 'preserved'
        CHECK (status IN ('preserved','superseded')),
    checksum text NOT NULL,
    preserved_by uuid NOT NULL,
    preserved_at timestamptz NOT NULL DEFAULT now(),
    superseded_at timestamptz,
    UNIQUE (id, tenant_id),
    UNIQUE (memory_id, revision_number),
    UNIQUE (id, memory_id, tenant_id),
    FOREIGN KEY (memory_id, tenant_id)
        REFERENCES memory_record (id, tenant_id) ON DELETE RESTRICT
);

ALTER TABLE memory_record
    ADD CONSTRAINT memory_record_current_revision_fk
    FOREIGN KEY (current_revision_id, id, tenant_id)
    REFERENCES memory_revision (id, memory_id, tenant_id)
    DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE memory_citation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    revision_id uuid NOT NULL,
    source_type text NOT NULL,
    source_id uuid NOT NULL,
    source_revision text,
    locator text NOT NULL,
    context text NOT NULL DEFAULT '',
    excerpt text,
    source_hash text,
    access_classification text NOT NULL DEFAULT 'internal',
    verification_status text NOT NULL DEFAULT 'current'
        CHECK (verification_status IN ('current','stale','archived','unavailable')),
    verified_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, tenant_id),
    UNIQUE (revision_id, source_type, source_id, locator, context),
    FOREIGN KEY (revision_id, tenant_id)
        REFERENCES memory_revision (id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE memory_relationship (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    source_memory_id uuid NOT NULL,
    target_memory_id uuid NOT NULL,
    relationship_type text NOT NULL
        CHECK (relationship_type IN ('supports','contradicts','supersedes','clarifies','derived_from','related_to')),
    rationale text,
    created_by uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, tenant_id),
    UNIQUE (source_memory_id, target_memory_id, relationship_type),
    CHECK (source_memory_id <> target_memory_id),
    FOREIGN KEY (source_memory_id, tenant_id)
        REFERENCES memory_record (id, tenant_id) ON DELETE RESTRICT,
    FOREIGN KEY (target_memory_id, tenant_id)
        REFERENCES memory_record (id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE memory_inheritance_rule (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    parent_collection_id uuid NOT NULL,
    child_collection_id uuid NOT NULL,
    classification text,
    memory_id uuid,
    mode text NOT NULL CHECK (mode IN ('inherit','override','block')),
    active boolean NOT NULL DEFAULT true,
    created_by uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, tenant_id),
    CHECK (parent_collection_id <> child_collection_id),
    FOREIGN KEY (parent_collection_id, tenant_id)
        REFERENCES memory_collection (id, tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (child_collection_id, tenant_id)
        REFERENCES memory_collection (id, tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (memory_id, tenant_id)
        REFERENCES memory_record (id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE memory_confidence_assessment (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    revision_id uuid NOT NULL,
    source_authority smallint NOT NULL CHECK (source_authority BETWEEN 0 AND 20),
    corroboration smallint NOT NULL CHECK (corroboration BETWEEN 0 AND 20),
    recency smallint NOT NULL CHECK (recency BETWEEN 0 AND 20),
    completeness smallint NOT NULL CHECK (completeness BETWEEN 0 AND 20),
    human_verification smallint NOT NULL CHECK (human_verification BETWEEN 0 AND 20),
    total_score smallint NOT NULL CHECK (total_score BETWEEN 0 AND 100),
    band text NOT NULL CHECK (band IN ('unverified','low','moderate','high','verified')),
    assessor_type text NOT NULL CHECK (assessor_type IN ('human','nova_advisory','pops_advisory','system')),
    assessor_id uuid,
    rationale text NOT NULL,
    evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
    assessed_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, tenant_id),
    CHECK (total_score = source_authority + corroboration + recency + completeness + human_verification),
    CHECK (band <> 'verified' OR (assessor_type = 'human' AND human_verification > 0)),
    FOREIGN KEY (revision_id, tenant_id)
        REFERENCES memory_revision (id, tenant_id) ON DELETE RESTRICT
);

CREATE TABLE memory_index_state (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    revision_id uuid NOT NULL,
    knowledge_record_id uuid,
    status text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','indexed','failed','removed')),
    attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
    last_error text,
    indexed_at timestamptz,
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, tenant_id),
    UNIQUE (revision_id),
    FOREIGN KEY (revision_id, tenant_id)
        REFERENCES memory_revision (id, tenant_id) ON DELETE CASCADE
);

CREATE TABLE memory_tag (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    memory_id uuid NOT NULL,
    value text NOT NULL,
    normalized_value text NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, tenant_id),
    UNIQUE (memory_id, normalized_value),
    FOREIGN KEY (memory_id, tenant_id)
        REFERENCES memory_record (id, tenant_id) ON DELETE CASCADE
);

CREATE INDEX capture_record_tenant_status_idx
    ON capture_record (tenant_id, status, captured_at DESC);
CREATE INDEX memory_record_tenant_collection_idx
    ON memory_record (tenant_id, collection_id, status);
CREATE INDEX memory_citation_source_idx
    ON memory_citation (tenant_id, source_type, source_id);
CREATE INDEX memory_relationship_target_idx
    ON memory_relationship (tenant_id, target_memory_id);

CREATE OR REPLACE FUNCTION prevent_preserved_capture_mutation()
RETURNS trigger AS $$
BEGIN
    IF OLD.status = 'preserved' THEN
        RAISE EXCEPTION 'Preserved captures are immutable';
    END IF;
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_preserved_capture_immutable
BEFORE UPDATE OR DELETE ON capture_record
FOR EACH ROW EXECUTE FUNCTION prevent_preserved_capture_mutation();

CREATE OR REPLACE FUNCTION prevent_memory_revision_mutation()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'UPDATE'
       AND OLD.status = 'preserved'
       AND NEW.status = 'superseded'
       AND (to_jsonb(NEW) - 'status' - 'superseded_at')
           = (to_jsonb(OLD) - 'status' - 'superseded_at') THEN
        RETURN NEW;
    END IF;
    IF OLD.status IN ('preserved','superseded') THEN
        RAISE EXCEPTION 'Preserved memory revisions are immutable';
    END IF;
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_memory_revision_immutable
BEFORE UPDATE OR DELETE ON memory_revision
FOR EACH ROW EXECUTE FUNCTION prevent_memory_revision_mutation();

CREATE OR REPLACE FUNCTION prevent_citation_mutation()
RETURNS trigger AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM memory_revision
        WHERE id = OLD.revision_id AND tenant_id = OLD.tenant_id
          AND status IN ('preserved','superseded')
    ) THEN
        IF TG_OP = 'UPDATE'
           AND (to_jsonb(NEW) - 'verification_status' - 'verified_at')
               = (to_jsonb(OLD) - 'verification_status' - 'verified_at') THEN
            RETURN NEW;
        END IF;
        RAISE EXCEPTION 'Citations on preserved revisions are immutable';
    END IF;
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_memory_citation_immutable
BEFORE UPDATE OR DELETE ON memory_citation
FOR EACH ROW EXECUTE FUNCTION prevent_citation_mutation();

CREATE OR REPLACE FUNCTION prevent_confidence_mutation()
RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'Confidence assessments are append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_memory_confidence_append_only
BEFORE UPDATE OR DELETE ON memory_confidence_assessment
FOR EACH ROW EXECUTE FUNCTION prevent_confidence_mutation();

CREATE OR REPLACE FUNCTION prevent_inheritance_cycle()
RETURNS trigger AS $$
BEGIN
    IF EXISTS (
        WITH RECURSIVE descendants(id) AS (
            SELECT child_collection_id
            FROM memory_inheritance_rule
            WHERE tenant_id = NEW.tenant_id
              AND parent_collection_id = NEW.child_collection_id
              AND active
              AND id <> COALESCE(NEW.id, gen_random_uuid())
            UNION
            SELECT r.child_collection_id
            FROM memory_inheritance_rule r
            JOIN descendants d ON r.parent_collection_id = d.id
            WHERE r.tenant_id = NEW.tenant_id AND r.active
        )
        SELECT 1 FROM descendants WHERE id = NEW.parent_collection_id
    ) THEN
        RAISE EXCEPTION 'Memory inheritance cycle is prohibited';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_memory_inheritance_no_cycle
BEFORE INSERT OR UPDATE ON memory_inheritance_rule
FOR EACH ROW EXECUTE FUNCTION prevent_inheritance_cycle();

-- Concrete tenant RLS for all 12 entities.
ALTER TABLE memory_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE capture_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE capture_participant ENABLE ROW LEVEL SECURITY;
ALTER TABLE capture_source_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_revision ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_citation ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_relationship ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_inheritance_rule ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_confidence_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_index_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_tag ENABLE ROW LEVEL SECURITY;

CREATE POLICY memory_collection_tenant ON memory_collection FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY capture_record_tenant ON capture_record FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY capture_participant_tenant ON capture_participant FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY capture_source_reference_tenant ON capture_source_reference FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY memory_record_tenant ON memory_record FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY memory_revision_tenant ON memory_revision FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY memory_citation_tenant ON memory_citation FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY memory_relationship_tenant ON memory_relationship FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY memory_inheritance_rule_tenant ON memory_inheritance_rule FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY memory_confidence_assessment_tenant ON memory_confidence_assessment FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY memory_index_state_tenant ON memory_index_state FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY memory_tag_tenant ON memory_tag FOR ALL
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
