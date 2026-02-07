'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown } from 'lucide-react';

interface EventsClientProps {
  availableMonths: { label: string; value: string }[];
  totalEvents: number;
}

// Category labels and their search terms (for ilike matching)
const CATEGORIES: { label: string; search: string }[] = [
  { label: 'All Events', search: '' },
  { label: 'Running', search: 'Running' }, // matches Running, Ultra Running, Trail Running
  { label: 'Triathlon', search: 'Triathlon' },
  { label: 'Swimming', search: 'Swimming' }, // matches Open Water Swimming
  { label: 'Festival', search: 'Festival' },
  { label: 'Heritage', search: 'Heritage' },
  { label: 'Family', search: 'Family' },
  { label: 'Wildlife', search: 'Wildlife' },
];

export function EventsClient({ availableMonths, totalEvents }: EventsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('type') || 'All Events';
  const currentMonth = searchParams.get('month') || '';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'All Events' && value !== 'Jump to Month') {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      // Reset page when filtering
      if (name !== 'page') {
        params.delete('page');
      }

      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (category: { label: string; search: string }) => {
    // If selecting "All Events", remove 'type' param
    router.push(`?${createQueryString('type', category.search)}`, { scroll: false });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`?${createQueryString('month', e.target.value)}`, { scroll: false });
  };

  return (
    <div className="sticky top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
            {CATEGORIES.map((category) => (
              <button
                key={category.label}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                  currentCategory === category.search || (category.search === '' && !searchParams.get('type'))
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:text-primary"
                )}
              >
                {category.label}
              </button>
            ))}

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 flex-shrink-0" />

            <div className="relative group flex-shrink-0">
              <select
                value={currentMonth}
                onChange={handleMonthChange}
                className="appearance-none bg-transparent pl-2 pr-8 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary focus:outline-none cursor-pointer"
              >
                <option value="">Jump to Month</option>
                {availableMonths.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none group-hover:text-primary" />
            </div>
          </div>

          <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400 pl-4">
            Showing <span className="font-bold text-slate-900 dark:text-white">{totalEvents}</span> events
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles injection for this component */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
