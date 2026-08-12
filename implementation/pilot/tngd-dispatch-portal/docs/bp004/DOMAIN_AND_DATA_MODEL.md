# BP-004 Domain and Data Model

## Customer Record

Tenant-owned customer identity created or matched from the completed Guided Intake contact evidence. Matching uses normalized email and phone keys within one tenant. Conflicting keys never merge automatically.

## Service Case

An immutable initial case linked to one Customer Record and one source Intake Record. It preserves service address, need, urgency, equipment/project details, authorization, and source. Its initial status is `ready-for-scheduling`; BP-004 does not schedule it.

## Customer Timeline

The initial timeline contains a `ServiceCaseCreatedFromGuidedIntake` entry and references the immutable intake evidence rather than copying or replacing its authority.

## Persistence Boundary

State remains process-local and in-memory because no persistence provider is authorized. `migrations/TNGD-BP-004_REFERENCE.md` defines provider-neutral future requirements only.

