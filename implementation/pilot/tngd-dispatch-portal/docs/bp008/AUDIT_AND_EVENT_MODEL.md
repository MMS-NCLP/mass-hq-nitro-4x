# BP-008 Audit and Event Model

The shared hash-chained audit captures FieldWorkSessionOpened, FieldStatusChanged, InspectionStarted, InspectionItemRecorded, FieldNoteAdded, MeasurementRecorded, DoorDetailsRecorded, MediaReferenceAttached, OperationalEvidenceConfirmed, FieldEvidenceSubmitted, DiagnosticReportShared, FieldExceptionReturned, and InspectionTemplateAvailabilityChanged.

FieldHistory independently preserves immutable session events with event ID, actor, timestamp, field status, and governed metadata. Exceptions retain their prior state and evidence revision. Submission records the immutable diagnostic report identifier. Audit events remain tenant-bound and use the shared BP-001 chain; no silent event loss is permitted.
