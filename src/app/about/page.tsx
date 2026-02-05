import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Mountain, Heart, Users, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-medium">About</span>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            About Adventure Wales
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            We're on a mission to connect adventurers with the wildest, most unforgettable 
            experiences across Wales. From coastal clifftops to mountain peaks, we believe 
            everyone should discover what makes Wales one of Europe's greatest adventure playgrounds.
          </p>
        </div>

        {/* Mission Grid */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-accent-hover/10 rounded-xl flex items-center justify-center mb-4">
                <Mountain className="w-6 h-6 text-accent-hover" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Discover Adventures</h3>
              <p className="text-gray-600">
                We showcase the best adventure activities Wales has to offer, from iconic 
                experiences to hidden gems waiting to be explored.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-accent-hover/10 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-accent-hover" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Support Local</h3>
              <p className="text-gray-600">
                We partner with local operators and communities to ensure your adventures 
                support the people and places that make Wales special.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-accent-hover/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent-hover" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Plan with Ease</h3>
              <p className="text-gray-600">
                From detailed guides to real-time availability, we provide everything you 
                need to plan the perfect Welsh adventure with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Adventure Wales was born from a simple observation: Wales has some of the most 
                  spectacular outdoor adventures in Europe, yet they remained scattered and hard 
                  to discover for visitors and locals alike.
                </p>
                <p>
                  Founded by a team of outdoor enthusiasts who've explored every corner of Wales, 
                  we set out to create the definitive platform for Welsh adventure tourism. We've 
                  tramped through Snowdonia, coasteered in Pembrokeshire, surfed in Gower, and 
                  mountain biked through the Brecon Beacons.
                </p>
                <p>
                  Today, we work with hundreds of local operators, conservation groups, and tourism 
                  bodies to showcase responsible, sustainable adventures that celebrate Wales' 
                  natural beauty while supporting the communities that call it home.
                </p>
                <p className="text-primary font-semibold">
                  Whether you're planning your first visit or you're a seasoned adventurer looking 
                  for your next challenge, we're here to help you discover what makes Wales 
                  extraordinary.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/images/misc/about-mission-01-1704719c.jpg"
                alt="Welsh mountain landscape"
                width={300}
                height={400}
                className="rounded-2xl object-cover w-full h-64"
              />
              <Image
                src="/images/misc/about-mission-02-69d52bb0.jpg"
                alt="Coastal adventure"
                width={300}
                height={400}
                className="rounded-2xl object-cover w-full h-64 mt-8"
              />
              <Image
                src="/images/misc/about-mission-03-b1ffb8cd.jpg"
                alt="Mountain biking"
                width={300}
                height={400}
                className="rounded-2xl object-cover w-full h-64 -mt-4"
              />
              <Image
                src="/images/misc/about-mission-04-81049f2f.jpg"
                alt="Hiking adventure"
                width={300}
                height={400}
                className="rounded-2xl object-cover w-full h-64 mt-4"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8 text-center">What We Stand For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">🏔️</span>
              </div>
              <h3 className="font-bold text-primary mb-2">Authenticity</h3>
              <p className="text-sm text-gray-600">Real experiences, vetted operators, honest reviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">🌱</span>
              </div>
              <h3 className="font-bold text-primary mb-2">Sustainability</h3>
              <p className="text-sm text-gray-600">Protecting Wales for future generations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">🤝</span>
              </div>
              <h3 className="font-bold text-primary mb-2">Community</h3>
              <p className="text-sm text-gray-600">Supporting local businesses and culture</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">✨</span>
              </div>
              <h3 className="font-bold text-primary mb-2">Excellence</h3>
              <p className="text-sm text-gray-600">Curating only the finest adventures</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-primary to-[#2a5570] rounded-2xl p-8 lg:p-12 text-white text-center">
            <Users className="w-12 h-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              We're a passionate group of adventurers, outdoor instructors, writers, and Wales 
              enthusiasts dedicated to helping you discover incredible experiences.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <Image
                    src={`/images/misc/about-team-0${num}-${
                      ['c29ed376', '546f0443', '82b6ebeb', '37c31b8b', 'edbea1da'][num - 1]
                    }.jpg`}
                    alt={`Team member ${num}`}
                    width={120}
                    height={120}
                    className="rounded-xl object-cover w-full h-32 mb-3"
                  />
                  <div className="text-sm font-medium">Team Member</div>
                  <div className="text-xs opacity-75">Adventure Expert</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse hundreds of experiences across Wales and find your next unforgettable journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/activities"
              className="px-8 py-3 bg-accent-hover text-white font-semibold rounded-xl hover:bg-[#ea6a0a] transition-colors"
            >
              Explore Activities
            </Link>
            <Link
              href="/destinations"
              className="px-8 py-3 bg-white text-primary font-semibold rounded-xl border-2 border-primary hover:bg-primary hover:text-white transition-colors"
            >
              Browse Destinations
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: "About Us | Adventure Wales",
  description: "Learn about Adventure Wales - our mission to connect adventurers with unforgettable experiences across Wales, from Snowdonia to Pembrokeshire.",
};
