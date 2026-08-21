# Railway + Supabase PRE-LAUNCH / LIVE QA Runbook

## Fixed boundaries

Railway replaces only the selected web-hosting path. GitHub remains canonical, the existing Dispatch Node/domain kernel remains authoritative, and the existing `top-notch-garage-doors` Supabase project remains the sole intended backend. The Vercel adapter is preserved as validated history and an alternate provider-neutral delivery seam.

## Railway service configuration

Connect the canonical `MMS-NCLP/mass-hq-nitro-4x` repository and configure one Railway service with root directory:

```text
/implementation/pilot/tngd-dispatch-portal
```

Because Railway config-file discovery does not follow a monorepo root automatically, confirm the config-file path resolves to:

```text
/implementation/pilot/tngd-dispatch-portal/railway.json
```

The committed configuration selects Railpack, runs `npm run build`, launches `npm run start:railway`, waits on `/api/health`, and restarts only on failure. Railway injects `PORT`; the Railway server binds it on `0.0.0.0`. The native server owns static files, SPA history fallback, API routing, and the same security headers used by the prior candidate.

## Runtime environment

Set only these required application values on the Railway Live-QA service:

- `MASS_RUNTIME_ENV=qa`
- `MASS_DEPLOYMENT_TARGET=railway`
- `MASS_DEPLOYMENT_MODE=pre-launch-live-qa`
- `SUPABASE_URL` for the verified existing TNGD project
- `SUPABASE_PUBLISHABLE_KEY` for that project
- `SUPABASE_STORAGE_BUCKET=dispatch-media`

Railway injects `RAILWAY_PUBLIC_DOMAIN`; the adapter infers an HTTPS public origin from it when `MASS_PUBLIC_ORIGIN` is not explicitly set. Do not put `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, bootstrap values, database passwords, JWT signing secrets, or Square secrets in browser code. The service-role/database values are required only in the controlled migration/bootstrap shell.

## Existing Supabase project verification

Before any database write:

1. Open the existing `top-notch-garage-doors` Supabase project.
2. Confirm its project reference matches the URL/key selected for Railway.
3. Inventory existing schemas, migration history, `dispatch_*` tables, and the `dispatch-media` bucket.
4. Take the provider-supported backup/snapshot appropriate to the plan.
5. Run a linked migration diff/lint and inspect it before `supabase db push`.

The ordered migration is additive: it creates `dispatch_*` objects, enables their RLS policies, and creates or secures the `dispatch-media` bucket. It must not be applied if existing objects with the same names have incompatible ownership or semantics. Never delete or overwrite existing TNGD data to make the migration pass.

## Deployment paths

Preferred GitHub path: connect the repository and branch in Railway after its GitHub authorization succeeds, then deploy the configured service root.

CLI fallback: install/authenticate the official Railway CLI, link the approved project/service/environment, and from `implementation/pilot/tngd-dispatch-portal` run:

```text
railway up . --path-as-root --ci
railway domain
```

`railway up` does not create a public domain by itself; generate or attach the HTTPS domain before smoke validation.

## Engineering smoke

After a domain exists, set `MASS_SMOKE_ORIGIN` only in the validation shell and run:

```text
npm run smoke:railway
```

Without QA credentials, the gate verifies HTTPS health posture, static assets, SPA/history delivery, and unauthenticated rejection. With approved `MASS_QA_USER_EMAIL`, `MASS_QA_USER_PASSWORD`, and tenant IDs, it additionally verifies Supabase authentication, authoritative membership, and cross-tenant rejection. Set `MASS_QA_PERSISTENCE_SMOKE=true` only when creation of a clearly labeled `qa-smoke` aggregate is authorized.

Do not print credential values or preserve QA passwords after validation. Rendered desktop/mobile inspection remains a separate evidence gate.

## Rollback

- Railway: retain the prior healthy deployment, then use Railway rollback/redeploy controls if the new candidate fails.
- Supabase: applied shared migrations remain immutable. Restore only through an approved provider recovery procedure or a reviewed forward correction; never destructively edit the applied migration.
- Storage: do not delete governed objects during a web rollback.
- Credentials: rotate any credential suspected of disclosure and redeploy the reviewed commit.

## Executive gate

If automated deployment is unavailable, the smallest required operator action is:

1. create or select the Railway project/service;
2. authorize the canonical GitHub repository or provide an authenticated Railway CLI session/project token;
3. set the service root and config-file path shown above;
4. add the non-secret-named Railway runtime variables using values from the verified existing Supabase project;
5. authorize the additive migration only after the existing-project inventory/backup check.
