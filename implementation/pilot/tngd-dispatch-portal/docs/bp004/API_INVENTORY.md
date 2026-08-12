# BP-004 API Inventory

| Operation | Permission | Result |
|---|---|---|
| `convertAuthorized` | `customers.write` + source `intake.read` | Customer, Service Case, Timeline, evidence references, BP-005 handoff |
| `getCustomerAuthorized` | `customers.read` | Tenant-owned Customer Record or null |
| `getServiceCaseAuthorized` | `customers.read` | Tenant-owned Service Case or null |
| `getTimelineAuthorized` | `customers.read` | Tenant-owned initial Customer Timeline or null |

No HTTP transport, scheduling endpoint, database provider, or external integration is introduced.

