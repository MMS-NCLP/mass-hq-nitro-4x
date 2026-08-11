# BP-003 Questionnaire and Conditional Rules

The guided intake engine presents exactly one of eight primary question groups at a time. A conditional field remains part of its parent group and never increments the primary-question count.

| # | ID | Purpose | Required fields | Conditional rule |
|---:|---|---|---|---|
| 1 | `customerIdentity` | Identify the customer | `name` | Existing-customer references may be supplied without replacing the preserved name evidence. |
| 2 | `contactInformation` | Capture contact method | `phone`, `email`, `preferredContact` | None. |
| 3 | `serviceAddress` | Locate the requested service | `address` | None. |
| 4 | `serviceSubtype` | Classify the selected BP-002 path | `serviceSubtype` | Labels may adapt to Repair, Estimate, or Other Services. |
| 5 | `customerNeed` | Preserve the customer's need or problem | `description` | None. |
| 6 | `safetyUrgency` | Record advisory safety and urgency information | `urgency`, `safetyConcern` | `safetyDetails` is required when `safetyConcern` is true. No automated emergency decision is made. |
| 7 | `equipmentProjectDetails` | Capture relevant path detail | Path-dependent | Repair requires `equipmentDetails`; Estimate requires `projectDetails`; Other Services requires `serviceDetails`. |
| 8 | `availabilityAuthorization` | Capture availability and authorization evidence | `availability`, `authorizedToProceed` | Boolean false is preserved as a valid answer rather than silently converted to approval. |

Answers are validated and autosaved after each primary question. An invalid or out-of-order answer does not advance the session. The session can be resumed at the first unanswered question. Photo and voice-note content remains in the governed APP-004/APP-012 media boundary; BP-003 stores immutable references and original metadata only.
