# Executive Attention Request

**Message ID:** ATTENTION-20260805-MASS-PILOT-BP001-CONCURRENT-DUPLICATE  
**Timestamp:** 2026-08-06T04:29:06Z  
**Updated At:** 2026-08-07T00:00:00Z  
**From:** Manufacturing  
**To:** Executive Authority  
**Priority:** High  
**Subject:** Concurrent commits altered the reviewed BP-001 security artifact set  
**Related Work Order(s):** TNGD-BP-001, TNGD-BP-002  
**Related IRO/LCO:** None  
**Repository Commits:** `d18e66c6046ab86c3e25b730e78df3b919808485`, `328129c02e62b5dc248312641127e5fcdfa0bfe8`, `7034e274fd16a6f7351b30f68ceefb73a889ea70`, `f45e8914a35ddee92dde62aef4bdd3171bdec5a8`  
**Requested Action:** Completed — TNGD-BP-001.2 independently accepted and BP-002 cleared  
**Status:** Resolved — BP-001.2 Accepted  

## Body

TNGD-BP-000 and TNGD-BP-001 were manufactured and submitted separately to `production/pilot/review`. The BP-001 completion report was committed at `87a01ff032e3464b1c1f9ec7fd0b45f72c3eb9a8` and declares artifact baseline `5c3c1cedbf98a3c4de991795c7144b37a1519d7e`.

A canonical-head audit found four later commits from a concurrent manufacturing sequence:

- `d18e66c6046ab86c3e25b730e78df3b919808485` added `implementation/pilot/tngd-dispatch-portal/src/secure-access.mjs`.
- `328129c02e62b5dc248312641127e5fcdfa0bfe8` added `implementation/pilot/tngd-dispatch-portal/tests/secure-access.test.mjs`.
- `7034e274fd16a6f7351b30f68ceefb73a889ea70` replaced `implementation/pilot/tngd-dispatch-portal/src/foundation.mjs`.
- `f45e8914a35ddee92dde62aef4bdd3171bdec5a8` replaced `implementation/pilot/tngd-dispatch-portal/tests/foundation.test.mjs`.

The added files overlap the reviewed BP-001 implementation under `src/security/` and `tests/security.test.mjs`, define a separate role and portal model, and are not included in the reviewed build module graph, repository validator, transition record, or completion report. The two replacements also changed reviewed foundation metadata and its tests after review submission. The current repository validator still targets the reviewed `src/security/` and `tests/security.test.mjs` artifact set and does not validate the added duplicate files.

A subsequent attempt to update the repository validation gate was rejected by the connector and was not retried. No local build, test, validation, deployment, rendering, or runtime result is claimed for the post-review commits.

Manufacturing did not delete, merge, revert, or approve either implementation. BP-001 remains in review, active remains empty, and BP-002 remains in inbox. BP-002 must not begin until repository authority restores one canonical BP-001 artifact set and Independent Acceptance validates that exact state.


## TNGD-BP-001.1 Correction Submission

Executive Authority issued a localized correction order retaining `src/security/*` and `tests/security.test.mjs` as canonical. The competing source and test files were removed, foundation metadata was corrected, validator and evidence were updated, and `npm.cmd run check` passed at exact corrected commit `ddec4663a4304aa4af0265f8b442fb8f7862bc8e` with 14 of 14 tests passing.

The correction order and report are in `production/pilot/review`. This attention remains open only for Independent Acceptance. BP-002 remains blocked and no package was moved to done.

## TNGD-BP-001.2 Correction Submission

Independent review identified two concurrency defects after BP-001.1. TNGD-BP-001.2 added atomic per-tenant bootstrap reservation and atomic per-token reset consumption without changing BP-001 architecture or BP-002 scope.

At exact corrected commit `95dcb8cf96e81058bd1173e0684be0662d3f572c`, `npm.cmd run check` completed with exit code 0: build passed, 16 of 16 tests passed, both deterministic concurrency tests passed, and canonical repository validation passed.

The correction order and report are in `production/pilot/review`. This attention remains open only for Independent Acceptance of BP-001.2. BP-002 remains blocked and no package was moved to done.

## Resolution

Independent Acceptance was completed on 2026-08-07 against exact validated commit `95dcb8cf96e81058bd1173e0684be0662d3f572c`. A fresh connector-sourced copy passed `npm.cmd run check` with exit code 0: build passed, 16 of 16 tests passed, both deterministic concurrency tests passed, and canonical repository validation passed.

The concurrency duplicate blocker is resolved. BP-002 is cleared to enter `production/pilot/active`. This update resolves the existing notice in place and does not create a duplicate Executive Attention item.