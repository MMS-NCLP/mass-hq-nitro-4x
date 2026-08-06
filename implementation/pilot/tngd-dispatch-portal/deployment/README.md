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
