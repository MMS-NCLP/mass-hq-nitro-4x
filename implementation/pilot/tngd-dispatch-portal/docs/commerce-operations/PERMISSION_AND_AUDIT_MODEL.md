# Commerce Operations Permission and Audit Model

Tenant administrators and managers administer catalog configuration through `operations.commerce.manage`, inherited from the accepted `operations.*` authority. Dispatch users may apply ordinary configured discounts, deposits, and catalog lines through existing `jobs.update` authority. Approval-controlled discounts and custom deposits require `operations.commerce.manage` and a reason. Technicians may add attributed ad-hoc lines only through their existing assigned-job evidence boundary.

Every configuration change and governed override records tenant, actor, timestamp, resource, event type, and material metadata in the existing append-only audit chain. Tenant ownership is checked for every referenced category, modifier set, catalog item, and discount.
