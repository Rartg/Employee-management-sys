import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  pageNumber,
  pageSize,
  totalElements,
  totalPages,
  onPageChange,
  onPageSizeChange
}) {
  if (totalElements === 0) return null;

  const start = pageNumber * pageSize + 1;
  const end = Math.min((pageNumber + 1) * pageSize, totalElements);

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(0, pageNumber - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        Showing <strong>{start}</strong> to <strong>{end}</strong> of <strong>{totalElements}</strong> employees
      </div>

      <div className="pagination-controls">
        <div className="page-size-selector">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="page-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="page-buttons">
          <button
            className="page-nav-btn"
            disabled={pageNumber === 0}
            onClick={() => onPageChange(pageNumber - 1)}
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((p) => (
            <button
              key={p}
              className={`page-num-btn ${p === pageNumber ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p + 1}
            </button>
          ))}

          <button
            className="page-nav-btn"
            disabled={pageNumber >= totalPages - 1}
            onClick={() => onPageChange(pageNumber + 1)}
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
