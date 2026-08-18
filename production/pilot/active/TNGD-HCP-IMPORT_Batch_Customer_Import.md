# WORK ORDER

## TNGD-HCP-IMPORT — Batch Customer Import from HouseCall Pro

**Authority:** Post-BP-004.1 LCO operational readiness
**Scope:** Import 256 HCP customer records into TNGD tenant using expanded schema

## 1. Objective

Create a governed `createCustomerAuthorized` method for direct customer creation without intake, then import 256 existing TNGD customers from the HouseCall Pro CSV export. This populates the tenant with operational customer data for dispatch pilot launch.

## 2. Deliverables

1. `createCustomerAuthorized` method on CustomerCaseService — direct creation with identity matching, deduplication, and audit.
2. CSV parser and field mapper for HCP 37-column export format.
3. Import script at `scripts/import-hcp-customers.mjs` — reads CSV, maps fields, creates records, reports results.
4. HCP ID preserved as `hcp:{id}` tag for source traceability.
5. Tests for direct creation and deduplication.

## 3. Exclusions

- No schema changes beyond adding `createCustomerAuthorized`
- No intake flow modifications
- No Supabase persistence (V1 in-memory)
- No customer data committed to repository

## 4. Data Source

- Path: `C:\Users\Davon\Downloads\MMS-Clients\MASS eco\TNGD\Operations\TopNotchGarageDoorsLLC_customer_export.csv`
- Rows: 256 (excluding header)
- Format: CSV with 37 columns matching HCP customer export template

**Manufacturing doctrine:** Build what we approved. Improve what we learn. Defer what we imagine.
