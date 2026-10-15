import React from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Calendar, DollarSign, Tag, Clock, Edit3 } from 'lucide-react';

export default function EmployeeDetailsModal({ isOpen, onClose, employee, onEditClick }) {
  if (!isOpen || !employee) return null;

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
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="avatar avatar-lg">
              {employee.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3>{employee.fullName}</h3>
              <p className="modal-subtitle">{employee.designation} • {employee.department}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="detail-body">
          <div className="detail-status-bar">
            <div className="detail-badge-group">
              <span className="emp-id-badge">{employee.employeeId}</span>
              <span className={`status-pill status-${employee.employmentStatus.toLowerCase()}`}>
                <span className="status-pill-dot"></span>
                {employee.employmentStatus}
              </span>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onClose();
                onEditClick(employee);
              }}
            >
              <Edit3 size={15} />
              <span>Edit Record</span>
            </button>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-icon"><Mail size={16} /></div>
              <div>
                <div className="detail-label">Email Address</div>
                <div className="detail-val">{employee.email}</div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><Phone size={16} /></div>
              <div>
                <div className="detail-label">Phone Number</div>
                <div className="detail-val">{employee.phoneNumber}</div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><Building2 size={16} /></div>
              <div>
                <div className="detail-label">Department</div>
                <div className="detail-val">{employee.department}</div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><Briefcase size={16} /></div>
              <div>
                <div className="detail-label">Designation</div>
                <div className="detail-val">{employee.designation}</div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><Calendar size={16} /></div>
              <div>
                <div className="detail-label">Date of Joining</div>
                <div className="detail-val">{formatDate(employee.dateOfJoining)}</div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><DollarSign size={16} /></div>
              <div>
                <div className="detail-label">Annual Salary</div>
                <div className="detail-val salary-highlight">{formatSalary(employee.salary)}</div>
              </div>
            </div>
          </div>

          <div className="detail-footer-info">
            <div className="meta-text">
              <Clock size={13} />
              <span>Database Record ID: <code>{employee.id}</code></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
