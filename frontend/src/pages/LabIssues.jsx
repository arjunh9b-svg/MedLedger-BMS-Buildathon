import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/LabIssues.css";

function LabIssues() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const response = await axios.get(
        "https://medledger-bms-buildathon.onrender.com/api/issues"
      );

      setIssues(response.data);
    } catch (error) {
      console.error("Lab issues error:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "RESOLVED") {
      return "resolved";
    }

    if (status === "INVESTIGATING") {
      return "investigating";
    }

    return "open";
  };

  return (
    <div className="lab-issues-page">

      {/* NAVBAR */}
      <header className="lab-issues-navbar">

        <div
          className="lab-issues-brand"
          onClick={() => navigate("/lab")}
        >
          <div className="lab-issues-logo">M</div>
          <span>MEDLEDGER</span>
        </div>

        <nav className="lab-issues-nav">
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

        <div className="lab-issues-user">
          <div className="lab-issues-avatar">
            LT
          </div>

          <span>Lab-Tech</span>

          <button
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>

      </header>

      {/* CONTENT */}
      <main className="lab-issues-content">

        <div className="lab-issues-heading">
          <div>
            <p>LAB-TECH PORTAL</p>

            <h1>Issues</h1>

            <span>
              Review certificate and equipment issues requiring attention.
            </span>
          </div>
        </div>

        {/* SUMMARY */}
        <section className="issue-summary">

          <div className="issue-stat">
            <span>Total Issues</span>
            <strong>
              {loading ? "—" : issues.length}
            </strong>
          </div>

          <div className="issue-stat">
            <span>Open</span>
            <strong className="open-number">
              {loading
                ? "—"
                : issues.filter(
                    (issue) => issue.status === "OPEN"
                  ).length}
            </strong>
          </div>

          <div className="issue-stat">
            <span>Investigating</span>
            <strong className="investigating-number">
              {loading
                ? "—"
                : issues.filter(
                    (issue) =>
                      issue.status === "INVESTIGATING"
                  ).length}
            </strong>
          </div>

          <div className="issue-stat">
            <span>Resolved</span>
            <strong className="resolved-number">
              {loading
                ? "—"
                : issues.filter(
                    (issue) =>
                      issue.status === "RESOLVED"
                  ).length}
            </strong>
          </div>

        </section>

        {/* ISSUES */}
        <section className="lab-issues-card">

          <div className="lab-issues-card-header">
            <div>
              <p>ISSUE MANAGEMENT</p>
              <h2>Reported Issues</h2>
            </div>

            <button onClick={loadIssues}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="issues-empty">
              <div className="issues-empty-icon">
                M
              </div>

              <strong>Loading issues...</strong>
            </div>
          ) : issues.length === 0 ? (
            <div className="issues-empty">

              <div className="issues-empty-icon">
                ✓
              </div>

              <strong>No issues reported</strong>

              <span>
                Certificate and equipment issues will appear here.
              </span>

            </div>
          ) : (
            <div className="issues-table-wrapper">

              <table className="issues-table">

                <thead>
                  <tr>
                    <th>Issue</th>
                    <th>Equipment</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>

                  {issues.map((issue) => (
                    <tr key={issue.id}>

                      <td>
                        <strong>
                          {issue.title ||
                            `Issue #${issue.id}`}
                        </strong>

                        <span>
                          {issue.description ||
                            "No description"}
                        </span>
                      </td>

                      <td>
                        {issue.equipment_name ||
                          issue.equipment_id ||
                          "—"}
                      </td>

                      <td>
                        {issue.type ||
                          issue.issue_type ||
                          "General"}
                      </td>

                      <td>
                        <span
                          className={`issue-status ${getStatusClass(
                            issue.status
                          )}`}
                        >
                          {issue.status ||
                            "OPEN"}
                        </span>
                      </td>

                      <td>
                        {issue.created_at
                          ? new Date(
                              issue.created_at
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* INTEGRITY PANEL */}
        <section className="issues-integrity-panel">

          <div className="issues-integrity-left">

            <div className="issues-integrity-icon">
              !
            </div>

            <div>
              <p>ISSUE DETECTION</p>

              <h2>Certificate Integrity Monitoring</h2>

              <span>
                Verification failures can be reviewed and investigated
                from the laboratory workspace.
              </span>
            </div>

          </div>

          <div className="issues-integrity-flow">

            <div>
              <strong>Certificate</strong>
              <span>Upload</span>
            </div>

            <b>→</b>

            <div>
              <strong>SHA-256</strong>
              <span>Compare</span>
            </div>

            <b>→</b>

            <div>
              <strong>Issue</strong>
              <span>Review</span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default LabIssues;
