import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auditor.css";

function AuditorAudit() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/auditor/dashboard")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load audit data");
        }
        return res.json();
      })
      .then((data) => {
        setEvents(data.recent_verifications || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to connect to the MedLedger backend.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="auditor-page">
      <header className="auditor-navbar">
        <div className="auditor-brand">
          <div className="auditor-logo">M</div>
          <strong>MedLedger</strong>
        </div>

        <nav className="auditor-nav">
          <Link to="/auditor">Dashboard</Link>
          <Link to="/auditor/verify">Verify Certificate</Link>
          <Link to="/auditor/equipment">Equipment Records</Link>
          <Link to="/auditor/issues">Issues</Link>
          <Link to="/auditor/audit" className="active">
            Audit Reports
          </Link>
        </nav>

        <div className="auditor-user">
          <span>Auditor</span>
          <div className="auditor-avatar">AU</div>
        </div>
      </header>

      <main className="auditor-content">
        <div className="auditor-heading">
          <div>
            <div className="eyebrow">AUDITOR PORTAL</div>
            <h1>Audit Reports</h1>
          </div>
        </div>

        <div className="auditor-card">
          <div className="card-heading">
            <div>
              <h2>Verification Activity</h2>
              <p>
                Recent certificate verification events recorded by MedLedger.
              </p>
            </div>
          </div>

          {loading && (
            <div className="empty-state">Loading audit records...</div>
          )}

          {error && <div className="empty-state">{error}</div>}

          {!loading && !error && events.length === 0 && (
            <div className="empty-state">
              No verification events have been recorded yet.
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="auditor-table-wrap">
              <table className="auditor-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Certificate</th>
                    <th>Hash</th>
                    <th>Serial</th>
                    <th>Blockchain</th>
                    <th>Verified At</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <strong>{event.equipment_id || "—"}</strong>
                        <br />
                        <span>
                          {event.equipment_name || "Unknown equipment"}
                        </span>
                      </td>

                      <td>{event.certificate_number || "—"}</td>

                      <td>
                        <span
                          className={
                            event.hash_match
                              ? "status-badge verified"
                              : "status-badge failed"
                          }
                        >
                          {event.hash_match ? "MATCH" : "MISMATCH"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            event.serial_match
                              ? "status-badge verified"
                              : "status-badge failed"
                          }
                        >
                          {event.serial_match ? "MATCH" : "MISMATCH"}
                        </span>
                      </td>

                      <td>
                        <span className="hash-text">
                          {event.blockchain_ref || "Not registered"}
                        </span>
                      </td>

                      <td>
                        {event.verified_at
                          ? new Date(event.verified_at).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="auditor-info">
          <div className="info-symbol">i</div>
          <div>
            <strong>Audit principle</strong>
            <p>
              Audit records show verification activity and the results returned
              by the MedLedger verification system. Blockchain references are
              displayed when available.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuditorAudit;
