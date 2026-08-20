export const commerceOperationsManifest = Object.freeze({
  workOrderId: "TNGD-DISPATCH-V1-COMMERCE-OPS",
  consumes: Object.freeze(["TNGD-BP-009", "TNGD-BP-010", "TNGD-BP-011", "TNGD-BP-012"]),
  entities: Object.freeze(["CommerceCategory", "ModifierSet", "CatalogItem", "DiscountDefinition", "CommercialLineSnapshot", "DepositRequirement"]),
  discountKinds: Object.freeze(["fixed", "percentage"]),
  depositKinds: Object.freeze(["none", "fixed", "percentage", "custom"]),
  paymentAuthority: "TNGD-BP-011",
  persistence: Object.freeze({ boundary: "in-memory", migrationLocation: "migrations" })
});
