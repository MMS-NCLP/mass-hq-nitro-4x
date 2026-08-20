# TNGD Media Interoperability & Visual Company V1 Directive

**Date:** 2026-08-20
**Applies to:** MASS Dispatch V1 / TNGD website ecosystem
**Status:** Pre-launch production directive

## Purpose

TNGD media is a shared company asset, not an application-specific attachment collection. MASS Dispatch/HQ and the TNGD website shall be capable of reusing governed media without uncontrolled duplication, destructive moves, or application-specific silos.

The objective is a Visual Company: operational and customer-facing surfaces should communicate through real company evidence wherever useful—doors, openers, parts, field conditions, projects, before/after work, technician/job media, catalog/reference imagery, and approved brand media.

The public portfolio destination is the TNGD **Local Inspirations** portfolio. Dispatch field media shall be captured and structured so qualified projects can graduate into Local Inspirations without reconstructing the project story later.

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

The TNGD website should be able to consume approved media from the same governed company media layer for legitimate public-facing uses including the **Local Inspirations** portfolio, before-and-after galleries, door/opener/part references, service proof, educational/service pages, and other approved company presentation.

Operational media is not automatically marketing media. Customer/job media must cross an explicit approval/rights boundary before public website or promotional use. Internal service evidence may remain operational-only.

Website publication must preserve lineage to the governed asset so future replacement, withdrawal, correction, or reclassification can be managed without hunting for uncontrolled copies.

## Local Inspirations Field-to-Portfolio Standard

A completed Dispatch job is **not automatically a portfolio project**. It may become a **Portfolio Candidate** when the field record contains sufficient visual evidence and project context. It becomes **Local Inspirations Ready** only after qualification and explicit public-use approval.

The pipeline is:

**Field Job -> Structured Media Capture -> Portfolio Candidate -> Qualification -> Public-Use Approval -> Local Inspirations Project Record -> Website Publication / Reuse**

### TNGD Project Story Contract

A Local Inspirations-ready project should preserve, where applicable:

- **Hero:** strongest finished-result image suitable for public presentation.
- **Before:** clear evidence of the original condition or starting point.
- **Problem / Context:** concise description of what TNGD encountered or what the customer sought.
- **Solution / Work:** what was repaired, installed, replaced, configured, or improved and why.
- **During / Detail:** selected work/process/component imagery when it improves understanding.
- **After:** strong finished-result imagery showing the outcome.
- **Product / Parts:** associated door, opener, spring, hardware, screen, accessory, model/style, or other relevant product identity.
- **Project Facts:** service category, general service area, completion date, and useful technical/project details appropriate for public presentation.
- **Permission:** explicit status distinguishing operational use, company/internal reuse, and approved public/marketing use.

The website should consume this structured project story rather than infer a portfolio entry from an unstructured folder of images.

### Media Grades

V1 should preserve a simple graduation model:

1. **Operational Grade** — useful job evidence such as inspection, damage, serial/model, measurement, work, receipt, or completion documentation.
2. **Company Grade** — reusable TNGD imagery suitable for internal/company presentation, reference, training, or approved non-portfolio contexts.
3. **Portfolio Grade** — highest presentation standard; strong enough to publicly represent TNGD workmanship and brand quality.

An asset may graduate from Operational to Company to Portfolio Grade when qualified, but no graduation is automatic.

### Portfolio Candidate / Readiness Metadata

V1 Product Realization should preserve lightweight hooks for:

- Before / During / After classification;
- Portfolio Candidate flag or recommendation;
- media grade;
- hero designation;
- job/project association;
- service association;
- product/part/door/opener association where applicable;
- public-use approval state;
- website / Local Inspirations eligibility.

A future readiness score may summarize completeness, but V1 does not require a new scoring engine. Simple deterministic completeness checks are acceptable where naturally supported.

### Field Capture Standard

Dispatch should make good documentation the natural result of normal field work rather than asking technicians to become marketers.

