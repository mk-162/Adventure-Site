import { db } from "@/db";
import { regions } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Map, Plus, Edit, Eye, Trash2 } from "lucide-react";

async function getRegions() {
  return db.select().from(regions).orderBy(desc(regions.createdAt));
}

export default async function RegionsAdmin() {
  const allRegions = await getRegions();

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
          <h1 className="text-2xl font-bold text-gray-900">Regions</h1>
          <p className="text-gray-500">{allRegions.length} regions</p>
        </div>
        <Link
          href="/admin/content/regions/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent-hover text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Region
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Region
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Completeness
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allRegions.map((region) => (
              <tr key={region.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Map className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{region.name}</p>
                      <p className="text-sm text-gray-500">/{region.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[region.status] || statusColors.draft
                    }`}
                  >
                    {region.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-hover"
                        style={{
                          width: `${region.completenessScore || 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      {region.completenessScore || 0}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/${region.slug}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/content/regions/${region.id}`}
                      className="p-2 text-gray-400 hover:text-accent-hover"
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

        {allRegions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No regions found. Add your first region to get started.
          </div>
        )}
      </div>
    </div>
  );
}
