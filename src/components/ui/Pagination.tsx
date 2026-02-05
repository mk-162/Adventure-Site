"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-full border border-slate-100 text-slate-300 cursor-not-allowed">
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;

          // Show first, last, current, and surrounding pages
          // Logic: 1 ... 4 5 6 ... 12
          const isFirst = page === 1;
          const isLast = page === totalPages;
          const isNearCurrent = page >= currentPage - 1 && page <= currentPage + 1;

          const showPage = isFirst || isLast || isNearCurrent;
          const showEllipsisStart = page === currentPage - 2 && page > 1;
          const showEllipsisEnd = page === currentPage + 2 && page < totalPages;

          if (showPage) {
             return (
              <Link
                key={page}
                href={createPageURL(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </Link>
            );
          }

          if (showEllipsisStart || showEllipsisEnd) {
              return <span key={page} className="text-slate-400 px-1">...</span>;
          }

          return null;
        })}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-full border border-slate-100 text-slate-300 cursor-not-allowed">
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </div>
  );
}
