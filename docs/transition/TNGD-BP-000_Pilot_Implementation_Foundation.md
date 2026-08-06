# TNGD-BP-000 — Pilot Implementation Foundation

## Document Control

| Field | Value |
|---|---|
| Package | TNGD-BP-000 |
| Project | MASS-TNGD-PILOT-001 |
| Status | Manufactured — Pending Independent Acceptance |
| Authority | Executive Authorization |
| Scope | Minimum executable foundation only |
| Canonical implementation root | `implementation/pilot/tngd-dispatch-portal/` |

## 1. Purpose

This record establishes the smallest executable repository boundary required before TNGD-BP-001. It does not implement any portal feature or alter BP-001.

## 2. Canonical Implementation Location

All TNGD pilot implementation artifacts belong under:

`implementation/pilot/tngd-dispatch-portal/`

Pilot production governance, work orders, and completion reports remain under `production/pilot/`. Architecture and transition records remain under `docs/`.

No other application source location is authorized by BP-000.

## 3. Application and Runtime Boundary

The pilot begins as one private ECMAScript-module package requiring Node.js 22 or newer. BP-000 uses only Node.js built-ins and introduces no third-party runtime or development dependency.

The package boundary owns:

- executable pilot source under `src/`;
- repository and build automation under `scripts/`;
- automated tests under `tests/`;
- ordered persistence changes under `migrations/`;
- provider-neutral deployment instructions under `deployment/`;
- generated, uncommitted build evidence under `dist/`.

BP-000 provides a foundation metadata entry point only. Network listeners, UI routes, authentication, authorization, sessions, audit behavior, tenant behavior, and public APIs are reserved for later authorized work orders.

## 4. Persistence and Migration Boundary

Runtime persistence is represented by the required `MASS_DATABASE_URL` environment boundary. BP-000 does not choose a database product, driver, ORM, schema, or hosting provider.

All future persistent changes must be introduced as ordered, immutable files under `migrations/`. A later authorized work order must define the selected persistence technology and executable migration runner before adding schema changes.

## 5. Environment Variables

The package reads configuration from the process environment. A committed `.env.example` lists names and safe placeholders only.

- Real `.env` files are ignored and must never be committed.
- Secrets must be injected by the local operator or deployment platform.
- Build and test commands require no secret values.
- `MASS_RUNTIME_ENV`, `MASS_DATABASE_URL`, and `MASS_DEPLOYMENT_TARGET` are the only foundation-level variables.
- Feature-specific variables require later work-order authority.

## 6. Commands

From `implementation/pilot/tngd-dispatch-portal/`:

- `npm run build` — validates source syntax and writes `dist/foundation-manifest.json`.
- `npm test` — runs the built-in Node test suite.
- `npm run validate` — verifies required files, directories, scripts, environment declarations, and the zero-dependency boundary.
- `npm run check` — runs build, tests, and repository validation in order.
- `npm start` — executes the metadata entry point and prints the active foundation contract.

No install step is required for BP-000 because the package has no dependencies.

## 7. Deployment Boundary

The directory `implementation/pilot/tngd-dispatch-portal/` is the single pilot deployable unit. Deployment consumes a clean repository revision, Node.js 22+, environment injection, and the successful `npm run check` gate.

BP-000 does not select a cloud, container, process manager, hostname, network topology, database, or release service. A provider-specific deployment configuration requires later authority.

## 8. Repository Validation Requirements

A candidate revision is eligible for BP-000 review only when:

1. All canonical foundation files are present.
2. `package.json` remains private and dependency-free.
3. `npm run build`, `npm test`, and `npm run validate` are available.
4. Generated output, local environments, dependencies, and coverage are ignored.
5. No BP-001 feature behavior is present.
6. No secret value is committed.
7. The work order and completion report are submitted separately to `production/pilot/review`.

## 9. Explicit Deferrals

BP-000 does not authorize or implement:

- authentication or identity providers;
- roles, permissions, or policy evaluation;
- tenant models or tenant isolation;
- sessions or tokens;
- audit storage or privileged-action logging;
- internal, technician, customer, or public portal UI;
- API routes or public-intake endpoints;
- database, ORM, schema, or migration technology;
- deployment provider or production release;
- any BP-002 or later pilot behavior.

These responsibilities remain governed by their existing work orders and dependencies.