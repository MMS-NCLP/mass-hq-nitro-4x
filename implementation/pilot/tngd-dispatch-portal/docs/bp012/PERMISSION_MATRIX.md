# BP-012 Permission Matrix

| Role | Queue | Review | Exceptions | Resolve | Escalate | Handoffs | Outstanding | Read |
|---|---|---|---|---|---|---|---|---|
| Administrative Coordinator (`admin_dispatch`) | Yes | Yes | Yes | Yes* | Yes | Yes | No | No |
| Manager | Yes | Yes | Yes | Yes* | Yes | Yes | Yes | Yes |
| Dispatch Administrator (`admin_dispatch`) | Yes | Yes | Yes | Yes* | Yes | Yes | No | No |
| Finance Steward (`admin_dispatch`) | Yes | Yes | Yes | Yes* | Yes | Yes | No | No |
| Technician | No | No | No | No | No | No | No | No |
| Tenant Administrator | Yes | Yes | Yes | Yes* | Yes | Yes | Yes | Yes |
| Executive | No | No | No | No | No | No | Yes | Yes |

*Self-approval prevention: the principal who created an exception cannot resolve it. A different authorized user must approve the resolution.

Write operations use `operations.exceptions.manage`. Read and outstanding operations use `operations.read`. The `manager` and `tenant_admin` roles hold `operations.*`, granting both. The `admin_dispatch` role holds `operations.exceptions.manage` only. The `executive` role holds `operations.read` only.
