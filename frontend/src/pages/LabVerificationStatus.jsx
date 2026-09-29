import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/LabVerificationStatus.css";

function LabVerificationStatus() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://medledger-bms-buildathon.onrender.com/api/certificates"
      );

      setCertificates(response.data);
    } catch (err) {
      console.error("Verification status error:", err);
      setError("Unable to load verification records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const logout = () => {
    navigate("/");
    window.location.reload();
  };

  const getStatusClass = (status) => {
    if (status === "APPROVED" || status === "VERIFIED") {
      return "verified";
    }

    if (status === "REJECTED" || status === "NOT_VERIFIED") {
      return "rejected";
    }

    return "pending";
  };

  const getStatusText = (status) => {
    if (status === "APPROVED") {
      return "VERIFIED";
    }

    if (status === "REJECTED") {
      return "NOT VERIFIED";
    }

    return status || "PENDING";
  };

  const verifiedCount = certificates.filter(
    (certificate) =>
      certificate.status === "APPROVED" ||
      certificate.status === "VERIFIED"
  ).length;

  const rejectedCount = certificates.filter(
    (certificate) =>
      certificate.status === "REJECTED" ||
      certificate.status === "NOT_VERIFIED"
  ).length;

  const pendingCount =
    certificates.length - verifiedCount - rejectedCount;

  return (
    <div className="lab-verification-page">

      {/* NAVBAR */}
      <header className="lab-navbar">

        <div
          className="lab-brand"
          onClick={() => navigate("/lab")}
        >
          <div className="lab-logo">M</div>
          <span>MEDLEDGER</span>
        </div>

        <nav className="lab-nav">

          <NavLink to="/lab">
            Dashboard
          </NavLink>

          <NavLink to="/lab/equipments">
            Equipments
          </NavLink>

          <NavLink to="/lab/certificates">
            Certificates
          </NavLink>

          <NavLink to="/lab/verification">
            Verification Status
          </NavLink>

          <NavLink to="/lab/issues">
            Issues
          </NavLink>

        </nav>

        <div className="lab-user">

          <div className="lab-avatar">
            LT
          </div>

          <span>Lab-Tech</span>

          <button
            className="lab-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* CONTENT */}
      <main className="lab-verification-content">

        <div className="lab-verification-heading">

          <p>LAB-TECH PORTAL</p>

          <h1>Verification Status</h1>

          <span>
            Monitor certificate integrity and verification results.
          </span>

        </div>

        {/* STATS */}
        <section className="verification-stats">

          <div className="verification-stat">
            <span>Total Certificates</span>
            <strong>
              {certificates.length}
            </strong>
          </div>

          <div className="verification-stat">
            <span>Verified</span>
            <strong className="verified-number">
              {verifiedCount}
            </strong>
          </div>

          <div className="verification-stat">
            <span>Pending</span>
            <strong className="pending-number">
              {pendingCount}
            </strong>
          </div>

          <div className="verification-stat">
            <span>Not Verified</span>
            <strong className="rejected-number">
              {rejectedCount}
            </strong>
          </div>

        </section>

        {/* VERIFICATION TABLE */}
        <section className="verification-card">

          <div className="verification-card-header">

            <div>
              <p>INTEGRITY MONITOR</p>
              <h2>Certificate Verification</h2>
            </div>

            <button
              className="verification-refresh-btn"
              onClick={loadCertificates}
            >
              Refresh
            </button>

          </div>

          {loading && (
            <div className="verification-loading">
              Loading verification records...
            </div>
          )}

          {!loading && error && (
            <div className="verification-error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            certificates.length === 0 && (
              <div className="verification-empty">

                <div className="verification-empty-icon">
                  V
                </div>

                <strong>
                  No verification records yet.
                </strong>

                <span>
                  Certificate verification results will appear here.
                </span>

              </div>
            )}

          {!loading &&
            !error &&
            certificates.length > 0 && (

              <div className="verification-table-wrapper">

                <table className="verification-table">

                  <thead>
                    <tr>
                      <th>Certificate</th>
                      <th>Equipment</th>
                      <th>Version</th>
                      <th>SHA-256</th>
                      <th>Blockchain</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {certificates.map((certificate) => (

                      <tr key={certificate.id}>

                        <td>
                          <strong className="certificate-number">
                            {certificate.certificate_number ||
                              `CERT-${certificate.id}`}
                          </strong>
                        </td>

                        <td>
                          {certificate.equipment_name ||
                            "Equipment"}
                        </td>

                        <td>
                          v{certificate.version_number || 1}
                        </td>

                        <td>

                          {certificate.sha256_hash ? (
                            <span className="hash-status registered">
                              Registered
                            </span>
                          ) : (
                            <span className="hash-status missing">
                              Missing
                            </span>
                          )}

                        </td>

                        <td>

                          {certificate.blockchain_tx ? (
                            <span className="blockchain-status connected">
                              Registered
                            </span>
                          ) : (
                            <span className="blockchain-status not-connected">
                              Not registered
                            </span>
                          )}

                        </td>

                        <td>

                          <span
                            className={`verification-status ${getStatusClass(
                              certificate.status
                            )}`}
                          >
                            {getStatusText(
                              certificate.status
                            )}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

        </section>

        {/* INTEGRITY PANEL */}
        <section className="verification-info">

          <div className="verification-info-icon">
            M
          </div>

          <div className="verification-info-text">

            <p>CERTIFICATE INTEGRITY</p>

            <h2>SHA-256 verification</h2>

            <span>
              A certificate fingerprint can be compared against
              its registered fingerprint to detect document changes.
            </span>

          </div>

          <div className="verification-flow">

            <strong>PDF</strong>

            <b>→</b>

            <strong>SHA-256</strong>

            <b>→</b>

            <strong>MST Blockchain</strong>

          </div>

        </section>

      </main>

    </div>
  );
}

export default LabVerificationStatus;
