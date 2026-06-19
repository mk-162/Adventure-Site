import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

type CommercialDecisionOption =
  | "strategic_anchor"
  | "premium_sales_lure"
  | "claimed_basic"
  | "stub_only"
  | "remove_or_block"
  | "needs_human_permission";

interface CommercialDecisionRecord {
  content_item_id: string;
  title: string;
  route_or_slug: string;
  decision: CommercialDecisionOption;
  decided_by: string;
  decided_at: string;
  rationale: string;
  next_action: string;
  evidence_snapshot: {
    source_count: number;
    research_source_count: number;
    image_status: string;
    research_image_status: string;
    research_file: string;
  };
  guardrails: ["does_not_publish_content", "does_not_change_operator_tier_automatically"];
}

interface CommercialDecisionsFile {
  generatedAt: string;
  purpose: string;
  decisionOptions: Array<{ id: CommercialDecisionOption; label: string; meaning: string }>;
  schema?: unknown;
  decisions: CommercialDecisionRecord[];
}

const allowedDecisions: CommercialDecisionOption[] = [
  "strategic_anchor",
  "premium_sales_lure",
  "claimed_basic",
  "stub_only",
  "remove_or_block",
  "needs_human_permission",
];

function parseNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readDecisionFile(path: string): CommercialDecisionsFile {
  if (!existsSync(path)) {
    return {
      generatedAt: new Date().toISOString(),
      purpose: "Human-recorded Adventure Wales commercial/operator decisions. Agents prepare evidence and options only.",
      decisionOptions: [],
      decisions: [],
    };
  }

  return JSON.parse(readFileSync(path, "utf8")) as CommercialDecisionsFile;
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const decision = form.get("decision")?.toString() as CommercialDecisionOption | undefined;

  if (!decision || !allowedDecisions.includes(decision)) {
    redirect("/admin/content-ops?decision=invalid");
  }

  const contentItemId = form.get("content_item_id")?.toString().trim();
  if (!contentItemId) {
    redirect("/admin/content-ops?decision=missing-item");
  }

  const filePath = join(process.cwd(), "content", "ops", "commercial-decisions.json");
  const file = readDecisionFile(filePath);
  const now = new Date().toISOString();

  const record: CommercialDecisionRecord = {
    content_item_id: contentItemId,
    title: form.get("title")?.toString() ?? "",
    route_or_slug: form.get("route_or_slug")?.toString() ?? "",
    decision,
    decided_by: "MK via Adventure Wales command centre",
    decided_at: now,
    rationale: "Recorded from dashboard action. Add/expand rationale before downstream production work if needed.",
    next_action: "Route to the appropriate Adventure Wales workflow; do not publish or change production operator tier without review gate.",
    evidence_snapshot: {
      source_count: parseNumber(form.get("source_count")),
      research_source_count: parseNumber(form.get("research_source_count")),
      image_status: form.get("image_status")?.toString() ?? "not_recorded",
      research_image_status: form.get("research_image_status")?.toString() ?? "not_recorded",
      research_file: form.get("research_file")?.toString() ?? "",
    },
    guardrails: ["does_not_publish_content", "does_not_change_operator_tier_automatically"],
  };

  const nextDecisions = file.decisions.filter((existing) => existing.content_item_id !== contentItemId);
  nextDecisions.unshift(record);

  writeFileSync(
    filePath,
    `${JSON.stringify(
      {
        ...file,
        generatedAt: now,
        decisions: nextDecisions,
      },
      null,
      2,
    )}\n`,
  );

  redirect("/admin/content-ops?decision=recorded");
}
