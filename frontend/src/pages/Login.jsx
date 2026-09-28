import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Login.css";

function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    onLogin();

    if (selectedPortal === "hospital") {
      navigate("/hospital");
    } else if (selectedPortal === "lab") {
      navigate("/lab");
    } else if (selectedPortal === "auditor") {
      navigate("/auditor");
    }
  };

  return (
    <main className="login-page">
      <section className="login-left">
        <div className="login-logo">
          <div className="login-logo-box">M</div>
          <span>MEDLEDGER</span>
        </div>

        <div className="login-hero">
          <p className="login-eyebrow">MEDICAL EQUIPMENT VERIFICATION</p>

          <h1>
            Trust every
            <br />
            record.
          </h1>

          <p className="login-description">
            A clean, secure workspace for hospitals to manage equipment,
            certifications, inspections and verification records.
          </p>
        </div>

        <p className="login-footer">
          © 2026 MedLedger · Secure medical records
        </p>

        <div className="login-curve"></div>
      </section>

      <section className="login-right">
        <div className="login-form-container">
          <div className="form-heading">
            <h2>Welcome back</h2>

            <p>Sign in to access your medical equipment workspace.</p>
          </div>

          {/* Portal Selection */}
          <div className="form-group">
            <label>Choose Portal</label>

            <div className="portal-options">
              <button
                type="button"
                className={`portal-option ${
                  selectedPortal === "hospital" ? "selected" : ""
                }`}
                onClick={() => setSelectedPortal("hospital")}
              >
                <strong>Hospital Portal</strong>
                <span>Manage equipment & maintenance</span>
              </button>

              <button
                type="button"
                className={`portal-option ${
                  selectedPortal === "lab" ? "selected" : ""
                }`}
                onClick={() => setSelectedPortal("lab")}
              >
                <strong>Lab-Tech Portal</strong>
                <span>Register & manage certificates</span>
              </button>

              <button
                type="button"
                className={`portal-option ${
                  selectedPortal === "auditor" ? "selected" : ""
                }`}
                onClick={() => setSelectedPortal("auditor")}
              >
                <strong>Auditor Portal</strong>
                <span>Verify & audit certificates</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="name@hospital.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="forgot-row">
              <button type="button" className="forgot-btn">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="signin-btn"
              disabled={!selectedPortal}
            >
              Sign in
            </button>
          </form>

          <div className="continue-divider">
            <span></span>

            <p>or continue with</p>

            <span></span>
          </div>

          <button type="button" className="social-btn">
            Continue with Google
          </button>

          <button type="button" className="social-btn">
            Continue with Apple
          </button>

          <p className="terms">
            By continuing, you agree to the MedLedger Terms of Use and Privacy
            Policy.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
