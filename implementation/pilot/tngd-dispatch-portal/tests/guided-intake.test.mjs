import assert from "node:assert/strict";
import test from "node:test";
import {
  GuidedIntakeService,
  PRIMARY_QUESTIONS
} from "../src/intake/index.mjs";
import { AuditLog, SecureAccess } from "../src/security/index.mjs";

const TENANT_A = "tenant-tngd";
const TENANT_B = "tenant-other";
const PASSWORD = "correct horse battery staple";

async function setup() {
  const auditLog = new AuditLog();
  const secureAccess = new SecureAccess({ auditLog });
  await secureAccess.bootstrapTenantAdmin({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: PASSWORD
  });
  const admin = await secureAccess.authenticate({
    tenantId: TENANT_A,
    email: "owner@example.com",
    password: PASSWORD
  });
  return {
    auditLog,
    secureAccess,
    admin,
    guided: new GuidedIntakeService({ secureAccess, auditLog })
  };
}

function answersFor(path, { safetyConcern = false } = {}) {
  const pathDetails = {
    repair: { equipmentDetails: "Heat pump, model HP-42" },
    estimate: { projectDetails: "Replace upstairs system" },
    "other-services": { serviceDetails: "Seasonal maintenance visit" }
  }[path];
  return [
    { name: "Taylor Customer" },
    { phone: "919-555-0100", email: "taylor@example.com", preferredContact: "phone" },
    { address: "100 Main Street, Raleigh, NC" },
    { serviceSubtype: path === "repair" ? "no-cooling" : "consultation" },
    { description: "Customer supplied description preserved verbatim." },
    {
      urgency: "this-week",
      safetyConcern,
      ...(safetyConcern ? { safetyDetails: "Water near electrical equipment" } : {})
    },
    pathDetails,
    { availability: "Weekday mornings", authorizedToProceed: true }
  ];
}

function completeAnswers({ guided, token, guidedSessionId, path }) {
  let snapshot;
  for (const [index, question] of PRIMARY_QUESTIONS.entries()) {
    snapshot = guided.answerAuthorized({
      sessionToken: token,
      tenantId: TENANT_A,
      guidedSessionId,
      questionId: question.id,
      value: answersFor(path)[index]
    });
  }
  return snapshot;
}

test("repair, estimate, and other-service paths produce BP-004-ready records", async () => {
  const { guided, admin } = await setup();

  for (const path of ["repair", "estimate", "other-services"]) {
    const session = guided.startAuthorized({
      sessionToken: admin.token,
      tenantId: TENANT_A,
      path,
      source: "phone"
    });
    const answered = completeAnswers({
      guided,
      token: admin.token,
      guidedSessionId: session.id,
      path
    });
    assert.equal(answered.nextQuestion, null);

    const completed = guided.completeAuthorized({
      sessionToken: admin.token,
      tenantId: TENANT_A,
      guidedSessionId: session.id
    });
    assert.equal(completed.intakeRecord.intakePath, path);
    assert.equal(completed.intakeRecord.primaryQuestionCount, 8);
    assert.equal(completed.intakeRecord.status, "ready-for-bp004");
    assert.deepEqual(completed.handoff, {
      targetPackage: "TNGD-BP-004",
      contract: "Customer Record and Service Case Creation",
      status: "ready",
      intakeRecordId: completed.intakeRecord.id
    });
  }
});

test("one-at-a-time questions enforce adaptive and conditional requirements", async () => {
  const { guided, admin } = await setup();
  const session = guided.startAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    path: "repair"
  });

  assert.equal(PRIMARY_QUESTIONS.length, 8);
  assert.equal(session.nextQuestion.id, "customerIdentity");
  assert.throws(
    () => guided.answerAuthorized({
      sessionToken: admin.token,
      tenantId: TENANT_A,
      guidedSessionId: session.id,
      questionId: "contactInformation",
      value: answersFor("repair")[1]
    }),
    /current primary question is customerIdentity/
  );

  for (let index = 0; index < 5; index += 1) {
    guided.answerAuthorized({
      sessionToken: admin.token,
      tenantId: TENANT_A,
      guidedSessionId: session.id,
      questionId: PRIMARY_QUESTIONS[index].id,
      value: answersFor("repair")[index]
    });
  }
  assert.throws(
    () => guided.answerAuthorized({
      sessionToken: admin.token,
      tenantId: TENANT_A,
      guidedSessionId: session.id,
      questionId: "safetyUrgency",
      value: { urgency: "now", safetyConcern: true }
    }),
    /safetyDetails/
  );
  guided.answerAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    guidedSessionId: session.id,
    questionId: "safetyUrgency",
    value: answersFor("repair", { safetyConcern: true })[5]
  });
  assert.throws(
    () => guided.answerAuthorized({
      sessionToken: admin.token,
      tenantId: TENANT_A,
      guidedSessionId: session.id,
      questionId: "equipmentProjectDetails",
      value: { projectDetails: "Wrong path detail" }
    }),
    /equipmentDetails/
  );
});

