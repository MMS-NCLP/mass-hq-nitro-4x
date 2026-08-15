# BP-011 Domain and Data Model

MASS owns tenant-keyed `Invoice`, immutable `InvoiceVersion`, `InvoiceLineItem`, reference-only `InvoiceAttachmentReference`, `PaymentIntentReference`, `PaymentTransactionReference`, `PaymentWebhookReceipt`, `RefundReference`, `ReceiptReference`, `PaymentException`, and `FinancialHistory`. Square owns payment processing. Every relationship includes tenant identity; finalized versions and accepted provider evidence are append-only.

Amounts are safe integer cents. Invoice totals are `subtotal + tax - discount + signed adjustments`; deposits cannot exceed total. Full card numbers, CVV/CVC, magnetic-stripe/track data, and PAN values are prohibited.
