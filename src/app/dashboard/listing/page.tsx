import { getOperatorSession } from "@/lib/auth";
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EditListingForm } from "./edit-listing-form";

export default async function ListingPage() {
  const session = await getOperatorSession();
  if (!session) return null;

  const operator = await db.query.operators.findFirst({
    where: eq(operators.id, session.operatorId),
  });

  if (!operator) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Edit Listing</h2>
        <a href={`/directory/${operator.slug}`} target="_blank" className="text-sm text-orange-600 hover:underline">View Live Page →</a>
      </div>
      <div className="p-6">
        <EditListingForm operator={operator} />
      </div>
    </div>
  );
}
