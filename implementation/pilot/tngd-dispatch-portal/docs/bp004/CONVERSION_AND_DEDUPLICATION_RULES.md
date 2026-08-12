# BP-004 Conversion and Deduplication Rules

1. Only a completed record with status `ready-for-bp004` may convert.
2. Conversion requires `customers.write`; reading source evidence also requires `intake.read`.
3. The conversion key is tenant plus intake-record identifier, making repeat conversion idempotent.
4. Customer matching uses normalized email and phone within the tenant.
5. A single matched identity is reused. Conflicting matches stop for governed stewardship; they are never silently merged.
6. Each new intake may create one new Service Case for the matched customer.
7. Intake evidence remains immutable and is retained by governed references.
8. The output is `ready-for-scheduling`; BP-005 owns actual scheduling.

