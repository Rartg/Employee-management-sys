import React from 'react';
import { Eye, Edit3, Trash2, Mail, Phone, Calendar, User, ArrowUpDown } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="table-card">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading employee records...</p>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-icon">
            <User size={36} />
          </div>
          <h3>No Employees Found</h3>
          <p>No records matched your search or filter criteria. Try adjusting the filters or add a new employee.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr>
              <th onClick={() => onSort('employeeId')} className="sortable-th">
                <div className="th-content">
                  <span>Employee ID</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => onSort('fullName')} className="sortable-th">
                <div className="th-content">
                  <span>Employee Name</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th>Contact</th>
              <th>Department & Role</th>
              <th onClick={() => onSort('dateOfJoining')} className="sortable-th">
                <div className="th-content">
                  <span>Joined Date</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => onSort('salary')} className="sortable-th text-right">
                <div className="th-content justify-end">
                  <span>Salary</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="text-center">Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="table-row">
                <td>
                  <span className="emp-id-badge">{emp.employeeId}</span>
                </td>
                <td>
                  <div className="user-cell">
                    <div className="avatar">
                      {emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">{emp.fullName}</div>
                      <div className="user-subtext">{emp.designation}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <div className="contact-item">
                      <Mail size={13} />
                      <span>{emp.email}</span>
                    </div>
                    <div className="contact-item">
                      <Phone size={13} />
                      <span>{emp.phoneNumber}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <span className="dept-badge">{emp.department}</span>
                    <div className="role-subtext">{emp.designation}</div>
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={13} />
                    <span>{formatDate(emp.dateOfJoining)}</span>
                  </div>
                </td>
                <td className="text-right">
                  <span className="salary-text">{formatSalary(emp.salary)}</span>
                </td>
                <td className="text-center">
                  <span className={`status-pill status-${emp.employmentStatus.toLowerCase()}`}>
                    <span className="status-pill-dot"></span>
                    {emp.employmentStatus}
                  </span>
                </td>
                <td className="text-right">
                  <div className="action-buttons">
                    <button
                      className="action-btn view-btn"
                      onClick={() => onView(emp)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(emp)}
                      title="Edit Employee"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDelete(emp)}
                      title="Delete Employee"
                    >
                      <Trash2 size={16} />
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
