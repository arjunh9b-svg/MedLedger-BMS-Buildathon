import React, { useState } from "react";
import "../styles/login.css";

function Login({ onLogin }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!selectedWorkspace) {
      alert("Please select a workspace.");
      return;
    }

    onLogin(selectedWorkspace);
  };

  return (
    <div className="login-page">

      {/* Background */}
      <div className="login-bg-circle login-bg-circle-left"></div>
      <div className="login-bg-circle login-bg-circle-right"></div>

      {/* Main Card */}
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <img src="/logo.png" alt="MedLedger" />
        </div>

        {/* Header */}
        <div className="secure-access">
          SECURE ACCESS
        </div>

        <h1>Welcome back</h1>

        <p className="login-subtitle">
          Sign in to your workspace
        </p>

        {/* Form */}
        <form onSubmit={handleLogin}>

          {/* Employee ID */}
          <div className="input-group">
            <label>Email / Employee ID</label>

            <input
              type="text"
              placeholder="Enter your email or employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "◉" : "○"}
              </button>

            </div>
          </div>

          {/* Remember Me */}
          <div className="remember-row">

            <label className="remember-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

          </div>

          {/* Workspace */}
          <div className="workspace-section">

            <div className="workspace-title">
              Select your workspace
            </div>

            <div className="workspace-options">

              {/* Hospital */}
              <button
                type="button"
                className={`workspace-card ${
                  selectedWorkspace === "hospital"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedWorkspace("hospital")
                }
              >

                <div className="workspace-icon hospital-icon">
                  🏥
                </div>

                <div className="workspace-info">
                  <h3>Hospital</h3>

                  <p>
                    Manage equipment, requests and usage
                    records
                  </p>
                </div>

                <div className="workspace-arrow">
                  {selectedWorkspace === "hospital"
                    ? "✓"
                    : "→"}
                </div>

              </button>

              {/* Auditor */}
              <button
                type="button"
                className={`workspace-card ${
                  selectedWorkspace === "auditor"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedWorkspace("auditor")
                }
              >

                <div className="workspace-icon auditor-icon">
                  📋
                </div>

                <div className="workspace-info">
                  <h3>Auditor</h3>

                  <p>
                    Review logs, compliance and audit
                    trails
                  </p>
                </div>

                <div className="workspace-arrow">
                  {selectedWorkspace === "auditor"
                    ? "✓"
                    : "→"}
                </div>

              </button>

              {/* Lab */}
              <button
                type="button"
                className={`workspace-card ${
                  selectedWorkspace === "lab"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedWorkspace("lab")
                }
              >

                <div className="workspace-icon lab-icon">
                  🧪
                </div>

                <div className="workspace-info">
                  <h3>Lab</h3>

                  <p>
                    Handle testing, calibration and
                    maintenance
                  </p>
                </div>

                <div className="workspace-arrow">
                  {selectedWorkspace === "lab"
                    ? "✓"
                    : "→"}
                </div>

              </button>

            </div>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            className={`signin-button ${
              selectedWorkspace ? "active" : ""
            }`}
          >
            <span>Sign in</span>
            <span>→</span>
          </button>

        </form>

        {/* Forgot Password */}
        <button className="forgot-password">
          Forgot password?
        </button>

        {/* Security */}
        <div className="security-section">

          <div className="security-line">
            <span></span>
            <p>SECURE MEDICAL LEDGER</p>
            <span></span>
          </div>

          <div className="security-message">
            🔒 Your connection is protected and access
            controlled.
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="login-footer">
        <span>●</span> Secure access • Verified workspace
      </div>

    </div>
  );
}

export default Login;