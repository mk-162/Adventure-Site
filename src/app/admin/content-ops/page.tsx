import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardList, Clock, Database, FileSearch, Layers3, ShieldAlert } from "lucide-react";

import type { ReactNode } from "react";

import {
  COMMERCIAL_DECISION_OPTIONS,
  REVIEW_ACTION_LABELS,
  REVIEW_ACTION_STATUSES,
  buildQualityScorecard,
  describeDurableStore,
  loadDurableContentOpsState,
  type ScorecardTone,
} from "@/lib/content-ops/durable-review";

type Channel = "evergreen" | "commercial" | "dynamic";
type Status =
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

interface ContentInventoryItem {
  id: string;
  channel: Channel;
  content_type: string;
  route_or_slug: string;
  title: string;
  priority: number;
  status: Status;
  launch_visible: boolean;
  blocker_reason: string;
  review_notes: string;
  evidence_status: string;
  image_status: string;
  copy_status: string;
  seo_status: string;
  commercial_review_status: string;
  commercial_tier?: string;
  source_count?: number;
  source_urls?: string[];
}

interface TaskQueueItem {
  id: string;
  content_item_id: string;
  channel: Channel;
  content_type: string;
  route_or_slug: string;
  title: string;
  priority: number;
  task_type: string;
  recommended_skill: string;
  output_path?: string;
}

interface InventoryFile {
  generatedAt: string;
  sourceAuditGeneratedAt: string | null;
  items: ContentInventoryItem[];
}

interface QueueFile {
  generatedAt: string;
  tasks: TaskQueueItem[];
}

interface ResearchSummary {
  filePath: string | null;
  sourceCount: number;
  imageStatus: string;
  recommendedNextStatus: string;
  humanReviewFlags: number;
}

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

