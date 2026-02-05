import Link from "next/link";
import fs from "fs";
import path from "path";
import { AlertTriangle, Mountain, Waves, Cloud, Bike } from "lucide-react";
import { Newsletter } from "@/components/commercial/Newsletter";

interface SafetyGuide {
  slug: string;
  title: string;
  description: string;
}

const iconMap: Record<string, React.ReactNode> = {
  "mountain-safety": <Mountain className="w-8 h-8" />,
  "water-safety": <Waves className="w-8 h-8" />,
  "weather-safety": <Cloud className="w-8 h-8" />,
  "cycling-safety": <Bike className="w-8 h-8" />,
  "coasteering-safety": <Waves className="w-8 h-8" />,
};

function getSafetyGuides(): SafetyGuide[] {
  const guides: SafetyGuide[] = [];
  const safetyDir = path.join(process.cwd(), "content", "safety");

  if (fs.existsSync(safetyDir)) {
    const files = fs.readdirSync(safetyDir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(safetyDir, file), "utf-8");
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const descMatch = content.match(/^#.+\n\n([^\n]+)/m);
      guides.push({
        slug: file.replace(".md", ""),
        title: titleMatch?.[1] || file.replace(".md", "").replace(/-/g, " "),
        description: descMatch?.[1] || "",
      });
    }
  }

  return guides;
}

export default function SafetyPage() {
  const guides = getSafetyGuides();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-[#1e3a4c] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="w-10 h-10 text-[#ea580c]" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Safety Information
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Essential safety guidance for outdoor adventures in Wales
          </p>
        </div>
      </section>

      {/* Emergency Info */}
      <section className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                Emergency: 999
              </div>
              <span className="text-red-800">
                Ask for Mountain Rescue or Coastguard where appropriate
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Safety Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/safety/${guide.slug}`}
              className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-[#ea580c] transition-all"
            >
              <div className="text-[#1e3a4c] mb-4">
                {iconMap[guide.slug] || <AlertTriangle className="w-8 h-8" />}
              </div>
              <h3 className="text-lg font-semibold text-[#1e3a4c] mb-2">
                {guide.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>

        {/* General Safety Tips */}
        <section className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#1e3a4c] mb-6">
            General Safety Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#1e3a4c] mb-2">Before You Go</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Check weather forecasts</li>
                <li>• Tell someone your plans and expected return time</li>
                <li>• Ensure you have appropriate gear and clothing</li>
                <li>• Check your equipment is in good condition</li>
                <li>• Know your limits and fitness level</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#1e3a4c] mb-2">While Out</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Carry a fully charged phone</li>
                <li>• Bring a map and know how to use it</li>
                <li>• Take food, water, and emergency supplies</li>
                <li>• Be prepared to turn back if conditions worsen</li>
                <li>• Follow local signage and guidance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <Newsletter source="safety" />
      </div>
    </div>
  );
}
