# MASS-TNGD-PILOT-001 — Approved Operational Requirements Record

## Document Control

| Field | Value |
|---|---|
| Record ID | MASS-TNGD-PILOT-001-REQ-2026-08-05 |
| Project | MASS-TNGD-PILOT-001 |
| Status | Approved Planning and Requirements Record |
| Authority | Executive Direction |
| Effective Date | 2026-08-05 |
| Manufacturing Authority | None |
| Governing Charter | [MASS-TNGD-PILOT-001 Operational Pilot Charter](MASS-TNGD-PILOT-001_TNGD_Dispatch_User_Portal_Operational_Pilot_Charter.md) |
| Governing Sequence | [MASS-TNGD-PILOT-001 Implementation Backlog](MASS-TNGD-PILOT-001_Implementation_Backlog.md) |

## 1. Purpose and Authority Boundary

This record preserves approved operational requirements for incorporation into the correct future pilot Engineering Work Orders before TNGD-BP-007 and TNGD-BP-008 are manufactured.

This record is planning and requirements authority only. It is not an Engineering Work Order, does not authorize manufacturing, does not alter dependency order, and does not expand the scope of TNGD-BP-001 or any other existing work order.

Manufacturing remains authorized only by an approved repository work order in `production/pilot/inbox`. Repository queue state and exact work-order contents govern execution.

## 2. Production Direction

- TNGD-BP-001 is the first dependency-ready pilot package.
- Only one pilot package may be active at a time.
- TNGD-BP-002 may not begin until TNGD-BP-001 is complete and submitted to `production/pilot/review`.
- Later packages shall continue in canonical inbox and dependency order.
- Stale roadmap and pilot-governance statements shall be handled as localized documentation corrections without silently rewriting authority or interrupting authorized pilot production.

## 3. Technician Diagnostic Requirements

- The technician diagnostic is named **25-Point Inspection**.
- Every diagnostic item supports exactly one status:
  - Does Not Apply
  - Pass
  - Flag
  - Fail
- The itemized status list must remain visible in the customer-facing report.
- The diagnostic report is required for **Garage Door Repair | Service**.
- The diagnostic report is optional for **New Garage Door Estimate**.
- The completed diagnostic report must support sharing and downloading.
- The completed diagnostic report should be attached to the customer invoice by default.

## 4. Photograph and Post-Job Album Requirements

- Customer photographs shall be captured once, tagged, and referenced without duplicating the underlying files.
- Authorized references may appear across:
  - diagnostic report
  - estimate
  - job record
  - invoice
  - warranty record
  - customer timeline
  - post-job album
- The post-job album should assemble relevant before, diagnostic, during, and after photographs.

## 5. Foundational Templates

The two foundational templates are:

1. **Garage Door Repair | Service**
2. **New Garage Door Estimate**

## 6. Estimate Foundation Requirements

Estimate foundations include customer, company, and estimate information plus:

- A **Service** line item describing the 25-Point Inspection and the requirement that an authorized adult aged 18 or older approve work.
- A **Warranty** line item describing the standard two-year parts warranty and 90-day service coverage.

## 7. Explicit Deferral

The detailed garage-door order form is deferred.

It shall not be introduced into the current pilot without a later approved Engineering Work Order.

## 8. Required Future Incorporation

Before TNGD-BP-007 and TNGD-BP-008 are manufactured, their approved repository work orders—or other correctly scoped prerequisite work orders—must incorporate these requirements with explicit ownership, dependencies, acceptance evidence, and source-of-truth boundaries.

No participant may manufacture these requirements directly from this record.
