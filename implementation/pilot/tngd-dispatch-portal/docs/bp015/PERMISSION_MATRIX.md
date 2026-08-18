# TNGD-BP-015 — Permission Matrix

## Role-Permission Mapping

| Role | Permission | Can Do |
|---|---|---|
| tenant_admin | operations.* | All operations |
| manager | operations.* | All operations |
| admin_dispatch | operations.exceptions.manage | Generate reports, record exceptions |
| executive | operations.read | Read reports, snapshots, source refs, export status |
| technician | (none) | No reporting access |

## Operation-Permission Matrix

| Operation | Required Permission | Accessible Roles |
|---|---|---|
| defineMetricAuthorized | operations.* | tenant_admin, manager |
| createDefinitionAuthorized | operations.* | tenant_admin, manager |
| generateReportAuthorized | operations.exceptions.manage | tenant_admin, manager, admin_dispatch |
| finalizeSnapshotAuthorized | operations.* | tenant_admin, manager |
| recordExceptionAuthorized | operations.exceptions.manage | tenant_admin, manager, admin_dispatch |
| requestExportAuthorized | operations.* | tenant_admin, manager |
| listDefinitionsAuthorized | operations.read | All except technician |
| getResultsAuthorized | operations.read | All except technician |
| getSnapshotHistoryAuthorized | operations.read | All except technician |
| inspectSourceReferencesAuthorized | operations.read | All except technician |
| getExportStatusAuthorized | operations.read | All except technician |
| getHistoryAuthorized | operations.read | All except technician |

## Tenant Isolation

All operations enforce tenant boundaries. Cross-tenant report access is denied. Cross-tenant benchmarking is an explicit forbidden scope.

## Field-Level Access

No field-level role filtering in V1. All authorized users see the same result set. Role filtering controls operation access, not field visibility.
