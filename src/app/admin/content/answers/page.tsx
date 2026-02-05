import { db } from "@/db";
import { answers, regions } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import Link from "next/link";
import { MessageCircle, Plus, Edit, Eye, Trash2, Globe } from "lucide-react";

async function getAnswers() {
  return db
    .select({
      id: answers.id,
      question: answers.question,
      slug: answers.slug,
      status: answers.status,
      regionName: regions.name,
      createdAt: answers.createdAt,
    })
    .from(answers)
    .leftJoin(regions, eq(answers.regionId, regions.id))
    .orderBy(desc(answers.createdAt))
    .limit(100);
}

async function getStats() {
  const total = await db.select({ count: count() }).from(answers);
  const published = await db.select({ count: count() }).from(answers).where(eq(answers.status, "published"));
  return {
    total: total[0]?.count || 0,
    published: published[0]?.count || 0,
  };
}

export default async function AnswersAdmin() {
  const [allAnswers, stats] = await Promise.all([getAnswers(), getStats()]);

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    review: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Answers</h1>
          <p className="text-gray-500">
            {stats.published} published / {stats.total} total
          </p>
        </div>
        <Link
          href="/admin/content/answers/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent-hover text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add FAQ
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Question</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Region</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allAnswers.map((answer) => (
              <tr key={answer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-lg shrink-0">
                      <MessageCircle className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate max-w-md">
                        {answer.question}
                      </p>
                      <p className="text-sm text-gray-500">/answers/{answer.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {answer.regionName ? (
                    <span className="text-sm text-gray-600">{answer.regionName}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <Globe className="h-3 w-3" />
                      General
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[answer.status] || statusColors.draft}`}>
                    {answer.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/answers/${answer.slug}`} className="p-2 text-gray-400 hover:text-gray-600" title="View">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link href={`/admin/content/answers/${answer.id}`} className="p-2 text-gray-400 hover:text-accent-hover" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-red-500" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allAnswers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No FAQs found. Add your first FAQ to get started.
          </div>
        )}
      </div>
    </div>
  );
}
