import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/LabDashboard.css";

function LabDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    equipment: 0,
    certificates: 0,
    pending: 0,
    verified: 0,
    issues: 0,
    recent_certificates: [],
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/lab/dashboard"
      );

      setData(response.data);
    } catch (error) {
      console.error("Lab dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lab-page">

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

      {/* MAIN CONTENT */}
      <main className="lab-content">

        {/* PAGE HEADING */}
        <div className="lab-heading">

          <div>
            <p>LAB-TECH PORTAL</p>

            <h1>Dashboard</h1>

            <span>
              Manage laboratory certificates and equipment registration.
            </span>
          </div>

        </div>

        {/* TECHNICIAN OVERVIEW */}
        <section className="technician-overview">

          <div className="technician-header">

            <div>
              <p>WORKSPACE SUMMARY</p>

              <h2>Technician Overview</h2>

              <span>
                Current certificate and equipment activity across your
                laboratory.
              </span>
            </div>

            <div className="technician-badge">
              LAB-TECH
            </div>

          </div>

          <div className="technician-stats">

            <div className="technician-stat">
              <span>Equipment Registered</span>

              <strong>
                {loading ? "—" : data.equipment}
              </strong>
            </div>

            <div className="technician-stat">
              <span>Certificates</span>

              <strong>
                {loading ? "—" : data.certificates}
              </strong>
            </div>

            <div className="technician-stat">
              <span>Pending Verification</span>

              <strong className="pending-number">
                {loading ? "—" : data.pending}
              </strong>
            </div>

            <div className="technician-stat">
              <span>Verified</span>

              <strong className="verified-number">
                {loading ? "—" : data.verified}
              </strong>
            </div>

            <div className="technician-stat">
              <span>Open Issues</span>

              <strong className="issue-number">
                {loading ? "—" : data.issues}
              </strong>
            </div>

          </div>

        </section>

        {/* MAIN DASHBOARD GRID */}
        <section className="lab-main-grid">

          {/* REGISTRATION STATUS */}
          <div className="lab-card">

            <div className="lab-card-header">

              <div>
                <p>CERTIFICATE WORKFLOW</p>

                <h2>Registration Status</h2>
              </div>

              <button
                onClick={() =>
                  navigate("/lab/certificates")
                }
              >
                View certificates
              </button>

            </div>

            <div className="workflow">

              <div className="workflow-item">

                <div className="workflow-icon">
                  01
                </div>

                <div>
                  <strong>
                    Certificate Registered
                  </strong>

                  <span>
                    Certificate uploaded and stored.
                  </span>
                </div>

                <b>
                  {data.certificates}
                </b>

              </div>

              <div className="workflow-line" />

              <div className="workflow-item">

                <div className="workflow-icon pending">
                  02
                </div>

                <div>
                  <strong>
                    Awaiting Verification
                  </strong>

                  <span>
                    Certificates requiring verification.
                  </span>
                </div>

                <b>
                  {data.pending}
                </b>

              </div>

              <div className="workflow-line" />

              <div className="workflow-item">

                <div className="workflow-icon verified">
                  03
                </div>

                <div>
                  <strong>
                    Verified
                  </strong>

                  <span>
                    Certificates passing integrity checks.
                  </span>
                </div>

                <b>
                  {data.verified}
                </b>

              </div>

            </div>

          </div>

          {/* RECENT CERTIFICATES */}
          <div className="lab-card">

            <div className="lab-card-header">

              <div>
                <p>RECENT ACTIVITY</p>

                <h2>Certificates</h2>
              </div>

              <button
                onClick={() =>
                  navigate("/lab/certificates")
                }
              >
                View all
              </button>

            </div>

            <div className="recent-certificates">

              {data.recent_certificates.length === 0 ? (

                <div className="lab-empty">

                  <div className="lab-empty-icon">
                    C
                  </div>

                  <strong>
                    No certificates yet
                  </strong>

                  <span>
                    Newly registered certificates will appear here.
                  </span>

                </div>

              ) : (

                data.recent_certificates.map(
                  (certificate) => (

                    <div
                      className="recent-certificate"
                      key={certificate.id}
                    >

                      <div>

                        <strong>
                          {certificate.certificate_number ||
                            "Certificate"}
                        </strong>

                        <span>
                          {certificate.equipment_name ||
                            "Equipment"}
                        </span>

                      </div>

                      <span
                        className={`certificate-status ${
                          certificate.status === "APPROVED"
                            ? "approved"
                            : "pending"
                        }`}
                      >
                        {certificate.status}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* BLOCKCHAIN INTEGRITY */}
        <section className="integrity-panel">

          <div className="integrity-left">

            <div className="integrity-icon">
              M
            </div>

            <div>

              <p>CERTIFICATE INTEGRITY</p>

              <h2>
                SHA-256 Fingerprint
              </h2>

              <span>
                Every registered certificate receives a unique digital
                fingerprint.
              </span>

            </div>

          </div>

          <div className="integrity-flow">

            <div>
              <strong>Certificate</strong>
              <span>PDF</span>
            </div>

            <b>→</b>

            <div>
              <strong>SHA-256</strong>
              <span>Fingerprint</span>
            </div>

            <b>→</b>

            <div>
              <strong>MST Blockchain</strong>
              <span>Proof</span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default LabDashboard;