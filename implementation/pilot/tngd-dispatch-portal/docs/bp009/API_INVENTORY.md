# BP-009 API Inventory

- `POST /execution-records` — idempotent approved-template draft
- `POST /execution-records/{id}/recommendations`
- `POST /execution-records/{id}/line-items`
- `POST /execution-records/{id}/options`
- `POST /execution-records/{id}/versions/finalize`
- `POST /execution-records/{id}/versions/revise`
- `POST /execution-records/{id}/authorization-package` — prepares BP-010 evidence only
- `POST /execution-records/{id}/outcomes`
- `POST /execution-records/{id}/convert`
- `GET /execution-records/{id}` and `/history`

No endpoint executes customer authorization, invoicing, payment, warranty determination, or the deferred detailed order form.
