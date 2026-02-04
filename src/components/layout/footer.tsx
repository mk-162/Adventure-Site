import Link from "next/link";
import { Mountain, Facebook, Instagram, Twitter, Camera, Mail, Globe } from "lucide-react";

const footerLinks = {
  destinations: [
    { href: "/snowdonia", label: "Snowdonia" },
    { href: "/pembrokeshire", label: "Pembrokeshire" },
    { href: "/brecon-beacons", label: "Brecon Beacons" },
    { href: "/anglesey", label: "Anglesey" },
  ],
  activities: [
    { href: "/activities?type=hiking", label: "Hiking" },
    { href: "/activities?type=coasteering", label: "Coasteering" },
    { href: "/activities?type=mountain-biking", label: "Mountain Biking" },
    { href: "/activities?type=kayaking", label: "Kayaking" },
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/advertise", label: "List Your Business" },
    { href: "/auth/login", label: "Provider Login" },
    { href: "/press", label: "Press" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white pt-12 sm:pt-16 pb-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="h-6 w-6 text-[#1e3a4c]" />
              <span className="text-lg font-bold text-[#1e3a4c]">Adventure Wales</span>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Honest info on Welsh adventures. Who it suits, what it costs, and what the locals know.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-[#1e3a4c] transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-[#1e3a4c] transition-colors">
                <Camera className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-[#1e3a4c] transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#1e3a4c]">Destinations</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              {footerLinks.destinations.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#1e3a4c] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#1e3a4c]">Activities</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              {footerLinks.activities.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#1e3a4c] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#1e3a4c]">Support</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#1e3a4c] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#1e3a4c]">Company</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#1e3a4c] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Adventure Wales. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#1e3a4c] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#1e3a4c] transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-[#1e3a4c] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
