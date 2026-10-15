import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, employee }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !employee) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(employee.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="corporate-modal-backdrop" onClick={onClose}>
      <div className="corporate-modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-box">
          <div className="delete-warning-icon">
            <AlertTriangle size={30} />
          </div>

          <h3>Delete Employee Record?</h3>
          <p>
            Are you sure you want to delete <strong>{employee.fullName}</strong> (ID: <code className="emp-id-code">{employee.employeeId}</code>)? 
            This action will permanently remove the record from persistent storage and cannot be undone.
          </p>

          <div className="delete-modal-actions">
            <button className="btn btn-outline-corporate" onClick={onClose} disabled={isDeleting}>
              Cancel
            </button>
            <button className="btn-danger-corporate" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 size={16} />
              <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Employee'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
