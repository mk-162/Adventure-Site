import { db } from "@/db";
import { operators, operatorClaims, operatorSessions } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { approveClaim, rejectClaim, resetClaim, impersonateOperator } from "./actions";
import { SendMagicLinkButton } from "./SendMagicLinkButton";
import Link from "next/link";
import {
  CheckCircle, XCircle, RotateCcw, LogIn, Mail, Eye,
  Clock, Shield, Users, AlertCircle
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function ClaimsPage() {
  // Get all claims with operator info
  const claims = await db
    .select({
      id: operatorClaims.id,
      operatorId: operatorClaims.operatorId,
      operatorName: operators.name,
      operatorSlug: operators.slug,
      operatorClaimStatus: operators.claimStatus,
      claimantName: operatorClaims.claimantName,
      claimantEmail: operatorClaims.claimantEmail,
      claimantRole: operatorClaims.claimantRole,
      verificationMethod: operatorClaims.verificationMethod,
      status: operatorClaims.status,
      createdAt: operatorClaims.createdAt,
      verifiedAt: operatorClaims.verifiedAt,
    })
    .from(operatorClaims)
    .innerJoin(operators, eq(operatorClaims.operatorId, operators.id))
    .orderBy(desc(operatorClaims.createdAt));

  // Get claimed operators (for the management section)
  const claimedOperators = await db
    .select({
      id: operators.id,
      name: operators.name,
      slug: operators.slug,
      claimStatus: operators.claimStatus,
      billingEmail: operators.billingEmail,
      billingTier: operators.billingTier,
      verifiedAt: operators.verifiedAt,
      verifiedByEmail: operators.verifiedByEmail,
    })
    .from(operators)
    .where(eq(operators.claimStatus, "claimed"))
    .orderBy(desc(operators.verifiedAt));

  const premiumOperators = await db
    .select({
      id: operators.id,
      name: operators.name,
      slug: operators.slug,
      claimStatus: operators.claimStatus,
      billingEmail: operators.billingEmail,
      billingTier: operators.billingTier,
      verifiedAt: operators.verifiedAt,
    })
    .from(operators)
    .where(eq(operators.claimStatus, "premium"))
    .orderBy(desc(operators.verifiedAt));

  const pendingClaims = claims.filter(c => c.status === "pending");
  const verifiedClaims = claims.filter(c => c.status === "verified");
  const rejectedClaims = claims.filter(c => c.status === "rejected");

  // Impersonate action (server action that redirects)
  async function handleImpersonate(operatorId: number) {
    "use server";
    await impersonateOperator(operatorId);
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Operator Management</h1>
        <p className="text-gray-500">Claims queue, operator status, and admin tools</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Pending Claims" count={pendingClaims.length} color="text-yellow-600 bg-yellow-50" />
        <StatCard icon={CheckCircle} label="Verified" count={verifiedClaims.length} color="text-green-600 bg-green-50" />
        <StatCard icon={Shield} label="Claimed" count={claimedOperators.length} color="text-blue-600 bg-blue-50" />
        <StatCard icon={Users} label="Premium" count={premiumOperators.length} color="text-amber-600 bg-amber-50" />
      </div>

      {/* Pending Claims */}
      {pendingClaims.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Pending Claims ({pendingClaims.length})
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Operator</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Claimant</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/directory/${claim.operatorSlug}`} className="font-medium text-gray-900 hover:text-[#f97316]">
                        {claim.operatorName}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{claim.claimantName}</div>
                      <div className="text-sm text-gray-500">{claim.claimantEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{claim.claimantRole || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(claim.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <form action={approveClaim.bind(null, claim.id)} className="inline">
                        <button type="submit" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                          <CheckCircle className="h-3 w-3" /> Approve
                        </button>
                      </form>
                      <form action={rejectClaim.bind(null, claim.id)} className="inline">
                        <button type="submit" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                          <XCircle className="h-3 w-3" /> Reject
                        </button>
                      </form>
                      <a
                        href={`mailto:${claim.claimantEmail}?subject=Your Adventure Wales claim for ${claim.operatorName}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <Mail className="h-3 w-3" /> Email
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Claimed Operators */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Claimed Operators ({claimedOperators.length})
        </h2>
        {claimedOperators.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">No claimed operators yet.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Operator</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tier</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Verified</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {claimedOperators.map((op) => (
                  <OperatorRow key={op.id} op={op} handleImpersonate={handleImpersonate} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Premium Operators */}
      {premiumOperators.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Premium Operators ({premiumOperators.length})
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Operator</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tier</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Verified</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {premiumOperators.map((op) => (
                  <OperatorRow key={op.id} op={op} handleImpersonate={handleImpersonate} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recent History */}
      {(verifiedClaims.length > 0 || rejectedClaims.length > 0) && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Claim History</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Operator</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Claimant</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...verifiedClaims, ...rejectedClaims].map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{claim.operatorName}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{claim.claimantName}</div>
                      <div className="text-xs text-gray-500">{claim.claimantEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        claim.status === "verified" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(claim.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function OperatorRow({ op, handleImpersonate }: {
  op: {
    id: number;
    name: string;
    slug: string;
    claimStatus: string;
    billingEmail: string | null;
    billingTier: string | null;
    verifiedAt: Date | null;
    verifiedByEmail?: string | null;
  };
  handleImpersonate: (operatorId: number) => Promise<void>;
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <Link href={`/directory/${op.slug}`} className="font-medium text-gray-900 hover:text-[#f97316]">
          {op.name}
        </Link>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {op.billingEmail || op.verifiedByEmail || "—"}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          op.billingTier === "premium" ? "bg-amber-100 text-amber-700" :
          op.billingTier === "verified" ? "bg-blue-100 text-blue-700" :
          "bg-gray-100 text-gray-600"
        }`}>
          {op.billingTier || "free"}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {op.verifiedAt ? new Date(op.verifiedAt).toLocaleDateString("en-GB") : "—"}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          {/* View listing */}
          <Link
            href={`/directory/${op.slug}`}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            title="View listing"
          >
            <Eye className="h-4 w-4" />
          </Link>

          {/* Login as operator */}
          <form action={handleImpersonate.bind(null, op.id)}>
            <button
              type="submit"
              className="p-2 text-gray-400 hover:text-[#f97316] rounded-lg hover:bg-orange-50"
              title="Login as this operator"
            >
              <LogIn className="h-4 w-4" />
            </button>
          </form>

          {/* Send magic link */}
          <SendMagicLinkButton operatorId={op.id} email={op.billingEmail || ""} />

          {/* Reset / unclaim */}
          <form action={resetClaim.bind(null, op.id)}>
            <button
              type="submit"
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
              title="Reset claim (unclaim)"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

function StatCard({ icon: Icon, label, count, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
