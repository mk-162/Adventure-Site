import { db } from "@/db";
import { operators } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import Link from "next/link";

export default async function AdminBillingPage() {
  // Get all operators with billing info
  const allOperators = await db
    .select({
      id: operators.id,
      name: operators.name,
      slug: operators.slug,
      email: operators.email,
      billingEmail: operators.billingEmail,
      billingTier: operators.billingTier,
      claimStatus: operators.claimStatus,
      stripeCustomerId: operators.stripeCustomerId,
      stripeSubscriptionId: operators.stripeSubscriptionId,
      stripeSubscriptionStatus: operators.stripeSubscriptionStatus,
      billingPeriodEnd: operators.billingPeriodEnd,
      billingCustomAmount: operators.billingCustomAmount,
    })
    .from(operators)
    .orderBy(
      sql`CASE 
        WHEN ${operators.billingTier} = 'premium' THEN 0 
        WHEN ${operators.billingTier} = 'verified' THEN 1 
        ELSE 2 
      END`,
      desc(operators.updatedAt)
    );

  const premium = allOperators.filter(o => o.billingTier === "premium");
  const verified = allOperators.filter(o => o.billingTier === "verified");
  const free = allOperators.filter(o => o.billingTier === "free" || !o.billingTier);

  // Revenue calc
  const enhancedRevenue = verified.length * 9.99;
  const premiumRevenue = premium.length * 29.99;
  const totalMRR = enhancedRevenue + premiumRevenue;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing Overview</h1>
        <p className="text-slate-600">Operator subscriptions and revenue</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <p className="text-sm text-slate-500 uppercase tracking-wider">Monthly Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">£{totalMRR.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <p className="text-sm text-slate-500 uppercase tracking-wider">Premium</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{premium.length}</p>
          <p className="text-xs text-slate-400">£{premiumRevenue.toFixed(2)}/mo</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <p className="text-sm text-slate-500 uppercase tracking-wider">Enhanced</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{verified.length}</p>
          <p className="text-xs text-slate-400">£{enhancedRevenue.toFixed(2)}/mo</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <p className="text-sm text-slate-500 uppercase tracking-wider">Free</p>
          <p className="text-3xl font-bold text-slate-400 mt-1">{free.length}</p>
        </div>
      </div>

      {/* Operators Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Operator</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tier</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Renews</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Stripe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allOperators.map(op => (
              <tr key={op.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/content/operators/${op.id}`} className="font-medium text-slate-900 hover:text-blue-600">
                    {op.name}
                  </Link>
                  <p className="text-xs text-slate-400">{op.billingEmail || op.email || "—"}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                    op.billingTier === "premium" ? "bg-amber-100 text-amber-800" :
                    op.billingTier === "verified" ? "bg-blue-100 text-blue-800" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {op.billingTier || "free"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {op.stripeSubscriptionStatus ? (
                    <span className={`text-xs font-medium ${
                      op.stripeSubscriptionStatus === "active" ? "text-green-600" :
                      op.stripeSubscriptionStatus === "past_due" ? "text-red-600" :
                      op.stripeSubscriptionStatus === "trialing" ? "text-blue-600" :
                      "text-slate-400"
                    }`}>
                      {op.stripeSubscriptionStatus}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {op.billingPeriodEnd
                    ? new Date(op.billingPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {op.stripeCustomerId ? (
                    <a
                      href={`https://dashboard.stripe.com/${process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "" : "test/"}customers/${op.stripeCustomerId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      View →
                    </a>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
