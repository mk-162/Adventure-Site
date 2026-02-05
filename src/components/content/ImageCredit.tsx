import { Camera } from "lucide-react";

interface ImageCreditProps {
  photographer: string;
  source: string;
  sourceUrl?: string;
}

export function ImageCredit({ photographer, source, sourceUrl }: ImageCreditProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Camera className="w-3 h-3" />
      <span>
        Photo by {photographer} on{" "}
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-primary"
          >
            {source}
          </a>
        ) : (
          source
        )}
      </span>
    </div>
  );
}
