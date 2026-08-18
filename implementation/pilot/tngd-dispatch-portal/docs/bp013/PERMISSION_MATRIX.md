# TNGD-BP-013 — Permission Matrix

## Role-to-Operation Mapping

| Operation | tenant_admin | manager | admin_dispatch | technician | executive |
|---|---|---|---|---|---|
| createPolicyAuthorized | Yes | Yes | No | No | No |
| registerWorkAuthorized | Yes | No | Yes | No | No |
| voidRegistrationAuthorized | Yes | Yes | No | No | No |
| createClaimAuthorized | Yes | No | Yes | No | No |
| transitionClaimAuthorized | Yes | No | Yes | No | No |
| attachEvidenceAuthorized | Yes | No | Yes | No | No |
| assessEligibilityAuthorized | Yes | No | Yes | No | No |
| recordFindingAuthorized | Yes | No | Yes | No | No |
| submitDecisionAuthorized | Yes | Yes | No | No | No |
| supersedeDecisionAuthorized | Yes | Yes | No | No | No |
| beginResolutionAuthorized | Yes | No | Yes | No | No |
| completeResolutionAuthorized | Yes | No | Yes | No | No |
| closeClaimAuthorized | Yes | No | Yes | No | No |
| createHandoffAuthorized | Yes | No | Yes | No | No |
| getRegistrationAuthorized | Yes | Yes | Yes | No | Yes |
| getClaimAuthorized | Yes | Yes | Yes | No | Yes |
| getClaimHistoryAuthorized | Yes | Yes | Yes | No | Yes |
| getDecisionsAuthorized | Yes | Yes | Yes | No | Yes |

## Permission Boundaries

- **operations.***: Policy creation, coverage decisions (manager, tenant_admin)
- **operations.exceptions.manage**: Registration, claims, evidence, findings, resolution, handoffs (admin_dispatch, tenant_admin)
- **operations.read**: Read-only access to registrations, claims, history, decisions (executive, and all roles above)

## Self-Approval Prevention

The claim creator (identified by `createdBy`) cannot submit a coverage decision on their own claim. This is enforced at the service level regardless of role.

## Tenant Isolation

All operations enforce same-tenant validation. Cross-tenant access is rejected with permission denied.
