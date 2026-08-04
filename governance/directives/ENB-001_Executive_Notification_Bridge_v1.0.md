# ENB-001 — Executive Notification Bridge v1.0

## Document Control

| Field | Value |
|---|---|
| Authority | Executive Direction |
| Priority | High |
| Status | Operational |
| Effective | 2026-08-04 |
| Permanent Successor | APP-001 — Executive Command Center |

## Purpose

The Executive Notification Bridge provides lightweight repository messaging and alerts the Executive when human authority is required. It detects and reports the need for Executive attention; it never exercises Executive Authority.

The repository remains the sole production authority.

## Repository Contracts

Repository messages move through:

```text
production/messages/inbox/
production/messages/processing/
production/messages/completed/
production/messages/archive/
```

Executive attention items move through:

```text
production/executive/attention/
production/executive/completed/
```

Only new files added to `production/executive/attention/` trigger notification. Routine status reports do not belong in the attention queue.

## Notification Contract

The GitHub workflow sends only:

- Priority
- Subject
- Message ID

No engineering detail, governing content, or requested decision is transmitted through the notification provider.

The workflow consumes the encrypted repository secret `IFTTT_WEBHOOK_URL`. No webhook URL or key may be committed to the repository.

## Authority Boundary

The bridge shall never:

- Authorize work.
- Accept reviews or corrections.
- Clear Executive Attention files.
- Move repository artifacts.
- Manufacture Work Orders.
- Modify production state.
- Infer Executive approval from notification delivery.

Executive Authority remains human and must act through canonical repository artifacts.

## Lifecycle

This bridge is temporary infrastructure. When APP-001 assumes production-state messaging and executive-decision routing, the workflow and external webhook shall be retired without changing the attention-request lifecycle.

## Operational Acceptance

A controlled live test completed successfully on 2026-08-04:

- One genuine test file was added to the Executive Attention queue.
- The GitHub Action executed and delivered one IFTTT notification.
- Executive Authority confirmed receipt.
- The test artifact was removed after confirmation.
- Future notifications are restricted to genuine Executive Attention items.

## Security Decision

The webhook credential supplied during briefing was exposed outside encrypted secret storage and is therefore not approved for use. Executive Operations must rotate that credential and configure the replacement full endpoint as the GitHub Actions secret `IFTTT_WEBHOOK_URL` before live delivery testing.

