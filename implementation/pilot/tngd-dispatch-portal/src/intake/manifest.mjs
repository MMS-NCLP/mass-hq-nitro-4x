import { INTAKE_PATHS } from "./intake-service.mjs";
import { PRIMARY_QUESTIONS } from "./guided-intake.mjs";

export const intakeManifest = Object.freeze({
  workOrderIds: Object.freeze(["TNGD-BP-002", "TNGD-BP-003"]),
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
  }),
  guidedIntake: Object.freeze({
    primaryQuestionCount: PRIMARY_QUESTIONS.length,
    questions: PRIMARY_QUESTIONS,
    presentation: "one-at-a-time",
    lifecycle: Object.freeze(["draft", "completed", "ready-for-bp004"]),
    mediaKinds: Object.freeze(["photo", "voice-note"]),
    autosave: "after-each-answer",
    handoffTarget: "TNGD-BP-004"
  })
});
