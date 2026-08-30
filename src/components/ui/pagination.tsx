import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const pages = React.useMemo(() => {
    const p = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        p.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        p.push('...');
      }
    }
    return p.filter((val, index, arr) => val !== '...' || arr[index - 1] !== '...');
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-between', className)} {...props}>
      {totalCount !== undefined && (
        <p className="text-sm text-warm-600 hidden sm:block">
          Showing <span className="font-medium">{totalCount}</span> results
        </p>
      )}
      <nav className="flex items-center justify-center space-x-1" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-9 items-center justify-center rounded-md px-2 text-warm-700 transition-colors hover:bg-warm-100 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="flex h-9 w-9 items-center justify-center text-warm-500">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-warm-700 hover:bg-warm-100'
                )}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-9 items-center justify-center rounded-md px-2 text-warm-700 transition-colors hover:bg-warm-100 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
