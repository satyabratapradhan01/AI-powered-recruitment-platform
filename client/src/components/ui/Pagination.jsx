import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
      pageNumbers.push('...');
    }
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-slate-200/80 rounded-b-xl ${className}`}
    >
      {totalItems !== undefined && (
        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{startItem}</span> to{' '}
          <span className="font-semibold text-slate-700">{endItem}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalItems}</span> entries
        </p>
      )}

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="xs"
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <span key={index} className="px-2 text-xs text-slate-400 select-none">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 text-xs font-semibold rounded-md transition ${
                currentPage === page
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {page}
            </button>
          )
        )}

        <Button
          variant="outline"
          size="xs"
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
