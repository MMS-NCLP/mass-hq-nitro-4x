# TNGD-BP-014 — Permission Matrix

## Role-to-Operation Mapping

| Operation | tenant_admin | manager | admin_dispatch | technician | executive |
|---|---|---|---|---|---|
| createPolicyAuthorized | Yes | Yes | No | No | No |
| versionPolicyAuthorized | Yes | Yes | No | No | No |
| evaluateEligibilityAuthorized | Yes | Yes | Yes | No | No |
| scheduleActivityAuthorized | Yes | Yes | Yes | No | No |
| transitionActivityAuthorized | Yes | Yes | Yes | No | No |
| recheckConsentAuthorized | Yes | Yes | Yes | No | No |
| suppressActivityAuthorized | Yes | Yes | Yes | No | No |
| rescheduleActivityAuthorized | Yes | Yes | Yes | No | No |
| createTaskHandoffAuthorized | Yes | Yes | Yes | No | No |
| createCommunicationHandoffAuthorized | Yes | Yes | Yes | No | No |
| recordHandoffOutcomeAuthorized | Yes | Yes | Yes | No | No |
| getActivityAuthorized | Yes | Yes | Yes | No | Yes |
| listActivitiesAuthorized | Yes | Yes | Yes | No | Yes |
| getHistoryAuthorized | Yes | Yes | Yes | No | Yes |

## Consent Enforcement

- Consent is verified at eligibility evaluation AND at handoff creation
- Handoffs with `consentGranted: false` are rejected
- Consent withdrawal triggers automatic suppression with "opt-out" reason
- Suppression evidence is immutable — it cannot be erased or overwritten

## Tenant Isolation

All operations enforce same-tenant validation. Cross-tenant access is rejected.
