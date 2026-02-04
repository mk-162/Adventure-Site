/**
 * Wales Asset Archive → Site Image Mapper
 * 
 * Maps 311 archive images (1024px, low-res) to site pages.
 * These are supplementary/gallery images — NOT hero-ready (need 1920px for heroes).
 * 
 * Usage:
 *   npx tsx scripts/map-archive-images.ts           # dry run — shows mapping
 *   npx tsx scripts/map-archive-images.ts --apply    # writes mapping to DB
 *   npx tsx scripts/map-archive-images.ts --report   # outputs JSON report
 */

import fs from "fs";
import path from "path";
import { db } from "../src/db";
import { operators, activities } from "../src/db/schema";
import { eq, sql } from "drizzle-orm";

// ── Image inventory ──────────────────────────────────────────────────────────

interface ImageEntry {
  path: string;       // relative to public/
  category: string;   // e.g. "coasteering", "brecon-beacons", "homepage-cta"
  source: "wales" | "activities" | "misc" | "regions";
  index: number;      // 0-based within category
  isHero: boolean;
  width: number;      // 1024 or 1920
}

function scanImages(): ImageEntry[] {
  const images: ImageEntry[] = [];
  const publicDir = path.join(process.cwd(), "public");

  // Wales landscape images: {subject}-{region}-{hash}.jpg
  const walesDir = path.join(publicDir, "images/wales");
  if (fs.existsSync(walesDir)) {
    const files = fs.readdirSync(walesDir).filter(f => f.endsWith(".jpg")).sort();
    const byCat: Record<string, string[]> = {};
    for (const f of files) {
      const cat = f.replace(/-[a-f0-9]{8}\.jpg$/, "");
      (byCat[cat] ??= []).push(f);
    }
    for (const [cat, catFiles] of Object.entries(byCat)) {
      catFiles.forEach((f, i) => {
        images.push({
          path: `/images/wales/${f}`,
          category: cat,
          source: "wales",
          index: i,
          isHero: false,
          width: 1024,
        });
      });
    }
  }

  // Activity images: {activity}-hero.jpg or {activity}-NN-{hash}.jpg
  const actDir = path.join(publicDir, "images/activities");
  if (fs.existsSync(actDir)) {
    const files = fs.readdirSync(actDir).filter(f => f.endsWith(".jpg")).sort();
    const byCat: Record<string, string[]> = {};
    for (const f of files) {
      const isHero = f.includes("-hero");
      const cat = isHero
        ? f.replace(/-hero\.jpg$/, "")
        : f.replace(/-\d{2}-[a-f0-9]{8}\.jpg$/, "");
      (byCat[cat] ??= []).push(f);
    }
    for (const [cat, catFiles] of Object.entries(byCat)) {
      catFiles.forEach((f, i) => {
        images.push({
          path: `/images/activities/${f}`,
          category: cat,
          source: "activities",
          index: i,
          isHero: f.includes("-hero"),
          width: 1024,
        });
      });
    }
  }

  // Misc images: {category}-NN-{hash}.jpg
  const miscDir = path.join(publicDir, "images/misc");
  if (fs.existsSync(miscDir)) {
    const files = fs.readdirSync(miscDir).filter(f => f.endsWith(".jpg")).sort();
    const byCat: Record<string, string[]> = {};
    for (const f of files) {
      const match = f.match(/^(.+?)-(\d{2})-[a-f0-9]{8}\.jpg$/);
      const cat = match ? match[1] : f.replace(/-[a-f0-9]{8}\.jpg$/, "");
      (byCat[cat] ??= []).push(f);
    }
    for (const [cat, catFiles] of Object.entries(byCat)) {
      catFiles.forEach((f, i) => {
        images.push({
          path: `/images/misc/${f}`,
          category: cat,
          source: "misc",
          index: i,
          isHero: false,
          width: 1024,
        });
      });
    }
  }

  // Region hero images (these are 1920px)
  const regDir = path.join(publicDir, "images/regions");
  if (fs.existsSync(regDir)) {
    const files = fs.readdirSync(regDir).filter(f => f.endsWith(".jpg")).sort();
    for (const f of files) {
      const cat = f.replace(/-hero\.jpg$/, "");
      images.push({
        path: `/images/regions/${f}`,
        category: cat,
        source: "regions",
        index: 0,
        isHero: true,
        width: 1920,
      });
    }
  }

  return images;
}

