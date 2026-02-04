"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mountain, Menu, X, Search, Heart, User } from "lucide-react";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/activities", label: "Activities" },
  { href: "/itineraries", label: "Itineraries" },
  { href: "/events", label: "Events" },
  { href: "/directory", label: "Directory" },
  { href: "/journal", label: "Journal" },
  { href: "/guides", label: "Guides" },
  { href: "/answers", label: "Answers" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => setUserLoggedIn(!!data.user))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-[#1e3a4c]" />
            <span className="font-bold text-xl text-[#1e3a4c]">Adventure Wales</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-[#1e3a4c] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/search" className="p-2 text-slate-500 hover:text-[#1e3a4c] transition-colors">
              <Search className="h-5 w-5" />
            </Link>
            {userLoggedIn ? (
              <Link href="/my-adventures" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1e3a4c] hover:bg-slate-50 rounded-lg transition-colors">
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                My Adventures
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-[#1e3a4c] transition-colors">
                Sign In
              </Link>
            )}
            <Link
              href="/book"
              className="px-5 py-2.5 bg-[#f97316] hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-orange-500/20"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${
            mobileMenuOpen ? "max-h-[400px]" : "max-h-0"
          }`}
        >
          <nav className="py-4 space-y-2 border-t border-slate-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-4 space-y-2">
              {userLoggedIn ? (
                <Link
                  href="/my-adventures"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  My Adventures
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block w-full py-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg text-center hover:bg-slate-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/book"
                className="block w-full py-3 bg-[#f97316] text-white text-sm font-bold rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
