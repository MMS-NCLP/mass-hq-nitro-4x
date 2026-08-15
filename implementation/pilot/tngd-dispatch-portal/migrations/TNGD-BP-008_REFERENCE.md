# TNGD-BP-008 Persistence Reference

An authorized provider-backed implementation shall create tenant-owned field-work-session, inspection-template, inspection-item-definition, inspection-execution, inspection-item-result, field-note, measurement-record, media-reference, diagnostic-report, field-exception, field-history, and report-share tables.

Every relationship shall use composite tenant-safe references, UUID identifiers, and `UNIQUE(id, tenant_id)` where applicable. One field session and one inspection execution shall be unique per tenant and dispatched work item/visit. Inspection item results shall enforce exactly `Does Not Apply`, `Pass`, `Flag`, or `Fail`. Provider enforcement shall reject changes to submitted inspection results, diagnostic reports, and field history. RLS shall derive tenant and role claims through `auth.jwt()` or an equivalent approved boundary.

Media tables shall store references and metadata only, not duplicated asset binaries. Customer report shares shall store a revocable hashed grant rather than a plaintext token. BP-009 columns are reference handoff fields only and shall not create repair or estimate execution. This reference does not authorize a database, asset provider, deployed migration, or detailed garage-door order form.
