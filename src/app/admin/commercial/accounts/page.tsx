import { db } from "@/db";
import { advertiserAccounts, operators } from "@/db/schema";
import { eq, desc, count, sum } from "drizzle-orm";
import Link from "next/link";
import {
  Building2, Plus, Users, Eye, Trash2, CreditCard, StickyNote, Edit
} from "lucide-react";
import { createAccount, deleteAccount } from "./actions";
import { AccountDetail } from "./AccountDetail";

export default async function AccountsPage() {
  // Get all accounts with their operator counts
  const accounts = await db
    .select({
      id: advertiserAccounts.id,
      name: advertiserAccounts.name,
      slug: advertiserAccounts.slug,
      primaryEmail: advertiserAccounts.primaryEmail,
      contactName: advertiserAccounts.contactName,
      billingEmail: advertiserAccounts.billingEmail,
      billingCustomAmount: advertiserAccounts.billingCustomAmount,
      billingNotes: advertiserAccounts.billingNotes,
      adminNotes: advertiserAccounts.adminNotes,
      primaryPhone: advertiserAccounts.primaryPhone,
      createdAt: advertiserAccounts.createdAt,
    })
    .from(advertiserAccounts)
    .orderBy(desc(advertiserAccounts.createdAt));

  // Get operators grouped by account
  const allOperators = await db
    .select({
      id: operators.id,
      name: operators.name,
      slug: operators.slug,
      accountId: operators.accountId,
      claimStatus: operators.claimStatus,
      billingTier: operators.billingTier,
      billingCustomAmount: operators.billingCustomAmount,
      billingNotes: operators.billingNotes,
      adminNotes: operators.adminNotes,
      stripeSubscriptionStatus: operators.stripeSubscriptionStatus,
      billingPeriodEnd: operators.billingPeriodEnd,
    })
    .from(operators)
    .orderBy(operators.name);

  // Unlinked operators (not attached to any account)
  const unlinkedOps = allOperators.filter(o => !o.accountId && (o.claimStatus === "claimed" || o.claimStatus === "premium"));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advertiser Accounts</h1>
          <p className="text-gray-500">Manage companies, multi-site subscriptions, billing and notes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-[#1e3a4c]" />
            <span className="text-xs font-medium text-gray-500">Accounts</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-500">Linked Sites</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{allOperators.filter(o => o.accountId).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-gray-500">Unlinked Claimed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{unlinkedOps.length}</p>
        </div>
      </div>

      {/* Create New Account */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-[#ea580c]" />
          New Account
        </h2>
        <form action={createAccount} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input name="name" placeholder="Company name *" required
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] focus:border-transparent" />
          <input name="contactName" placeholder="Contact name"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] focus:border-transparent" />
          <input name="primaryEmail" type="email" placeholder="Email"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] focus:border-transparent" />
          <input name="primaryPhone" placeholder="Phone"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] focus:border-transparent" />
          <input name="billingEmail" type="email" placeholder="Billing email (if different)"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] focus:border-transparent" />
          <input name="billingCustomAmount" type="number" step="0.01" placeholder="Custom £/mo"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] focus:border-transparent" />
          <input name="billingNotes" placeholder="Billing notes (discounts, extras)"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] focus:border-transparent" />
          <div className="flex items-end">
            <button type="submit"
              className="w-full px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] text-sm font-medium transition-colors">
              Create Account
            </button>
          </div>
        </form>
      </div>

      {/* Account List */}
      {accounts.map((account) => {
        const linkedOps = allOperators.filter(o => o.accountId === account.id);
        return (
          <AccountDetail
            key={account.id}
            account={account}
            linkedOperators={linkedOps}
            unlinkedOperators={unlinkedOps}
          />
        );
      })}

      {/* Unlinked Claimed Operators */}
      {unlinkedOps.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            Claimed Operators Without Account ({unlinkedOps.length})
          </h2>
          <p className="text-sm text-gray-500 mb-4">These operators have been claimed but aren{"'"}t linked to an advertiser account yet.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unlinkedOps.map((op) => (
              <div key={op.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-900">{op.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      op.claimStatus === "premium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {op.claimStatus}
                    </span>
                    <span className="text-xs text-gray-400">{op.billingTier || "free"}</span>
                  </div>
                </div>
                <Link href={`/directory/${op.slug}`} className="p-1.5 text-gray-400 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
