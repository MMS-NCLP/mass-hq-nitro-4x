# TNGD Dispatch V1 — Vercel + Supabase Deployment Adapter Completion Report

## Decision Control

| Field | Value |
|---|---|
| Starting canonical SHA | `3b006458e7bc1840abf9cf8c913fc3d211b3e05f` |
| Adapter implementation commit | `fed0123eb2ca53b9fe9805ade3afefaa34bc571b` |
| Branch | `codex/vercel-supabase-adapter` |
| Status | Repository manufacture complete — **Executive Configuration Gate** |
| Deployment posture | **PRE-LAUNCH / LIVE QA** |
| Production Accepted | **No** |
| Live HTTPS URL | Not created; external projects and credentials unavailable |

## Manufactured Boundary

The accepted Dispatch domain kernel remains authoritative and was not rewritten into Vercel Functions or Supabase. The implementation adds only the approved delivery and provider adapters:

- Vercel static/SPA configuration for the 18 accepted Product Realization routes;
- a catch-all `/api` Node Function that delegates to the existing request handler;
- a same-origin Supabase Auth session boundary using Secure, HttpOnly cookies;
- access-token verification through Supabase Auth;
- tenant and UI-role resolution from active authoritative membership rows;
- a dependency-free Supabase REST persistence adapter;
- an executable Supabase migration with tenant RLS, optimistic concurrency, idempotency, serialized audit-chain evidence, and a server-only bootstrap RPC;
- a private Supabase Storage bucket and tenant-folder policies;
- a governed Storage adapter that preserves manifest rights, tenant ownership, provider-relative keys, metadata, and signed-URL rules;
- Square sandbox/secret configuration seams without credentials or webhook activation;
- fresh-QA bootstrap tooling, environment contract, deployment procedure, and rollback controls.

## Vercel Adapter Status

`vercel.json`, `api/index.mjs`, and `api/[...path].mjs` are complete. Vercel owns static delivery while the thin Node function handles health, session, and authenticated bootstrap requests. Static and API delivery apply CSP, frame denial, MIME sniffing prevention, referrer restriction, permissions restriction, and same-origin opener isolation.

No Vercel project was linked and no Preview deployment was created because Vercel credentials/project authority and the Vercel CLI were unavailable.

## Supabase Schema and Migration Status

The ordered executable migration is:

`supabase/migrations/202608200001_dispatch_v1_adapter.sql`

It defines:

- `dispatch_tenants`;
- `dispatch_tenant_memberships`;
- `dispatch_aggregates`;
- `dispatch_audit_events`;
- `dispatch_idempotency_keys`;
- `dispatch_media_objects`;
- private `dispatch-media` Storage bucket policies;
- `dispatch_has_tenant_access` and `dispatch_has_permission` helpers;
- atomic `dispatch_save_aggregate` and service-only `dispatch_bootstrap_tenant` RPCs.

Static migration/security validation passed. The migration was not applied or linted against a live Supabase database because no project, service credential, database URL, or linked environment was supplied. The installed Supabase CLI also attempted to write telemetry outside the permitted workspace, so no local/linked CLI database claim is made.

## Authentication and Session Status

- Browser credentials are posted only to same-origin `/api/session`.
- Access and refresh tokens are stored in `__Host-`/`__Secure-` HttpOnly, Secure, SameSite cookies.
- Session refresh and logout boundaries are present.
- Cross-origin session mutation is rejected.
- `/api/bootstrap` verifies the access token and then resolves active membership through RLS.
- A requested tenant is only a selector; it cannot create membership or authority.
- Ambiguous multi-tenant membership requires explicit tenant selection.
- User-editable metadata is ignored for authorization.
- The browser never receives or references a service-role credential.

Live Supabase sign-in, expiry, refresh rotation, and redirect configuration remain provider-backed validation items.

## Tenant and RLS Status

