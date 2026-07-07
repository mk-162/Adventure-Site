import { db } from "@/db";
import { answers, regions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getAnswer(id: number) {
  const [answer] = await db.select().from(answers).where(eq(answers.id, id));
  return answer;
}

async function getRegions() {
  return db.select().from(regions).orderBy(regions.name);
}

async function updateAnswer(id: number, formData: FormData) {
  "use server";

  const question = formData.get("question") as string;
  const quickAnswer = formData.get("quickAnswer") as string;
  const fullContent = formData.get("fullContent") as string;
  const regionId = formData.get("regionId") as string;
  const status = formData.get("status") as "draft" | "review" | "published" | "archived";

  await db
    .update(answers)
    .set({
      question,
      quickAnswer: quickAnswer || null,
      fullContent: fullContent || null,
      regionId: regionId ? parseInt(regionId) : null,
      status: status || "draft",
      updatedAt: new Date(),
    })
    .where(eq(answers.id, id));

  revalidatePath("/admin/content/answers");
  revalidatePath(`/admin/content/answers/${id}`);
  redirect("/admin/content/answers");
}

export default async function EditAnswerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const answerId = parseInt(id);
  const answer = await getAnswer(answerId);

  if (!answer) {
    redirect("/admin/content/answers");
  }

  const allRegions = await getRegions();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/content/answers"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Answers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Answer</h1>
        <p className="text-gray-500">{answer.question}</p>
      </div>

      <form action={updateAnswer.bind(null, answerId)} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
          <input
            name="question"
            type="text"
            required
            defaultValue={answer.question}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">Slug (read-only): {answer.slug}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quick Answer</label>
          <textarea
            name="quickAnswer"
            rows={3}
            defaultValue={answer.quickAnswer || ""}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Content (Markdown)</label>
          <textarea
            name="fullContent"
            rows={12}
            defaultValue={answer.fullContent || ""}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region (optional)</label>
          <select
            name="regionId"
            defaultValue={answer.regionId || ""}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
          >
            <option value="">No specific region</option>
            {allRegions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            defaultValue={answer.status}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {answer.relatedQuestions ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Questions (read-only)
            </label>
            <pre className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs text-gray-500 overflow-x-auto">
              {JSON.stringify(answer.relatedQuestions, null, 2)}
            </pre>
          </div>
        ) : null}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-accent-hover text-white rounded-lg hover:bg-accent-hover transition-colors font-medium"
          >
            Save Changes
          </button>
          <Link
            href="/admin/content/answers"
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
