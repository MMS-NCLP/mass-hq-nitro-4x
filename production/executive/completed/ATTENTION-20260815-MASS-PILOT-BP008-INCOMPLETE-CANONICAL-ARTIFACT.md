# Executive Attention Request

**Message ID:** ATTENTION-20260815-MASS-PILOT-BP008-INCOMPLETE-CANONICAL-ARTIFACT  
**Timestamp:** 2026-08-15T04:13:49Z  
**From:** Manufacturing  
**To:** Executive Authority  
**Priority:** Urgent  
**Subject:** Canonical BP-008 artifact omits required executable implementation  
**Related Work Order(s):** TNGD-BP-008, TNGD-BP-009  
**Related IRO/LCO:** TNGD-BP-008.1 — Canonical Artifact Completeness Recovery  
**Repository Commits:** `2d07a03910d07b9c6aa3b455719faa18ce115b76`, `2b9671f1fcf11be9066205c913e94b3f9b239525`, `d2af7fa35bc95d752494fb6da622ce6f5bd51c4d`  
**Requested Action:** Completed — isolated BP-008.1 recovery submitted for renewed Independent Review  
**Status:** Resolved — Canonical Artifact Restored

## Body

MPD-002 and the Pilot production record authorize BP-008 to serve provisionally as BP-009's committed predecessor only when its validated interfaces and handoff contract are committed and no architecture-critical defect exists.

A canonical `main` inventory after BP-009 activation found that BP-008 artifact commit `2d07a03910d07b9c6aa3b455719faa18ce115b76` contains BP-008 documentation plus package/build/validator edits, but omits the executable and validation files claimed by `production/pilot/review/TNGD-BP-008_Completion_Report.md`. Canonical `main` does not contain:

- `implementation/pilot/tngd-dispatch-portal/src/field-workflow/`
- `implementation/pilot/tngd-dispatch-portal/tests/field-workflow.test.mjs`
- `implementation/pilot/tngd-dispatch-portal/migrations/TNGD-BP-008_REFERENCE.md`
- the required BP-008 foundation metadata and foundation-test updates
- the required BP-007 read-only assigned-handoff listing consumed by BP-008

The completion report states that the full gate passed with 74 tests, but that result was produced from a working artifact set that is not completely present in the canonical commit. Running the documented canonical gate at current `main` therefore cannot validate the claimed BP-008 implementation and cannot provide BP-009 with its required executable diagnostic-report and handoff contracts.

## Canonical Gate Evidence

After synchronizing the local checkout to canonical commit `5220068f41b94d2414fba9a2c181b02c99b35f74`, Manufacturing ran `npm.cmd run check` from `implementation/pilot/tngd-dispatch-portal`. The gate exited with code 1 during the build step before tests or repository validation could run. Node reported `ERR_MODULE_NOT_FOUND` for `src/field-workflow/index.mjs`, imported by `scripts/build.mjs`. No passing canonical BP-008 or BP-009 validation is claimed.

BP-009 activation commit `d2af7fa35bc95d752494fb6da622ce6f5bd51c4d` was recorded before this contradiction was discovered. Manufacturing has now paused BP-009 in Active without implementing any BP-009 scope. BP-010 through BP-012 remain in Inbox and were not activated.

The missing files are preserved in a recoverable local stash created during canonical synchronization, but repository authority contains no LCO or refinement work order authorizing their restoration. Manufacturing will not reconstruct or commit them from conversational history. Executive or review authority must authorize an isolated artifact-completeness correction against verified contents, followed by the complete BP-000 through BP-008 gate at the exact corrected commit. BP-009 may resume only after that committed baseline exists and no architecture-critical defect remains.

## Resolution

Executive Authority issued TNGD-BP-008.1 at canonical authority commit `0fb58c62790b6e27a95bef8a1cd76d7b91a7b9fd`. Manufacturing compared both recovery stashes, confirmed that their tracked BP-008 blobs agreed, verified that canonical BP-008 documentation already matched the stash byte-for-byte, and found no material discrepancy with the BP-008 completion report.

Recovery commit `5a07b8fad9e83973b364dc8cc40c04b7bcd0a0c8` restores the ten exact missing or differing BP-008 files. The recovered working candidate and a separately assembled clean tree each passed the complete `npm.cmd run check` gate with 74 tests, zero failures or skips, and canonical validation through BP-008. Canonical blob inspection verified every recovered file at that commit. Module-resolution, `git diff --check`, inventory, and forbidden-scope checks passed. No BP-009 or later behavior and no detailed garage-door order form were restored.

The artifact-completeness blocker is resolved. BP-008.1 is submitted for renewed Independent Review, and BP-009 may reactivate provisionally under MPD-002.
