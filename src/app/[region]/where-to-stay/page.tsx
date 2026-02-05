import { notFound } from "next/navigation";
import { getRegionBySlug, getAccommodationByRegion } from "@/lib/queries";
import { AccommodationCard } from "@/components/cards/accommodation-card";

interface AccommodationPageProps {
  params: Promise<{ region: string }>;
}

export default async function AccommodationPage({ params }: AccommodationPageProps) {
  const { region: regionSlug } = await params;
  const region = await getRegionBySlug(regionSlug);

  if (!region) {
    notFound();
  }

  const accommodation = await getAccommodationByRegion(regionSlug);

  const types = ["All", "Hostel", "Bunkhouse", "Hotel", "B&B", "Camping", "Activity Centre"];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-white/70 text-sm mb-4">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">›</span>
            <a href={`/${regionSlug}`} className="hover:text-white">{region.name}</a>
            <span className="mx-2">›</span>
            <span className="text-white">Where to Stay</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Where to Stay in {region.name}
          </h1>
          <p className="text-white/80">
            Adventure-friendly accommodation from hostels to hotels
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {types.map((type, i) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  i === 0
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">
            Showing {accommodation.length} properties
          </p>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accommodation.map((item) => (
            <AccommodationCard
              key={item.accommodation.id}
              accommodation={item.accommodation}
              region={item.region}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
