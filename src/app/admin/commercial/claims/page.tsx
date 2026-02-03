import { db } from "@/db";
import { operators } from "@/db/schema";
import { and, eq, isNotNull } from "drizzle-orm";
import { approveClaim, rejectClaim } from "./actions";
import { Button, ButtonLink } from "@/components/ui/button";

export default async function ClaimsQueuePage() {
  const pendingClaims = await db
    .select()
    .from(operators)
    .where(
      and(
        eq(operators.claimStatus, "stub"),
        isNotNull(operators.claimedByEmail)
      )
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1e3a4c] mb-8">Operator Claims Queue</h1>

      {pendingClaims.length === 0 ? (
        <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-500">
          No pending claims found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operator Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claimant Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingClaims.map((claim) => (
                <tr key={claim.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{claim.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{claim.claimedByEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {claim.claimedAt ? new Date(claim.claimedAt).toLocaleDateString() : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <form action={approveClaim.bind(null, claim.id)} className="inline">
                      <Button type="submit" size="sm" variant="primary">Approve</Button>
                    </form>
                    <form action={rejectClaim.bind(null, claim.id)} className="inline">
                       <Button type="submit" size="sm" variant="outline">Reject</Button>
                    </form>
                    <ButtonLink
                      href={`mailto:${claim.claimedByEmail}?subject=Info regarding your claim for ${claim.name}`}
                      size="sm"
                      variant="ghost"
                      external
                    >
                      Request Info
                    </ButtonLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
