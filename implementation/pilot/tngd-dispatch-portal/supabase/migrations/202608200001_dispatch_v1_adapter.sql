begin;

create extension if not exists pgcrypto with schema extensions;

create table public.dispatch_tenants (
  id uuid primary key,
  name text not null check (length(btrim(name)) > 0),
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now()
);

create table public.dispatch_tenant_memberships (
  tenant_id uuid not null references public.dispatch_tenants(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  ui_role text not null check (ui_role in ('technician', 'dispatcher', 'administrator')),
  roles text[] not null default '{}',
  permissions text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table public.dispatch_aggregates (
  tenant_id uuid not null references public.dispatch_tenants(id) on delete restrict,
  aggregate_type text not null check (length(btrim(aggregate_type)) > 0),
  aggregate_id uuid not null,
  version bigint not null check (version > 0),
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tenant_id, aggregate_type, aggregate_id)
);

create table public.dispatch_audit_events (
  tenant_id uuid not null references public.dispatch_tenants(id) on delete restrict,
  sequence bigint not null check (sequence > 0),
  id uuid not null default gen_random_uuid(),
  principal_id uuid not null references auth.users(id) on delete restrict,
  aggregate_type text not null,
  aggregate_id uuid not null,
  event_type text not null check (length(btrim(event_type)) > 0),
  payload jsonb not null default '{}',
  occurred_at timestamptz not null default now(),
  previous_hash text,
  hash text not null,
  primary key (tenant_id, sequence),
  unique (tenant_id, id)
);

create table public.dispatch_idempotency_keys (
  tenant_id uuid not null references public.dispatch_tenants(id) on delete restrict,
  key text not null check (length(btrim(key)) > 0),
  operation text not null check (length(btrim(operation)) > 0),
  request_hash text not null,
  response jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key (tenant_id, key)
);

create table public.dispatch_media_objects (
  tenant_id uuid not null references public.dispatch_tenants(id) on delete restrict,
  asset_id text not null,
  object_key text not null,
  checksum text,
  mime_type text not null,
  classification text not null,
  approval_state text not null check (approval_state in ('unreviewed', 'internal-approved', 'public-approved', 'restricted', 'withdrawn')),
  internal_eligible boolean not null default true,
  public_eligible boolean not null default false,
  lineage text not null,
  metadata jsonb not null default '{}',
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (tenant_id, asset_id),
  unique (tenant_id, object_key),
  check (object_key like tenant_id::text || '/%' and object_key not like '%../%'),
  check (not public_eligible or approval_state = 'public-approved')
);

alter table public.dispatch_tenants enable row level security;
alter table public.dispatch_tenant_memberships enable row level security;
alter table public.dispatch_aggregates enable row level security;
alter table public.dispatch_audit_events enable row level security;
alter table public.dispatch_idempotency_keys enable row level security;
alter table public.dispatch_media_objects enable row level security;

create or replace function public.dispatch_has_tenant_access(target_tenant uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.dispatch_tenant_memberships membership
    join public.dispatch_tenants tenant on tenant.id = membership.tenant_id
    where membership.tenant_id = target_tenant
      and membership.user_id = auth.uid()
      and membership.active
      and tenant.status = 'active'
  );
$$;

create or replace function public.dispatch_has_permission(target_tenant uuid, requested text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.dispatch_tenant_memberships membership
    join public.dispatch_tenants tenant on tenant.id = membership.tenant_id
    where membership.tenant_id = target_tenant
      and membership.user_id = auth.uid()
      and membership.active
      and tenant.status = 'active'
      and (
        membership.ui_role = 'administrator'
        or '*' = any(membership.permissions)
        or requested = any(membership.permissions)
      )
  );
$$;

revoke all on function public.dispatch_has_tenant_access(uuid) from public, anon;
revoke all on function public.dispatch_has_permission(uuid, text) from public, anon;
grant execute on function public.dispatch_has_tenant_access(uuid) to authenticated;
grant execute on function public.dispatch_has_permission(uuid, text) to authenticated;

create policy tenant_member_read on public.dispatch_tenants for select to authenticated
  using (public.dispatch_has_tenant_access(id));
create policy own_membership_read on public.dispatch_tenant_memberships for select to authenticated
  using (user_id = auth.uid() and public.dispatch_has_tenant_access(tenant_id));
create policy aggregate_member_read on public.dispatch_aggregates for select to authenticated
  using (public.dispatch_has_tenant_access(tenant_id));
create policy audit_authorized_read on public.dispatch_audit_events for select to authenticated
  using (public.dispatch_has_permission(tenant_id, 'security.audit.read'));
create policy idempotency_member_read on public.dispatch_idempotency_keys for select to authenticated
  using (public.dispatch_has_tenant_access(tenant_id));
create policy media_member_read on public.dispatch_media_objects for select to authenticated
  using (public.dispatch_has_tenant_access(tenant_id));
create policy media_authorized_insert on public.dispatch_media_objects for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.dispatch_has_permission(tenant_id, 'media.write')
  );
