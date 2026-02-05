import Link from "next/link";
import { getAllRegions, getAllActivityTypes } from "@/lib/queries";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Sparkles,
  ChevronRight,
  Heart,
  Mountain,
  Waves,
  TreePine,
  Bike,
  Camera,
  Tent
} from "lucide-react";

const interestIcons: Record<string, any> = {
  hiking: Mountain,
  water: Waves,
  nature: TreePine,
  cycling: Bike,
  photography: Camera,
  camping: Tent,
};

export default async function TripPlannerPage() {
  const [regions, activityTypes] = await Promise.all([
    getAllRegions(),
    getAllActivityTypes()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e3a4c] to-[#1e3a4c]/90 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white/80 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Trip Planning
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Build Your Trip
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Dates, region, interests, group size. We'll match you to the right adventures and build a route that works.
          </p>
        </div>

        {/* Planner Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Steps */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {["Dates", "Region", "Interests", "Review"].map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? "bg-[#ea580c] text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`ml-2 text-sm hidden sm:inline ${
                    i === 0 ? "text-[#1e3a4c] font-medium" : "text-gray-400"
                  }`}>
                    {step}
                  </span>
                  {i < 3 && <ChevronRight className="w-4 h-4 text-gray-300 mx-2 hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Step 1: Dates */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#ea580c]" />
                When are you visiting?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a4c] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a4c] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-gray-500 mr-2">Quick select:</span>
                {["Weekend", "1 Week", "2 Weeks"].map(opt => (
                  <button 
                    key={opt}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-[#1e3a4c]/10 rounded-full transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Region */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#ea580c]" />
                Where do you want to go?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {regions.slice(0, 6).map(region => (
                  <button
                    key={region.id}
                    className="relative h-24 rounded-xl overflow-hidden group border-2 border-transparent hover:border-[#ea580c] transition-all"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('/images/regions/${region.slug}-hero.jpg')` }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                      {region.name}
                    </span>
                  </button>
                ))}
              </div>
              <button className="mt-3 text-sm text-[#1e3a4c] font-medium hover:underline">
                + Show all regions
              </button>
            </section>

            {/* Step 3: Interests */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#ea580c]" />
                What are you interested in?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activityTypes.slice(0, 9).map(type => (
                  <button
                    key={type.id}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#ea580c] hover:bg-[#ea580c]/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#1e3a4c]/10 flex items-center justify-center text-[#1e3a4c]">
                      <Mountain className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-[#1e3a4c] text-sm">{type.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 4: Group */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ea580c]" />
                Who's coming?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Solo", "Couple", "Family", "Group"].map(opt => (
                  <button
                    key={opt}
                    className="p-4 rounded-xl border border-gray-200 hover:border-[#ea580c] hover:bg-[#ea580c]/5 transition-all font-medium text-[#1e3a4c]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>

            {/* Generate Button */}
            <button className="w-full bg-[#ea580c] hover:bg-[#ea580c]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ea580c]/30 transition-all flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate My Itinerary
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Free to use • No account required
            </p>
          </div>
        </div>

        {/* Sample Itineraries */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">Or start with a template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Weekend Adventure", duration: "3 days", region: "Snowdonia" },
              { title: "Family Explorer", duration: "5 days", region: "Pembrokeshire" },
              { title: "Adrenaline Rush", duration: "4 days", region: "North Wales" },
            ].map(template => (
              <Link
                key={template.title}
                href="/itineraries"
                className="bg-white/10 backdrop-blur rounded-xl p-4 hover:bg-white/20 transition-colors"
              >
                <h3 className="font-bold text-white">{template.title}</h3>
                <p className="text-white/60 text-sm">{template.duration} • {template.region}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Trip Planner | Adventure Wales",
  description: "Build a Welsh adventure trip matched to your dates, group, and interests. Real routes with drive times, booking tips, and weather backup plans.",
};
