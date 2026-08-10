# MASS-APP-015-V02 - Plugin Lifecycle, Installation & Dependency Management

## Document Control

| Field | Value |
|---|---|
| Document ID | MASS-APP-015-V02 |
| Version | 1.0 |
| Status | Production Baseline v1.0 |
| Authority | EWO-MASS-APP-015-V02 |
| Date | 2026-08-10 |

## 1. Purpose

V02 converts a V01-validated plugin version into a controlled tenant installation. It owns lifecycle requests, eligibility snapshots, dependency resolution, immutable installation plans, independent approvals, tenant installation records, configuration/data migration coordination, health findings, rollback evidence, and safe-removal records. Installation never grants capability invocation authority.

## 2. Permanent Architecture and V1 Implementation

Permanent architecture separates declared package truth, evaluated target truth, human decisions, execution coordination, and immutable evidence. V01 remains authoritative for manifests, versions, capabilities, and declared dependencies. V02 records the exact V01 version and digest used by each plan.

V1 implements organization, workspace, project, and user scopes; required, optional, peer, and conflicting dependencies; deterministic version selection; explicit approval; idempotent lifecycle commands; configuration migration; application-owned data migration references; readiness checks; rollback; repair; removal; orphan analysis; deprecation; and end-of-support controls.

V1 does not execute capabilities, duplicate deployment-engine ownership, build a storefront, silently install dependencies, or remove application-owned data.

## 3. Role Mapping

| Role | Baseline Mapping | Authority |
|---|---|---|
| Installation Viewer | Viewer | Read authorized plans, state, health, and evidence |
| Installation Requester | Contributor | Request installation or lifecycle change |
| Plugin Operator | Contributor extension | Execute an approved, bound plan through platform gateways |
| Lifecycle Steward | Steward | Resolve dependencies, assess compatibility, and recommend recovery |
| Installation Approver | Administrator | Approve or reject an immutable plan |
| Security Approver | Administrator specialization | Approve plans with security-sensitive grants |
| Entitlement Approver | Administrator specialization | Confirm license and entitlement references |
| Executive Approver | Executive authority | Decide exceptional risk explicitly requiring executive authority |

The requester, plugin, publisher, and execution principal cannot approve their own plan. Approval binds the manifest digest, resolved graph, target scope, permissions, migration steps, and rollback plan.

## 4. Platform Consumption Map

| Source | Consumption | Boundary |
|---|---|---|
| APP-015 V01 | Published manifest, version digest, capability/dependency declarations, eligibility | V01 remains registry authority |
| ENG-003 / ENG-004 | Principal identity, role, authorization, separation of duty | Platform-owned |
| ENG-005 / ENG-006 | Lifecycle events and approved workflow coordination | V02 does not own generic orchestration |
| ENG-011 | Audit, health observations, correlation identifiers | Evidence is never silently dropped |
| ENG-012 | Tenant configuration references and governed secrets | No secret value is copied into V02 evidence |
| ENG-015 | Versioned API and event contracts | Contract authority remains platform-owned |
| ENG-016 | Environment and deployment execution contracts | V02 plans and requests; deployment engine executes |
| ENG-018 | License and entitlement references when available | Absence blocks entitlement-required activation |
| ENG-027 | Provenance and information lineage | Digests and source references remain traceable |
| APP-021 / APP-022 | Administration and security governance when available | No ownership assumed before published contracts |

## 5. Gateway Inventory

| Gateway | Purpose | Failure Behavior |
|---|---|---|
| PluginRegistryGateway | Resolve V01 manifest, version, digest, declarations | Reject missing, unpublished, invalid, or changed version |
| IdentityGateway | Resolve actor and approver identity | Fail closed |
| AuthorizationGateway | Check lifecycle action and scope grant | Fail closed without widening permissions |
| WorkflowGateway | Coordinate approval and execution steps | Pause plan; preserve completed-step evidence |
| EventGateway | Publish lifecycle events through an outbox | Retry; never erase unpublished event |
| AuditGateway | Correlate immutable audit evidence | Lifecycle decision fails if durable audit cannot be recorded |
| ConfigurationGateway | Resolve approved configuration and secret references | Block readiness; never materialize secret values in evidence |
| DeploymentGateway | Execute environment/deployment operations | Record failure and enter recovery; V02 does not impersonate executor |
| EntitlementGateway | Verify license/entitlement reference | Block activation when required evidence is absent or expired |
| LineageGateway | Bind package, plan, execution, migration, and rollback provenance | Mark evidence incomplete and block irreversible transition |
| AdministrationGateway | Resolve organization/scope policy when available | Use explicit platform default only when contract permits |
| SecurityGovernanceGateway | Obtain security decision when available | Security-required plan remains awaiting approval |

