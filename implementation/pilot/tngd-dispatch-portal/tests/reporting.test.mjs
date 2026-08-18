import assert from "node:assert/strict";
import test from "node:test";
import { ReportingService } from "../src/reporting/index.mjs";
import { SecureAccess } from "../src/security/secure-access.mjs";

const PILOT_SOURCES = Object.freeze([
  { name: "new-requests", source: "TNGD-BP-002", meaning: "Count of intake submissions received", method: "count" },
  { name: "conversion-to-service-cases", source: "TNGD-BP-004", meaning: "Intake submissions converted to service cases", method: "count" },
  { name: "scheduled-appointments", source: "TNGD-BP-005", meaning: "Appointments created and confirmed", method: "count" },
  { name: "dispatched-jobs", source: "TNGD-BP-007", meaning: "Jobs dispatched to technicians", method: "count" },
  { name: "completed-jobs", source: "TNGD-BP-008", meaning: "Field jobs completed with evidence", method: "count" },
  { name: "estimates-awaiting-decision", source: "TNGD-BP-009", meaning: "Estimates pending customer decision", method: "count" },
  { name: "authorized-work", source: "TNGD-BP-010", meaning: "Work authorized by customer", method: "count" },
  { name: "invoices-issued", source: "TNGD-BP-011", meaning: "Invoices issued to customers", method: "count" },
  { name: "payments-confirmed", source: "TNGD-BP-011", meaning: "Payments confirmed via Square", method: "count" },
  { name: "open-exceptions", source: "TNGD-BP-012", meaning: "Unresolved reconciliation exceptions", method: "count" },
  { name: "active-warranty-obligations", source: "TNGD-BP-013", meaning: "Active warranty registrations", method: "count" },
  { name: "due-follow-ups", source: "TNGD-BP-014", meaning: "Follow-up activities in due status", method: "count" },
  { name: "completed-dispatch-loops", source: "TNGD-BP-002", meaning: "End-to-end dispatch loops completed", method: "count" }
]);

async function setup() {
  const secure = new SecureAccess();
  const tenantId = "t-reporting";
  const pw = "ReportingTest99!";
  await secure.bootstrapTenantAdmin({ tenantId, email: "owner@tngd.test", password: pw });
  const ownerToken = (await secure.authenticate({ tenantId, email: "owner@tngd.test", password: pw })).token;
  await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "coord@tngd.test", password: pw, roles: ["admin_dispatch"] });
  const coordToken = (await secure.authenticate({ tenantId, email: "coord@tngd.test", password: pw })).token;
  await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "mgr@tngd.test", password: pw, roles: ["manager"] });
  const mgrToken = (await secure.authenticate({ tenantId, email: "mgr@tngd.test", password: pw })).token;
  await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "tech@tngd.test", password: pw, roles: ["technician"] });
  const techToken = (await secure.authenticate({ tenantId, email: "tech@tngd.test", password: pw })).token;
  await secure.createUser({ actorSessionToken: ownerToken, tenantId, email: "exec@tngd.test", password: pw, roles: ["executive"] });
  const execToken = (await secure.authenticate({ tenantId, email: "exec@tngd.test", password: pw })).token;

  const baseDate = new Date("2026-08-01T10:00:00Z");
  let tick = 0;
  const svc = new ReportingService({ secureAccess: secure, auditLog: secure.auditLog, now: () => new Date(baseDate.getTime() + (tick++) * 1000) });

  const metricIds = [];
  for (const s of PILOT_SOURCES) {
    const m = svc.defineMetricAuthorized({
      sessionToken: ownerToken, tenantId, name: s.name,
      businessMeaning: s.meaning, authoritativeSource: s.source,
      calculationMethod: s.method, timeBasis: "event-time",
      freshness: "point-in-time", permittedDimensions: ["date-range", "status"],
      unavailableDataBehavior: "report-as-unavailable"
    });
    metricIds.push(m.id);
  }

  const def = svc.createDefinitionAuthorized({
    sessionToken: ownerToken, tenantId, name: "Pilot Operations Dashboard",
    description: "Complete pilot loop operational view",
    metricIds
  });

  return { svc, secure, tenantId, ownerToken, coordToken, mgrToken, techToken, execToken, metricIds, def };
}

