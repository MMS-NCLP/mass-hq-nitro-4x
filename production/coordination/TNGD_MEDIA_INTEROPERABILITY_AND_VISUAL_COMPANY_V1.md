# TNGD Media Interoperability & Visual Company V1 Directive

**Date:** 2026-08-20
**Applies to:** MASS Dispatch V1 / TNGD website ecosystem
**Status:** Pre-launch production directive

## Purpose

TNGD media is a shared company asset, not an application-specific attachment collection. MASS Dispatch/HQ and the TNGD website shall be capable of reusing governed media without uncontrolled duplication, destructive moves, or application-specific silos.

The objective is a Visual Company: operational and customer-facing surfaces should communicate through real company evidence wherever useful—doors, openers, parts, field conditions, projects, before/after work, technician/job media, catalog/reference imagery, and approved brand media.

## V1 Governing Model

The authoritative media store may remain external (cloud/Drive/local governed storage). Repositories and applications should store durable references, metadata, associations, and application-appropriate derivatives rather than becoming the sole archive for original media.

MASS Dispatch/HQ and the TNGD website may each consume the governed media layer. Neither product owns the only usable copy. Integration should favor a shared source/manifest or governed API/storage interface over manual copying between repositories.

### Media lifecycle

Capture/Import -> Source Preservation -> Classification -> Association -> Rights/Approval -> Governed Library -> Contextual Retrieval -> Operational or Website Presentation -> Reuse

Media shall be classified by what it is, not by the screen that happens to display it.

Minimum useful classifications include: Doors; Openers; Parts; Projects; Before; During; After; Customer/Job Media; Company/Brand; Technician/Team; Product/Catalog Reference; Archive.

Where practical, metadata should preserve source identity, asset type, related customer/job/project/product, capture/import date, approval state, permitted presentation context, and lineage to the authoritative source.

## Presentation Priority

When a surface benefits from media, production should prefer:

1. Actual job-specific media.
2. Customer/project-specific media.
3. Specific product/catalog media.
4. Approved TNGD company-library media.
5. Designed fallback/placeholder only when suitable governed media is unavailable.

Existing approved media is production input, not optional inspiration.

## Dispatch / HQ Use

Operational Pulse and other appropriate Dispatch surfaces should use media as evidence and explanation: field condition, proposed part/door/opener, project context, inspection proof, before/work/after progression, and completed-work proof.

V1 should favor visual comprehension and the established Visual Company target (roughly 70–90% visual communication/value where visualization materially improves comprehension) without forcing imagery where text, numbers, maps, charts, or timelines communicate better.

## TNGD Website Use

The TNGD website should be able to consume approved media from the same governed company media layer for legitimate public-facing uses including portfolio/project showcases, before-and-after galleries, door/opener/part references, service proof, educational/service pages, and other approved company presentation.

Operational media is not automatically marketing media. Customer/job media must cross an explicit approval/rights boundary before public website or promotional use. Internal service evidence may remain operational-only.

Website publication must preserve lineage to the governed asset so future replacement, withdrawal, correction, or reclassification can be managed without hunting for uncontrolled copies.

## Bidirectional Ecosystem Principle

The desired relationship is not 'Dispatch uploads pictures to the website' or 'the website owns pictures that Dispatch copies.' It is:

**TNGD governed media layer -> authorized consumers (Dispatch/HQ, website, and later Studio/Growth/NCLP where permitted).**

Field capture can enrich the governed library. Approved catalog/company media can enrich Dispatch. Approved field/project media can enrich the website. Reuse is permissioned and contextual.

Repository-to-repository access may be used where technically appropriate, but V1 implementation should not create hard coupling merely to exchange files. Prefer a stable shared media contract/manifest or storage interface that allows either repository to evolve independently.

## V1 Boundary

V1 SHALL:
- connect or identify the authoritative media source before Product Realization where feasible;
- establish a usable manifest/reference convention;
- make existing approved media discoverable to production;
- wire real media into high-value Dispatch presentation surfaces;
- preserve approval/rights distinctions for internal versus public use;
- provide a sane path for approved website reuse;
- avoid unnecessary duplicate originals.

V1 SHALL NOT be delayed to build a full digital asset management platform, AI semantic classifier, automatic marketing-rights engine, automatic before/after pairing system, or sophisticated cross-product recommendation service.

Those deeper capabilities belong to V2/productization after field evidence.

## Production Sequence

Commerce completion -> checkpoint -> Media Source Connection / Manifest -> UI & Product Realization (including Operational Pulse + Visual Company baseline) -> live deployment -> integration/configuration validation -> live QA -> field pilot.

## Acceptance Principle

A V1 implementation satisfies this directive when real TNGD media can be deliberately found, associated, and reused in Dispatch/HQ and can be made available to the TNGD website through a governed approval path without relying on ad-hoc manual copying as the long-term contract.

**Governing rule:** Store once where practical. Classify by truth. Preserve lineage. Approve by use. Reuse everywhere authorization permits.
