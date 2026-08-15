# BP-008 Diagnostic Report and Media-Reference Contract

The immutable DiagnosticReport contains the 25-Point Inspection name, inspection-performed indicator, all 19 item definitions and results, customer-visible notes, measurements, door details, governed media references, and Flag/Fail findings. Internal-only Field Notes are excluded from share and download representations.

Customer access requires an explicit unguessable share grant. Download returns a provider-neutral JSON representation; no PDF generator, storage provider, email provider, or customer portal is selected by BP-008.

MediaReference records contain only category, asset identifier, MIME type, actor, and timestamp. The same binary asset is never copied into the inspection, report, handoff, invoice, warranty, timeline, or album. Before and after references are required for a performed inspection; diagnostic references are supported.

The BP-009 handoff contains only service-case, field-session, diagnostic-report, and finding references plus `repair-or-estimate-pending`. It does not create a repair, estimate, authorization, invoice, payment, warranty determination, or door order.
