import { existsSync, readFileSync, writeFileSync } from "fs";
import { basename, join, relative } from "path";
import {
  AuditGap,
  ContentInventoryItem,
  OPS_DIR,
  TASKS_DIR,
  TaskQueueItem,
  categoryToChannel,
  categoryToContentType,
  emptyInventoryItem,
  ensureDir,
  inventoryToCsv,
  listFiles,
  normalizeId,
  readJson,
  routeParts,
  severityWeight,
  slugToTitle,
  writeJson,
} from "./shared";

interface AuditFile {
  generatedAt?: string;
  stats?: Record<string, unknown>;
  gaps?: AuditGap[];
}

const now = new Date().toISOString();
const audit = readJson<AuditFile>(join(process.cwd(), "content", "content-gap-audit.json"), { gaps: [] });
const itemsById = new Map<string, ContentInventoryItem>();

function addOrMerge(item: ContentInventoryItem) {
  const existing = itemsById.get(item.id);
  if (!existing) {
    itemsById.set(item.id, item);
    return;
  }

  itemsById.set(item.id, {
    ...existing,
    ...item,
    priority: Math.max(existing.priority, item.priority),
    source_urls: Array.from(new Set([...existing.source_urls, ...item.source_urls])),
    source_count: Math.max(existing.source_count, item.source_count),
    review_notes: [existing.review_notes, item.review_notes].filter(Boolean).join(" | "),
    blocker_reason: [existing.blocker_reason, item.blocker_reason].filter(Boolean).join(" | "),
  });
}

function launchVisible(route: string, contentType: string, channel: string) {
  if (route === "/" || route.includes("snowdonia")) return true;
  if (contentType === "operator") {
    const strategic = [
      "zip-world",
      "adventure-parc-snowdonia",
      "bikepark-wales",
      "plas-y-brenin",
      "coed-y-brenin",
      "coed-y-brenin-nrw",
      "antur-stiniog",
      "beics-brenin",
      "bala-watersports",
      "snowdonia-watersports",
      "go-below-underground-adventures",
    ];
    return strategic.some((slug) => route.includes(slug));
  }
  return channel === "commercial" && route.includes("/directory/") ? false : contentType === "location_landing";
}

function qualityFromGap(severity: AuditGap["severity"]) {
  switch (severity) {
    case "critical":
      return 15;
    case "high":
      return 35;
    case "medium":
      return 55;
    case "low":
      return 70;
  }
}

for (const gap of audit.gaps ?? []) {
  const channel = categoryToChannel(gap.category);
  const contentType = categoryToContentType(gap.category);
  const route = gap.page || gap.slug;
  const { region, activity } = routeParts(route);
  const visible = launchVisible(route, contentType, channel);
  const basePriority = severityWeight(gap.severity) + (visible ? 25 : 0) + (channel === "commercial" ? 14 : 0) + (region === "snowdonia" ? 12 : 0);
  const id = normalizeId(`${contentType}-${gap.slug || route}`);

  addOrMerge(emptyInventoryItem({
    id,
    channel,
    content_type: contentType,
    route_or_slug: route,
    title: slugToTitle(gap.slug || route),
    region,
    activity,
    commercial_tier: channel === "commercial" ? (visible ? "strategic_big_player_or_launch_priority" : "unclassified_operator") : "not_applicable",
    priority: Math.min(100, basePriority),
    status: gap.severity === "critical" || gap.severity === "high" ? "research_needed" : "qa_needed",
    launch_visible: visible,
    evidence_status: gap.autoFixable ? "partial" : "missing",
    image_status: /image|hero|cover|logo/i.test(gap.issue) ? "missing" : "needs_review",
    copy_status: /description|content|thin/i.test(gap.issue) ? "missing" : "needs_review",
    seo_status: "needs_review",
    schema_status: "needs_review",
    commercial_review_status: channel === "commercial" ? "needs_review" : "not_applicable",
    safety_or_legal_status: channel === "dynamic" ? "needs_review" : "not_applicable",
    blocker_reason: gap.issue,
    review_notes: `Audit gap: ${gap.fix}`,
    quality_score: qualityFromGap(gap.severity),
    confidence_score: gap.autoFixable ? 45 : 25,
  }));
}