// ── Mapping rules ────────────────────────────────────────────────────────────

interface PageMapping {
  page: string;
  section: string;
  imagePool: string[];   // paths
  usage: "gallery" | "background" | "card" | "inline" | "hero";
  notes: string;
}

// Region slug → wales/ image categories
const regionToLandscape: Record<string, string[]> = {
  "snowdonia": ["snowdonia-wales", "snowdon-mountain", "lake-snowdonia", "forest-snowdonia"],
  "brecon-beacons": ["brecon-beacons-wales", "lake-brecon-beacons"],
  "pembrokeshire": ["pembrokeshire-coast-wales", "coastline-pembrokeshire"],
  "gower": ["coastline-gower"],
  "anglesey": ["coastline-anglesey", "forest-anglesey"],
  "llyn-peninsula": ["lake-llyn-peninsula"],
  "north-wales": ["forest-north-wales", "welsh-mountains"],
  "south-wales": ["coastline-south-wales", "forest-south-wales"],
  "mid-wales": ["wales-countryside", "welsh-hills"],
  "wye-valley": ["forest-wales-general", "wales-countryside"],
  "carmarthenshire": ["wales-countryside", "welsh-hills"],
  "ceredigion": ["coastline-wales-general", "wales-countryside"],
};

// Activity slug → activities/ image category
const activitySlugMap: Record<string, string> = {
  "coasteering": "coasteering",
  "surfing": "surfing",
  "kayaking": "kayaking",
  "caving": "caving",
  "climbing": "climbing",
  "mountain-biking": "mountain-biking",
  "hiking": "hiking",
  "gorge-walking": "gorge-walking",
  "wild-swimming": "wild-swimming",
  "zip-lining": "zip-lining",
  "paddleboarding": "paddleboarding",
  "rafting": "rafting",
  "sea-kayaking": "sea-kayaking",
  "stand-up-paddleboarding": "sup",
  "archery": "archery",
  "mine-exploration": "mine-exploration",
  "high-ropes": "high-ropes",
  "windsurfing": "windsurfing",
  "trail-running": "trail-running",
  "gorge-scrambling": "gorge-scrambling",
  "hiking-scrambling": "hiking-scrambling",
  "boat-tours": "boat-tour",
  "wildlife-boat-tours": "wildlife-boat-tour",
};

// Page → misc/ category
const pageMiscMap: Record<string, string> = {
  "/": "homepage-hero",
  "/about": "about-mission",
  "/contact": "contact-help",
  "/help": "contact-help",
  "/safety": "safety-mountain",
  "/events": "events-festival",
  "/for-operators": "partner-business",
  "/itineraries": "itinerary-planning",
  "/guides/camping-gear": "gear-camping",
  "/guides/climbing-gear": "gear-climbing",
  "/guides/hiking-gear": "gear-hiking",
};

function buildMappings(images: ImageEntry[]): PageMapping[] {
  const mappings: PageMapping[] = [];
  const bySourceCat = new Map<string, ImageEntry[]>();
  
  for (const img of images) {
    const key = `${img.source}:${img.category}`;
    (bySourceCat.get(key) ?? (() => { const a: ImageEntry[] = []; bySourceCat.set(key, a); return a; })()).push(img);
  }

  // Region pages → landscape gallery
  for (const [region, cats] of Object.entries(regionToLandscape)) {
    const pool: string[] = [];
    for (const cat of cats) {
      const imgs = bySourceCat.get(`wales:${cat}`) ?? [];
      pool.push(...imgs.map(i => i.path));
    }
    if (pool.length > 0) {
      mappings.push({
        page: `/[region] (${region})`,
        section: "scenic-gallery",
        imagePool: pool,
        usage: "gallery",
        notes: `${pool.length} landscape photos for ${region} region page gallery. 1024px — good for gallery cards, not hero.`,
      });
    }
  }

  // Activity pages → activity gallery
  for (const [slug, cat] of Object.entries(activitySlugMap)) {
    const imgs = bySourceCat.get(`activities:${cat}`) ?? [];
    const gallery = imgs.filter(i => !i.isHero).map(i => i.path);
    if (gallery.length > 0) {
      mappings.push({
        page: `/activities/${slug}`,
        section: "photo-gallery",
        imagePool: gallery,
        usage: "gallery",
        notes: `${gallery.length} gallery photos for ${slug} activity page. 1024px.`,
      });
    }
  }

  // Static pages → misc images
  for (const [page, cat] of Object.entries(pageMiscMap)) {
    const imgs = bySourceCat.get(`misc:${cat}`) ?? [];
    if (imgs.length > 0) {
      mappings.push({
        page,
        section: "page-images",
        imagePool: imgs.map(i => i.path),
        usage: "inline",
        notes: `${imgs.length} images for ${page}. 1024px — inline/card use.`,
      });
    }
  }

  // Seasonal content
  for (const season of ["spring", "summer", "autumn", "winter"]) {
    const imgs = bySourceCat.get(`misc:seasonal-${season}`) ?? [];
    if (imgs.length > 0) {
      mappings.push({
        page: `/guides/${season}-adventures`,
        section: "seasonal-gallery",
        imagePool: imgs.map(i => i.path),
        usage: "gallery",
        notes: `${imgs.length} seasonal ${season} images. 1024px.`,
      });
    }
  }

  // Gear guides
  for (const gear of ["camping", "climbing", "hiking", "water"]) {
    const imgs = bySourceCat.get(`misc:gear-${gear}`) ?? [];
    if (imgs.length > 0) {
      mappings.push({
        page: `/guides/${gear}-gear`,
        section: "gear-photos",
        imagePool: imgs.map(i => i.path),
        usage: "inline",
        notes: `${imgs.length} gear images for ${gear} guide.`,
      });
    }
  }

  return mappings;
}

