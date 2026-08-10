# Queue Historical Movement Map

## Report Control

| Field | Value |
|---|---|
| Report Date | 2026-08-10 |
| Authority | ED-6, Executive Follow-Up PRR-001 |
| Purpose | Exact source, destination, and affected references for every proposed historical move |
| Status | Read-only — no moves authorized without explicit Executive approval |

---

## Platform Conveyor (production/review/ → production/done/)

### Group 1: APP-014 V03-V04 Batch

**Review disposition:** IRO-003 — Revisions Required → LCO-003 applied → Accepted

| # | Source | Proposed Destination | References |
|---|---|---|---|
| 1 | `production/review/EWO-MASS-APP-014-V03.md` | `production/done/APP-014/EWO-MASS-APP-014-V03.md` | Cited by V03 Completion Report |
| 2 | `production/review/EWO-MASS-APP-014-V04.md` | `production/done/APP-014/EWO-MASS-APP-014-V04.md` | Cited by V04 Completion Report |
| 3 | `production/review/EWO-MASS-APP-014-V03_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V03_Completion_Report.md` | References V03 work order |
| 4 | `production/review/EWO-MASS-APP-014-V04_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V04_Completion_Report.md` | References V04 work order |
| 5 | `production/review/BATCH-APP-014-V03-V04_Combined_Report.md` | `production/done/APP-014/BATCH-APP-014-V03-V04_Combined_Report.md` | References V03 and V04 |
| 6 | `production/review/LCO-003_Completion_Report.md` | `production/done/APP-014/LCO-003_Completion_Report.md` | References V03 and V04 corrections |

**Prerequisite:** Verify IRO-003 acceptance record exists. If no formal IRO document exists in the repo, one should be created before moving.

### Group 2: APP-014 V08-V09 Batch

**Review disposition:** IRO-004 — needs verification of final disposition

| # | Source | Proposed Destination | References |
|---|---|---|---|
| 7 | `production/review/EWO-MASS-APP-014-V08.md` | `production/done/APP-014/EWO-MASS-APP-014-V08.md` | Cited by V08 Completion Report |
| 8 | `production/review/EWO-MASS-APP-014-V09.md` | `production/done/APP-014/EWO-MASS-APP-014-V09.md` | Cited by V09 Completion Report |
| 9 | `production/review/EWO-MASS-APP-014-V08_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V08_Completion_Report.md` | References V08 work order |
| 10 | `production/review/EWO-MASS-APP-014-V09_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V09_Completion_Report.md` | References V09 work order |
| 11 | `production/review/BATCH-APP-014-V08-V09_Combined_Report.md` | `production/done/APP-014/BATCH-APP-014-V08-V09_Combined_Report.md` | References V08 and V09 |

**Prerequisite:** Confirm IRO-004 final disposition. Session "MASS HQ Enterprise Constitution" (5578fc38) was performing IRO-004 when context was compacted. Need to verify whether it concluded with ACCEPTED or REVISIONS REQUIRED.

### Group 3: APP-014 V10-V13 Batch

**Review disposition:** Needs verification — no IRO document found in production/review/

| # | Source | Proposed Destination | References |
|---|---|---|---|
| 12 | `production/review/EWO-MASS-APP-014-V10.md` | `production/done/APP-014/EWO-MASS-APP-014-V10.md` | — |
| 13 | `production/review/EWO-MASS-APP-014-V11.md` | `production/done/APP-014/EWO-MASS-APP-014-V11.md` | — |
| 14 | `production/review/EWO-MASS-APP-014-V12.md` | `production/done/APP-014/EWO-MASS-APP-014-V12.md` | — |
| 15 | `production/review/EWO-MASS-APP-014-V13.md` | `production/done/APP-014/EWO-MASS-APP-014-V13.md` | — |
| 16 | `production/review/EWO-MASS-APP-014-V10_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V10_Completion_Report.md` | — |
| 17 | `production/review/EWO-MASS-APP-014-V11_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V11_Completion_Report.md` | — |
| 18 | `production/review/EWO-MASS-APP-014-V12_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V12_Completion_Report.md` | — |
| 19 | `production/review/EWO-MASS-APP-014-V13_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V13_Completion_Report.md` | — |
| 20 | `production/review/BATCH-APP-014-V10-V12_Production_Pause_Report.md` | `production/done/APP-014/BATCH-APP-014-V10-V12_Production_Pause_Report.md` | — |
| 21 | `production/review/BATCH-APP-014-V10-V13_Consolidated_Manufacturing_Report.md` | `production/done/APP-014/BATCH-APP-014-V10-V13_Consolidated_Manufacturing_Report.md` | — |