function addMarkdownContent(dir: string, contentType: string, channel: "evergreen" | "commercial" | "dynamic", routePrefix: string) {
  for (const file of listFiles(dir, ".md")) {
    if (basename(file).toLowerCase() === "readme.md") continue;
    const slug = basename(file, ".md");
    const route = `${routePrefix}/${slug}`.replace(/\/+/g, "/");
    const { region, activity } = routeParts(route);
    const id = normalizeId(`${contentType}-${slug}`);
    if (itemsById.has(id)) continue;

    const sourceUrls = extractUrls(readFileSync(file, "utf8"));
    addOrMerge(emptyInventoryItem({
      id,
      channel,
      content_type: contentType,
      route_or_slug: route,
      title: slugToTitle(slug),
      region: region || (contentType === "location_landing" ? slug : ""),
      activity,
      commercial_tier: channel === "commercial" ? "profile_brief_or_lure" : "not_applicable",
      priority: launchVisible(route, contentType, channel) ? 45 : 20,
      status: sourceUrls.length > 0 ? "qa_needed" : "research_needed",
      launch_visible: launchVisible(route, contentType, channel),
      source_count: sourceUrls.length,
      source_urls: sourceUrls,
      evidence_status: sourceUrls.length >= 2 ? "sourced" : sourceUrls.length === 1 ? "partial" : "missing",
      image_status: "needs_review",
      copy_status: "needs_review",
      seo_status: "needs_review",
      schema_status: "needs_review",
      commercial_review_status: channel === "commercial" ? "needs_review" : "not_applicable",
      safety_or_legal_status: channel === "dynamic" ? "needs_review" : "not_applicable",
      review_notes: `Existing markdown content: ${relative(process.cwd(), file)}`,
      quality_score: sourceUrls.length >= 2 ? 65 : 45,
      confidence_score: sourceUrls.length >= 2 ? 65 : 40,
    }));
  }
}

addMarkdownContent(join(process.cwd(), "content", "regions"), "location_landing", "evergreen", "");
addMarkdownContent(join(process.cwd(), "content", "operators", "profiles"), "operator", "commercial", "/directory");
addMarkdownContent(join(process.cwd(), "content", "itineraries"), "itinerary", "dynamic", "/itineraries");
addMarkdownContent(join(process.cwd(), "content", "safety"), "guide", "evergreen", "/guides");

for (const file of listFiles(join(process.cwd(), "data", "combo-pages"), ".json")) {
  const slug = basename(file, ".json");
  const [region = "", activity = ""] = slug.split("--");
  const route = `/${region}/things-to-do/${activity}`;
  const id = normalizeId(`activity-location-${slug}`);
  if (itemsById.has(id)) continue;
  const contentText = readFileSync(file, "utf8");
  const sourceUrls = extractUrls(contentText);
  addOrMerge(emptyInventoryItem({
    id,
    channel: "evergreen",
    content_type: "activity_location",
    route_or_slug: route,
    title: slugToTitle(slug),
    region,
    activity,
    priority: region === "snowdonia" ? 50 : 24,
    status: sourceUrls.length > 0 ? "qa_needed" : "research_needed",
    launch_visible: region === "snowdonia",
    source_count: sourceUrls.length,
    source_urls: sourceUrls,
    evidence_status: sourceUrls.length >= 3 ? "sourced" : sourceUrls.length > 0 ? "partial" : "missing",
    image_status: "needs_review",
    copy_status: "needs_review",
    seo_status: "needs_review",
    schema_status: "needs_review",
    review_notes: `Existing combo enrichment file: ${relative(process.cwd(), file)}`,
    quality_score: sourceUrls.length >= 3 ? 70 : 45,
    confidence_score: sourceUrls.length >= 3 ? 70 : 45,
  }));
}

