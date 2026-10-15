import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Calendar, DollarSign, Tag, Check, AlertCircle } from 'lucide-react';
import KloudspotLogo from './KloudspotLogo';

export default function EmployeeFormModal({ isOpen, onClose, onSave, employee, departments = [] }) {
  const isEditing = Boolean(employee);

  const initialFormState = {
    employeeId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    department: '',
    designation: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    salary: '',
    employmentStatus: 'Active'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeId: employee.employeeId || '',
        fullName: employee.fullName || '',
        email: employee.email || '',
        phoneNumber: employee.phoneNumber || '',
        department: employee.department || '',
        designation: employee.designation || '',
        dateOfJoining: employee.dateOfJoining || '',
        salary: employee.salary ?? '',
        employmentStatus: employee.employmentStatus || 'Active'
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    } else if (!/^[A-Za-z0-9_-]{2,20}$/.test(formData.employeeId.trim())) {
      newErrors.employeeId = 'Must be 2-20 alphanumeric characters (e.g. EMP-101)';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Corporate Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^[+]?[0-9\s-]{8,20}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Enter a valid contact number (8-20 digits)';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department selection is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation/Title is required';
    }

    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Joining Date is required';
    }

    if (formData.salary === '' || formData.salary === null) {
      newErrors.salary = 'Compensation amount is required';
    } else if (Number(formData.salary) < 0) {
      newErrors.salary = 'Compensation cannot be a negative amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary)
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, api: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="corporate-modal-backdrop" onClick={onClose}>
      <div className="corporate-modal-container form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="corporate-modal-header">
          <div className="modal-title-group">
            <KloudspotLogo size={26} showText={false} />
            <div>
              <h3>{isEditing ? 'Modify Employee Profile' : 'Onboard New Employee'}</h3>
              <p className="corporate-modal-subtitle">
                {isEditing ? `Updating verified record for ${employee?.employeeId}` : 'Enter the complete corporate credentials and employment parameters'}
              </p>
            </div>
          </div>
          <button className="corporate-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {errors.api && (
          <div className="corporate-alert-banner">
            <AlertCircle size={16} />
            <span>{errors.api}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="corporate-form-body">
          {/* Section 1: Identification */}
          <div className="form-section-header">1. IDENTITY & CREDENTIALS</div>
          <div className="form-row-2">
            <div className="input-group">
              <label className="input-label"><Tag size={12} /> Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                placeholder="e.g. EMP-105"
                className={`corporate-input ${errors.employeeId ? 'has-error' : ''}`}
                value={formData.employeeId}
                onChange={handleChange}
              />
              {errors.employeeId && <span className="input-error-msg">{errors.employeeId}</span>}
            </div>

            <div className="input-group">
              <label className="input-label"><User size={12} /> Full Legal Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Priya Sharma"
                className={`corporate-input ${errors.fullName ? 'has-error' : ''}`}
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="input-error-msg">{errors.fullName}</span>}
            </div>
          </div>

          {/* Section 2: Contact */}
          <div className="form-section-header">2. COMMUNICATION CHANNELS</div>
          <div className="form-row-2">
            <div className="input-group">
              <label className="input-label"><Mail size={12} /> Corporate Email *</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. priya.s@kloudspot.com"
                className={`corporate-input ${errors.email ? 'has-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="input-error-msg">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label className="input-label"><Phone size={12} /> Direct Contact Number *</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="e.g. +91 9876543210"
                className={`corporate-input ${errors.phoneNumber ? 'has-error' : ''}`}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <span className="input-error-msg">{errors.phoneNumber}</span>}
            </div>
          </div>

          {/* Section 3: Job Placement */}
          <div className="form-section-header">3. ORGANIZATIONAL ASSIGNMENT</div>
          <div className="form-row-2">
            <div className="input-group">
              <label className="input-label"><Building2 size={12} /> Department *</label>
              <input
                type="text"
                name="department"
                list="corporate-depts"
                placeholder="Select or type department"
                className={`corporate-input ${errors.department ? 'has-error' : ''}`}
                value={formData.department}
                onChange={handleChange}
              />
              <datalist id="corporate-depts">
                {departments.map(d => <option key={d} value={d} />)}
                <option value="Engineering" />
                <option value="Human Resources" />
                <option value="Marketing" />
                <option value="Finance" />
                <option value="Sales" />
                <option value="Operations" />
              </datalist>
              {errors.department && <span className="input-error-msg">{errors.department}</span>}
            </div>

            <div className="input-group">
              <label className="input-label"><Briefcase size={12} /> Designation / Role *</label>
              <input
                type="text"
                name="designation"
                placeholder="e.g. Principal Cloud Engineer"
                className={`corporate-input ${errors.designation ? 'has-error' : ''}`}
                value={formData.designation}
                onChange={handleChange}
              />
              {errors.designation && <span className="input-error-msg">{errors.designation}</span>}
            </div>
          </div>

          {/* Section 4: Compensation & Status */}
          <div className="form-section-header">4. TENURE & STATUS</div>
          <div className="form-row-2">
            <div className="input-group">
              <label className="input-label"><Calendar size={12} /> Date of Joining *</label>
              <input
                type="date"
                name="dateOfJoining"
                className={`corporate-input ${errors.dateOfJoining ? 'has-error' : ''}`}
                value={formData.dateOfJoining}
                onChange={handleChange}
              />
              {errors.dateOfJoining && <span className="input-error-msg">{errors.dateOfJoining}</span>}
            </div>

            <div className="input-group">
              <label className="input-label"><DollarSign size={12} /> Annual Compensation (₹ CTC) *</label>
              <input
                type="number"
                name="salary"
                placeholder="e.g. 1200000"
                min="0"
                step="1000"
                className={`corporate-input ${errors.salary ? 'has-error' : ''}`}
                value={formData.salary}
                onChange={handleChange}
              />
              {errors.salary && <span className="input-error-msg">{errors.salary}</span>}
            </div>
          </div>

          <div className="input-group status-selection-group">
            <label className="input-label">Employment Standing *</label>
            <div className="corporate-radio-row">
              <label className={`corporate-radio-option ${formData.employmentStatus === 'Active' ? 'option-selected-active' : ''}`}>
                <input
                  type="radio"
                  name="employmentStatus"
                  value="Active"
                  checked={formData.employmentStatus === 'Active'}
                  onChange={handleChange}
                />
                <span className="radio-circle"></span>
                <div>
                  <div className="option-title">Active Workforce</div>
                  <div className="option-desc">Currently employed and engaged in company operations</div>
                </div>
              </label>

              <label className={`corporate-radio-option ${formData.employmentStatus === 'Inactive' ? 'option-selected-inactive' : ''}`}>
                <input
                  type="radio"
                  name="employmentStatus"
                  value="Inactive"
                  checked={formData.employmentStatus === 'Inactive'}
                  onChange={handleChange}
                />
                <span className="radio-circle"></span>
                <div>
                  <div className="option-title">Inactive / Sabbatical</div>
                  <div className="option-desc">Offboarded, resigned, or on extended leave</div>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="corporate-modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary-corporate" disabled={isSubmitting}>
              {isSubmitting ? 'Validating...' : isEditing ? 'Save Changes' : 'Confirm & Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
