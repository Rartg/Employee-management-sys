import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Calendar, DollarSign, Tag } from 'lucide-react';

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
      newErrors.employeeId = 'Must be 2-20 alphanumeric characters';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^[+]?[0-9\s-]{8,20}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Enter a valid phone number (8-20 digits)';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Date of Joining is required';
    }

    if (formData.salary === '' || formData.salary === null) {
      newErrors.salary = 'Salary is required';
    } else if (Number(formData.salary) < 0) {
      newErrors.salary = 'Salary cannot be negative';
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-title-icon">
              <User size={20} />
            </div>
            <div>
              <h3>{isEditing ? 'Edit Employee Record' : 'Add New Employee'}</h3>
              <p className="modal-subtitle">
                {isEditing ? `Updating details for ${employee?.employeeId}` : 'Fill in the information below to register an employee'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errors.api && (
          <div className="alert-banner alert-error">
            <span>{errors.api}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Employee ID */}
            <div className="form-group">
              <label className="form-label">
                <Tag size={14} />
                <span>Employee ID *</span>
              </label>
              <input
                type="text"
                name="employeeId"
                placeholder="e.g. EMP-101"
                className={`form-control ${errors.employeeId ? 'is-invalid' : ''}`}
                value={formData.employeeId}
                onChange={handleChange}
              />
              {errors.employeeId && <span className="field-error">{errors.employeeId}</span>}
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                <User size={14} />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. John Doe"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label">
                <Mail size={14} />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. john.doe@kloudspot.com"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">
                <Phone size={14} />
                <span>Phone Number *</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="e.g. +91 9876543210"
                className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">
                <Building2 size={14} />
                <span>Department *</span>
              </label>
              <input
                type="text"
                name="department"
                list="department-suggestions"
                placeholder="e.g. Engineering"
                className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                value={formData.department}
                onChange={handleChange}
              />
              <datalist id="department-suggestions">
                {departments.map((dept) => (
                  <option key={dept} value={dept} />
                ))}
                <option value="Engineering" />
                <option value="Human Resources" />
                <option value="Marketing" />
                <option value="Finance" />
                <option value="Sales" />
                <option value="Operations" />
              </datalist>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>

            {/* Designation */}
            <div className="form-group">
              <label className="form-label">
                <Briefcase size={14} />
                <span>Designation *</span>
              </label>
              <input
                type="text"
                name="designation"
                placeholder="e.g. Backend Software Engineer"
                className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
                value={formData.designation}
                onChange={handleChange}
              />
              {errors.designation && <span className="field-error">{errors.designation}</span>}
            </div>

            {/* Date of Joining */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} />
                <span>Date of Joining *</span>
              </label>
              <input
                type="date"
                name="dateOfJoining"
                className={`form-control ${errors.dateOfJoining ? 'is-invalid' : ''}`}
                value={formData.dateOfJoining}
                onChange={handleChange}
              />
              {errors.dateOfJoining && <span className="field-error">{errors.dateOfJoining}</span>}
            </div>

            {/* Salary */}
            <div className="form-group">
              <label className="form-label">
                <DollarSign size={14} />
                <span>Annual Salary (₹) *</span>
              </label>
              <input
                type="number"
                name="salary"
                placeholder="e.g. 850000"
                min="0"
                step="1000"
                className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                value={formData.salary}
                onChange={handleChange}
              />
              {errors.salary && <span className="field-error">{errors.salary}</span>}
            </div>

            {/* Employment Status */}
            <div className="form-group form-group-full">
              <label className="form-label">
                <span>Employment Status *</span>
              </label>
              <div className="status-toggle-group">
                <label className={`status-radio-card ${formData.employmentStatus === 'Active' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="employmentStatus"
                    value="Active"
                    checked={formData.employmentStatus === 'Active'}
                    onChange={handleChange}
                  />
                  <span className="radio-dot active-dot"></span>
                  <div>
                    <div className="radio-label">Active</div>
                    <div className="radio-sub">Current working employee</div>
                  </div>
                </label>

                <label className={`status-radio-card ${formData.employmentStatus === 'Inactive' ? 'inactive' : ''}`}>
                  <input
                    type="radio"
                    name="employmentStatus"
                    value="Inactive"
                    checked={formData.employmentStatus === 'Inactive'}
                    onChange={handleChange}
                  />
                  <span className="radio-dot inactive-dot"></span>
                  <div>
                    <div className="radio-label">Inactive</div>
                    <div className="radio-sub">Resigned, on leave, or offboarded</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