**Prerequisite:** Locate and verify review/acceptance record for V10-V13. No IRO document exists in production/review/ for this batch. Must confirm acceptance before moving.

### Group 4: APP-014 V14-V17 Batch

**Review disposition:** IRO-007 — Accepted (V14, V16, V17); V15 accepted with LCO-007-A pending

| # | Source | Proposed Destination | Condition | References |
|---|---|---|---|---|
| 22 | `production/review/EWO-MASS-APP-014-V14.md` | `production/done/APP-014/EWO-MASS-APP-014-V14.md` | Ready | IRO-007 Accepted |
| 23 | `production/review/EWO-MASS-APP-014-V14_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V14_Completion_Report.md` | Ready | — |
| 24 | `production/review/EWO-MASS-APP-014-V15.md` | **HOLD** | LCO-007-A pending | IRO-007 |
| 25 | `production/review/EWO-MASS-APP-014-V15_Completion_Report.md` | **HOLD** | LCO-007-A pending | — |
| 26 | `production/review/EWO-MASS-APP-014-V16.md` | `production/done/APP-014/EWO-MASS-APP-014-V16.md` | Ready | IRO-007 Accepted |
| 27 | `production/review/EWO-MASS-APP-014-V16_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V16_Completion_Report.md` | Ready | — |
| 28 | `production/review/EWO-MASS-APP-014-V17.md` | `production/done/APP-014/EWO-MASS-APP-014-V17.md` | Ready | IRO-007 Accepted |
| 29 | `production/review/EWO-MASS-APP-014-V17_Completion_Report.md` | `production/done/APP-014/EWO-MASS-APP-014-V17_Completion_Report.md` | Ready | — |
| 30 | `production/review/BATCH-APP-014-V14-V17_Consolidated_Manufacturing_Report.md` | `production/done/APP-014/BATCH-APP-014-V14-V17_Consolidated_Manufacturing_Report.md` | Ready | — |
| 31 | `production/review/IRO-007_APP-014-V14-V17_Implementation_Review.md` | `production/done/APP-014/IRO-007_APP-014-V14-V17_Implementation_Review.md` | Ready | Governs Group 4 |

### Group 5: APP-015 V01

**Review disposition:** IRO-008 — Accepted with LCO-008-A/B/C pending

| # | Source | Proposed Destination | Condition | References |
|---|---|---|---|---|
| 32 | `production/review/EWO-MASS-APP-015-V01.md` | **HOLD** | LCO-008-A/B/C pending | IRO-008 |
| 33 | `production/review/EWO-MASS-APP-015-V01_Completion_Report.md` | **HOLD** | LCO-008-A/B/C pending | — |
| 34 | `production/review/IRO-008_APP-015-V01_Implementation_Review.md` | **HOLD** | LCO-008-A/B/C pending | Governs Group 5 |

### Group 6: Cross-Cutting Reports

| # | Source | Proposed Destination | Condition |
|---|---|---|---|
| 35 | `production/review/LCO-004-LCO-005-LCO-006_Consolidated_Completion_Report.md` | `production/done/APP-014/LCO-004-LCO-005-LCO-006_Consolidated_Completion_Report.md` | Moves with accepted APP-014 packages |
| 36 | `production/review/ENB-001_Implementation_Report.md` | `production/done/ENB-001_Implementation_Report.md` | Verify acceptance status |

### Session Reports (Do NOT Move)

These remain in `production/review/` as session records:

| # | File | Reason |
|---|---|---|
| 37 | `PRODUCTION_STATE_REPORT_2026-08-09.md` | Session record |
| 38 | `PROVENANCE_AND_RECONCILIATION_REPORT_2026-08-10.md` | Session record |
| 39 | `ED-PRR-001_EXECUTIVE_DISPOSITION_RESPONSE.md` | Session record |
| 40 | `NC-LOCAL-PRO-PROJECT_ARCHIVE_REPORT_2026-08-10.md` | Session record |
| 41 | `EWO-MASS-001_IDENTIFIER_RECONCILIATION_2026-08-10.md` | Session record |
| 42 | `QUEUE_HISTORICAL_MOVEMENT_MAP_2026-08-10.md` | This document |