// ── Output ───────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const mode = args.includes("--apply") ? "apply" : args.includes("--report") ? "report" : "dry";

  const images = scanImages();
  const mappings = buildMappings(images);

  console.log(`\n📸 Wales Asset Archive Mapper`);
  console.log(`═══════════════════════════════════════`);
  console.log(`Total images scanned: ${images.length}`);
  console.log(`  wales/      ${images.filter(i => i.source === "wales").length} landscape images`);
  console.log(`  activities/ ${images.filter(i => i.source === "activities").length} activity images`);
  console.log(`  misc/       ${images.filter(i => i.source === "misc").length} page images`);
  console.log(`  regions/    ${images.filter(i => i.source === "regions").length} region heroes (1920px)`);
  console.log(`\nMappings generated: ${mappings.length}`);
  console.log(`Total images mapped: ${mappings.reduce((sum, m) => sum + m.imagePool.length, 0)}`);
  console.log();

  if (mode === "report") {
    const report = {
      generated: new Date().toISOString(),
      totalImages: images.length,
      mappings: mappings.map(m => ({
        page: m.page,
        section: m.section,
        usage: m.usage,
        imageCount: m.imagePool.length,
        images: m.imagePool,
        notes: m.notes,
      })),
      unmapped: images
        .filter(img => !mappings.some(m => m.imagePool.includes(img.path)))
        .map(i => i.path),
    };
    const outPath = path.join(process.cwd(), "data/image-mapping.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report written to data/image-mapping.json`);
    return;
  }

  // Print mappings
  for (const m of mappings) {
    console.log(`📍 ${m.page} → ${m.section}`);
    console.log(`   Usage: ${m.usage} | Images: ${m.imagePool.length}`);
    console.log(`   ${m.notes}`);
    if (mode === "dry") {
      console.log(`   Preview: ${m.imagePool.slice(0, 3).join(", ")}${m.imagePool.length > 3 ? ` (+${m.imagePool.length - 3} more)` : ""}`);
    }
    console.log();
  }

  if (mode === "dry") {
    console.log(`\n🔍 Dry run complete. Use --apply to write mappings or --report for JSON output.`);
  }

  if (mode === "apply") {
    // Write the mapping JSON for components to consume at build time
    const mapPath = path.join(process.cwd(), "data/image-mapping.json");
    fs.mkdirSync(path.dirname(mapPath), { recursive: true });
    const mapData = {
      generated: new Date().toISOString(),
      mappings: mappings.map(m => ({
        page: m.page,
        section: m.section,
        usage: m.usage,
        images: m.imagePool,
      })),
    };
    fs.writeFileSync(mapPath, JSON.stringify(mapData, null, 2));
    console.log(`✅ Mapping written to data/image-mapping.json`);
    console.log(`   Components can import this to render galleries.`);
  }

  process.exit(0);
}

main().catch(console.error);
