import { writeFileSync } from "fs";
import { join } from "path";
import { OPS_DIR, TASKS_DIR, TaskQueueItem, ensureDir, readJson } from "./shared";

interface QueueFile {
  generatedAt: string;
  tasks: TaskQueueItem[];
}

const queue = readJson<QueueFile>(join(OPS_DIR, "task-queue.json"), { generatedAt: "", tasks: [] });
ensureDir(TASKS_DIR);

for (const task of queue.tasks) {
  const markdown = `# ${task.id}\n\n## Objective\n${task.brief}\n\n## Metadata\n\n- Content item: ${task.content_item_id}\n- Channel: ${task.channel}\n- Content type: ${task.content_type}\n- Route/slug: ${task.route_or_slug}\n- Current status: ${task.status}\n- Priority: ${task.priority}\n- Task type: ${task.task_type}\n- Recommended skill: ${task.recommended_skill}\n- Required output path: ${task.output_path}\n\n## Source Requirements\n\n${task.source_requirements.map((item) => `- ${item}`).join("\n")}\n\n## Acceptance Criteria\n\n${task.acceptance_criteria.map((item) => `- ${item}`).join("\n")}\n\n## Output Contract\n\nReturn JSON or markdown containing:\n\n- Proposed changes or researched facts.\n- Source URLs used.\n- Image provenance or image blocker note.\n- Claims needing human review.\n- Recommended next status.\n\nDo not publish, deploy, or make commercial promises.\n`;

  writeFileSync(join(TASKS_DIR, `${task.id}.md`), markdown, "utf8");
}

console.log(`Exported ${queue.tasks.length} task briefs to ${TASKS_DIR}`);
