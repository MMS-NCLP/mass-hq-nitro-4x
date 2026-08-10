# NCLP Production Conveyor

## Purpose

Separate logical production conveyor for NC Local Pro (NCLP) within the MASS production system.

## Authority

- Governance, work orders, review evidence, and Executive decisions remain under MASS authority in `mass-hq-nitro-4x`.
- Implementation deliverables are committed to `MMS-NCLP/nc-local-pro`.
- Established by ED-5, Executive Disposition PRR-001, 2026-08-10.

## Manufacturing Authority

**No NCLP manufacturing authority exists at this time.**

Manufacturing shall not begin until both of the following receive separate Executive approval as governing documents:

1. **MASS-PLAN-003** — NCLP Unified V1 Roadmap
2. **EWO-MASS-002** — NCLP Platform Convergence Baseline

Both documents are currently pending individual Executive review (ED-1, PRR-001).

## Queue Structure

| Directory | Purpose |
|---|---|
| `inbox/` | Queued NCLP work orders awaiting manufacturing |
| `active/` | Currently manufacturing NCLP work order (one at a time) |
| `review/` | NCLP deliverables awaiting Architecture Protection review |
| `done/` | Accepted NCLP packages with review evidence |

## Manufacturing Process

NCLP work orders follow the same four-phase process as Platform and Pilot conveyors:

1. **Work Order** — Queued in `inbox/`, promoted to `active/` when manufacturing begins
2. **Manufacturing** — Deliverables committed to working branches in `nc-local-pro`
3. **Spot Review** — Review evidence filed in `review/`
4. **Acceptance** — Accepted packages moved to `done/`

Every NCLP work order must cite EWO-MASS-002 (PCB) and identify the convergence objective it implements.
