import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, Compass, Lightbulb, MapPin } from "lucide-react";
import { getRegionBySlug, getAllRegions, getAnswers } from "@/lib/queries";

type Props = {
  params: Promise<{ region: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = await getRegionBySlug(regionSlug);

  if (!region) {
    return { title: "Tips | Adventure Wales" };
  }

  return {
    title: `Tips for ${region.name} | Adventure Wales`,
    description: `Local tips, insider advice, and practical information for visiting ${region.name}, Wales.`,
    openGraph: {
      title: `Tips for ${region.name} | Adventure Wales`,
      description: `Local tips, insider advice, and practical information for visiting ${region.name}, Wales.`,
      type: "website",
      locale: "en_GB",
      url: `https://adventurewales.co.uk/${regionSlug}/tips`,
      siteName: "Adventure Wales",
    },
    alternates: {
      canonical: `https://adventurewales.co.uk/${regionSlug}/tips`,
    },
  };
}

export default async function RegionTipsPage({ params }: Props) {
  const { region: regionSlug } = await params;
  const region = await getRegionBySlug(regionSlug);

  if (!region) {
    notFound();
  }

  // Try to fetch answers related to this region
  const answers = await getAnswers({ regionId: region.id, limit: 10 });
  const allRegions = await getAllRegions();
  const otherRegions = allRegions.filter(r => r.slug !== regionSlug).slice(0, 6);

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${regionSlug}`} className="hover:text-[#1e3a4c]">{region.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1e3a4c] font-medium">Tips</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-[#1e3a4c] mb-3">
            Tips for {region.name}
          </h1>
          <p className="text-gray-600 text-base lg:text-lg">
            Local advice, practical tips, and insider knowledge for your {region.name} adventure.
          </p>
        </header>

        {/* Show answers if we have them */}
        {answers.length > 0 ? (
          <div className="space-y-4 mb-10">
            {answers.map((item) => (
              <Link
                key={item.answer.id}
                href={`/answers/${item.answer.slug}`}
                className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-[#1e3a4c]/30 hover:shadow-md transition-all"
              >
                <div className="shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5 text-[#ea580c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1e3a4c] group-hover:text-[#ea580c] transition-colors mb-1">
                    {item.answer.question}
                  </h3>
                  {item.answer.quickAnswer && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.answer.quickAnswer}</p>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#ea580c] shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#1e3a4c]/5 to-[#ea580c]/5 rounded-2xl p-8 lg:p-12 text-center border border-gray-200 mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ea580c]/10 mb-6">
              <Compass className="w-8 h-8 text-[#ea580c]" />
            </div>
            <h2 className="text-2xl font-black text-[#1e3a4c] mb-3">
              Tips for {region.name} coming soon
            </h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto mb-8">
              We&apos;re putting together the best local tips and insider advice for visiting {region.name}. In the meantime, check out our answers section or explore other regions.
            </p>
          </div>
        )}

        {/* Browse more */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
          <h3 className="text-lg font-bold text-[#1e3a4c] mb-4">Explore more</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {otherRegions.map((r) => (
              <Link
                key={r.slug}
                href={`/${r.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 hover:border-[#1e3a4c]/30 hover:shadow-sm transition-all text-sm font-medium text-[#1e3a4c]"
              >
                <MapPin className="w-3 h-3" />
                {r.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/answers"
              className="inline-flex items-center justify-center gap-2 bg-[#1e3a4c] text-white font-bold py-3 px-6 rounded-full hover:bg-[#2d5568] transition-colors"
            >
              Browse All Answers
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${regionSlug}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1e3a4c] font-bold py-3 px-6 rounded-full border border-gray-200 hover:border-[#1e3a4c]/30 transition-colors"
            >
              Back to {region.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
