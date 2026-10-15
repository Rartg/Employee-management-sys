import React from 'react';
import KloudspotLogo from './KloudspotLogo';
import { Plus, Download, Upload, FileCode, RefreshCw, Sun, Moon, User, LogOut, LogIn, Shield } from 'lucide-react';

export default function Navbar({
  onAddClick,
  onExportClick,
  onImportClick,
  onRefresh,
  isRefreshing,
  theme = 'dark',
  onToggleTheme,
  currentUser,
  onLoginClick,
  onLogoutClick
}) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.username === 'admin';

  return (
    <header className="enterprise-navbar">
      <div className="navbar-inner">
        {/* Brand Left */}
        <div className="navbar-left">
          <KloudspotLogo size={38} showText={true} />
        </div>

        {/* Right Action Tools */}
        <div className="navbar-right">
          {/* Day / Night Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn-theme-toggle"
            title={theme === 'dark' ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
            aria-label="Toggle Day/Night Theme"
          >
            {theme === 'dark' ? <Sun size={17} className="sun-icon" /> : <Moon size={17} className="moon-icon" />}
          </button>

          {/* Refresh Directory */}
          <button
            onClick={onRefresh}
            className={`btn-icon ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh Directory"
            disabled={isRefreshing}
          >
            <RefreshCw size={15} />
          </button>

          {/* Swagger / OpenAPI Documentation */}
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

          {/* Import CSV (Bonus Feature) */}
          <button
            onClick={onImportClick}
            className="btn btn-outline-corporate"
            title="Bulk Import employees via CSV"
          >
            <Upload size={15} />
            <span>Import CSV</span>
          </button>

          {/* Export CSV (Bonus Feature) */}
          <button
            onClick={onExportClick}
            className="btn btn-outline-corporate"
            title="Export filtered records to RFC-4180 CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          {/* Add Employee Button (Admin) */}
          <button
            onClick={onAddClick}
            className="btn btn-primary-corporate"
            title={isAdmin ? "Add new employee record" : "Admin privileges required"}
          >
            <Plus size={16} />
            <span>Add Employee</span>
          </button>

          {/* User Profile / Authentication Chip */}
          {currentUser ? (
            <div className="user-profile-chip" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="user-avatar-small" style={{ background: isAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(14, 165, 233, 0.2)', color: isAdmin ? '#f59e0b' : '#0ea5e9' }}>
                {isAdmin ? <Shield size={14} /> : <User size={14} />}
              </div>
              <div className="user-profile-meta">
                <span className="user-role-label">{isAdmin ? 'HR Administrator' : (currentUser.department || 'Employee')}</span>
                <span className="user-name-label">{currentUser.fullName || currentUser.username}</span>
              </div>
              <button
                onClick={onLogoutClick}
                className="btn-icon"
                style={{ width: '28px', height: '28px', padding: 0, marginLeft: '4px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#71717a' }}
                title="Switch User / Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="btn btn-primary-corporate"
              style={{ background: '#2563eb' }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