function extractUrls(text: string) {
  return Array.from(new Set(text.match(/https?:\/\/[^\s)\]"']+/g) ?? [])).slice(0, 12);
}

function recommendedSkill(item: ContentInventoryItem) {
  if (item.channel === "commercial") return "directory-premium-lure-model";
  if (item.content_type === "activity_location") return "directory-activity-region-page";
  if (item.content_type === "location_landing") return "directory-region-page";
  if (item.content_type === "activity_landing" || item.content_type === "activity") return "directory-guide-content";
  if (item.content_type === "event") return "directory-event-content";
  if (item.content_type === "itinerary") return "directory-itinerary-builder";
  return "directory-content-production-system";
}

function taskType(item: ContentInventoryItem): TaskQueueItem["task_type"] {
  if (item.status === "research_needed" || item.evidence_status === "missing") return "research";
  if (item.channel === "commercial" && item.commercial_review_status === "needs_review") return "commercial_review";
  if (item.status === "qa_needed") return "qa";
  if (item.status === "refresh_due") return "refresh";
  return "generation";
}

function taskBrief(item: ContentInventoryItem) {
  return [
    `Improve content item ${item.id}: ${item.title}.`,
    `Channel: ${item.channel}. Content type: ${item.content_type}. Route/slug: ${item.route_or_slug}.`,
    item.region ? `Region: ${item.region}.` : "",
    item.activity ? `Activity: ${item.activity}.` : "",
    item.commercial_tier !== "not_applicable" ? `Commercial tier: ${item.commercial_tier}.` : "",
    item.blocker_reason ? `Known blocker: ${item.blocker_reason}.` : "",
    "Do not guess. Capture source URLs for every factual claim. Do not use AI-generated images. Return proposed file/data changes plus QA notes.",
  ].filter(Boolean).join("\n");
}

const items = Array.from(itemsById.values()).sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
const tasks: TaskQueueItem[] = items
  .filter((item) => !["published", "signed_off", "archived"].includes(item.status))
  .slice(0, 100)
  .map((item, index) => ({
    id: `content-ops-${String(index + 1).padStart(3, "0")}-${item.id}`,
    content_item_id: item.id,
    channel: item.channel,
    content_type: item.content_type,
    route_or_slug: item.route_or_slug,
    title: item.title,
    priority: item.priority,
    status: item.status,
    recommended_skill: recommendedSkill(item),
    task_type: taskType(item),
    brief: taskBrief(item),
    acceptance_criteria: [
      "Source URLs are included for factual claims.",
      "Image recommendations include provenance/licence notes or explicitly say image remains blocked.",
      "Commercial tier rules are respected; ordinary unpaid operators are not upgraded into free premium pages.",
      "The output recommends the next status: researched, qa_needed, reviewed, blocked, or signed_off.",
    ],
    source_requirements: [
      "Prefer official operator, local authority, event organiser, NRW/National Park, or recognised tourism sources.",
      "Avoid live pricing/timetable claims unless checked against a current official source and dated.",
      "No AI-generated images for real places, operators, or events.",
    ],
    output_path: `data/research/content-ops/${item.id}.json`,
  }));

const sourceRegistry = items.flatMap((item) => item.source_urls.map((url) => ({
  content_item_id: item.id,
  channel: item.channel,
  route_or_slug: item.route_or_slug,
  source_url: url,
  authority: "unreviewed",
  last_checked_at: "",
  notes: "Imported from existing content during content-ops audit.",
})));

const imageRegistry = items
  .filter((item) => item.image_status !== "not_applicable")
  .map((item) => ({
    content_item_id: item.id,
    route_or_slug: item.route_or_slug,
    image_status: item.image_status,
    image_source_url: item.image_source_url,
    notes: item.image_status === "missing" ? "Image issue flagged by audit." : "Needs image provenance review.",
  }));

ensureDir(OPS_DIR);
ensureDir(TASKS_DIR);
writeFileSync(join(OPS_DIR, "content-inventory.csv"), inventoryToCsv(items), "utf8");
writeJson(join(OPS_DIR, "content-inventory.json"), { generatedAt: now, sourceAuditGeneratedAt: audit.generatedAt ?? null, items });
writeJson(join(OPS_DIR, "task-queue.json"), { generatedAt: now, tasks });
writeJson(join(OPS_DIR, "source-registry.json"), { generatedAt: now, sources: sourceRegistry });
writeJson(join(OPS_DIR, "image-registry.json"), { generatedAt: now, images: imageRegistry });

const report = buildReport(items, tasks, audit);
writeFileSync(join(OPS_DIR, "status-report.md"), report, "utf8");

console.log(`Content ops inventory generated: ${items.length} items`);
console.log(`Task queue generated: ${tasks.length} tasks`);
console.log(`Report: ${join(OPS_DIR, "status-report.md")}`);

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function buildReport(items: ContentInventoryItem[], tasks: TaskQueueItem[], audit: AuditFile) {
  const channelCounts = countBy(items.map((item) => item.channel));
  const statusCounts = countBy(items.map((item) => item.status));
  const launchBlockers = items.filter((item) => item.launch_visible && ["research_needed", "qa_needed", "blocked", "generated"].includes(item.status));
  const topTasks = tasks.slice(0, 20);

  return `# Adventure Wales Content Ops Status Report\n\nGenerated: ${now}\n\n## Inputs\n\n- Content audit generated: ${audit.generatedAt ?? "not available"}\n- Inventory items: ${items.length}\n- Queue items: ${tasks.length}\n\n## Channel Counts\n\n${Object.entries(channelCounts).map(([key, value]) => `- ${key}: ${value}`).join("\n")}\n\n## Status Counts\n\n${Object.entries(statusCounts).map(([key, value]) => `- ${key}: ${value}`).join("\n")}\n\n## Launch-Visible Blockers\n\n${launchBlockers.length === 0 ? "None flagged." : launchBlockers.slice(0, 30).map((item) => `- [${item.priority}] ${item.channel}/${item.content_type}: ${item.route_or_slug} — ${item.status} — ${item.blocker_reason || item.review_notes}`).join("\n")}\n\n## Top 20 Agent Tasks\n\n${topTasks.map((task) => `- [${task.priority}] ${task.id} — ${task.task_type} — ${task.route_or_slug} — skill: ${task.recommended_skill}`).join("\n")}\n\n## Next Command\n\nRun:\n\n\`\`\`bash\nnpm run content-ops:tasks\n\`\`\`\n\nto export the current queue as per-task markdown briefs.\n`;
}
