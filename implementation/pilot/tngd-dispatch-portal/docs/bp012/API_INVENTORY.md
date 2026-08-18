# BP-012 API Inventory

| Method | Operation | Permission |
|---|---|---|
| `queueForReviewAuthorized` | Queue a completed service case for reconciliation | `operations.exceptions.manage` |
| `beginReviewAuthorized` | Transition review from pending to in-review | `operations.exceptions.manage` |
| `checkEvidenceAuthorized` | Verify or flag upstream evidence category | `operations.exceptions.manage` |
| `createExceptionAuthorized` | Create a categorized operational exception | `operations.exceptions.manage` |
| `assignExceptionAuthorized` | Assign exception to a responsible role | `operations.exceptions.manage` |
| `returnExceptionAuthorized` | Return assigned exception to responsible role | `operations.exceptions.manage` |
| `escalateExceptionAuthorized` | Escalate with immutable record | `operations.exceptions.manage` |
| `resolveExceptionAuthorized` | Resolve with evidence and reason (self-approval prevention) | `operations.exceptions.manage` |
| `reopenExceptionAuthorized` | Reopen through new immutable decision | `operations.exceptions.manage` |
| `completeReviewAuthorized` | Complete review (blocked by unresolved exceptions) | `operations.exceptions.manage` |
| `recordDifferenceAuthorized` | Record MASS vs external reconciliation difference | `operations.exceptions.manage` |
| `createHandoffAuthorized` | Create BP-013 or BP-014 handoff | `operations.exceptions.manage` |
| `outstandingAuthorized` | View unresolved reviews and exceptions with age | `operations.read` |
| `getReviewAuthorized` | Read one completion review | `operations.read` |
| `listReviewsAuthorized` | List tenant completion reviews | `operations.read` |
| `getExceptionAuthorized` | Read one exception | `operations.read` |
| `listExceptionsAuthorized` | List tenant exceptions | `operations.read` |
| `exceptionHistoryAuthorized` | Read exception assignments, escalations, resolutions | `operations.read` |
| `historyAuthorized` | Read immutable review history | `operations.read` |

All write operations require `operations.exceptions.manage`. Read operations require `operations.read`. Both are satisfied by `manager` (`operations.*`) and `tenant_admin` (`operations.*`). The `admin_dispatch` role has `operations.exceptions.manage` for write access. The `executive` role has `operations.read` for read access. Technicians have no reconciliation access.
