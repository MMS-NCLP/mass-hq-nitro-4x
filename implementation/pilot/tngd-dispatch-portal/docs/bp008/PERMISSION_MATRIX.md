# BP-008 Permission Matrix

| Role | Read assigned work | Mutate field session | Author inspection | Read administration view | Configure template | Receive shared report |
|---|---:|---:|---:|---:|---:|---:|
| Assigned Technician | Yes | Yes | Yes | No | No | Via explicit share only |
| Unassigned Technician | No | No | No | No | No | Via explicit share only |
| Dispatch Administrator | Progress/exception view | No | No | Yes | No | No |
| Manager | Progress/evidence view | No silent technician mutation | No | Yes | No | No |
| Tenant Administrator | Governed evidence view | No silent technician mutation | No | Yes | Yes | No |
| Customer | No internal access | No | No | No | No | Explicit customer-safe share only |
| Executive | Governed summaries only | No | No | No field mutation | No | No |

Technician authorization is rechecked against the BP-007 handoff for every field operation. Tenant mismatch and unassigned access are denied. Submitted evidence cannot be silently changed by any role.
