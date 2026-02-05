import { db } from "@/db";
import { regions, activities, operators, accommodation, events, answers, guidePages } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import Link from "next/link";
import {
  Map,
  Compass,
  Users,
  Tent,
  Calendar,
  MessageCircle,
  BookOpen,
  ArrowRight,
} from "lucide-react";

async function getStats() {
  const [
    regionsCount,
    activitiesCount,
    operatorsCount,
    accommodationCount,
    eventsCount,
    answersCount,
    guidePagesCount,
  ] = await Promise.all([
    db.select({ count: count() }).from(regions),
    db.select({ count: count() }).from(activities),
    db.select({ count: count() }).from(operators),
    db.select({ count: count() }).from(accommodation),
    db.select({ count: count() }).from(events),
    db.select({ count: count() }).from(answers),
    db.select({ count: count() }).from(guidePages),
  ]);

  return {
    regions: regionsCount[0]?.count || 0,
    activities: activitiesCount[0]?.count || 0,
    operators: operatorsCount[0]?.count || 0,
    accommodation: accommodationCount[0]?.count || 0,
    events: eventsCount[0]?.count || 0,
    answers: answersCount[0]?.count || 0,
    guidePages: guidePagesCount[0]?.count || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      name: "Regions",
      count: stats.regions,
      icon: Map,
      href: "/admin/content/regions",
      color: "bg-blue-500",
    },
    {
      name: "Activities",
      count: stats.activities,
      icon: Compass,
      href: "/admin/content/activities",
      color: "bg-orange-500",
    },
    {
      name: "Operators",
      count: stats.operators,
      icon: Users,
      href: "/admin/content/operators",
      color: "bg-green-500",
    },
    {
      name: "Accommodation",
      count: stats.accommodation,
      icon: Tent,
      href: "/admin/content/accommodation",
      color: "bg-purple-500",
    },
    {
      name: "Events",
      count: stats.events,
      icon: Calendar,
      href: "/admin/content/events",
      color: "bg-red-500",
    },
    {
      name: "FAQs",
      count: stats.answers,
      icon: MessageCircle,
      href: "/admin/content/answers",
      color: "bg-teal-500",
    },
    {
      name: "Guide Pages",
      count: stats.guidePages,
      icon: BookOpen,
      href: "/admin/content/guide-pages",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your adventure content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#ea580c] transition-colors" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{card.count}</p>
              <p className="text-gray-500">{card.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/content/activities/new"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors"
          >
            <Compass className="h-5 w-5" />
            Add Activity
          </Link>
          <Link
            href="/admin/content/operators/new"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors"
          >
            <Users className="h-5 w-5" />
            Add Operator
          </Link>
          <Link
            href="/admin/commercial/claims"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors"
          >
            Review Claims
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors"
          >
            View Site
          </Link>
        </div>
      </div>
    </div>
  );
}
