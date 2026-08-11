# BP-003 Permission and Audit/Event Model

## Permission Matrix

| Actor | Start/answer/attach/complete | Resume/read | Boundary |
|---|---:|---:|---|
| Tenant administrator | Yes | Yes | Tenant only |
| Administrative dispatcher | Yes | Yes | Tenant only |
| Manager | No | Yes | Tenant only |
| Technician | No | No | Assigned-job permissions remain unchanged |
| Executive | No | No | Reporting permissions remain unchanged |
| Public caller | No | No | BP-002 public `intake.submit` remains separate |

Permissions are inherited from the accepted BP-001 role matrix: writes use `intake.create`; reads use `intake.read`. Tenant mismatch and missing permissions are denied before guided-intake state changes.

## Audit Events

| Event | Action | Meaning |
|---|---|---|
| `GuidedIntakeStarted` | `intake.create` | A draft was opened with path and source. |
| `GuidedIntakeAnswerSaved` | `intake.create` | One validated primary answer was autosaved. |
| `GuidedIntakeResumed` | `intake.read` | An authorized user resumed a saved session. |
| `GuidedIntakeMediaAttached` | `intake.create` | A governed media reference was attached. |
| `GuidedIntakeCompleted` | `intake.create` | An immutable record became ready for BP-004. |

Each event uses the existing non-discarding, hash-chained BP-001 audit log. The completed Intake Record retains the identifiers of its guided-intake lifecycle events.
