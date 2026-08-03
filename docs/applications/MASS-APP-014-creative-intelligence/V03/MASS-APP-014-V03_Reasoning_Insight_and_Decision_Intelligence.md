# MASS-APP-014-V03 - Reasoning, Insight & Decision Intelligence

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-APP-014-V03 |
| Version | 1.0 |
| Status | Production Baseline |
| Authority | EWO-MASS-APP-014-V03 |
| Date | 2026-08-03 |

## 1. Purpose

V03 defines the Decision Intelligence room: the governed environment in which MASS organizes evidence, synthesizes information, detects patterns, compares scenarios, explains reasoning, surfaces risks and opportunities, and presents practical options to authorized decision owners.

V03 improves human decisions. It does not make autonomous decisions, authorize execution, or replace executive accountability.

## 2. Scope

V03 includes decision cases, questions, evidence chains, multi-source synthesis, insights, recommendations, decision scoring, opportunity and risk signals, scenario comparison, forecasts, organizational patterns, historical outcome comparison, explainable reasoning traces, human decisions, NOVA and POPS advisory requests, cross-department intelligence, plugin extension contracts, and governed agent collaboration.

It excludes autonomous approval, autonomous execution, hidden chain-of-thought storage, source-system mutation, cross-tenant learning, enterprise analytics ownership, knowledge ownership, workflow ownership, and unrestricted agent behavior.

## 3. Platform Consumption Map

| Dependency | Consumed capability | Delegated responsibility |
|---|---|---|
| APP-014-V01 | Intelligence workspaces, sessions, prompt composition | Creative intelligence foundation |
| APP-014-V02 | Organizational memory, citations, confidence, history | Memory stewardship |
| APP-013 | Read-only projects and design artifacts | Design artifact stewardship |
| ENG-003/004/005 | Identity, authorization, events | Platform controls |
| ENG-007 | Knowledge retrieval | Enterprise knowledge authority |
| ENG-009 | AI and governed agent orchestration | Models, prompts, tools, guardrails |
| ENG-017/019/020/022/023 | Domain intelligence | Domain authority |
| ENG-024 | Analytics, patterns, forecasts, benchmarks | Enterprise analytics authority |
| ENG-027 | Executive information and graph references | Executive intelligence authority |

Owned responsibilities are decision-case structure, evidence chains, case synthesis, explainable insights, recommendation records, advisory scoring, scenario presentation, human decision capture, and extension or agent contribution records.

Delegated responsibilities are source facts to owning applications, memory to V02 and ENG-007, analytics to ENG-024, AI and agents to ENG-009, execution to ENG-006 and owning capabilities, and authorization to ENG-004.

Published events: decision.case.created, decision.evidence.added, decision.insight.generated, decision.risk.detected, decision.opportunity.detected, decision.recommendation.ready, decision.human.recorded, decision.outcome.recorded.

Consumed events: organizational.memory.preserved, organizational.memory.source.stale, enterprise.analytics.updated, enterprise.risk.updated, enterprise.opportunity.updated, financial.forecast.updated, operational.state.changed.

### V03 Role Mapping

V03 roles extend the APP-014 role hierarchy; they do not replace it.

| V03 role | APP-014 baseline | Relationship and authority |
|---|---|---|
| Decision Owner | Steward, which extends V01 Editor | Specializes Steward for assigned decision cases. May control eligible case lifecycle, freeze review packages, close cases, and request handoffs. Cannot record the final executive decision unless separately assigned Executive Approver. |
| Executive Approver | Administrator, which maps to V01 Admin | Specializes Administrator for a defined decision scope. May record HumanDecision and DecisionAmendment records when ENG-004 confirms case-specific approval authority. It does not grant tenant-wide administration unless that baseline role is separately assigned. |

Viewer, Contributor, Steward, and Administrator retain their V02 definitions. Case assignment narrows access; it never broadens tenant or source authorization.

## 4. Architecture and Lifecycle

Authorized sources enter through typed gateways. Evidence is normalized into case-scoped references while retaining source ownership. Synthesis and analytic requests route to ENG-024 or ENG-009. The Reasoning Service assembles a structured, explainable trace. The Recommendation Service presents options. A human decision owner alone records the selected outcome.

Lifecycle: Draft -> Evidence Gathering -> Analysis -> Ready for Review -> Decided -> Outcome Pending -> Closed -> Archived.

- Draft defines owner, question, scope, deadline, and affected domains.
- Evidence Gathering collects authorized source references and citations.
- Analysis creates synthesis, signals, scenarios, forecasts, scores, and traces.
- Ready for Review freezes the reviewed recommendation package.
- Decided records an authorized human selection, rationale, conditions, and dissent.
- Outcome Pending monitors authorized outcome references without executing work.
- Closed compares expected and verified outcomes and preserves learning through V02.
- Archived retains the complete institutional record.

