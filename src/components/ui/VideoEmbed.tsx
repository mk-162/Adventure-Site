"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface VideoEmbedProps {
  /** YouTube URL (e.g. https://www.youtube.com/watch?v=abc123) or bare video ID */
  video: string;
  /** Optional custom title for the iframe */
  title?: string;
  /** Optional custom aspect ratio class — defaults to 16:9 */
  className?: string;
}

/**
 * Extracts a YouTube video ID from various URL formats or returns the
 * input unchanged if it already looks like a bare ID.
 */
function extractVideoId(input: string): string | null {
  // Already a bare ID (11 chars, alphanumeric + dash/underscore)
  if (/^[\w-]{11}$/.test(input)) return input;

  try {
    const url = new URL(input);

    // youtube.com/watch?v=ID
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v") || null;
    }

    // youtu.be/ID
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1) || null;
    }

    // youtube.com/embed/ID
    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/embed/")[1]?.split(/[?&]/)[0] || null;
    }
  } catch {
    // Not a valid URL and not a valid ID
  }

  return null;
}

export function VideoEmbed({ video, title = "YouTube video", className }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const videoId = extractVideoId(video);

  if (!videoId) {
    return null;
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className={`relative w-full rounded-xl overflow-hidden ${className ?? ""}`}>
      {/* 16:9 aspect ratio container */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        {!loaded ? (
          /* Poster / placeholder — click to load the iframe */
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer bg-gray-900"
            aria-label={`Play ${title}`}
          >
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 group-hover:bg-red-500 transition-colors rounded-full p-4 shadow-xl">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </button>
        ) : (
          /* Actual YouTube iframe — only loaded after click */
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>
    </div>
  );
}
