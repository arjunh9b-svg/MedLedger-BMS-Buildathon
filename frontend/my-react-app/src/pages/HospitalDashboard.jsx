import React, { useState } from "react";
import "../styles/HospitalDashboard.css";

function HospitalDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [search, setSearch] = useState("");

  const equipment = [
    {
      name: "Patient Monitor",
      model: "GE CARESCAPE B650",
      id: "EQ-004821",
      status: "VERIFIED",
    },
    {
      name: "Ventilator",
      model: "Dräger Evita V600",
      id: "EQ-004817",
      status: "VERIFIED",
    },
    {
      name: "Infusion Pump",
      model: "B. Braun Space",
      id: "EQ-004801",
      status: "DUE SOON",
    },
    {
      name: "ECG Machine",
      model: "Philips PageWriter",
      id: "EQ-004794",
      status: "VERIFIED",
    },
    {
      name: "Defibrillator",
      model: "ZOLL AED Pro",
      id: "EQ-004771",
      status: "REVIEW",
    },
    {
      name: "Ultrasound",
      model: "Philips Affiniti 70",
      id: "EQ-004752",
      status: "VERIFIED",
    },
  ];

  const menuItems = [
    "Dashboard",
    "Equipment",
    "Requests",
    "Usage Records",
    "Certifications",
    "Inspections",
    "Maintenance",
    "Audit Trail",
    "Reports",
    "Settings",
  ];

  const filteredEquipment = equipment.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(value) ||
      item.model.toLowerCase().includes(value) ||
      item.id.toLowerCase().includes(value)
    );
  });

  return (
    <div className="hospital-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="hospital-sidebar">

        <div className="sidebar-logo">
          <img src="/logo.png" alt="MedLedger" />
        </div>

        <div className="workspace-label">
          WORKSPACE
        </div>

        <div className="workspace-name">
          🏥 Hospital End
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-menu">

          {menuItems.map((item) => (
            <button
              key={item}
              className={`sidebar-item ${
                activeMenu === item ? "active" : ""
              }`}
              onClick={() => setActiveMenu(item)}
            >
              <span className="menu-icon">
                {getMenuIcon(item)}
              </span>

              <span>{item}</span>
            </button>
          ))}

        </nav>

        <div className="sidebar-bottom">

          <button className="sidebar-item">
            ⚙️
            <span>Settings</span>
          </button>

          <button
            className="sidebar-item logout"
            onClick={onLogout}
          >
            ↪
            <span>Sign out</span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="hospital-main">

        {/* Topbar */}
        <header className="hospital-topbar">

          <div className="search-container">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search equipment, ID or serial..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="topbar-right">

            <button className="notification-button">
              ♢
              <span className="notification-dot"></span>
            </button>

            <div className="user-profile">

              <div className="user-avatar">
                HA
              </div>

              <div>
                <strong>Hospital Admin</strong>
                <small>Hospital End</small>
              </div>

            </div>

          </div>

        </header>

        {/* =====================================================
            CONTENT
            ===================================================== */}

        <div className="hospital-content">

          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span>HOSPITAL WORKSPACE</span>
            <span> / </span>
            <strong>Dashboard</strong>
          </div>

          {/* Header */}
          <section className="dashboard-header">

            <div>
              <p className="eyebrow">
                HOSPITAL WORKSPACE
              </p>

              <h1>Good afternoon</h1>

              <p className="dashboard-description">
                Here's what's happening across your
                hospital equipment records.
              </p>
            </div>

            <div className="dashboard-actions">

              <button className="secondary-button">
                ◉ Live overview
              </button>

              <button className="primary-button">
                + Add equipment
              </button>

            </div>

          </section>

          {/* =====================================================
              LIVE STRIP
              ===================================================== */}

          <section className="live-strip">

            <div className="live-status">

              <span className="live-dot"></span>

              <strong>
                Hospital workspace is live
              </strong>

            </div>

            <div className="live-info">
              Records synced 2m ago
            </div>

            <div className="live-info">
              Open requests <strong>7</strong>
            </div>

            <div className="live-health">
              <span></span>
              System healthy
            </div>

          </section>

          {/* =====================================================
              STATISTICS
              ===================================================== */}

          <section className="stats-grid">

            <div className="stat-card">

              <div className="stat-top">
                <span>Total equipment</span>
                <span className="stat-symbol">▣</span>
              </div>

              <h2>1,248</h2>

              <p className="stat-positive">
                ↑ 6.4% this month
              </p>

            </div>

            <div className="stat-card">

              <div className="stat-top">
                <span>Verified</span>
                <span className="stat-symbol">✓</span>
              </div>

              <h2>1,231</h2>

              <p>
                98.6% of records
              </p>

            </div>

            <div className="stat-card">

              <div className="stat-top">
                <span>Certifications</span>
                <span className="stat-symbol">◇</span>
              </div>

              <h2>86</h2>

              <p>
                12 due this month
              </p>

            </div>

            <div className="stat-card attention">

              <div className="stat-top">
                <span>Needs attention</span>
                <span className="stat-symbol">!</span>
              </div>

              <h2>7</h2>

              <p>
                Review required
              </p>

            </div>

          </section>

          {/* =====================================================
              EQUIPMENT OVERVIEW
              ===================================================== */}

          <section className="equipment-overview">

            <div className="section-heading">

              <div>
                <p className="eyebrow">
                  EQUIPMENT
                </p>

                <h2>
                  Equipment overview
                </h2>
              </div>

              <button className="view-all">
                View all →
              </button>

            </div>

            <div className="equipment-summary">

              <div className="summary-card cleared">
                <span>Cleared</span>
                <strong>3</strong>
                <small>Ready for use</small>
              </div>

              <div className="summary-card soon">
                <span>Due soon</span>
                <strong>1</strong>
                <small>Within 30 days</small>
              </div>

              <div className="summary-card due">
                <span>Due</span>
                <strong>1</strong>
                <small>Action required</small>
              </div>

            </div>

          </section>

          {/* =====================================================
              TWO COLUMN SECTION
              ===================================================== */}

          <section className="dashboard-columns">

            {/* Needs attention */}
            <div className="attention-panel">

              <div className="attention-header">

                <div>
                  <p className="eyebrow">
                    ACTION REQUIRED
                  </p>

                  <h2>
                    Needs attention
                  </h2>
                </div>

                <span className="attention-count">
                  3
                </span>

              </div>

              <p className="attention-description">
                A quick view of equipment, requests
                and certification items that may need
                action.
              </p>

              <div className="attention-list">

                <div className="attention-item">

                  <div>
                    <strong>
                      CERTIFICATIONS EXPIRING
                    </strong>

                    <p>
                      12 records · Within 30 days
                    </p>
                  </div>

                  <span>
                    DUE SOON
                  </span>

                </div>

                <div className="attention-item">

                  <div>
                    <strong>
                      INSPECTIONS PENDING
                    </strong>

                    <p>
                      4 equipment records
                    </p>
                  </div>

                  <span>
                    PENDING
                  </span>

                </div>

                <div className="attention-item">

                  <div>
                    <strong>
                      MAINTENANCE DUE
                    </strong>

                    <p>
                      9 scheduled · Next 7 days
                    </p>
                  </div>

                  <span>
                    ON TRACK
                  </span>

                </div>

              </div>

            </div>

            {/* Recent Activity */}
            <div className="activity-panel">

              <div className="section-heading">

                <div>
                  <p className="eyebrow">
                    ACTIVITY
                  </p>

                  <h2>
                    Recent activity
                  </h2>
                </div>

                <button className="view-all">
                  View all →
                </button>

              </div>

              <div className="activity-list">

                <div className="activity-item">
                  <div className="activity-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Equipment verified
                    </strong>

                    <p>
                      Patient Monitor · EQ-004821
                    </p>

                    <small>
                      8 minutes ago
                    </small>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    +
                  </div>

                  <div>
                    <strong>
                      New equipment added
                    </strong>

                    <p>
                      Ultrasound · EQ-004752
                    </p>

                    <small>
                      32 minutes ago
                    </small>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    ◇
                  </div>

                  <div>
                    <strong>
                      Certification updated
                    </strong>

                    <p>
                      Ventilator · EQ-004817
                    </p>

                    <small>
                      1 hour ago
                    </small>
                  </div>
                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              EQUIPMENT TABLE
              ===================================================== */}

          <section className="equipment-table-section">

            <div className="section-heading">

              <div>
                <p className="eyebrow">
                  RECORDS
                </p>

                <h2>
                  Equipment records
                </h2>
              </div>

              <span className="record-count">
                {filteredEquipment.length} records
              </span>

            </div>

            <div className="equipment-table">

              <div className="table-header">
                <span>Equipment</span>
                <span>Equipment ID</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {filteredEquipment.map((item) => (

                <div
                  className="table-row"
                  key={item.id}
                >

                  <div className="equipment-name">

                    <div className="equipment-avatar">
                      ◈
                    </div>

                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.model}</small>
                    </div>

                  </div>

                  <span className="equipment-id">
                    {item.id}
                  </span>

                  <span
                    className={`status-badge ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                  <button className="row-action">
                    View →
                  </button>

                </div>

              ))}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

/* =====================================================
   ICON HELPERS
   ===================================================== */

function getMenuIcon(item) {
  const icons = {
    Dashboard: "⌂",
    Equipment: "▣",
    Requests: "↗",
    "Usage Records": "▤",
    Certifications: "✓",
    Inspections: "⌕",
    Maintenance: "⚙",
    "Audit Trail": "◇",
    Reports: "▥",
    Settings: "⚙",
  };

  return icons[item] || "•";
}

function getStatusClass(status) {
  if (status === "VERIFIED") {
    return "verified";
  }

  if (status === "DUE SOON") {
    return "due-soon";
  }

  if (status === "REVIEW") {
    return "review";
  }

  return "";
}

export default HospitalDashboard;