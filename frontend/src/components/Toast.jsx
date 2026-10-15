import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast-banner toast-${toast.type || 'success'}`}>
      <div className="toast-icon">
        {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
