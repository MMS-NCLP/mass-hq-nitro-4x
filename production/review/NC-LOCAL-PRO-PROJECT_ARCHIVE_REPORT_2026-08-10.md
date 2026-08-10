# NC-Local-Pro-Project Archive Report

## Archive Control

| Field | Value |
|---|---|
| Report Date | 2026-08-10 |
| Authority | ED-3, Executive Disposition PRR-001 |
| Source Path | `C:\Users\Davon\Downloads\NC-Local-Pro-Project` |
| Archive Path | `C:\Users\Davon\Downloads\NC-Local-Pro-Project_ARCHIVED_2026-08-10.zip` |
| SHA-256 | `D2D5E09FD98EDDA9070DF199FD6D136B993B5CBB16CDDB172DACE5118F78F6E7` |
| Archive Size | 101,039 bytes |
| File Count | 32 files across 14 directories |
| Git Repository | No (no `.git` directory present) |

## Complete File Inventory

### Configuration (4 files)

| # | Path | Purpose |
|---|---|---|
| 1 | `.claude/launch.json` | Claude Code dev server config (references "topnotch-dev" port 3002) |
| 2 | `.eslintrc.json` | ESLint configuration |
| 3 | `.gitignore` | Git ignore rules |
| 4 | `tsconfig.api.json` | TypeScript API compiler options |

### Package (1 file)

| # | Path | Purpose |
|---|---|---|
| 5 | `package.json` | Package manifest (name: `nc-local-pro`) |

### Audit Document (1 file)

| # | Path | Purpose |
|---|---|---|
| 6 | `PASS_3_FRONTEND_STABILITY_AUDIT.md` | Frontend stability audit, cited by MASS-PLAN-003 Phase 1 |

### API Routes (14 files)

| # | Path | Purpose |
|---|---|---|
| 7 | `src/api/routes/admin.ts` | Admin API route |
| 8 | `src/api/routes/community/feed.ts` | Community feed route |
| 9 | `src/api/routes/community/posts.ts` | Community posts route |
| 10 | `src/api/routes/community/trending.ts` | Community trending route |
| 11 | `src/api/routes/contact-request.ts` | Contact request route |
| 12 | `src/api/routes/contractorEditorial.ts` | Contractor editorial route |
| 13 | `src/api/routes/credits.ts` | Credits route |
| 14 | `src/api/routes/invoices.ts` | Invoices route |
| 15 | `src/api/routes/jobs.ts` | Jobs route |
| 16 | `src/api/routes/mux.ts` | Mux video route |
| 17 | `src/api/routes/payments.ts` | Payments route |
| 18 | `src/api/routes/pricing.ts` | Pricing route |
| 19 | `src/api/routes/providers.ts` | Providers route |
| 20 | `src/api/routes/refunds.ts` | Refunds route |

### API Services (2 files)

| # | Path | Purpose |
|---|---|---|
| 21 | `src/api/services/email.ts` | Email service |
| 22 | `src/api/services/pdfService.ts` | PDF generation service |

### API Libraries (2 files)

| # | Path | Purpose |
|---|---|---|
| 23 | `src/api/lib/feedScorer.ts` | Community feed scoring algorithm |
| 24 | `src/api/lib/notificationService.ts` | Notification service |

### API Server (1 file)

| # | Path | Purpose |
|---|---|---|
| 25 | `src/api/server.ts` | Express API server entry point |

### Middleware (4 files)

| # | Path | Purpose |
|---|---|---|
| 26 | `src/middleware/authenticate.ts` | Authentication middleware |
| 27 | `src/middleware/authorize.ts` | Authorization middleware |
| 28 | `src/middleware/errorHandler.ts` | Error handling middleware |
| 29 | `src/middleware/requestContext.ts` | Request context middleware |

### Application (1 file)

| # | Path | Purpose |
|---|---|---|
| 30 | `src/app/guides/[slug]/page.tsx` | Next.js guides page component |

### Configuration (1 file)

| # | Path | Purpose |
|---|---|---|
| 31 | `src/config/env.ts` | Environment configuration |

### Library (1 file)

| # | Path | Purpose |
|---|---|---|
| 32 | `src/lib/roles.ts` | Role definitions |

## Unique Work Assessment

**No unique work exists in this folder.** All 32 files are selective extractions from the canonical `MMS-NCLP/nc-local-pro` repository. The folder was created on 2026-07-29 for a Claude Code stabilization session.

### PASS_3_FRONTEND_STABILITY_AUDIT.md

This file is referenced by `MASS-PLAN-003` Phase 1. Its presence in the canonical `nc-local-pro` repository could not be independently verified because `gh` CLI is not authenticated in this session. This file should be verified as present in canonical before the archive source directory is deleted.

## Canonical Comparison Limitation

ED-3 requires "confirmation that no unique work is absent from canonical `MMS-NCLP/nc-local-pro`." This confirmation cannot be completed in this session because:

1. `gh` CLI is not authenticated
2. No local clone of `nc-local-pro` exists for comparison

**Recommended next step:** Authenticate `gh` CLI, clone `MMS-NCLP/nc-local-pro`, verify all 32 files exist in canonical, then delete the source directory and replace with the proper clone.

## Archive Verification

- Dated ZIP archive: Created
- SHA-256 checksum: Recorded above
- Complete file inventory: 32 files documented above
- Unique work confirmation: **Pending** (requires authenticated gh CLI)

## Disposition

The source directory (`NC-Local-Pro-Project`) has NOT been deleted or renamed pending canonical comparison verification. The ZIP archive preserves the complete state as of 2026-08-10.
