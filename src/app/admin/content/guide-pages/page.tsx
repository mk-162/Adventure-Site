import { db } from "@/db";
import { guidePages, regions, activityTypes, operators } from "@/db/schema";
import { desc, eq, asc } from "drizzle-orm";
import Link from "next/link";
import { BookOpen, Plus, Edit, Eye, Trash2, Search, DollarSign } from "lucide-react";
import clsx from "clsx";

async function getGuidePages() {
  return db
    .select({
      id: guidePages.id,
      title: guidePages.title,
      type: guidePages.type,
      slug: guidePages.slug,
      urlPath: guidePages.urlPath,
      contentStatus: guidePages.contentStatus,
      priority: guidePages.priority,
      targetKeyword: guidePages.targetKeyword,
      searchVolume: guidePages.searchVolume,
      currentRanking: guidePages.currentRanking,
      sponsorDisplayName: guidePages.sponsorDisplayName,
      sponsorOperatorId: guidePages.sponsorOperatorId,
      regionName: regions.name,
      activityTypeName: activityTypes.name,
    })
    .from(guidePages)
    .leftJoin(regions, eq(guidePages.regionId, regions.id))
    .leftJoin(activityTypes, eq(guidePages.activityTypeId, activityTypes.id))
    .orderBy(desc(guidePages.priority), asc(guidePages.title))
    .limit(200);
}

export default async function GuidePageAdmin() {
  const allPages = await getGuidePages();

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    review: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-red-100 text-red-800",
  };

  const typeColors: Record<string, string> = {
    combo: "bg-blue-100 text-blue-800",
    best_of: "bg-purple-100 text-purple-800",
  };

  const typeLabels: Record<string, string> = {
    combo: "Combo",
    best_of: "Best Of",
  };

  const comboCount = allPages.filter((p) => p.type === "combo").length;
  const bestOfCount = allPages.filter((p) => p.type === "best_of").length;
  const sponsoredCount = allPages.filter((p) => p.sponsorOperatorId).length;
  const publishedCount = allPages.filter((p) => p.contentStatus === "published").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guide Pages</h1>
          <p className="text-gray-500">{allPages.length} guide pages</p>
        </div>
        <Link
          href="/admin/content/guide-pages/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Guide Page
        </Link>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-2xl font-bold text-blue-900">{comboCount}</p>
          <p className="text-sm text-blue-600">Combo Pages</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-2xl font-bold text-purple-900">{bestOfCount}</p>
          <p className="text-sm text-purple-600">Best-Of Pages</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-2xl font-bold text-green-900">{publishedCount}</p>
          <p className="text-sm text-green-600">Published</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-2xl font-bold text-amber-900">{sponsoredCount}</p>
          <p className="text-sm text-amber-600">Sponsored</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Region
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Activity
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Priority
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Target Keyword
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Vol
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Rank
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Sponsor
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {page.title}
                        </p>
                        <p className="text-sm text-gray-500">{page.urlPath}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        typeColors[page.type] || typeColors.combo
                      )}
                    >
                      {typeLabels[page.type] || page.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {page.regionName || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {page.activityTypeName || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        statusColors[page.contentStatus] || statusColors.draft
                      )}
                    >
                      {page.contentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {page.priority || 0}
                  </td>
                  <td className="px-6 py-4">
                    {page.targetKeyword ? (
                      <div className="flex items-center gap-1">
                        <Search className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 max-w-[150px] truncate">
                          {page.targetKeyword}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {page.searchVolume ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {page.currentRanking ? (
                      <span
                        className={clsx(
                          "font-medium",
                          page.currentRanking <= 3
                            ? "text-green-600"
                            : page.currentRanking <= 10
                            ? "text-blue-600"
                            : page.currentRanking <= 20
                            ? "text-yellow-600"
                            : "text-gray-600"
                        )}
                      >
                        #{page.currentRanking}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {page.sponsorOperatorId ? (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-amber-500" />
                        <span className="text-sm text-amber-700 font-medium">
                          {page.sponsorDisplayName || "Sponsored"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={page.urlPath}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/content/guide-pages/${page.id}`}
                        className="p-2 text-gray-400 hover:text-[#ea580c]"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {allPages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No guide pages found. Add your first guide page to get started.
          </div>
        )}
      </div>
    </div>
  );
}
