# TNGD-BP-013 — Audit and Event Model

## Audit Events

All write operations produce audit log entries through the shared `auditLog` facility established in BP-001.

| Event | Trigger | Key Data |
|---|---|---|
| warranty.policy.created | createPolicyAuthorized | policyId, name, version, coverage days |
| warranty.registration.created | registerWorkAuthorized | registrationId, policyId, policyVersion, sourceJobId |
| warranty.registration.voided | voidRegistrationAuthorized | registrationId, reason |
| warranty.claim.created | createClaimAuthorized | claimId, registrationId, issueDescription |
| warranty.claim.transitioned | transitionClaimAuthorized | claimId, fromStatus, toStatus |
| warranty.evidence.attached | attachEvidenceAuthorized | claimId, sourceType, sourceId |
| warranty.eligibility.assessed | assessEligibilityAuthorized | claimId, partsEligible, serviceEligible |
| warranty.finding.recorded | recordFindingAuthorized | claimId, findingId, description |
| warranty.decision.submitted | submitDecisionAuthorized | claimId, decisionId, outcome, resolutionClass |
| warranty.decision.superseded | supersedeDecisionAuthorized | claimId, originalDecisionId, newDecisionId |
| warranty.resolution.started | beginResolutionAuthorized | claimId |
| warranty.resolution.completed | completeResolutionAuthorized | claimId, resolutionSummary |
| warranty.claim.closed | closeClaimAuthorized | claimId |
| warranty.handoff.created | createHandoffAuthorized | claimId, targetPackage, category |

## Immutability

- Finalized coverage decisions cannot be modified; corrections create a new superseding decision
- Evidence references are immutable once attached
- Submitted findings are immutable once recorded
- Resolution records are immutable once completed
- Claim history provides a complete, append-only view of all events

## Event Chain

Each event records the acting principal, tenant, timestamp, and is preserved in the audit log for the lifetime of the system. No silent event or evidence loss is permitted.
