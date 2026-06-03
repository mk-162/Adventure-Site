import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";

export type ContentChannel = "evergreen" | "commercial" | "dynamic";
export type ContentStatus =
  | "discovered"
  | "triaged"
  | "research_needed"
  | "researched"
  | "generated"
  | "qa_needed"
  | "reviewed"
  | "signed_off"
  | "published"
  | "refresh_due"
  | "blocked"
  | "archived";

export type EvidenceStatus = "missing" | "partial" | "sourced" | "verified";
export type GateStatus = "missing" | "needs_review" | "pass" | "not_applicable";

export interface ContentInventoryItem {
  id: string;
  channel: ContentChannel;
  content_type: string;
  route_or_slug: string;
  title: string;
  region: string;
  activity: string;
  commercial_tier: string;
  priority: number;
  status: ContentStatus;
  launch_visible: boolean;
  owner: string;
  assigned_agent: string;
  source_count: number;
  source_urls: string[];
  evidence_status: EvidenceStatus;
  image_status: GateStatus;
  image_source_url: string;
  copy_status: GateStatus;
  seo_status: GateStatus;
  schema_status: GateStatus;
  commercial_review_status: GateStatus;
  safety_or_legal_status: GateStatus;
  last_generated_at: string;
  last_reviewed_at: string;
  next_review_due: string;
  published_at: string;
  blocker_reason: string;
  review_notes: string;
  quality_score: number;
  confidence_score: number;
}

export interface AuditGap {
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  page: string;
  slug: string;
  issue: string;
  fix: string;
  autoFixable: boolean;
}

export interface TaskQueueItem {
  id: string;
  content_item_id: string;
  channel: ContentChannel;
  content_type: string;
  route_or_slug: string;
  title: string;
  priority: number;
  status: ContentStatus;
  recommended_skill: string;
  task_type: "research" | "generation" | "qa" | "commercial_review" | "refresh";
  brief: string;
  acceptance_criteria: string[];
  source_requirements: string[];
  output_path: string;
}

export const OPS_DIR = join(process.cwd(), "content", "ops");
export const TASKS_DIR = join(process.cwd(), "tasks", "content-ops");

const CSV_FIELDS: Array<keyof ContentInventoryItem> = [
  "id",
  "channel",
  "content_type",
  "route_or_slug",
  "title",
  "region",
  "activity",
  "commercial_tier",
  "priority",
  "status",
  "launch_visible",
  "owner",
  "assigned_agent",
  "source_count",
  "source_urls",
  "evidence_status",
  "image_status",
  "image_source_url",
  "copy_status",
  "seo_status",
  "schema_status",
  "commercial_review_status",
  "safety_or_legal_status",
  "last_generated_at",
  "last_reviewed_at",
  "next_review_due",
  "published_at",
  "blocker_reason",
  "review_notes",
  "quality_score",
  "confidence_score",
];

export function ensureDir(path: string) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

export function writeJson(path: string, value: unknown) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function listFiles(dir: string, extension?: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (current: string) => {
    for (const entry of readdirSync(current)) {
      const full = join(current, entry);
      const info = statSync(full);
      if (info.isDirectory()) walk(full);
      else if (!extension || full.endsWith(extension)) out.push(full);
    }
  };
  walk(dir);
  return out.sort();
}

export function slugToTitle(slug: string) {
  return slug
    .replace(/--/g, " / ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function csvEscape(value: unknown): string {
  const raw = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  if (/[",\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
}

export function inventoryToCsv(items: ContentInventoryItem[]): string {
  const header = CSV_FIELDS.join(",");
  const rows = items.map((item) => CSV_FIELDS.map((field) => csvEscape(item[field])).join(","));
  return `${header}\n${rows.join("\n")}\n`;
}

export function normalizeId(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export function severityWeight(severity: AuditGap["severity"]) {
  switch (severity) {
    case "critical":
      return 20;
    case "high":
      return 14;
    case "medium":
      return 8;
    case "low":
      return 4;
  }
}

export function categoryToChannel(category: string): ContentChannel {
  if (category === "Operators") return "commercial";
  if (category === "Events" || category === "Journal") return "dynamic";
  return "evergreen";
}

export function categoryToContentType(category: string) {
  switch (category) {
    case "Operators":
      return "operator";
    case "Activity Types":
      return "activity_landing";
    case "Activities":
      return "activity";
    case "Regions":
      return "location_landing";
    case "Events":
      return "event";
    case "Journal":
      return "journal";
    case "Combo Pages":
      return "activity_location";
    default:
      return normalizeId(category);
  }
}

export function routeParts(route: string) {
  const parts = route.split("/").filter(Boolean);
  const region = parts[0] && !["directory", "events", "journal", "activities", "guides"].includes(parts[0]) ? parts[0] : "";
  const activity = parts.includes("things-to-do") ? parts[parts.indexOf("things-to-do") + 1] || "" : "";
  return { region, activity };
}

export function emptyInventoryItem(partial: Partial<ContentInventoryItem> & Pick<ContentInventoryItem, "id" | "channel" | "content_type" | "route_or_slug" | "title">): ContentInventoryItem {
  return {
    region: "",
    activity: "",
    commercial_tier: "not_applicable",
    priority: 0,
    status: "discovered",
    launch_visible: false,
    owner: "content-ops",
    assigned_agent: "",
    source_count: 0,
    source_urls: [],
    evidence_status: "missing",
    image_status: "needs_review",
    image_source_url: "",
    copy_status: "needs_review",
    seo_status: "needs_review",
    schema_status: "needs_review",
    commercial_review_status: partial.channel === "commercial" ? "needs_review" : "not_applicable",
    safety_or_legal_status: "needs_review",
    last_generated_at: "",
    last_reviewed_at: "",
    next_review_due: "",
    published_at: "",
    blocker_reason: "",
    review_notes: "",
    quality_score: 0,
    confidence_score: 0,
    ...partial,
  };
}
