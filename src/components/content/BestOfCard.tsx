import Link from "next/link";
import { List, ArrowRight } from "lucide-react";

interface BestOfCardProps {
  title: string;
  strapline: string;
  href: string;
  count?: number;
}

export function BestOfCard({ title, strapline, href, count }: BestOfCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:border-accent-hover hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
          <List className="w-6 h-6 text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-primary text-base sm:text-lg group-hover:text-accent-hover transition-colors">
              {title}
            </h3>
            {count && (
              <span className="shrink-0 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                {count}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{strapline}</p>

          <div className="flex items-center gap-2 text-accent-hover font-semibold text-sm group-hover:gap-3 transition-all">
            Read the full list
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
