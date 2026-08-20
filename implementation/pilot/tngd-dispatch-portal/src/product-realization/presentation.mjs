import { foundation } from "../foundation.mjs";

const freeze = Object.freeze;

export const PRODUCT_ROUTES = freeze([
  { id: "pulse", label: "Operational Pulse", group: "work", permission: "operations.read", packages: ["TNGD-BP-005", "TNGD-BP-007", "TNGD-BP-015"] },
  { id: "today", label: "Technician Today", group: "work", permission: "jobs.assigned.read", packages: ["TNGD-BP-007", "TNGD-BP-008"] },
  { id: "customers", label: "Customers", group: "relationships", permission: "customers.read", packages: ["TNGD-BP-004"] },
  { id: "intake", label: "Intake", group: "relationships", permission: "intake.read", packages: ["TNGD-BP-002", "TNGD-BP-003"] },
  { id: "calendar", label: "Schedule", group: "operations", permission: "scheduling.read", packages: ["TNGD-BP-005", "TNGD-BP-006"] },
  { id: "dispatch", label: "Dispatch", group: "operations", permission: "dispatch.manage", packages: ["TNGD-BP-007"] },
  { id: "jobs", label: "Jobs", group: "operations", permission: "jobs.assigned.read", packages: ["TNGD-BP-008"] },
  { id: "inspection", label: "Diagnosis & Inspection", group: "field", permission: "jobs.assigned.update", packages: ["TNGD-BP-008"] },
  { id: "estimates", label: "Estimates", group: "commerce", permission: "estimates.manage", packages: ["TNGD-BP-009", "TNGD-DISPATCH-V1-COMMERCE-OPS"] },
  { id: "authorization", label: "Authorization", group: "commerce", permission: "authorization.manage", packages: ["TNGD-BP-010"] },
  { id: "invoices", label: "Invoices & Payment", group: "commerce", permission: "invoices.manage", packages: ["TNGD-BP-011"] },
  { id: "warranty", label: "Warranty", group: "care", permission: "warranty.manage", packages: ["TNGD-BP-013"] },
  { id: "follow-up", label: "Follow-Up", group: "care", permission: "follow-up.manage", packages: ["TNGD-BP-014"] },
  { id: "pipeline", label: "Admin Pipeline", group: "administration", permission: "operations.exceptions.manage", packages: ["TNGD-BP-012"] },
  { id: "reports", label: "Reports", group: "administration", permission: "reports.read", packages: ["TNGD-BP-015"] },
  { id: "commerce", label: "Catalog & Commerce", group: "administration", permission: "operations.commerce.manage", packages: ["TNGD-DISPATCH-V1-COMMERCE-OPS"] },
  { id: "administration", label: "Administration", group: "administration", permission: "operations.*", packages: ["TNGD-BP-001", "TNGD-BP-012"] },
  { id: "settings", label: "Settings & Integrations", group: "administration", permission: "profile.read", packages: ["TNGD-BP-001"] }
]);

const ROLE_PERMISSIONS = freeze({
  technician: ["jobs.assigned.read", "jobs.assigned.update", "customers.read", "estimates.manage", "authorization.manage", "invoices.manage", "profile.read"],
  dispatcher: ["operations.read", "customers.read", "intake.read", "scheduling.read", "dispatch.manage", "jobs.assigned.read", "reports.read", "profile.read"],
  administrator: ["*"]
});

const permits = (grants, requested) => grants.includes("*") || grants.includes(requested) || (requested.startsWith("operations.") && grants.includes("operations.*"));

export function routesForRoles(roles = []) {
  const grants = new Set(roles.flatMap((role) => ROLE_PERMISSIONS[role] || []));
  return freeze(PRODUCT_ROUTES.filter((route) => permits([...grants], route.permission)));
}

export function operationalPulse({ blocked = 0, attention = 0, active = 0, overdue = 0 } = {}) {
  const pressure = blocked * 45 + overdue * 25 + attention * 10;
  const condition = blocked > 0 || pressure >= 70 ? "urgent" : overdue > 0 || pressure >= 30 ? "constrained" : active > 0 || attention > 0 ? "active" : "healthy";
  return freeze({ condition, pressure: Math.min(100, pressure), tone: condition === "urgent" ? "nitro-red" : "mass-blue", motion: "restrained-breathe", derived: true });
}

export const TECHNICIAN_FLYWHEEL = freeze({
  "ready-for-field-execution": "navigation",
  "en-route": "arrival",
  arrived: "diagnosis",
  "in-progress": "inspection",
  "field-complete": "estimate-or-completion",
  "estimate-finalized": "authorization",
  authorized: "invoice-payment",
  paid: "completion",
  completed: "next-destination"
});

export function nextTechnicianDestination(state) {
  return TECHNICIAN_FLYWHEEL[state] || "today";
}

export function productRealizationContract() {
  return freeze({
    product: "MASS Dispatch",
    tenant: "Top-Notch Garage Doors",
    mode: "preview",
    liveData: false,
    packages: foundation.implementedPackages,
    routes: PRODUCT_ROUTES,
    themes: ["dark", "light"],
    breakpoints: freeze({ phone: 680, tablet: 1024, desktop: 1280 }),
    providerStates: freeze(["ready", "loading", "empty", "error", "permission-denied", "integration-unavailable", "media-unavailable"]),
    deploymentAuthorized: false
  });
}
