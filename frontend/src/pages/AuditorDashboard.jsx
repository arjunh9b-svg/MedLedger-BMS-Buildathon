import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/Auditor.css";

const API = "https://medledger-bms-buildathon.onrender.com";

function AuditorDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    total_equipment: 0,
    total_certificates: 0,
    verified_certificates: 0,
    pending_certificates: 0,
    rejected_certificates: 0,
    total_issues: 0,
    blockchain_registered: 0,
    recent_verifications: [],
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(`${API}/api/auditor/dashboard`);

      setData(response.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const logout = () => {
    window.location.href = "/";
  };

  return (
    <div className="auditor-page">
      {/* NAVBAR */}
      <header className="auditor-navbar">
        <div className="auditor-brand" onClick={() => navigate("/auditor")}>
          <div className="auditor-logo">M</div>

          <div>
            <strong>MEDLEDGER</strong>
            <span>Auditor Portal</span>
          </div>
        </div>

        <nav className="auditor-nav">
          <NavLink to="/auditor" end>
            Dashboard
          </NavLink>

          <NavLink to="/auditor/verify">Verify Certificate</NavLink>

          <NavLink to="/auditor/equipment">Equipment Records</NavLink>

          <NavLink to="/auditor/issues">Issues</NavLink>

          <NavLink to="/auditor/audit">Audit Reports</NavLink>
        </nav>

        <div className="auditor-user">
          <div className="auditor-avatar">AU</div>

          <span>Auditor</span>

          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="auditor-content">
        <section className="auditor-heading">
          <div>
            <p className="eyebrow">AUDITOR PORTAL</p>

            <h1>Audit Overview</h1>

            <span>
              Monitor certificates, equipment records and verification
              integrity.
            </span>
          </div>

          <button
            className="auditor-primary"
            onClick={() => navigate("/auditor/verify")}
          >
            Verify Certificate
          </button>
        </section>

        {/* STATS */}

        <section className="auditor-stats">
          <div className="auditor-stat">
            <span>Total Equipment</span>

            <strong>{loading ? "—" : data.total_equipment}</strong>

            <small>Registered equipment</small>
          </div>

          <div className="auditor-stat">
            <span>Certificates</span>

            <strong>{loading ? "—" : data.total_certificates}</strong>

            <small>Certificates on record</small>
          </div>

          <div className="auditor-stat">
            <span>Verified</span>

            <strong className="green-text">
              {loading ? "—" : data.verified_certificates}
            </strong>

            <small>Approved certificates</small>
          </div>

          <div className="auditor-stat">
            <span>Pending</span>

            <strong className="gold-text">
              {loading ? "—" : data.pending_certificates}
            </strong>

            <small>Awaiting review</small>
          </div>
        </section>

        {/* MAIN GRID */}

        <section className="auditor-main-grid">
          {/* RECENT VERIFICATIONS */}

          <div className="auditor-card">
            <div className="card-heading">
              <div>
                <p>VERIFICATION ACTIVITY</p>

                <h2>Recent Verifications</h2>
              </div>

              <button className="small-button" onClick={loadDashboard}>
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="empty-state">
                Loading verification activity...
              </div>
            ) : data.recent_verifications.length === 0 ? (
              <div className="empty-state">
                <strong>No verification activity</strong>

                <span>Verification events will appear here.</span>
              </div>
            ) : (
              <div className="auditor-table-wrap">
                <table className="auditor-table">
                  <thead>
                    <tr>
                      <th>Certificate</th>
                      <th>Equipment</th>
                      <th>Integrity</th>
                      <th>Serial</th>
                      <th>Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.recent_verifications.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>
                            {item.certificate_number ||
                              `CERT-${item.certificate_id}`}
                          </strong>
                        </td>

                        <td>
                          <strong>{item.equipment_name || "—"}</strong>

                          <span>{item.equipment_id || "—"}</span>
                        </td>

                        <td>
                          <span
                            className={
                              item.hash_match
                                ? "status-badge verified"
                                : "status-badge failed"
                            }
                          >
                            {item.hash_match ? "MATCH" : "MISMATCH"}
                          </span>
                        </td>

                        <td>
                          {item.serial_match === null ||
                          item.serial_match === undefined ? (
                            "—"
                          ) : (
                            <span
                              className={
                                item.serial_match
                                  ? "status-badge verified"
                                  : "status-badge failed"
                              }
                            >
                              {item.serial_match ? "MATCH" : "MISMATCH"}
                            </span>
                          )}
                        </td>

                        <td>
                          {item.verified_at
                            ? new Date(item.verified_at).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* BLOCKCHAIN */}

          <div className="auditor-card">
            <div className="card-heading">
              <div>
                <p>BLOCKCHAIN INTEGRITY</p>

                <h2>Certificate Integrity</h2>
              </div>
            </div>

            <div className="integrity-row">
              <div className="integrity-icon success">✓</div>

              <div>
                <span>Blockchain Registered</span>

                <strong>{loading ? "—" : data.blockchain_registered}</strong>
              </div>
            </div>

            <div className="integrity-row">
              <div className="integrity-icon warning">!</div>

              <div>
                <span>Issues Reported</span>

                <strong>{loading ? "—" : data.total_issues}</strong>
              </div>
            </div>

            <div className="integrity-row">
              <div className="integrity-icon danger">×</div>

              <div>
                <span>Rejected Certificates</span>

                <strong>{loading ? "—" : data.rejected_certificates}</strong>
              </div>
            </div>

            <div className="integrity-flow">
              <div>
                <strong>Certificate</strong>
                <span>Stored</span>
              </div>

              <b>→</b>

              <div>
                <strong>SHA-256</strong>
                <span>Compare</span>
              </div>

              <b>→</b>

              <div>
                <strong>Blockchain</strong>
                <span>Verify</span>
              </div>
            </div>
          </div>
        </section>

        {/* AUDIT PRINCIPLE */}

        <section className="auditor-info">
          <div className="info-symbol">!</div>

          <div>
            <p>AUDIT PRINCIPLE</p>

            <h2>Verify the record, not just the paperwork.</h2>

            <span>
              MedLedger compares certificate fingerprints against their
              registered integrity records and surfaces mismatches for auditor
              review.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AuditorDashboard;
