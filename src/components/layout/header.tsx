"use client";

import Link from "next/link";
import { useState } from "react";
import { Mountain, Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/activities", label: "Activities" },
  { href: "/plan", label: "Plan Your Trip" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-[#1e3a4c]" />
            <span className="font-bold text-xl text-[#1e3a4c]">Adventure Wales</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#1e3a4c] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-[#1e3a4c] transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-[#f97316] text-white text-sm font-medium rounded-full hover:bg-[#ea580c] transition-colors"
            >
              Book Now
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-gray-600 hover:text-[#1e3a4c] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-4 py-2 bg-[#f97316] text-white text-sm font-medium rounded-full hover:bg-[#ea580c] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
