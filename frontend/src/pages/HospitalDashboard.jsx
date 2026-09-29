import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/HospitalDashboard.css";

function HospitalDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/hospital/dashboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        return response.json();
      })
      .then((data) => {
        setDashboard(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load dashboard data.");
      });
  }, []);

  if (error) {
    return (
      <div className="dashboard-page">
        <DashboardHeader />

        <main className="dashboard-main">
          <div className="dashboard-top">
            <div>
              <p className="dashboard-eyebrow">HOSPITAL OVERVIEW</p>
              <h1>Dashboard</h1>
              <p className="dashboard-subtitle">
                Medical equipment and certificate overview.
              </p>
            </div>
          </div>

          <div className="error-message">{error}</div>
        </main>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-page">
        <DashboardHeader />

        <main className="dashboard-main">
          <div className="dashboard-top">
            <div>
              <p className="dashboard-eyebrow">HOSPITAL OVERVIEW</p>
              <h1>Dashboard</h1>
              <p className="dashboard-subtitle">Loading hospital records...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader />

      <main className="dashboard-main">
        {/* ================= TOP ================= */}

        <section className="dashboard-top">
          <div>
            <p className="dashboard-eyebrow">HOSPITAL OVERVIEW</p>

            <h1>Dashboard</h1>

            <p className="dashboard-subtitle">
              Medical equipment and certificate overview.
            </p>
          </div>

          <Link to="/lab/register" className="register-button">
            <span>+</span>
            Register Equipment
          </Link>
        </section>

        {/* ================= STATS ================= */}

        <section className="stats-grid">
          <StatCard
            icon="▣"
            title="Total Equipment"
            value={dashboard.equipment}
            description="Registered equipment"
          />

          <StatCard
            icon="✓"
            title="Verified Certificates"
            value={dashboard.verified_certificates}
            description="Hash verification matches"
            type="green"
          />

          <StatCard
            icon="◷"
            title="Due Soon"
            value={dashboard.due_soon}
            description="Within 30 days"
            type="warning"
          />

          <StatCard
            icon="!"
            title="Overdue"
            value={dashboard.overdue}
            description="Calibration overdue"
            type="danger"
          />
        </section>

        {/* ================= MAIN GRID ================= */}

        <section className="dashboard-grid">
          {/* BLOCKCHAIN */}

          <div className="dashboard-card blockchain-card">
            <div className="card-heading">
              <div>
                <p className="card-label">TRUST LAYER</p>

                <h2>MST Blockchain</h2>
              </div>

              <span>◆</span>
            </div>

            <div className="blockchain-status">
              <div className="status-dot"></div>

              <div>
                <strong>Blockchain Connected</strong>

                <span>
                  Certificate fingerprints are registered and verified through
                  MST Blockchain.
                </span>
              </div>
            </div>

            <div className="blockchain-details">
              <div>
                <span>Equipment</span>
                <strong>{dashboard.equipment}</strong>
              </div>

              <div>
                <span>Verified</span>
                <strong>{dashboard.verified_certificates}</strong>
              </div>

              <div>
                <span>Laboratories</span>
                <strong>{dashboard.laboratories}</strong>
              </div>
            </div>
          </div>

          {/* EQUIPMENT OVERVIEW */}

          <div className="dashboard-card">
            <div className="card-heading">
              <div>
                <p className="card-label">EQUIPMENT</p>

                <h2>Overview</h2>
              </div>

              <Link to="/hospital/equipment">View all →</Link>
            </div>

            <div className="overview-list">
              <div className="overview-row">
                <div className="overview-icon">▣</div>

                <div>
                  <strong>Total equipment</strong>

                  <span>Registered medical equipment</span>
                </div>

                <b>{dashboard.equipment}</b>
              </div>

              <div className="overview-row">
                <div className="overview-icon">✓</div>

                <div>
                  <strong>Active equipment</strong>

                  <span>Currently active records</span>
                </div>

                <b>{dashboard.active_equipment}</b>
              </div>

              <div className="overview-row">
                <div className="overview-icon">◷</div>

                <div>
                  <strong>Calibration due</strong>

                  <span>Within the next 30 days</span>
                </div>

                <b>{dashboard.due_soon}</b>
              </div>

              <div className="overview-row">
                <div className="overview-icon">!</div>

                <div>
                  <strong>Calibration overdue</strong>

                  <span>Requires attention</span>
                </div>

                <b>{dashboard.overdue}</b>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ACTIVITY ================= */}

        <section className="dashboard-card activity-card">
          <div className="card-heading">
            <div>
              <p className="card-label">RECENT ACTIVITY</p>

              <h2>Equipment Activity</h2>
            </div>

            <Link to="/hospital/equipment">View all →</Link>
          </div>

          {(dashboard.recent_records || []).length === 0 ? (
            <div className="empty-records">
              No equipment records have been registered yet.
            </div>
          ) : (
            <div className="activity-table">
              <div className="activity-header">
                <span>Equipment</span>
                <span>Activity</span>
                <span>Date</span>
                <span>Status</span>
              </div>

              {(dashboard.recent_records || []).map((record) => (
                <Link
                  key={record.id}
                  to={`/hospital/equipment/${record.id}`}
                  className="activity-row"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div>
                    <strong>{record.code}</strong>

                    <small>{record.equipment_name}</small>
                  </div>

                  <div>
                    <strong>Equipment Registered</strong>

                    <small>{record.manufacturer || "Medical equipment"}</small>
                  </div>

                  <span>{record.next_calibration_date || "Not scheduled"}</span>

                  <span className="activity-success">Registered</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* =========================
   HEADER
   ========================= */

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <Link to="/hospital" className="dashboard-brand">
        <div className="dashboard-logo">M</div>

        <span>MEDLEDGER</span>
      </Link>

      <nav className="dashboard-nav">
        <Link to="/hospital" className="active">
          Dashboard
        </Link>

        <Link to="/lab/register">Register Equipment</Link>

        <Link to="/hospital/equipment">Equipments</Link>

        <Link to="/hospital/maintenance">Maintenance</Link>

        <Link to="/auditor">Inspection</Link>

        <Link to="/auditor/verify">Verify Documents</Link>
      </nav>

      <div className="dashboard-user">
        <div className="user-avatar">DR</div>
      </div>
    </header>
  );
}

/* =========================
   STAT CARD
   ========================= */

function StatCard({ icon, title, value, description, type = "" }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${type}`}>{icon}</div>

      <div className="stat-content">
        <span>{title}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>
    </div>
  );
}

export default HospitalDashboard;
