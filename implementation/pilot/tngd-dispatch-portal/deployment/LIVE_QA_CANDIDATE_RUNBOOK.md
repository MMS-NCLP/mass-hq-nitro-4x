# MASS Dispatch V1 — Pre-Launch Live QA Candidate Runbook

## Posture

This artifact is a **PRE-LAUNCH / LIVE QA** candidate. It is not Production Accepted and must not be represented as a durable operational pilot.

## Candidate Gate

Use Node.js 22 or newer and run:

```text
npm run candidate
```

The command builds the browser artifact, executes all regression tests and validators, emits a checksum manifest, and runs the engineering smoke gate.

## Provider-Neutral Start

```text
MASS_RUNTIME_ENV=live-qa
MASS_DEPLOYMENT_TARGET=<authorized-target>
MASS_DEPLOYMENT_MODE=pre-launch-live-qa
MASS_BIND_HOST=0.0.0.0
PORT=<provider-port>
npm start
```

The hosting provider must supply HTTPS termination and must preserve the application security headers. `MASS_PUBLIC_ORIGIN`, durable `MASS_DATABASE_URL`, and `MASS_MEDIA_SOURCE_ROOT` remain configuration seams, not hardcoded paths.

## Hard Stops

- Do not expose this candidate as an operational system until production authentication/session and durable persistence are selected and validated.
- Do not load real customer, payment, credential, or job data into the preview bootstrap.
- Do not claim Square, calendar, map, notification, media-provider, restart-durability, or field-device validation without live evidence.
- Do not issue Production Accepted status; Independent Live QA owns final disposition.

## Live QA Evidence Required After Hosting Is Authorized

Record the exact URL, deployed commit, provider/build identifier, TLS result, health response, desktop/tablet/phone screenshots, keyboard/touch checks, authenticated role checks, provider configuration results, full workflow smoke, rollback result, and all deferred integrations. Redact credentials and customer-sensitive data.