Reopening a decided case creates a new decision cycle linked to the previous cycle.

## 5. Capability Architecture

| Capability | Purpose | Inputs | Outputs | Dependencies | V1 implementation | Future evolution |
|---|---|---|---|---|---|---|
| Executive Reasoning | Frame a decision in owner language | Question, constraints, evidence, objectives | Trace, uncertainty, options | V01, V02, ENG-009, ENG-027 | Structured analysis with human review | Longitudinal executive reasoning |
| Evidence Chains | Prove claims against sources | Memories, domain records, citations | Ordered supporting and contradicting evidence | V02, ENG-007 | Manual and assisted assembly | Automated gap mapping |
| Multi-source Synthesis | Combine domain intelligence | Authorized evidence | Agreements, conflicts, omissions | ENG-007, ENG-009, ENG-024 | Governed synthesis request | Continuous federated synthesis |
| Recommendations | Present practical options | Synthesis, scenarios, constraints | Ranked candidates | ENG-009, ENG-024 | Advisory options only | Adaptive option generation |
| Decision Scoring | Expose evaluation criteria | Options, weights, confidence | Scores and uncertainty | V02, ENG-024 | Transparent weighted scoring | Calibrated decision-class models |
| Opportunity Detection | Surface beneficial possibilities | Growth, relationship, operations signals | Opportunity candidates | ENG-017, ENG-019, ENG-024 | Rule and analytics signals | Ecosystem opportunity composition |
| Risk Detection | Surface exposure and downside | Risk, finance, operations, compliance | Risk candidates and mitigations | ENG-022, ENG-024, risk owners | Rule and analytics signals | Dynamic risk propagation |
| Scenario Comparison | Compare plausible options | Assumptions, variables, constraints | Scenario outcomes | ENG-024 | User-defined comparisons | Simulation-backed scenarios |
| Forecast Framework | Present expected ranges | Metrics, drivers, horizon | Forecast snapshots | ENG-024 | Consume approved forecasts | Probabilistic and causal forecasts |
| Pattern Recognition | Find recurring behavior | Historical cases and outcomes | Evidence-backed pattern candidates | V02, ENG-024 | Tenant-local comparison | Longitudinal pattern libraries |
| Historical Learning | Compare decisions and outcomes | Closed cases, verified outcomes | Lessons and precedent references | V02, ENG-007 | Human-verified precedent capture | Outcome-calibrated guidance |
| Explainability | Explain why options exist | Evidence, scoring, rules | Structured reasoning trace | ENG-009, ENG-011 | Claims, citations, assumptions | Expanded explanation audits |
| Human Approval | Preserve accountable authority | Reviewed package and principal | Human decision record | ENG-003, ENG-004 | Mandatory human decision | Remains mandatory |
| NOVA Advisory | Add enterprise-intelligence perspective | Authorized case package | Advisory analysis | ENG-009, ENG-027 | Explicit user request | Broader cross-domain advisory |
| POPS Advisory | Add stewardship perspective | Authorized case package | Governance and continuity advisory | ENG-009, ENG-027 | Explicit user request | Expanded institutional stewardship |
| Plugin Extensions | Admit specialized analysis | Redacted request | Evidence, signal, score, or option candidate | Future Plugin Library, ENG-004 | Contract and registry shape | Approved plugin ecosystem |
| Agent Collaboration | Coordinate bounded specialists | Task, evidence, agent role | Signed contribution | ENG-009 | Sequential user-invoked calls | Governed parallel collaboration |

Future evolution is architectural placement, not V1 authorization.

## 6. Evidence Chains and Synthesis

An EvidenceChain is case-scoped and revisioned. Every link identifies a claim, source reference, source revision, citation locator, relationship, confidence, and display order. Relationships are supports, contradicts, qualifies, contextualizes, or unknown.

Every recommendation claim resolves to evidence or is labeled assumption. Stale sources remain visible and reduce confidence. Evidence retains its constitutional owner.

Synthesis identifies sources included and excluded, agreement, contradictions, missing evidence, recency, confidence limitations, assumptions, affected departments, and unresolved questions. It is a case artifact. Institutional preservation is delegated to V02.

## 7. Recommendations and Scoring

A Recommendation is an advisory option with expected benefit, cost, risks, dependencies, reversibility, time horizon, and evidence chain.

DecisionScore dimensions are evidence quality, expected impact, urgency, strategic alignment, reversibility, execution feasibility, risk exposure, and uncertainty. Each records value, weight, rationale, and evidence. The aggregate is reproducible and cannot conceal missing evidence.

