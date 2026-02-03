import "dotenv/config";
import { sql } from "@vercel/postgres";
import * as fs from "fs";
import * as path from "path";

interface RegionContent {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bestFor: string[];
  bestTimeToVisit: string;
  gettingThere: string;
  proTips: string[];
}

function parseFrontMatter(content: string): { frontMatter: Record<string, string>; body: string } {
  // Trim leading whitespace and handle various front matter formats
  const trimmed = content.trim();
  const match = trimmed.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontMatter: {}, body: content };

  const frontMatter: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      frontMatter[key.trim()] = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
    }
  });

  return { frontMatter, body: match[2] };
}

function parseRegionMarkdown(content: string): RegionContent {
  const { frontMatter, body } = parseFrontMatter(content);

  // Extract sections
  const sections: Record<string, string> = {};
  const sectionRegex = /## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g;
  let match;
  while ((match = sectionRegex.exec(body)) !== null) {
    sections[match[1].trim().toLowerCase()] = match[2].trim();
  }

  // Extract About section (everything before first ##)
  const aboutMatch = body.match(/# About [^\n]+\n([\s\S]*?)(?=\n## |$)/);
  const description = aboutMatch ? aboutMatch[1].trim() : "";

  // Parse Best For list
  const bestFor: string[] = [];
  if (sections["best for"]) {
    const items = sections["best for"].match(/^- .+$/gm);
    if (items) {
      items.forEach((item) => {
        bestFor.push(item.replace(/^- /, "").trim());
      });
    }
  }

  // Parse Pro Tips list
  const proTips: string[] = [];
  if (sections["pro tips"]) {
    const items = sections["pro tips"].match(/^- .+$/gm);
    if (items) {
      items.forEach((item) => {
        proTips.push(item.replace(/^- /, "").trim());
      });
    }
  }

  return {
    slug: frontMatter.slug || "",
    name: frontMatter.name || "",
    tagline: frontMatter.tagline || "",
    description,
    bestFor,
    bestTimeToVisit: sections["best time to visit"] || "",
    gettingThere: sections["getting there"] || "",
    proTips,
  };
}

async function importRegions() {
  console.log("📥 Importing region content...\n");

  const contentDir = path.join(__dirname, "../content/regions");
  
  if (!fs.existsSync(contentDir)) {
    console.error("Content directory not found:", contentDir);
    process.exit(1);
  }

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));
  console.log(`Found ${files.length} region files\n`);

  for (const file of files) {
    const content = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const region = parseRegionMarkdown(content);

    console.log(`Processing: ${region.name} (${region.slug})`);

    // Build full description with all content
    const fullDescription = [
      region.description,
      region.bestFor.length ? `\n\n**Best For:**\n${region.bestFor.map(b => `• ${b}`).join("\n")}` : "",
      region.bestTimeToVisit ? `\n\n**Best Time to Visit:**\n${region.bestTimeToVisit}` : "",
      region.gettingThere ? `\n\n**Getting There:**\n${region.gettingThere}` : "",
      region.proTips.length ? `\n\n**Pro Tips:**\n${region.proTips.map(t => `• ${t}`).join("\n")}` : "",
    ].filter(Boolean).join("");

    // Update database
    const result = await sql`
      UPDATE regions 
      SET 
        description = ${fullDescription},
        updated_at = NOW()
      WHERE slug = ${region.slug}
      RETURNING id, name
    `;

    if (result.rows.length > 0) {
      console.log(`   ✅ Updated: ${result.rows[0].name}`);
    } else {
      console.log(`   ⚠️ Not found in database: ${region.slug}`);
    }
  }

  console.log("\n✅ Import complete!");
  process.exit(0);
}

importRegions().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
