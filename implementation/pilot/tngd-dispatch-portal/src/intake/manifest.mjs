import { INTAKE_PATHS } from "./intake-service.mjs";

export const intakeManifest = Object.freeze({
  workOrderId: "TNGD-BP-002",
  paths: Object.freeze(Object.values(INTAKE_PATHS)),
  questions: Object.freeze([
    "name",
    "phone",
    "email",
    "serviceAddress",
    "serviceCategory",
    "serviceNeed",
    "urgency",
    "preferredContact"
  ]),
  capabilities: Object.freeze([
    "three-path-intake",
    "eight-question-intake-foundation",
    "initial-customer-capture",
    "service-request-creation"
  ]),
  persistence: Object.freeze({
    boundary: "in-memory",
    migrationLocation: "migrations"
  })
});
