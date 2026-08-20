# Commerce Operations API Inventory

- Category administration: `createCategoryAuthorized`.
- Modifier administration: `createModifierSetAuthorized`.
- Catalog administration: `createItemAuthorized`, `updateItemAuthorized`, `deactivateItemAuthorized`, `listCatalogAuthorized`.
- Discount administration/application: `createDiscountAuthorized`, `applyDiscountAuthorized`.
- Commercial execution: `addCatalogLineAuthorized`, `addAdHocLineAuthorized`, `setDepositAuthorized`.
- Evidence: `historyAuthorized`.
- BP-009 adapter: `addCommerceLineItemAuthorized`, `applyCommerceTermsAuthorized`.
- BP-010/BP-011 handoff: authorization snapshots preserve commerce totals and `createFromAuthorizationAuthorized` creates the existing BP-011 invoice draft.

No alternate estimate, authorization, invoice, payment, receipt, refund, or reconciliation ledger is introduced.
