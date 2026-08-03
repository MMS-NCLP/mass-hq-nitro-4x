# MASS-APP-014-V16 — Intelligence Quality, Evaluation & Model Governance

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-APP-014-V16 |
| Version | 1.0 |
| Status | Production Baseline v1.0 |
| Authority | EWO-MASS-APP-014-V16 |
| Date | 2026-08-03 |

## 1. Purpose

V16 measures whether AI-assisted outputs, recommendations, summaries, classifications, agents, plugins, and synthesized context are useful, accurate, grounded, safe, traceable, timely, and appropriate. It provides evaluation evidence and release advice without allowing AI to certify itself or authorize deployment.

## 2. Permanent Architecture

V16 owns evaluation programs, registered datasets, scenarios, test cases, acceptance criteria, evaluation runs, observed metrics, evidence, quality findings, comparative regressions, human judgments, waivers, release advisories, configuration history, and executive quality briefings. ENG-009 owns orchestration, ENG-011 observability, ENG-024 analytics, ENG-027 lineage, and source applications own evaluated outputs.

The permanent model separates observed measurements, deterministic checks, human judgment, and advisory synthesis. Each result identifies evaluator version, subject version, dataset version, evidence, limitations, and reviewer.

## 3. Role Mapping

| Role | Baseline Mapping | Authority |
|---|---|---|
| Evaluation Viewer | Viewer specialization | Read authorized plans and findings |
| Evaluation Contributor | Contributor specialization | Register cases and execute approved runs |
| Quality Steward | Steward specialization | Govern criteria, datasets, findings, and comparisons |
| Human Evaluator | Contributor extension | Record independent qualitative judgment |
| Release Advisory Approver | Administrator specialization | Issue advisory or waiver decision |
| Evaluation Administrator | Administrator specialization | Configure gateways, roles, and retention |

Evaluated agents/models cannot review themselves. Run owners cannot approve their own release advisory or waiver.

## 4. Platform Consumption Map

| Source | Consumption | Boundary |
|---|---|---|
| APP-014 V01–V15 | Evaluated outputs and configuration references | Prior volumes retain ownership |
| APP-015 / APP-017 when available | Plugin and AI workforce contracts | No ownership before availability |
| ENG-003/004/005 | Identity, authorization, events | Platform-owned |
| ENG-007/009/011 | Knowledge, AI execution, observations | Platform-owned |
| ENG-015/024/027 | APIs, metrics, lineage | Capability-owned |
| External providers | Approved model/evaluation references | Accessed through gateways only |

Publishes `evaluation.run.completed`, `evaluation.finding.raised`, `evaluation.regression.detected`, `evaluation.waiver.decided`, `evaluation.release-advisory.issued`.

## 5. Gateway Inventory

| Gateway | Contract | Failure Behavior |
|---|---|---|
| EvaluatedArtifactGateway | APP-014 output/configuration references | Mark case unexecutable if version unavailable |
| PluginContractGateway | APP-015 contracts when available | Skip unavailable optional subject |
| WorkforceContractGateway | APP-017 contracts when available | No assumed contract before publication |
| AIOrchestrationGateway | ENG-009 controlled execution | Fail run without fabricated output |
| KnowledgeGateway | ENG-007 grounding corpus | Mark grounding incomplete |
| ObservabilityGateway | ENG-011 trace evidence | Preserve missing telemetry finding |
| AnalyticsGateway | ENG-024 metrics | Preserve raw observations if aggregation fails |
| LineageGateway | ENG-027 citation validation | Block release advisory when mandatory lineage fails |
| ExternalEvaluationGateway | Approved providers | Isolate provider result as external evidence |
| EventGateway / AuditGateway | ENG-005/011 | Outbox and retry-safe audit |

## 6. Evaluation Lifecycle

`Program Drafted → Dataset Registered → Cases Approved → Run Scheduled → Outputs Captured → Measures Calculated → Human Reviewed → Findings Issued → Compared → Release Advisory / Waiver → Preserved`

Datasets and acceptance criteria are versioned. A completed run is immutable. A rerun creates a new run linked to its predecessor.

## 7. Evaluation Model

Test cases define input, context, expected properties, prohibited properties, acceptance criteria, severity, and required reviewer. Expected output may be exact, rubric-based, reference-based, constraint-based, or human-judgment based.

