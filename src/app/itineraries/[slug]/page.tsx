import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { 
  ChevronRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Mountain, 
  Download,
  Share2,
  Heart,
  CheckCircle,
  Car,
  Utensils,
  Bed,
  Flag,
  Users
} from "lucide-react";

interface ItineraryFrontmatter {
  slug: string;
  title: string;
  tagline?: string;
  region: string;
  duration_days: number;
  difficulty: string;
  best_season?: string;
  price_estimate_from?: number;
  price_estimate_to?: number;
}

interface DaySection {
  dayNumber: number;
  title: string;
  items: DayItem[];
}

interface DayItem {
  type: "activity" | "travel" | "stay" | "dinner" | "other";
  timeOfDay?: string;
  title: string;
  description: string;
}

// Parse YAML frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: ItineraryFrontmatter; body: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n*([\s\S]*)$/);
  if (!match) return null;

  const yamlContent = match[1];
  const body = match[2];
  
  const frontmatter: Record<string, any> = {};
  yamlContent.split("\n").forEach(line => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      value = value.replace(/^["'](.*)["']$/, "$1");
      if (!isNaN(Number(value)) && value !== "") {
        frontmatter[key] = Number(value);
      } else {
        frontmatter[key] = value;
      }
    }
  });

  return { frontmatter: frontmatter as ItineraryFrontmatter, body };
}

