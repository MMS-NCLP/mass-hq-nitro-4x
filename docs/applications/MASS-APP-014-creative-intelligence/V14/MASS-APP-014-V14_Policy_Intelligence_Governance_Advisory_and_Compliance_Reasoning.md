# MASS-APP-014-V14 — Policy Intelligence, Governance Advisory & Compliance Reasoning

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-APP-014-V14 |
| Version | 1.0 |
| Status | Production Baseline v1.0 |
| Authority | EWO-MASS-APP-014-V14 |
| Date | 2026-08-03 |

## 1. Purpose

V14 provides evidence-backed interpretation of constitutional rules, engineering standards, application rules, and tenant policies. It identifies applicability, precedence, conflict, gaps, exceptions, and governance risk while preserving the authority of each source publication and every human decision-maker.

## 2. Permanent Architecture

V14 permanently owns policy indexing, policy-version references, applicability rules, precedence relationships, governed interpretation cases, compliance assessments, conflict findings, exception analyses, governance recommendations, and cited advisory briefs. It never owns or edits the Constitution, Engineering Library, application rules, organizational policies, or enforcement actions.

The architecture separates: source registration; applicability resolution; evidence collection; reasoning; human review; advisory publication; and retirement. Policy content remains in its authoritative repository. V14 stores traceable references and governed interpretation records.

## 3. Role Mapping

| V14 Role | Baseline Mapping | Authority |
|---|---|---|
| Governance Viewer | Viewer specialization | View authorized policies, findings, and briefs |
| Policy Contributor | Contributor specialization | Register source references and request assessments |
| Governance Steward | Steward specialization | Validate applicability, evidence, and interpretation |
| Exception Owner | Contributor extension | Prepare exception evidence and remediation proposals |
| Executive Governance Approver | Administrator specialization | Approve advisory publication and exception disposition |
| Governance Administrator | Administrator specialization | Configure tenant policy sources and role assignments |

Roles specialize rather than replace APP-014 roles. A requester cannot approve their own exception or advisory publication.

## 4. Platform Consumption Map

| Source | Consumed Capability | Delegated Ownership |
|---|---|---|
| MASS Constitution | Constitutional rules and precedence | Constitution remains immutable authority |
| Engineering Library | Standards and subsystem boundaries | Engineering specifications remain authoritative |
| APP-013 / APP-014 V01–V13 | Application rules, artifacts, evidence, reasoning, learning | Source applications retain ownership |
| ENG-003/004/005 | Identity, authorization, events | Platform-owned |
| ENG-007/008 | Knowledge and document references | Platform-owned |
| ENG-009 | Governed reasoning and NOVA/POPS advisory | Platform-owned |
| ENG-011/015 | Audit and API contracts | Platform-owned |
| ENG-022/024/027 | Compliance, analytics, lineage | Capability-owned |

Publishes `governance.assessment.completed`, `governance.conflict.detected`, `governance.exception.reviewed`, `governance.recommendation.ready`, and `governance.briefing.issued`.

## 5. Gateway Inventory

| Gateway | Contract | Failure Behavior |
|---|---|---|
| ConstitutionGateway | Read-only constitutional publications | Block definitive assessment if required authority unavailable |
| EngineeringLibraryGateway | Read-only engineering standards | Mark assessment partial and identify missing source |
| ApplicationRuleGateway | APP-013/014 rule references | Preserve stale reference with freshness warning |
| OrganizationalPolicyGateway | Tenant policy documents | Reject unversioned or unauthorized policy sources |
| KnowledgeGateway | ENG-007 retrieval | Continue with explicit missing-knowledge state |
| DocumentGateway | ENG-008 document references | Preserve retry-safe persistence request |
| AIOrchestrationGateway | ENG-009 governed reasoning | Return evidence packet without synthesis |
| ComplianceGateway | ENG-022 compliance state | Record unavailable control evidence |
| AnalyticsGateway | ENG-024 indicators | Mark indicator incomplete |
| LineageGateway | ENG-027 source lineage | Prevent issuance where mandatory lineage fails |
| EventGateway / AuditGateway | ENG-005 / ENG-011 | Outbox and local audit retry |

## 6. Policy Model

Policy sources are classified as constitutional, engineering, application, organizational, regulatory-reference, or operational. Each registration records source identity, version, owner, jurisdiction, effective and retirement dates, authority rank, tenant scope, and immutable checksum.

