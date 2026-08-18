# ENGINEERING WORK ORDER

## TNGD-BP-015 — Pilot Reporting and Operational Visibility

**Project:** MASS — TNGD Dispatch User Portal Operational Pilot  
**Package:** TNGD-BP-015  
**Status:** Executive Authorized — Dependency-Gated Pilot Inbox  
**Authority:** MASS-PLAN-001 → MASS-TNGD-PILOT-001 → Pilot Implementation Backlog → MPD-001 → MPD-002 → Canonical Repository

## 1. Mission

Manufacture the governed reporting and operational-visibility package for the TNGD Dispatch User Portal.

This package shall provide trustworthy operational views over the accepted pilot workflow without becoming the system of record, redefining source domains, or introducing advanced enterprise analytics.

## 2. Dependency Gate

Manufacturing may begin only when canonical, committed contracts required from the following packages are available:

- TNGD-BP-012 — Administrative Reconciliation and Exceptions;
- TNGD-BP-013 — Warranty Stewardship;
- TNGD-BP-014 — Customer Follow-Up and Relationship Flywheel.

Routine Independent Review proceeds in parallel. Only an architecture-critical defect affecting this package's active dependency chain blocks activation.

## 3. Objective

Provide authorized users with clear answers to:

- what work entered the pilot;
- where each service case is in its lifecycle;
- what is scheduled, dispatched, active, completed, or blocked;
- what estimates await authorization;
- what invoices or payments require attention;
- what reconciliation exceptions remain unresolved;
- what warranty and follow-up obligations are open;
- whether the complete dispatch loop is operationally stable.

## 4. Included Scope

### 4.1 Operational Views

Define and implement governed views for:

- intake and service-case volume;
- scheduling and dispatch status;
- technician workload and field-work completion;
- inspection and evidence completion;
- repair versus estimate progression;
- customer authorization status;
- invoice and payment status;
- reconciliation exceptions;
- warranty registrations and claims;
- customer follow-up obligations;
- end-to-end pilot-loop completion.

### 4.2 Filters and Time Windows

Support tenant-safe filtering by authorized combinations of:

- reporting date range;
- service-case status;
- job category;
- technician;
- dispatcher or administrative owner;
- exception status;
- authorization status;
- payment status;
- warranty status;
- follow-up status.

All reported timestamps and date boundaries shall use governed source records and explicit timezone handling.

### 4.3 Metrics and Definitions

Every metric shall define:

- business meaning;
- authoritative source;
- inclusion and exclusion rules;
- calculation method;
- time basis;
- freshness;
- permitted dimensions;
- unavailable-data behavior.

Minimum pilot measures include:

- new requests;
- conversion to service cases;
- scheduled appointments;
- dispatched and completed jobs;
- estimates awaiting decision;
- authorized and declined work;
- invoices issued;
- payments confirmed or unresolved;
- open reconciliation exceptions;
- active warranty obligations and claims;
- due and completed follow-ups;
- completed end-to-end dispatch loops.

### 4.4 Reporting Snapshots and Exports

Support:

- current operational summaries;
- reproducible point-in-time reporting snapshots;
- authorized detail drill-down to source identifiers;
- CSV or JSON operational export definitions;
- report-generation history;
- immutable evidence for finalized snapshots.

Exports shall respect the same tenant and role boundaries as interactive reporting.

### 4.5 Data Quality and Exceptions

Support explicit representation of:

- unavailable data;
- stale source data;
- incomplete source lineage;
- conflicting status evidence;
- excluded records;
- unresolved administrative exceptions.

The package shall not silently convert missing or uncertain evidence into successful performance.

## 5. Roles and Authorization

Minimum roles:

- Administrator;
- Dispatcher;
- Executive Viewer;
- Read-only Auditor.

Define permissions for summary access, detail access, cross-role operational views, export generation, snapshot finalization, and audit access.

No cross-tenant reporting is permitted. Sensitive customer, payment, and technician information shall be minimized according to role.

