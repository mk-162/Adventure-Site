import { notFound } from "next/navigation";
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ClaimForm } from "./claim-form"; // Client component for the form

export default async function ClaimPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const operator = await db.query.operators.findFirst({
    where: eq(operators.slug, slug),
  });

  if (!operator) {
    notFound();
  }

  // If already claimed/verified
  if (operator.claimStatus === "claimed" || operator.claimStatus === "premium") {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Already Claimed</h1>
        <p>This listing for <strong>{operator.name}</strong> has already been claimed.</p>
        <div className="mt-8">
            <a href="/auth/login" className="text-orange-500 hover:underline">Log in here</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Claim {operator.name}</h1>
        <p className="text-slate-600">
          Verify your ownership to manage this listing, view enquiries, and reach more adventurers.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <ClaimForm operatorSlug={operator.slug} operatorName={operator.name} />
      </div>
    </div>
  );
}