Applicability combines subject, action, jurisdiction, tenant, effective time, and policy scope. Precedence is explicit and evidence-backed; V14 never invents precedence. Conflicts remain unresolved findings until an authorized human records disposition.

## 7. Governance Reasoning Lifecycle

`Requested → Authorized → Sources Resolved → Applicability Evaluated → Conflicts Identified → Evidence Assembled → Advisory Drafted → Human Reviewed → Issued → Retired`

Assessments distinguish `compliant`, `deviation`, `conflict`, `insufficient_evidence`, and `not_applicable`. A finding describes observed inconsistency; it is not enforcement.

## 8. Exceptions and Recommendations

Exception analysis records requested deviation, governing sources, business justification, risk, duration, compensating controls, affected scope, and required approver. Approved exceptions are immutable, time-bounded, and do not modify policy.

Recommendations include cited evidence, impact, urgency, confidence, alternatives, and required authority. Missing-policy detection proposes a governance gap for human consideration without drafting or adopting policy autonomously.

## 9. Data Model

| Entity | Purpose | Immutable State |
|---|---|---|
| PolicySource | Registered authoritative source | After activation |
| PolicyVersionReference | Version and checksum | Always after validation |
| PolicyApplicabilityRule | Governed applicability criteria | After activation |
| PolicyPrecedence | Explicit precedence relationship | After approval |
| GovernanceAssessment | Interpretation case | After issuance |
| AssessmentEvidence | Cited source evidence | After validation |
| ComplianceFinding | Deviation or consistency finding | After review |
| PolicyConflict | Contradictory authorities | After disposition |
| ExceptionRequest | Requested governed deviation | After decision |
| ExceptionDecision | Human disposition | Always |
| GovernanceRecommendation | Advisory improvement | After decision |
| GovernanceBriefing | Executive advisory brief | After issuance |
| GovernanceAdvisoryRequest | NOVA/POPS request via ENG-009 | After completion |
| GovernanceOutbox | Reliable events | After publication |

## 10. API Contracts

| Method | Path | Purpose | Role |
|---|---|---|---|
| GET/POST | `/governance/policy-sources` | Browse/register sources | Viewer/Contributor |
| GET | `/governance/policies/{id}/versions` | Read policy versions | Governance Viewer |
| POST | `/governance/assessments` | Request assessment | Policy Contributor |
| GET | `/governance/assessments/{id}` | Read assessment and citations | Governance Viewer |
| POST | `/governance/assessments/{id}/issue` | Issue assessment | Governance Steward |
| GET | `/governance/findings` | Browse findings | Governance Viewer |
| POST | `/governance/conflicts/{id}/disposition` | Record conflict disposition | Executive Governance Approver |
| POST | `/governance/exceptions` | Request exception | Exception Owner |
| POST | `/governance/exceptions/{id}/decide` | Decide exception | Executive Governance Approver |
| POST | `/governance/recommendations` | Prepare recommendation | Governance Steward |
| POST | `/governance/briefings/{id}/issue` | Issue briefing | Executive Governance Approver |
| POST | `/governance/advisory-requests` | Request NOVA/POPS advisory | Governance Steward |

Mutating requests are idempotent. Approval endpoints enforce separation of duties.

## 11. Security and Integrity

Tenant identity derives from `auth.jwt()`. Composite foreign keys prevent cross-tenant relationships. Validated source versions, issued assessments, reviewed findings, conflict dispositions, exception decisions, decided recommendations, issued briefings, and completed advisory responses are database-immutable. Source authorization is checked both when cited and when opened.

Implementation-grade schema is defined in `MASS-APP-014-V14_Migration_Reference.sql`.

## 12. V1 Implementation

V1 implements source and version registration, applicability and precedence lookup, governed assessment cases, conflict and gap findings, exception review, recommendations, compliance summaries, cited briefings, and ENG-009 advisory requests. Reasoning uses transparent rules plus governed AI synthesis.

## 13. Future Evolution

Future regulatory adapters, richer policy graphs, predictive impact assessment, and expanded cross-jurisdiction analysis attach through existing gateway, source, evidence, and review contracts. They cannot weaken human authority or source immutability.

## 14. Constitutional Boundary Statement

V14 interprets and advises. It does not amend constitutional rules, alter standards or policy, approve governance change, execute compliance action, discipline people, or override executive authority.