## 6. Required Data Model

At minimum, define and implement:

- ReportDefinition;
- MetricDefinition;
- OperationalReport;
- ReportSnapshot;
- ReportFilter;
- ReportResult;
- ReportSourceReference;
- ReportException;
- ReportExport;
- ReportHistory.

Tenant-owned records shall use tenant-safe keys and relationships. Finalized snapshots and their source-reference sets shall be immutable.

## 7. Required Service and API Capabilities

At minimum, provide governed operations to:

- list authorized report definitions;
- generate an operational report;
- retrieve report results;
- apply validated filters;
- finalize a report snapshot;
- retrieve snapshot history;
- inspect source references;
- record reporting exceptions;
- request an authorized export;
- retrieve export status and evidence.

All writes shall define authorization, idempotency, audit evidence, and failure behavior.

## 8. Source and Ownership Boundaries

Consume accepted source contracts from BP-002 through BP-014 without duplicating their ownership.

This package:

- reads source evidence;
- calculates defined operational measures;
- presents and exports authorized results;
- preserves traceability.

This package does not:

- mutate source records;
- schedule or dispatch work;
- change authorization or payment states;
- resolve reconciliation exceptions;
- decide warranty coverage;
- execute customer follow-up;
- replace ENG-024 Enterprise Analytics.

## 9. Security and Integrity Requirements

Manufacturing shall provide:

- tenant isolation;
- role-based field and report access;
- source-reference integrity;
- deterministic calculation rules;
- protected finalized snapshots;
- export authorization;
- audit-chain integration;
- idempotent generation where applicable;
- explicit stale and missing-data behavior;
- no hidden cross-tenant aggregation.

## 10. Explicit Exclusions

Do not implement:

- advanced analytics or predictive modeling;
- AI-generated operational conclusions;
- executive decision automation;
- cross-tenant benchmarking;
- source-system mutation;
- autonomous exception resolution;
- communication delivery;
- external BI integration;
- soft-launch execution or rollback;
- detailed garage-door order form;
- BP-016 or later behavior.

## 11. Required Tests

Include direct tests for:

- tenant isolation;
- role-limited metric and field access;
- deterministic metric calculations;
- timezone and date-boundary behavior;
- filter validation;
- source-reference traceability;
- missing and stale-data behavior;
- finalized snapshot immutability;
- export authorization;
- idempotent report generation;
- unresolved-exception representation;
- no source-record mutation;
- BP-000 through BP-014 regressions where executable;
- absence of BP-016 behavior.

## 12. Deliverables

Produce:

1. Production implementation;
2. Production Markdown;
3. Metric and Report Inventory;
4. API Inventory;
5. Data Model;
6. Migration Reference;
7. Source and Calculation Map;
8. Audit and Event Model;
9. Folder Structure;
10. Build Manifest update;
11. Revision Log update;
12. Automated tests;
13. Repository validator update;
14. Manufacturing Completion Report.

## 13. Acceptance Criteria

TNGD-BP-015 passes when:

- every measure has an authoritative source and calculation definition;
- operational views cover the complete accepted pilot loop;
- results are tenant-safe and role-appropriate;
- drill-down preserves source traceability;
- missing, stale, and conflicting evidence is visible;
- finalized snapshots are reproducible and immutable;
- exports preserve authorization boundaries;
- source domains remain unchanged;
- advanced analytics and later-package behavior remain excluded;
- the complete available validation gate passes;
- limitations and deferred provider-backed checks are reported truthfully.

## 14. Conveyor Directive

When dependency-ready:

1. Move this Work Order from `production/pilot/inbox` to `production/pilot/active`.
2. Manufacture only this authorized scope.
3. Run the complete available validation gate.
4. Commit and synchronize the artifact set.
5. Move the Work Order and Completion Report to `production/pilot/review`.
6. Continue under MPD-002 while preserving one active package and the three-work-order minimum.

**Manufacturing doctrine:** Build what we approved. Improve what we learn. Defer what we imagine.
