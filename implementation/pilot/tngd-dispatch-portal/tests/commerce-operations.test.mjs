import assert from "node:assert/strict";
import test from "node:test";
import { CommerceOperationsService } from "../src/commerce/index.mjs";
import { CustomerAuthorizationService } from "../src/customer-authorization/index.mjs";
import { InvoicePaymentService } from "../src/invoicing/index.mjs";
import { RepairEstimateService } from "../src/repair-estimate/index.mjs";
import { AuditLog, SecureAccess } from "../src/security/index.mjs";

const T = "tenant-tngd";
const P = "correct horse battery staple";

async function setup() {
  const now = new Date("2026-08-20T12:00:00Z");
  const auditLog = new AuditLog({ now: () => now });
  const secureAccess = new SecureAccess({ auditLog, now: () => now });
  await secureAccess.bootstrapTenantAdmin({ tenantId: T, email: "owner@example.com", password: P });
  const owner = await secureAccess.authenticate({ tenantId: T, email: "owner@example.com", password: P });
  const dispatcherUser = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: T, email: "dispatch@example.com", password: P, roles: ["admin_dispatch"] });
  const technicianUser = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: T, email: "tech@example.com", password: P, roles: ["technician"] });
  const executiveUser = await secureAccess.createUser({ actorSessionToken: owner.token, tenantId: T, email: "executive@example.com", password: P, roles: ["executive"] });
  const dispatcher = await secureAccess.authenticate({ tenantId: T, email: dispatcherUser.email, password: P });
  const technician = await secureAccess.authenticate({ tenantId: T, email: technicianUser.email, password: P });
  const executive = await secureAccess.authenticate({ tenantId: T, email: executiveUser.email, password: P });
  const fieldWorkflowService = {
    executionHandoffAuthorized: () => Object.freeze({ tenantId: T, fieldSessionId: "field-1", serviceCaseId: "case-1", customerId: "customer-1", diagnosticReportId: "report-1", inspectionPerformed: true, findingItemIds: ["component-01"], measurementIds: [], mediaReferenceIds: [] }),
    assertAssignedFieldSessionAuthorized: ({ sessionToken, tenantId, fieldSessionId }) => {
      if (sessionToken !== technician.token || tenantId !== T || fieldSessionId !== "field-1") throw new Error("Assigned technician is required.");
      return Object.freeze({ assigned: true, technicianId: technician.principal.id });
    }
  };
  const repairEstimateService = new RepairEstimateService({ secureAccess, fieldWorkflowService, auditLog, now: () => now });
  const commerce = new CommerceOperationsService({ secureAccess, repairEstimateService, auditLog, now: () => now });
  const record = repairEstimateService.createDraftAuthorized({ sessionToken: dispatcher.token, tenantId: T, fieldSessionId: "field-1", templateName: "Garage Door Repair | Service", idempotencyKey: "execution-1" });
  return { auditLog, secureAccess, owner, dispatcher, technician, executive, repairEstimateService, commerce, record, now };
}

function seedCatalog(context) {
  const category = context.commerce.createCategoryAuthorized({ sessionToken: context.owner.token, tenantId: T, name: "Garage Door Service" });
  const subcategory = context.commerce.createCategoryAuthorized({ sessionToken: context.owner.token, tenantId: T, name: "Springs", parentCategoryId: category.id });
  const modifiers = context.commerce.createModifierSetAuthorized({ sessionToken: context.owner.token, tenantId: T, name: "Spring System", required: true, minimumSelections: 1, maximumSelections: 1, options: [{ name: "High-cycle spring", priceDeltaCents: 2500 }] });
  const item = context.commerce.createItemAuthorized({ sessionToken: context.owner.token, tenantId: T, type: "service", categoryId: category.id, subcategoryId: subcategory.id, name: "Spring replacement", description: "Replace garage door spring system", internalCode: "SRV-SPRING", costCents: 4000, sellPriceCents: 10000, unit: "job", tax: { taxable: true, classification: "service-and-parts", reference: "TNGD-TAXABLE", rateBasisPoints: 700 }, modifierSetIds: [modifiers.id], externalReferences: [{ source: "hcp", id: "legacy-42" }] });
  return { category, subcategory, modifiers, item };
}

