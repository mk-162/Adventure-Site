import { db } from "@/db";
import { activities, regions, operators } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Compass, Plus, Edit, Eye, Trash2 } from "lucide-react";

async function getActivities() {
  return db
    .select({
      id: activities.id,
      name: activities.name,
      slug: activities.slug,
      status: activities.status,
      completenessScore: activities.completenessScore,
      regionName: regions.name,
      operatorName: operators.name,
    })
    .from(activities)
    .leftJoin(regions, eq(activities.regionId, regions.id))
    .leftJoin(operators, eq(activities.operatorId, operators.id))
    .orderBy(desc(activities.createdAt))
    .limit(100);
}

export default async function ActivitiesAdmin() {
  const allActivities = await getActivities();

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
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-500">{allActivities.length} activities</p>
        </div>
        <Link
          href="/admin/content/activities/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent-hover text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Activity
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Activity
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Region
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Operator
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allActivities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Compass className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.name}
                      </p>
                      <p className="text-sm text-gray-500">/{activity.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {activity.regionName || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {activity.operatorName || "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[activity.status] || statusColors.draft
                    }`}
                  >
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/activities/${activity.slug}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/content/activities/${activity.id}`}
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

        {allActivities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No activities found. Add your first activity to get started.
          </div>
        )}
      </div>
    </div>
  );
}
