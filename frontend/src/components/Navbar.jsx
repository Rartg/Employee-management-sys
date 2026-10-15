import React from 'react';
import KloudspotLogo from './KloudspotLogo';
import { Plus, Download, FileCode, RefreshCw, Sun, Moon, User } from 'lucide-react';

export default function Navbar({
  onAddClick,
  onExportClick,
  isConnected,
  onRefresh,
  isRefreshing,
  theme = 'dark',
  onToggleTheme
}) {
  return (
    <header className="enterprise-navbar">
      <div className="navbar-inner">
        {/* Brand Left */}
        <div className="navbar-left">
          <KloudspotLogo size={38} showText={true} />
          <div className="portal-badge">
            <span className="portal-badge-dot"></span>
            Global HQ Directory
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="navbar-right">
          {/* Day / Night Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn-theme-toggle"
            title={theme === 'dark' ? 'Switch to Light (Day) Mode' : 'Switch to Dark (Night) Mode'}
          >
            {theme === 'dark' ? <Sun size={16} className="sun-icon" /> : <Moon size={16} className="moon-icon" />}
            <span className="theme-toggle-text">{theme === 'dark' ? 'Day' : 'Night'}</span>
          </button>

          {/* System Health Pill */}
          <div className={`health-pill ${isConnected ? 'health-live' : 'health-down'}`} title={isConnected ? 'Backend & Mongock Migrations Connected' : 'Connecting to API...'}>
            <span className="health-dot"></span>
            <span className="health-text">{isConnected ? 'Mongock • Live' : 'Connecting...'}</span>
          </div>

          <button
            onClick={onRefresh}
            className={`btn-icon ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh Directory"
            disabled={isRefreshing}
          >
            <RefreshCw size={15} />
          </button>

          <a
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            title="Interactive Swagger/OpenAPI Documentation"
          >
            <FileCode size={15} />
            <span>API Docs</span>
          </a>

          <button
            onClick={onExportClick}
            className="btn btn-outline-corporate"
            title="Export filtered records to RFC-4180 CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onAddClick}
            className="btn btn-primary-corporate"
          >
            <Plus size={16} />
            <span>Add Employee</span>
          </button>

          {/* Admin Identity Pill */}
          <div className="user-profile-chip">
            <div className="user-avatar-small">
              <User size={14} />
            </div>
            <div className="user-profile-meta">
              <span className="user-role-label">HR Admin</span>
              <span className="user-name-label">Samarth</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
