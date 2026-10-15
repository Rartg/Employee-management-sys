import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2, Sun, Moon } from 'lucide-react';
import KloudspotLogo from './KloudspotLogo';
import { employeeService } from '../api/employeeService';

export default function LoginPage({ onLoginSuccess, theme = 'dark', onToggleTheme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Please enter your Employee ID / Username and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const user = await employeeService.login(username.trim(), password);
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="corporate-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header className="enterprise-navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <KloudspotLogo size={38} showText={true} />
          </div>
          <div className="navbar-right">
            <button
              onClick={onToggleTheme}
              className="btn-theme-toggle"
              title={theme === 'dark' ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
              aria-label="Toggle Day/Night Theme"
            >
              {theme === 'dark' ? <Sun size={17} className="sun-icon" /> : <Moon size={17} className="moon-icon" />}
            </button>
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              title="Interactive Swagger/OpenAPI Documentation"
            >
              <span>API Docs</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            background: 'var(--card-bg, #111114)',
            border: '1px solid var(--border-color, #27272a)',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(14, 165, 233, 0.08)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '14px', background: 'rgba(14, 165, 233, 0.1)', marginBottom: '16px' }}>
              <KloudspotLogo size={42} showText={false} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary, #fff)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Enterprise Directory Login
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #a1a1aa)', margin: 0 }}>
              Spring Security Session-Based Authentication
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary, #a1a1aa)', marginBottom: '6px' }}>
                Employee ID, Corporate Email, or Admin Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                <input
                  type="text"
                  className="corporate-form-input"
                  style={{ width: '100%', paddingLeft: '40px', height: '42px', fontSize: '14px' }}
                  placeholder="e.g. EMP-1002, admin, or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary, #a1a1aa)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="corporate-form-input"
                  style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px', height: '42px', fontSize: '14px' }}
                  placeholder="Enter designated password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary-corporate"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '44px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              <span>{isLoading ? 'Verifying Session...' : 'Sign In to EMS Directory'}</span>
            </button>
          </form>

          <div style={{ fontSize: '12px', color: '#71717a', textAlign: 'center', marginTop: '24px', lineHeight: 1.5 }}>
            Authorized workforce access only. Authenticate using your designated corporate credentials.
          </div>
        </div>
      </main>
    </div>
  );
}