function fullSourceData() {
  return {
    "new-requests": { value: 42, sourcePackage: "TNGD-BP-002", asOf: "2026-08-01T12:00:00Z", recordCount: 42 },
    "conversion-to-service-cases": { value: 38, sourcePackage: "TNGD-BP-004", asOf: "2026-08-01T12:00:00Z", recordCount: 38 },
    "scheduled-appointments": { value: 35, sourcePackage: "TNGD-BP-005", asOf: "2026-08-01T12:00:00Z", recordCount: 35 },
    "dispatched-jobs": { value: 30, sourcePackage: "TNGD-BP-007", asOf: "2026-08-01T12:00:00Z", recordCount: 30 },
    "completed-jobs": { value: 28, sourcePackage: "TNGD-BP-008", asOf: "2026-08-01T12:00:00Z", recordCount: 28 },
    "estimates-awaiting-decision": { value: 5, sourcePackage: "TNGD-BP-009", asOf: "2026-08-01T12:00:00Z", recordCount: 5 },
    "authorized-work": { value: 25, sourcePackage: "TNGD-BP-010", asOf: "2026-08-01T12:00:00Z", recordCount: 25 },
    "invoices-issued": { value: 22, sourcePackage: "TNGD-BP-011", asOf: "2026-08-01T12:00:00Z", recordCount: 22 },
    "payments-confirmed": { value: 20, sourcePackage: "TNGD-BP-011", asOf: "2026-08-01T12:00:00Z", recordCount: 20 },
    "open-exceptions": { value: 3, sourcePackage: "TNGD-BP-012", asOf: "2026-08-01T12:00:00Z", recordCount: 3 },
    "active-warranty-obligations": { value: 18, sourcePackage: "TNGD-BP-013", asOf: "2026-08-01T12:00:00Z", recordCount: 18 },
    "due-follow-ups": { value: 12, sourcePackage: "TNGD-BP-014", asOf: "2026-08-01T12:00:00Z", recordCount: 12 },
    "completed-dispatch-loops": { value: 15, sourcePackage: "TNGD-BP-002", asOf: "2026-08-01T12:00:00Z", recordCount: 15 }
  };
}

test("deterministic metric calculations produce consistent results from governed source data", async () => {
  const { svc, coordToken, tenantId, def } = await setup();
  const data = fullSourceData();

  const r1 = svc.generateReportAuthorized({ sessionToken: coordToken, tenantId, definitionId: def.id, sourceData: data, idempotencyKey: "det-1" });
  assert.equal(r1.results.length, 13);
  assert.equal(r1.exceptions.length, 0);

  for (const result of r1.results) {
    assert.equal(result.available, true);
    assert.equal(typeof result.value, "number");
    assert.equal(result.calculationMethod, "count");
  }

  const requestsResult = r1.results.find(r => r.metricName === "new-requests");
  assert.equal(requestsResult.value, 42);
  const loopsResult = r1.results.find(r => r.metricName === "completed-dispatch-loops");
  assert.equal(loopsResult.value, 15);
});

test("metric definitions require complete business specification", async () => {
  const { svc, ownerToken, tenantId } = await setup();
  const base = { sessionToken: ownerToken, tenantId, calculationMethod: "count", timeBasis: "event-time", freshness: "point-in-time", unavailableDataBehavior: "report-as-unavailable" };

  assert.throws(() => svc.defineMetricAuthorized({ ...base, businessMeaning: "test", authoritativeSource: "BP-002" }), /name/i);
  assert.throws(() => svc.defineMetricAuthorized({ ...base, name: "test", authoritativeSource: "BP-002" }), /meaning/i);
  assert.throws(() => svc.defineMetricAuthorized({ ...base, name: "test", businessMeaning: "test" }), /source/i);
  assert.throws(() => svc.defineMetricAuthorized({ ...base, name: "test", businessMeaning: "test", authoritativeSource: "BP-002", calculationMethod: "invalid" }), /calculation/i);
  assert.throws(() => svc.defineMetricAuthorized({ ...base, name: "test", businessMeaning: "test", authoritativeSource: "BP-002", timeBasis: undefined }), /time basis/i);

  const valid = svc.defineMetricAuthorized({ ...base, name: "test-metric", businessMeaning: "Test measure", authoritativeSource: "TNGD-BP-002" });
  assert.ok(valid.id);
  assert.equal(valid.businessMeaning, "Test measure");
});

test("source-reference traceability links each result to its origin package", async () => {
  const { svc, coordToken, tenantId, def } = await setup();
  const report = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: fullSourceData(), idempotencyKey: "trace-1"
  });

  assert.equal(report.sourceReferences.length, 13);
  for (const ref of report.sourceReferences) {
    assert.ok(ref.sourcePackage.startsWith("TNGD-BP-"));
    assert.ok(ref.asOf);
    assert.ok(ref.metricName);
  }

  const bp002Refs = report.sourceReferences.filter(r => r.sourcePackage === "TNGD-BP-002");
  assert.ok(bp002Refs.length >= 1);
  const bp014Ref = report.sourceReferences.find(r => r.sourcePackage === "TNGD-BP-014");
  assert.equal(bp014Ref.metricName, "due-follow-ups");
});

