import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/LabCertificates.css";

function LabCertificates() {
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
      console.error("Certificate loading error:", err);
      setError("Unable to load certificate records.");
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
      return "approved";
    }

    if (status === "REJECTED" || status === "NOT_VERIFIED") {
      return "rejected";
    }

    return "pending";
  };

  return (
    <div className="lab-certificates-page">

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
          <NavLink to="/lab">Dashboard</NavLink>

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
          <div className="lab-avatar">LT</div>

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
      <main className="lab-certificates-content">

        {/* HEADING */}
        <div className="lab-certificates-heading">

          <div>
            <p>LAB-TECH PORTAL</p>

            <h1>Certificates</h1>

            <span>
              Manage calibration certificates and their integrity records.
            </span>
          </div>

        </div>

        {/* SUMMARY */}
        <section className="certificate-stats">

          <div className="certificate-stat">
            <span>Total Certificates</span>
            <strong>{certificates.length}</strong>
          </div>

          <div className="certificate-stat">
            <span>Approved</span>

            <strong>
              {
                certificates.filter(
                  (certificate) =>
                    certificate.status === "APPROVED"
                ).length
              }
            </strong>
          </div>

          <div className="certificate-stat">
            <span>Pending</span>

            <strong>
              {
                certificates.filter(
                  (certificate) =>
                    certificate.status !== "APPROVED"
                ).length
              }
            </strong>
          </div>

        </section>

        {/* CERTIFICATE CARD */}
        <section className="lab-certificates-card">

          <div className="lab-certificates-card-header">

            <div>
              <p>CERTIFICATE REGISTRY</p>

              <h2>Calibration Certificates</h2>
            </div>

            <button
              className="certificate-refresh-btn"
              onClick={loadCertificates}
            >
              Refresh
            </button>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="certificate-loading">
              Loading certificate records...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="certificate-error">
              {error}
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            certificates.length === 0 && (
              <div className="certificate-empty">

                <div className="certificate-empty-icon">
                  C
                </div>

                <strong>
                  No certificates registered yet.
                </strong>

                <span>
                  Certificate records will appear here once available.
                </span>

              </div>
            )}

          {/* TABLE */}
          {!loading &&
            !error &&
            certificates.length > 0 && (
              <div className="certificate-table-wrapper">

                <table className="certificate-table">

                  <thead>
                    <tr>
                      <th>Certificate</th>
                      <th>Equipment</th>
                      <th>Calibration</th>
                      <th>Next Due</th>
                      <th>Result</th>
                      <th>Status</th>
                      <th>Integrity</th>
                    </tr>
                  </thead>

                  <tbody>

                    {certificates.map((certificate) => (

                      <tr key={certificate.id}>

                        <td>
                          <div className="certificate-number">
                            {certificate.certificate_number ||
                              `CERT-${certificate.id}`}
                          </div>

                          <span className="certificate-version">
                            Version {certificate.version_number || 1}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {certificate.equipment_name ||
                              "Equipment"}
                          </strong>
                        </td>

                        <td>
                          {certificate.calibration_date
                            ? new Date(
                                certificate.calibration_date
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td>
                          {certificate.next_calibration_date
                            ? new Date(
                                certificate.next_calibration_date
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td>
                          {certificate.calibration_result || "—"}
                        </td>

                        <td>
                          <span
                            className={`certificate-status ${getStatusClass(
                              certificate.status
                            )}`}
                          >
                            {certificate.status || "PENDING"}
                          </span>
                        </td>

                        <td>

                          {certificate.sha256_hash ? (
                            <span className="hash-present">
                              SHA-256
                            </span>
                          ) : (
                            <span className="hash-missing">
                              Not registered
                            </span>
                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

        </section>

      </main>

    </div>
  );
}

export default LabCertificates;
