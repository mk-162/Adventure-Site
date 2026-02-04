import { db } from "@/db";
import { operators, operatorClaims } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { approveClaim, rejectClaim } from "./actions";
import { Button } from "@/components/ui/button"; // Removed ButtonLink as it might not be standard, using simple <a> if needed

export default async function ClaimsQueuePage() {
  const claims = await db
    .select({
        id: operatorClaims.id,
        operatorName: operators.name,
        claimantName: operatorClaims.claimantName,
        claimantEmail: operatorClaims.claimantEmail,
        verificationMethod: operatorClaims.verificationMethod,
        status: operatorClaims.status,
        createdAt: operatorClaims.createdAt,
    })
    .from(operatorClaims)
    .innerJoin(operators, eq(operatorClaims.operatorId, operators.id))
    .orderBy(desc(operatorClaims.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1e3a4c] mb-8">Operator Claims Queue</h1>

      {claims.length === 0 ? (
        <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-500">
          No claims found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claimant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
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
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{claim.operatorName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{claim.claimantName}</div>
                    <div className="text-sm text-gray-500">{claim.claimantEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                      {claim.verificationMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        claim.status === 'verified' ? 'bg-green-100 text-green-800' :
                        claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {claim.status === 'pending' && (
                        <>
                            <form action={approveClaim.bind(null, claim.id)} className="inline">
                            <Button type="submit" size="sm" variant="primary">Approve</Button>
                            </form>
                            <form action={rejectClaim.bind(null, claim.id)} className="inline">
                            <Button type="submit" size="sm" variant="outline">Reject</Button>
                            </form>
                        </>
                    )}
                    <a
                      href={`mailto:${claim.claimantEmail}?subject=Info regarding your claim for ${claim.operatorName}`}
                      className="text-slate-600 hover:text-slate-900 text-sm ml-2"
                    >
                      Email
                    </a>
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
