import React from 'react';
import { Users, Plus, Download, FileText, CheckCircle } from 'lucide-react';

export default function Navbar({ onAddClick, onExportClick, isConnected }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Users size={24} />
          </div>
          <div>
            <div className="brand-title">
              Kloudspot <span>EMS</span>
            </div>
            <div className="brand-subtitle">Employee Management System</div>
          </div>
          <span className="badge-pill">Enterprise</span>
        </div>

        <div className="navbar-actions">
          <div className={`status-indicator ${isConnected ? 'status-online' : 'status-offline'}`} title={isConnected ? 'Backend API Connected' : 'Checking API...'}>
            <span className="status-dot"></span>
            <span>{isConnected ? 'API Live' : 'Connecting...'}</span>
          </div>

          <a 
            href="http://localhost:8080/swagger-ui.html" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary btn-sm"
            title="Open Interactive Swagger Documentation"
          >
            <FileText size={16} />
            <span>Swagger Docs</span>
          </a>

          <button onClick={onExportClick} className="btn btn-secondary btn-sm" title="Download Employee List as CSV">
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button onClick={onAddClick} className="btn btn-primary btn-sm">
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
    </header>
  );
}
