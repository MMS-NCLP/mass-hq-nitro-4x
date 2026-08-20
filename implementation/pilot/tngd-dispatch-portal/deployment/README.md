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