RLS is enabled on all six exposed tenant-scoped application tables. Policies derive access from `auth.uid()` plus active authoritative membership. Administrative writes use explicit permission checks. Membership changes and initial tenant bootstrap are not available to ordinary authenticated users. The aggregate-write RPC derives its actor from the verified JWT, requires tenant permission, enforces expected versions and idempotency, serializes tenant audit writes, and records the previous/current hash evidence.

Live cross-tenant SQL/RLS verification remains deferred until the migration is applied to the approved QA project.

## Storage and Media Status

The Storage adapter accepts only media records valid under the existing canonical media manifest. It rejects tenant mismatch, traversal/physical paths through the existing source-key validator, withdrawn/restricted content, and unapproved public use. Object keys begin with the authoritative tenant UUID. Metadata and signed URLs use the caller's verified JWT and RLS; the bucket is private.

The six deferred Google Drive media collections remain unimported pending inventory and rights verification.

## Test, Build, and Security Evidence

Validation was rerun against exact implementation commit `fed0123eb2ca53b9fe9805ade3afefaa34bc571b`:

- `npm.cmd run candidate`: exit 0.
- Build: passed.
- Tests: **198 passed, 0 failed, 0 skipped, 0 cancelled**.
- New deployment-adapter tests: 7 passed.
- Canonical repository validator: passed through Deployment Adapter.
- Product Realization static/responsive/assets validator: passed.
- Vercel + Supabase deployment-security validator: passed.
- Candidate packaging: nine browser assets checksummed.
- Engineering smoke: health, security headers, history fallback, approved assets, role boundaries, and traversal rejection all passed.
- `git diff --check`: passed.
- Secret/path scan found no committed credential, JWT, Supabase project endpoint, local-drive source, or service-role value.

Provider-backed migration execution, RLS integration tests, Vercel build/deploy, HTTPS smoke, and rendered browser/device QA were not available and are not claimed.

## Required Environment Contract

Vercel Preview runtime:

- `MASS_RUNTIME_ENV`
- `MASS_DEPLOYMENT_TARGET`
- `MASS_DEPLOYMENT_MODE=pre-launch-live-qa`
- `MASS_PUBLIC_ORIGIN`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_STORAGE_BUCKET=dispatch-media`

Server/CLI-only migration and one-time bootstrap environment:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`
- `MASS_BOOTSTRAP_TENANT_ID`
- `MASS_BOOTSTRAP_TENANT_NAME`
- `MASS_BOOTSTRAP_USER_ID`
- `MASS_BOOTSTRAP_USER_EMAIL`

Optional server-only provider testing:

- `SQUARE_ENVIRONMENT=sandbox`
- `SQUARE_ACCESS_TOKEN`
- `SQUARE_WEBHOOK_SIGNATURE_KEY`

No value may be committed. Service-role, database, Square, and bootstrap values must not be exposed to browser bundles.

## Executive Configuration Gate

External progress requires the Executive to supply or perform:

1. Select the approved Supabase QA project and provide its project URL and publishable key.
2. Make the service-role key and database URL available only for authorized migration/bootstrap execution.
3. Create or identify the initial Supabase Auth QA user and provide the approved tenant/user UUIDs, tenant name, and email.
4. Select the Vercel team/project and connect it to the canonical GitHub repository with project root `implementation/pilot/tngd-dispatch-portal`.
5. Authorize execution of `supabase db push`, linked lint, tenant bootstrap, and Vercel Preview deployment.
6. Configure the resulting Vercel Preview URL as `MASS_PUBLIC_ORIGIN` and in the Supabase Auth Site URL/redirect allowlist.
7. Supply Square sandbox secrets only if live BP-011 provider validation is authorized.
8. Provide the resulting Preview for engineering HTTPS smoke and Claude's independent rendered/final live QA.

## Disposition

Repository-side deployment-adapter manufacture is complete. The branch is ready for canonical synchronization and external QA configuration. The candidate remains **not deployed, not Production Accepted, and not authorized for operational data or field use**.
