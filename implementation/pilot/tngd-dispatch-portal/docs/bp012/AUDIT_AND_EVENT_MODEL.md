# BP-012 Audit and Event Model

All administrative reconciliation events are appended to the shared `AuditLog` with `action: "operations.reconciliation"` and `resource: "reconciliation:{reviewId}"`.

## Event Types

| Event | Trigger |
|---|---|
| `CompletionReviewQueued` | Service case queued for reconciliation |
| `CompletionReviewStarted` | Review transitioned to in-review |
| `EvidenceChecked` | Evidence category verified or flagged |
| `OperationalExceptionCreated` | Exception created with category and priority |
| `ExceptionAssigned` | Exception assigned to responsible role |
| `ExceptionReturned` | Assigned exception returned with reason |
| `ExceptionEscalated` | Exception escalated with immutable record |
| `ExceptionResolved` | Exception resolved with decision (self-approval prevented) |
| `ExceptionReopened` | Resolved exception reopened with new decision |
| `CompletionReviewCompleted` | Review completed (all exceptions resolved) |
| `ReconciliationDifferenceRecorded` | MASS vs external difference recorded |
| `ReconciliationHandoffCreated` | Outcome handed to BP-013 or BP-014 |

## History Structure

Each review maintains an append-only history array. Exception lifecycle events (assignment, escalation, resolution) are recorded against the parent review. Escalation and resolution records are individually immutable with `Object.freeze`.