test("every answer autosaves and a session resumes at the next question", async () => {
  const { guided, admin } = await setup();
  const session = guided.startAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    path: "estimate"
  });
  guided.answerAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    guidedSessionId: session.id,
    questionId: "customerIdentity",
    value: answersFor("estimate")[0]
  });

  const resumed = guided.resumeAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    guidedSessionId: session.id
  });
  assert.deepEqual(resumed.answers.customerIdentity, { name: "Taylor Customer" });
  assert.equal(resumed.nextQuestion.id, "contactInformation");
  assert.equal(resumed.currentQuestionIndex, 1);
});

test("photo and voice-note references remain immutable original evidence", async () => {
  const { guided, admin } = await setup();
  const session = guided.startAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    path: "other-services"
  });
  const photo = guided.attachMediaAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    guidedSessionId: session.id,
    kind: "photo",
    mediaReference: "app-004://tenant-tngd/intake/photo-1",
    metadata: { contentType: "image/jpeg", originalName: "unit.jpg" }
  });
  guided.attachMediaAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    guidedSessionId: session.id,
    kind: "voice-note",
    mediaReference: "app-012://tenant-tngd/intake/voice-1",
    metadata: { contentType: "audio/webm", durationSeconds: 18 }
  });
  assert.equal(Object.isFrozen(photo), true);

  completeAnswers({
    guided,
    token: admin.token,
    guidedSessionId: session.id,
    path: "other-services"
  });
  const { intakeRecord } = guided.completeAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    guidedSessionId: session.id
  });
  assert.deepEqual(intakeRecord.attachments.map(({ kind }) => kind), ["photo", "voice-note"]);
  assert.equal(intakeRecord.originalEvidence.filter(({ kind }) => kind === "media-reference").length, 2);
  assert.equal(Object.isFrozen(intakeRecord.originalEvidence), true);
});

test("tenant and role enforcement prevent unauthorized guided-intake mutation", async () => {
  const { guided, secureAccess, admin } = await setup();
  const technician = await secureAccess.createUser({
    actorSessionToken: admin.token,
    tenantId: TENANT_A,
    email: "tech@example.com",
    password: PASSWORD,
    roles: ["technician"]
  });
  const technicianSession = await secureAccess.authenticate({
    tenantId: TENANT_A,
    email: technician.email,
    password: PASSWORD
  });
  assert.throws(
    () => guided.startAuthorized({
      sessionToken: technicianSession.token,
      tenantId: TENANT_A,
      path: "repair"
    }),
    /Access denied/
  );

  const session = guided.startAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    path: "repair"
  });
  assert.throws(
    () => guided.resumeAuthorized({
      sessionToken: admin.token,
      tenantId: TENANT_B,
      guidedSessionId: session.id
    }),
    /not found for this tenant/
  );
  const resumed = guided.resumeAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    guidedSessionId: session.id
  });
  assert.equal(resumed.currentQuestionIndex, 0);
});

test("completed records retain user, source, timestamps, and valid audit history", async () => {
  const { guided, admin, auditLog } = await setup();
  const session = guided.startAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    path: "estimate",
    source: "phone"
  });
  completeAnswers({
    guided,
    token: admin.token,
    guidedSessionId: session.id,
    path: "estimate"
  });
  const { intakeRecord } = guided.completeAuthorized({
    sessionToken: admin.token,
    tenantId: TENANT_A,
    guidedSessionId: session.id
  });

  assert.equal(intakeRecord.tenantId, TENANT_A);
  assert.equal(intakeRecord.createdBy, admin.principal.id);
  assert.equal(intakeRecord.completedBy, admin.principal.id);
  assert.equal(intakeRecord.source, "phone");
  assert.ok(intakeRecord.startedAt);
  assert.ok(intakeRecord.completedAt);
  assert.equal(intakeRecord.originalEvidence.filter(({ kind }) => kind === "answer").length, 8);
  assert.equal(intakeRecord.auditEventIds.length, 10);
  assert.equal(auditLog.verify(), true);
  assert.equal(
    guided.getRecordAuthorized({
      sessionToken: admin.token,
      tenantId: TENANT_A,
      intakeRecordId: intakeRecord.id
    }),
    intakeRecord
  );
});
