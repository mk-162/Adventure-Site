import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardList, Clock, FileSearch, Layers3, ShieldAlert } from "lucide-react";

import type { ReactNode } from "react";

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

type CommercialDecisionOption =
  | "strategic_anchor"
  | "premium_sales_lure"
  | "claimed_basic"
  | "stub_only"
  | "remove_or_block"
  | "needs_human_permission";

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

interface CommercialDecisionRecord {
  content_item_id: string;
  decision: CommercialDecisionOption;
  decided_by: string;
  decided_at: string;
  rationale?: string;
  next_action?: string;
}

interface CommercialDecisionOptionRecord {
  id: CommercialDecisionOption;
  label: string;
  meaning: string;
}

interface CommercialDecisionsFile {
  generatedAt: string;
  purpose: string;
  decisionOptions: CommercialDecisionOptionRecord[];
  decisions: CommercialDecisionRecord[];
}

interface ResearchSummary {
  filePath: string | null;
  sourceCount: number;
  imageStatus: string;
  recommendedNextStatus: string;
  humanReviewFlags: number;
}

const fallbackDecisionOptions: CommercialDecisionOptionRecord[] = [
  { id: "strategic_anchor", label: "Strategic Anchor", meaning: "Free enhanced treatment because it materially improves Adventure Wales launch credibility." },
  { id: "premium_sales_lure", label: "Premium Sales Lure", meaning: "Premium-quality preview for sales outreach; not a free published premium listing." },
  { id: "claimed_basic", label: "Claimed/Basic", meaning: "Verified basic listing only; no unpaid premium placement." },
  { id: "stub_only", label: "Stub Only", meaning: "Minimal claim-CTA page until claimed or paid." },
  { id: "remove_or_block", label: "Remove/Block", meaning: "Hold or remove because evidence, safety, identity, or permission is unresolved." },
  { id: "needs_human_permission", label: "Needs Permission", meaning: "Explicit operator/source/media permission needed before using assets or claims." },
];

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

export default function ContentOpsPage() {
  const opsDir = join(process.cwd(), "content", "ops");
  const researchDir = join(process.cwd(), "data", "research", "content-ops");
  const inventory = readJson<InventoryFile>(join(opsDir, "content-inventory.json"), {
    generatedAt: "",
    sourceAuditGeneratedAt: null,
    items: [],
  });
  const queue = readJson<QueueFile>(join(opsDir, "task-queue.json"), { generatedAt: "", tasks: [] });
  const commercialDecisions = readJson<CommercialDecisionsFile>(join(opsDir, "commercial-decisions.json"), {
    generatedAt: "",
    purpose: "Human-recorded commercial decisions.",
    decisionOptions: fallbackDecisionOptions,
    decisions: [],
  });
  const researchByItem = readResearchSummaries(researchDir);
  const queueByItem = new Map(queue.tasks.map((task) => [task.content_item_id, task]));
  const decisionByItem = new Map(commercialDecisions.decisions.map((decision) => [decision.content_item_id, decision]));

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
  const topTasks = queue.tasks.slice(0, 20);
  const criticalResearch = inventory.items.filter((item) => item.status === "research_needed").length;
  const qaNeeded = inventory.items.filter((item) => item.status === "qa_needed").length;
  const openCommercialDecisions = decisionQueue.filter((item) => !decisionByItem.has(item.id)).length;

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
            Tracks every publishable Adventure Wales asset by channel, status, priority, evidence, image, SEO, commercial review and next action. MK decisions are written only to <code className="rounded bg-gray-100 px-1">content/ops/commercial-decisions.json</code>; this dashboard does not publish content or change operator tiers automatically.
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-500 shadow-sm">
          <div>Inventory generated: {inventory.generatedAt || "Not generated yet"}</div>
          <div>Source audit: {inventory.sourceAuditGeneratedAt || "Not available"}</div>
          <div>Decision file: {commercialDecisions.generatedAt || "Not initialised"}</div>
          <div className="mt-2 font-mono text-xs text-gray-400">npm run content-ops:audit</div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Inventory items" value={inventory.items.length} icon={<Layers3 className="h-5 w-5" />} tone="blue" />
        <MetricCard label="Queued agent tasks" value={queue.tasks.length} icon={<ClipboardList className="h-5 w-5" />} tone="purple" />
        <MetricCard label="Open decisions" value={openCommercialDecisions} icon={<ShieldAlert className="h-5 w-5" />} tone="red" />
        <MetricCard label="Research needed" value={criticalResearch} icon={<AlertTriangle className="h-5 w-5" />} tone="red" />
        <MetricCard label="QA needed" value={qaNeeded} icon={<Clock className="h-5 w-5" />} tone="amber" />
      </div>

      <Panel
        title="MK commercial decision queue"
        action={<span className="text-xs font-medium uppercase tracking-wide text-red-600">Commercial/operator blockers first</span>}
      >
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Decision buttons create a human decision record only. They do not publish pages, change production operator tiers, or grant premium value automatically.
        </div>
        <div className="space-y-4">
          {decisionQueue.map((item) => {
            const task = queueByItem.get(item.id);
            const research = researchByItem[item.id];
            const decision = decisionByItem.get(item.id);
            const sourceCount = item.source_count ?? item.source_urls?.length ?? 0;

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
                      {decision ? (
                        <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium capitalize ${statusClass(decision.decision)}`}>
                          Decided: {statusLabel(decision.decision)}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                          Awaiting MK
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-gray-900">{item.title}</h2>
                    <div className="mt-1 text-sm text-gray-500">{item.route_or_slug}</div>
                    <div className="mt-2 text-sm text-gray-600">{normaliseText(item.blocker_reason || item.review_notes)}</div>
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
                    </div>
                  </div>

                  <div className="w-full shrink-0 xl:w-[360px]">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Record decision</div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                      {(commercialDecisions.decisionOptions.length ? commercialDecisions.decisionOptions : fallbackDecisionOptions).map((option) => (
                        <form key={option.id} action="/admin/content-ops/decisions" method="post">
                          <input type="hidden" name="content_item_id" value={item.id} />
                          <input type="hidden" name="title" value={item.title} />
                          <input type="hidden" name="route_or_slug" value={item.route_or_slug} />
                          <input type="hidden" name="decision" value={option.id} />
                          <input type="hidden" name="source_count" value={sourceCount} />
                          <input type="hidden" name="research_source_count" value={research?.sourceCount ?? 0} />
                          <input type="hidden" name="image_status" value={item.image_status || "not_recorded"} />
                          <input type="hidden" name="research_image_status" value={research?.imageStatus ?? "not_recorded"} />
                          <input type="hidden" name="research_file" value={research?.filePath ?? ""} />
                          <button
                            type="submit"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800"
                            title={option.meaning}
                          >
                            {option.label}
                          </button>
                        </form>
                      ))}
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
