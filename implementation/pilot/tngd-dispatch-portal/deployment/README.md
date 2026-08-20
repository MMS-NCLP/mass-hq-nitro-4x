# Pilot Deployment Boundary

The deployable unit is the complete `implementation/pilot/tngd-dispatch-portal/` package.

## Required Gate

A deployment candidate must use Node.js 22 or newer and complete:

```text
npm run check
```

## Environment Boundary

Deployment injects configuration through process environment variables documented in `.env.example`. Secrets and provider credentials must not be committed.

## Deferred Decisions

BP-000 does not select a cloud, container format, process manager, network endpoint, database, release service, or rollback provider. Provider-specific configuration requires a later authorized work order.

## BP-002 Runtime State

Customer and service-request records are currently process-local and are not durable across restarts. A deployment must not represent this boundary as durable storage until an authorized work order selects and validates a persistence provider and migration.

BP-003 guided-intake drafts, autosaved answers, media references, and completed Intake Records share this process-local limitation. Deployment must not advertise cross-process resume or restart durability until an authorized persistence implementation passes the canonical gate.

BP-011 requires deployment-managed Square credentials and webhook-verification secrets. These enter only the governed gateway environment and must never be persisted in invoice, transaction, audit, or customer-access records. Live Square and database validation remains deferred until those runtimes are explicitly configured.

Commerce Operations configuration and commercial snapshots currently share the process-local persistence boundary. Deployment must not advertise durable catalog administration until the provider-neutral Commerce Operations migration reference is implemented and validated against the selected database.

## Product Realization Boundary

The V1 browser delivery adapter is started with `npm start` and binds to loopback by default. This manufacturing phase does not authorize public hosting, TLS termination, a production session provider, or a live database connection.

The subsequent pre-launch candidate preparation adds configurable `MASS_BIND_HOST`, a checksum release manifest, security-header smoke validation, and `deployment/LIVE_QA_CANDIDATE_RUNBOOK.md`. It does not select or authorize a hosting provider and does not convert the preview bootstrap into a production session or durable operational boundary.

## Authorized Vercel + Supabase Adapter

The deployment-adapter authorization selects GitHub → Vercel → existing Dispatch Node/domain kernel → Supabase for V1. `vercel.json` and `api/index.mjs` provide the minimum static/SPA and Node-function boundary. Supabase Auth verification, authoritative tenant membership, Postgres/RLS persistence, and private governed Storage are implemented in `src/deployment` and the ordered executable migration.

The adapter remains PRE-LAUNCH / LIVE QA. External project configuration, migration execution, credential injection, HTTPS deployment, and independent live QA remain required. See `deployment/VERCEL_SUPABASE_RUNBOOK.md`.

`MASS_MEDIA_SOURCE_ROOT` selects the governed media provider root at deployment. UI components consume stable asset IDs and provider-relative source keys; deployment must not embed Google Drive, user-profile, drive-letter, or future external-drive paths. The bundled approved marks and visual references are available for presentation. The six governed TNGD media collections remain in explicit provider-unavailable fallback state until their manifest is connected and rights classifications are verified.
