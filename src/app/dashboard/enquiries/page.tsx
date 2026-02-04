import { getOperatorSession } from "@/lib/auth";

export default async function EnquiriesPage() {
  const session = await getOperatorSession();
  if (!session) return null;

  // Mock data - replace with DB fetch when Enquiries table is built
  const enquiries: any[] = [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Enquiries</h2>
      </div>

      {enquiries.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
            <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
                <span className="text-2xl">📬</span>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No enquiries yet</h3>
            <p className="max-w-md mx-auto">
                When adventurers enquire about your activities, they'll appear here.
                Make sure your listing is complete to attract more interest!
            </p>
        </div>
      ) : (
          <div className="overflow-x-auto">
              {/* Table implementation */}
          </div>
      )}
    </div>
  );
}
