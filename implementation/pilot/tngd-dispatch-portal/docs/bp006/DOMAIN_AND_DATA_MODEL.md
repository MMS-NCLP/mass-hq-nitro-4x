# BP-006 Technician Availability and Capacity

BP-006 creates tenant-owned Technician Availability Profiles, Capacity Windows, Availability Exceptions, and Technician Capability Matrices. Profiles separately govern service capabilities and technician skills, recurring shifts, service areas, finite non-negative travel radii, daily and same-day workload limits, emergency daily limits, equipment, and vehicles. Daily capacity is a positive integer; same-day, emergency, and override capacities are non-negative integers.

Capacity queries carry a required finite non-negative travel distance and consume the authoritative tenant appointment set from BP-005. Target-date appointments govern daily usage and remaining capacity. Exceptions cover PTO, blackout, training, and administrative holds as either all-day or bounded intervals. Reasoned overrides are temporary, attributed, numerically governed, and recorded in the shared audit chain.
