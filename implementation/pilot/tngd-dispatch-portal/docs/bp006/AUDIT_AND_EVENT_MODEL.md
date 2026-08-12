# BP-006 Audit and Event Model

The shared hash-chained audit records `TechnicianCapacityProfileConfigured`, `AvailabilityExceptionAdded`, `CapacityOverrideAuthorized`, and `TechnicianCapacityCalculated`, with tenant, principal, resource, permission, outcome, and summary metadata. Override events include the override identifier, effective date, governed finite non-negative integer capacity amount, and governing reason. Invalid override amounts are rejected before state or audit history can change.
