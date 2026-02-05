import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOperatorSession } from "@/lib/auth";
import { Plus, Calendar, Star, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function DashboardEventsPage() {
  const session = await getOperatorSession();
  if (!session) redirect("/auth/login");

  const operatorEvents = await db
    .select()
    .from(events)
    .where(eq(events.operatorId, session.operatorId))
    .orderBy(desc(events.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">My Events</h1>
          <p className="text-gray-500">Manage your events and listings</p>
        </div>
        <Link
          href="/dashboard/events/new"
          className="flex items-center gap-2 bg-accent-hover text-white px-4 py-2 rounded-lg font-bold hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {operatorEvents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">No events yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Create your first event listing to reach thousands of outdoor enthusiasts across Wales.
            </p>
            <Link
              href="/dashboard/events/new"
              className="inline-flex items-center gap-2 text-accent-hover font-bold hover:underline"
            >
              Create an event
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {operatorEvents.map((event) => (
              <div key={event.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                    {event.heroImage ? (
                      <img src={event.heroImage} alt={event.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-1">{event.name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.dateStart ? new Date(event.dateStart).toLocaleDateString() : 'Date TBC'}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase",
                    event.status === 'published' ? "bg-green-100 text-green-700" :
                    event.status === 'review' ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-600"
                  )}>
                    {event.status}
                  </div>

                  {event.isPromoted ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-accent-hover">
                      <Star className="w-3 h-3 fill-current" /> Promoted
                    </span>
                  ) : (
                    <button className="text-sm font-medium text-accent-hover hover:underline">
                      Promote
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
