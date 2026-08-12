# BP-006 API Inventory

| Operation | Permission | Purpose |
|---|---|---|
| `configureProfileAuthorized` | `dispatch.manage` | Configure skills, capabilities, required finite travel radius, and governed integer daily/same-day/emergency limits |
| `addExceptionAuthorized` | `dispatch.manage` | Add all-day or bounded PTO, blackout, training, or administrative hold |
| `addOverrideAuthorized` | `dispatch.manage` | Record a reasoned temporary override with a finite non-negative integer amount |
| `calculateAuthorized` | `scheduling.manage` | Calculate date-scoped capacity from authoritative BP-005 appointments and a required finite non-negative travel distance |
