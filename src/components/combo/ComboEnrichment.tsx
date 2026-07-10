import Link from "next/link";
import {
  Cloud,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  Calendar,
  ArrowRight,
  MapPin,
  Car,
  Bus,
} from "lucide-react";
import type { ComboPageData } from "@/lib/combo-data";
import { isLaunchCombo } from "@/lib/launch";
import { ComboSpotCard } from "./ComboSpotCard";
import { ComboMap } from "./ComboMap";
import { FAQAccordion } from "@/components/operators/FAQAccordion";
import { LocalTake } from "@/components/content/LocalTake";
import { TopTips } from "@/components/content/TopTips";
import { FeaturedExpert } from "@/components/content/FeaturedExpert";
import { HonestTruth } from "@/components/content/HonestTruth";
import { ImageCredit } from "@/components/content/ImageCredit";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import ReactMarkdown from "react-markdown";

interface ComboEnrichmentProps {
  data: ComboPageData;
  regionName: string;
}

export function ComboEnrichment({ data, regionName }: ComboEnrichmentProps) {
  const practicalInfo = data.practicalInfoNormalized;
  const hasMap = data.spots.some((s) => s.startPoint?.lat);
  const hasSpots = data.spots.length > 0;
  const hasTips = Boolean(data.tieredTips || (data.topTips && data.topTips.length > 0));
  const hasNeedToKnow = Boolean(
    practicalInfo &&
      (practicalInfo.weather ||
        practicalInfo.gearChecklist.length > 0 ||
        practicalInfo.gearHire.length > 0 ||
        practicalInfo.safetyNotes.length > 0 ||
        practicalInfo.gettingThere.driveTimes.length > 0 ||
        practicalInfo.gettingThere.publicTransport ||
        practicalInfo.gettingThere.parkingTips)
  );
  const hasFaqs = Boolean(data.faqs && data.faqs.length > 0);
  const hasWhatToDo = Boolean(data.editorial || data.introduction);

  const cafes = data.localDirectory?.cafes ?? [];
  const whereToEat = data.whereToEat && data.whereToEat.length > 0 ? data.whereToEat : null;
  const accommodation = data.localDirectory?.accommodation ?? [];
  const whereToStay = data.whereToStay && data.whereToStay.length > 0 ? data.whereToStay : null;

  const navLinks = [
    hasMap && { href: "#map", label: "Map" },
    hasWhatToDo && { href: "#what-to-do", label: "What to do" },
    hasSpots && { href: "#spots", label: "Spots" },
    hasTips && { href: "#tips", label: "Tips" },
    hasNeedToKnow && { href: "#need-to-know", label: "Need to know" },
    hasFaqs && { href: "#faqs", label: "FAQs" },
  ].filter((v): v is { href: string; label: string } => Boolean(v));

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Sticky jump-nav — only rendered chips point at sections that will actually render */}
      {navLinks.length > 1 && (
        <nav
          aria-label="Jump to section"
          className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 bg-white/85 backdrop-blur-sm border-b border-border overflow-x-auto no-scrollbar"
        >
          <div className="flex gap-2 w-max">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-primary/10 text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Quick Facts + Map — key facts and an interactive map right under the header */}
      <section id="map" className="scroll-mt-28">
        <SectionHeader title="Where to go" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <StatTile label="Best Season" value={data.bestSeason} />
          <StatTile label="Difficulty" value={data.difficultyRange} />
          <StatTile label="Price Range" value={data.priceRange} />
        </div>
        <ComboMap spots={data.spots} />
      </section>

      {/* What to do — editorial introduction, framed as the "how" section */}
      {hasWhatToDo && (
        <section id="what-to-do" className="scroll-mt-28">
          <SectionHeader title={`What to do: ${data.title}`} />
          <div className="max-w-3xl prose prose-slate">
            {data.editorial ? (
              <ReactMarkdown>{data.editorial}</ReactMarkdown>
            ) : (
              (data.introduction?.split("\n\n") ?? []).map((para, i) => (
                <p key={i} className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {para}
                </p>
              ))
            )}
          </div>
        </section>
      )}

      {/* Local Takes */}
      {data.localTakes && data.localTakes.length > 0 && (
        <section>
          {data.localTakes.map((take, index) => (
            <LocalTake key={index} {...take} />
          ))}
        </section>
      )}

      {/* Top Spots */}
      {hasSpots && (
        <section id="spots" className="scroll-mt-28">
          <SectionHeader
            title={`Best Spots for ${data.title}`}
            subtitle={`${data.spots.length} spots ranked by our team. Each one researched, visited, and honestly reviewed.`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.spots.map((spot, i) => (
              <ComboSpotCard key={spot.slug} spot={spot} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Top Tips — tiered (first timer / regular) or flat list */}
      {hasTips && (
        <section id="tips" className="scroll-mt-28">
          <SectionHeader title="Top Tips" />
          <TopTips
            tips={data.topTips || []}
            tieredTips={data.tieredTips}
          />
        </section>
      )}

      {/* Featured Expert */}
      {data.featuredExpert && (
        <section>
          <FeaturedExpert {...data.featuredExpert} />
        </section>
      )}

      {/* Honest Truth */}
      {data.honestTruth && (
        <section>
          <HonestTruth {...data.honestTruth} />
        </section>
      )}

      {/* Need to Know — practical info recovered from practicalInfoNormalized */}
      {hasNeedToKnow && practicalInfo && (
        <section id="need-to-know" className="scroll-mt-28">
          <SectionHeader title="Need to Know" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weather */}
            {practicalInfo.weather && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-blue-900 text-sm">Weather</h3>
                </div>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">{practicalInfo.weather}</p>
                {practicalInfo.weatherLinks && (
                  <div className="flex flex-wrap gap-2">
                    {practicalInfo.weatherLinks.map((link, i) => (
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

            {/* Safety */}
            {practicalInfo.safetyNotes.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-amber-900 text-sm">Safety</h3>
                </div>
                <ul className="space-y-1.5">
                  {practicalInfo.safetyNotes.map((note, i) => (
                    <li key={i} className="text-xs text-amber-800 leading-relaxed">• {note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Getting There — structured drive times + transport/parking */}
            {(practicalInfo.gettingThere.driveTimes.length > 0 ||
              practicalInfo.gettingThere.publicTransport ||
              practicalInfo.gettingThere.parkingTips) && (
              <div className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-primary text-sm">Getting There</h3>
                </div>

                {practicalInfo.gettingThere.driveTimes.length > 0 && (
                  <div className="mb-3 -mx-1">
                    <table className="w-full text-xs">
                      <tbody>
                        {practicalInfo.gettingThere.driveTimes.map((dt, i) => (
                          <tr key={i} className="border-b border-slate-100 last:border-0">
                            <td className="py-1.5 px-1 font-medium text-slate-700 whitespace-nowrap">{dt.from}</td>
                            <td className="py-1.5 px-1 text-slate-500 whitespace-nowrap">{dt.duration}</td>
                            <td className="py-1.5 px-1 text-slate-400">{dt.route}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {practicalInfo.gettingThere.publicTransport && (
                  <p className="text-xs text-slate-700 leading-relaxed mb-2 flex items-start gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{practicalInfo.gettingThere.publicTransport}</span>
                  </p>
                )}
                {practicalInfo.gettingThere.parkingTips && (
                  <p className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                    <Car className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{practicalInfo.gettingThere.parkingTips}</span>
                  </p>
                )}
              </div>
            )}

            {/* Gear Checklist */}
            {practicalInfo.gearChecklist.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-primary text-sm">Gear Checklist</h3>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {practicalInfo.gearChecklist.slice(0, 8).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                  {practicalInfo.gearChecklist.length > 8 && (
                    <p className="text-xs text-slate-400 mt-1">
                      +{practicalInfo.gearChecklist.length - 8} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Gear Hire — distinct from the checklist above */}
            {practicalInfo.gearHire.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="w-5 h-5 text-accent-strong" />
                  <h3 className="font-bold text-primary text-sm">Gear Hire Nearby</h3>
                </div>
                <div className="space-y-2">
                  {practicalInfo.gearHire.map((shop, i) => (
                    <div key={i} className="text-xs">
                      {shop.url ? (
                        <a
                          href={shop.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-accent-strong hover:underline"
                        >
                          {shop.name}
                        </a>
                      ) : (
                        <span className="font-semibold text-slate-700">{shop.name}</span>
                      )}
                      <span className="text-slate-500"> — {shop.location}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Where To Eat — real data lives at localDirectory.cafes (aliased from postActivitySpots) */}
      {(cafes.length > 0 || whereToEat) && (
        <section>
          <SectionHeader title="Where To Eat" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cafes.length > 0
              ? cafes.map((place, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border p-5">
                    <h3 className="font-bold text-primary text-base mb-2">{place.name}</h3>
                    <p className="text-xs text-slate-500 mb-3">{place.address}</p>
                    <p className="text-sm text-slate-700 mb-3 leading-relaxed">{place.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {place.knownFor && (
                        <div className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded">
                          Known for: {place.knownFor}
                        </div>
                      )}
                      {place.website && (
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-medium text-accent-strong hover:underline px-2 py-1"
                        >
                          Website →
                        </a>
                      )}
                    </div>
                  </div>
                ))
              : whereToEat!.map((place, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border p-5">
                    <h3 className="font-bold text-primary text-base mb-2">{place.name}</h3>
                    <p className="text-xs text-slate-500 mb-3">{place.location}</p>
                    <p className="text-sm text-slate-700 mb-3 leading-relaxed">{place.description}</p>
                    <div className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded">
                      Best for: {place.bestFor}
                    </div>
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* Where To Stay — real data lives at localDirectory.accommodation; falls back to legacy whereToStay */}
      {(accommodation.length > 0 || whereToStay) && (
        <section>
          <SectionHeader title="Where To Stay" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accommodation.length > 0
              ? accommodation.map((place, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border p-5">
                    <h3 className="font-bold text-primary text-base mb-1">{place.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">
                      {[place.type, place.priceRange].filter(Boolean).join(" • ")}
                    </p>
                    <p className="text-sm text-slate-700 mb-3 leading-relaxed">{place.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {place.nearestSpot && (
                        <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                          <MapPin className="w-3 h-3" />
                          {place.nearestSpot}
                        </div>
                      )}
                      {place.website && (
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-medium text-accent-strong hover:underline px-2 py-1"
                        >
                          Website →
                        </a>
                      )}
                    </div>
                  </div>
                ))
              : whereToStay!.map((place, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border p-5">
                    <h3 className="font-bold text-primary text-base mb-1">{place.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{place.location} • {place.priceRange}</p>
                    <p className="text-sm text-slate-700 mb-3 leading-relaxed">{place.description}</p>
                    <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                      {place.bestFor}
                    </div>
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* Local Gear Shops */}
      {data.localDirectory?.gearShops && data.localDirectory.gearShops.length > 0 && (
        <section>
          <SectionHeader title="Local Gear Shops" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.localDirectory.gearShops.map((shop, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-4">
                <h3 className="font-bold text-primary text-sm mb-1">{shop.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{shop.address}</p>
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">{shop.description}</p>
                <div className="flex gap-2">
                  {shop.website && (
                    <a href={shop.website} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-medium text-accent-strong hover:underline">Website</a>
                  )}
                  {shop.phone && (
                    <a href={`tel:${shop.phone}`}
                      className="text-xs font-medium text-primary hover:underline">{shop.phone}</a>
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
          <SectionHeader title="Events & Races" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.events.map((event, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-4 flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-strong/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-accent-strong" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-primary text-sm">{event.name}</h3>
                  <p className="text-xs text-slate-500 mb-1">
                    {event.monthTypical} • {event.type}
                    {event.registrationCost ? ` • £${event.registrationCost}` : ""}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2">{event.description}</p>
                  {event.website && (
                    <a href={event.website} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-medium text-accent-strong hover:underline mt-1 inline-block">More info →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQs */}
      {hasFaqs && (
        <section id="faqs" className="scroll-mt-28">
          <SectionHeader title="Frequently Asked Questions" />
          <div className="max-w-3xl">
            <FAQAccordion items={data.faqs!.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </section>
      )}

      {/* Nearby Alternatives */}
      {data.nearbyAlternatives && (
        (data.nearbyAlternatives.sameActivity ?? []).filter((alt) => isLaunchCombo(alt.regionSlug, data.activityTypeSlug)).length +
        (data.nearbyAlternatives.sameRegion ?? []).filter((alt) => isLaunchCombo(data.regionSlug, alt.activityTypeSlug)).length > 0
      ) && (
        <section>
          <SectionHeader title="Explore More" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.nearbyAlternatives.sameActivity?.filter((alt) => isLaunchCombo(alt.regionSlug, data.activityTypeSlug)).map((alt, i) => (
              <Link
                key={`sa-${i}`}
                href={`/${alt.regionSlug}/${data.activityTypeSlug}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-border p-4 hover:border-accent-strong hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">{alt.label}</p>
                  <p className="text-xs text-slate-500">Same activity, different region</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
            ))}
            {data.nearbyAlternatives.sameRegion?.filter((alt) => isLaunchCombo(data.regionSlug, alt.activityTypeSlug)).map((alt, i) => (
              <Link
                key={`sr-${i}`}
                href={`/${data.regionSlug}/${alt.activityTypeSlug}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-border p-4 hover:border-accent-strong hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-strong/10 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-accent-strong" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">{alt.label}</p>
                  <p className="text-xs text-slate-500">Same region, different activity</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Image Credits */}
      {data.imageCredits && data.imageCredits.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-primary mb-3">Image Credits</h2>
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            {data.imageCredits.map((credit, i) => (
              <ImageCredit
                key={i}
                photographer={credit.photographer}
                source={credit.source}
                sourceUrl={credit.sourceUrl}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
