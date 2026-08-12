# BP-006 Capacity Calculation Rules

Candidates must satisfy shift, service capability, distinct technician skill, service-area, travel-radius, equipment, vehicle, emergency, exception, overlap, daily-limit, and derived same-day-limit rules. Capacity calculations load the complete tenant appointment set from BP-005; callers cannot omit assignments.

Travel radius and query distance are required finite, non-negative numbers. Missing, malformed, negative, or non-finite distances are rejected before candidate calculation. Daily, same-day, and emergency limits are required finite non-negative integers, with daily capacity at least one. Override amounts are finite non-negative integers. Same-day status is derived from the requested date and governed clock, and emergency demand uses the profile's emergency daily limit.

Overlap checks use all authoritative tenant appointments. Daily enforcement and reported remaining capacity use only the technician's appointments on the requested date. All-day and partial-day PTO, blackout, training, and administrative holds block overlapping capacity windows while leaving unaffected windows available. A reasoned authorized override may add temporary capacity. Results expose availability to BP-005 and BP-007 but do not assign, route, or dispatch technicians.
