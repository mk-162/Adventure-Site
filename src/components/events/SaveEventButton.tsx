"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveEventButtonProps {
  eventId: number;
  initialCount?: number;
  initialSaved?: boolean;
}

export function SaveEventButton({ eventId, initialCount = 0, initialSaved = false }: SaveEventButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Ideally, we'd check if saved on mount if we don't have SSR data for it
  // But here we'll rely on props or optimistically toggle

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    // Optimistic UI
    const prevSaved = saved;
    const prevCount = count;
    setSaved(!saved);
    setCount(saved ? count - 1 : count + 1);

    try {
      const res = await fetch(`/api/events/${eventId}/save`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setSaved(data.saved);
      setCount(data.count);
    } catch (err) {
      // Revert
      setSaved(prevSaved);
      setCount(prevCount);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex flex-col items-center gap-1 group"
      disabled={loading}
    >
      <div className={cn(
        "p-3 rounded-full transition-all duration-300",
        saved
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
      )}>
        <Heart className={cn("w-6 h-6", saved && "fill-current")} />
      </div>
      <span className="text-xs font-medium text-gray-500">
        {count} saved
      </span>
    </button>
  );
}
