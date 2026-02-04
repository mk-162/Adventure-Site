"use client";

import { useState } from "react";

interface ScenicGalleryProps {
  regionSlug: string;
  regionName: string;
}

// Map region slugs to their available Wales scenery images
// All images are 1024px wide — good for gallery cards, not hero use
const regionImageMap: Record<string, string[]> = {
  "snowdonia": [
    "snowdonia-wales-0ad36185",
    "snowdonia-wales-2bf15ed9",
    "snowdonia-wales-3b76ed92",
    "snowdon-mountain-2ab3d50c",
    "snowdon-mountain-4997ac2d",
    "snowdon-mountain-6eb72608",
    "lake-snowdonia-23b3d602",
    "lake-snowdonia-32cca616",
    "lake-snowdonia-45c73d25",
    "lake-snowdonia-46ac5853",
    "lake-snowdonia-d1b0cede",
    "forest-snowdonia-03e2d44d",
    "forest-snowdonia-051a18ff",
    "forest-snowdonia-16dd5b53",
    "forest-snowdonia-a143e852",
  ],
  "brecon-beacons": [
    "brecon-beacons-wales-006ad4da",
    "brecon-beacons-wales-026bc5ef",
    "brecon-beacons-wales-02e1b6aa",
    "brecon-beacons-wales-2e5757f1",
    "brecon-beacons-wales-3867e203",
    "brecon-beacons-wales-3a321c1f",
    "brecon-beacons-wales-6ef1d107",
    "brecon-beacons-wales-9773e61e",
    "brecon-beacons-wales-9f0192a8",
    "brecon-beacons-wales-f573f58d",
    "lake-brecon-beacons-54ac108d",
  ],
  "pembrokeshire": [
    "pembrokeshire-coast-wales-0b0c464a",
    "pembrokeshire-coast-wales-999c9c39",
    "pembrokeshire-coast-wales-a1f8290c",
    "pembrokeshire-coast-wales-a7080336",
    "pembrokeshire-coast-wales-b330e7ab",
    "pembrokeshire-coast-wales-c17a15f1",
    "pembrokeshire-coast-wales-c472fe0a",
    "coastline-pembrokeshire-9a5f734c",
    "coastline-pembrokeshire-a7080336",
    "coastline-pembrokeshire-b3e35c66",
    "coastline-pembrokeshire-bcd19dc4",
    "coastline-pembrokeshire-e1ff0c28",
  ],
  "anglesey": [
    "coastline-anglesey-875a66e9",
    "coastline-anglesey-984dc908",
    "forest-anglesey-5fc54215",
  ],
  "gower": [
    "coastline-gower-0c5bbf8d",
    "coastline-gower-3ae7c613",
    "coastline-gower-7ad36ae6",
  ],
  "llyn-peninsula": [
    "lake-llyn-peninsula-c7e24e36",
    "coastline-wales-general-031eae54",
    "coastline-wales-general-64b7570a",
  ],
  "north-wales": [
    "forest-north-wales-1989c47f",
    "welsh-mountains-06c2efc9",
    "welsh-mountains-26173bb9",
    "welsh-mountains-44039d03",
    "welsh-mountains-54d670ae",
    "snowdon-mountain-a70c9990",
  ],
  "south-wales": [
    "coastline-south-wales-ee1e192a",
    "forest-south-wales-68421665",
    "wales-countryside-057777c4",
    "wales-countryside-7d64fae9",
    "welsh-hills-3f8b64d9",
    "welsh-hills-70a933bd",
  ],
  "mid-wales": [
    "wales-countryside-0d2c487f",
    "wales-countryside-43fe41e0",
    "wales-countryside-935946ac",
    "wales-countryside-cad6c0c4",
    "welsh-hills-62834fea",
    "welsh-hills-6e3b8ab1",
    "welsh-hills-898e370e",
    "welsh-hills-d26ed079",
    "welsh-hills-f178426d",
  ],
  "wye-valley": [
    "forest-wales-general-23566f6d",
    "forest-wales-general-42ecb76c",
    "forest-wales-general-4893ebdd",
    "forest-wales-general-59a2ebfa",
    "forest-wales-general-8995ed27",
    "forest-wales-general-e1912fd6",
  ],
  "carmarthenshire": [
    "wales-countryside-057777c4",
    "wales-countryside-7d64fae9",
    "welsh-hills-3f8f4985",
    "welsh-hills-d58b93a9",
    "forest-wales-general-6c0e6318",
    "forest-wales-general-92c9a64d",
  ],
  "ceredigion": [
    "coastline-wales-general-114b4c86",
    "coastline-wales-general-744c078b",
    "coastline-wales-general-9b5511ff",
    "coastline-wales-general-9d0bd7c6",
    "coastline-wales-general-b66d7aa6",
    "coastline-wales-general-fe909719",
  ],
};

// General fallback pool for regions without specific images
const generalPool = [
  "lake-wales-general-6320223c",
  "lake-wales-general-6dc6f657",
  "lake-wales-general-aac8c5fb",
  "lake-wales-general-ddb450aa",
  "waterfall-wales-general-a4bba64c",
  "forest-wales-general-b4f8b06f",
];

export function ScenicGallery({ regionSlug, regionName }: ScenicGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Get images for this region, fall back to general pool
  const imageHashes = regionImageMap[regionSlug] ?? generalPool;
  
  // If no images available, don't render
  if (!imageHashes || imageHashes.length === 0) {
    return null;
  }

  // Show up to 6 images in the grid
  const images = imageHashes.slice(0, 6).map((hash, idx) => ({
    src: `/images/wales/${hash}.jpg`,
    alt: `${regionName} scenic view ${idx + 1}`,
  }));

  return (
    <>
      <section className="mb-8 lg:mb-10">
        <h3 className="text-lg lg:text-xl font-bold mb-4 text-[#1e3a4c]">
          Discover {regionName}
        </h3>
        
        {/* Grid gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(image.src)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300 z-10"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt={regionName}
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>
      )}
    </>
  );
}