create policy media_authorized_update on public.dispatch_media_objects for update to authenticated
  using (public.dispatch_has_permission(tenant_id, 'media.write'))
  with check (public.dispatch_has_permission(tenant_id, 'media.write'));

create or replace function public.dispatch_save_aggregate(
  p_tenant_id uuid,
  p_aggregate_type text,
  p_aggregate_id uuid,
  p_expected_version bigint,
  p_state jsonb,
  p_event_type text,
  p_event_payload jsonb,
  p_idempotency_key text,
  p_request_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_version bigint;
  next_version bigint;
  next_sequence bigint;
  prior_hash text;
  event_id uuid := gen_random_uuid();
  occurred timestamptz := now();
  event_hash text;
  existing_hash text;
  existing_response jsonb;
  result jsonb;
begin
  if not public.dispatch_has_permission(p_tenant_id, 'operations.write') then
    raise exception 'dispatch authorization denied' using errcode = '42501';
  end if;
  if p_expected_version < 0 or jsonb_typeof(p_state) <> 'object'
    or length(btrim(p_idempotency_key)) = 0 or length(btrim(p_request_hash)) = 0 then
    raise exception 'invalid aggregate write' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_tenant_id::text, 0));
  select request_hash, response into existing_hash, existing_response
    from public.dispatch_idempotency_keys
    where tenant_id = p_tenant_id and key = p_idempotency_key
    for update;
  if found then
    if existing_hash <> p_request_hash then raise exception 'idempotency key conflict' using errcode = '23505'; end if;
    if existing_response is null then raise exception 'idempotent operation in progress' using errcode = '40001'; end if;
    return existing_response;
  end if;
  insert into public.dispatch_idempotency_keys (tenant_id, key, operation, request_hash, expires_at)
    values (p_tenant_id, p_idempotency_key, 'dispatch_save_aggregate', p_request_hash, now() + interval '24 hours');

  select version into current_version
    from public.dispatch_aggregates
    where tenant_id = p_tenant_id and aggregate_type = p_aggregate_type and aggregate_id = p_aggregate_id
    for update;

  if current_version is null then
    if p_expected_version <> 0 then raise exception 'aggregate version conflict' using errcode = '40001'; end if;
    next_version := 1;
    insert into public.dispatch_aggregates (tenant_id, aggregate_type, aggregate_id, version, state)
      values (p_tenant_id, p_aggregate_type, p_aggregate_id, next_version, p_state);
  else
    if current_version <> p_expected_version then raise exception 'aggregate version conflict' using errcode = '40001'; end if;
    next_version := current_version + 1;
    update public.dispatch_aggregates
      set version = next_version, state = p_state, updated_at = occurred
      where tenant_id = p_tenant_id and aggregate_type = p_aggregate_type and aggregate_id = p_aggregate_id;
  end if;

  select sequence, hash into next_sequence, prior_hash
    from public.dispatch_audit_events where tenant_id = p_tenant_id order by sequence desc limit 1;
  next_sequence := coalesce(next_sequence, 0) + 1;
  event_hash := encode(extensions.digest(convert_to(
    concat_ws('|', p_tenant_id, next_sequence, event_id, auth.uid(), p_aggregate_type, p_aggregate_id, p_event_type, p_event_payload::text, occurred, coalesce(prior_hash, '')),
    'UTF8'), 'sha256'), 'hex');
  insert into public.dispatch_audit_events (
    tenant_id, sequence, id, principal_id, aggregate_type, aggregate_id, event_type, payload, occurred_at, previous_hash, hash
  ) values (
    p_tenant_id, next_sequence, event_id, auth.uid(), p_aggregate_type, p_aggregate_id, p_event_type, p_event_payload, occurred, prior_hash, event_hash
  );

  result := jsonb_build_object('aggregateId', p_aggregate_id, 'version', next_version, 'auditEventId', event_id, 'auditHash', event_hash);
  update public.dispatch_idempotency_keys set response = result
    where tenant_id = p_tenant_id and key = p_idempotency_key;
  return result;
