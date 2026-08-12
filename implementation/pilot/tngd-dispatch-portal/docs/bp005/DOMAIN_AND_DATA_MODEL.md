# BP-005 Scheduling and Calendar Domain

BP-005 owns the governed `Appointment` lifecycle between a BP-004 Service Case and the approved calendar-provider gateway. An appointment records tenant, customer and Service Case references, UTC interval, organization time zone, calendar reference, revision evidence, and BP-006 readiness. It does not assign technicians or dispatch work.

The executable pilot uses in-memory persistence. `migrations/TNGD-BP-005_REFERENCE.md` preserves the provider-neutral persistence contract for later authorized implementation.