test("administrator creates governed categories services tax treatment and reusable modifiers without code changes", async () => {
  const context = await setup();
  const seeded = seedCatalog(context);
  assert.equal(seeded.item.categoryId, seeded.category.id);
  assert.equal(seeded.item.subcategoryId, seeded.subcategory.id);
  assert.equal(seeded.item.tax.classification, "service-and-parts");
  assert.equal(seeded.item.tax.rateBasisPoints, 700);
  assert.deepEqual(seeded.item.modifierSetIds, [seeded.modifiers.id]);
  assert.throws(() => seedCatalog({ ...context, owner: context.dispatcher }), /permission/);
});
test("catalog line snapshots preserve price tax modifier provenance after catalog edits and deactivation", async () => {
  const context = await setup();
  const { item, modifiers } = seedCatalog(context);
  let record = context.commerce.addCatalogLineAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, itemId: item.id, selectedModifierOptionIds: [modifiers.options[0].id] });
  const snapshot = record.versions[0].lineItems.at(-1);
  context.commerce.updateItemAuthorized({ sessionToken: context.owner.token, tenantId: T, itemId: item.id, changes: { sellPriceCents: 15000, description: "Updated future description" } });
  context.commerce.deactivateItemAuthorized({ sessionToken: context.owner.token, tenantId: T, itemId: item.id, reason: "Replaced by revised service" });
  record = context.repairEstimateService.getAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id });
  assert.equal(record.versions[0].lineItems.at(-1), snapshot);
  assert.equal(snapshot.amountCents, 12500);
  assert.equal(snapshot.catalogRevision, 1);
  assert.equal(snapshot.modifiers[0].name, "High-cycle spring");
  assert.equal(snapshot.tax.reference, "TNGD-TAXABLE");
  assert.throws(() => context.commerce.addCatalogLineAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, itemId: item.id, selectedModifierOptionIds: [modifiers.options[0].id] }), /not available/);
});

test("assigned technician adds an attributed ad-hoc line without polluting the permanent catalog", async () => {
  const context = await setup();
  const record = context.commerce.addAdHocLineAuthorized({ sessionToken: context.technician.token, tenantId: T, recordId: context.record.id, description: "Emergency bracket reinforcement", quantity: 2, unitPriceCents: 3500, tax: { taxable: true, classification: "parts", rateBasisPoints: 700 }, reason: "Unsafe bracket discovered after opening wall" });
  const line = record.versions[0].lineItems.at(-1);
  assert.equal(line.source, "ad-hoc");
  assert.equal(line.amountCents, 7000);
  assert.equal(line.createdBy, context.technician.principal.id);
  assert.equal((await Promise.resolve(context.commerce.listCatalogAuthorized({ sessionToken: context.dispatcher.token, tenantId: T }))).length, 0);
  assert.throws(() => context.commerce.addAdHocLineAuthorized({ sessionToken: context.executive.token, tenantId: T, recordId: context.record.id, description: "Unauthorized", unitPriceCents: 1, reason: "none" }), /permission|Assigned technician/);
});

test("fixed and percentage discounts enforce authority and retain attributable evidence", async () => {
  const context = await setup();
  const { item, modifiers } = seedCatalog(context);
  context.commerce.addCatalogLineAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, itemId: item.id, selectedModifierOptionIds: [modifiers.options[0].id] });
  const ordinary = context.commerce.createDiscountAuthorized({ sessionToken: context.owner.token, tenantId: T, name: "Ten percent", kind: "percentage", value: 1000, scope: "transaction" });
  const controlled = context.commerce.createDiscountAuthorized({ sessionToken: context.owner.token, tenantId: T, name: "Manager courtesy", kind: "fixed", value: 2000, scope: "transaction", requiresApproval: true });
  let record = context.commerce.applyDiscountAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, discountId: ordinary.id });
  assert.equal(record.versions[0].commerce.discountCents, 1250);
  assert.equal(record.versions[0].commerce.discounts[0].approvedBy, context.dispatcher.principal.id);
  assert.throws(() => context.commerce.applyDiscountAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, discountId: controlled.id, approvalReason: "Requested" }), /permission/);
  record = context.commerce.applyDiscountAuthorized({ sessionToken: context.owner.token, tenantId: T, recordId: context.record.id, discountId: controlled.id, approvalReason: "Customer recovery" });
  assert.equal(record.versions[0].commerce.discounts.at(-1).approvalReason, "Customer recovery");
});

