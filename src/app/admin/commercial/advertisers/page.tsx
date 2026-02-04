import { db } from "@/db";
import { advertisers } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Megaphone, Plus, Edit, Eye, Trash2 } from "lucide-react";

async function getAdvertisers() {
  return db.select().from(advertisers).orderBy(desc(advertisers.createdAt));
}

export default async function AdvertisersAdmin() {
  const allAdvertisers = await getAdvertisers();

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
          <h1 className="text-2xl font-bold text-gray-900">Advertisers</h1>
          <p className="text-gray-500">{allAdvertisers.length} advertisers</p>
        </div>
        <Link
          href="/admin/commercial/advertisers/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#f97316] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Advertiser
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Contact Email
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Website
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
            {allAdvertisers.map((advertiser) => (
              <tr key={advertiser.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Megaphone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{advertiser.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{advertiser.contactEmail || "—"}</p>
                </td>
                <td className="px-6 py-4">
                  {advertiser.website ? (
                    <a
                      href={advertiser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {advertiser.website}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[advertiser.status || "draft"]
                    }`}
                  >
                    {advertiser.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/commercial/advertisers/${advertiser.id}`}
                      className="p-2 text-gray-400 hover:text-[#f97316]"
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

        {allAdvertisers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No advertisers found. Add your first advertiser to get started.
          </div>
        )}
      </div>
    </div>
  );
}
