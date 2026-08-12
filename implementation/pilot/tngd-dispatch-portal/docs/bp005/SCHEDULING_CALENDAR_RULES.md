# BP-005 Scheduling and Calendar Rules

- Only a `ready-for-scheduling` BP-004 Service Case may be scheduled.
- One tenant Service Case creates one idempotent appointment and calendar event.
- Intervals are stored as UTC ISO timestamps with organization time-zone context.
- Overlapping tenant appointments are rejected; rescheduling excludes the appointment being changed.
- Calendar synchronization occurs only through the approved-provider gateway contract.
- Every schedule or reschedule action enters the shared hash-chained audit log.
- The output is `ready-for-bp006`; technician selection, dispatch, routing, and capacity are excluded.
