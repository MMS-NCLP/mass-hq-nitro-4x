# LOCALIZED CORRECTION ORDER

## TNGD-BP-004.1 — Customer Record Schema Expansion

**Authority:** HCP Customer Template Reference (37-field export)
**Scope:** Expand CustomerRecord entity to match HouseCall Pro field template

## 1. Objective

Expand the BP-004 CustomerRecord from the V1 slim schema (7 fields) to the production-ready schema matching HouseCall Pro's 37-field customer export. This enables batch import of 257 existing TNGD customers and establishes the authoritative customer record structure.

## 2. Corrections

1. Split `name` into `firstName` and `lastName` with `displayName` preserved for backward compatibility.
2. Add structured contact fields: `mobileNumber`, `homeNumber`, `workNumber`, `additionalEmails`.
3. Add business fields: `company`, `role`, `customerType` (homeowner/business), `isContractor`.
4. Add structured addresses: primary and secondary, each with `streetLine1`, `streetLine2`, `city`, `state`, `postalCode`, `isBilling`, `notes`.
5. Add relationship fields: `billsTo`, `acceptsBillsFrom`.
6. Add operational fields: `leadSource`, `tags`, `notes`, `doNotService`, `notificationsEnabled`.
7. Add timeline fields: `customerCreatedAt` (source system date), `lastServiceDate`, `lifetimeValue`.
8. Add `updateCustomerAuthorized` method for enriching existing records from import or manual entry.
9. Preserve backward compatibility: intake-created customers populate `firstName`/`lastName` from the existing `name` field and set defaults for all new fields.
10. Existing tests must continue to pass without modification.

## 3. Exclusions

- No intake flow changes (BP-002/003 eight questions remain unchanged)
- No batch import implementation (separate step after schema expansion)
- No architectural expansion
- No new entity types

## 4. Required Tests

- Customer record contains all HCP-template fields
- Update enriches existing customer without overwriting intake evidence
- Identity matching still works with expanded records
- DoNotService flag is queryable
- Backward-compatible intake-created customers have valid defaults
- Tenant isolation preserved through update operations

**Manufacturing doctrine:** Build what we approved. Improve what we learn. Defer what we imagine.