Rank order never constitutes approval. An authorized human may select any option, reject all, request evidence, or defer.

## 8. Risk, Opportunity, Scenario, and Forecast Intelligence

RiskSignal and OpportunitySignal are candidates, not authoritative domain records. Each contains origin, affected scope, severity or value, likelihood, time sensitivity, evidence, confidence, and owner routing. Confirmed signals are handed to their constitutional owner.

A Scenario defines assumptions, variables, constraints, horizon, and option. ScenarioOutcome records expected benefits, costs, risks, dependencies, and uncertainty ranges.

A ForecastReference points to an ENG-024 output and records method, baseline date, horizon, low/base/high range, assumptions, drivers, confidence, and source version. V03 does not independently calculate enterprise forecasts.

V1 presents user-defined scenarios and consumed analytics. Simulation remains future evolution under an approved analytical capability.

## 9. Patterns and Historical Learning

PatternCandidate identifies repeated conditions, actions, and outcomes across authorized tenant-local history. It includes sample size, time range, confidence, counterexamples, and source cases.

Closing a case records verified outcomes. Lessons are preserved through V02 only after human confirmation. V03 never trains across tenants and never treats correlation as causation.

## 10. Explainable AI

V03 stores a structured ReasoningTrace, not hidden model chain-of-thought. It contains the question, claims, evidence links, assumptions, scoring criteria, alternatives, uncertainties, model interaction references, human edits, and final rationale.

Users receive concise explanations tied to citations. ENG-009 retains provider interaction governance. Sensitive internal model reasoning is neither requested nor persisted.

## 11. Human Authority

Only an authenticated and authorized Decision Owner or Executive Approver may record a HumanDecision. The selected option, rationale, conditions, dissent, timestamp, and authorization reference become immutable. Corrections create a DecisionAmendment.

No recommendation, score, NOVA response, POPS response, plugin contribution, or agent contribution may transition a case to Decided.

## 12. NOVA and POPS

NOVA and POPS are advisory request types executed through ENG-009, not downstream systems.

NOVA evaluates enterprise context, dependencies, patterns, and consequences. POPS evaluates stewardship, constitutional alignment, continuity, and responsibility boundaries. Both receive only authorized context and return signed advisory evidence. Neither approves or executes.

## 13. Plugin and Agent Extension Points

DecisionExtension permits evidence_candidate, signal_candidate, score_candidate, and option_candidate outputs. Each invocation records extension identifier, version, tenant, case, permissions, redacted input hash, output, citations, confidence, duration, and error.

Extensions are read-only toward decision records and sources. The host validates accepted contributions. V1 provides contract and registry shape only; no marketplace or unrestricted runtime is authorized.

AgentTask identifies one specialist role, bounded objective, allowed evidence, output schema, timeout, and human requester. ENG-009 executes it. V1 supports sequential user-invoked contributions. Future parallel agents remain governed by human approval and ENG-009.

## 14. Security

- Every entity is tenant-bound and protected by concrete RLS.
- Child entities use composite tenant foreign keys.
- Polymorphic references require tenant and authorization validation.
- Reviewed packages and HumanDecision records are database-immutable.
- Case access cannot exceed the most restrictive cited source.
- Plugin and agent inputs are minimized and redacted.
- Cross-tenant learning and case comparison are prohibited.

## 15. Data Model

| Entity | Purpose | Core integrity |
|---|---|---|
| DecisionCase | Stable decision container | Tenant lifecycle and V01 workspace |
| DecisionQuestion | Revisioned decision frame | One active revision |
| EvidenceItem | Authorized source reference | Source tenant and lifecycle validation |
| EvidenceChain | Revisioned claim network | Immutable when reviewed |
| EvidenceChainLink | Claim-to-evidence link | Direct evidence and chain FKs |
| Synthesis | Multi-source interpretation | Sources, omissions, conflicts preserved |
| Insight | Explainable observation | Evidence-backed or assumed |
| Recommendation | Advisory option | Cannot approve or execute |
| DecisionScore | Reproducible score | Values, weights, rationale, evidence |
| RiskSignal | Candidate risk | Domain-owner handoff |
| OpportunitySignal | Candidate opportunity | Domain-owner handoff |
| Scenario | Assumptions and constraints | Case and option scoped |
| ScenarioOutcome | Expected outcome range | Direct scenario reference |
| ForecastReference | Consumed ENG-024 forecast | Immutable source version |
| PatternCandidate | Historical pattern | Sample, confidence, counterexamples |
| ReasoningTrace | Structured explanation | No hidden chain-of-thought |
| HumanDecision | Authorized decision | Database-immutable |
| DecisionAmendment | Correction without overwrite | Original decision FK |
| ExtensionInvocation | Plugin contribution | Idempotent and read-only |
| AgentContribution | Specialist output | ENG-009 reference |

