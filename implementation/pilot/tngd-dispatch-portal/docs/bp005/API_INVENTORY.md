# BP-005 API Inventory

| Operation | Permission | Result |
|---|---|---|
| `scheduleAuthorized` | `scheduling.manage` | Idempotently creates and synchronizes an appointment |
| `rescheduleAuthorized` | `scheduling.manage` | Conflict-checks and revises an existing appointment |
| `getAuthorized` | `customers.read` | Returns a tenant-scoped appointment |

`CalendarGateway.createEvent` and `updateEvent` are outbound provider contracts. The in-memory adapter is deterministic test evidence, not an external-provider selection.
