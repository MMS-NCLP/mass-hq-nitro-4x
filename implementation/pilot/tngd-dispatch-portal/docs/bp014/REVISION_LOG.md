# TNGD-BP-014 — Revision Log

## V1.0 — Initial Manufacturing

- **Date:** 2026-08-18
- **Authority:** TNGD-BP-014 Work Order
- **Changes:** Initial implementation of Customer Follow-Up and Relationship Flywheel
  - 8 entities: FollowUpPolicy, FollowUpPolicyVersion, FollowUpEligibility, FollowUpActivity, FollowUpSuppression, FollowUpTaskHandoff, CommunicationHandoff, FollowUpHistory
  - 11 write operations, 3 read operations, 6 forbidden scope stubs
  - 5 cadences: immediate, short-term, two-month, six-month, annual
  - 5 activity types: satisfaction, review-request, estimate, maintenance, relationship
  - Consent verification at eligibility and handoff
  - Communications-only delivery via APP-006 boundary
  - Reasoned rescheduling with supersession
  - In-memory V1 persistence
- **Limitations:** V1 in-memory persistence; production Supabase migration deferred per pilot standard
