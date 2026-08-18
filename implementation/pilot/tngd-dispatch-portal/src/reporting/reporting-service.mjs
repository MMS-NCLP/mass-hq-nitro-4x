import { randomUUID } from "node:crypto";

const freeze = Object.freeze;

const CALCULATION_METHODS = freeze(["count", "rate", "sum", "status-distribution"]);
const EXPORT_FORMATS = freeze(["csv", "json"]);
const VALID_DIMENSIONS = freeze(["date-range", "technician", "dispatcher", "status", "category", "job-type"]);

export class ReportingService {
  #secure;
  #audit;
  #now;

  #metricDefs = new Map();
  #reportDefs = new Map();
  #reports = new Map();
  #reportByKey = new Map();
  #snapshots = new Map();
  #exceptions = new Map();
  #exports = new Map();
  #exportByKey = new Map();
  #history = new Map();

  constructor({ secureAccess, auditLog, now }) {
    this.#secure = secureAccess;
    this.#audit = auditLog;
    this.#now = now || (() => new Date());
  }

  #permit(sessionToken, tenantId, permission, resource) {
    return this.#secure.requirePermission({
      sessionToken, tenantId, permission, resourceId: resource
    });
  }

  #record(tenantId, subjectId, type, actorId, data) {
    const entry = freeze({ id: randomUUID(), tenantId, subjectId, type, actorId, data: freeze(data), at: this.#now().toISOString() });
    const list = this.#history.get(subjectId) || [];
    list.push(entry);
    this.#history.set(subjectId, list);
    this.#audit.append({ tenantId, principalId: actorId, type, resource: subjectId, action: type, outcome: "recorded", metadata: data });
    return entry;
  }

  // --- Metric Definitions ---

  defineMetricAuthorized({ sessionToken, tenantId, name, businessMeaning, authoritativeSource, inclusionRules, exclusionRules, calculationMethod, timeBasis, freshness, permittedDimensions, unavailableDataBehavior }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*", "reporting:metric:define");
    if (!name || typeof name !== "string") throw new Error("Metric name is required.");
    if (!businessMeaning || typeof businessMeaning !== "string") throw new Error("Business meaning is required.");
    if (!authoritativeSource || typeof authoritativeSource !== "string") throw new Error("Authoritative source is required.");
    if (!calculationMethod || !CALCULATION_METHODS.includes(calculationMethod))
      throw new Error(`Invalid calculation method. Must be one of: ${CALCULATION_METHODS.join(", ")}`);
    if (!timeBasis) throw new Error("Time basis is required.");
    if (!freshness) throw new Error("Freshness is required.");
    if (!unavailableDataBehavior) throw new Error("Unavailable-data behavior is required.");
    for (const d of (permittedDimensions || [])) {
      if (!VALID_DIMENSIONS.includes(d)) throw new Error(`Invalid dimension: ${d}`);
    }

    const metric = freeze({
      id: randomUUID(), tenantId, name, businessMeaning, authoritativeSource,
      inclusionRules: inclusionRules || "all-records",
      exclusionRules: exclusionRules || "none",
      calculationMethod, timeBasis, freshness,
      permittedDimensions: freeze([...(permittedDimensions || [])]),
      unavailableDataBehavior,
      createdAt: this.#now().toISOString(), createdBy: p.id
    });
    this.#metricDefs.set(metric.id, metric);
    this.#record(tenantId, metric.id, "MetricDefined", p.id, { name, authoritativeSource });
    return metric;
  }

  // --- Report Definitions ---

  createDefinitionAuthorized({ sessionToken, tenantId, name, description, metricIds }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*", "reporting:definition:create");
    if (!name || typeof name !== "string") throw new Error("Report definition name is required.");
    if (!metricIds || metricIds.length === 0) throw new Error("At least one metric is required.");
    for (const mid of metricIds) {
      const m = this.#metricDefs.get(mid);
      if (!m || m.tenantId !== tenantId) throw new Error(`Metric not found: ${mid}`);
    }

    const def = freeze({
      id: randomUUID(), tenantId, name,
      description: description || "",
      metricIds: freeze([...metricIds]),
      createdAt: this.#now().toISOString(), createdBy: p.id
    });
    this.#reportDefs.set(def.id, def);
    this.#record(tenantId, def.id, "DefinitionCreated", p.id, { name, metricCount: metricIds.length });
    return def;
  }

  // --- Report Generation ---

  generateReportAuthorized({ sessionToken, tenantId, definitionId, sourceData, filters, idempotencyKey }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", "reporting:report:generate");

    if (idempotencyKey) {
      const existing = this.#reportByKey.get(`${tenantId}:${idempotencyKey}`);
      if (existing) return this.#reports.get(existing);
    }

    const def = this.#reportDefs.get(definitionId);
    if (!def || def.tenantId !== tenantId) throw new Error("Report definition not found.");
    if (!sourceData || typeof sourceData !== "object") throw new Error("Source data is required.");

    const appliedFilters = [];
    if (filters) {
      if (filters.dateRange) {
        const { start, end, timezone } = filters.dateRange;
        if (!start || !end) throw new Error("Date range requires start and end.");
        if (!timezone) throw new Error("Date range requires explicit timezone.");
        if (new Date(start) >= new Date(end)) throw new Error("Date range start must precede end.");
        appliedFilters.push(freeze({ type: "date-range", start, end, timezone }));
      }
      if (filters.status) {
        if (typeof filters.status !== "string") throw new Error("Status filter must be a string.");
        appliedFilters.push(freeze({ type: "status", value: filters.status }));
      }
      if (filters.technician) appliedFilters.push(freeze({ type: "technician", value: filters.technician }));
      if (filters.category) appliedFilters.push(freeze({ type: "category", value: filters.category }));
    }

    const results = [];
    const sourceReferences = [];
    const reportExceptions = [];

    for (const metricId of def.metricIds) {
      const metric = this.#metricDefs.get(metricId);
      const source = sourceData[metric.name];

      if (!source || source.value === undefined || source.value === null) {
        reportExceptions.push(freeze({
          id: randomUUID(), tenantId, metricId, metricName: metric.name,
          type: "unavailable-data",
          detail: `No source data provided for metric: ${metric.name}`,
          behavior: metric.unavailableDataBehavior,
          recordedAt: this.#now().toISOString()
        }));
        results.push(freeze({
          metricId, metricName: metric.name, value: null, available: false,
          unavailableReason: metric.unavailableDataBehavior,
          calculationMethod: metric.calculationMethod
        }));
        continue;
      }

      if (source.stale) {
        reportExceptions.push(freeze({
          id: randomUUID(), tenantId, metricId, metricName: metric.name,
          type: "stale-data",
          detail: `Source data is stale: ${metric.name}`,
          staleSince: source.staleSince || "unknown",
          recordedAt: this.#now().toISOString()
        }));
      }

      let calculatedValue;
      if (metric.calculationMethod === "count") {
        calculatedValue = Number(source.value);
      } else if (metric.calculationMethod === "rate") {
        calculatedValue = source.denominator > 0
          ? Number(source.value) / Number(source.denominator)
          : 0;
      } else if (metric.calculationMethod === "sum") {
        calculatedValue = Number(source.value);
      } else if (metric.calculationMethod === "status-distribution") {
        calculatedValue = freeze({ ...source.value });
      }

      results.push(freeze({
        metricId, metricName: metric.name, value: calculatedValue, available: true,
        calculationMethod: metric.calculationMethod, stale: !!source.stale
      }));

      sourceReferences.push(freeze({
        id: randomUUID(), metricId, metricName: metric.name,
        sourcePackage: source.sourcePackage || metric.authoritativeSource,
        asOf: source.asOf || this.#now().toISOString(),
        recordCount: source.recordCount || null
      }));
    }

    const reportId = randomUUID();
    const report = freeze({
      id: reportId, tenantId, definitionId, definitionName: def.name,
      generatedAt: this.#now().toISOString(), generatedBy: p.id,
      filters: freeze(appliedFilters),
      results: freeze(results),
      sourceReferences: freeze(sourceReferences),
      exceptions: freeze(reportExceptions),
      status: "generated", finalized: false,
      idempotencyKey: idempotencyKey || null
    });

    this.#reports.set(reportId, report);
    if (idempotencyKey) this.#reportByKey.set(`${tenantId}:${idempotencyKey}`, reportId);
    this.#record(tenantId, reportId, "ReportGenerated", p.id, {
      definitionName: def.name, metricCount: results.length, exceptionCount: reportExceptions.length
    });
    return report;
  }

  // --- Snapshot Finalization ---

  finalizeSnapshotAuthorized({ sessionToken, tenantId, reportId }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*", `reporting:snapshot:${reportId}:finalize`);
    const report = this.#reports.get(reportId);
    if (!report || report.tenantId !== tenantId) throw new Error("Report not found.");
    if (report.finalized) throw new Error("Report is already finalized.");

    const snapshot = freeze({
      id: randomUUID(), tenantId, reportId,
      report: report,
      finalizedAt: this.#now().toISOString(), finalizedBy: p.id,
      immutable: true
    });
    this.#snapshots.set(snapshot.id, snapshot);

    const finalized = freeze({ ...report, finalized: true, status: "finalized" });
    this.#reports.set(reportId, finalized);

    this.#record(tenantId, reportId, "SnapshotFinalized", p.id, { snapshotId: snapshot.id });
    return snapshot;
  }

  // --- Exceptions ---

  recordExceptionAuthorized({ sessionToken, tenantId, reportId, type, detail, metricName }) {
    const p = this.#permit(sessionToken, tenantId, "operations.exceptions.manage", `reporting:exception:${reportId}:record`);
    const report = this.#reports.get(reportId);
    if (!report || report.tenantId !== tenantId) throw new Error("Report not found.");
    if (report.finalized) throw new Error("Cannot add exceptions to finalized report.");
    if (!type || !detail) throw new Error("Exception type and detail are required.");

    const exception = freeze({
      id: randomUUID(), tenantId, reportId, metricName: metricName || null,
      type, detail,
      recordedAt: this.#now().toISOString(), recordedBy: p.id
    });
    const list = this.#exceptions.get(reportId) || [];
    list.push(exception);
    this.#exceptions.set(reportId, list);
    this.#record(tenantId, reportId, "ExceptionRecorded", p.id, { type, detail });
    return exception;
  }

  // --- Export ---

  requestExportAuthorized({ sessionToken, tenantId, snapshotId, format, idempotencyKey }) {
    const p = this.#permit(sessionToken, tenantId, "operations.*", `reporting:export:${snapshotId}:request`);
    if (!EXPORT_FORMATS.includes(format))
      throw new Error(`Invalid export format. Must be one of: ${EXPORT_FORMATS.join(", ")}`);

    if (idempotencyKey) {
      const existing = this.#exportByKey.get(`${tenantId}:${idempotencyKey}`);
      if (existing) return this.#exports.get(existing);
    }

    const snapshot = this.#snapshots.get(snapshotId);
    if (!snapshot || snapshot.tenantId !== tenantId) throw new Error("Snapshot not found.");

    const exp = freeze({
      id: randomUUID(), tenantId, snapshotId, format,
      status: "completed",
      exportedAt: this.#now().toISOString(), exportedBy: p.id,
      evidence: freeze({ snapshotId, format, resultCount: snapshot.report.results.length }),
      idempotencyKey: idempotencyKey || null
    });
    this.#exports.set(exp.id, exp);
    if (idempotencyKey) this.#exportByKey.set(`${tenantId}:${idempotencyKey}`, exp.id);
    this.#record(tenantId, exp.id, "ExportRequested", p.id, { snapshotId, format });
    return exp;
  }

  // --- Read ---

  listDefinitionsAuthorized({ sessionToken, tenantId }) {
    this.#permit(sessionToken, tenantId, "operations.read", "reporting:definitions:list");
    const defs = [];
    for (const d of this.#reportDefs.values()) {
      if (d.tenantId === tenantId) defs.push(d);
    }
    return freeze(defs);
  }

  getResultsAuthorized({ sessionToken, tenantId, reportId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `reporting:report:${reportId}:results`);
    const report = this.#reports.get(reportId);
    if (!report || report.tenantId !== tenantId) throw new Error("Report not found.");
    return report;
  }

  getSnapshotHistoryAuthorized({ sessionToken, tenantId }) {
    this.#permit(sessionToken, tenantId, "operations.read", "reporting:snapshots:history");
    const snaps = [];
    for (const s of this.#snapshots.values()) {
      if (s.tenantId === tenantId) snaps.push(s);
    }
    return freeze(snaps);
  }

  inspectSourceReferencesAuthorized({ sessionToken, tenantId, reportId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `reporting:report:${reportId}:sources`);
    const report = this.#reports.get(reportId);
    if (!report || report.tenantId !== tenantId) throw new Error("Report not found.");
    return report.sourceReferences;
  }

  getExportStatusAuthorized({ sessionToken, tenantId, exportId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `reporting:export:${exportId}:status`);
    const exp = this.#exports.get(exportId);
    if (!exp || exp.tenantId !== tenantId) throw new Error("Export not found.");
    return exp;
  }

  getHistoryAuthorized({ sessionToken, tenantId, subjectId }) {
    this.#permit(sessionToken, tenantId, "operations.read", `reporting:history:${subjectId}`);
    return freeze([...(this.#history.get(subjectId) || [])]);
  }

  // --- Forbidden scope ---

  predictiveModelAuthorized() { throw new Error("BP-015 does not perform predictive modeling."); }
  aiConclusionAuthorized() { throw new Error("BP-015 does not generate AI conclusions."); }
  automateDecisionAuthorized() { throw new Error("BP-015 does not automate executive decisions."); }
  crossTenantBenchmarkAuthorized() { throw new Error("BP-015 does not benchmark across tenants."); }
  mutateSourceAuthorized() { throw new Error("BP-015 does not mutate source records."); }
  autonomousResolutionAuthorized() { throw new Error("BP-015 does not resolve exceptions autonomously."); }
  deliverCommunicationAuthorized() { throw new Error("BP-015 does not deliver communications."); }
  externalBiAuthorized() { throw new Error("BP-015 does not integrate with external BI systems."); }
}
