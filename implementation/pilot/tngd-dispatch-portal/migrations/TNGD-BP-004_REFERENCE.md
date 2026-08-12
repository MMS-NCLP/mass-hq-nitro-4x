# TNGD-BP-004 Provider-Neutral Persistence Reference

No persistence provider is authorized. A future governed migration must preserve:

- tenant-keyed Customer Records with normalized email and phone identity indexes;
- uniqueness of tenant plus source Intake Record conversion;
- tenant-safe foreign keys from Service Case to Customer and Intake Record;
- immutable intake evidence references and initial timeline entries;
- atomic customer match/create and case conversion;
- conflict rejection when email and phone resolve to different customers;
- RLS or equivalent tenant enforcement;
- immutable audit and outbox evidence;
- `ready-for-scheduling` as the BP-004 terminal handoff state.

