import { db } from "@/db";
import { operators } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import Link from "next/link";
import clsx from "clsx";
import { Users, Plus, Edit, Eye, Star, ArrowUp, ArrowDown } from "lucide-react";
import { upgradeToPremium, downgradeToClaimed, setClaimStatus } from "@/app/admin/commercial/claims/actions";
import { archiveOperator } from "./actions";
import { ArchiveButton } from "../_components/ArchiveButton";

type StatusFilter = "draft" | "review" | "published" | "archived";
const STATUS_VALUES: StatusFilter[] = ["draft", "review", "published", "archived"];

async function getOperators(status?: StatusFilter) {
  const conditions = status ? [eq(operators.status, status)] : [];
  return db
    .select()
    .from(operators)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(operators.createdAt))
    .limit(100);
}

export default async function OperatorsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter: StatusFilter | undefined = STATUS_VALUES.includes(
    params.status as StatusFilter
  )
    ? (params.status as StatusFilter)
    : undefined;

  const allOperators = await getOperators(statusFilter);

  const claimStatusColors: Record<string, string> = {
    stub: "bg-gray-100 text-gray-800",
    claimed: "bg-blue-100 text-blue-800",
    premium: "bg-yellow-100 text-yellow-800",
  };

  const publishStatusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    review: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-red-100 text-red-800",
  };

  const typeColors: Record<string, string> = {
    primary: "bg-green-100 text-green-800",
    secondary: "bg-gray-100 text-gray-800",
  };

  const stubs = allOperators.filter(o => o.claimStatus === "stub").length;
  const claimed = allOperators.filter(o => o.claimStatus === "claimed").length;
  const premium = allOperators.filter(o => o.claimStatus === "premium").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operators</h1>
          <p className="text-gray-500">{allOperators.length} operators</p>
        </div>
        <Link
          href="/admin/content/operators/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent-hover text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Operator
        </Link>
      </div>

      {/* Publication status filter */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { label: "All", value: undefined },
          { label: "Draft", value: "draft" as const },
          { label: "Review", value: "review" as const },
          { label: "Published", value: "published" as const },
          { label: "Archived", value: "archived" as const },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/content/operators?status=${tab.value}` : "/admin/content/operators"}
            className={clsx(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              statusFilter === tab.value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{stubs}</p>
          <p className="text-sm text-gray-500">Stubs</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-2xl font-bold text-blue-900">{claimed}</p>
          <p className="text-sm text-blue-600">Claimed</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-2xl font-bold text-amber-900">{premium}</p>
          <p className="text-sm text-amber-600">Premium</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Operator
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Type
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Claim Status
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Publication
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Rating
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allOperators.map((operator) => (
              <tr key={operator.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {operator.name}
                      </p>
                      <p className="text-sm text-gray-500">{operator.website}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      typeColors[operator.type || "secondary"]
                    }`}
                  >
                    {operator.type || "secondary"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        claimStatusColors[operator.claimStatus || "stub"]
                      }`}
                    >
                      {operator.claimStatus || "stub"}
                    </span>
                    {operator.claimStatus !== "premium" && (
                      <form action={upgradeToPremium.bind(null, operator.id)}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full hover:bg-amber-100 transition-colors"
                          title="Upgrade to Premium"
                        >
                          <ArrowUp className="h-3 w-3" />
                          Premium
                        </button>
                      </form>
                    )}
                    {operator.claimStatus === "premium" && (
                      <form action={downgradeToClaimed.bind(null, operator.id)}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
                          title="Downgrade to Claimed"
                        >
                          <ArrowDown className="h-3 w-3" />
                          Downgrade
                        </button>
                      </form>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      publishStatusColors[operator.status] || publishStatusColors.draft
                    }`}
                  >
                    {operator.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {operator.googleRating ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">
                        {operator.googleRating}
                      </span>
                      {operator.reviewCount && (
                        <span className="text-sm text-gray-400">
                          ({operator.reviewCount})
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/directory/${operator.slug}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/content/operators/${operator.id}`}
                      className="p-2 text-gray-400 hover:text-accent-hover"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <ArchiveButton
                      action={archiveOperator.bind(null, operator.id)}
                      itemName={operator.name}
                      itemLabel="operator"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allOperators.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No operators found{statusFilter ? ` with status "${statusFilter}"` : ""}. Add your first operator to get started.
          </div>
        )}
      </div>
    </div>
  );
}
