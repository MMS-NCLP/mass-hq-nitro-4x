import { readFileSync } from "node:fs";
import { GuidedIntakeService } from "../src/intake/index.mjs";
import { CustomerCaseService } from "../src/customer/index.mjs";
import { AuditLog, SecureAccess } from "../src/security/index.mjs";

const TENANT_ID = "tenant-tngd";
const PASSWORD = "HCPImport2026!!";

function parseCSVRow(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseTags(raw) {
  if (!raw) return [];
  return raw.split(",").map(t => t.trim().replace(/^'|'$/g, "")).filter(Boolean);
}

function parseAmount(raw) {
  if (!raw) return 0;
  return parseFloat(raw.replace(/[$,]/g, "")) || 0;
}

function parseEmails(raw) {
  if (!raw) return [];
  return raw.split(",").map(e => e.trim()).filter(Boolean);
}

export function mapHCPRow(fields) {
  const addresses = [];
  if (fields[23]) {
    addresses.push({
      streetLine1: fields[23] || null,
      streetLine2: fields[24] || null,
      city: fields[25] || null,
      state: fields[26] || null,
      postalCode: fields[27] || null,
      isBilling: fields[28] === "true",
      notes: fields[29] || null
    });
  }
  if (fields[30]) {
    addresses.push({
      streetLine1: fields[30] || null,
      streetLine2: fields[31] || null,
      city: fields[32] || null,
      state: fields[33] || null,
      postalCode: fields[34] || null,
      isBilling: fields[35] === "true",
      notes: fields[36] || null
    });
  }
  const hcpId = fields[14];
  const tags = parseTags(fields[12]);
  if (hcpId) tags.push(`hcp:${hcpId}`);
  return {
    firstName: fields[0] || "",
    lastName: fields[1] || "",
    displayName: fields[2] || `${fields[0] || ""} ${fields[1] || ""}`.trim(),
    mobileNumber: fields[3] || null,
    homeNumber: fields[4] || null,
    email: fields[5] || null,
    additionalEmails: parseEmails(fields[6]),
    company: fields[7] || null,
    role: fields[8] || null,
    workNumber: fields[9] || null,
    billsTo: fields[10] || null,
    acceptsBillsFrom: fields[11] || null,
    tags,
    notes: fields[13] || null,
    customerType: fields[15] || "homeowner",
    notificationsEnabled: fields[16] !== "false",
    isContractor: fields[17] === "true",
    leadSource: fields[18] || null,
    customerCreatedAt: fields[19] || null,
    doNotService: fields[20] === "true",
    lastServiceDate: fields[21] || null,
    lifetimeValue: parseAmount(fields[22]),
    addresses,
    preferredContact: "phone"
  };
}

export { parseCSVRow };

const csvPath = process.argv[2];
if (!csvPath) {
  process.stdout.write("Usage: node scripts/import-hcp-customers.mjs <csv-path>\n");
  process.stdout.write("V1 in-memory mode: validates parsing and creation, records do not persist.\n");
  process.exit(0);
}

const csvText = readFileSync(csvPath, "utf8");
const lines = csvText.split(/\r?\n/).filter(line => line.trim());
const dataLines = lines.slice(1);

process.stdout.write(`HCP Customer Import — ${dataLines.length} rows\n`);
process.stdout.write(`Tenant: ${TENANT_ID}\n\n`);

const auditLog = new AuditLog();
const secureAccess = new SecureAccess({ auditLog });
await secureAccess.bootstrapTenantAdmin({ tenantId: TENANT_ID, email: "import@mass-hq.local", password: PASSWORD });
const admin = await secureAccess.authenticate({ tenantId: TENANT_ID, email: "import@mass-hq.local", password: PASSWORD });
const guidedIntake = new GuidedIntakeService({ secureAccess, auditLog });
const customerCases = new CustomerCaseService({ secureAccess, guidedIntake, auditLog });

let created = 0;
let matched = 0;
let skipped = 0;
const errors = [];

for (let i = 0; i < dataLines.length; i++) {
  const fields = parseCSVRow(dataLines[i]);
  const record = mapHCPRow(fields);
  try {
    const result = customerCases.createCustomerAuthorized({
      sessionToken: admin.token,
      tenantId: TENANT_ID,
      record
    });
    if (result.created) {
      created++;
    } else {
      matched++;
    }
  } catch (error) {
    skipped++;
    errors.push({ row: i + 2, name: record.displayName, error: error.message });
  }
}

process.stdout.write(`Results:\n`);
process.stdout.write(`  Created: ${created}\n`);
process.stdout.write(`  Matched (deduplicated): ${matched}\n`);
process.stdout.write(`  Skipped (errors): ${skipped}\n`);
if (errors.length) {
  process.stdout.write(`\nSkipped rows:\n`);
  for (const e of errors) {
    process.stdout.write(`  Row ${e.row}: ${e.name} — ${e.error}\n`);
  }
}
process.stdout.write(`\nImport complete. ${created + matched} customer records processed.\n`);
