import { db } from "@/db";
import { adCampaigns, advertisers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Target, Plus, Edit, Eye, Trash2 } from "lucide-react";

async function getCampaigns() {
  const campaigns = await db
    .select({
      campaign: adCampaigns,
      advertiser: advertisers,
    })
    .from(adCampaigns)
    .leftJoin(advertisers, eq(adCampaigns.advertiserId, advertisers.id))
    .orderBy(desc(adCampaigns.createdAt));
  
  return campaigns;
}

export default async function CampaignsAdmin() {
  const allCampaigns = await getCampaigns();

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    ended: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ad Campaigns</h1>
          <p className="text-gray-500">{allCampaigns.length} campaigns</p>
        </div>
        <Link
          href="/admin/commercial/campaigns/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Campaign
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Campaign
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Advertiser
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Start Date
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                End Date
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Budget
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allCampaigns.map(({ campaign, advertiser }) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Target className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{advertiser?.name || "—"}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[campaign.status || "draft"]
                    }`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">
                    {campaign.startDate
                      ? new Date(campaign.startDate).toLocaleDateString()
                      : "—"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">
                    {campaign.endDate
                      ? new Date(campaign.endDate).toLocaleDateString()
                      : "—"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">
                    {campaign.budget ? `£${campaign.budget}` : "—"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/commercial/campaigns/${campaign.id}`}
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

        {allCampaigns.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No campaigns found. Add your first campaign to get started.
          </div>
        )}
      </div>
    </div>
  );
}