## 6. Installation Request and Planning Lifecycle

1. A requester submits plugin version, target scope, requested permissions, configuration references, and an idempotency key.
2. V02 snapshots the V01 manifest digest and verifies publication, tenant eligibility, platform/application/environment prerequisites, entitlement, and declared permissions.
3. The resolver builds a deterministic graph from declared dependencies only. It selects versions, explains alternatives, identifies optional omissions, verifies peer satisfaction, and records conflicts.
4. V02 produces an immutable installation plan containing exact versions/digests, topological steps, approvals, migrations, health gates, failure compensations, and rollback targets.
5. Independent approvers decide the bound plan. Any material change invalidates approval and creates a new revision.
6. An authorized operator executes each idempotent step through its owning gateway. Step evidence is append-only.
7. Activation occurs only after required steps, grants, entitlement, migration checkpoints, and health/readiness gates pass.

## 7. Dependency Resolution Rules

- **Required:** must resolve to exactly one compatible published version in scope or the plan is blocked.
- **Optional:** may be omitted; omission and capability impact are recorded. An optional dependency is never installed silently.
- **Peer:** must already exist or be explicitly included at a compatible version and compatible scope; V02 does not own or silently replace it.
- **Conflict:** any installed or planned version matching the conflict range blocks approval until a human chooses a documented alternative.
- All ranges use the version grammar declared by V01. Exact selection is deterministic: retain a healthy compatible installed version; otherwise choose the highest published eligible version not deprecated beyond policy.
- Cycles among required dependencies are invalid. Optional-only cycles are omitted with a finding. Mixed cycles are blocked.
- A dependency scope must be equal to or broader than the dependent scope and permitted by tenant policy.
- Transitive dependencies remain visible in the plan with provenance and reason chains.
- Resolver output is advisory until an independent human approves the complete immutable plan.
- Unavailable APP-021, APP-022, or ENG-018 contracts are not fabricated; prerequisites depending on them remain unresolved.

The canonical rules are also supplied in `MASS-APP-015-V02_Dependency_Resolution_Rules.md`.

## 8. Plugin Lifecycle State Machine

Primary states are `requested`, `planning`, `awaiting_approval`, `approved`, `installing`, `installed`, `activating`, `active`, `suspending`, `suspended`, `upgrading`, `rolling_back`, `repairing`, `removing`, `removed`, `recovery_required`, and `failed`.

Transitions require expected current state, installation revision, approved plan digest, actor authorization, and idempotency key. Repeated commands return the original outcome. Stale revisions fail without side effects. Failure never reports the desired state; it records the completed step boundary and enters `recovery_required` or `failed`.

The authoritative diagram and transition guards are in `MASS-APP-015-V02_Plugin_Lifecycle_State_Machine.mmd`.

## 9. Installation, Activation, and Suspension

Installation creates tenant-scoped records, verifies package digest, records grants no broader than the manifest and approved tenant grant, applies V02-owned configuration schema changes, requests application-owned data migrations through the owning gateway, and performs readiness checks. `installed` means present but not executable.

Activation requires approved status, satisfied dependencies, completed migrations, healthy required checks, valid entitlement, current security decision, and an explicit authorized action. Runtime invocation remains V03. Suspension prevents new capability invocation through the future runtime contract while retaining installation state, evidence, configuration references, and owned data.

## 10. Upgrade, Downgrade, Rollback, and Repair

