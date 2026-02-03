import Link from "next/link";
import { Mountain, Facebook, Instagram, Twitter } from "lucide-react";

const footerLinks = {
  destinations: [
    { href: "/snowdonia", label: "Snowdonia" },
    { href: "/pembrokeshire", label: "Pembrokeshire" },
    { href: "/brecon-beacons", label: "Brecon Beacons" },
    { href: "/anglesey", label: "Anglesey" },
    { href: "/gower", label: "Gower" },
  ],
  activities: [
    { href: "/activities/hiking", label: "Hiking & Walking" },
    { href: "/activities/coasteering", label: "Coasteering" },
    { href: "/activities/surfing", label: "Surfing" },
    { href: "/activities/mountain-biking", label: "Mountain Biking" },
    { href: "/activities/kayaking", label: "Kayaking" },
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "/contact", label: "Contact Us" },
    { href: "/booking-terms", label: "Booking Terms" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/sitemap", label: "Sitemap" },
  ],
  about: [
    { href: "/about", label: "Our Story" },
    { href: "/sustainable", label: "Sustainable Tourism" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
    { href: "/partners", label: "Partners" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1e3a4c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Mountain className="h-8 w-8 text-white" />
              <span className="font-bold text-xl">Adventure Wales</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Connecting you with the best outdoor experiences Wales has to offer. Locally curated, sustainably minded.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Destinations</h3>
            <ul className="space-y-2">
              {footerLinks.destinations.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Activities</h3>
            <ul className="space-y-2">
              {footerLinks.activities.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2025 Adventure Wales. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