Measures cover accuracy, relevance, completeness, grounding, consistency, timeliness, usefulness, citation validity, unsupported claims, safety, policy conformance, and observed bias/disparate impact. Measurements remain observations; human reviewers determine organizational acceptability.

Comparisons preserve baseline and candidate versions, matched datasets, metric deltas, changed failures, confidence, and limitations. Threshold breaches create warnings and release recommendations, not deployment decisions.

## 8. Exceptions, Waivers, and Briefings

Exceptions record failed criteria and affected use. Waivers require risk, compensating controls, scope, expiration, and an authorized independent decision. Failed results remain visible.

NOVA evaluation advisory and POPS historical performance context execute through ENG-009 and remain cited advisory evidence. Executive briefings distinguish measurements, human judgments, unresolved findings, waivers, and recommendations.

## 9. Data Model

| Entity | Purpose | Immutable Condition |
|---|---|---|
| EvaluationProgram | Governed evaluation scope | After activation |
| EvaluationDataset | Dataset identity/version | After validation |
| EvaluationScenario | Organizational scenario | After approval |
| EvaluationTestCase | Input and criteria | After approval |
| EvaluationSubject | Model/prompt/agent/plugin reference | Version record immutable |
| EvaluationRun | Executed evaluation | After completion |
| EvaluationObservation | Raw observed metric | Always after capture |
| HumanEvaluation | Reviewer judgment | Always |
| QualityFinding | Failed or warning condition | After review |
| RegressionComparison | Baseline/candidate comparison | After issuance |
| EvaluationWaiver | Human exception decision | Always |
| ReleaseAdvisory | Advisory release recommendation | After issuance |
| ExecutiveQualityBriefing | Cited quality summary | After issuance |
| EvaluationAdvisoryRequest | NOVA/POPS request | After completion |
| EvaluationOutbox | Reliable event | After publication |

## 10. API Contracts

| Method | Path | Purpose | Role |
|---|---|---|---|
| GET/POST | `/evaluation/programs` | Browse/create programs | Viewer/Steward |
| POST | `/evaluation/datasets` | Register dataset version | Quality Steward |
| POST | `/evaluation/test-cases` | Create test case | Evaluation Contributor |
| POST | `/evaluation/runs` | Start approved run | Evaluation Contributor |
| GET | `/evaluation/runs/{id}` | Read run and evidence | Evaluation Viewer |
| POST | `/evaluation/runs/{id}/human-reviews` | Record judgment | Human Evaluator |
| GET | `/evaluation/findings` | Browse findings | Evaluation Viewer |
| POST | `/evaluation/comparisons` | Compare candidate to baseline | Quality Steward |
| POST | `/evaluation/waivers` | Request waiver | Quality Steward |
| POST | `/evaluation/waivers/{id}/decide` | Decide waiver | Release Advisory Approver |
| POST | `/evaluation/release-advisories/{id}/issue` | Issue advisory | Release Advisory Approver |
| POST | `/evaluation/briefings/{id}/issue` | Issue briefing | Release Advisory Approver |
| POST | `/evaluation/advisory-requests` | Request NOVA/POPS advice | Quality Steward |

## 11. Security and Integrity

Tenant RLS derives from `auth.jwt()`. Composite foreign keys protect tenant boundaries. Dataset versions, approved cases, subject versions, completed runs, observations, human judgments, reviewed findings, comparisons, waiver decisions, issued advisories/briefings, and completed advisory responses are immutable. Separation-of-duty triggers prohibit self-certification.

Implementation-grade schema is in `MASS-APP-014-V16_Migration_Reference.sql`.

## 12. V1 Implementation

V1 supports registered evaluation programs and datasets, scenario/test-case stewardship, controlled runs through ENG-009, deterministic and rubric measures, citation checks, human review, regression comparison, findings, time-bounded waivers, release advisories, and executive quality briefings.

## 13. Future Evolution

Expanded adversarial testing, richer fairness evaluation, external benchmark providers, continuous regression monitoring, and additional subject types attach through existing gateway, subject, dataset, and review contracts. V16 never becomes autonomous certification authority.

## 14. Constitutional Boundary Statement

V16 measures, compares, explains, flags, and recommends. It does not alter evaluated outputs, suppress failures, certify itself, authorize deployment, override policy, or execute correction.

