"use client";

import Link from "next/link";
import { ArrowRight, Mountain, Waves, Bike } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const heroImages = [
  "/images/wales/snowdon-mountain-2ab3d50c.jpg",
  "/images/wales/pembrokeshire-coast-wales-c17a15f1.jpg",
  "/images/wales/lake-snowdonia-d1b0cede.jpg",
  "/images/wales/welsh-hills-62834fea.jpg",
  "/images/wales/forest-snowdonia-a143e852.jpg",
];

const stats = [
  { icon: Mountain, value: "78", label: "Adventures" },
  { icon: Waves, value: "12", label: "Regions" },
  { icon: Bike, value: "54", label: "Trip Plans" },
];

export function HeroSection() {
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
        <div className="relative z-10 w-full px-4 sm:px-6 pb-20 sm:pb-16 lg:pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-[#f97316] text-white text-sm font-bold rounded-full mb-4 shadow-lg">
                Adventure Wales
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Wales.
                <br />
                <span className="text-[#f97316]">Properly Wild.</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-200 max-w-2xl">
                78 adventures. 11 regions. Honest info on who it suits, what it costs, and what the locals know.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/itineraries"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Find Your Adventure
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/destinations"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all backdrop-blur-sm border border-white/20"
                >
                  Explore Regions
                </Link>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-6 sm:mt-10 flex gap-6 sm:gap-8 lg:gap-12">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-[#f97316]" />
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
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-[#f97316] w-6"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
