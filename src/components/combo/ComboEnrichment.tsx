import Link from "next/link";
import {
  Cloud,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  Calendar,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  MapPin,
} from "lucide-react";
import type { ComboPageData } from "@/lib/combo-data";
import { ComboSpotCard } from "./ComboSpotCard";
import { FAQAccordion } from "@/components/operators/FAQAccordion";

interface ComboEnrichmentProps {
  data: ComboPageData;
  regionName: string;
}

export function ComboEnrichment({ data, regionName }: ComboEnrichmentProps) {
  const spotsWithCoords = data.spots.filter((s) => s.startPoint?.lat);

  return (
    <div className="space-y-10">
      {/* Editorial Introduction */}
      <section>
        <div className="bg-gradient-to-br from-[#1e3a4c] to-[#2d5a73] rounded-2xl p-6 sm:p-8 text-white">
          <p className="text-lg sm:text-xl leading-relaxed text-white/90 font-light">
            {data.strapline}
          </p>
        </div>
        <div className="mt-6 prose prose-slate max-w-none">
          {data.introduction.split("\n\n").map((para, i) => (
            <p key={i} className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Quick Facts */}
      <section>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-lg font-bold text-[#1e3a4c]">{data.bestSeason}</div>
            <div className="text-xs text-gray-500 mt-1">Best Season</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-lg font-bold text-[#1e3a4c]">{data.difficultyRange}</div>
            <div className="text-xs text-gray-500 mt-1">Difficulty</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-lg font-bold text-[#1e3a4c]">{data.priceRange}</div>
            <div className="text-xs text-gray-500 mt-1">Price Range</div>
          </div>
        </div>
      </section>

      {/* Top Spots */}
      {data.spots.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a4c] mb-2">
            Best Spots for {data.title}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {data.spots.length} spots ranked by our team. Each one researched, visited, and honestly reviewed.
          </p>

          {/* Map with spot pins */}
          {spotsWithCoords.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#ea580c]" />
                <span className="text-sm font-semibold text-[#1e3a4c]">
                  {spotsWithCoords.length} spots on the map
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {spotsWithCoords.map((spot, i) => (
                  <a
                    key={i}
                    href={`https://www.google.com/maps/dir/?api=1&destination=${spot.startPoint!.lat},${spot.startPoint!.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#1e3a4c] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 truncate">{spot.name}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400 ml-auto shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.spots.map((spot, i) => (
              <ComboSpotCard key={spot.slug} spot={spot} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Practical Info */}
      {data.practicalInfo && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a4c] mb-6">
            Need to Know
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weather */}
            {data.practicalInfo.weather && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-blue-900 text-sm">Weather</h3>
                </div>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">{data.practicalInfo.weather}</p>
                {data.practicalInfo.weatherLinks && (
                  <div className="flex flex-wrap gap-2">
                    {data.practicalInfo.weatherLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-1 rounded"
                      >
                        {link.name} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Gear Checklist */}
            {data.practicalInfo.gearChecklist && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="w-5 h-5 text-[#1e3a4c]" />
                  <h3 className="font-bold text-[#1e3a4c] text-sm">Gear Checklist</h3>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {data.practicalInfo.gearChecklist.slice(0, 8).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                  {data.practicalInfo.gearChecklist.length > 8 && (
                    <p className="text-xs text-gray-400 mt-1">
                      +{data.practicalInfo.gearChecklist.length - 8} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Safety */}
            {data.practicalInfo.safetyNotes && data.practicalInfo.safetyNotes.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-amber-900 text-sm">Safety</h3>
                </div>
                <ul className="space-y-1.5">
                  {data.practicalInfo.safetyNotes.map((note, i) => (
                    <li key={i} className="text-xs text-amber-800 leading-relaxed">• {note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Transport / Parking */}
            {(data.practicalInfo.transportNotes || data.practicalInfo.parkingNotes) && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-[#1e3a4c]" />
                  <h3 className="font-bold text-[#1e3a4c] text-sm">Getting There</h3>
                </div>
                {data.practicalInfo.transportNotes && (
                  <p className="text-xs text-gray-700 leading-relaxed mb-2">{data.practicalInfo.transportNotes}</p>
                )}
                {data.practicalInfo.parkingNotes && (
                  <p className="text-xs text-gray-700 leading-relaxed">{data.practicalInfo.parkingNotes}</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Local Gear Shops */}
      {data.localDirectory?.gearShops && data.localDirectory.gearShops.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Local Gear Shops</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.localDirectory.gearShops.map((shop, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-[#1e3a4c] text-sm mb-1">{shop.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{shop.address}</p>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{shop.description}</p>
                <div className="flex gap-2">
                  {shop.website && (
                    <a href={shop.website} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-medium text-[#ea580c] hover:underline">Website</a>
                  )}
                  {shop.phone && (
                    <a href={`tel:${shop.phone}`}
                      className="text-xs font-medium text-[#1e3a4c] hover:underline">{shop.phone}</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Events */}
      {data.events && data.events.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Events & Races</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.events.map((event, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#ea580c]/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#ea580c]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#1e3a4c] text-sm">{event.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">
                    {event.monthTypical} • {event.type}
                    {event.registrationCost ? ` • £${event.registrationCost}` : ""}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
                  {event.website && (
                    <a href={event.website} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-medium text-[#ea580c] hover:underline mt-1 inline-block">More info →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQs */}
      {data.faqs && data.faqs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={data.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </section>
      )}

      {/* Nearby Alternatives */}
      {data.nearbyAlternatives && (
        <section>
          <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Explore More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.nearbyAlternatives.sameActivity?.map((alt, i) => (
              <Link
                key={`sa-${i}`}
                href={`/${alt.regionSlug}/things-to-do/${data.activityTypeSlug}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:border-[#ea580c] hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1e3a4c]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#1e3a4c]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1e3a4c] text-sm">{alt.label}</p>
                  <p className="text-xs text-gray-500">Same activity, different region</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            ))}
            {data.nearbyAlternatives.sameRegion?.map((alt, i) => (
              <Link
                key={`sr-${i}`}
                href={`/${data.regionSlug}/things-to-do/${alt.activityTypeSlug}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:border-[#ea580c] hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#ea580c]/10 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-[#ea580c]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1e3a4c] text-sm">{alt.label}</p>
                  <p className="text-xs text-gray-500">Same region, different activity</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
