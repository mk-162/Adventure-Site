"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  BookOpen, 
  MessageCircle, 
  Play, 
  Home,
  ChevronRight,
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Wind,
  Bookmark,
  Share2,
  ExternalLink,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface WeatherData {
  temp: number;
  condition: "sunny" | "cloudy" | "rainy" | "mixed";
  wind: number;
  location: string;
}

interface HubSidebarProps {
  navItems: NavItem[];
  primaryCTA?: {
    label: string;
    href: string;
    variant?: "accent" | "primary";
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  weather?: WeatherData;
  activityType: string;
}

export function HubSidebar({
  navItems,
  primaryCTA,
  secondaryCTA,
  weather,
  activityType,
}: HubSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [navItems]);

  const weatherIcon = {
    sunny: <Sun className="w-5 h-5 text-amber-500" />,
    cloudy: <Cloud className="w-5 h-5 text-slate-400" />,
    rainy: <CloudRain className="w-5 h-5 text-blue-500" />,
    mixed: <Cloud className="w-5 h-5 text-slate-500" />,
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <aside className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Jump Navigation */}
        <nav className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            On This Page
          </h3>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-accent-hover/10 text-accent-hover font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Weather Widget */}
        {weather && (
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border border-blue-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-primary">Current Conditions</h3>
              {weatherIcon[weather.condition]}
            </div>
            <p className="text-xs text-slate-500 mb-3">{weather.location}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">{weather.temp}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">{weather.wind} mph</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {weather.condition === "rainy" 
                ? "Trails may be muddy — check centre status"
                : weather.condition === "sunny"
                ? "Great riding conditions today!"
                : "Variable conditions — pack layers"}
            </p>
          </div>
        )}

        {/* Primary CTA */}
        {primaryCTA && (
          <Link
            href={primaryCTA.href}
            className={`block w-full text-center py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
              primaryCTA.variant === "accent"
                ? "bg-accent-hover hover:bg-accent text-white shadow-accent-hover/30"
                : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
            }`}
          >
            {primaryCTA.label}
          </Link>
        )}

        {/* Secondary CTA */}
        {secondaryCTA && (
          <Link
            href={secondaryCTA.href}
            className="block w-full text-center py-3 px-4 rounded-xl font-medium border-2 border-slate-200 text-primary hover:border-accent-hover hover:text-accent-hover transition-colors"
          >
            {secondaryCTA.label}
          </Link>
        )}

        {/* Save & Share */}
        <div className="flex gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-colors ${
              saved
                ? "bg-accent-hover/10 border-accent-hover text-accent-hover"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{saved ? "Saved" : "Save"}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href={`/directory?activity=${activityType}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-accent-hover transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Find {activityType} operators
              </Link>
            </li>
            <li>
              <Link
                href={`/itineraries?activity=${activityType}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-accent-hover transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Trip itineraries
              </Link>
            </li>
            <li>
              <Link
                href={`/journal?tag=${activityType}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-accent-hover transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Read articles
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
