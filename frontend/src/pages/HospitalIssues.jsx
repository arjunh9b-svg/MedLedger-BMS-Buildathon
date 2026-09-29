import { useEffect, useState } from "react";
import HospitalNavbar from "../components/HospitalNavbar";
import "../styles/HospitalIssues.css";

const API = "http://127.0.0.1:5000";

function HospitalIssues() {
  const [issues, setIssues] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [equipmentId, setEquipmentId] = useState("");
  const [issueSummary, setIssueSummary] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  /* =========================================================
     LOAD ISSUES + EQUIPMENT
     ========================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [issuesResponse, equipmentResponse] =
        await Promise.all([
          fetch(`${API}/api/issues`),
          fetch(`${API}/api/equipments`)
        ]);

      const issuesData = await issuesResponse.json();
      const equipmentData = await equipmentResponse.json();

      if (!issuesResponse.ok) {
        throw new Error(
          issuesData.error || "Failed to load issues"
        );
      }

      if (!equipmentResponse.ok) {
        throw new Error(
          equipmentData.error || "Failed to load equipment"
        );
      }

      setIssues(
        Array.isArray(issuesData)
          ? issuesData
          : []
      );

      setEquipment(
        Array.isArray(equipmentData)
          ? equipmentData
          : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     SELECTED EQUIPMENT
     ========================================================= */

  const selectedEquipment = equipment.find(
    (item) =>
      String(item.id) === String(equipmentId)
  );

  /* =========================================================
     REPORT ISSUE
     ========================================================= */

  const sendReport = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!equipmentId) {
      setError("Please select equipment.");
      return;
    }

    if (!issueSummary.trim()) {
      setError("Please enter an issue summary.");
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        `${API}/api/auditor/issues`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            equipment_id: Number(equipmentId),
            description: issueSummary.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to report issue"
        );
      }

      setMessage(
        "Issue reported successfully."
      );

      setEquipmentId("");
      setIssueSummary("");
      setShowForm(false);

      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     ISSUE COUNTS
     ========================================================= */

  const totalIssues = issues.length;

  const openIssues = issues.filter(
    (issue) =>
      issue.status === "OPEN"
  ).length;

  const investigatingIssues = issues.filter(
    (issue) =>
      issue.status === "INVESTIGATING"
  ).length;

  const resolvedIssues = issues.filter(
    (issue) =>
      issue.status === "RESOLVED"
  ).length;

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="hospital-issues-page">

      {/* SHARED HOSPITAL NAVBAR */}
      <HospitalNavbar />

      <main className="hospital-issues-content">

        {/* ===================================================
            HEADER
            =================================================== */}

        <div className="hospital-issues-heading">

          <div>
            <span className="hospital-issues-eyebrow">
              HOSPITAL PORTAL
            </span>

            <h1>
              Issues
            </h1>

            <p>
              Report and track equipment issues.
            </p>
          </div>

          <button
            type="button"
            className="hospital-report-button"
            onClick={() => {
              setShowForm(
                (previous) => !previous
              );

              setError("");
              setMessage("");
            }}
          >
            {showForm
              ? "Close"
              : "Report Issue"}
          </button>

        </div>

        {/* ===================================================
            SUCCESS MESSAGE
            =================================================== */}

        {message && (
          <div className="hospital-issue-message success">
            {message}
          </div>
        )}

        {/* ===================================================
            ERROR MESSAGE
            =================================================== */}

        {error && (
          <div className="hospital-issue-message error">
            {error}
          </div>
        )}

        {/* ===================================================
            REPORT ISSUE FORM
            =================================================== */}

        {showForm && (
          <section className="hospital-issue-form">

            <div className="hospital-form-heading">

              <span>
                NEW ISSUE
              </span>

              <h2>
                Report Equipment Issue
              </h2>

            </div>

            <form onSubmit={sendReport}>

              <div className="hospital-form-grid">

                {/* EQUIPMENT */}

                <div className="hospital-form-field">

                  <label>
                    Equipment
                  </label>

                  <select
                    value={equipmentId}
                    onChange={(event) =>
                      setEquipmentId(
                        event.target.value
                      )
                    }
                  >

                    <option value="">
                      Select equipment
                    </option>

                    {equipment.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                          {" — "}
                          {item.code}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* EQUIPMENT ID */}

                <div className="hospital-form-field">

                  <label>
                    Equipment ID
                  </label>

                  <input
                    value={
                      selectedEquipment?.code || ""
                    }
                    readOnly
                    placeholder="Equipment ID"
                  />

                </div>

                {/* EQUIPMENT NAME */}

                <div className="hospital-form-field">

                  <label>
                    Equipment Name
                  </label>

                  <input
                    value={
                      selectedEquipment?.name || ""
                    }
                    readOnly
                    placeholder="Equipment Name"
                  />

                </div>

              </div>

              {/* ISSUE SUMMARY */}

              <div className="hospital-form-field">

                <label>
                  Issue Summary
                </label>

                <textarea
                  rows="5"
                  value={issueSummary}
                  onChange={(event) =>
                    setIssueSummary(
                      event.target.value
                    )
                  }
                  placeholder="Describe the equipment issue..."
                />

              </div>

              {/* FORM FOOTER */}

              <div className="hospital-form-footer">

                <span>
                  Reported by Hospital
                </span>

                <button
                  type="submit"
                  className="hospital-send-button"
                  disabled={sending}
                >
                  {sending
                    ? "Sending..."
                    : "Send Report"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ===================================================
            ISSUE STATISTICS
            =================================================== */}

        <section className="hospital-issue-stats">

          <div className="hospital-issue-stat">

            <span>
              TOTAL ISSUES
            </span>

            <strong>
              {totalIssues}
            </strong>

          </div>

          <div className="hospital-issue-stat">

            <span>
              OPEN
            </span>

            <strong>
              {openIssues}
            </strong>

          </div>

          <div className="hospital-issue-stat">

            <span>
              INVESTIGATING
            </span>

            <strong>
              {investigatingIssues}
            </strong>

          </div>

          <div className="hospital-issue-stat">

            <span>
              RESOLVED
            </span>

            <strong>
              {resolvedIssues}
            </strong>

          </div>

        </section>

        {/* ===================================================
            ISSUE REGISTER
            =================================================== */}

        <section className="hospital-issue-list-section">

          <div className="hospital-section-title">

            <span>
              ISSUE REGISTER
            </span>

            <h2>
              Reported Issues
            </h2>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="hospital-empty-state">
              Loading issues...
            </div>

          ) : issues.length === 0 ? (

            /* EMPTY */

            <div className="hospital-empty-state">
              No issues reported yet.
            </div>

          ) : (

            /* ISSUE LIST */

            <div className="hospital-issue-list">

              {issues.map(
                (issue) => (

                  <article
                    key={issue.issue_id}
                    className="hospital-issue-card"
                  >

                    {/* CARD TOP */}

                    <div className="hospital-issue-card-top">

                      <div>

                        <span className="hospital-issue-id">
                          {issue.issue_id}
                        </span>

                        <h3>
                          {issue.equipment_name}
                        </h3>

                        <p>
                          {issue.equipment_code}
                          {" • "}
                          ID {issue.equipment_id}
                        </p>

                      </div>

                      <span
                        className={
                          `hospital-issue-status ${
                            issue.status
                              ? issue.status.toLowerCase()
                              : "open"
                          }`
                        }
                      >
                        {issue.status}
                      </span>

                    </div>

                    {/* ISSUE DESCRIPTION */}

                    <div className="hospital-issue-description">

                      <label>
                        ISSUE SUMMARY
                      </label>

                      <p>
                        {issue.description}
                      </p>

                    </div>

                    {/* FOOTER */}

                    <div className="hospital-issue-footer">

                      <span>
                        Reported{" "}
                        {issue.created_at
                          ? new Date(
                              issue.created_at
                            ).toLocaleString()
                          : ""}
                      </span>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default HospitalIssues;