---

## Pilot Conveyor (production/pilot/review/ → production/pilot/done/)

### Group 7: BP-000

**Disposition:** Accepted

| # | Source | Proposed Destination | References |
|---|---|---|---|
| 43 | `production/pilot/review/TNGD-BP-000_Pilot_Implementation_Foundation.md` | `production/pilot/done/TNGD-BP-000_Pilot_Implementation_Foundation.md` | — |
| 44 | `production/pilot/review/TNGD-BP-000_Completion_Report.md` | `production/pilot/done/TNGD-BP-000_Completion_Report.md` | — |

### Group 8: BP-001

**Disposition:** Accepted (after LCO-001.1 and LCO-001.2 applied)

| # | Source | Proposed Destination | References |
|---|---|---|---|
| 45 | `production/pilot/review/TNGD-BP-001_Secure_Access_Roles_and_Portal_Separation.md` | `production/pilot/done/TNGD-BP-001_Secure_Access_Roles_and_Portal_Separation.md` | — |
| 46 | `production/pilot/review/TNGD-BP-001_Completion_Report.md` | `production/pilot/done/TNGD-BP-001_Completion_Report.md` | — |
| 47 | `production/pilot/review/TNGD-BP-001.1_Localized_Correction_Order.md` | `production/pilot/done/TNGD-BP-001.1_Localized_Correction_Order.md` | — |
| 48 | `production/pilot/review/TNGD-BP-001.1_Localized_Correction_Report.md` | `production/pilot/done/TNGD-BP-001.1_Localized_Correction_Report.md` | — |
| 49 | `production/pilot/review/TNGD-BP-001.2_Localized_Correction_Order.md` | `production/pilot/done/TNGD-BP-001.2_Localized_Correction_Order.md` | — |
| 50 | `production/pilot/review/TNGD-BP-001.2_Localized_Correction_Report.md` | `production/pilot/done/TNGD-BP-001.2_Localized_Correction_Report.md` | — |
| 51 | `production/pilot/review/TNGD-BP-001.2_Independent_Acceptance.md` | `production/pilot/done/TNGD-BP-001.2_Independent_Acceptance.md` | — |

---

## Executive Attention

| # | Source | Proposed Destination | Status |
|---|---|---|---|
| 52 | `production/executive/attention/ATTENTION-20260805-MASS-PILOT-BP001-CONCURRENT-DUPLICATE.md` | `production/executive/completed/ATTENTION-20260805-MASS-PILOT-BP001-CONCURRENT-DUPLICATE.md` | Verify resolution status before moving |

Already in `completed/`:
- `ATTENTION-20260805-MASS-PILOT-BP001-IMPLEMENTATION-AUTHORITY.md`
- `ATTENTION-20260805-MASS-PILOT-QUEUE-VERIFICATION.md`

---

## Summary

| Category | Total Items | Ready to Move | On Hold (LCO pending) | Needs Verification |
|---|---|---|---|---|
| APP-014 V03-V04 | 6 | 6 | 0 | IRO-003 acceptance |
| APP-014 V08-V09 | 5 | 0 | 0 | IRO-004 disposition |
| APP-014 V10-V13 | 10 | 0 | 0 | No IRO found |
| APP-014 V14-V17 | 10 | 8 | 2 (LCO-007-A) | 0 |
| APP-015 V01 | 3 | 0 | 3 (LCO-008-A/B/C) | 0 |
| Cross-cutting | 2 | 1 | 0 | ENB-001 status |
| Session reports | 6 | 0 (stay) | 0 | 0 |
| Pilot BP-000 | 2 | 2 | 0 | 0 |
| Pilot BP-001 | 7 | 7 | 0 | 0 |
| Executive attention | 1 | 0 | 0 | Resolution status |
| **Total** | **52** | **24** | **5** | **4 groups** |

## Execution Rules

1. All moves are `git mv` operations preserving git history
2. Destination directories created as needed (e.g., `production/done/APP-014/`)
3. Each group moved as a unit — no partial group moves
4. Cross-references verified before each move
5. Groups with pending LCOs remain in `review/` until LCOs are applied and verified
6. Groups with unverified acceptance remain in `review/` until disposition is confirmed
7. No move executes without explicit Executive authorization for that group

---

*End of Queue Historical Movement Map.*
