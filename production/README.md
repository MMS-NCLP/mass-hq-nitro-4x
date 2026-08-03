# MASS Production Line

This folder is the shared production queue for ChatGPT, Codex, Claude, and Davon.

## Queue

- inbox - approved work orders ready for Codex
- active - work orders currently being manufactured
- review - completed work awaiting review or localized revision
- done - accepted work orders and completion reports
- backlog - future ideas and deferred work; never manufacture directly

## Operating Flow - Version 1.2

1. Approved work orders are placed in production/inbox.
2. Codex selects work orders in filename order.
3. For each work order, Codex records it in active, manufactures it, validates it, commits it, and places its completion report in review.
4. Codex continues through four work orders in filename order.
5. After exactly four work orders are completed, Codex submits one consolidated four-work-order report.
6. Codex pauses for revision approval before processing additional inbox items.
7. Localized corrections return through review without changing the approved objective.
8. Accepted work and reports move to done.

## Codex Instruction

Process production/inbox in filename order in batches of four. Build, validate, commit, and synchronize each item. After the fourth completed work order, move the batch to review, produce one consolidated report, and stop for revision approval. Stop earlier only when the inbox is empty or a concrete dependency blocks manufacturing. Do not manufacture from backlog.

## Claude Instruction

At each four-work-order checkpoint, review only the four newly completed builds, log localized revisions, verify the production frontier, and identify the next target. Do not stop active production unless a confirmed defect blocks active work.

## Batch Gate

The four-work-order review gate is mandatory. Once the consolidated report is submitted, the queue remains paused until revision approval is recorded.
