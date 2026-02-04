import "dotenv/config";
import { sql } from "@vercel/postgres";
import * as fs from "fs";
import * as path from "path";

interface NormalizedService {
  name: string;
  price: string | null;
  duration: string | null;
  groupSize: string | null;
  includes: string | null;
  description: string | null;
  category?: string;
}

function normalizeServiceDetails(raw: any): NormalizedService[] {
  if (!raw || typeof raw !== "object") return [];

  const services: NormalizedService[] = [];

  // Format 1: Dict with top-level "sessions" array
  if (raw.sessions && Array.isArray(raw.sessions)) {
    for (const session of raw.sessions) {
      services.push(normalizeSession(session));
    }
    return services;
  }

  // Format 2: Dict keyed by activity type, each with sessions
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "object" && value !== null) {
      const val = value as any;
      if (val.sessions && Array.isArray(val.sessions)) {
        for (const session of val.sessions) {
          const svc = normalizeSession(session);
          svc.category = formatCategoryName(key);
          services.push(svc);
        }
      }
    }
  }

  return services;
}

function normalizeSession(session: any): NormalizedService {
  const priceStr = formatPrice(session.priceAdult, session.priceChild, session.pricePrivate);
  const groupStr = formatGroupSize(session.groupSizeMin, session.groupSizeMax);
  const includesArr = session.includes || session.whatToBring;

  return {
    name: session.name || "Unnamed Session",
    price: priceStr,
    duration: session.duration || null,
    groupSize: groupStr,
    includes: Array.isArray(includesArr) ? includesArr.join(", ") : (typeof includesArr === "string" ? includesArr : null),
    description: session.description || null,
  };
}

function formatPrice(adult: number | null, child: number | null, priv: number | null): string | null {
  const parts: string[] = [];
  if (adult) parts.push(`£${adult} per person`);
  if (child && child !== adult) parts.push(`£${child} (child)`);
  if (priv) parts.push(`£${priv} (private group)`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

function formatGroupSize(min: number | null, max: number | null): string | null {
  if (min && max) return `${min}–${max} people`;
  if (max) return `Up to ${max} people`;
  if (min) return `Min ${min} people`;
  return null;
}

function formatCategoryName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

async function main() {
  const researchDir = path.join(process.cwd(), "data", "research");
  const files = ["tier1-1.json", "tier2-1.json"];

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const file of files) {
    const filePath = path.join(researchDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${file}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const operators = data.operators || [];

    console.log(`\nProcessing ${file} (${operators.length} operators)...`);

    for (const op of operators) {
      if (!op.slug) {
        skipped++;
        continue;
      }

      const raw = op.serviceDetails;
      if (!raw) {
        skipped++;
        continue;
      }

      const normalized = normalizeServiceDetails(raw);
      if (normalized.length === 0) {
        skipped++;
        continue;
      }

      const result = await sql`
        UPDATE operators 
        SET service_details = ${JSON.stringify(normalized)}::jsonb,
            updated_at = NOW()
        WHERE slug = ${op.slug}
      `;

      if (result.rowCount && result.rowCount > 0) {
        console.log(`✅ ${op.slug} → ${normalized.length} services`);
        updated++;
      } else {
        console.log(`❌ ${op.slug} → not found in DB`);
        notFound++;
      }
    }
  }

  console.log(`\n=== Done: ${updated} updated, ${skipped} skipped, ${notFound} not found ===`);

  // Verify
  const count = await sql`SELECT count(*) as cnt FROM operators WHERE service_details IS NOT NULL AND service_details != '[]'::jsonb`;
  console.log(`Operators with service_details: ${count.rows[0].cnt}`);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