test("missing and stale source data are represented as explicit exceptions", async () => {
  const { svc, coordToken, tenantId, def } = await setup();
  const partialData = {
    "new-requests": { value: 10, sourcePackage: "TNGD-BP-002", asOf: "2026-08-01T12:00:00Z" },
    "conversion-to-service-cases": { value: 8, sourcePackage: "TNGD-BP-004", asOf: "2026-08-01T12:00:00Z", stale: true, staleSince: "2026-07-28T00:00:00Z" }
  };

  const report = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: partialData, idempotencyKey: "missing-1"
  });

  const unavailable = report.exceptions.filter(e => e.type === "unavailable-data");
  assert.equal(unavailable.length, 11);
  for (const e of unavailable) {
    assert.equal(e.behavior, "report-as-unavailable");
    assert.ok(e.metricName);
  }

  const stale = report.exceptions.filter(e => e.type === "stale-data");
  assert.equal(stale.length, 1);
  assert.equal(stale[0].metricName, "conversion-to-service-cases");
  assert.equal(stale[0].staleSince, "2026-07-28T00:00:00Z");

  const unavailableResults = report.results.filter(r => !r.available);
  assert.equal(unavailableResults.length, 11);
  assert.equal(unavailableResults[0].value, null);
  assert.equal(unavailableResults[0].unavailableReason, "report-as-unavailable");
});

test("timezone and date-boundary filtering respects governed timestamps", async () => {
  const { svc, coordToken, tenantId, def } = await setup();

  const report = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: fullSourceData(),
    filters: {
      dateRange: { start: "2026-08-01T00:00:00Z", end: "2026-08-02T00:00:00Z", timezone: "America/New_York" }
    },
    idempotencyKey: "tz-1"
  });
  assert.equal(report.filters.length, 1);
  assert.equal(report.filters[0].type, "date-range");
  assert.equal(report.filters[0].timezone, "America/New_York");
  assert.equal(report.filters[0].start, "2026-08-01T00:00:00Z");
  assert.equal(report.filters[0].end, "2026-08-02T00:00:00Z");
});

test("filter validation rejects invalid criteria", async () => {
  const { svc, coordToken, tenantId, def } = await setup();
  const data = fullSourceData();

  assert.throws(() => svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id, sourceData: data,
    filters: { dateRange: { start: "2026-08-02T00:00:00Z", end: "2026-08-01T00:00:00Z", timezone: "UTC" } }
  }), /start must precede/);

  assert.throws(() => svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id, sourceData: data,
    filters: { dateRange: { start: "2026-08-01T00:00:00Z", end: "2026-08-02T00:00:00Z" } }
  }), /timezone/);

  assert.throws(() => svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id, sourceData: data,
    filters: { status: 123 }
  }), /string/);
});

test("finalized snapshot is immutable and reproducible", async () => {
  const { svc, ownerToken, coordToken, tenantId, def } = await setup();
  const report = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: fullSourceData(), idempotencyKey: "snap-1"
  });

  const snapshot = svc.finalizeSnapshotAuthorized({ sessionToken: ownerToken, tenantId, reportId: report.id });
  assert.equal(snapshot.immutable, true);
  assert.ok(snapshot.finalizedAt);
  assert.equal(snapshot.report.results.length, 13);

  assert.throws(() => svc.finalizeSnapshotAuthorized({
    sessionToken: ownerToken, tenantId, reportId: report.id
  }), /already finalized/);

  assert.throws(() => svc.recordExceptionAuthorized({
    sessionToken: coordToken, tenantId, reportId: report.id,
    type: "late-exception", detail: "Too late"
  }), /finalized/);
});

test("idempotent report generation returns existing report", async () => {
  const { svc, coordToken, tenantId, def } = await setup();
  const data = fullSourceData();

  const r1 = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: data, idempotencyKey: "idem-1"
  });
  const r2 = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: data, idempotencyKey: "idem-1"
  });
  assert.equal(r1.id, r2.id);
});

test("export authorization restricts to administrative roles", async () => {
  const { svc, ownerToken, coordToken, execToken, tenantId, def } = await setup();
  const report = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: fullSourceData(), idempotencyKey: "export-1"
  });
  const snapshot = svc.finalizeSnapshotAuthorized({ sessionToken: ownerToken, tenantId, reportId: report.id });

  const exp = svc.requestExportAuthorized({
    sessionToken: ownerToken, tenantId, snapshotId: snapshot.id,
    format: "json", idempotencyKey: "exp-1"
  });
  assert.equal(exp.format, "json");
  assert.equal(exp.status, "completed");
  assert.equal(exp.evidence.resultCount, 13);

  assert.throws(() => svc.requestExportAuthorized({
    sessionToken: execToken, tenantId, snapshotId: snapshot.id, format: "csv"
  }), /denied/);

  assert.throws(() => svc.requestExportAuthorized({
    sessionToken: ownerToken, tenantId, snapshotId: snapshot.id, format: "xml"
  }), /format/);
});

