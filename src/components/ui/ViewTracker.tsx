"use client";
import { useEffect } from "react";

export function ViewTracker({ pageType, pageSlug, operatorId }: {
  pageType: string; pageSlug: string; operatorId?: number
}) {
  useEffect(() => {
    // Small delay to ensure not blocking main thread
    const timer = setTimeout(() => {
        fetch("/api/track-view", {
        method: "POST",
        body: JSON.stringify({ pageType, pageSlug, operatorId }),
        headers: { "Content-Type": "application/json" },
        }).catch((err) => {
          // fire and forget — log so failures aren't fully silent
          console.warn("ViewTracker: failed to track page view", err);
        });
    }, 1000);

    return () => clearTimeout(timer);
  }, [pageType, pageSlug, operatorId]);

  return null;
}
