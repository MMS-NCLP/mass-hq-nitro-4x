# BP-004 Permission, Audit, and Event Model

- Conversion requires `customers.write` and consumes the BP-003 source through `intake.read`.
- Customer, case, and timeline reads require `customers.read`.
- Every lookup and conversion remains tenant-keyed.
- Successful conversion emits the hash-chained audit event `IntakeConvertedToCustomerAndServiceCase`.
- Event metadata records source intake, customer, match outcome, and the BP-005 target without scheduling anything.

