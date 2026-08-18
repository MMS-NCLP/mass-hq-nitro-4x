# TNGD-BP-013 — API Inventory

## Write Operations

| Method | Permission | Idempotent | Description |
|---|---|---|---|
| createPolicyAuthorized | operations.* | No | Create or version a warranty policy |
| registerWorkAuthorized | operations.exceptions.manage | Yes (idempotencyKey) | Register eligible completed work under policy |
| voidRegistrationAuthorized | operations.* | No | Void an active registration with required reason |
| createClaimAuthorized | operations.exceptions.manage | Yes (idempotencyKey) | Create warranty claim against registration |
| transitionClaimAuthorized | operations.exceptions.manage | No | Advance claim through lifecycle states |
| attachEvidenceAuthorized | operations.exceptions.manage | No | Attach governed evidence reference to claim |
| assessEligibilityAuthorized | operations.exceptions.manage | No | Evaluate eligibility (advisory only) |
| recordFindingAuthorized | operations.exceptions.manage | No | Record inspection finding with required description |
| submitDecisionAuthorized | operations.* | No | Submit coverage decision (self-approval prevented) |
| supersedeDecisionAuthorized | operations.* | No | Correct prior decision via superseding record |
| beginResolutionAuthorized | operations.exceptions.manage | No | Begin resolution work |
| completeResolutionAuthorized | operations.exceptions.manage | No | Complete resolution with summary and evidence |
| closeClaimAuthorized | operations.exceptions.manage | No | Close resolved claim |
| createHandoffAuthorized | operations.exceptions.manage | No | Hand off to TNGD-BP-014 only |

## Read Operations

| Method | Permission | Description |
|---|---|---|
| getRegistrationAuthorized | operations.read | Retrieve registration and coverage details |
| getClaimAuthorized | operations.read | Retrieve claim with current status |
| getClaimHistoryAuthorized | operations.read | Full event history for a claim |
| getDecisionsAuthorized | operations.read | All decisions for a claim |

## Forbidden Operations

| Method | Reason |
|---|---|
| processPaymentAuthorized | BP-013 does not process payments |
| deliverCommunicationAuthorized | BP-013 does not deliver communications |
| generateAiFindings | BP-013 does not generate AI findings |
| automateFollowUpAuthorized | BP-013 does not automate follow-up |

## Integration Consumed

| Source | What is Consumed |
|---|---|
| BP-004 | Customer and service case references |
| BP-005 | Appointment references (evidence attachment) |
| BP-008 | Inspection and media evidence references |
| BP-009 | Estimate, repair, work-item, completion evidence |
| BP-010 | Customer authorization evidence |
| BP-011 | Invoice and payment references |
| BP-012 | Reconciliation and exception evidence |
