# TNGD-BP-014 — Audit and Event Model

## Audit Events

| Event | Trigger | Key Data |
|---|---|---|
| followup.policy.created | createPolicyAuthorized | policyId, name, version |
| followup.policy.versioned | versionPolicyAuthorized | policyId, version |
| followup.eligibility.evaluated | evaluateEligibilityAuthorized | customerId, cadence, activityType, eligible |
| followup.activity.scheduled | scheduleActivityAuthorized | cadence, activityType, dueAt |
| followup.activity.transitioned | transitionActivityAuthorized | from, to, reason |
| followup.activity.suppressed | recheckConsentAuthorized / suppressActivityAuthorized | reason (opt-out or manual) |
| followup.consent.rechecked | recheckConsentAuthorized | consentGranted |
| followup.activity.superseded | rescheduleActivityAuthorized | reason, replacedBy |
| followup.task-handoff.created | createTaskHandoffAuthorized | handoffId, taskDescription |
| followup.comm-handoff.created | createCommunicationHandoffAuthorized | handoffId, channel, targetBoundary |
| followup.outcome.recorded | recordHandoffOutcomeAuthorized | outcome, outcomeReference |

## Immutability

- Completed, superseded, and cancelled activities cannot be suppressed or rescheduled
- Suppression records are immutable once created
- Handoff records are immutable once created
- History provides a complete, append-only view of all events

## Event Chain

Each event records the acting principal, tenant, timestamp, and is preserved in the audit log. No silent event or evidence loss is permitted.