Every upgrade or downgrade creates a new plan comparing source and target digests, permissions, dependencies, configuration schema, application data migration requirements, compatibility, health criteria, and rollback feasibility. Permission expansion requires new approval. A downgrade is rejected when no safe migration/rollback path exists.

Rollback uses a previously approved rollback target and immutable checkpoint. It never invents reverse migrations. Repair revalidates the installed digest, dependencies, configuration references, grants, and health, then replays only explicitly idempotent steps. All actions preserve the prior version and evidence records.

## 11. Migration Ownership

V02 owns its installation metadata schema and plugin configuration-schema coordination. Each source application or engine owns its data. V02 records a migration contract reference, owner, checksum, preconditions, checkpoint, result, and compensation reference, but does not author or delete another owner's data. Irreversible migrations require explicit warning and approval; absent recovery evidence blocks activation.

Reference DDL: `MASS-APP-015-V02_Migration_Reference.sql`.

## 12. Health, Partial Failure, and Recovery

Health checks are declared, time-bounded, severity-classified, and attached to a lifecycle stage. Required readiness failures block activation. Degraded non-required checks may proceed only when the approved plan permits it.

Each execution step is `pending`, `running`, `succeeded`, `failed`, `compensated`, or `skipped_by_approved_plan`. On failure, V02 atomically records the failure and durable lifecycle/outbox evidence before recovery. Completed irreversible steps are never hidden. Recovery resumes from the last verified checkpoint or executes the approved compensation sequence. If audit/outbox persistence fails, the state transition fails and remains retryable.

## 13. Removal and Orphan Handling

Removal requires reverse-dependency analysis, suspension, final evidence capture, V02 metadata/configuration cleanup, and a retained tombstone. V02 never removes application- or engine-owned data. Required dependents block removal. Optional dependents receive explicit impact findings. Dependencies installed solely for the removed plugin become orphan candidates, never automatic deletions. Humans approve each candidate removal plan.

End-of-support and deprecation findings are visible in planning and health. An active unsupported version generates an advisory and remediation options; it is not silently upgraded or disabled unless separately authorized by policy and human action.

## 14. Organization and Scoped Installations

Organization installations may satisfy narrower workspace, project, or user dependencies only when the manifest, tenant policy, grants, and configuration isolation permit inheritance. Scoped installation records always retain their exact `scope_type` and `scope_id`. Promotion or widening is a new plan and approval, not an update in place.

## 15. API and Event Contracts

The API inventory is `MASS-APP-015-V02_API_Inventory.csv`. All mutation endpoints require `Idempotency-Key`, expected installation revision where applicable, actor authorization, and correlation identifiers. Contract examples are in `MASS-APP-015-V02_Installation_and_Rollback_Contract_Examples.json`.

Events include `plugin.installation.requested`, `plugin.installation.plan-created`, `plugin.installation.approved`, `plugin.installed`, `plugin.activation.requested`, `plugin.activated`, `plugin.suspended`, `plugin.upgrade.started`, `plugin.rollback.completed`, `plugin.recovery.required`, and `plugin.removed`. Events are written to the tenant outbox in the same transaction as the authoritative state change.

## 16. Security and Database Integrity

All 17 tenant-owned tables use `DEFAULT gen_random_uuid()` UUID primary keys, `UNIQUE(id, tenant_id)`, composite tenant-safe foreign keys, and `auth.jwt()`-derived RLS. Plan approvals, lifecycle decisions, append-only version snapshots, step evidence, migration checkpoints, rollback evidence, health observations, and audit/outbox records become immutable at their governing state. Triggers prohibit self-approval, stale-state mutation, direct state rewriting, and destructive evidence updates.

Secret values, license material, and deployment credentials are referenced but never copied into V02 records. Permissions equal the intersection of declared permissions, approved plan permissions, tenant policy, and actor grant.

## 17. Constitutional Boundary Statement

V02 may validate, plan, compare, recommend, coordinate an authorized lifecycle action, and preserve evidence. It cannot expand privilege, install undeclared dependencies, self-approve, imply runtime execution authority, duplicate deployment ownership, bypass license/security/privacy controls, remove another owner's data, suppress failures, or make an irreversible change without the approved bound plan.