// Parse markdown body into structured sections
function parseItineraryBody(body: string): { intro: string; days: DaySection[]; costs: string[]; tips: string[] } {
  const lines = body.split("\n");
  const intro: string[] = [];
  const days: DaySection[] = [];
  const costs: string[] = [];
  const tips: string[] = [];
  
  let currentSection: "intro" | "day" | "costs" | "tips" = "intro";
  let currentDay: DaySection | null = null;
  let currentItem: DayItem | null = null;
  let inCosts = false;
  let inTips = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for Day headers (## Day N: Title)
    const dayMatch = line.match(/^## Day (\d+)[:\s]*(.*)$/i);
    if (dayMatch) {
      if (currentDay) days.push(currentDay);
      currentDay = {
        dayNumber: parseInt(dayMatch[1]),
        title: dayMatch[2] || `Day ${dayMatch[1]}`,
        items: []
      };
      currentSection = "day";
      continue;
    }

    // Check for Estimated Costs section
    if (line.match(/^## Estimated Costs/i)) {
      if (currentDay) {
        days.push(currentDay);
        currentDay = null;
      }
      inCosts = true;
      inTips = false;
      continue;
    }

    // Check for Tips section
    if (line.match(/^## Tips/i)) {
      if (currentDay) {
        days.push(currentDay);
        currentDay = null;
      }
      inCosts = false;
      inTips = true;
      continue;
    }

    // Parse cost table rows
    if (inCosts && line.startsWith("|") && !line.includes("---")) {
      const parts = line.split("|").map(p => p.trim()).filter(p => p);
      if (parts.length >= 2 && parts[0] !== "Item") {
        costs.push(`${parts[0]}: ${parts[1]}`);
      }
      continue;
    }

    // Parse tips as list items
    if (inTips && line.startsWith("-")) {
      tips.push(line.slice(1).trim());
      continue;
    }

    // Parse day items
    if (currentDay && currentSection === "day") {
      // Check for time of day headers (### Morning, ### Afternoon, etc.)
      const timeMatch = line.match(/^### (Morning|Afternoon|Evening)/i);
      if (timeMatch) {
        continue; // We'll extract time from Activity headers
      }

      // Check for Activity/Stay/Travel markers
      if (line.startsWith("**Activity:**")) {
        currentItem = {
          type: "activity",
          title: line.replace("**Activity:**", "").trim(),
          description: ""
        };
        currentDay.items.push(currentItem);
        continue;
      }

      if (line.startsWith("**Stay:**")) {
        currentItem = {
          type: "stay",
          title: line.replace("**Stay:**", "").trim(),
          description: ""
        };
        currentDay.items.push(currentItem);
        continue;
      }

      if (line.startsWith("**Travel:**")) {
        currentItem = {
          type: "travel",
          title: "Travel",
          description: line.replace("**Travel:**", "").trim()
        };
        currentDay.items.push(currentItem);
        continue;
      }

      if (line.startsWith("**Dinner suggestion:**")) {
        currentItem = {
          type: "dinner",
          title: "Dinner",
          description: line.replace("**Dinner suggestion:**", "").trim()
        };
        currentDay.items.push(currentItem);
        continue;
      }

      // Add description lines to current item
      if (currentItem && line.trim() && !line.startsWith("#") && !line.startsWith("---")) {
        currentItem.description += (currentItem.description ? " " : "") + line.trim();
      }
    }

    // Intro paragraph
    if (currentSection === "intro" && line.trim() && !line.startsWith("#")) {
      intro.push(line.trim());
    }
  }

  if (currentDay) days.push(currentDay);

  return { 
    intro: intro.join(" "), 
    days, 
    costs: costs.filter(c => !c.toLowerCase().includes("total")),
    tips 
  };
}

function getItinerary(slug: string): { frontmatter: ItineraryFrontmatter; intro: string; days: DaySection[]; costs: string[]; tips: string[] } | null {
  const filePath = path.join(process.cwd(), "content", "itineraries", `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const parsed = parseFrontmatter(content);
  
  if (!parsed) return null;

  const { intro, days, costs, tips } = parseItineraryBody(parsed.body);

  return { 
    frontmatter: parsed.frontmatter,
    intro,
    days,
    costs,
    tips
  };
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy": return "bg-green-100 text-green-700 border-green-200";
    case "moderate": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "challenging":
    case "hard": return "bg-orange-100 text-orange-700 border-orange-200";
    case "extreme": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function formatRegionName(slug: string): string {
  return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function getItemIcon(type: string) {
  switch (type) {
    case "activity": return <Flag className="w-5 h-5" />;
    case "travel": return <Car className="w-5 h-5" />;
    case "stay": return <Bed className="w-5 h-5" />;
    case "dinner": return <Utensils className="w-5 h-5" />;
    default: return <CheckCircle className="w-5 h-5" />;
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ItineraryDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = getItinerary(slug);

  if (!data) {
    notFound();
  }

  const { frontmatter, intro, days, costs, tips } = data;

  return (
    <div className="min-h-screen pt-4 lg:pt-6 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 lg:mb-6">
          <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/itineraries" className="hover:text-[#1e3a4c]">Itineraries</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1e3a4c] font-medium truncate">{frontmatter.title}</span>
        </div>

        {/* Hero Section */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-6 lg:mb-10 group h-[300px] sm:h-[400px] lg:h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('/images/regions/${frontmatter.region}-hero.jpg')` }}
          />

          {/* Duration Badge */}
          <div className="absolute top-4 right-4 bg-[#1e3a4c] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20">
            {frontmatter.duration_days} DAY{frontmatter.duration_days > 1 ? "S" : ""}
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 lg:p-10 z-20">
            {/* Info Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {formatRegionName(frontmatter.region)}
              </span>
              <span className={`backdrop-blur-md text-xs sm:text-sm font-semibold px-3 py-1 rounded-full border ${getDifficultyColor(frontmatter.difficulty)}`}>
                <Mountain className="w-4 h-4 inline mr-1" />
                {frontmatter.difficulty.charAt(0).toUpperCase() + frontmatter.difficulty.slice(1)}
              </span>
              {frontmatter.best_season && (
                <span className="hidden sm:flex bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {frontmatter.best_season}
                </span>
              )}
            </div>

            <h1 className="text-white text-2xl sm:text-3xl lg:text-5xl font-black leading-tight mb-2 lg:mb-3">
              {frontmatter.title}
            </h1>
            {frontmatter.tagline && (
              <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-2xl">
                {frontmatter.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Row (mobile) */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex justify-between divide-x divide-gray-200">
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-bold text-[#1e3a4c]">{days.reduce((sum, d) => sum + d.items.filter(i => i.type === "activity").length, 0)}</span>
              <span className="text-xs text-gray-500 uppercase">Activities</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-bold text-[#1e3a4c]">{frontmatter.duration_days - 1}</span>
              <span className="text-xs text-gray-500 uppercase">Nights</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-bold text-[#1e3a4c]">
                £{frontmatter.price_estimate_from || "TBC"}
              </span>
              <span className="text-xs text-gray-500 uppercase">From</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10">
            {/* Intro */}
            {intro && (
              <section className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed">{intro}</p>
              </section>
            )}

            {/* Day-by-Day Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e3a4c]">Daily Itinerary</h2>
                <button className="hidden sm:flex items-center gap-1 text-[#1e3a4c] hover:text-[#1e3a4c]/80 font-medium text-sm">
                  Download PDF <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Timeline */}
              <div className="relative pl-2">
                {/* Connecting Line */}
                <div className="absolute left-[27px] top-4 bottom-16 w-[2px] bg-gray-200 hidden sm:block" />

                {days.map((day, dayIndex) => (
                  <div key={day.dayNumber} className="mb-8">
                    {/* Day Header */}
                    <div className="bg-[#f97316]/10 rounded-xl p-4 mb-6 flex items-start gap-4">
                      <div className="bg-[#f97316] text-white font-bold text-lg h-12 w-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                        {String(day.dayNumber).padStart(2, "0")}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[#1e3a4c]">{day.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {day.items.filter(i => i.type === "activity").length} activit{day.items.filter(i => i.type === "activity").length === 1 ? "y" : "ies"}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Items */}
                    <div className="space-y-6 sm:space-y-8 ml-0 sm:ml-2">
                      {day.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="relative sm:grid sm:grid-cols-[56px_1fr] sm:gap-4">
                          <div className="hidden sm:flex flex-col items-center z-10">
                            <div className={`size-14 rounded-full bg-white border-2 flex items-center justify-center shadow-sm ${
                              item.type === "activity" ? "border-[#1e3a4c] text-[#1e3a4c]" : "border-gray-200 text-gray-400"
                            }`}>
                              {getItemIcon(item.type)}
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="sm:hidden text-[#1e3a4c]">{getItemIcon(item.type)}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                item.type === "activity" ? "bg-[#1e3a4c]/10 text-[#1e3a4c]" : 
                                item.type === "stay" ? "bg-blue-50 text-blue-700" :
                                item.type === "dinner" ? "bg-orange-50 text-orange-700" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                              </span>
                            </div>
                            <h4 className="font-bold text-[#1e3a4c] mb-2">{item.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips Section */}
            {tips.length > 0 && (
              <section className="bg-[#1e3a4c]/5 rounded-xl p-6 border border-[#1e3a4c]/10">
                <h3 className="font-bold text-lg text-[#1e3a4c] mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#f97316]" />
                  Planning Tips
                </h3>
                <ul className="space-y-3">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-[#f97316] mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-sm text-gray-500 mb-1">From</span>
                  <span className="text-3xl font-bold text-[#1e3a4c]">
                    £{frontmatter.price_estimate_from || "TBC"}
                  </span>
                  <span className="text-sm text-gray-500 mb-1">per person</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Select Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[#1e3a4c] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Guests</label>
                    <select className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[#1e3a4c]">
                      <option>1 Guest</option>
                      <option selected>2 Guests</option>
                      <option>3-4 Guests</option>
                      <option>5+ Guests</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#f97316]/30 transition-all active:scale-95 mb-4">
                  Enquire Now
                </button>
                <p className="text-center text-xs text-gray-400">No payment required today</p>
              </div>

              {/* Cost Breakdown */}
              {costs.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                  <h3 className="font-bold text-lg text-[#1e3a4c] mb-4">Estimated Costs</h3>
                  <div className="space-y-3">
                    {costs.map((cost, i) => {
                      const [label, value] = cost.split(":");
                      return (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-500">{label}</span>
                          <span className="font-medium text-[#1e3a4c]">{value}</span>
                        </div>
                      );
                    })}
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-[#1e3a4c]">
                        ~£{frontmatter.price_estimate_from}
                        {frontmatter.price_estimate_to && frontmatter.price_estimate_to !== frontmatter.price_estimate_from && (
                          <span> - £{frontmatter.price_estimate_to}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Support */}
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[#1e3a4c]/5 border border-[#1e3a4c]/10">
                <Users className="w-5 h-5 text-[#1e3a4c]" />
                <a href="/contact" className="text-sm font-bold text-[#1e3a4c] hover:underline">
                  Speak to an expert
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Bar (mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button className="flex flex-col items-center justify-center w-14 gap-1 text-gray-500 hover:text-[#1e3a4c] transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Share</span>
          </button>
          <button className="flex flex-col items-center justify-center w-14 gap-1 text-gray-500 hover:text-[#1e3a4c] transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Save</span>
          </button>
          <button className="flex-1 bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 shadow-lg shadow-[#f97316]/20 transition-all active:scale-95">
            <span>Enquire</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">
              From £{frontmatter.price_estimate_from || "TBC"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all itineraries
export async function generateStaticParams() {
  const itinerariesDir = path.join(process.cwd(), "content", "itineraries");
  
  if (!fs.existsSync(itinerariesDir)) {
    return [];
  }

  const files = fs.readdirSync(itinerariesDir).filter(f => f.endsWith(".md"));
  
  return files.map(file => ({
    slug: file.replace(".md", "")
  }));
}

// Generate metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = getItinerary(slug);
  
  if (!data) {
    return { title: "Itinerary Not Found" };
  }

  return {
    title: `${data.frontmatter.title} | Adventure Wales`,
    description: data.frontmatter.tagline || `${data.frontmatter.duration_days}-day adventure in ${formatRegionName(data.frontmatter.region)}`,
  };
}
