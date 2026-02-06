'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface EventPaginationProps {
  totalPages: number;
}

export function EventPagination({ totalPages }: EventPaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && i > 1) ||
      (i === currentPage + 2 && i < totalPages)
    ) {
      pages.push('...');
    }
  }

  // Dedup ellipses
  const uniquePages = pages.filter((page, index, self) => {
    return page !== '...' || self[index - 1] !== '...';
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-8 mt-12 mb-8 gap-4">
      <div className="flex-1 w-full md:w-auto text-center md:text-left">
         {/* Could add "Showing X to Y of Z" here if I passed those props */}
      </div>

      <div className="flex items-center justify-center md:justify-end flex-1">
        <nav aria-label="Pagination" className="flex items-center gap-2">
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          ) : (
             <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600 cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" />
            </span>
          )}

          {uniquePages.map((page, i) => (
            typeof page === 'number' ? (
              <Link
                key={page}
                href={createPageUrl(page)}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-sm",
                  currentPage === page
                    ? "bg-primary text-white shadow-primary/30"
                    : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary hover:border-primary"
                )}
              >
                {page}
              </Link>
            ) : (
              <span key={`ellipsis-${i}`} className="flex items-center justify-center w-10 h-10 text-sm font-medium text-slate-400">
                ...
              </span>
            )
          ))}

          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600 cursor-not-allowed">
              <ChevronRight className="w-5 h-5" />
            </span>
          )}
        </nav>
      </div>
    </div>
  );
}
