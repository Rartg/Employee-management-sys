import React from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Calendar, DollarSign, Tag, Clock, Edit3, ShieldCheck } from 'lucide-react';
import KloudspotLogo from './KloudspotLogo';

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
    <div className="corporate-modal-backdrop" onClick={onClose}>
      <div className="corporate-modal-container dossier-modal" onClick={(e) => e.stopPropagation()}>
        {/* Dossier Top Banner */}
        <div className="dossier-banner">
          <div className="dossier-branding">
            <KloudspotLogo size={24} showText={false} />
            <span>KLOUDSPOT EMPLOYEE DOSSIER</span>
          </div>
          <button className="corporate-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Profile Header */}
        <div className="dossier-header">
          <div className="dossier-avatar">
            {employee.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="dossier-primary-meta">
            <div className="dossier-name-row">
              <h3>{employee.fullName}</h3>
              <span className={`corporate-status-badge status-${employee.employmentStatus.toLowerCase()}`}>
                <span className="status-indicator-dot"></span>
                {employee.employmentStatus}
              </span>
            </div>
            <div className="dossier-role-text">{employee.designation} • {employee.department}</div>
            <div className="dossier-emp-id">
              <code>ID: {employee.employeeId}</code>
            </div>
          </div>
        </div>

        {/* Dossier Body Grid */}
        <div className="dossier-content">
          <div className="dossier-section-title">CONTACT & IDENTIFICATION</div>
          <div className="dossier-grid">
            <div className="dossier-field">
              <span className="field-title"><Mail size={13} /> Corporate Email</span>
              <a href={`mailto:${employee.email}`} className="field-value link-style">{employee.email}</a>
            </div>
            <div className="dossier-field">
              <span className="field-title"><Phone size={13} /> Phone Number</span>
              <span className="field-value">{employee.phoneNumber}</span>
            </div>
          </div>

          <div className="dossier-section-title">ORGANIZATIONAL PLACEMENT</div>
          <div className="dossier-grid">
            <div className="dossier-field">
              <span className="field-title"><Building2 size={13} /> Department</span>
              <span className="field-value font-semibold">{employee.department}</span>
            </div>
            <div className="dossier-field">
              <span className="field-title"><Briefcase size={13} /> Functional Role</span>
              <span className="field-value">{employee.designation}</span>
            </div>
          </div>

          <div className="dossier-section-title">COMPENSATION & TENURE</div>
          <div className="dossier-grid">
            <div className="dossier-field">
              <span className="field-title"><Calendar size={13} /> Official Joining Date</span>
              <span className="field-value">{formatDate(employee.dateOfJoining)}</span>
            </div>
            <div className="dossier-field">
              <span className="field-title"><DollarSign size={13} /> Annual Remuneration</span>
              <span className="field-value compensation-highlight">{formatSalary(employee.salary)}</span>
            </div>
          </div>

          <div className="dossier-footer-metadata">
            <div className="metadata-item">
              <Clock size={12} />
              <span>MongoDB Document Key: <code>{employee.id}</code></span>
            </div>
            <button
              className="btn btn-primary-corporate btn-sm"
              onClick={() => {
                onClose();
                onEditClick(employee);
              }}
            >
              <Edit3 size={14} />
              <span>Edit Employee Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
