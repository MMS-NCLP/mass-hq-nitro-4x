# TNGD-BP-015 — API Inventory

## Write Operations (7)

| Operation | Permission | Description |
|---|---|---|
| defineMetricAuthorized | operations.* | Define a metric with business specification |
| createDefinitionAuthorized | operations.* | Create a report definition grouping metrics |
| generateReportAuthorized | operations.exceptions.manage | Generate a report with source data and filters |
| finalizeSnapshotAuthorized | operations.* | Finalize a report as immutable snapshot |
| recordExceptionAuthorized | operations.exceptions.manage | Record a data quality exception |
| requestExportAuthorized | operations.* | Request an export of a finalized snapshot |
| (getHistoryAuthorized) | operations.read | Retrieve audit history for a subject |

## Read Operations (5)

| Operation | Permission | Description |
|---|---|---|
| listDefinitionsAuthorized | operations.read | List all report definitions |
| getResultsAuthorized | operations.read | Get report results |
| getSnapshotHistoryAuthorized | operations.read | List finalized snapshots |
| inspectSourceReferencesAuthorized | operations.read | Inspect source-reference traceability |
| getExportStatusAuthorized | operations.read | Get export status and evidence |

## Forbidden Scope Stubs (8)

| Stub | Error |
|---|---|
| predictiveModelAuthorized | BP-015 does not perform predictive modeling |
| aiConclusionAuthorized | BP-015 does not generate AI conclusions |
| automateDecisionAuthorized | BP-015 does not automate executive decisions |
| crossTenantBenchmarkAuthorized | BP-015 does not benchmark across tenants |
| mutateSourceAuthorized | BP-015 does not mutate source records |
| autonomousResolutionAuthorized | BP-015 does not resolve exceptions autonomously |
| deliverCommunicationAuthorized | BP-015 does not deliver communications |
| externalBiAuthorized | BP-015 does not integrate with external BI systems |

## Idempotency

- generateReportAuthorized: via idempotencyKey per tenant
- requestExportAuthorized: via idempotencyKey per tenant

## Audit Events

All write operations emit audit events via AuditLog.append with tenantId, principalId, type, resource, action, outcome, and metadata.
