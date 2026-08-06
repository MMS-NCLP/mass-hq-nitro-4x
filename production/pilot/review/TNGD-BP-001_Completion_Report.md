# TNGD-BP-001 Completion Report

## Package

- Work order: TNGD-BP-001 — Secure Access, Roles, and Portal Separation
- Project: MASS-TNGD-PILOT-001
- Status: Manufactured — Pending Independent Acceptance
- Foundation dependency: TNGD-BP-000 in review
- Artifact baseline: `5c3c1cedbf98a3c4de991795c7144b37a1519d7e`

## Manufactured Scope

- Added tenant-scoped identities and case-normalized credential lookup.
- Added scrypt password derivation with random salts and timing-safe verification.
- Added enumeration-resistant password recovery with injected delivery, expiring single-use tokens, and session revocation.
- Added deny-by-default roles for tenant administrator, administrative dispatcher, technician, manager, and executive.
- Added tenant-mismatch rejection before role evaluation.
- Added opaque 256-bit sessions with hashed token storage, absolute expiration, validation, and logout revocation.
- Added separate public and internal portal execution gates.
- Limited the public boundary to sanitized `intake.submit` payloads.
- Added append-only, deeply immutable, SHA-256 hash-chained security audit records.
- Added an executable BP-001 capability manifest, transition record, and security contract tests.
- Preserved the BP-000 runtime, persistence, migration, environment, and deployment boundaries.
- Added no UI, HTTP server, database provider, identity provider, deployment provider, or BP-002 behavior.

## Validations Completed

Connector-backed repository validation completed against exact `main` contents:

- 13 required work-order, transition, package, source, test, build, and validation files were retrieved.
- Seven BP-001 JavaScript modules/test artifacts passed V8 syntax parsing after module-declaration normalization.
- `package.json` parsed successfully, remained private and dependency-free, and includes build, test, validate, check, and start gates.
- The package test gate includes both foundation and BP-001 security tests.
- The build gate imports the security module graph and produces a separate BP-001 capability manifest.
- Repository validation requires the complete BP-001 module and test set.
- Static control inspection confirmed password hashing, password recovery, role enforcement, tenant mismatch rejection, session revocation, public-action allowlisting, deep audit immutability, and hash-chain linkage.
- Evidence tests cover authentication failure/success, least privilege, cross-tenant denial, public/internal separation, session expiry/logout, password-reset reuse rejection, privileged-action auditing, and audit-chain verification.
- BP-002 remains unchanged and present in the inbox.

## Validations Deferred

The manufacturing environment did not provide local repository files or an executable Node.js runtime. These commands were not executed and must be run by Independent Acceptance from `implementation/pilot/tngd-dispatch-portal/`:

```text
npm run build
npm test
npm run validate
npm run check
npm start
```

No local build, test execution, deployment, rendering, persistence, browser, or end-to-end result is claimed.

## Queue State at Submission

- Inbox: TNGD-BP-002 through TNGD-BP-006 remain authorized in dependency order.
- Active: no pilot package remains active.
- Review: TNGD-BP-000 and TNGD-BP-001 work orders and completion reports.
- Done: unchanged; no package was approved or moved to done.
- Batch count: 2 of 6.
- Blockers: none for review submission.
- Next dependency-ready target: TNGD-BP-002, subject to the active manufacturing run and repository authority.

## Independent Acceptance Focus

Run `npm run check`; inspect scrypt cost and operational suitability; verify reset delivery never logs raw tokens; verify session-token transport and durable repositories before deployment; confirm role permissions match TNGD operating policy; and confirm public/internal portal routes preserve the implemented boundary when transport is added.

## TNGD-BP-001.1 Localized Correction Status

BP-001 remains Manufactured — Pending Independent Acceptance.

The localized correction authorized at head `54bc57e4414f142e4cd42fbde6440d1177878e72`:

- retained `src/security/*` and `tests/security.test.mjs` as canonical;
- removed `src/secure-access.mjs` and `tests/secure-access.test.mjs`;
- restored password recovery to foundation feature metadata;
- limited BP-002 metadata to the exact work-order responsibilities;
- added explicit tenant-key and non-discarding-audit evidence tests;
- hardened repository validation to reject discarded paths and require the reviewed scope, allowlist, audit default, and canonical test command.

The original completion baseline remains historical evidence. The corrected commit and executable validation result are recorded separately in `TNGD-BP-001.1_Localized_Correction_Report.md`.

BP-002 remains blocked until Independent Acceptance runs `npm run check` against the exact corrected commit and accepts BP-001.1.

