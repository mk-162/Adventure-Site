"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface AdCreative {
  imageUrl: string;
  linkUrl: string;
  altText: string;
}

interface AdSlotProps {
  slotName: string;
  pageType: string;
  pageSlug?: string;
  fallback?: React.ReactNode;
  className?: string;
}

export function AdSlot({
  slotName,
  pageType,
  pageSlug,
  fallback,
  className,
}: AdSlotProps) {
  const [creative, setCreative] = useState<AdCreative | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAd() {
      try {
        const params = new URLSearchParams({
          name: slotName,
          pageType,
          ...(pageSlug && { pageSlug }),
        });

        const response = await fetch(`/api/ads/slot?${params}`);
        if (response.ok) {
          const data = await response.json();
          if (data.creative) {
            setCreative(data.creative);
          }
        }
      } catch (error) {
        console.error("Error fetching ad:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAd();
  }, [slotName, pageType, pageSlug]);

  // Loading state
  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
    );
  }

  // No ad available
  if (!creative) {
    return fallback ? <>{fallback}</> : null;
  }

  // Track impression (fire and forget)
  const trackImpression = () => {
    fetch("/api/ads/impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotName, pageType, pageSlug }),
    }).catch(() => {});
  };

  return (
    <Link
      href={creative.linkUrl}
      target="_blank"
      rel="sponsored noopener"
      className={`block relative overflow-hidden rounded-xl ${className}`}
      onClick={trackImpression}
    >
      <Image
        src={creative.imageUrl}
        alt={creative.altText}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 300px"
      />
      <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
        Sponsored
      </span>
    </Link>
  );
}
