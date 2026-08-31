# NITRO 4X Sequence Register

**Registry Type:** Operational Governance Register  
**Authority:** NITRO-4X-002  
**Repository:** `MMS-NCLP/mass-hq-nitro-4x`  
**Status:** Proposed / Initial Adoption  
**Established:** 2026-08-23

## Purpose

This register is the authoritative baton ledger for Nitro 4X governed production streams. It records the latest accepted/current sequence, inherited proof, canonical runtime/presentation baseline, and expected next successor.

This register does not replace Git history. It makes Git history operationally legible to the next producer.

## Status Tokens

`ACTIVE | PROVEN | ACCEPTED | RELEASED | CORRECTION | BLOCKED | DEFERRED | SUPERSEDED`

## Stream Registry

| Stream | Current Sequence | Pass | Coordinates | State | Canonical Commit / Baseline | Canonical Runtime | Canonical Presentation | Expected Successor | Next Producer | Notes |
|---|---:|---:|---|---|---|---|---|---|---|---|
| GOVERNANCE-N4X | S0002 | P2 | E2-R2-P2-Q2 | ACTIVE | branch `governance/nitro-4x-core4` | N/A | N/A | S0003/P3 — independent doctrine review | Engineering Steward / Product Owner | Initial Nitro 4X doctrine adoption branch. Not yet merged to main. |
| DISPATCH-V1 | ADOPTION-PENDING | — | inherited | ACTIVE | Functional regression floor reported at 309/309; Nitro visual baseline commit `ef0f8e56...` requires formal adoption reconciliation | Current local Next.js Path C runtime must be stamped before Visual Realization | Nitro 4X command visual system exists in repo at commit `ef0f8e56...`; current runtime/presentation convergence must be explicitly resolved | First formal DISPATCH-V1 Nitro sequence adoption record | Engineering Steward | Do not restart Dispatch build. Adoption record shall preserve accepted functional evidence and presentation provenance. |
| NCLP-V1 | ADOPTION-PENDING | — | inherited | ACTIVE | Resolve from MASS-PLAN-003 / active implementation authority at next handoff | To be stamped | To be stamped | First formal NCLP-V1 Nitro sequence adoption record | Engineering Steward | No retroactive renaming required. |
| MASS-HQ-UI | ADOPTION-PENDING | — | inherited | DEFERRED | Current HQ visual doctrine/reference work awaits formal manufacturing queue | To be stamped | To be stamped | First formal MASS-HQ-UI Nitro sequence adoption record | Engineering Steward | Separate from MASS Dispatch visual realization. |

## Baton Update Rule

Every stream transition shall append or update one row only after repository evidence resolves the new authoritative state.

A producer beginning work shall read this register and the predecessor artifact before production.

A producer closing work shall record:

- actual sequence and pass;
- Core 4 coordinates earned;
- state decision;
- canonical commit;
- canonical runtime/presentation where relevant;
- regression/evidence floor;
- outstanding delta;
- expected successor and producer.

## Dispatch V1 Immediate Adoption Note

The current MASS Dispatch stream shall not be forced through retrospective four-pass rework.

The first Dispatch Nitro 4X adoption record should capture the state already earned:

- accepted functional/domain convergence;
- current regression floor;
- latest user-verified interaction ledger;
- Path C runtime entrypoint;
- existing Codex Nitro presentation provenance;
- approved visual reference set;
- precise Visual Realization inheritance instruction.

The adoption record exists to reunify authority, not to reopen accepted work.