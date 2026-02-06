import { getUserSession } from "@/lib/user-auth";
import { db } from "@/db";
import { users, userFavourites, activities, itineraries, operators, events } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { Heart, MapPin, Route, Building2, Calendar, LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Account | Adventure Wales",
};

async function getFavourites(userId: number) {
  const favs = await db.select().from(userFavourites).where(eq(userFavourites.userId, userId));
  
  const enriched = await Promise.all(favs.map(async (fav) => {
    switch (fav.favouriteType) {
      case "activity": {
        const [item] = await db.select({ name: activities.name, slug: activities.slug }).from(activities).where(eq(activities.id, fav.favouriteId));
        return item ? { ...fav, name: item.name, link: `/activities/${item.slug}`, icon: "activity" } : null;
      }
      case "itinerary": {
        const [item] = await db.select({ title: itineraries.title, slug: itineraries.slug }).from(itineraries).where(eq(itineraries.id, fav.favouriteId));
        return item ? { ...fav, name: item.title, link: `/itineraries/activities/${item.slug}`, icon: "itinerary" } : null;
      }
      case "operator": {
        const [item] = await db.select({ name: operators.name, slug: operators.slug }).from(operators).where(eq(operators.id, fav.favouriteId));
        return item ? { ...fav, name: item.name, link: `/directory/activities/${item.slug}`, icon: "operator" } : null;
      }
      case "event": {
        const [item] = await db.select({ name: events.name, slug: events.slug }).from(events).where(eq(events.id, fav.favouriteId));
        return item ? { ...fav, name: item.name, link: `/events/activities/${item.slug}`, icon: "event" } : null;
      }
      default:
        return null;
    }
  }));

  return enriched.filter(Boolean);
}

const iconMap = {
  activity: MapPin,
  itinerary: Route,
  operator: Building2,
  event: Calendar,
};

export default async function AccountPage() {
  const session = await getUserSession();
  
  if (!session) {
    redirect("/login?from=/account");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) {
    redirect("/login?from=/account");
  }

  const favourites = await getFavourites(user.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {user.name || "Adventurer"}
              </h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            <a
              href="/api/user/logout"
              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </a>
          </div>
        </div>

        {/* Saved Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-accent-hover" />
            <h2 className="text-lg font-bold text-primary">Saved Items</h2>
            <span className="text-sm text-gray-400 ml-auto">{favourites.length} saved</span>
          </div>

          {favourites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="font-semibold text-primary mb-2">Nothing saved yet</h3>
              <p className="text-gray-500 text-sm mb-6">
                Tap the heart icon on activities, itineraries, and providers to save them here.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/activities" className="text-sm font-medium text-accent-hover hover:underline">
                  Browse activities →
                </Link>
                <Link href="/itineraries" className="text-sm font-medium text-accent-hover hover:underline">
                  Browse itineraries →
                </Link>
                <Link href="/directory" className="text-sm font-medium text-accent-hover hover:underline">
                  Browse providers →
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {favourites.map((fav) => {
                if (!fav) return null;
                const Icon = iconMap[fav.icon as keyof typeof iconMap] || Heart;
                return (
                  <Link
                    key={fav.id}
                    href={fav.link}
                    className="flex items-center gap-4 py-3 hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent-hover/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent-hover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-primary truncate">{fav.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{fav.favouriteType}</p>
                    </div>
                    <span className="text-xs text-gray-300">→</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link
            href="/itineraries"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
          >
            <Route className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-primary">Plan a Trip</p>
          </Link>
          <Link
            href="/events"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
          >
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-primary">Find Events</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
