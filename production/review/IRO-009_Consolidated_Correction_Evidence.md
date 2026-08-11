# IRO-009 Consolidated Correction Evidence

## Correction Control

| Field | Value |
|---|---|
| Evidence ID | IRO-009 Consolidated Correction Evidence |
| Authority | Executive Acceptance and Correction Authorization - IRO-009 |
| Preparation Date | 2026-08-11 |
| Status | Correction batch committed and submitted for Independent Review |
| Package Boundary | APP-014 and APP-015 corrections remain separately identified below |
| Queue Action | Consolidated correction evidence submitted to `production/review`; original accepted packages remain preserved |

## Executive Dispositions Recorded

- TNGD-BP-002: Executive Accepted and archived under the forward-looking policy in commit `884a69f0630d1a17b5b90746f2294b5be050d7f6`.
- MASS-APP-015 V02: Executive Accepted with Localized Corrections. This disposition accepts the reviewed V02 baseline while requiring LCO-009-A and LCO-009-B; it does not constitute acceptance of this correction batch.
- APP-015 V03 remains unauthorized and unmanufactured.

## 1. APP-014 Correction Boundary

### LCO-007-A - Database-enforced self-approval prevention

Affected files:

- `docs/applications/MASS-APP-014-creative-intelligence/V15/MASS-APP-014-V15_Migration_Reference.sql`
- `docs/applications/MASS-APP-014-creative-intelligence/V01/MASS_Build_Manifest.md`
- `docs/applications/MASS-APP-014-creative-intelligence/V01/MASS-APP-014_Revision_Log.md`

The V15 migration reference now defines a `BEFORE INSERT OR UPDATE` trigger on `synthesis_packet`. When a packet enters the `issued` state, the trigger resolves the originating requester through the tenant-keyed snapshot and request chain and rejects missing or matching requester/issuer identities. This is a database-enforced constraint and does not redesign the APP-014 workflow.

Correction commit: `eb59c204d53351cc6630397131be719066bd3089`

Validation completed:

- Static SQL contract check confirmed one correction function and one trigger.
- Static SQL contract check confirmed the `synthesis_packet -> context_snapshot -> context_request` requester traversal, tenant matching, and requester/issuer inequality enforcement.

Deferred validation:

- Live PostgreSQL execution and transactional trigger tests are deferred because no configured PostgreSQL test database or repository SQL execution harness is available in this environment.

## 2. APP-015 Correction Boundary

### LCO-008-A - Capability contract completion

Affected files:

- `docs/applications/MASS-APP-015-plugin-capability-framework/V01/MASS-APP-015-V01_Plugin_Manifest.schema.json`
- `docs/applications/MASS-APP-015-plugin-capability-framework/V01/MASS-APP-015-V01_Example_Plugin_Manifest.json`
- `docs/applications/MASS-APP-015-plugin-capability-framework/V01/MASS-APP-015-V01_Plugin_Foundation_Manifest_and_Capability_Registration.md`
- `docs/applications/MASS-APP-015-plugin-capability-framework/V01/MASS-APP-015-V01_Folder_Structure.txt`

Capability declarations now require permissions, consumed contracts, and documentation. The example manifest exercises those fields and validates against the corrected Draft 2020-12 schema, including format checking.

### LCO-008-B - V01 lifecycle immutability alignment

Affected file:

- `docs/applications/MASS-APP-015-plugin-capability-framework/V01/MASS-APP-015-V01_Migration_Reference.sql`

The immutability function now applies lifecycle-conditioned protection to publishers, plugins, versions, categories, capability declarations, dependencies, entry points, and reviewed findings. Signatures, installation-eligibility decisions, and audit evidence remain always immutable. Eleven table triggers continue to enforce the governed record rules.

### LCO-008-C - V01 PDF regeneration

Affected file:

- `docs/applications/MASS-APP-015-plugin-capability-framework/V01/MASS-APP-015-V01_Plugin_Foundation_Manifest_and_Capability_Registration.pdf`

The canonical V01 PDF was regenerated as a five-page document. Page 3 now begins with `4. Platform Consumption Map`; the prior orphaned continuation is eliminated. Page 4 begins with `8. Validation and Discovery`, and page 5 begins with `13. Future Evolution`.

