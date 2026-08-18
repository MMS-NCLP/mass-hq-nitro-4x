# TNGD-BP-015 — Domain and Data Model

## Entities

### ReportDefinition
Named grouping of metrics that constitute an operational report.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| tenantId | UUID | Tenant ownership |
| name | string | Required |
| description | string | Optional |
| metricIds | UUID[] | At least one required |
| createdAt | ISO 8601 | Immutable |
| createdBy | UUID | Actor reference |

### MetricDefinition
Business specification for a single operational measure.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| tenantId | UUID | Tenant ownership |
| name | string | Required, unique per tenant |
| businessMeaning | string | Required |
| authoritativeSource | string | Required (BP reference) |
| inclusionRules | string | Default: "all-records" |
| exclusionRules | string | Default: "none" |
| calculationMethod | enum | count, rate, sum, status-distribution |
| timeBasis | string | Required |
| freshness | string | Required |
| permittedDimensions | string[] | Validated against allowed set |
| unavailableDataBehavior | string | Required |
| createdAt | ISO 8601 | Immutable |
| createdBy | UUID | Actor reference |

### OperationalReport
A generated report instance with calculated results.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| tenantId | UUID | Tenant ownership |
| definitionId | UUID | References ReportDefinition |
| definitionName | string | Denormalized for display |
| generatedAt | ISO 8601 | Immutable |
| generatedBy | UUID | Actor reference |
| filters | ReportFilter[] | Applied filter criteria |
| results | ReportResult[] | Calculated metric results |
| sourceReferences | ReportSourceReference[] | Traceability links |
| exceptions | ReportException[] | Data quality issues |
| status | enum | generated, finalized |
| finalized | boolean | Default false |
| idempotencyKey | string | Unique per tenant |

### ReportSnapshot
Immutable point-in-time copy of a finalized report.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| tenantId | UUID | Tenant ownership |
| reportId | UUID | References OperationalReport |
| report | OperationalReport | Full frozen copy |
| finalizedAt | ISO 8601 | Immutable |
| finalizedBy | UUID | Actor reference |
| immutable | boolean | Always true |

### ReportFilter
Filter criteria applied to a report generation.

| Field | Type | Constraints |
|---|---|---|
| type | enum | date-range, status, technician, category |
| start | ISO 8601 | Required for date-range |
| end | ISO 8601 | Required for date-range |
| timezone | string | Required for date-range |
| value | string | Required for non-date-range |

### ReportResult
Calculated value for a single metric in a report.

| Field | Type | Constraints |
|---|---|---|
| metricId | UUID | References MetricDefinition |
| metricName | string | Denormalized |
| value | number/object/null | Calculated result |
| available | boolean | False if source unavailable |
| unavailableReason | string | Set when unavailable |
| calculationMethod | string | From metric definition |
| stale | boolean | True if source flagged stale |

### ReportSourceReference
Traceability link from a metric result to its source package.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| metricId | UUID | References MetricDefinition |
| metricName | string | Denormalized |
| sourcePackage | string | BP package identifier |
| asOf | ISO 8601 | Source data timestamp |
| recordCount | integer | Source record count |

### ReportException
Data quality issue discovered during report generation or recorded manually.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| tenantId | UUID | Tenant ownership |
| reportId | UUID | References OperationalReport |
| metricName | string | Optional |
| type | enum | unavailable-data, stale-data, conflicting-status, incomplete-lineage |
| detail | string | Required |
| behavior | string | From metric definition |
| recordedAt | ISO 8601 | Immutable |
| recordedBy | UUID | Actor reference (if manual) |

### ReportExport
Authorized extract of a finalized snapshot.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| tenantId | UUID | Tenant ownership |
| snapshotId | UUID | References ReportSnapshot |
| format | enum | csv, json |
| status | enum | completed |
| exportedAt | ISO 8601 | Immutable |
| exportedBy | UUID | Actor reference |
| evidence | object | Export metadata |
| idempotencyKey | string | Unique per tenant |

### ReportHistory
Audit trail for all reporting operations.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| tenantId | UUID | Tenant ownership |
| subjectId | UUID | Entity reference |
| type | string | Event type |
| actorId | UUID | Actor reference |
| data | object | Event payload |
| at | ISO 8601 | Event timestamp |

## Relationships

- ReportDefinition → MetricDefinition (many-to-many via metricIds)
- OperationalReport → ReportDefinition (many-to-one)
- ReportSnapshot → OperationalReport (one-to-one)
- ReportExport → ReportSnapshot (many-to-one)
- ReportException → OperationalReport (many-to-one)

## V1 Persistence

All entities stored in in-memory Maps per pilot standard. Production migration defined in `migrations/TNGD-BP-015_REFERENCE.md`.
