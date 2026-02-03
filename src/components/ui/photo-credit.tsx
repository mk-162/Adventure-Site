import Link from "next/link";

interface PhotoCreditProps {
  photographer: string;
  photographerUrl?: string;
  photoUrl?: string;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  variant?: "overlay" | "below";
}

export function PhotoCredit({
  photographer,
  photographerUrl,
  photoUrl,
  position = "bottom-left",
  variant = "overlay",
}: PhotoCreditProps) {
  const positionClasses = {
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-2 right-2",
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
  };

  if (variant === "below") {
    return (
      <p className="text-xs text-neutral-500 mt-1">
        Photo by{" "}
        {photographerUrl ? (
          <Link
            href={photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-700"
          >
            {photographer}
          </Link>
        ) : (
          photographer
        )}{" "}
        on{" "}
        <Link
          href={photoUrl || "https://unsplash.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-700"
        >
          Unsplash
        </Link>
      </p>
    );
  }

  return (
    <div
      className={`absolute ${positionClasses[position]} px-2 py-1 bg-black/50 rounded text-white/80 text-xs backdrop-blur-sm`}
    >
      Photo by{" "}
      {photographerUrl ? (
        <Link
          href={photographerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          {photographer}
        </Link>
      ) : (
        photographer
      )}{" "}
      on{" "}
      <Link
        href={photoUrl || "https://unsplash.com"}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-white"
      >
        Unsplash
      </Link>
    </div>
  );
}
