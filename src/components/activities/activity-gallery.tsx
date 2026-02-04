"use client";

import { useState } from "react";
import Image from "next/image";

interface ActivityGalleryProps {
  activityType: string;
  activityName: string;
}

// Map activity types to their available image variants (02-06)
const activityImageMap: Record<string, string[]> = {
  "caving": ["02-458228b9", "03-fb4d036f", "04-8d6bb2da", "05-95ef7683", "06-70411151"],
  "climbing": ["02-c2c33740", "03-769d8444", "04-a6c69ad4", "05-62ff29a8", "06-a0eb9a7d"],
  "coasteering": ["02-519a34c0", "03-b5583981", "04-16568470", "05-d7153020", "06-d7bec2a8"],
  "gorge-walking": ["02-0027dfcc", "03-6eada4af", "04-d40b6bff", "05-507fc51c", "06-956385b9"],
  "hiking": ["03-96151002", "04-2bf15ed9", "05-1e5e40a8", "06-9adf25a1"],
  "kayaking": ["02-1b66c481", "03-4cb19f2e", "04-adb4e9d4", "05-8c5a55d6", "06-75668089"],
  "mountain-biking": ["02-ba0e05f3", "03-c6bd4224", "04-a41f5e71", "05-55dd5fa1", "06-64667a58"],
  "paddleboarding": ["02-4feef19e", "03-02ee8e16", "04-85bfb699", "05-e7ebb5c1", "06-49f63f7a"],
  "rafting": ["02-eeb02f03", "03-3d53b9c3", "04-3f1a3a87", "05-5dd5e8e0", "06-ed56f9a3"],
  "sea-kayaking": ["02-b8c3488e", "03-bd1d7972", "04-f3e03b4b", "05-f5f6d68b", "06-5bb4d7be"],
  "surfing": ["02-13d8e17d", "03-2eb01a36", "04-93a9799a", "05-e8e4889a", "06-ce23bdf2"],
  "wild-swimming": ["02-61ec5bb0", "03-1e69e3d0", "04-e2e9fa43", "05-7d16e08c", "06-4b25a481"],
  "zip-lining": ["02-c95e3c79", "03-b4da79fa", "04-7984cf3d", "05-c0eeff29", "06-72ed6f3b"],
};

export function ActivityGallery({ activityType, activityName }: ActivityGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Get images for this activity type
  const imageHashes = activityImageMap[activityType];
  
  // If no images available for this activity type, don't render
  if (!imageHashes || imageHashes.length === 0) {
    return null;
  }

  const images = imageHashes.map(hash => ({
    src: `/images/activities/${activityType}-${hash}.jpg`,
    alt: `${activityName} - Image ${hash.split('-')[0]}`,
  }));

  return (
    <>
      <section className="py-8">
        <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">
          Photo Gallery
        </h2>
        
        {/* Horizontal scrollable gallery */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(image.src)}
              className="relative flex-shrink-0 w-64 h-40 rounded-2xl overflow-hidden snap-start group cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt={activityName}
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>
      )}
    </>
  );
}
