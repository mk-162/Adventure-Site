"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

interface FavoriteButtonProps {
  itemId?: number;
  itemType?: "activity" | "operator" | "accommodation";
  className?: string;
  iconClassName?: string;
}

export function FavoriteButton({ 
  itemId, 
  itemType, 
  className,
  iconClassName 
}: FavoriteButtonProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleClick = () => {
    // TODO: Check if user is authenticated
    // For now, always show the login modal
    setShowLoginModal(true);
    
    // In the future, when auth is implemented:
    // if (!isAuthenticated) {
    //   setShowLoginModal(true);
    // } else {
    //   toggleFavorite();
    // }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={className}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={iconClassName || "w-5 h-5"} />
      </button>

      {/* Login Modal */}
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
              <div className="w-16 h-16 bg-[#f97316]/10 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#f97316]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a4c]">
                Sign in to save your favourites
              </h2>
              <p className="text-gray-600">
                Create an account or sign in to save activities and build your perfect Welsh adventure itinerary.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <Link
                  href="/auth/login"
                  className="flex-1 px-6 py-3 bg-[#f97316] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-colors text-center"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
