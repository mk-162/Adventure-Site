import { getOperatorSession } from "@/lib/auth";

export default async function EnquiriesPage() {
  const session = await getOperatorSession();
  if (!session) return null;

  // There is no enquiries table/pipeline yet — this page intentionally does
  // not pretend to show real (empty) data. It stays routable so the feature
  // can be wired up later without a broken link in the meantime.
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Enquiries</h2>
      </div>

      <div className="p-12 text-center text-slate-500">
        <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Coming soon</h3>
        <p className="max-w-md mx-auto">
          Enquiry tracking isn&apos;t live yet. Once it is, adventurer
          enquiries about your activities will appear here.
        </p>
      </div>
    </div>
  );
}
