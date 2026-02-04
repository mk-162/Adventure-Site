"use client";

import { useState } from "react";

interface PageImageStripProps {
  images: { src: string; alt: string }[];
  /** Number of images to show (default 3 on mobile, 5 on desktop) */
  maxImages?: number;
  /** Layout style */
  variant?: "strip" | "grid" | "feature";
}

/**
 * Reusable image strip/grid for static pages.
 * Uses archive images (1024px) — good for inline use, not heroes.
 */
export function PageImageStrip({ images, maxImages = 5, variant = "strip" }: PageImageStripProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const visibleImages = images.slice(0, maxImages);

  if (visibleImages.length === 0) return null;

  if (variant === "feature") {
    // Large feature image + smaller thumbnails
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-8">
          <button
            onClick={() => setSelectedImage(visibleImages[0].src)}
            className="md:col-span-2 relative aspect-[16/9] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img
              src={visibleImages[0].src}
              alt={visibleImages[0].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {visibleImages.slice(1, 3).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img.src)}
                className="relative aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
        <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
      </>
    );
  }

  if (variant === "grid") {
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-8">
          {visibleImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img.src)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
        <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
      </>
    );
  }

  // Default: horizontal scroll strip
  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory my-8">
        {visibleImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img.src)}
            className="relative flex-shrink-0 w-56 h-36 rounded-2xl overflow-hidden snap-start group cursor-pointer"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </button>
        ))}
      </div>
      <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
}

function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300 z-10"
        onClick={onClose}
      >
        ×
      </button>
      <img src={src} alt="" className="max-w-full max-h-full object-contain rounded-2xl" />
    </div>
  );
}
