import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";

interface LocalTakeProps {
  photo: string;
  name: string;
  role: string;
  business: string;
  quote: string;
  operatorSlug?: string;
  isPlaceholder?: boolean;
}

export function LocalTake({
  photo,
  name,
  role,
  business,
  quote,
  operatorSlug,
  isPlaceholder = false,
}: LocalTakeProps) {
  return (
    <div className="relative bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/10">
      {isPlaceholder && (
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
          AI Placeholder
        </div>
      )}
      
      <div className="flex items-start gap-4 sm:gap-6">
        {/* Quote mark decoration */}
        <div className="hidden sm:block shrink-0">
          <Quote className="w-12 h-12 text-primary/20" />
        </div>

        <div className="flex-1">
          <p className="text-lg sm:text-xl text-primary/90 font-light leading-relaxed mb-6 italic">
            "{quote}"
          </p>

          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
              <Image
                src={photo}
                alt={name}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-bold text-primary text-sm sm:text-base">{name}</p>
              <p className="text-sm text-primary/70">
                {role}
                {operatorSlug ? (
                  <Link
                    href={`/directory/${operatorSlug}`}
                    className="ml-1 text-accent-hover hover:underline"
                  >
                    @ {business}
                  </Link>
                ) : (
                  business && `, ${business}`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
