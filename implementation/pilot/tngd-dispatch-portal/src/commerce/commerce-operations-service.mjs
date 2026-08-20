import { randomUUID } from "node:crypto";

const freeze = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) freeze(child);
  return value;
};

const text = (value, label) => {
  const normalized = String(value ?? "").trim();
  if (!normalized) throw new Error(`${label} is required.`);
  return normalized;
};

const cents = (value, label) => {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative safe integer in cents.`);
  }
  return value;
};

const quantity = (value) => {
  if (!Number.isFinite(value) || value <= 0) throw new Error("Quantity must be finite and greater than zero.");
  return value;
};

const basisPoints = (value, label) => {
  if (!Number.isInteger(value) || value < 0 || value > 10000) {
    throw new Error(`${label} must be integer basis points from 0 through 10000.`);
  }
  return value;
};

export class CommerceOperationsService {
  #categories = new Map();
  #modifierSets = new Map();
  #items = new Map();
  #discounts = new Map();
  #history = new Map();
  #secure;
  #execution;
  #audit;
  #now;

  constructor({ secureAccess, repairEstimateService, auditLog, now = () => new Date() } = {}) {
    if (!secureAccess || !repairEstimateService || !auditLog) {
      throw new Error("Commerce Operations requires security, BP-009 execution, and audit contracts.");
    }
    this.#secure = secureAccess;
    this.#execution = repairEstimateService;
    this.#audit = auditLog;
    this.#now = now;
  }

  createCategoryAuthorized({ sessionToken, tenantId, name, parentCategoryId = null, externalReferences = [] }) {
    const actor = this.#manage(sessionToken, tenantId, "category:new");
    if (parentCategoryId) this.#owned(this.#categories, tenantId, parentCategoryId, "Category");
    const category = freeze({
      id: randomUUID(), tenantId, name: text(name, "Category name"), parentCategoryId,
      externalReferences: structuredClone(externalReferences), active: true,
      createdBy: actor.id, createdAt: this.#now().toISOString(), revision: 1
    });
    this.#categories.set(category.id, category);
    this.#append(category, actor, "CommerceCategoryCreated");
    return category;
  }

  createModifierSetAuthorized({ sessionToken, tenantId, name, options, required = false, minimumSelections = 0, maximumSelections = 1 }) {
    const actor = this.#manage(sessionToken, tenantId, "modifier-set:new");
    if (!Array.isArray(options) || !options.length || !Number.isInteger(minimumSelections) || !Number.isInteger(maximumSelections) || minimumSelections < 0 || maximumSelections < Math.max(1, minimumSelections)) {
      throw new Error("Modifier set requires governed options and valid selection limits.");
    }
    const normalizedOptions = options.map((option) => freeze({
      id: option.id || randomUUID(),
      name: text(option.name, "Modifier option name"),
      priceDeltaCents: cents(option.priceDeltaCents ?? 0, "Modifier price delta")
    }));
    if (new Set(normalizedOptions.map((option) => option.id)).size !== normalizedOptions.length) throw new Error("Modifier option identifiers must be unique.");
    const modifierSet = freeze({
      id: randomUUID(), tenantId, name: text(name, "Modifier set name"), options: normalizedOptions,
      required: Boolean(required), minimumSelections: required ? Math.max(1, minimumSelections) : minimumSelections,
      maximumSelections, active: true, createdBy: actor.id, createdAt: this.#now().toISOString(), revision: 1
    });
    this.#modifierSets.set(modifierSet.id, modifierSet);
    this.#append(modifierSet, actor, "CommerceModifierSetCreated");
    return modifierSet;
  }

  createItemAuthorized({ sessionToken, tenantId, type, categoryId, subcategoryId = null, name, description, internalCode = null, costCents = 0, sellPriceCents = 0, unit = "each", allowFractionalQuantity = false, tax = {}, modifierSetIds = [], externalReferences = [] }) {
    const actor = this.#manage(sessionToken, tenantId, "catalog-item:new");
    if (!["item", "service"].includes(type)) throw new Error("Catalog type must be item or service.");
    const category = this.#owned(this.#categories, tenantId, categoryId, "Category");
    if (subcategoryId) {
      const subcategory = this.#owned(this.#categories, tenantId, subcategoryId, "Subcategory");
      if (subcategory.parentCategoryId !== category.id) throw new Error("Subcategory must belong to the selected category.");
    }
    for (const id of modifierSetIds) this.#owned(this.#modifierSets, tenantId, id, "Modifier set");
    const item = freeze({
      id: randomUUID(), tenantId, type, categoryId, subcategoryId,
      name: text(name, "Catalog name"), description: text(description, "Customer-facing description"),
      internalCode: internalCode ? text(internalCode, "Internal code") : null,
      costCents: cents(costCents, "Cost"), sellPriceCents: cents(sellPriceCents, "Sell price"),
      unit: text(unit, "Unit"), allowFractionalQuantity: Boolean(allowFractionalQuantity),
      tax: freeze({ taxable: Boolean(tax.taxable), classification: tax.classification ? text(tax.classification, "Tax classification") : null, reference: tax.reference ? String(tax.reference) : null, rateBasisPoints: tax.taxable ? basisPoints(tax.rateBasisPoints ?? 0, "Tax rate") : 0 }),
      modifierSetIds: freeze([...modifierSetIds]), externalReferences: freeze(structuredClone(externalReferences)),
      active: true, available: true, createdBy: actor.id, createdAt: this.#now().toISOString(), revision: 1
    });
    this.#items.set(item.id, item);
    this.#append(item, actor, "CommerceCatalogItemCreated", { type, categoryId });
    return item;
  }

  updateItemAuthorized({ sessionToken, tenantId, itemId, changes }) {
    const actor = this.#manage(sessionToken, tenantId, `catalog-item:${itemId}`);
    const current = this.#owned(this.#items, tenantId, itemId, "Catalog item");
    const allowed = ["name", "description", "internalCode", "costCents", "sellPriceCents", "unit", "allowFractionalQuantity", "available", "tax", "modifierSetIds", "externalReferences"];
    if (Object.keys(changes || {}).some((key) => !allowed.includes(key))) throw new Error("Catalog update contains an unsupported field.");
    const nextInput = { ...structuredClone(current), ...structuredClone(changes) };
    if (changes.costCents !== undefined) cents(changes.costCents, "Cost");
    if (changes.sellPriceCents !== undefined) cents(changes.sellPriceCents, "Sell price");
    if (changes.modifierSetIds) for (const id of changes.modifierSetIds) this.#owned(this.#modifierSets, tenantId, id, "Modifier set");
    if (changes.tax) nextInput.tax = { taxable: Boolean(changes.tax.taxable), classification: changes.tax.classification ? text(changes.tax.classification, "Tax classification") : null, reference: changes.tax.reference ? String(changes.tax.reference) : null, rateBasisPoints: changes.tax.taxable ? basisPoints(changes.tax.rateBasisPoints ?? 0, "Tax rate") : 0 };
    const next = freeze({ ...nextInput, updatedBy: actor.id, updatedAt: this.#now().toISOString(), revision: current.revision + 1 });
    this.#items.set(itemId, next);
    this.#append(next, actor, "CommerceCatalogItemUpdated", { changedFields: Object.keys(changes || {}) });
    return next;
  }

  deactivateItemAuthorized({ sessionToken, tenantId, itemId, reason }) {
    const actor = this.#manage(sessionToken, tenantId, `catalog-item:${itemId}:deactivate`);
    const current = this.#owned(this.#items, tenantId, itemId, "Catalog item");
    const next = freeze({ ...current, active: false, available: false, deactivationReason: text(reason, "Deactivation reason"), updatedBy: actor.id, updatedAt: this.#now().toISOString(), revision: current.revision + 1 });
    this.#items.set(itemId, next);
    this.#append(next, actor, "CommerceCatalogItemDeactivated", { reason: next.deactivationReason });
    return next;
  }

  createDiscountAuthorized({ sessionToken, tenantId, name, kind, value, scope = "transaction", maximumAmountCents = null, requiresApproval = false }) {
    const actor = this.#manage(sessionToken, tenantId, "discount:new");
    if (!["fixed", "percentage"].includes(kind) || !["line", "transaction"].includes(scope)) throw new Error("Discount kind and scope must be governed.");
    if (kind === "fixed") cents(value, "Fixed discount");
    if (kind === "percentage") basisPoints(value, "Percentage discount");
    if (maximumAmountCents !== null) cents(maximumAmountCents, "Maximum discount");
    const discount = freeze({ id: randomUUID(), tenantId, name: text(name, "Discount name"), kind, value, scope, maximumAmountCents, requiresApproval: Boolean(requiresApproval), active: true, createdBy: actor.id, createdAt: this.#now().toISOString(), revision: 1 });
    this.#discounts.set(discount.id, discount);
    this.#append(discount, actor, "CommerceDiscountCreated");
    return discount;
  }

  addCatalogLineAuthorized({ sessionToken, tenantId, recordId, itemId, selectedModifierOptionIds = [], quantity: requestedQuantity = 1 }) {
    const item = this.#owned(this.#items, tenantId, itemId, "Catalog item");
    if (!item.active || !item.available) throw new Error("Catalog item is not available.");
    const selectedModifiers = this.#selectModifiers(tenantId, item, selectedModifierOptionIds);
    const governedQuantity = quantity(requestedQuantity);
    if (!item.allowFractionalQuantity && !Number.isInteger(governedQuantity)) throw new Error("Catalog item requires a whole-number quantity.");
    const amountCents = Math.round((item.sellPriceCents + selectedModifiers.reduce((sum, option) => sum + option.priceDeltaCents, 0)) * governedQuantity);
    return this.#execution.addCommerceLineItemAuthorized({ sessionToken, tenantId, recordId, lineItem: freeze({
      source: "catalog", catalogItemId: item.id, catalogRevision: item.revision, name: item.name,
      description: item.description, category: "Work", quantity: governedQuantity, unit: item.unit,
      unitPriceCents: item.sellPriceCents, amountCents, tax: structuredClone(item.tax),
      modifiers: selectedModifiers.map((option) => structuredClone(option)), createdAt: this.#now().toISOString()
    }) });
  }

  addAdHocLineAuthorized({ sessionToken, tenantId, recordId, description, quantity: requestedQuantity = 1, unitPriceCents, tax = {}, reason }) {
    const principal = this.#secure.validateSession(sessionToken);
    if (principal.tenantId !== tenantId) throw new Error("Tenant mismatch.");
    const amountCents = Math.round(cents(unitPriceCents, "Ad-hoc unit price") * quantity(requestedQuantity));
    return this.#execution.addCommerceLineItemAuthorized({ sessionToken, tenantId, recordId, lineItem: freeze({
      source: "ad-hoc", catalogItemId: null, name: text(description, "Ad-hoc line description"),
      description: text(description, "Ad-hoc line description"), category: "Work", quantity: requestedQuantity,
      unit: "each", unitPriceCents, amountCents,
      tax: freeze({ taxable: Boolean(tax.taxable), classification: tax.classification ? text(tax.classification, "Tax classification") : null, reference: tax.reference ? String(tax.reference) : null, rateBasisPoints: tax.taxable ? basisPoints(tax.rateBasisPoints ?? 0, "Tax rate") : 0 }),
      modifiers: [], createdBy: principal.id, createdAt: this.#now().toISOString(), authorizationReason: text(reason, "Ad-hoc authorization reason")
    }) });
  }

  applyDiscountAuthorized({ sessionToken, tenantId, recordId, discountId, lineItemId = null, approvalReason = null }) {
    const discount = this.#owned(this.#discounts, tenantId, discountId, "Discount");
    if (!discount.active) throw new Error("Discount is inactive.");
    const actor = this.#secure.requirePermission({ sessionToken, tenantId, permission: discount.requiresApproval ? "operations.commerce.manage" : "jobs.update", resourceId: `execution:${recordId}:discount` });
    return this.#execution.applyCommerceTermsAuthorized({ sessionToken, tenantId, recordId, discount: freeze({
      id: randomUUID(), discountDefinitionId: discount.id, definitionRevision: discount.revision, name: discount.name,
      kind: discount.kind, value: discount.value, scope: discount.scope, lineItemId,
      maximumAmountCents: discount.maximumAmountCents, approvedBy: actor.id,
      approvalReason: discount.requiresApproval ? text(approvalReason, "Discount approval reason") : approvalReason,
      appliedAt: this.#now().toISOString()
    }) });
  }

  setDepositAuthorized({ sessionToken, tenantId, recordId, kind, value = 0, reason = null }) {
    if (!["none", "fixed", "percentage", "custom"].includes(kind)) throw new Error("Deposit kind must be none, fixed, percentage, or custom.");
    if (["fixed", "custom"].includes(kind)) cents(value, "Deposit");
    if (kind === "percentage") basisPoints(value, "Deposit percentage");
    const permission = kind === "custom" ? "operations.commerce.manage" : "jobs.update";
    const actor = this.#secure.requirePermission({ sessionToken, tenantId, permission, resourceId: `execution:${recordId}:deposit` });
    return this.#execution.applyCommerceTermsAuthorized({ sessionToken, tenantId, recordId, deposit: freeze({ kind, value, configuredBy: actor.id, reason: kind === "custom" ? text(reason, "Custom deposit reason") : reason, configuredAt: this.#now().toISOString() }) });
  }

  listCatalogAuthorized({ sessionToken, tenantId, includeInactive = false }) {
    this.#secure.requirePermission({ sessionToken, tenantId, permission: "jobs.read", resourceId: "commerce:catalog" });
    return freeze([...this.#items.values()].filter((item) => item.tenantId === tenantId && (includeInactive || item.active)));
  }

  historyAuthorized({ sessionToken, tenantId, resourceId }) {
    this.#secure.requirePermission({ sessionToken, tenantId, permission: "operations.read", resourceId: `commerce:${resourceId}:history` });
    return freeze([...(this.#history.get(resourceId) || [])]);
  }

  #manage(sessionToken, tenantId, resourceId) {
    return this.#secure.requirePermission({ sessionToken, tenantId, permission: "operations.commerce.manage", resourceId: `commerce:${resourceId}` });
  }

  #owned(map, tenantId, id, label) {
    const value = map.get(id);
    if (!value || value.tenantId !== tenantId) throw new Error(`${label} not found for tenant.`);
    return value;
  }

  #selectModifiers(tenantId, item, selectedIds) {
    const selected = [];
    for (const setId of item.modifierSetIds) {
      const set = this.#owned(this.#modifierSets, tenantId, setId, "Modifier set");
      const choices = set.options.filter((option) => selectedIds.includes(option.id));
      if (choices.length < set.minimumSelections || choices.length > set.maximumSelections) throw new Error(`Modifier selections for ${set.name} violate governed limits.`);
      selected.push(...choices.map((option) => freeze({ ...structuredClone(option), modifierSetId: set.id, modifierSetName: set.name, modifierSetRevision: set.revision })));
    }
    if (selectedIds.some((id) => !selected.some((option) => option.id === id))) throw new Error("Selected modifier option is not attached to the catalog item.");
    return selected;
  }

  #append(resource, actor, type, metadata = {}) {
    const event = freeze({ id: randomUUID(), type, actorId: actor.id, occurredAt: this.#now().toISOString(), metadata: structuredClone(metadata) });
    this.#history.set(resource.id, [...(this.#history.get(resource.id) || []), event]);
    this.#audit.append({ tenantId: resource.tenantId, principalId: actor.id, type, resource: `commerce:${resource.id}`, action: "operations.commerce.manage", outcome: "granted", metadata: event.metadata });
  }
}
