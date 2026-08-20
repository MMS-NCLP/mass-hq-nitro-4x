# Vercel + Supabase PRE-LAUNCH / LIVE QA Runbook

## Authority and posture

The selected V1 delivery path is GitHub → Vercel → the existing Dispatch Node/domain kernel → Supabase. This adapter does not replace accepted services, authorize V2, or confer Production Acceptance.

## Vercel project

Create or connect a Vercel project to the canonical GitHub repository with this project root:

```text
implementation/pilot/tngd-dispatch-portal
```

`vercel.json` owns the build command, `public` output, explicit SPA routes, security headers, and the thin `/api` rewrite. The function in `api/index.mjs` delegates to the existing request handler; it contains no Dispatch business rules.

Set the required environment values in Vercel Preview first. Never place `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, Square secrets, or bootstrap variables in browser code. The Vercel runtime requires only the publishable Supabase project key for verified-user and RLS-bound calls made by the server adapter.

## Supabase project and migration

Use a dedicated QA project or an explicitly approved isolated QA schema. Link the local Supabase CLI without committing its generated state, then apply the ordered migration:

```text
supabase link --project-ref <approved-project-ref>
supabase db push
supabase db lint --linked
```

The migration creates six tenant-governed application tables, enables RLS on every table, installs authoritative membership and permission helpers, adds an atomic optimistic-concurrency aggregate write with a serialized audit hash chain, and creates a private `dispatch-media` bucket with tenant-folder policies.

Create the initial administrator in Supabase Auth through an approved administrative channel. Then provide the user's Auth UUID and run:

```text
npm run bootstrap:supabase
```

The bootstrap RPC is executable only by `service_role`, creates no password, and inserts one tenant plus its authoritative administrator membership. Remove bootstrap variables from the execution environment after success.

## Authentication and tenant authority

The browser posts credentials only to the same-origin `/api/session` boundary. The adapter exchanges them with Supabase Auth and returns Secure, HttpOnly, SameSite cookies. `/api/bootstrap` verifies the access token through Supabase Auth, then reads active membership through the caller's JWT and RLS.

A request tenant header is only a selector for a verified user with multiple memberships. It never creates authority. User-editable metadata is ignored. A missing membership is denied; multiple memberships without an explicit selector are rejected.

## Storage and media

The bucket remains private. Every object key begins with the authoritative tenant UUID and then the provider-relative `sourceKey` already governed by the media manifest. Upload and signed-URL operations reject tenant mismatches, withdrawn/restricted assets, and public use without public approval. Run the separate rights/inventory gate before migrating the six deferred media collections.

## Provider seams

Square values are server-only and optional at this gate. Empty Square values preserve the explicit integration-unavailable condition. Do not enable a webhook endpoint until its signature secret, canonical public URL, idempotency behavior, and BP-011 compatibility test are configured.

## Deployment and smoke sequence

1. Run `npm run candidate` locally.
2. Apply and lint the migration in the isolated Supabase QA project.
3. Bootstrap the approved tenant administrator.
4. Configure Vercel Preview environment variables.
5. deploy a Vercel Preview from the exact reviewed commit.
6. Verify `/api/health` reports `PRE-LAUNCH / LIVE QA`, `deploymentValidated: false`, and `productionAccepted: false`.
7. Sign in with the QA user and verify the membership-derived route set.
8. Run tenant-crossing, unauthorized, media-rights, refresh/expiry, history-route, and provider-unavailable smoke checks.
9. Preserve Vercel deployment URL/ID, Supabase migration version, test output, and screenshots for Independent Live QA.

Do not promote an alias, connect a production domain, load operational data, or represent the candidate as Production Accepted during this sequence.

## Rollback

- Vercel: retain the prior known-good deployment and move the Preview/custom-domain alias back through Vercel's controlled rollback mechanism.
- Supabase: take the provider-supported backup/snapshot before migration. Applied shared migrations are immutable; repair database defects with a reviewed forward correction migration. Do not edit the applied migration in place.
- Storage: keep the private bucket and objects intact during application rollback. Do not delete governed media as part of a web rollback.
- Secrets: rotate any credential suspected of disclosure, then redeploy from the reviewed commit.

## Executive Configuration Gate

Repository manufacture stops until the Executive supplies or performs:

- approved Supabase QA project reference and `SUPABASE_URL`;
- Supabase publishable key for the QA project;
- server/CLI-only service-role key and database connection URL for migration/bootstrap execution;
- approved tenant UUID, tenant name, initial Auth user UUID, and email;
- Vercel project/team selection and GitHub repository linkage;
- approved `MASS_PUBLIC_ORIGIN` after the Preview URL exists;
- Supabase Auth Site URL and redirect allowlist entries for the Vercel Preview;
- optional Square sandbox token/signature secret only when BP-011 provider testing is authorized;
- approval to execute external migration, bootstrap, and Vercel Preview deployment actions.