For portfolio-suitable work, the preferred baseline is approximately:

- one strong **Before** image;
- one useful diagnostic/detail image;
- one **During / Work** image when meaningful;
- one strong **After** image;
- one alternate After/detail image when the project benefits from it.

Service type may alter this expectation. A new-door transformation may justify more imagery; a routine repair may require less. The objective is intentional evidence, not arbitrary photo count.

Where practical, Dispatch should infer capture context from workflow stage so a photo taken during inspection, active work, or completion can inherit useful classification without excessive technician labeling.

### Portfolio Presentation Quality

Portfolio Grade imagery should be clear, relevant, reasonably composed, and appropriate to represent TNGD publicly. Where applicable, finished work should be visible and understandable; before/after framing should make the transformation easy to perceive; avoid unnecessary private customer information, incidental sensitive details, or distracting content. Public presentation remains subject to rights/approval governance.

## Bidirectional Ecosystem Principle

The desired relationship is not 'Dispatch uploads pictures to the website' or 'the website owns pictures that Dispatch copies.' It is:

**TNGD governed media layer -> authorized consumers (Dispatch/HQ, website, and later Studio/Growth/NCLP where permitted).**

Field capture can enrich the governed library. Approved catalog/company media can enrich Dispatch. Approved field/project media can enrich Local Inspirations and other website surfaces. Existing approved Local Inspirations projects may in turn be classified as historical Portfolio Grade assets and made available to Dispatch/HQ for appropriate reference or customer-facing examples.

Website-originated customer uploads should likewise be capable of entering the governed media lifecycle and being associated to the relevant customer/job rather than becoming a permanently isolated website bucket.

Repository-to-repository access may be used where technically appropriate, but V1 implementation should not create hard coupling merely to exchange files. Prefer a stable shared media contract/manifest or storage interface that allows either repository to evolve independently.

## Reuse Beyond Portfolio

A qualified project is a reusable company evidence object, not merely a portfolio post. Subject to permissions, the same governed project/media may support:

- Local Inspirations portfolio presentation;
- before/after galleries;
- service and educational pages;
- door/opener/part references;
- customer-facing examples inside Dispatch;
- service proof and company credibility;
- later Studio/Growth content production;
- later NCLP project showcases.

The goal is to capture once and avoid reconstructing the same project separately for every channel.

## V1 Boundary

V1 SHALL:
- connect or identify the authoritative media source before Product Realization where feasible;
- establish a usable manifest/reference convention;
- make existing approved media discoverable to production;
- wire real media into high-value Dispatch presentation surfaces;
- preserve Before/During/After and project/media associations where naturally supported;
- preserve Portfolio Candidate, media grade, hero, public-use approval, and Local Inspirations eligibility hooks;
- preserve approval/rights distinctions for internal versus public use;
- provide a sane path for approved Local Inspirations / website reuse;
- avoid unnecessary duplicate originals.

V1 SHALL NOT be delayed to build a full digital asset management platform, AI semantic classifier, automatic marketing-rights engine, automatic before/after pairing system, sophisticated portfolio scoring engine, autonomous website publishing system, or sophisticated cross-product recommendation service.

Those deeper capabilities belong to V2/productization after field evidence.

## Production Sequence

Commerce completion -> checkpoint -> Media Source Connection / Manifest -> UI & Product Realization (including Operational Pulse + Visual Company + Local Inspirations-ready media hooks) -> live deployment -> integration/configuration validation -> live QA -> field pilot.

## Acceptance Principle

A V1 implementation satisfies this directive when real TNGD media can be deliberately found, associated, and reused in Dispatch/HQ; field media can preserve enough structured context to qualify a completed job for Local Inspirations; and approved project media can be made available to the TNGD website through a governed path without relying on ad-hoc manual copying as the long-term contract.

**Governing rule:** Capture once. Classify by truth. Preserve the story and lineage. Qualify deliberately. Approve by use. Publish and reuse everywhere authorization permits.
