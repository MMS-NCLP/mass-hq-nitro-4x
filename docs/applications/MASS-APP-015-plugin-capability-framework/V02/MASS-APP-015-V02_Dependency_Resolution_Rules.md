# MASS-APP-015-V02 Dependency Resolution Rules

Status: Production Baseline v1.0

Authority: EWO-MASS-APP-015-V02

## Inputs

The resolver accepts a tenant, exact target scope, V01-published plugin version and digest, declared dependency edges, installed-version snapshot, environment/application versions, tenant policy, entitlement references, and requested permissions. Missing authoritative inputs produce an unresolved finding, never an assumption.

## Deterministic Resolution

1. Reject undeclared edges and unpublished, ineligible, or digest-mismatched versions.
2. Normalize each declared semantic-version range without broadening it.
3. Retain a healthy installed version when it satisfies every inbound range and scope rule.
4. Otherwise select the highest published, eligible, supported version satisfying all ranges.
5. Resolve required edges before optional edges, then verify peer edges and conflicts.
6. Sort executable steps topologically with canonical plugin name and version as stable tie-breakers.
7. Record every candidate, rejection reason, selected digest, reason chain, and omitted optional dependency.

## Edge Rules

| Kind | Rule | Blocking Condition |
|---|---|---|
| required | Must resolve and be included or already healthy | None compatible, cycle, scope violation, missing entitlement |
| optional | Included only when explicitly selected in the approved plan | Never silently installed; omitted impact recorded |
| peer | Must be installed or explicitly planned at a compatible scope/version | Absent or incompatible peer |
| conflict | Must not match any installed or planned node | Matching conflict remains |

Required cycles block the plan. Optional-only cycles are omitted. Mixed cycles block if any required path participates. Organization dependencies may satisfy narrower scopes only with policy-approved inheritance. A narrower dependency never satisfies a broader dependent.

## Human Decision Boundary

The resolver recommends but does not approve. Conflicts, alternative candidates, permission deltas, unsupported versions, irreversible migrations, and orphan-removal candidates require explicit human disposition. A changed graph or manifest digest invalidates prior approval.

## Output Contract

Output contains `resolution_id`, input snapshot digest, ordered nodes/edges, exact versions and package digests, selected/omitted status, reason chains, conflicts, warnings, required approvals, and a deterministic `graph_digest`. It is immutable once attached to an approved installation plan.
