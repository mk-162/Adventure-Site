import { getOperatorSession } from "@/lib/auth";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function ActivitiesPage() {
  const session = await getOperatorSession();
  if (!session) return null;

  const operatorActivities = await db.query.activities.findMany({
    where: eq(activities.operatorId, session.operatorId),
    with: {
        region: true,
        activityType: true,
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">My Activities</h2>
        {/* Phase 2: Add Activity button */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Name</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Price</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Duration</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Difficulty</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {operatorActivities.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No activities found. Contact us to add your adventures.
                    </td>
                </tr>
            ) : (
                operatorActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{activity.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                        {activity.priceFrom ? `£${activity.priceFrom}` : 'POA'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{activity.duration || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{activity.difficulty || "-"}</td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            activity.status === 'published' ? 'bg-green-100 text-green-700' :
                            activity.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {activity.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        {activity.region && activity.activityType ? (
                            <Link
                                href={`/${activity.region.slug}/${activity.activityType.slug}/${activity.slug}`}
                                target="_blank"
                                className="text-orange-600 hover:underline text-sm"
                            >
                                View Live
                            </Link>
                        ) : (
                             <span className="text-slate-400 text-sm">Preview unavailable</span>
                        )}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
       <div className="bg-slate-50 px-6 py-4 text-xs text-slate-500 border-t border-slate-200">
           Need to add or remove activities? Please contact support.
       </div>
    </div>
  );
}