end;
$$;

revoke all on function public.dispatch_save_aggregate(uuid, text, uuid, bigint, jsonb, text, jsonb, text, text) from public, anon;
grant execute on function public.dispatch_save_aggregate(uuid, text, uuid, bigint, jsonb, text, jsonb, text, text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit)
values ('dispatch-media', 'dispatch-media', false, 26214400)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit;

create policy dispatch_storage_member_read on storage.objects for select to authenticated
  using (
    bucket_id = 'dispatch-media'
    and public.dispatch_has_tenant_access((storage.foldername(name))[1]::uuid)
  );
create policy dispatch_storage_authorized_insert on storage.objects for insert to authenticated
  with check (
    bucket_id = 'dispatch-media'
    and public.dispatch_has_permission((storage.foldername(name))[1]::uuid, 'media.write')
  );
create policy dispatch_storage_authorized_update on storage.objects for update to authenticated
  using (
    bucket_id = 'dispatch-media'
    and public.dispatch_has_permission((storage.foldername(name))[1]::uuid, 'media.write')
  )
  with check (
    bucket_id = 'dispatch-media'
    and public.dispatch_has_permission((storage.foldername(name))[1]::uuid, 'media.write')
  );
create policy dispatch_storage_authorized_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'dispatch-media'
    and public.dispatch_has_permission((storage.foldername(name))[1]::uuid, 'media.delete')
  );

create or replace function public.dispatch_bootstrap_tenant(
  p_tenant_id uuid,
  p_tenant_name text,
  p_user_id uuid,
  p_email text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' then raise exception 'service role required' using errcode = '42501'; end if;
  insert into public.dispatch_tenants (id, name) values (p_tenant_id, btrim(p_tenant_name));
  insert into public.dispatch_tenant_memberships (
    tenant_id, user_id, email, ui_role, roles, permissions
  ) values (
    p_tenant_id, p_user_id, lower(btrim(p_email)), 'administrator', array['tenant_admin'], array['*']
  );
end;
$$;

revoke all on function public.dispatch_bootstrap_tenant(uuid, text, uuid, text) from public, anon, authenticated;
grant execute on function public.dispatch_bootstrap_tenant(uuid, text, uuid, text) to service_role;

revoke all on public.dispatch_tenants, public.dispatch_tenant_memberships, public.dispatch_aggregates,
  public.dispatch_audit_events, public.dispatch_idempotency_keys, public.dispatch_media_objects from anon;
grant select on public.dispatch_tenants, public.dispatch_tenant_memberships, public.dispatch_aggregates,
  public.dispatch_audit_events, public.dispatch_idempotency_keys, public.dispatch_media_objects to authenticated;
grant insert, update on public.dispatch_media_objects to authenticated;

commit;
