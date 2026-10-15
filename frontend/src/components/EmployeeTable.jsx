import React from 'react';
import { Eye, Edit3, Trash2, Mail, Phone, Calendar, ArrowUpDown, ChevronDown, ChevronUp, UserCheck, UserX } from 'lucide-react';

export default function EmployeeTable({
  employees = [],
  isLoading,
  onView,
  onEdit,
  onDelete,
  sortBy,
  direction,
  onSort
}) {
  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDeptColorClass = (dept) => {
    switch ((dept || '').toLowerCase()) {
      case 'engineering': return 'badge-dept-engineering';
      case 'human resources': return 'badge-dept-hr';
      case 'marketing': return 'badge-dept-marketing';
      case 'finance': return 'badge-dept-finance';
      case 'sales': return 'badge-dept-sales';
      case 'operations': return 'badge-dept-operations';
      default: return 'badge-dept-default';
    }
  };

  if (isLoading) {
    return (
      <div className="directory-card">
        <div className="loading-container">
          <div className="corporate-spinner"></div>
          <div className="loading-text">Accessing Kloudspot MongoDB Directory...</div>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="directory-card">
        <div className="empty-directory">
          <div className="empty-symbol">📂</div>
          <h4>No Employee Records Found</h4>
          <p>No directory entries match your current search criteria. Try modifying your department filter or keyword.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="directory-card">
      <div className="table-wrapper">
        <table className="corporate-table">
          <thead>
            <tr>
              <th onClick={() => onSort('employeeId')} className="th-sortable">
                <div className="th-cell">
                  <span>EMPLOYEE ID</span>
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => onSort('fullName')} className="th-sortable">
                <div className="th-cell">
                  <span>EMPLOYEE NAME</span>
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th>CONTACT DETAILS</th>
              <th onClick={() => onSort('department')} className="th-sortable">
                <div className="th-cell">
                  <span>DEPARTMENT & ROLE</span>
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => onSort('dateOfJoining')} className="th-sortable">
                <div className="th-cell">
                  <span>DATE JOINED</span>
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => onSort('salary')} className="th-sortable text-right">
                <div className="th-cell justify-end">
                  <span>ANNUAL COMPENSATION</span>
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th className="text-center">STATUS</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="directory-row">
                {/* ID */}
                <td>
                  <span className="corporate-id-tag">{emp.employeeId}</span>
                </td>

                {/* Name & Avatar */}
                <td>
                  <div className="employee-info-cell">
                    <div className="corporate-avatar">
                      {emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="emp-name">{emp.fullName}</div>
                      <div className="emp-role-title">{emp.designation}</div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td>
                  <div className="emp-contact-list">
                    <div className="contact-row">
                      <Mail size={12} className="text-muted" />
                      <a href={`mailto:${emp.email}`} className="contact-link">{emp.email}</a>
                    </div>
                    <div className="contact-row">
                      <Phone size={12} className="text-muted" />
                      <span className="contact-text">{emp.phoneNumber}</span>
                    </div>
                  </div>
                </td>

                {/* Dept & Designation */}
                <td>
                  <div>
                    <span className={`dept-tag ${getDeptColorClass(emp.department)}`}>
                      {emp.department}
                    </span>
                    <div className="dept-sub-role">{emp.designation}</div>
                  </div>
                </td>

                {/* Joining Date */}
                <td>
                  <div className="date-indicator">
                    <Calendar size={12} className="text-muted" />
                    <span>{formatDate(emp.dateOfJoining)}</span>
                  </div>
                </td>

                {/* Salary */}
                <td className="text-right">
                  <span className="salary-figure">{formatSalary(emp.salary)}</span>
                </td>

                {/* Status */}
                <td className="text-center">
                  <span className={`corporate-status-badge status-${emp.employmentStatus.toLowerCase()}`}>
                    <span className="status-indicator-dot"></span>
                    {emp.employmentStatus}
                  </span>
                </td>

                {/* Actions */}
                <td className="text-right">
                  <div className="corporate-action-group">
                    <button
                      className="btn-corporate-action action-view"
                      onClick={() => onView(emp)}
                      title="View Employee Dossier"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="btn-corporate-action action-edit"
                      onClick={() => onEdit(emp)}
                      title="Edit Employee Information"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="btn-corporate-action action-delete"
                      onClick={() => onDelete(emp)}
                      title="Offboard / Delete Employee Record"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
