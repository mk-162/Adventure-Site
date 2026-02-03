import { getOperators, getAllRegions, getAllActivityTypes } from "@/lib/queries";
import { OperatorCard } from "@/components/cards/operator-card";
import { ButtonLink } from "@/components/ui/button";

export default async function DirectoryPage() {
  const [operators, regions, activityTypes] = await Promise.all([
    getOperators({ limit: 50 }),
    getAllRegions(),
    getAllActivityTypes(),
  ]);

  // Separate featured (premium) from regular
  const featuredOperators = operators.filter((op) => op.claimStatus === "premium");
  const regularOperators = operators.filter((op) => op.claimStatus !== "premium");

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-[#1e3a4c] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-white/70 text-sm mb-4">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">›</span>
            <span className="text-white">Directory</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Adventure Operators
          </h1>
          <p className="text-white/80">
            Find and book with trusted local providers
          </p>

          {/* Search */}
          <div className="mt-6">
            <input
              type="search"
              placeholder="Search operators..."
              className="w-full max-w-md px-4 py-3 rounded-lg text-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>All Regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </select>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>All Activities</option>
              {activityTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Rating: Any</option>
              <option>4+ Stars</option>
              <option>4.5+ Stars</option>
            </select>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Operators */}
        {featuredOperators.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[#1e3a4c] mb-6 flex items-center gap-2">
              Featured Partners
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Partner
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredOperators.map((operator) => (
                <OperatorCard
                  key={operator.id}
                  operator={operator}
                  variant="featured"
                />
              ))}
            </div>
          </section>
        )}

        {/* All Operators */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1e3a4c]">
              All Operators
            </h2>
            <p className="text-gray-500 text-sm">
              Showing {operators.length} operators
            </p>
          </div>

          <div className="space-y-4">
            {regularOperators.map((operator) => (
              <OperatorCard key={operator.id} operator={operator} />
            ))}
          </div>
        </section>

        {/* Claim CTA */}
        <section className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-[#1e3a4c] mb-2">
            Own a business in Wales?
          </h3>
          <p className="text-gray-600 mb-4">
            Claim your free listing and reach thousands of adventure travelers
          </p>
          <ButtonLink href="/directory/claim" variant="accent">
            Claim Your Listing
          </ButtonLink>
        </section>
      </div>
    </div>
  );
}
