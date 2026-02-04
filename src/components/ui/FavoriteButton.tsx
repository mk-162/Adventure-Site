"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

interface FavoriteButtonProps {
  itemId?: number;
  itemType?: "activity" | "operator" | "accommodation" | "event" | "itinerary";
  className?: string;
  iconClassName?: string;
}

export function FavoriteButton({
  itemId,
  itemType,
  className,
  iconClassName,
}: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!itemId || !itemType) return;
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!data.user);
        if (data.user) {
          fetch(`/api/user/favourites?type=${itemType}`)
            .then((res) => res.json())
            .then((favData) => {
              const isSaved = favData.favourites?.some(
                (f: any) => f.type === itemType && f.itemId === itemId
              );
              setSaved(!!isSaved);
            });
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, [itemId, itemType]);

  async function handleClick() {
    if (!itemId || !itemType) return;

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: itemType, id: itemId }),
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
        className={className || "p-3 bg-white/90 rounded-full hover:bg-white transition-colors"}
        aria-label={saved ? "Remove from saved" : "Save to My Adventures"}
      >
        <Heart
          className={`${iconClassName || "w-5 h-5"} transition-all ${
            saved ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </button>

      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a4c]">
                Save your favourites
              </h2>
              <p className="text-gray-600">
                Create a free account to save adventures, events, and operators you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <Link
                  href="/login"
                  className="flex-1 px-6 py-3 bg-[#f97316] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-colors text-center"
                >
                  Sign up free
                </Link>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
