# Executive Attention Queue

This queue implements the Executive Attention contract governed by [ENB-001](../../governance/directives/ENB-001_Executive_Notification_Bridge_v1.0.md).

## States

- `attention/` — unresolved items requiring Executive judgment.
- `completed/` — items resolved through a separate canonical Executive decision artifact.

Only genuine Executive decisions belong in `attention/`. Routine reports, production summaries, and informational messages belong elsewhere.

Adding a new Markdown file to `attention/` triggers one concise external notification. Editing an existing file does not trigger another notification. The notification does not authorize, resolve, or move the item.

Use [ATTENTION_TEMPLATE.md](ATTENTION_TEMPLATE.md).

