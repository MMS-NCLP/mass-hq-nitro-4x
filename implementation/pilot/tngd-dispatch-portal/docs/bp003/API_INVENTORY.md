# BP-003 API Inventory

All APIs are methods on `GuidedIntakeService` and require BP-001 session authorization.

| API | Permission | Result |
|---|---|---|
| `startAuthorized` | `intake.create` | Creates a tenant-keyed draft and returns question 1. |
| `answerAuthorized` | `intake.create` | Validates and autosaves only the current primary question. |
| `resumeAuthorized` | `intake.read` | Returns the saved draft and next unanswered question. |
| `attachMediaAuthorized` | `intake.create` | Stores an immutable governed photo or voice-note reference. |
| `completeAuthorized` | `intake.create` | Produces an immutable Structured Intake Record and BP-004-ready handoff envelope. |
| `getRecordAuthorized` | `intake.read` | Reads a completed record within the authorized tenant. |

The executable package currently exposes an in-process application boundary rather than an HTTP transport. Selecting routes, a server framework, or a public guided-intake API requires separate authority.