## 16. API Contracts

| Method | Route | Purpose |
|---|---|---|
| GET, POST | /decision-cases | List or create cases |
| GET, PATCH | /decision-cases/{id} | Retrieve or edit case |
| POST | /decision-cases/{id}/archive | Archive case |
| GET, POST | /decision-cases/{id}/questions | List or revise question |
| GET, POST | /decision-cases/{id}/evidence | List or add evidence |
| DELETE | /decision-cases/{id}/evidence/{evidenceId} | Remove eligible evidence |
| GET, POST | /decision-cases/{id}/evidence-chains | List or create chains |
| POST | /decision-cases/{id}/syntheses | Request synthesis |
| GET, POST | /decision-cases/{id}/insights | List or record insights |
| GET, POST | /decision-cases/{id}/recommendations | List or create options |
| POST | /recommendations/{id}/scores | Record score |
| GET | /decision-cases/{id}/risk-signals | List risks |
| GET | /decision-cases/{id}/opportunity-signals | List opportunities |
| POST | /decision-cases/{id}/signals/detect | Request signal detection |
| GET, POST | /decision-cases/{id}/scenarios | List or create scenarios |
| POST | /decision-cases/{id}/scenarios/compare | Compare scenarios |
| GET, POST | /decision-cases/{id}/forecasts | List or attach forecasts |
| GET | /decision-cases/{id}/patterns | List patterns |
| POST | /decision-cases/{id}/patterns/detect | Request pattern analysis |
| GET | /decision-cases/{id}/reasoning-traces | List explanations |
| POST | /decision-cases/{id}/nova-advisory | Request NOVA |
| POST | /decision-cases/{id}/pops-advisory | Request POPS |
| POST | /decision-cases/{id}/agent-tasks | Request bounded agent |
| POST | /decision-cases/{id}/extensions/{extensionId} | Invoke extension |
| POST | /decision-cases/{id}/ready-for-review | Freeze package |
| POST | /decision-cases/{id}/decisions | Record human decision |
| POST | /decisions/{id}/amendments | Record amendment |
| POST | /decision-cases/{id}/outcomes | Attach outcome |
| POST | /decision-cases/{id}/close | Close case |

Mutating requests require idempotency keys. Advisory, extension, and agent failures leave case state unchanged.

## 17. Folder Structure and Migrations

V03 adds decision-cases, evidence, synthesis, insights, recommendations, scoring, signals, scenarios, forecasts, patterns, reasoning, decisions, extensions, and agents. Gateways alone call V02, ENG-009, ENG-024, NOVA, POPS, or plugin contracts.

Migrations continue from 029 through 041: decision cases, questions, evidence, chains, synthesis, insights, recommendations, scores, signals, scenarios, forecasts, patterns, reasoning, decisions, extensions, agents, RLS, and enforcement triggers.

The implementation-grade PostgreSQL contract is MASS-APP-014-V03_Migration_Reference.sql. It defines all V03 tables, columns, foreign keys, indexes, constraints, triggers, and RLS policies and shall be split into migrations 029 through 041 without weakening those controls.

## 18. Failure Behavior

- Inaccessible evidence: reject attachment.
- Stale evidence: retain with warning and reduce confidence.
- Analytics unavailable: record failure; never fabricate.
- AI unavailable: fail the request only.
- Extension or agent timeout: record failure; preserve case.
- Contradictory evidence: surface conflict.
- Missing human authority: reject decision transition.
- Unverified outcome: retain pending; do not learn from it.

## 19. V1 and Future Boundary

V1 implements human-created cases, typed evidence, governed synthesis, transparent scoring, user-defined scenarios, consumed forecasts, signal candidates, structured explanations, sequential advisories, human decisions, and verified outcomes.

Future evolution may add richer simulations, calibrated models, continuous pattern monitoring, approved plugins, and parallel specialist agents. These capabilities have architectural homes but are not V1 runtime requirements.

## 20. Acceptance Verification

- Every requested capability has a defined architectural home and V1/future boundary.
- V03 consumes rather than duplicates V01, V02, ENG-009, ENG-024, and ENG-027.
- Recommendations and scores remain advisory.
- Human authority is mandatory and immutable.
- Explainability uses structured evidence, not hidden chain-of-thought.
- Plugins and agents cannot mutate decisions or sources.
- Cross-tenant intelligence is prohibited.

## 21. Constitutional Boundary Statement

V03 organizes evidence and presents decision intelligence. It does not own the facts, relationships, analytics, risks, opportunities, finances, operations, communications, or knowledge it consumes. It does not authorize or execute decisions. Authority remains with constitutionally accountable humans and owning enterprise capabilities.
