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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-content">
          <div className="delete-icon-box">
            <AlertTriangle size={32} />
          </div>

          <h3>Delete Employee Record?</h3>
          <p>
            Are you sure you want to delete <strong>{employee.fullName}</strong> (ID: <code>{employee.employeeId}</code>)? 
            This action will permanently remove the record from persistent storage and cannot be undone.
          </p>

          <div className="delete-modal-actions">
            <button className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 size={16} />
              <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Employee'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
