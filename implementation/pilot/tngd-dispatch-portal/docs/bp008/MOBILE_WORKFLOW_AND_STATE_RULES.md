# BP-008 Mobile Workflow and State Rules

The governed lifecycle is:

```text
Ready for Field Execution -> En Route -> Arrived -> In Progress
                                      -> Paused -> In Progress
                                      -> Field Complete -> Submitted
```

Transitions are explicit, assigned-technician-only, tenant-bound, audited, and idempotent when the requested state is already current. Submission occurs only through the evidence validator; a direct transition to Submitted is unavailable.

Today shows assigned handoffs on the governed current date. Current shows an active En Route, Arrived, In Progress, Paused, or Field Complete session. Next shows the first future Ready for Field Execution handoff. Views consume BP-007 assignments and never create or alter assignment.

Opening a handoff, resuming an inspection, repeating a current transition, attaching the same asset reference, and repeating submission return the existing record. This supports resumable mobile work without claiming offline synchronization or live collaborative editing.

A field exception preserves the prior state and evidence revision, returns the issue to administrative visibility, and does not close or mutate the BP-004 Service Case.
