import { db } from "@/db";
import { answers, regions } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getRegions() {
  return db.select().from(regions).orderBy(regions.name);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function NewAnswerPage() {
  const allRegions = await getRegions();

  async function createAnswer(formData: FormData) {
    "use server";

    const question = formData.get("question") as string;
    const slug = slugify(question);
    const quickAnswer = (formData.get("quickAnswer") as string) || null;
    const fullContent = (formData.get("fullContent") as string) || null;
    const regionId = formData.get("regionId")
      ? parseInt(formData.get("regionId") as string)
      : null;
    const status = (formData.get("status") as string) || "draft";

    await db.insert(answers).values({
      siteId: 1,
      question,
      slug,
      quickAnswer,
      fullContent,
      regionId,
      status: status as any,
    });

    revalidatePath("/admin/content/answers");
    redirect("/admin/content/answers");
  }

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
        <h1 className="text-2xl font-bold text-gray-900">New Answer</h1>
        <p className="text-gray-500">Create a new FAQ / answer page</p>
      </div>

      <form action={createAnswer} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question *
          </label>
          <input
            name="question"
            type="text"
            required
            placeholder="What's the best time to visit Snowdonia?"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quick Answer
          </label>
          <textarea
            name="quickAnswer"
            rows={3}
            placeholder="A brief 1-2 sentence answer..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Content (Markdown)
          </label>
          <textarea
            name="fullContent"
            rows={12}
            placeholder="Detailed answer with markdown formatting..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region (optional)
          </label>
          <select
            name="regionId"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
          >
            <option value="">No specific region</option>
            {allRegions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-accent-hover text-white rounded-lg hover:bg-accent-hover transition-colors font-medium"
          >
            Create Answer
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
