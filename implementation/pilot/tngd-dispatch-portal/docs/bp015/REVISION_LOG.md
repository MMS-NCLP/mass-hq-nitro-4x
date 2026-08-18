# TNGD-BP-015 — Revision Log

## V1.0 — Initial Manufacturing

- **Date:** 2026-08-18
- **Authority:** TNGD-BP-015 Work Order
- **Changes:** Initial implementation of Pilot Reporting and Operational Visibility
  - 10 entities: ReportDefinition, MetricDefinition, OperationalReport, ReportSnapshot, ReportFilter, ReportResult, ReportSourceReference, ReportException, ReportExport, ReportHistory
  - 7 write operations, 6 read operations, 8 forbidden scope stubs
  - 13 pilot metrics covering BP-002 through BP-014
  - 4 calculation methods: count, rate, sum, status-distribution
  - 2 export formats: CSV, JSON
  - Deterministic metric calculations
  - Point-in-time snapshot finalization
  - Source-reference traceability
  - Explicit missing, stale, and conflicting data representation
  - In-memory V1 persistence
- **Limitations:** V1 in-memory persistence; production Supabase migration deferred per pilot standard
