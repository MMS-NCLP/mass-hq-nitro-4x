# TNGD Dispatch V1 — Live QA Candidate Engineering Smoke Report

## Decision Control

| Field | Value |
|---|---|
| Starting canonical SHA | `05038d2a1ab638cbd0662fba65c0af6b94be01cd` |
| Candidate engineering commit | `229f117ed7f11839bdf9636bad41018cab89976f` |
| Branch | `codex/live-qa-candidate` |
| Posture | **PRE-LAUNCH / LIVE QA** |
| Production Accepted | **No** |
| Independent final live QA | Retained by Claude |

## Candidate Prepared

The Product Realization baseline was not reopened. A provider-neutral candidate boundary was added on top of canonical Product Realization with:

- an explicit pre-launch health contract that cannot represent deployment or Production Acceptance;
- configurable bind host and public-origin environment boundaries;
- browser security headers, including CSP frame protection, `nosniff`, no-referrer, a restrictive permissions policy, and same-origin opener isolation;
- a deterministic release manifest containing checksums and sizes for nine built browser assets;
- an engineering smoke gate for health posture, security headers, SPA history fallback, approved assets, role boundaries, and traversal rejection;
- a provider-neutral candidate runbook with hard stops against real-data or operational-use claims.

No hosting provider, TLS endpoint, production session adapter, or durable persistence provider was selected or implemented.

## Exact Validation Results

Validation was rerun against candidate commit `229f117ed7f11839bdf9636bad41018cab89976f` from `implementation/pilot/tngd-dispatch-portal`:

- `npm.cmd run check`: exit 0.
- Build: passed.
- Tests: **191 passed, 0 failed, 0 skipped, 0 cancelled**.
- Canonical validator: `Canonical BP-000 through BP-015, Commerce Operations, and Product Realization repository validation passed.`
- Static Product Realization validator: passed.
- `npm.cmd run package:live-qa`: exit 0; nine browser assets inventoried with checksum and byte-size evidence.
- `npm.cmd run smoke:live-qa`: exit 0; all six engineering checks passed.
- `git diff --check`: passed.

The smoke gate confirmed that the candidate reports `PRE-LAUNCH / LIVE QA`, reports `productionAccepted: false`, serves approved assets and role-scoped application routes, applies the required security headers, supports history routes, and rejects path traversal.

## Rendered Visual QA Disposition

Rendered browser inspection was attempted against the local candidate, but the Codex in-app browser rejected local-page access under a saved user permission setting. The permission boundary was respected and no alternative browser-control mechanism was used.

Accordingly:

- interactive rendered visual QA was **not performed**;
- responsive/device visual conformance is **not claimed**;
- no screenshot evidence is claimed;
- Claude's independent rendered and final live QA remains required.

## Deployment and Integration Boundary

No reachable HTTPS environment was produced because canonical repository authority does not select a hosting/TLS provider. The current candidate remains preview/non-live. Before it can become a live QA endpoint, authority and configuration remain required for:

- HTTPS hosting and public origin;
- production authentication and session handling;
- durable database/persistence and migration execution;
- Square credentials and webhook verification;
- calendar, maps, notification, and related provider adapters;
- media-provider inventory, rights verification, and source-root configuration;
- supported-browser/device rendered QA and independent final live acceptance.

## Disposition

The provider-neutral engineering candidate and its reproducible smoke evidence are complete. It is suitable for hosting-provider configuration and independent live QA, but it is **not deployed, not Production Accepted, and not authorized for operational data or field use**.
