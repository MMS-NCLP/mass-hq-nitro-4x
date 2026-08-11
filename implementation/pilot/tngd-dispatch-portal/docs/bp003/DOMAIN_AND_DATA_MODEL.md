# BP-003 Domain and Data Model

## Guided Intake Session

A tenant-keyed, resumable draft containing the selected BP-002 path, initiating user, source (`internal-portal` or `phone`), current question index, autosaved answers, governed media references, append-only original evidence, audit-event identifiers, and lifecycle timestamps.

Lifecycle: `draft` → `completed`.

## Structured Intake Record

An immutable completion projection containing:

- record, tenant, creating user, and completing user identifiers;
- selected intake path and source;
- exactly eight structured primary-question answers;
- photo and voice-note references with original metadata;
- append-only original answer and media-reference evidence;
- audit-event identifiers and start/completion timestamps;
- status `ready-for-bp004`.

The record does not create or mutate a BP-004 Customer Record or Service Case. Its handoff envelope names `TNGD-BP-004`, the `Customer Record and Service Case Creation` contract, and the immutable Intake Record identifier.

## Trust and Ownership Boundaries

- BP-001 owns authentication, tenant isolation, permissions, and the hash-chained audit log.
- BP-002 owns intake-path selection and the base intake boundary.
- BP-003 owns guided-question progress, conditional validation, evidence references, and the Structured Intake Record.
- APP-004/APP-012 boundaries own routine intake media content; BP-003 stores references only.
- BP-004 owns future customer and service-case creation.
- Current storage is process-local. No durable provider or database schema is selected by BP-003.
