"use client";

import { useState } from "react";

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Image that hides itself on load error, revealing whatever background is behind it.
 */
export function FallbackImage({ src, alt, className }: FallbackImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
