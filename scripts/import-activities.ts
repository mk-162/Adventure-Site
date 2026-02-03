import "dotenv/config";
import { sql } from "@vercel/postgres";
import * as fs from "fs";
import * as path from "path";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function importActivities() {
  console.log("📥 Importing activity content...\n");

  const csvPath = path.join(__dirname, "../content/activities.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.error("Activities CSV not found:", csvPath);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, "utf-8");
  const activities = parseCSV(content);
  
  console.log(`Found ${activities.length} activities\n`);

  let updated = 0;
  let notFound = 0;

  for (const act of activities) {
    const name = act["Activity Name"];
    const slug = slugify(name);
    
    // Build full description with extras
    let fullDescription = act["description"] || "";
    
    if (act["highlights"]) {
      fullDescription += `\n\n**Highlights:**\n${act["highlights"].split(",").map(h => `• ${h.trim()}`).join("\n")}`;
    }
    
    if (act["whats_included"]) {
      fullDescription += `\n\n**What's Included:**\n${act["whats_included"].split(",").map(h => `• ${h.trim()}`).join("\n")}`;
    }
    
    if (act["requirements"]) {
      fullDescription += `\n\n**Requirements:**\n${act["requirements"].split(",").map(h => `• ${h.trim()}`).join("\n")}`;
    }

    if (!fullDescription.trim()) {
      continue; // Skip if no new content
    }

    const result = await sql`
      UPDATE activities 
      SET 
        description = ${fullDescription},
        updated_at = NOW()
      WHERE slug = ${slug}
      RETURNING id, name
    `;

    if (result.rows.length > 0) {
      console.log(`✅ ${result.rows[0].name}`);
      updated++;
    } else {
      console.log(`⚠️ Not found: ${name} (${slug})`);
      notFound++;
    }
  }

  console.log(`\n✅ Import complete! Updated: ${updated}, Not found: ${notFound}`);
  process.exit(0);
}

importActivities().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
