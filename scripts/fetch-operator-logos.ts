import { config } from "dotenv";
config({ path: ".env.local" });

import { put } from "@vercel/blob";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import * as fs from "fs";
import * as path from "path";

// Google Favicon API - works anywhere, returns favicons at various sizes
const GOOGLE_FAVICON_URL = "https://www.google.com/s2/favicons?domain=";
const FAVICON_SIZE = 128; // Max size available

interface Operator {
  [key: string]: string;
}

function extractDomain(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

async function fetchAndUploadLogo(
  domain: string,
  slug: string
): Promise<string | null> {
  const googleFaviconUrl = `${GOOGLE_FAVICON_URL}${domain}&sz=${FAVICON_SIZE}`;

  try {
    const response = await fetch(googleFaviconUrl);
    if (!response.ok) {
      console.log(`  ❌ No favicon for ${domain} (${response.status})`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const blob = await response.blob();
    
    // Skip if it's the default globe icon (very small file)
    if (blob.size < 500) {
      console.log(`  ⏭️  Default icon for ${domain} (skipped)`);
      return null;
    }

    // Upload to Vercel Blob
    const { url } = await put(`operators/${slug}/logo.png`, blob, {
      access: "public",
      contentType: "image/png",
    });

    console.log(`  ✅ ${domain} → ${url}`);
    return url;
  } catch (error) {
    console.log(`  ❌ Error for ${domain}:`, error);
    return null;
  }
}

async function processOperatorsCsv(filePath: string) {
  console.log(`\nProcessing: ${filePath}`);

  const content = fs.readFileSync(filePath, "utf-8");
  const records: Operator[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  });

  // Find the website column (different CSVs use different names)
  const websiteCol =
    Object.keys(records[0] || {}).find((k) =>
      k.toLowerCase().includes("website")
    ) || "website";
  const nameCol =
    Object.keys(records[0] || {}).find(
      (k) => k.toLowerCase() === "name" || k.toLowerCase() === "business name"
    ) || "name";
  const slugCol = Object.keys(records[0] || {}).find((k) =>
    k.toLowerCase().includes("slug")
  );

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const record of records) {
    const website = record[websiteCol];
    const name = record[nameCol] || "unknown";
    const slug =
      slugCol && record[slugCol]
        ? record[slugCol]
        : name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Skip if already has logo
    if (record.logo_url) {
      skipped++;
      continue;
    }

    const domain = extractDomain(website);
    if (!domain) {
      console.log(`  ⏭️  No website for ${name}`);
      skipped++;
      continue;
    }

    const logoUrl = await fetchAndUploadLogo(domain, slug);
    if (logoUrl) {
      record.logo_url = logoUrl;
      updated++;
    } else {
      failed++;
    }

    // Rate limit: 100ms between requests
    await new Promise((r) => setTimeout(r, 100));
  }

  // Add logo_url column if not present
  const columns = Object.keys(records[0] || {});
  if (!columns.includes("logo_url")) {
    columns.push("logo_url");
  }

  // Write back
  const output = stringify(records, { header: true, columns });
  fs.writeFileSync(filePath, output);

  console.log(`  Done: ${updated} logos added, ${skipped} skipped, ${failed} failed`);
  return { updated, skipped, failed };
}

async function main() {
  const contentDir = path.join(process.cwd(), "content");

  // Find all operator CSV files
  const csvFiles = [
    path.join(contentDir, "operators.csv"),
    ...fs.readdirSync(path.join(contentDir, "operators")).map((f) =>
      path.join(contentDir, "operators", f)
    ),
  ].filter((f) => f.endsWith(".csv") && fs.existsSync(f));

  console.log(`Found ${csvFiles.length} operator CSV files`);

  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const file of csvFiles) {
    const { updated, skipped, failed } = await processOperatorsCsv(file);
    totalUpdated += updated;
    totalSkipped += skipped;
    totalFailed += failed;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total logos added: ${totalUpdated}`);
  console.log(`Total skipped: ${totalSkipped}`);
  console.log(`Total failed: ${totalFailed}`);
}

main().catch(console.error);
