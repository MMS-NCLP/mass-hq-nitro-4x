# TNGD Pilot Package Sequence Reconciliation 001

## Document Control

| Field | Value |
|---|---|
| Record ID | TNGD-PILOT-PACKAGE-SEQUENCE-RECONCILIATION-001 |
| Status | Executive Approved |
| Effective Date | 2026-08-14 |
| Scope | Pilot package numbering and ownership reconciliation |

## Finding

The original Pilot Implementation Backlog assigned Dispatch Board and Technician Handoff to BP-006 and Mobile Technician Workflow to BP-007. During governed manufacturing, the operational dependency was deliberately decomposed into:

- BP-006 — Technician Availability and Capacity
- BP-007 — Route Optimization, Technician Assignment, and Dispatch Board

Both packages received explicit repository work orders, manufacturing, validation, and review gates. The original backlog was not updated when this decomposition occurred, creating identifier drift for later packages.

## Decision

The accepted BP-006 baseline and active BP-007 package retain their identifiers. Remaining unmanufactured packages move forward by one identifier:

| Package | Reconciled title |
|---|---|
| BP-008 | Mobile Technician Workflow and 25-Point Inspection |
| BP-009 | Repair and Estimate Execution |
| BP-010 | Customer Authorization Evidence |
| BP-011 | Invoice and Square Payment Integration |
| BP-012 | Administrative Reconciliation and Exceptions |
| BP-013 | Warranty Stewardship |
| BP-014 | Customer Follow-Up and Relationship Flywheel |
| BP-015 | Operational Reporting and Owner Visibility |
| BP-016 | Soft-Launch Verification, Migration, and Rollback |

No capability is removed, merged, or reduced. Historical work orders and accepted evidence are not renamed.

## Requirements Placement

The approved operational requirements dated 2026-08-05 attach as follows:

- BP-008 owns the mobile technician experience, 25-Point Inspection, Does Not Apply/Pass/Flag/Fail evidence, photographs, sharing, and downloading.
- BP-009 owns the Garage Door Repair | Service and New Garage Door Estimate execution templates, estimate foundations, standard warranty/service line items, and conversion behavior.
- Invoice attachment and reuse of diagnostic photographs are consumed later by BP-011 without duplicating BP-008 evidence.
- The detailed garage-door order form remains deferred.

## Manufacturing Boundary

This reconciliation does not authorize manufacturing. Every package still requires an approved Engineering Work Order in `production/pilot/inbox`.
