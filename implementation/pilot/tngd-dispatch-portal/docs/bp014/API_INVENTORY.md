# TNGD-BP-014 — API Inventory

## Write Operations

| Method | Permission | Idempotent | Description |
|---|---|---|---|
| createPolicyAuthorized | operations.* | No | Create follow-up policy with cadences and activity types |
| versionPolicyAuthorized | operations.* | No | Create new policy version |
| evaluateEligibilityAuthorized | operations.exceptions.manage | No | Evaluate consent-based eligibility |
| scheduleActivityAuthorized | operations.exceptions.manage | Yes (idempotencyKey) | Schedule follow-up activity at cadence |
| transitionActivityAuthorized | operations.exceptions.manage | No | Advance activity through lifecycle |
| recheckConsentAuthorized | operations.exceptions.manage | No | Recheck consent, suppress if withdrawn |
| suppressActivityAuthorized | operations.exceptions.manage | No | Suppress with required reason |
| rescheduleActivityAuthorized | operations.exceptions.manage | No | Supersede and create rescheduled activity |
| createTaskHandoffAuthorized | operations.exceptions.manage | Yes (idempotencyKey) | Hand off to APP-012 workflow boundary |
| createCommunicationHandoffAuthorized | operations.exceptions.manage | Yes (idempotencyKey) | Hand off to APP-006 Communications boundary |
| recordHandoffOutcomeAuthorized | operations.exceptions.manage | No | Record completed or failed outcome |

## Read Operations

| Method | Permission | Description |
|---|---|---|
| getActivityAuthorized | operations.read | Retrieve single activity |
| listActivitiesAuthorized | operations.read | List activities by tenant/customer |
| getHistoryAuthorized | operations.read | Full event history for a subject |

## Forbidden Operations

| Method | Reason |
|---|---|
| deliverEmailAuthorized | BP-014 does not deliver email directly |
| deliverSmsAuthorized | BP-014 does not deliver SMS directly |
| createConsentAuthorized | BP-014 does not create consent |
| publishReviewAuthorized | BP-014 does not publish reviews |
| processPaymentAuthorized | BP-014 does not process payments |
| generateReportAuthorized | BP-014 does not generate reports |

## Integration Consumed

| Source | What is Consumed |
|---|---|
| BP-004 | Customer, service case, consent references |
| BP-009 | Estimate and completed-work references |
| BP-011 | Invoice, payment, receipt references |
| BP-012 | Reconciliation and exception outcomes |
| BP-013 | Warranty records and claim outcomes |
| APP-006 | Communications delivery boundary (handoff target) |
| APP-012 | Workflow orchestration boundary (handoff target) |
