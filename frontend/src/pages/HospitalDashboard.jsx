import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/HospitalDashboard.css";

const API = "http://127.0.0.1:5000";

function HospitalDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/hospital/dashboard`)
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
      <div className="hospital-dashboard-page">
        <HospitalNavbar />

        <main className="hospital-dashboard-main">
          <section className="hospital-dashboard-heading">
            <p className="hospital-eyebrow">HOSPITAL OVERVIEW</p>
            <h1>Dashboard</h1>
            <p>Medical equipment and certificate overview.</p>
          </section>

          <div className="hospital-error">
            {error}
          </div>
        </main>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="hospital-dashboard-page">
        <HospitalNavbar />

        <main className="hospital-dashboard-main">
          <section className="hospital-dashboard-heading">
            <p className="hospital-eyebrow">
              HOSPITAL OVERVIEW
            </p>

            <h1>Dashboard</h1>

            <p>
              Loading hospital records...
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="hospital-dashboard-page">

      <HospitalNavbar />

      <main className="hospital-dashboard-main">

        {/* HEADER */}
        <section className="hospital-dashboard-heading">

          <div>
            <p className="hospital-eyebrow">
              HOSPITAL OVERVIEW
            </p>

            <h1>
              Dashboard
            </h1>

            <p>
              Medical equipment and certificate overview.
            </p>
          </div>

          <Link
            to="/lab/register"
            className="hospital-register-button"
          >
            <span>+</span>
            Register Equipment
          </Link>

        </section>


        {/* STATS */}
        <section className="hospital-stats-grid">

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
            type="verified"
          />

          <StatCard
            icon="◷"
            title="Due Soon"
            value={dashboard.due_soon}
            description="Within 30 days"
            type="due"
          />

          <StatCard
            icon="!"
            title="Overdue"
            value={dashboard.overdue}
            description="Calibration overdue"
            type="overdue"
          />

        </section>


        {/* LOWER SECTION */}
        <section className="hospital-dashboard-grid">

          {/* BLOCKCHAIN */}
          <div className="hospital-card blockchain-card">

            <div className="hospital-card-heading">

              <div>
                <p>TRUST LAYER</p>
                <h2>MST Blockchain</h2>
              </div>

              <span className="blockchain-symbol">
                ◆
              </span>

            </div>


            <div className="blockchain-status">

              <div className="blockchain-status-dot"></div>

              <div>
                <strong>
                  Blockchain Connected
                </strong>

                <span>
                  Certificate fingerprints are registered and
                  verified through MST Blockchain.
                </span>
              </div>

            </div>


            <div className="blockchain-details">

              <div>
                <span>Equipment</span>
                <strong>
                  {dashboard.equipment}
                </strong>
              </div>

              <div>
                <span>Verified</span>
                <strong>
                  {dashboard.verified_certificates}
                </strong>
              </div>

              <div>
                <span>Laboratories</span>
                <strong>
                  {dashboard.laboratories}
                </strong>
              </div>

            </div>

          </div>


          {/* EQUIPMENT OVERVIEW */}
          <div className="hospital-card">

            <div className="hospital-card-heading">

              <div>
                <p>EQUIPMENT</p>
                <h2>Overview</h2>
              </div>

              <Link to="/hospital/equipment">
                View all →
              </Link>

            </div>


            <div className="hospital-overview-list">

              <OverviewRow
                icon="▣"
                title="Total equipment"
                description="Registered medical equipment"
                value={dashboard.equipment}
              />

              <OverviewRow
                icon="✓"
                title="Active equipment"
                description="Currently active records"
                value={dashboard.active_equipment}
              />

              <OverviewRow
                icon="◷"
                title="Calibration due"
                description="Within the next 30 days"
                value={dashboard.due_soon}
              />

              <OverviewRow
                icon="!"
                title="Calibration overdue"
                description="Requires attention"
                value={dashboard.overdue}
              />

            </div>

          </div>

        </section>


        {/* RECENT ACTIVITY */}
        <section className="hospital-card hospital-activity-card">

          <div className="hospital-card-heading">

            <div>
              <p>RECENT ACTIVITY</p>
              <h2>Equipment Activity</h2>
            </div>

            <Link to="/hospital/equipment">
              View all →
            </Link>

          </div>


          {(dashboard.recent_records || []).length === 0 ? (

            <div className="hospital-empty">
              No equipment records have been registered yet.
            </div>

          ) : (

            <div className="hospital-activity-list">

              <div className="hospital-activity-header">
                <span>Equipment</span>
                <span>Activity</span>
                <span>Date</span>
                <span>Status</span>
              </div>


              {(dashboard.recent_records || []).map((record) => (

                <Link
                  key={record.id}
                  to={`/hospital/equipment/${record.id}`}
                  className="hospital-activity-row"
                >

                  <div>
                    <strong>
                      {record.code}
                    </strong>

                    <small>
                      {record.equipment_name}
                    </small>
                  </div>


                  <div>
                    <strong>
                      Equipment Registered
                    </strong>

                    <small>
                      {record.manufacturer ||
                        "Medical equipment"}
                    </small>
                  </div>


                  <span>
                    {record.next_calibration_date ||
                      "Not scheduled"}
                  </span>


                  <span className="hospital-activity-success">
                    Registered
                  </span>

                </Link>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}


/* =========================================
   HOSPITAL NAVBAR
========================================= */

function HospitalNavbar() {

  const logout = () => {
    window.location.href = "/";
  };

  return (
    <header className="hospital-navbar">

      {/* BRAND */}
      <Link
        to="/hospital"
        className="hospital-brand"
      >

        <div className="hospital-logo">
          M
        </div>

        <span>
          MEDLEDGER
        </span>

      </Link>


      {/* NAVIGATION */}
      <nav className="hospital-nav">

        <Link
          to="/hospital"
          className="active"
        >
          Dashboard
        </Link>


        <Link to="/lab/register">
          Register Equipment
        </Link>


        <Link to="/hospital/equipment">
          Equipments
        </Link>


        {/* LAB SELECTION */}
        <Link to="/hospital/lab-selection">
          Lab Selection
        </Link>


        <Link to="/hospital/maintenance">
          Maintenance
        </Link>

      </nav>


      {/* USER */}
      <div className="hospital-user">

        <div className="hospital-avatar">
          DR
        </div>

        <span className="hospital-admin">
          Admin
        </span>

        <button
          type="button"
          className="hospital-logout"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}


/* =========================================
   STAT CARD
========================================= */

function StatCard({
  icon,
  title,
  value,
  description,
  type = "",
}) {
  return (
    <div className="hospital-stat-card">

      <div className={`hospital-stat-icon ${type}`}>
        {icon}
      </div>

      <div className="hospital-stat-content">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {description}
        </small>

      </div>

    </div>
  );
}


/* =========================================
   OVERVIEW ROW
========================================= */

function OverviewRow({
  icon,
  title,
  description,
  value,
}) {
  return (
    <div className="hospital-overview-row">

      <div className="hospital-overview-icon">
        {icon}
      </div>

      <div>
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>

      <b>
        {value}
      </b>

    </div>
  );
}


export default HospitalDashboard;

