import { getUserSession } from "@/lib/user-auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, userFavourites, events, itineraries, activities, operators } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { Heart, MapPin, Calendar, Mountain, Building2, LogOut, ChevronRight } from "lucide-react";
import { MyAdventuresClient } from "./client";

export const metadata = {
  title: "My Adventures | Adventure Wales",
  description: "Your saved adventures, itineraries, and favourite operators.",
};

async function getFavouritesWithDetails(userId: number) {
  const favs = await db.select().from(userFavourites)
    .where(eq(userFavourites.userId, userId))
    .orderBy(userFavourites.createdAt);

  const hydrated = await Promise.all(
    favs.map(async (fav) => {
      let item: { id: number; name: string; slug: string; extra?: string } | null = null;

      switch (fav.favouriteType) {
        case "event": {
          const e = await db.query.events.findFirst({ where: eq(events.id, fav.favouriteId) });
          if (e) item = { id: e.id, name: e.name, slug: `/events/${e.slug}`, extra: e.location || undefined };
          break;
        }
        case "itinerary": {
          const i = await db.query.itineraries.findFirst({ where: eq(itineraries.id, fav.favouriteId) });
          if (i) item = { id: i.id, name: i.name, slug: `/itineraries/${i.slug}` };
          break;
        }
        case "activity": {
          const a = await db.query.activities.findFirst({ where: eq(activities.id, fav.favouriteId) });
          if (a) item = { id: a.id, name: a.name, slug: `/activities/${a.slug}` };
          break;
        }
        case "operator": {
          const o = await db.query.operators.findFirst({ where: eq(operators.id, fav.favouriteId) });
          if (o) item = { id: o.id, name: o.name, slug: `/directory/${o.slug}` };
          break;
        }
      }

      return {
        id: fav.id,
        type: fav.favouriteType,
        itemId: fav.favouriteId,
        savedAt: fav.createdAt,
        item,
      };
    })
  );

  return hydrated.filter((f) => f.item !== null);
}

export default async function MyAdventuresPage() {
  const session = await getUserSession();

  if (!session) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) {
    redirect("/login");
  }

  const favourites = await getFavouritesWithDetails(user.id);

  const groupedFavourites = {
    itinerary: favourites.filter((f) => f.type === "itinerary"),
    activity: favourites.filter((f) => f.type === "activity"),
    event: favourites.filter((f) => f.type === "event"),
    operator: favourites.filter((f) => f.type === "operator"),
  };

  const typeConfig = {
    itinerary: { label: "Itineraries", icon: MapPin, colour: "text-blue-600 bg-blue-50" },
    activity: { label: "Activities", icon: Mountain, colour: "text-green-600 bg-green-50" },
    event: { label: "Events", icon: Calendar, colour: "text-purple-600 bg-purple-50" },
    operator: { label: "Operators", icon: Building2, colour: "text-orange-600 bg-orange-50" },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a4c]">
              {user.name ? `${user.name}'s Adventures` : "My Adventures"}
            </h1>
            <p className="text-slate-500">{user.email}</p>
          </div>
          <MyAdventuresClient />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(Object.entries(groupedFavourites) as [keyof typeof typeConfig, typeof favourites][]).map(
            ([type, items]) => {
              const config = typeConfig[type];
              const Icon = config.icon;
              return (
                <div key={type} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${config.colour}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-[#1e3a4c]">{items.length}</div>
                  <div className="text-sm text-slate-500">{config.label} saved</div>
                </div>
              );
            }
          )}
        </div>

        {/* Favourites by type */}
        {favourites.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#1e3a4c] mb-2">No saved adventures yet</h2>
            <p className="text-slate-500 mb-6">
              Tap the heart icon on any activity, itinerary, event, or operator to save it here.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/itineraries" className="px-4 py-2 bg-[#1e3a4c] text-white rounded-lg text-sm font-medium hover:bg-[#152833]">
                Browse itineraries
              </Link>
              <Link href="/activities" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
                Explore activities
              </Link>
              <Link href="/events" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
                Find events
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {(Object.entries(groupedFavourites) as [keyof typeof typeConfig, typeof favourites][]).map(
              ([type, items]) => {
                if (items.length === 0) return null;
                const config = typeConfig[type];
                const Icon = config.icon;

                return (
                  <section key={type}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.colour}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-bold text-[#1e3a4c]">
                        Saved {config.label}
                      </h2>
                      <span className="text-sm text-slate-400">({items.length})</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                      {items.map((fav) => (
                        <Link
                          key={fav.id}
                          href={fav.item!.slug}
                          className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-[#1e3a4c]">{fav.item!.name}</div>
                            {fav.item!.extra && (
                              <div className="text-sm text-slate-400">{fav.item!.extra}</div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}
