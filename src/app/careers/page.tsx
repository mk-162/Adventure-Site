import Link from "next/link";
import { ChevronRight, Briefcase, Heart, Users, Compass, MapPin, Mail, TrendingUp, Award } from "lucide-react";

export default function CareersPage() {
  const openRoles = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Cardiff / Remote",
      type: "Full-time",
      description: "Build and scale our platform connecting adventurers with experiences across Wales."
    },
    {
      title: "Content & SEO Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Create compelling content about Welsh adventures and optimize our discoverability."
    },
    {
      title: "Partnership Manager",
      department: "Business Development",
      location: "Wales-based",
      type: "Full-time",
      description: "Build relationships with activity operators and tourism organizations across Wales."
    },
    {
      title: "Customer Success Lead",
      department: "Support",
      location: "Cardiff / Remote",
      type: "Full-time",
      description: "Ensure travelers have amazing experiences from booking through to adventure completion."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Adventure",
      description: "We love the outdoors and believe everyone should experience Wales' incredible landscapes."
    },
    {
      icon: Users,
      title: "Community First",
      description: "We support local operators, respect the environment, and build lasting relationships."
    },
    {
      icon: Compass,
      title: "Continuous Exploration",
      description: "We're always learning, experimenting, and finding better ways to serve our community."
    },
    {
      icon: TrendingUp,
      title: "Sustainable Growth",
      description: "We balance ambitious goals with responsibility to people, planet, and partners."
    }
  ];

  const perks = [
    "🏔️ Annual adventure budget (£500) to explore Wales",
    "💻 Remote-friendly with flexible hours",
    "🌴 25 days holiday + bank holidays",
    "🏥 Private health insurance",
    "📚 Learning & development budget",
    "🚀 Equity options for early team members",
    "☕ Monthly team adventures & socials",
    "🧘 Wellness allowance",
    "📱 Latest tech & equipment",
    "🌱 Pension contribution matching"
  ];

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-medium">Careers</span>
        </div>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-accent-hover/10 px-4 py-2 rounded-full text-accent-hover font-medium text-sm mb-6">
            <Briefcase className="w-4 h-4" />
            We're Hiring!
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Join the Adventure Wales Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us build the platform that connects adventurers with unforgettable 
            experiences across Wales. We're a small, passionate team with big ambitions.
          </p>
        </div>

        {/* Why Join Us */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8 text-center">
            Why Join Adventure Wales?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
                <div className="w-14 h-14 bg-accent-hover/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-accent-hover" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
                Building Something Special
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We're an early-stage startup on a mission to transform how people discover and 
                  book outdoor adventures in Wales. We launched in 2023 and we're already working 
                  with dozens of operators across the country.
                </p>
                <p>
                  As a small team, everyone's voice matters. You'll have real ownership, direct 
                  impact, and the chance to shape the product, culture, and direction of the company.
                </p>
                <p>
                  We're backed by tourism-focused investors and grant funding, giving us the runway 
                  to build sustainably while staying true to our mission of supporting local 
                  operators and sustainable tourism.
                </p>
                <p className="text-primary font-semibold">
                  If you love the outdoors, believe in technology's power to connect people, and 
                  want to be part of something from the ground up, we'd love to hear from you.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-[#2a5570] rounded-2xl p-8 text-white">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2">12</div>
                <div className="opacity-90">Team Members</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold mb-1">50+</div>
                  <div className="text-sm opacity-90">Partner Operators</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">500+</div>
                  <div className="text-sm opacity-90">Activities Listed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">£2M+</div>
                  <div className="text-sm opacity-90">Booked Value</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">5.0★</div>
                  <div className="text-sm opacity-90">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Perks & Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8 text-center">
            Perks & Benefits
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {perks.map((perk, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-hover/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-accent-hover" />
                  </div>
                  <span className="text-gray-700">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8 text-center">
            Open Positions
          </h2>
          <div className="space-y-4">
            {openRoles.map((role, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-accent-hover transition-all p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-2">{role.title}</h3>
                    <p className="text-gray-600 mb-3">{role.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        {role.department}
                      </span>
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {role.location}
                      </span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {role.type}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`mailto:careers@adventurewales.co.uk?subject=Application: ${role.title}`}
                    className="px-6 py-3 bg-accent-hover text-white font-semibold rounded-xl hover:bg-[#ea6a0a] transition-colors whitespace-nowrap text-center"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* No Perfect Match */}
        <section className="bg-primary/5 rounded-2xl p-8 lg:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
              Don't See the Perfect Role?
            </h2>
            <p className="text-gray-600 mb-6">
              We're always looking for talented people who share our passion for adventure and 
              technology. If you think you'd be a great fit for Adventure Wales, we'd love to 
              hear from you.
            </p>
            <a
              href="mailto:careers@adventurewales.co.uk?subject=General Application"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-[#2a5570] transition-colors"
            >
              <Mail className="w-5 h-5" />
              Send Us Your CV
            </a>
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8 text-center">
            Our Hiring Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-hover text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="font-bold text-primary mb-2">Apply</h3>
              <p className="text-sm text-gray-600">
                Send your CV and cover letter explaining why you're excited about Adventure Wales
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-hover text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="font-bold text-primary mb-2">Initial Call</h3>
              <p className="text-sm text-gray-600">
                30-minute chat to learn about you and answer your questions about the role
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-hover text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="font-bold text-primary mb-2">Meet the Team</h3>
              <p className="text-sm text-gray-600">
                In-depth interviews with team members and a practical exercise or case study
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-hover text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                4
              </div>
              <h3 className="font-bold text-primary mb-2">Decision</h3>
              <p className="text-sm text-gray-600">
                We aim to make decisions within a week and provide feedback to all candidates
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-primary to-[#2a5570] rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Adventure?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Help us build the future of adventure tourism in Wales. Browse open roles or get in touch 
            to learn more about Adventure Wales.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:careers@adventurewales.co.uk"
              className="px-8 py-3 bg-accent-hover text-white font-semibold rounded-xl hover:bg-[#ea6a0a] transition-colors"
            >
              Get in Touch
            </a>
            <Link
              href="/about"
              className="px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Learn About Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Careers | Adventure Wales",
  description: "Join the Adventure Wales team. Help us build the platform connecting adventurers with unforgettable experiences across Wales.",
};