test("none fixed percentage and governed custom deposits calculate one existing payment balance", async () => {
  const context = await setup();
  const { item, modifiers } = seedCatalog(context);
  context.commerce.addCatalogLineAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, itemId: item.id, selectedModifierOptionIds: [modifiers.options[0].id] });
  for (const deposit of [{ kind: "none", value: 0 }, { kind: "fixed", value: 1000 }, { kind: "percentage", value: 5000 }]) {
    const record = context.commerce.setDepositAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, ...deposit });
    assert.ok(record.versions[0].commerce.depositCents <= record.versions[0].commerce.totalCents);
  }
  assert.throws(() => context.commerce.setDepositAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, kind: "custom", value: 3000, reason: "Approved exception" }), /permission/);
  const record = context.commerce.setDepositAuthorized({ sessionToken: context.owner.token, tenantId: T, recordId: context.record.id, kind: "custom", value: 3000, reason: "Approved exception" });
  assert.equal(record.versions[0].commerce.balanceCents, record.versions[0].commerce.totalCents - 3000);
});

test("approved commercial snapshot reaches BP-011 invoice and Square handoff without a duplicate ledger", async () => {
  const context = await setup();
  const { item, modifiers } = seedCatalog(context);
  context.commerce.addCatalogLineAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, itemId: item.id, selectedModifierOptionIds: [modifiers.options[0].id] });
  const discount = context.commerce.createDiscountAuthorized({ sessionToken: context.owner.token, tenantId: T, name: "Ten percent", kind: "percentage", value: 1000 });
  context.commerce.applyDiscountAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, discountId: discount.id });
  context.commerce.setDepositAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, kind: "percentage", value: 5000 });
  let execution = context.repairEstimateService.finalizeVersionAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id });
  execution = context.repairEstimateService.prepareAuthorizationPackageAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: execution.id });
  const authorization = new CustomerAuthorizationService({ secureAccess: context.secureAccess, repairEstimateService: context.repairEstimateService, auditLog: context.auditLog, now: () => context.now });
  const created = authorization.createRequestAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: execution.id, versionId: execution.currentVersionId, idempotencyKey: "auth-commerce", terms: "Authorized scope", disclosures: ["Deposit applies"], expiresAt: "2026-08-21T12:00:00Z" });
  authorization.decide({ transactionToken: created.transactionToken, decision: "approved", approverIdentity: "customer@example.com", approverType: "customer", adultAcknowledged: true, signatureEvidence: "signature-ref", idempotencyKey: "decision-commerce" });
  const squareCalls = [];
  const invoiceService = new InvoicePaymentService({ secureAccess: context.secureAccess, customerAuthorizationService: authorization, auditLog: context.auditLog, now: () => context.now, squareGateway: { verifyWebhook: () => true, createPaymentLink: async (input) => { squareCalls.push(input); return { paymentLinkId: "square-link-1", url: "https://square.example/pay" }; }, createRefund: async () => ({ refundId: "refund-1" }) } });
  let invoice = invoiceService.createFromAuthorizationAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, authorizationRequestId: created.request.id, idempotencyKey: "invoice-commerce" });
  assert.equal(invoice.totalCents, created.request.snapshot.content.commerce.totalCents);
  assert.equal(invoice.depositCents, created.request.snapshot.content.commerce.depositCents);
  assert.equal(invoice.lineItems.at(-1).modifiers[0].name, "High-cycle spring");
  invoice = invoiceService.finalizeAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, invoiceId: invoice.id, idempotencyKey: "finalize-commerce" });
  const intent = await invoiceService.createPaymentLinkAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, invoiceId: invoice.id, idempotencyKey: "pay-commerce" });
  assert.equal(intent.amountCents, invoice.balanceCents);
  assert.equal(squareCalls[0].amountCents, invoice.balanceCents);
  assert.equal(context.auditLog.verify(), true);
});

test("tenant isolation and malformed commercial values remain rejected", async () => {
  const context = await setup();
  const { item, modifiers } = seedCatalog(context);
  assert.throws(() => context.commerce.addCatalogLineAuthorized({ sessionToken: context.dispatcher.token, tenantId: "other", recordId: context.record.id, itemId: item.id, selectedModifierOptionIds: [modifiers.options[0].id] }), /tenant/);
  assert.throws(() => context.commerce.addAdHocLineAuthorized({ sessionToken: context.technician.token, tenantId: T, recordId: context.record.id, description: "Bad", unitPriceCents: Number.NaN, reason: "bad" }), /safe integer/);
  assert.throws(() => context.commerce.createDiscountAuthorized({ sessionToken: context.owner.token, tenantId: T, name: "Bad", kind: "percentage", value: 10001 }), /basis points/);
  assert.throws(() => context.commerce.setDepositAuthorized({ sessionToken: context.dispatcher.token, tenantId: T, recordId: context.record.id, kind: "percentage", value: -1 }), /basis points/);
});
