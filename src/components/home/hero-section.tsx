"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

// Available homepage hero images
const heroImages = [
  "/images/misc/homepage-hero-01-09087a8a.jpg",
  "/images/misc/homepage-hero-02-b5069db7.jpg",
  "/images/misc/homepage-hero-03-355a010f.jpg",
  "/images/misc/homepage-hero-04-6a86aa0d.jpg",
  "/images/misc/homepage-hero-05-a11e63e5.jpg",
];

export function HeroSection() {
  // Pick a random hero image on mount
  const [heroImage, setHeroImage] = useState(heroImages[0]);

  useEffect(() => {
    const randomImage = heroImages[Math.floor(Math.random() * heroImages.length)];
    setHeroImage(randomImage);
  }, []);

  return (
    <section className="relative">
      <div 
        className="relative min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] flex items-center justify-center bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(30, 58, 76, 0.4), rgba(0, 0, 0, 0.7)), url('${heroImage}')`,
        }}
      >
        <div className="text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
            Your Welsh Adventure Starts Here
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto drop-shadow-lg">
            Discover the wildest corners of Wales, from Snowdonia's misty peaks to Pembrokeshire's rugged coast.
          </p>
          <div className="mt-8">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1e3a4c] hover:bg-[#1e3a4c]/90 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Start Exploring
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
