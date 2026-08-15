# BP-011 Audit and Event Model

The shared hash chain records draft creation, finalization, payment-link creation, authentic webhook acceptance, refund requests, customer-access issuance, and reconciliation reads. Evidence includes tenant, actor/provider, invoice, immutable version or provider reference, amount where applicable, reason for refunds, timestamp, and outcome. Duplicate webhooks return their immutable receipt without duplicating financial history; audit or evidence loss is never silent.
