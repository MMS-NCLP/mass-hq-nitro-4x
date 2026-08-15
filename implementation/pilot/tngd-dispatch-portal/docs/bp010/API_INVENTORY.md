# BP-010 API Inventory

- `POST /authorization-requests` — employee-prepared immutable presentation
- `POST /authorization-requests/{token}/decision` — governed customer transaction access
- `POST /authorization-requests/{token}/revoke`
- `POST /authorization-requests/{id}/amendments`
- `GET /authorization-requests/{token}/receipt`
- `GET /authorization-requests/{id}` and `/history`
- `GET /authorization-requests/{id}/bp011-handoff`

No invoice, payment, stored-card, warranty, or later-package execution is exposed.
