"use client";

import { useState } from "react";
import Image from "next/image";

interface ActivityGalleryProps {
  activityType: string;
  activityName: string;
}

// Map activity types to their available image variants (02-06)
// Hashes must match actual filenames in public/images/activities/
const activityImageMap: Record<string, string[]> = {
  "caving": ["02-458228b9", "03-fb4d036f", "04-8d6bb2da", "05-95ef7683", "06-70411151"],
  "climbing": ["02-c2c33740", "03-769d8444", "04-a6c69ad4", "05-62ff29a8", "06-a0eb9a7d"],
  "coasteering": ["02-519a34c0", "03-b5583981", "04-16568470", "05-d7153020", "06-d7bec2a8"],
  "gorge-walking": ["02-0027dfcc", "03-6eada4af", "04-d40b6bff", "05-507fc51c", "06-956385b9"],
  "hiking": ["03-96151002", "04-2bf15ed9", "05-c7cb2f1e", "06-74fc1189"],
  "kayaking": ["02-570fb957", "03-bcd19dc4", "04-ba6d1e33", "05-758c3658", "06-656475f5"],
  "mountain-biking": ["02-1fe6646f", "03-ce257a7c", "04-63e4b2e0", "05-ebb64387", "06-f0231015"],
  "paddleboarding": ["02-30a88c24", "03-02927bb8", "04-c0cf2a01", "05-46f4408f", "06-f35e1c4d"],
  "rafting": ["02-0d9b00f9", "03-3b5d5ae0", "04-bd3fe82b", "05-ed393aad", "06-e544a7c2"],
  "surfing": ["02-1ef1420b", "03-fc8506a1", "04-9bfdc377", "05-1b64a41d", "06-74705f6a"],
  "wild-swimming": ["02-bc83a30d", "03-9c4fdbe0", "04-aaaffc2e", "05-9ded1f48", "06-d4165348"],
  "zip-lining": ["02-dad94e84", "03-b56e3ec0", "04-534600ba", "05-d5ecfeb3", "06-15cc8072"],
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
