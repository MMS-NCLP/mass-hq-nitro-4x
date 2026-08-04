# Repository Messaging Queue

This queue implements the repository messaging contract governed by [ENB-001](../../governance/directives/ENB-001_Executive_Notification_Bridge_v1.0.md).

## States

- `inbox/` — newly received repository messages.
- `processing/` — messages being handled by the addressed participant.
- `completed/` — messages whose requested action has been resolved.
- `archive/` — retained historical messages no longer active.

Moving a message records workflow state; it does not grant authority beyond the message's governing source.

## Required Contract

Every message must include:

- Message ID
- Timestamp
- From
- To
- Priority
- Subject
- Related Work Order(s)
- Related IRO/LCO
- Repository Commit
- Requested Action
- Body
- Status

Use [MESSAGE_TEMPLATE.md](MESSAGE_TEMPLATE.md). Repository timestamps and commits remain authoritative.

