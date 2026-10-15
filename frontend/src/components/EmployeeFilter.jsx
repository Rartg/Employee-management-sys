import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export default function EmployeeFilter({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
  departments = [],
  onReset
}) {
  const hasActiveFilters = search || department || status;

  return (
    <div className="filter-card">
      <div className="filter-grid">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-control search-control"
            placeholder="Search by name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch('')}>×</button>
          )}
        </div>

        <div className="filter-select-wrapper">
          <select
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="filter-select-wrapper">
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button className="btn btn-outline" onClick={onReset} title="Reset all filters">
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
