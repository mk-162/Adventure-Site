import type { Metadata } from "next";
import Link from "next/link";
import { mountainBikingHub } from "@/data/activity-hubs/mountain-biking";
import { 
  Bike, 
  Backpack, 
  MapPin, 
  GraduationCap,
  ShoppingBag,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Getting Started with Mountain Biking in Wales | Beginner's Guide | Adventure Wales",
  description: "New to mountain biking? Everything you need to know to start riding in Wales. Bike types, essential gear, beginner-friendly trails, skills courses, and bike hire information.",
  openGraph: {
    title: "Getting Started with Mountain Biking in Wales",
    description: "Everything beginners need to know about mountain biking in Wales. Gear guide, best trails for first-timers, and where to learn.",
    images: ["/images/activities/mountain-biking-hero.jpg"],
  },
};

export default function GettingStartedMTBPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Getting Started with Mountain Biking", url: "/guides/getting-started-mountain-biking" },
  ]);

  // Beginner-friendly trail centres
  const beginnerCentres = mountainBikingHub.trailCentres.filter(
    (c) => c.grades.includes("green") || c.slug === "coed-llandegla"
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/activities/mountain-biking-hero.jpg')] bg-cover bg-center" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            Beginner's Guide
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Getting Started with Mountain Biking in Wales
          </h1>

          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Everything you need to know before your first ride. No jargon, no gatekeeping — just honest advice to get you on the trails.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/guides" className="hover:text-primary transition-colors">
              Guides
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary font-medium">Getting Started</li>
        </ol>
      </nav>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed">
            Wales is genuinely one of the best places in the world to learn mountain biking. Purpose-built trail centres with properly graded routes, excellent hire facilities, and trails designed to build your confidence progressively. Here's everything you need to know.
          </p>
        </div>
      </section>

      {/* What Bike Do You Need? */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Bike className="h-4 w-4" />
              Bike Types Explained
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              What Bike Do You Need?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't worry — you don't need to buy an expensive bike. Here's what each type is for.
            </p>
          </div>

          <div className="grid gap-6">
            {mountainBikingHub.gearGuide.bikeTypes.map((bike) => (
              <div
                key={bike.type}
                className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {bike.type}
                    </h3>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {bike.description}
                    </p>
                    <div className="text-sm px-3 py-1.5 bg-accent-hover/10 text-accent-hover rounded-full inline-block font-medium">
                      Best for: {bike.bestFor}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-primary/5 border-2 border-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-primary mb-2">Our recommendation for beginners</h4>
                <p className="text-gray-700">
                  Start by <strong>hiring a hardtail</strong> from a trail centre. It's cheaper, teaches you good technique, and lets you try mountain biking without committing thousands of pounds. Most centres offer quality hire bikes from £35-50/day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Gear */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Backpack className="h-4 w-4" />
              Essential Kit
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              What to Wear & Bring
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              You don't need specialist gear to start — just sensible clothing and a few essentials.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Must-Haves
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span><strong>Helmet</strong> — Non-negotiable. Trail centres won't let you ride without one.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span><strong>Gloves</strong> — Better grip, protection from blisters and brambles.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span><strong>Eye protection</strong> — Mud, flies, branches. Sunglasses or clear lenses work.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span><strong>Waterproof jacket</strong> — It's Wales. Pack one even if it's sunny.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span><strong>Water + snacks</strong> — Even short rides burn energy.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Good to Have
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span><strong>Knee pads</strong> — Your confidence will thank you. Recommended once you progress.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span><strong>Spare tube + pump</strong> — Hire bikes usually come with these, but check.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span><strong>Multi-tool</strong> — For adjusting saddle height, tightening bolts.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span><strong>Padded shorts</strong> — Not essential, but your backside will thank you after an hour.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 mb-2">What NOT to wear</h4>
                <p className="text-amber-900">
                  Avoid loose, flappy clothing that can catch on branches or your bike. Skip jeans (they get heavy when wet and restrict movement). Leave the AirPods at home — you need to hear what's around you on trails.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Trails for Beginners */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <MapPin className="h-4 w-4" />
              Where to Start
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              Best Trail Centres for Beginners
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These centres have green and blue trails perfect for first-timers, plus bike hire and good facilities.
            </p>
          </div>

          <div className="space-y-6">
            {beginnerCentres.map((centre) => (
              <div
                key={centre.slug}
                className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-primary">
                        {centre.name}
                      </h3>
                      {centre.slug === "coed-llandegla" && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          #1 for Beginners
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{centre.location}, {centre.region}</p>
                    <p className="text-gray-700 mb-3">{centre.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {centre.grades.map((grade) => (
                        <span
                          key={grade}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            grade === "green"
                              ? "bg-green-100 text-green-700"
                              : grade === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : grade === "red"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {grade}
                        </span>
                      ))}
                      {centre.hasBikeHire && (
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                          Bike Hire Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <div className="text-2xl font-bold text-primary mb-1">{centre.priceFrom}</div>
                    <div className="text-sm text-gray-500 mb-3">trail access</div>
                    {centre.website && (
                      <a
                        href={centre.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-accent-hover hover:text-primary font-medium"
                      >
                        Visit website
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Courses & Lessons */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <GraduationCap className="h-4 w-4" />
              Learn Properly
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              Skills Courses & Lessons
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A few hours with a coach will fast-track your progress more than months of self-teaching.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
            <div className="prose prose-lg max-w-none">
              <p>
                Every major trail centre in Wales offers coaching, from absolute beginner sessions to advanced skills. Expect to pay <strong>£50-80 for a half-day group session</strong> or <strong>£150-200 for 1-on-1 coaching</strong>.
              </p>
              
              <h3>What you'll learn in a beginner session:</h3>
              <ul>
                <li>Body position — the foundation of everything</li>
                <li>Braking technique — how to stop without going over the bars</li>
                <li>Cornering basics — leaning the bike, not your body</li>
                <li>Handling roots, rocks, and rough ground</li>
                <li>Building confidence on steeper sections</li>
              </ul>

              <h3>Where to book lessons:</h3>
              <ul>
                <li><strong>Coed Llandegla</strong> — Excellent beginner programme</li>
                <li><strong>BikePark Wales</strong> — Great for learning bike park skills</li>
                <li><strong>Coed y Brenin</strong> — Coaching available through local providers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bike Hire */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <ShoppingBag className="h-4 w-4" />
              Bike Hire
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              Renting a Bike
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every trail centre we recommend has quality hire bikes. Here's what to expect.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 text-center">
              <div className="text-3xl font-bold text-primary mb-2">£35-50</div>
              <div className="text-sm text-gray-600 mb-2">Hardtail / day</div>
              <p className="text-xs text-gray-500">Front suspension only. Great for beginners on green/blue trails.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 text-center">
              <div className="text-3xl font-bold text-primary mb-2">£50-70</div>
              <div className="text-sm text-gray-600 mb-2">Full-sus / day</div>
              <p className="text-xs text-gray-500">Front and rear suspension. Better for rougher terrain.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 text-center">
              <div className="text-3xl font-bold text-primary mb-2">£70-90</div>
              <div className="text-sm text-gray-600 mb-2">E-MTB / day</div>
              <p className="text-xs text-gray-500">Motor-assisted. Extends your range significantly.</p>
            </div>
          </div>

          <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6">
            <h4 className="font-bold text-primary mb-3">Tips for hiring:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Book in advance</strong> — especially for weekends and school holidays</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Tell them your height</strong> — they'll set up the bike for you</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Ask for a briefing</strong> — they'll show you how gears and brakes work</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Check what's included</strong> — helmet, pedals, and repair kit are usually standard</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* First-Time Tips */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Tips for Your First Ride
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="font-bold text-primary mb-3">Do</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Start on green trails — they exist for a reason</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Ride within your limits — there's no shame in walking sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Look where you want to go, not at obstacles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Take breaks — tiredness causes crashes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Yield to faster riders behind you</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="font-bold text-primary mb-3">Don't</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Skip straight to red trails — the grades exist for safety</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Grab the front brake hard — that's how you go over the bars</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Stop in the middle of trails — move to the side</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Ride alone on your first few times — go with friends or join a group</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Underestimate how tiring it is — start with a short loop</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Ride?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Check out our full mountain biking guide for trail centre details, maps, and more.
          </p>
          <Link
            href="/mountain-biking"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Explore Mountain Biking in Wales
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
