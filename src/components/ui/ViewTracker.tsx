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
        }).catch(() => {}); // fire and forget
    }, 1000);

    return () => clearTimeout(timer);
  }, [pageType, pageSlug, operatorId]);

  return null;
}
