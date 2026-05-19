'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#c3c3c3]">
      <span className="text-xs text-[#555555]">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-[#c3c3c3] hover:bg-[#f2f6ef] disabled:opacity-40
            disabled:cursor-not-allowed transition-colors text-[#373737] cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-sm text-[#a3a29e]">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={[
                'w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer',
                currentPage === page
                  ? 'text-white'
                  : 'text-[#373737] border border-[#c3c3c3] hover:bg-[#f2f6ef]',
              ].join(' ')}
              style={
                currentPage === page
                  ? { background: 'linear-gradient(90deg, #7c9f43, #597a3e)' }
                  : {}
              }
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-[#c3c3c3] hover:bg-[#f2f6ef] disabled:opacity-40
            disabled:cursor-not-allowed transition-colors text-[#373737] cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
