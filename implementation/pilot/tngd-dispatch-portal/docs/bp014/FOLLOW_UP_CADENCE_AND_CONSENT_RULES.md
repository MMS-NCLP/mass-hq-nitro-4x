# TNGD-BP-014 — Follow-Up Cadence and Consent Rules

## Five Roadmap Cadences

| Cadence | Offset from Scheduling | Use Case |
|---|---|---|
| immediate | 0 days | Post-service satisfaction check |
| short-term | 7 days | Review request, quick follow-up |
| two-month | 60 days | Estimate follow-up, relationship check |
| six-month | 180 days | Maintenance reminder, relationship |
| annual | 365 days | Annual maintenance, relationship flywheel |

## Five Activity Types

| Type | Purpose |
|---|---|
| satisfaction | Post-service satisfaction survey |
| review-request | Request for online review |
| estimate | Follow up on pending estimates |
| maintenance | Scheduled maintenance reminder |
| relationship | Ongoing relationship engagement |

## Activity Lifecycle

```text
due → eligible → handed-off → completed
                             → failed → due (retry)
     → suppressed
     → cancelled

due → superseded (via reschedule)
```

### Valid Transitions

| From | To |
|---|---|
| due | eligible, suppressed, cancelled |
| eligible | suppressed, handed-off, cancelled |
| handed-off | completed, failed |
| failed | due, cancelled |

Completed, superseded, cancelled, and suppressed are terminal states.

## Consent Rules

1. Eligibility evaluation checks consent — ineligible if `consentGranted: false`
2. Both task and communication handoffs require `consentGranted: true` at creation time
3. Consent recheck at any point can suppress an activity with reason "consent-withdrawn"
4. Opt-out creates an immutable suppression record
5. Suppression evidence cannot be erased — it is preserved for audit

## Handoff Boundaries

| Handoff Type | Target | Purpose |
|---|---|---|
| Task | APP-012 (Workflow) | Internal task creation for follow-up action |
| Communication | APP-006 (Communications) | Governed message delivery |

BP-014 creates handoffs only. It never delivers messages directly.

## Rescheduling Rules

- Rescheduling requires a non-empty reason
- The original activity is marked "superseded" (immutable)
- A new activity is created with the new cadence
- The new activity links back to the superseded original via `supersedes`
