import { getOperatorSession } from "@/lib/auth";
import { db } from "@/db";
import { operators, activities } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getOperatorSession();
  if (!session) return null;

  const operator = await db.query.operators.findFirst({
    where: eq(operators.id, session.operatorId),
  });

  if (!operator) return null;

  // Calculate completeness
  const fields = [
    operator.description,
    operator.tagline,
    operator.coverImage,
    operator.logoUrl,
    operator.email, // public contact email
    operator.phone,
    operator.website,
    operator.address,
  ];
  const filledFields = fields.filter(f => f && f.length > 0).length;
  const completenessScore = Math.round((filledFields / fields.length) * 100);

  // Count activities
  const activityCount = await db.select({ count: count() }).from(activities).where(eq(activities.operatorId, operator.id));
  const numActivities = activityCount[0].count;

  // Enquiries (Mock for now as per discovery)
  const numEnquiries = 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {session.name}</h1>
        <p className="text-slate-600">Here's what's happening with your listing today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Plan</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 capitalize">{operator.billingTier}</span>
          </div>
          {operator.billingTier === "free" && (
            <div className="mt-4">
              <Link href="/dashboard/billing" className="text-sm text-orange-600 font-medium hover:text-orange-700">
                Upgrade to verified →
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Activities Listed</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-900">{numActivities}</span>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/activities" className="text-sm text-slate-600 font-medium hover:text-slate-900">
              Manage activities →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Recent Enquiries</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-900">{numEnquiries}</span>
          </div>
          <div className="mt-4">
             <Link href="/dashboard/enquiries" className="text-sm text-slate-600 font-medium hover:text-slate-900">
              View all →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Listing Score</h3>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">{completenessScore}%</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${completenessScore < 50 ? 'bg-red-500' : completenessScore < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${completenessScore}%` }}
                />
            </div>
          </div>
           <div className="mt-4">
             <Link href="/dashboard/listing" className="text-sm text-slate-600 font-medium hover:text-slate-900">
              Improve score →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Enquiries List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Recent Enquiries</h3>
        </div>
        {numEnquiries === 0 ? (
           <div className="p-8 text-center text-slate-500">
               No enquiries yet. Optimize your listing to attract more adventurers!
           </div>
        ) : (
            <div className="p-6">
                {/* List would go here */}
            </div>
        )}
      </div>
    </div>
  );
}
