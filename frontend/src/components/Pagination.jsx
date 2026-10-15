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
    <div className="corporate-pagination-bar">
      <div className="pagination-text-info">
        Showing <strong>{start}</strong> to <strong>{end}</strong> of <strong>{totalElements}</strong> employees
      </div>

      <div className="pagination-action-controls">
        <div className="page-size-picker">
          <span className="picker-label">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="corporate-select-compact"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="pagination-button-group">
          <button
            className="btn-page-nav"
            disabled={pageNumber === 0}
            onClick={() => onPageChange(pageNumber - 1)}
            title="Previous Page"
          >
            <ChevronLeft size={16} />
            <span className="nav-text">Prev</span>
          </button>

          <div className="page-numbers-list">
            {getPageNumbers().map((p) => (
              <button
                key={p}
                className={`btn-page-number ${p === pageNumber ? 'page-active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p + 1}
              </button>
            ))}
          </div>

          <button
            className="btn-page-nav"
            disabled={pageNumber >= totalPages - 1}
            onClick={() => onPageChange(pageNumber + 1)}
            title="Next Page"
          >
            <span className="nav-text">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
