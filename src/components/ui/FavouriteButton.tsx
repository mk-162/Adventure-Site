"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

interface FavouriteButtonProps {
  type: "event" | "itinerary" | "activity" | "operator";
  id: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavouriteButton({ type, id, className = "", size = "md" }: FavouriteButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  useEffect(() => {
    // Check auth status
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!data.user);
        if (data.user) {
          // Check if this item is saved
          fetch(`/api/user/favourites?type=${type}`)
            .then((res) => res.json())
            .then((favData) => {
              const isSaved = favData.favourites?.some(
                (f: any) => f.type === type && f.itemId === id
              );
              setSaved(!!isSaved);
            });
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, [type, id]);

  async function handleClick() {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      const data = await res.json();
      setSaved(data.saved);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
          saved
            ? "bg-red-50 text-red-500 hover:bg-red-100"
            : "bg-white/90 text-slate-400 hover:text-red-500 hover:bg-red-50"
        } shadow-sm border border-slate-200 disabled:opacity-50 ${className}`}
        title={saved ? "Remove from saved" : "Save to My Adventures"}
      >
        <Heart
          className={`${iconSizes[size]} transition-all ${saved ? "fill-red-500" : ""}`}
        />
      </button>

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLoginPrompt(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a4c] mb-2">Save your favourites</h3>
            <p className="text-slate-500 mb-6">
              Create a free account to save adventures, events, and operators you love.
            </p>
            <Link
              href="/login"
              className="block w-full bg-[#ea580c] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors mb-3"
            >
              Sign up free
            </Link>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