Page-by-page visual inspection:

- Page 1: cover, correction callout, header, and footer are clean.
- Page 2: document control through role mapping is clean; tables do not clip or overlap.
- Page 3: section 4 begins cleanly; sections 4 through 7 render without orphaned continuation text.
- Page 4: section 8 begins cleanly; sections 8 through 12 render without clipping or overlap.
- Page 5: sections 13 and 14 render cleanly with a consistent header and footer.

### LCO-009-A - Installation state constraint

Affected file:

- `docs/applications/MASS-APP-015-plugin-capability-framework/V02/MASS-APP-015-V02_Migration_Reference.sql`

The `plugin_installation.state` column now has a database `CHECK` constraint containing exactly the 17 documented lifecycle states in lifecycle order.

### LCO-009-B - V02 role correction and PDF regeneration

Affected file:

- `docs/applications/MASS-APP-015-plugin-capability-framework/V02/MASS-APP-015-V02_Plugin_Lifecycle_Installation_and_Dependency_Management.pdf`

The canonical V02 PDF was regenerated as a six-page document. The role-mapping table contains eight distinct roles: Installation Viewer, Installation Requester, Plugin Operator, Lifecycle Steward, Installation Approver, Security Approver, Entitlement Approver, and Executive Approver.

Page-by-page visual inspection:

- Page 1: cover, correction callout, header, and footer are clean.
- Page 2: document control and all eight distinct role rows are readable and aligned.
- Page 3: sections 4 through 6 and their tables render without clipping or overlap.
- Page 4: section 7 begins cleanly; sections 7 through 12 render without clipping or overlap.
- Page 5: sections 13 through 16 render cleanly with consistent margins.
- Page 6: section 17 begins cleanly and the constitutional boundary statement renders without clipping.

### APP-015 package records

Affected files:

- `docs/applications/MASS-APP-015-plugin-capability-framework/V01/MASS_Build_Manifest.md`
- `docs/applications/MASS-APP-015-plugin-capability-framework/V01/MASS-APP-015_Revision_Log.md`

The build manifest and revision log record only the localized V01 and V02 corrections. V03 remains unmanufactured.

Correction commits:

- APP-015 V01 / LCO-008-A, LCO-008-B, LCO-008-C: `9745c954f501c16a4c3f36921b6faa0475a86f7e`
- APP-015 V02 / LCO-009-A, LCO-009-B: `d15ab21afe7d42d50a2ae3cb90df9e9cd7ddd69a`

## 3. Consolidated Validation Results

| Validation | Result |
|---|---|
| JSON parsing | Pass - schema and example parse successfully |
| JSON Schema meta-validation | Pass - Draft 2020-12 schema accepted |
| Example manifest validation | Pass - example validates with format checking |
| APP-014 self-approval SQL static contract | Pass |
| APP-015 V01 immutability SQL static contract | Pass - 11 governed table triggers |
| APP-015 V02 state enumeration | Pass - exactly 17 ordered states |
| pypdf strict parsing | Pass - zero warnings; V01 5 pages, V02 6 pages |
| PDF text extraction and section starts | Pass |
| PDF fonts | Pass - Ubuntu Regular, Bold, and Mono subsets embedded |
| Poppler `pdfinfo` | Pass - exit 0 and empty stderr for both PDFs |
| Poppler 150-DPI rendering | Pass - 5 V01 pages and 6 V02 pages; exit 0 and empty stderr |
| Rendered header check | Pass - dark MASS header present on every page |
| Visual inspection | Pass - all 11 rendered pages inspected; no clipping, overlap, broken tables, or orphaned continuation |
| `git diff --check` | Pass |

## 4. Scope and Handoff Record

- APP-014 and APP-015 changes are separately identifiable in this evidence and in their application directories.
- No Pilot file is part of this correction batch.
- No V03 artifact was created or modified.
- The accepted APP-015 V02 work order and historical completion report remain in Platform review; neither was overwritten or moved to done.
- This consolidated evidence records the separately committed application boundaries and submits the correction batch to Platform review.
- Independent Acceptance of the correction batch is not recorded by this manufacturing evidence.
