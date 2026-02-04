"use client";

import { useState } from "react";

interface ScenicGalleryProps {
  regionSlug: string;
  regionName: string;
}

// Map region slugs to their available Wales scenery images
const regionImageMap: Record<string, string[]> = {
  "snowdonia": [
    "forest-snowdonia-03e2d44d",
    "forest-snowdonia-051a18ff",
    "forest-snowdonia-16dd5b53",
    "lake-snowdonia-23b3d602",
    "lake-snowdonia-32cca616",
    "lake-snowdonia-45c73d25",
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
  ],
  "pembrokeshire": [
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
};

export function ScenicGallery({ regionSlug, regionName }: ScenicGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Get images for this region
  const imageHashes = regionImageMap[regionSlug];
  
  // If no images available for this region, don't render
  if (!imageHashes || imageHashes.length === 0) {
    return null;
  }

  const images = imageHashes.slice(0, 6).map(hash => ({
    src: `/images/wales/${hash}.jpg`,
    alt: `${regionName} scenic view`,
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
