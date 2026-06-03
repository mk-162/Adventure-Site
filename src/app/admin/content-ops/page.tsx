import { existsSync, readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardList, Clock, Layers3 } from "lucide-react";

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
  if (["research_needed", "blocked"].includes(status)) return "bg-red-50 text-red-700 border-red-200";
  if (["qa_needed", "generated", "refresh_due"].includes(status)) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

export default function ContentOpsPage() {
  const opsDir = join(process.cwd(), "content", "ops");
  const inventory = readJson<InventoryFile>(join(opsDir, "content-inventory.json"), {
    generatedAt: "",
    sourceAuditGeneratedAt: null,
    items: [],
  });
  const queue = readJson<QueueFile>(join(opsDir, "task-queue.json"), { generatedAt: "", tasks: [] });

  const channelCounts = countBy(inventory.items.map((item) => item.channel));
  const statusCounts = countBy(inventory.items.map((item) => item.status));
  const launchBlockers = inventory.items
    .filter((item) => item.launch_visible && ["research_needed", "qa_needed", "blocked", "generated"].includes(item.status))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 20);
  const topTasks = queue.tasks.slice(0, 20);
  const criticalResearch = inventory.items.filter((item) => item.status === "research_needed").length;
  const qaNeeded = inventory.items.filter((item) => item.status === "qa_needed").length;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
            <ClipboardList className="h-4 w-4" />
            Content Ops Control Plane
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Launch readiness matrix</h1>
          <p className="mt-2 max-w-3xl text-gray-500">
            Tracks every publishable Adventure Wales asset by channel, status, priority, evidence, image, SEO, commercial review and next agent task.
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-500 shadow-sm">
          <div>Inventory generated: {inventory.generatedAt || "Not generated yet"}</div>
          <div>Source audit: {inventory.sourceAuditGeneratedAt || "Not available"}</div>
          <div className="mt-2 font-mono text-xs text-gray-400">npm run content-ops:audit</div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Inventory items" value={inventory.items.length} icon={<Layers3 className="h-5 w-5" />} tone="blue" />
        <MetricCard label="Queued agent tasks" value={queue.tasks.length} icon={<ClipboardList className="h-5 w-5" />} tone="purple" />
        <MetricCard label="Research needed" value={criticalResearch} icon={<AlertTriangle className="h-5 w-5" />} tone="red" />
        <MetricCard label="QA needed" value={qaNeeded} icon={<Clock className="h-5 w-5" />} tone="amber" />
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
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

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
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

function MetricCard({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: "blue" | "purple" | "red" | "amber" }) {
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
