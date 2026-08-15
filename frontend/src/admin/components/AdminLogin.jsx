import React from 'react';

export default function AdminLogin() {
  return (
    <>
      <div id="loginScreen" className="login-screen">
    <div className="login-card">
      <div className="login-brand">
        <span className="login-mark">N</span>
        <div>
          <h1>Neatify Admin</h1>
          <p>Sign in to manage your store</p>
        </div>
      </div>
      <form id="loginForm" novalidate>
        <label htmlFor="loginUser">Username</label>
        <input type="text" id="loginUser" placeholder="Enter username" autoComplete="username" required />

        <label htmlFor="loginPass">Password</label>
        <input type="password" id="loginPass" placeholder="••••••••" autoComplete="current-password" required />

        <button type="submit" className="btn-primary">Sign in</button>
        <p className="login-error" id="loginError"></p>
      </form>
    </div>
  </div>
    </>
  );
}
