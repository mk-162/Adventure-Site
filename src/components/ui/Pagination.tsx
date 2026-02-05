import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value);
        }
      }
    });
    if (page > 1) {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
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
    <div className="flex justify-center items-center gap-2 mt-12">
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-full text-gray-300 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      <div className="flex items-center gap-1">
        {uniquePages.map((page, i) => (
          typeof page === 'number' ? (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={clsx(
                "w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-colors",
                currentPage === page
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {page}
            </Link>
          ) : (
            <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400">
              ...
            </span>
          )
        ))}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-full text-gray-300 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </div>
  );
}