function statusClass(status: string) {
  if (["published", "signed_off", "reviewed"].includes(status)) return "bg-green-50 text-green-700 border-green-200";
  if (["research_needed", "blocked", "remove_or_block", "needs_human_permission"].includes(status)) return "bg-red-50 text-red-700 border-red-200";
  if (["qa_needed", "generated", "refresh_due", "premium_sales_lure"].includes(status)) return "bg-amber-50 text-amber-700 border-amber-200";
  if (["strategic_anchor", "claimed_basic"].includes(status)) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function normaliseText(value: string | undefined | null) {
  return value?.trim() || "Not recorded";
}

function formatTimestamp(value: Date | string | null) {
  if (!value) return "not recorded";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "not recorded" : date.toISOString().replace("T", " ").slice(0, 16);
}

function collectSourceUrls(value: unknown): Set<string> {
  const urls = new Set<string>();

  function visit(node: unknown) {
    if (typeof node === "string") {
      if (/^https?:\/\//.test(node)) urls.add(node);
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    if (node && typeof node === "object") {
      Object.entries(node as Record<string, unknown>).forEach(([key, child]) => {
        if (key.toLowerCase().includes("source") || key.toLowerCase().includes("url")) visit(child);
        else if (typeof child === "object") visit(child);
      });
    }
  }

  visit(value);
  return urls;
}

function summariseImages(value: unknown): string {
  const statuses: string[] = [];

  function visit(node: unknown) {
    if (!node || typeof node !== "object") return;
    Object.entries(node as Record<string, unknown>).forEach(([key, child]) => {
      if (key.toLowerCase() === "status" && typeof child === "string") statuses.push(child.toLowerCase());
      if (typeof child === "object") visit(child);
    });
  }

  if (value && typeof value === "object" && "images" in value) {
    visit((value as { images?: unknown }).images);
  }

  if (statuses.some((status) => ["blocked", "missing", "needs_permission"].includes(status))) return "blocked_or_missing";
  if (statuses.some((status) => ["needs_review", "unverified", "pending"].includes(status))) return "needs_review";
  if (statuses.some((status) => ["approved", "licensed", "ok"].includes(status))) return "usable_recorded";
  return "not_recorded";
}

function countHumanFlags(value: unknown): number {
  let flags = 0;

  function visit(node: unknown) {
    if (typeof node === "string") {
      if (/human|permission|verify|blocked|do not publish|unverified|discrepancy/i.test(node)) flags += 1;
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node && typeof node === "object") {
      Object.values(node as Record<string, unknown>).forEach(visit);
    }
  }

  visit(value);
  return flags;
}

function readResearchSummaries(researchDir: string): Record<string, ResearchSummary> {
  if (!existsSync(researchDir)) return {};

  return readdirSync(researchDir)
    .filter((file) => file.endsWith(".json"))
    .reduce<Record<string, ResearchSummary>>((acc, file) => {
      const absolutePath = join(researchDir, file);
      const raw = readJson<Record<string, unknown>>(absolutePath, {});
      const meta = raw._meta as Record<string, unknown> | undefined;
      const contentItemId = typeof meta?.contentItem === "string" ? meta.contentItem : file.replace(/\.json$/, "");
      acc[contentItemId] = {
        filePath: `data/research/content-ops/${file}`,
        sourceCount: collectSourceUrls(raw).size,
        imageStatus: summariseImages(raw),
        recommendedNextStatus: typeof meta?.recommendedNextStatus === "string" ? meta.recommendedNextStatus : "not_recorded",
        humanReviewFlags: countHumanFlags(raw),
      };
      return acc;
    }, {});
}

function decisionPriority(item: ContentInventoryItem) {
  let score = item.priority;
  if (item.channel === "commercial") score += 1000;
  if (item.content_type === "operator") score += 500;
  if (item.status === "blocked") score += 250;
  if (item.commercial_review_status === "needs_review") score += 100;
  if (["missing", "needs_review"].includes(item.image_status)) score += 50;
  return score;
}

const ACTION_OUTCOMES: Record<string, { tone: "green" | "amber" | "red"; message: string }> = {
  "decision=recorded": {
    tone: "green",
    message:
      "Commercial decision saved as an append-only ops_decisions row. Nothing was published, no operator record or tier changed, and no research was applied.",
  },
  "decision=store-unavailable": {
    tone: "red",
    message:
      "Decision NOT saved. The durable store could not be written — apply the fact-check migrations to this database and try again.",
  },
  "decision=invalid": { tone: "red", message: "Decision not saved: that option is not in the allowed decision set." },
  "decision=missing-item": { tone: "red", message: "Decision not saved: no content item was identified." },
  "decision=unauthorized": { tone: "red", message: "Decision not saved: sign in as an admin first." },
  "decision=forbidden": { tone: "red", message: "Decision not saved: your role cannot record commercial decisions." },
  "review=recorded": {
    tone: "green",
    message:
      "Review state saved to content_review_state. This records a human judgement only — it does not publish, apply research, or change production content.",
  },
  "review=store-unavailable": {
    tone: "red",
    message:
      "Review state NOT saved. The durable store could not be written — apply the fact-check migrations to this database and try again.",
  },
  "review=invalid-status": {
    tone: "red",
    message: "Review state not saved: only researched, QA needed, reviewed, signed off or blocked can be recorded here. Publishing is not a review action.",
  },
  "review=missing-item": { tone: "red", message: "Review state not saved: no content item was identified." },
  "review=unauthorized": { tone: "red", message: "Review state not saved: sign in as an admin first." },
  "review=forbidden": { tone: "red", message: "Review state not saved: your role cannot record review state." },
};

const TONE_CLASSES: Record<ScorecardTone, string> = {
  green: "border-green-200 bg-green-50 text-green-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  red: "border-red-200 bg-red-50 text-red-800",
};

export default async function ContentOpsPage({
  searchParams,
}: {
  searchParams: Promise<{ decision?: string; review?: string }>;
}) {
  const params = await searchParams;
  const opsDir = join(process.cwd(), "content", "ops");
  const researchDir = join(process.cwd(), "data", "research", "content-ops");
  const inventory = readJson<InventoryFile>(join(opsDir, "content-inventory.json"), {
    generatedAt: "",
    sourceAuditGeneratedAt: null,
    items: [],
  });
  const queue = readJson<QueueFile>(join(opsDir, "task-queue.json"), { generatedAt: "", tasks: [] });
  const researchByItem = readResearchSummaries(researchDir);
  const queueByItem = new Map(queue.tasks.map((task) => [task.content_item_id, task]));

  const channelCounts = countBy(inventory.items.map((item) => item.channel));
  const statusCounts = countBy(inventory.items.map((item) => item.status));
  const launchBlockers = inventory.items
    .filter((item) => item.launch_visible && ["research_needed", "qa_needed", "blocked", "generated"].includes(item.status))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 20);
  const decisionQueue = inventory.items
    .filter((item) => item.channel === "commercial" || item.content_type === "operator" || item.commercial_review_status === "needs_review")
    .filter((item) => !["published", "archived"].includes(item.status))
    .sort((a, b) => decisionPriority(b) - decisionPriority(a))
    .slice(0, 25);

  // Durable state for exactly the items rendered below. Never throws: if the
  // fact-check migrations are missing or the database is unreachable, the
  // file-backed queue still renders and the banner says durable data is absent.
  const durableState = await loadDurableContentOpsState(decisionQueue.map((item) => item.id));
  const durableStore = describeDurableStore(durableState);

  const topTasks = queue.tasks.slice(0, 20);
  const criticalResearch = inventory.items.filter((item) => item.status === "research_needed").length;
  const qaNeeded = inventory.items.filter((item) => item.status === "qa_needed").length;
  const openCommercialDecisions = decisionQueue.filter((item) => !durableState.latestDecisionByItem.has(item.id)).length;

  const outcomeKey = params.decision ? `decision=${params.decision}` : params.review ? `review=${params.review}` : null;
  const outcome = outcomeKey ? ACTION_OUTCOMES[outcomeKey] : null;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
            <ClipboardList className="h-4 w-4" />
            Content Ops Control Plane
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Launch readiness and commercial decision queue</h1>
          <p className="mt-2 max-w-3xl text-gray-500">
            Tracks every publishable Adventure Wales asset by channel, status, priority, evidence, image, SEO, commercial review and next action. Decisions and review states are written to the durable <code className="rounded bg-gray-100 px-1">ops_decisions</code> and <code className="rounded bg-gray-100 px-1">content_review_state</code> tables. Recording them <strong>does not</strong> apply research, publish a page, change production operator data, or deploy.
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-500 shadow-sm">
          <div>Inventory generated: {inventory.generatedAt || "Not generated yet"}</div>
          <div>Source audit: {inventory.sourceAuditGeneratedAt || "Not available"}</div>
          <div>Task queue: {queue.generatedAt || "Not generated yet"}</div>
          <div className="mt-2 font-mono text-xs text-gray-400">npm run content-ops:audit</div>
        </div>
      </div>

      {outcome ? (
        <div className={`mb-6 rounded-lg border p-4 text-sm ${TONE_CLASSES[outcome.tone]}`}>{outcome.message}</div>
      ) : null}

      <div
        className={`mb-8 flex items-start gap-3 rounded-lg border p-4 text-sm ${
          durableStore.tone === "green" ? TONE_CLASSES.green : TONE_CLASSES.red
        }`}
      >
        <Database className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <div className="font-semibold">{durableStore.headline}</div>
          <div className="mt-1">{durableStore.detail}</div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Inventory items" value={inventory.items.length} icon={<Layers3 className="h-5 w-5" />} tone="blue" />
        <MetricCard label="Queued agent tasks" value={queue.tasks.length} icon={<ClipboardList className="h-5 w-5" />} tone="purple" />
        <MetricCard
          label={durableState.available ? "Open decisions" : "Open decisions (unknown)"}
          value={openCommercialDecisions}
          icon={<ShieldAlert className="h-5 w-5" />}
          tone="red"
        />
        <MetricCard label="Research needed" value={criticalResearch} icon={<AlertTriangle className="h-5 w-5" />} tone="red" />
        <MetricCard label="QA needed" value={qaNeeded} icon={<Clock className="h-5 w-5" />} tone="amber" />
      </div>

      <Panel
        title="MK commercial decision queue"
        action={<span className="text-xs font-medium uppercase tracking-wide text-red-600">Commercial/operator blockers first</span>}
      >
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Both controls below only record a human judgement in the durable review tables. They do <strong>not</strong> apply research, publish a page, change production operator data or tiers, or deploy anything.
        </div>
        <div className="space-y-4">
          {decisionQueue.map((item) => {
            const task = queueByItem.get(item.id);
            const research = researchByItem[item.id];
            const decision = durableState.latestDecisionByItem.get(item.id);
            const review = durableState.reviewByItem.get(item.id);
            const sourceCount = item.source_count ?? item.source_urls?.length ?? 0;
            const scorecard = buildQualityScorecard({
              item: {
                status: item.status,
                evidenceStatus: item.evidence_status ?? "",
                imageStatus: item.image_status ?? "",
                copyStatus: item.copy_status ?? "",
                seoStatus: item.seo_status ?? "",
                routeOrSlug: item.route_or_slug ?? "",
                sourceCount,
              },
              research: research
                ? {
                    sourceCount: research.sourceCount,
                    imageStatus: research.imageStatus,
                    humanReviewFlags: research.humanReviewFlags,
                  }
                : null,
              durable: {
                available: durableState.available,
                decision: decision ?? null,
                review: review ?? null,
                verifiedEvidenceCount: durableState.verifiedEvidenceCountByItem.get(item.id) ?? 0,
              },
            });

            return (
              <article key={item.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                        {item.channel} / {item.content_type}
                      </span>
                      <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium capitalize ${statusClass(item.status)}`}>
                        {statusLabel(item.status)}
                      </span>
                      {!durableState.available ? (
                        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                          Durable state unavailable
                        </span>
                      ) : decision ? (
                        <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium capitalize ${statusClass(decision.decision)}`}>
                          Decided: {statusLabel(decision.decision)}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                          Awaiting MK
                        </span>
                      )}
                      {durableState.available && review ? (
                        <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium capitalize ${statusClass(review.status)}`}>
                          Review: {statusLabel(review.status)}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-gray-900">{item.title}</h2>
                    <div className="mt-1 text-sm text-gray-500">{item.route_or_slug}</div>
                    <div className="mt-2 text-sm text-gray-600">{normaliseText(item.blocker_reason || item.review_notes)}</div>

                    <div className="mt-4">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Quality scorecard</div>
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {scorecard.map((category) => (
                          <div key={category.key} className={`rounded-lg border p-3 ${TONE_CLASSES[category.tone]}`}>
                            <div className="text-xs font-semibold uppercase tracking-wide">{category.label}</div>
                            <div className="mt-1 text-xs">{category.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                      <EvidenceStat label="Inventory sources" value={sourceCount.toString()} />
                      <EvidenceStat label="Research sources" value={(research?.sourceCount ?? 0).toString()} />
                      <EvidenceStat label="Inventory image" value={statusLabel(item.image_status || "not_recorded")} />
                      <EvidenceStat label="Research image" value={statusLabel(research?.imageStatus ?? "not_recorded")} />
                      <EvidenceStat label="Evidence" value={statusLabel(item.evidence_status || "not_recorded")} />
                      <EvidenceStat label="Commercial review" value={statusLabel(item.commercial_review_status || "not_recorded")} />
                      <EvidenceStat label="Research next" value={statusLabel(research?.recommendedNextStatus ?? "not_recorded")} />
                      <EvidenceStat label="Human flags" value={(research?.humanReviewFlags ?? 0).toString()} />
                    </dl>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                      {research?.filePath ? (
                        <span className="inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-1">
                          <FileSearch className="h-3 w-3" />
                          {research.filePath}
                        </span>
                      ) : (
                        <span className="rounded bg-gray-50 px-2 py-1">No research file found</span>
                      )}
                      {task ? <span className="rounded bg-gray-50 px-2 py-1">Queue: {task.id}</span> : null}
                      {item.commercial_tier ? <span className="rounded bg-gray-50 px-2 py-1">Current tier: {item.commercial_tier}</span> : null}
                      {durableState.available && decision ? (
                        <span className="rounded bg-gray-50 px-2 py-1">
                          Decision by {decision.decidedByEmail} at {formatTimestamp(decision.decidedAt)}
                        </span>
                      ) : null}
                      {durableState.available && review ? (
                        <span className="rounded bg-gray-50 px-2 py-1">
                          Review by {review.reviewedByEmail ?? "unknown"} at {formatTimestamp(review.reviewedAt)}
                        </span>
                      ) : null}
                    </div>
                    {durableState.available && review?.notes ? (
                      <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600">
                        Review notes: {review.notes}
                      </div>
                    ) : null}
                  </div>

                  <div className="w-full shrink-0 space-y-4 xl:w-[360px]">
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Record commercial decision</div>
                      <form action="/admin/content-ops/decisions" method="post" className="space-y-2">
                        <input type="hidden" name="content_item_id" value={item.id} />
                        <input type="hidden" name="title" value={item.title} />
                        <input type="hidden" name="route_or_slug" value={item.route_or_slug} />
                        <input type="hidden" name="source_count" value={sourceCount} />
                        <input type="hidden" name="research_source_count" value={research?.sourceCount ?? 0} />
                        <input type="hidden" name="image_status" value={item.image_status || "not_recorded"} />
                        <input type="hidden" name="research_image_status" value={research?.imageStatus ?? "not_recorded"} />
                        <input type="hidden" name="research_file" value={research?.filePath ?? ""} />
                        <textarea
                          name="rationale"
                          rows={2}
                          placeholder="Optional rationale for this decision"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                          {COMMERCIAL_DECISION_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              type="submit"
                              name="decision"
                              value={option.id}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800"
                              title={option.meaning}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </form>
                    </div>

                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Record review state</div>
                      <form action="/admin/content-ops/review" method="post" className="space-y-2">
                        <input type="hidden" name="content_item_id" value={item.id} />
                        <textarea
                          name="notes"
                          rows={2}
                          placeholder="Optional review notes"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          defaultValue={review?.notes ?? ""}
                        />
                        <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                          {REVIEW_ACTION_STATUSES.map((status) => (
                            <button
                              key={status}
                              type="submit"
                              name="review_status"
                              value={status}
                              className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                            >
                              {REVIEW_ACTION_LABELS[status]}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">
                          Records review state only. Publishing is deliberately not available here.
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel title="Channels">
          <div className="grid gap-3 sm:grid-cols-3">
            {(["evergreen", "commercial", "dynamic"] as Channel[]).map((channel) => (
              <div key={channel} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-900">{channelCounts[channel] ?? 0}</div>
                <div className="text-sm capitalize text-gray-500">{channel}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Status counts">
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <span className="text-sm capitalize text-gray-600">{statusLabel(status)}</span>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-8">
        <Panel title="Launch-visible blockers" action={<Link href="/admin" className="text-sm font-medium text-accent-hover">Admin home</Link>}>
          {launchBlockers.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              No launch-visible blockers in the current matrix.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-100">
              {launchBlockers.map((item) => (
                <div key={item.id} className="grid gap-3 border-b border-gray-100 bg-white p-4 last:border-b-0 lg:grid-cols-[80px_1fr_160px]">
                  <div className="text-lg font-bold text-gray-900">{item.priority}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.route_or_slug}</div>
                    <div className="mt-1 text-sm text-gray-500">{item.blocker_reason || item.review_notes}</div>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium capitalize ${statusClass(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-8">
        <Panel title="Top queued agent tasks">
          <div className="space-y-3">
            {topTasks.map((task) => (
              <div key={task.id} className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{task.id}</div>
                  <div className="text-sm text-gray-500">{task.route_or_slug}</div>
                  <div className="mt-1 text-xs text-gray-400">{task.task_type} · {task.recommended_skill}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">Priority {task.priority}</span>
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function MetricCard({ label, value, icon, tone }: { label: string; value: number; icon: ReactNode; tone: "blue" | "purple" | "red" | "amber" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`mb-4 inline-flex rounded-lg p-3 ${tones[tone]}`}>{icon}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function EvidenceStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold capitalize text-gray-800">{value}</dd>
    </div>
  );
}
