import React, { useState } from 'react';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  return (
    <div id="loginScreen" className="login-screen">
      {/* Background ambient lighting elements */}
      <div className="login-bg-glow glow-top-left" aria-hidden="true"></div>
      <div className="login-bg-glow glow-bottom-right" aria-hidden="true"></div>
      <div className="login-bg-grid" aria-hidden="true"></div>

      <div className="login-card">
        {/* Top security tag */}
        <div className="login-portal-tag">
          <span className="portal-status-dot"></span>
          <span>ADMINISTRATIVE PORTAL</span>
        </div>

        {/* Brand identity */}
        <div className="login-brand">
          <div className="login-mark-wrap">
            <span className="login-mark">N</span>
          </div>
          <div className="login-brand-copy">
            <h1>Neatify<span className="brand-dot">.</span></h1>
            <p>Store Management & Operations</p>
          </div>
        </div>

        {/* Login form */}
        <form id="loginForm" noValidate>
          {/* Username Field */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="loginUser">
                <i className="bi bi-person me-1"></i> Username
              </label>
            </div>
            <div className="input-wrap">
              <input
                type="text"
                id="loginUser"
                placeholder="admin"
                autoComplete="username"
                required
                spellCheck="false"
              />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="loginPass">
                <i className="bi bi-shield-lock me-1"></i> Password
              </label>
              {capsLockActive && (
                <span className="caps-warning" title="Caps Lock is active">
                  <i className="bi bi-arrow-up-square-fill me-1"></i> CAPS ON
                </span>
              )}
            </div>
            <div className="input-wrap has-action">
              <input
                type={showPassword ? 'text' : 'password'}
                id="loginPass"
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
              />
              <button
                type="button"
                className="pw-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
          </div>

          {/* Error Message alert */}
          <div className="login-error-box" id="loginError" style={{ display: 'none' }}></div>

          {/* Submit Button */}
          <button type="submit" className="btn-login-submit" id="loginSubmitBtn">
            <span>Sign in to Dashboard</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        </form>

        {/* Return to storefront & Security disclaimer */}
        <div className="login-footer">
          <a href="/" className="back-store-link">
            <i className="bi bi-arrow-left"></i>
            <span>Return to Storefront</span>
          </a>
          <div className="security-notice">
            <i className="bi bi-shield-check"></i>
            <span>256-Bit Encrypted Console</span>
          </div>
        </div>
      </div>
    </div>
  );
}
