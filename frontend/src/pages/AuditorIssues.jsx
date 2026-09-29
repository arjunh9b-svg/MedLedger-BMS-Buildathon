import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/Auditor.css";

const API = "http://127.0.0.1:5000";

function AuditorIssues() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIssues = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API}/api/issues`);

      setIssues(response.data || []);
    } catch (err) {
      console.error("Database issue loading error:", err);

      setIssues([]);

      setError("Could not load issues from the database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const logout = () => {
    window.location.href = "/";
  };

  const getStatus = (issue) => {
    return issue.status || "OPEN";
  };

  const openIssues = issues.filter(
    (issue) => getStatus(issue).toUpperCase() === "OPEN",
  ).length;

  const resolvedIssues = issues.filter(
    (issue) => getStatus(issue).toUpperCase() === "RESOLVED",
  ).length;

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
            <p className="eyebrow">AUDITOR WORKSPACE</p>

            <h1>Reported Issues</h1>

            <span>
              Review equipment issues recorded during verification and audit
              activities.
            </span>
          </div>
        </section>

        {/* ISSUE STATS */}

        <section className="auditor-stats">
          <div className="auditor-stat">
            <span>Total Issues</span>

            <strong>{loading ? "—" : issues.length}</strong>

            <small>Database records</small>
          </div>

          <div className="auditor-stat">
            <span>Open</span>

            <strong className="gold-text">{loading ? "—" : openIssues}</strong>

            <small>Requires attention</small>
          </div>

          <div className="auditor-stat">
            <span>Resolved</span>

            <strong className="green-text">
              {loading ? "—" : resolvedIssues}
            </strong>

            <small>Completed issues</small>
          </div>
        </section>

        {/* DATABASE TABLE */}

        <section className="auditor-card">
          <div className="card-heading">
            <div>
              <p>DATABASE ISSUE REGISTRY</p>

              <h2>Issue Records</h2>
            </div>

            <button className="small-button" onClick={loadIssues}>
              Refresh
            </button>
          </div>

          {loading && (
            <div className="empty-state">Loading issues from database...</div>
          )}

          {!loading && error && (
            <div className="empty-state">
              <strong>Database connection error</strong>

              <span>{error}</span>

              <button className="small-button" onClick={loadIssues}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && issues.length === 0 && (
            <div className="empty-state">
              <strong>No issues reported</strong>

              <span>Issues stored in PostgreSQL will appear here.</span>
            </div>
          )}

          {!loading && !error && issues.length > 0 && (
            <div className="auditor-table-wrap">
              <table className="auditor-table">
                <thead>
                  <tr>
                    <th>Issue ID</th>
                    <th>Equipment</th>
                    <th>Status</th>
                    <th>Evidence Hash</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {issues.map((issue) => {
                    const status = getStatus(issue);

                    return (
                      <tr key={issue.id || issue.issue_id}>
                        <td>
                          <strong>
                            {issue.issue_id || `ISSUE-${issue.id}`}
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {issue.equipment_code ||
                              issue.equipment_id ||
                              "Unknown"}
                          </strong>

                          {issue.equipment_name && (
                            <span>{issue.equipment_name}</span>
                          )}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${status.toLowerCase()}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          <span className="hash-text">
                            {issue.evidence_hash
                              ? `${issue.evidence_hash.slice(0, 14)}...`
                              : "—"}
                          </span>
                        </td>

                        <td>
                          {issue.created_at
                            ? new Date(issue.created_at).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AuditorIssues;
