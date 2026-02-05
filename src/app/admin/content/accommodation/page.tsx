import { db } from "@/db";
import { accommodation, regions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Tent, Plus, Edit, Eye, Trash2, Star } from "lucide-react";

async function getAccommodation() {
  return db
    .select({
      id: accommodation.id,
      name: accommodation.name,
      slug: accommodation.slug,
      type: accommodation.type,
      status: accommodation.status,
      priceFrom: accommodation.priceFrom,
      priceTo: accommodation.priceTo,
      googleRating: accommodation.googleRating,
      regionName: regions.name,
    })
    .from(accommodation)
    .leftJoin(regions, eq(accommodation.regionId, regions.id))
    .orderBy(desc(accommodation.createdAt))
    .limit(100);
}

export default async function AccommodationAdmin() {
  const allAccommodation = await getAccommodation();

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
          <h1 className="text-2xl font-bold text-gray-900">Accommodation</h1>
          <p className="text-gray-500">{allAccommodation.length} properties</p>
        </div>
        <Link
          href="/admin/content/accommodation/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Property</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Type</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Region</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Price</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allAccommodation.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Tent className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.googleRating && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {item.googleRating}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {item.type || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.regionName || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.priceFrom ? `£${item.priceFrom}${item.priceTo ? `-${item.priceTo}` : "+"}/night` : "—"}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status] || statusColors.draft}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/accommodation/${item.slug}`} className="p-2 text-gray-400 hover:text-gray-600" title="View">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link href={`/admin/content/accommodation/${item.id}`} className="p-2 text-gray-400 hover:text-[#ea580c]" title="Edit">
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

        {allAccommodation.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No accommodation found. Add your first property to get started.
          </div>
        )}
      </div>
    </div>
  );
}
