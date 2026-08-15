# BP-008 Domain and Data Model

BP-008 consumes the accepted BP-007 assigned-technician handoff and creates tenant-owned FieldWorkSession, TechnicianJobView, InspectionTemplate, InspectionItemDefinition, InspectionExecution, InspectionItemResult, FieldNote, MeasurementRecord, MediaReference, DiagnosticReport, FieldException, and FieldHistory records.

One dispatched work item may create one idempotent field session and one resumable inspection execution. Every tenant-owned relationship carries the tenant boundary. The service case, customer, appointment, and assignment remain references owned by BP-004, BP-005, and BP-007; BP-008 does not duplicate or mutate their authority.

Submitted inspection evidence and diagnostic reports are deeply immutable at the executable boundary. Provider-backed persistence shall additionally enforce immutability as described in `migrations/TNGD-BP-008_REFERENCE.md`. Media records contain asset references and metadata only, never duplicated binary content.

The detailed garage-door order form and BP-009 repair or estimate entities are not part of this model.
