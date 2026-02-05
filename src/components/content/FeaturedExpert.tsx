import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { User } from "lucide-react";

interface FeaturedExpertProps {
  photo: string;
  name: string;
  credentials: string;
  perspective: string; // markdown
  operatorSlug?: string;
  isPlaceholder?: boolean;
}

export function FeaturedExpert({
  photo,
  name,
  credentials,
  perspective,
  operatorSlug,
  isPlaceholder = false,
}: FeaturedExpertProps) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-md relative">
      {isPlaceholder && (
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
          AI Placeholder
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-primary" />
        <h3 className="text-2xl sm:text-3xl font-bold text-primary">Featured Expert</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Expert photo */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden shrink-0 border-4 border-white shadow-lg mx-auto sm:mx-0">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Expert info */}
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-primary mb-1">{name}</h4>
          <p className="text-sm sm:text-base text-primary/70 mb-4">{credentials}</p>

          <div className="prose prose-sm sm:prose-base prose-slate max-w-none">
            <ReactMarkdown>{perspective}</ReactMarkdown>
          </div>

          {operatorSlug && (
            <Link
              href={`/directory/${operatorSlug}`}
              className="inline-flex items-center gap-2 mt-4 text-accent-hover hover:text-accent font-semibold text-sm transition-colors"
            >
              Visit their profile →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
