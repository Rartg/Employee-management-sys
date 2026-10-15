import React from 'react';
import { Search, Filter, RotateCcw, X } from 'lucide-react';

export default function EmployeeFilter({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
  departments = [],
  onReset,
  totalRecords = 0
}) {
  const hasActiveFilters = Boolean(search || department || status);

  return (
    <div className="enterprise-filter-panel">
      {/* Search and Dropdowns Bar */}
      <div className="filter-controls-row">
        {/* Search Field */}
        <div className="search-field-wrapper">
          <Search size={16} className="search-field-icon" />
          <input
            type="text"
            className="search-field-input"
            placeholder="Search by full name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear-button" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Department Filter */}
        <div className="filter-dropdown-wrapper">
          <select
            className="filter-dropdown-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All Departments ({departments.length})</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-dropdown-wrapper">
          <select
            className="filter-dropdown-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Employment Statuses</option>
            <option value="Active">Active Status</option>
            <option value="Inactive">Inactive Status</option>
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button className="btn-reset-filters" onClick={onReset} title="Clear all filters">
            <RotateCcw size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Quick Department Filter Pills */}
      <div className="department-pills-row">
        <button
          className={`dept-pill ${!department ? 'dept-pill-active' : ''}`}
          onClick={() => setDepartment('')}
        >
          All Departments
        </button>
        {departments.map((dept) => (
          <button
            key={dept}
            className={`dept-pill ${department === dept ? 'dept-pill-active' : ''}`}
            onClick={() => setDepartment(dept)}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  );
}
