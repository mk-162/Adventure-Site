"use client";

import { ArrowRight, Mountain, Waves, Bike } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { ButtonLink } from "@/components/ui/button";
import { LAUNCH_REGIONS } from "@/lib/launch";

const heroImages = [
  "/images/wales/snowdon-mountain-2ab3d50c.jpg",
  "/images/wales/pembrokeshire-coast-wales-c17a15f1.jpg",
  "/images/wales/lake-snowdonia-d1b0cede.jpg",
  "/images/wales/welsh-hills-62834fea.jpg",
  "/images/wales/forest-snowdonia-a143e852.jpg",
];

interface HeroSectionProps {
  /** Count of published adventures within the launch-region scope (real data from page.tsx). */
  adventureCount: number;
}

export function HeroSection({ adventureCount }: HeroSectionProps) {
  const regionCount = LAUNCH_REGIONS.size;
  const stats = [
    { icon: Mountain, value: String(adventureCount), label: "Adventures" },
    { icon: Waves, value: String(regionCount), label: "Regions" },
    { icon: Bike, value: "54", label: "Trip Plans" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  const cycleImage = useCallback(() => {
    setTransitioning(true);
    setNextIndex((currentIndex + 1) % heroImages.length);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
      setTransitioning(false);
    }, 1000);
  }, [currentIndex]);

  useEffect(() => {
    // Start with random image
    const start = Math.floor(Math.random() * heroImages.length);
    setCurrentIndex(start);
    setNextIndex((start + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(cycleImage, 6000);
    return () => clearInterval(timer);
  }, [cycleImage]);

  return (
    <section className="relative overflow-hidden">
      {/* Background layers for crossfade */}
      <div className="relative min-h-[550px] sm:min-h-[600px] lg:min-h-[700px] flex items-end">
        {/* Current image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${heroImages[currentIndex]}')`,
            opacity: transitioning ? 0 : 1,
          }}
        />
        {/* Next image (fades in) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${heroImages[nextIndex]}')`,
            opacity: transitioning ? 1 : 0,
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 pb-28 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-accent-strong text-white text-sm font-bold rounded-full mb-4 shadow-lg">
                Adventure Wales
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Wales.
                <br />
                <span className="text-accent">Properly Wild.</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-200 max-w-2xl">
                {adventureCount} adventures. {regionCount} regions. Honest info on who it suits, what it costs, and what the locals know.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/itineraries" variant="primary" size="lg" className="shadow-xl hover:shadow-2xl">
                  Browse Itineraries
                  <ArrowRight className="h-5 w-5" />
                </ButtonLink>
                <ButtonLink
                  href="/destinations"
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:border-white/20 hover:bg-white/20 hover:text-white"
                >
                  Explore Regions
                </ButtonLink>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-6 sm:mt-10 hidden sm:flex gap-6 sm:gap-8 lg:gap-12">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-accent-strong" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="text-xs text-slate-300">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-4 right-4 sm:right-8 z-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setTransitioning(true);
                setNextIndex(i);
                setTimeout(() => {
                  setCurrentIndex(i);
                  setTransitioning(false);
                }, 1000);
              }}
              aria-label={`Show hero image ${i + 1} of ${heroImages.length}`}
              aria-current={i === currentIndex}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex
                  ? "bg-accent-strong w-6"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
