# TNGD-BP-015 — Audit and Event Model

## Event Types

| Event | Trigger | Payload |
|---|---|---|
| MetricDefined | defineMetricAuthorized | name, authoritativeSource |
| DefinitionCreated | createDefinitionAuthorized | name, metricCount |
| ReportGenerated | generateReportAuthorized | definitionName, metricCount, exceptionCount |
| SnapshotFinalized | finalizeSnapshotAuthorized | snapshotId |
| ExceptionRecorded | recordExceptionAuthorized | type, detail |
| ExportRequested | requestExportAuthorized | snapshotId, format |

## Audit Integration

All events are recorded through:
1. **ReportHistory** — internal history per subject (in-memory)
2. **AuditLog.append** — system audit chain with tenantId, principalId, type, resource, action, outcome, metadata

## Audit Fields

Every AuditLog.append call includes:
- `tenantId` — tenant boundary
- `principalId` — actor who performed the action
- `type` — event type (e.g., "ReportGenerated")
- `resource` — subject entity ID
- `action` — same as type
- `outcome` — "recorded"
- `metadata` — event-specific payload

## Evidence Preservation

- Finalized snapshots preserve the complete report state at finalization time
- Export evidence records snapshot ID, format, and result count
- Source references preserve origin package and timestamp for each metric
- Data quality exceptions are preserved with full detail and recording timestamp
