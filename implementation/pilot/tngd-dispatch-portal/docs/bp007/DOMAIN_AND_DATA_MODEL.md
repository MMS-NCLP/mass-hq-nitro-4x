# BP-007 Dispatch Domain and Data Model

BP-007 owns Dispatch Work Items, Assignment Recommendations, Technician Assignments, immutable Assignment History, Dispatch Exceptions, and Technician Handoffs. It consumes BP-005 appointments and BP-006 capacity without duplicating either subsystem. The lifecycle is Unassigned → Recommended → Assigned → Dispatched, with governed return, reassignment, cancellation, and exception paths.
