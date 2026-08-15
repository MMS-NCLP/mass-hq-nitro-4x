# BP-008 API Inventory

| Operation | Permission boundary | Purpose |
|---|---|---|
| `listJobsAuthorized` | assigned technician handoff | Today, current, or next assigned-job view |
| `openAuthorized` | assigned technician handoff | Open one idempotent Field Work Session |
| `transitionAuthorized` | assigned technician handoff | En route, arrival, work, pause/resume, and field-complete transitions |
| `startInspectionAuthorized` | assigned technician handoff | Create or resume one inspection execution |
| `recordItemAuthorized` | assigned technician handoff | Record exactly one governed result per component |
| `addNoteAuthorized` | assigned technician handoff | Add internal or customer-visible note |
| `addMeasurementAuthorized` | assigned technician handoff | Add governed measurement |
| `recordDoorDetailsAuthorized` | assigned technician handoff | Capture quantity, spring, size, type, and ground condition |
| `attachMediaReferenceAuthorized` | assigned technician handoff | Attach before, diagnostic, or after image reference |
| `confirmOperationalEvidenceAuthorized` | assigned technician handoff | Confirm warranty disclosure and referral card |
| `submitAuthorized` | assigned technician handoff | Validate and immutably submit field evidence |
| `diagnosticReportAuthorized` | assigned technician handoff | Read the customer-safe report representation |
| `shareDiagnosticReportAuthorized` | assigned technician handoff | Create an explicit customer-safe share grant |
| `sharedDiagnosticReport` | explicit share token | Read only an explicitly shared report |
| `downloadDiagnosticReportAuthorized` | assigned technician handoff | Download the report representation |
| `addExceptionAuthorized` | assigned technician handoff | Return a field exception to administration |
| `administrativeViewAuthorized` | `jobs.read` | Read progress, evidence, exceptions, and history |
| `setTemplateAvailabilityAuthorized` | tenant administrator | Configure tenant template availability |
| `historyAuthorized` | assigned technician handoff | Read immutable field history |

These executable service operations implement the work order's HTTP inventory without selecting an HTTP framework or deployment provider.
