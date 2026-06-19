import { existsSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { spawn } from "child_process";
import { OPS_DIR, TASKS_DIR, TaskQueueItem, ensureDir, readJson } from "./shared";

interface QueueFile {
  generatedAt: string;
  tasks: TaskQueueItem[];
}

type RunResult = {
  taskId: string;
  outputPath: string;
  exitCode: number | null;
  startedAt: string;
  finishedAt: string;
  logPath: string;
};

const args = new Map<string, string | boolean>();
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (!arg.startsWith("--")) continue;
  const [key, inlineValue] = arg.slice(2).split("=", 2);
  const next = process.argv[i + 1];
  if (inlineValue !== undefined) args.set(key, inlineValue);
  else if (next && !next.startsWith("--")) {
    args.set(key, next);
    i += 1;
  } else args.set(key, true);
}

const limit = Number(args.get("limit") ?? 3);
const concurrency = Math.max(1, Number(args.get("concurrency") ?? 2));
const taskType = String(args.get("task-type") ?? "research");
const status = String(args.get("status") ?? "research_needed");
const dryRun = args.has("dry-run");
const model = args.get("model") ? String(args.get("model")) : "";

const queue = readJson<QueueFile>(join(OPS_DIR, "task-queue.json"), { generatedAt: "", tasks: [] });
const selected = queue.tasks
  .filter((task) => task.task_type === taskType && task.status === status)
  .slice(0, limit);

if (selected.length === 0) {
  console.log(`No tasks matched task_type=${taskType} status=${status}`);
  process.exit(0);
}

console.log(`Selected ${selected.length} tasks from queue generated ${queue.generatedAt || "unknown"}`);
for (const task of selected) {
  console.log(`- ${task.id} → ${task.output_path}`);
}

if (dryRun) {
  console.log("Dry run only. Re-run without --dry-run to launch Claude Code workers.");
  process.exit(0);
}

ensureDir(join(OPS_DIR, "swarm-runs"));
ensureDir(join(OPS_DIR, "swarm-logs"));

function promptFor(task: TaskQueueItem) {
  const briefPath = join(TASKS_DIR, `${task.id}.md`);
  return [
    `You are one worker in an Adventure Wales content-ops swarm.`,
    `Confirm you are operating inside ${process.cwd()} and not another repo.`,
    `Read ${briefPath} carefully and complete ONLY that bounded task.`,
    `Write the required output to ${task.output_path}.`,
    `Do not publish, deploy, edit production page/data files, change database rows, install dependencies, change package files, or regenerate lockfiles.`,
    `Use official/operator/tourism sources where possible. Include source URLs for factual claims.`,
    `Include image provenance/licence notes or explicitly mark images blocked.`,
    `If you cannot verify a claim, flag it for human review.`,
    `Return the output path, recommended next status, and the top 3 blockers only.`,
  ].join("\n");
}

function runTask(task: TaskQueueItem): Promise<RunResult> {
  return new Promise((resolve) => {
    const startedAt = new Date().toISOString();
    ensureDir(dirname(task.output_path));
    const logPath = join(OPS_DIR, "swarm-logs", `${task.id}.log`);
    const commandArgs = [
      "-p",
      promptFor(task),
      "--permission-mode",
      "acceptEdits",
      "--allowedTools",
      "Read,Write,Edit,WebSearch,WebFetch,Bash(mkdir *),Bash(pwd),Bash(test *)",
      "--max-turns",
      "40",
    ];
    if (model) commandArgs.push("--model", model);

    const child = spawn("claude", commandArgs, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });

    let log = `# ${task.id}\nStarted: ${startedAt}\nOutput: ${task.output_path}\n\n`;
    child.stdout.on("data", (chunk) => {
      log += chunk.toString();
      writeFileSync(logPath, log, "utf8");
    });
    child.stderr.on("data", (chunk) => {
      log += chunk.toString();
      writeFileSync(logPath, log, "utf8");
    });
    child.on("close", (exitCode) => {
      const finishedAt = new Date().toISOString();
      log += `\nFinished: ${finishedAt}\nExit code: ${exitCode}\n`;
      writeFileSync(logPath, log, "utf8");
      resolve({ taskId: task.id, outputPath: task.output_path, exitCode, startedAt, finishedAt, logPath });
    });
  });
}

async function main() {
  const pending = [...selected];
  const results: RunResult[] = [];
  const workers = Array.from({ length: Math.min(concurrency, pending.length) }, async () => {
    while (pending.length > 0) {
      const task = pending.shift();
      if (!task) return;
      console.log(`Launching ${task.id}`);
      const result = await runTask(task);
      results.push(result);
      const ok = result.exitCode === 0 && existsSync(result.outputPath);
      console.log(`${ok ? "✓" : "✗"} ${task.id} exit=${result.exitCode} output=${existsSync(result.outputPath) ? "present" : "missing"}`);
    }
  });
  await Promise.all(workers);

  const runPath = join(OPS_DIR, "swarm-runs", `run-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(runPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), limit, concurrency, taskType, status, results }, null, 2)}\n`, "utf8");
  console.log(`Swarm run summary: ${runPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
