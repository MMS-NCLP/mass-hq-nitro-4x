# TNGD Dispatch V1 — Railway Deployment Acceleration Completion Report

## Decision Control

| Field | Value |
|---|---|
| Starting canonical SHA | `1a77c1f53c7c6221d369ed67f189e96a2e4b16e5` |
| Railway implementation commit | `620efa7cbf1f098bd6b4293a3ef3c618e59a84ba` |
| Branch | `codex/railway-deployment-adapter` |
| Status | Repository manufacture complete — **Executive Railway Authorization Gate** |
| Deployment posture | **PRE-LAUNCH / LIVE QA** |
| Production Accepted | **No** |
| Railway HTTPS URL | Not created; Railway account/project authorization unavailable |

## Scope Manufactured

Only the hosting-provider boundary changed. The accepted Dispatch Node/domain kernel, Product Realization UI, 18 surfaces, Commerce, media manifest/resolver, tenant authorization, audit chain, idempotency, optimistic concurrency, Supabase schema/RLS/Storage design, and Vercel adapter remain preserved.

The Railway implementation adds:

- `railway.json` selecting Railpack, the existing build, the Railway start command, `/api/health`, and failure-scoped restart behavior;
- a native Node Railway entry point that binds Railway's injected `PORT` on `0.0.0.0`;
- combined static assets, SPA/history fallback, security headers, and authenticated API routing through the existing handler;
- reuse of the existing Supabase Auth and authoritative membership boundary;
- HTTPS public-origin inference from Railway's injected public-domain variable;
- a committed Railway configuration/security validator;
- a deployed-origin smoke runner with optional authenticated, tenant-crossing, and persistence checks;
- exact GitHub/CLI deployment, existing-Supabase verification, migration safety, domain, smoke, and rollback procedures.

The Vercel function/configuration was not removed. One narrow shared-handler change allows Vercel and Railway to supply their configured public origin for same-origin session enforcement.

## Validation Evidence

Validation was rerun against exact implementation commit `620efa7cbf1f098bd6b4293a3ef3c618e59a84ba`:

- `npm.cmd run candidate`: exit 0.
- Build: passed.
- Tests: **199 passed, 0 failed, 0 skipped, 0 cancelled**.
- Canonical repository validator: passed.
- Product Realization static/responsive/asset validator: passed.
- Vercel + Supabase deployment-security validator: passed.
- Railway hosting configuration/security validator: passed.
- Candidate packaging: nine browser assets checksummed.
- Existing engineering smoke: six checks passed.
- `git diff --check`: passed.

The exact committed Railway entry point was also started locally with non-secret test configuration. `npm.cmd run smoke:railway` passed:

- Railway PRE-LAUNCH health posture;
- static assets and SPA/history delivery;
- unauthenticated API rejection.

No rendered/device QA claim is made.

## Supabase and Data-Integrity Disposition

The existing additive Supabase migration, RLS policies, Storage bucket policies, bootstrap RPC, Auth boundary, persistence adapter, and media adapter were reused unchanged. No second Supabase project was created.

The migration was not applied because the environment did not expose the intended `top-notch-garage-doors` project reference, URL/key material, database/service credentials, or an inventory proving that existing objects are compatible. Applying it without those checks would create an avoidable data-integrity risk.

Before migration, the operator must verify the selected project is the existing TNGD project, inventory existing schemas/migrations/`dispatch_*` objects/Storage buckets, preserve an appropriate backup, and review the linked migration diff/lint. Existing TNGD data must not be overwritten or deleted.

## Railway Deployment Attempt

- No Railway credential or project variable was present in the environment.
- The Railway CLI was unavailable globally.
- The official CLI fallback was invoked through `npx`; it could not establish an authenticated context and could not access its home-backed configuration store.
- A signed-in Railway browser check was attempted once, but the saved browser permission denied Railway access. The denial was respected and not bypassed.
- No Railway project, service, environment, variable, domain, or deployment was created or modified.
- No HTTPS endpoint exists, so remote authentication, Supabase connectivity, tenant/RLS, persistence, Storage, and desktop/mobile delivery smoke remain deferred.

## Railway Runtime Variables

Required on the Railway PRE-LAUNCH service:

- `MASS_RUNTIME_ENV=qa`
- `MASS_DEPLOYMENT_TARGET=railway`
- `MASS_DEPLOYMENT_MODE=pre-launch-live-qa`
- `SUPABASE_URL` from the verified existing TNGD project
- `SUPABASE_PUBLISHABLE_KEY` from that project
- `SUPABASE_STORAGE_BUCKET=dispatch-media`

Railway supplies `PORT` and `RAILWAY_PUBLIC_DOMAIN`. `MASS_PUBLIC_ORIGIN` may be set explicitly after domain creation, otherwise the Railway domain is used.

Do not place service-role keys, database passwords/URLs, JWT signing secrets, bootstrap values, QA passwords, or Square secrets in browser code. Square remains sandbox/unconfigured and does not block the web candidate.

## Smallest Executive Action Required

In Railway, create or select one PRE-LAUNCH Dispatch project/service and then provide Codex an authenticated deployment path by doing either:

1. authorize the canonical `MMS-NCLP/mass-hq-nitro-4x` repository for that service; or
2. create a project-scoped Railway deployment token and expose it to the Codex execution environment as `RAILWAY_TOKEN`—not in chat—then provide the target service name/environment.

Configure the service root as:

```text
/implementation/pilot/tngd-dispatch-portal
```

and the config-file path as:

```text
/implementation/pilot/tngd-dispatch-portal/railway.json
```

Also make `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from the verified existing `top-notch-garage-doors` project available to the Railway service. Do not authorize migration until the inventory/backup check is complete.

After that single authorization/configuration action, Codex can immediately deploy, generate/identify the HTTPS domain, execute remote engineering smoke, and return the URL.

## Disposition

The Railway hosting adapter and validation evidence are complete. The candidate remains **not deployed, not Production Accepted, and not authorized for operational data or field use** pending Railway authorization and provider-backed QA.
