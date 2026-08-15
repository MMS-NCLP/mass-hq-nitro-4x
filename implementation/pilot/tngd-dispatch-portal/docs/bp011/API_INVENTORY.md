# BP-011 API Inventory

| Operation | Authority | Result |
|---|---|---|
| `createDraftAuthorized` | internal `jobs.update` | tenant invoice from BP-010 approval |
| `finalizeAuthorized` | internal `jobs.update` | immutable content-hashed version |
| `createPaymentLinkAuthorized` | internal `jobs.update` | Square link reference only |
| `processWebhook` | verified Square webhook | idempotent payment evidence |
| `refundAuthorized` | exception manager | reasoned Square refund reference |
| `issueCustomerAccessAuthorized` | internal `jobs.read` | opaque transaction token |
| `customerView` | transaction token | customer-safe invoice projection |
| `reconciliationHandoffAuthorized` | internal `jobs.read` | BP-012 reference-only handoff |

No endpoint accepts or returns prohibited card credentials.