test("unresolved exceptions remain visible in report results", async () => {
  const { svc, coordToken, tenantId, def } = await setup();
  const report = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: fullSourceData(), idempotencyKey: "exc-1"
  });

  const exc = svc.recordExceptionAuthorized({
    sessionToken: coordToken, tenantId, reportId: report.id,
    type: "conflicting-status", detail: "Invoice count does not match payment total",
    metricName: "invoices-issued"
  });
  assert.ok(exc.id);
  assert.equal(exc.type, "conflicting-status");
  assert.equal(exc.metricName, "invoices-issued");

  assert.throws(() => svc.recordExceptionAuthorized({
    sessionToken: coordToken, tenantId, reportId: report.id,
    type: "", detail: ""
  }), /required/);
});

test("role-limited access prevents unauthorized report generation and export", async () => {
  const { svc, techToken, execToken, tenantId, def } = await setup();

  assert.throws(() => svc.generateReportAuthorized({
    sessionToken: techToken, tenantId, definitionId: def.id,
    sourceData: fullSourceData()
  }), /denied/);

  assert.throws(() => svc.generateReportAuthorized({
    sessionToken: execToken, tenantId, definitionId: def.id,
    sourceData: fullSourceData()
  }), /denied/);

  assert.throws(() => svc.defineMetricAuthorized({
    sessionToken: techToken, tenantId, name: "x", businessMeaning: "x",
    authoritativeSource: "BP-002", calculationMethod: "count",
    timeBasis: "event-time", freshness: "point-in-time",
    unavailableDataBehavior: "report-as-unavailable"
  }), /denied/);

  assert.throws(() => svc.createDefinitionAuthorized({
    sessionToken: execToken, tenantId, name: "x", metricIds: ["none"]
  }), /denied/);
});

test("reporting does not mutate source records from BP-002 through BP-014", async () => {
  const { svc } = await setup();
  assert.throws(() => svc.mutateSourceAuthorized(), /does not mutate/);
  assert.throws(() => svc.predictiveModelAuthorized(), /does not perform/);
  assert.throws(() => svc.aiConclusionAuthorized(), /does not generate/);
  assert.throws(() => svc.automateDecisionAuthorized(), /does not automate/);
});

test("tenant isolation and role boundaries remain intact through BP-014", async () => {
  const { svc, secure, coordToken, techToken, execToken, tenantId, def } = await setup();
  const tenantB = "t-other-reporting";
  await secure.bootstrapTenantAdmin({ tenantId: tenantB, email: "other@test.co", password: "ReportingTest99!" });
  const otherToken = (await secure.authenticate({ tenantId: tenantB, email: "other@test.co", password: "ReportingTest99!" })).token;

  const report = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: fullSourceData(), idempotencyKey: "iso-1"
  });

  assert.throws(() => svc.getResultsAuthorized({
    sessionToken: otherToken, tenantId, reportId: report.id
  }), /denied/);

  const defs = svc.listDefinitionsAuthorized({ sessionToken: execToken, tenantId });
  assert.ok(Array.isArray(defs));
  assert.ok(defs.length >= 1);

  assert.throws(() => svc.crossTenantBenchmarkAuthorized(), /does not benchmark/);
  assert.throws(() => svc.autonomousResolutionAuthorized(), /does not resolve/);
  assert.throws(() => svc.deliverCommunicationAuthorized(), /does not deliver/);
  assert.throws(() => svc.externalBiAuthorized(), /does not integrate/);
});

test("operational views cover the complete accepted pilot loop", async () => {
  const { svc, coordToken, execToken, tenantId, def } = await setup();
  const report = svc.generateReportAuthorized({
    sessionToken: coordToken, tenantId, definitionId: def.id,
    sourceData: fullSourceData(), idempotencyKey: "loop-1"
  });

  assert.equal(report.results.length, 13);
  const metricNames = report.results.map(r => r.metricName);
  for (const s of PILOT_SOURCES) {
    assert.ok(metricNames.includes(s.name), `Missing metric: ${s.name}`);
  }

  const sourcePackages = new Set(report.sourceReferences.map(r => r.sourcePackage));
  for (const bp of ["TNGD-BP-002", "TNGD-BP-004", "TNGD-BP-005", "TNGD-BP-007", "TNGD-BP-008", "TNGD-BP-009", "TNGD-BP-010", "TNGD-BP-011", "TNGD-BP-012", "TNGD-BP-013", "TNGD-BP-014"]) {
    assert.ok(sourcePackages.has(bp), `Missing source package: ${bp}`);
  }

  const history = svc.getSnapshotHistoryAuthorized({ sessionToken: execToken, tenantId });
  assert.ok(Array.isArray(history));

  const refs = svc.inspectSourceReferencesAuthorized({ sessionToken: execToken, tenantId, reportId: report.id });
  assert.equal(refs.length, 13);
});
