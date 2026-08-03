# MASS Production Line

This folder is the shared production queue for ChatGPT, Codex, Claude, and Davon.

## Queue

- `inbox/` — approved work orders ready for Codex
- `active/` — the work order Codex is currently manufacturing
- `review/` — completed work awaiting review or localized revision
- `done/` — accepted work orders and completion reports
- `backlog/` — future ideas and deferred work; never manufacture directly from here

## Operating Flow

1. Davon and ChatGPT prepare and approve work orders.
2. Approved work orders are placed in `production/inbox/`.
3. Codex selects the next work order in filename order, moves or copies it to `active/`, manufactures it, validates it, commits it, and places the completion report in `review/`.
4. ChatGPT and Davon review the result. Localized corrections return through `review/` without changing the approved objective.
5. Accepted work and its completion report move to `done/`.
6. Codex immediately selects the next item from `inbox/` without waiting for a new chat prompt.
7. After every two newly completed volumes, Claude performs a checkpoint audit of those volumes and reports localized findings plus the next production frontier.

## Codex Instruction

Continue through `production/inbox/` in filename order until it is empty or a concrete dependency blocks manufacturing. Do not manufacture from `backlog/`. Completion reports must identify files, validation, commits, repository state, and the next inbox item.

## Claude Instruction

At each two-volume checkpoint, review only the two newly completed volumes, identify localized revisions, verify the repository frontier, and report the next target. Do not stop Codex unless a confirmed defect affects active production.

## Current Practical Model

This is the most efficient available model under the current platform limitation that ChatGPT, Codex, and Claude cannot directly message one another. The repository carries the work; Davon supplies only approval and cross-system handoffs.
