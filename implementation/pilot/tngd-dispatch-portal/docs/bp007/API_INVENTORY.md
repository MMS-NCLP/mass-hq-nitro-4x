# BP-007 API Inventory

Operations: create/list work items; request recommendations; approve assignment; reassign; return to queue; dispatch; cancel; inspect history; create/resolve exceptions; retrieve assigned-technician handoff. Dispatch changes require `dispatch.manage`; exceptions require `operations.exceptions.manage`; handoff requires `jobs.assigned.read` and matching assignment.
