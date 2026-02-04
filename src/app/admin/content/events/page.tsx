import { db } from "@/db";
import { events, regions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Calendar, Plus, Edit, Eye, Trash2, MapPin, Star } from "lucide-react";
import { ImportButton } from "./ImportButton";

async function getEvents() {
  return db
    .select({
      id: events.id,
      name: events.name,
      slug: events.slug,
      type: events.type,
      status: events.status,
      monthTypical: events.monthTypical,
      location: events.location,
      registrationCost: events.registrationCost,
      regionName: regions.name,
      isPromoted: events.isPromoted,
      externalSource: events.externalSource,
    })
    .from(events)
    .leftJoin(regions, eq(events.regionId, regions.id))
    .orderBy(desc(events.createdAt))
    .limit(100);
}

export default async function EventsAdmin() {
  const allEvents = await getEvents();

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
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500">{allEvents.length} events</p>
        </div>
        <div className="flex items-center gap-3">
          <ImportButton />
          <Link
            href="/admin/content/events/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#f97316] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Event
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Event</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Source</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Type</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Location</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{event.name}</p>
                        {event.isPromoted && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                      {event.registrationCost && (
                        <p className="text-sm text-gray-500">From £{event.registrationCost}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    {event.externalSource || "manual"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {event.type || "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {event.regionName || event.location || "—"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status] || statusColors.draft}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/events/${event.slug}`} className="p-2 text-gray-400 hover:text-gray-600" title="View">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link href={`/admin/content/events/${event.id}`} className="p-2 text-gray-400 hover:text-[#f97316]" title="Edit">
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

        {allEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No events found. Add your first event to get started.
          </div>
        )}
      </div>
    </div>
  );
}
