import React, { useState } from "react";
import "../styles/AuditorDashboard.css";

function AuditorDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const auditStats = [
    {
      title: "Total Records",
      value: "1,248",
      description: "Records available",
      icon: "▣",
      type: "normal",
    },
    {
      title: "Verified Records",
      value: "1,231",
      description: "98.6% verified",
      icon: "✓",
      type: "verified",
    },
    {
      title: "Pending Review",
      value: "12",
      description: "Require auditor review",
      icon: "◷",
      type: "warning",
    },
    {
      title: "Flagged Records",
      value: "5",
      description: "Need investigation",
      icon: "!",
      type: "danger",
    },
  ];

  const recentAudits = [
    {
      id: "AUD-00981",
      equipment: "Patient Monitor",
      equipmentId: "EQ-004821",
      hospital: "City General Hospital",
      action: "Certification Updated",
      status: "Verified",
      time: "12 min ago",
    },
    {
      id: "AUD-00980",
      equipment: "Ventilator",
      equipmentId: "EQ-004817",
      hospital: "St. Mary's Medical Center",
      action: "Maintenance Record",
      status: "Verified",
      time: "28 min ago",
    },
    {
      id: "AUD-00979",
      equipment: "Infusion Pump",
      equipmentId: "EQ-004801",
      hospital: "City General Hospital",
      action: "Inspection Submitted",
      status: "Pending",
      time: "42 min ago",
    },
    {
      id: "AUD-00978",
      equipment: "Defibrillator",
      equipmentId: "EQ-004771",
      hospital: "Apollo Care Hospital",
      action: "Record Modified",
      status: "Flagged",
      time: "1 hr ago",
    },
    {
      id: "AUD-00977",
      equipment: "ECG Machine",
      equipmentId: "EQ-004794",
      hospital: "St. Mary's Medical Center",
      action: "Usage Record",
      status: "Verified",
      time: "2 hrs ago",
    },
  ];

  const attentionItems = [
    {
      title: "Records awaiting verification",
      description: "12 equipment records require auditor review.",
      status: "PENDING",
      icon: "◷",
    },
    {
      title: "Flagged audit entries",
      description: "5 records contain changes requiring investigation.",
      status: "REVIEW",
      icon: "!",
    },
    {
      title: "Certification discrepancies",
      description: "3 records contain mismatched certification details.",
      status: "CHECK",
      icon: "◇",
    },
  ];

  const menuItems = [
    "Dashboard",
    "Audit Records",
    "Equipment",
    "Certifications",
    "Inspections",
    "Compliance",
    "Reports",
    "Audit Trail",
  ];

  return (
    <div className="auditor-page">

      {/* ================= HEADER ================= */}

      <header className="auditor-header">

        <div className="auditor-brand">
          <img src="/logo.png" alt="MedLedger" />
        </div>

        <div className="auditor-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search equipment, ID or audit record..."
          />
        </div>

        <div className="auditor-header-right">

          <div className="notification-button">
            ♢
            <span className="notification-dot"></span>
          </div>

          <div className="auditor-user">

            <div className="auditor-avatar">
              A
            </div>

            <div className="auditor-user-info">
              <strong>Auditor Admin</strong>
              <span>Auditor End</span>
            </div>

            <span className="user-arrow">⌄</span>

          </div>

        </div>

      </header>

      {/* ================= MAIN LAYOUT ================= */}

      <div className="auditor-layout">

        {/* ================= SIDEBAR ================= */}

        <aside className="auditor-sidebar">

          <div className="workspace-label">
            WORKSPACE
          </div>

          <div className="workspace-name">
            <span className="workspace-symbol">✓</span>
            Auditor End
          </div>

          <nav className="auditor-nav">

            <div className="nav-section-title">
              MAIN MENU
            </div>

            {menuItems.map((item) => (
              <button
                key={item}
                className={`auditor-nav-item ${
                  activeMenu === item ? "active" : ""
                }`}
                onClick={() => setActiveMenu(item)}
              >
                <span className="nav-icon">
                  {item === "Dashboard" && "⌂"}
                  {item === "Audit Records" && "▣"}
                  {item === "Equipment" && "▤"}
                  {item === "Certifications" && "✓"}
                  {item === "Inspections" && "⌕"}
                  {item === "Compliance" && "◇"}
                  {item === "Reports" && "▥"}
                  {item === "Audit Trail" && "◷"}
                </span>

                <span>{item}</span>
              </button>
            ))}

          </nav>

          <div className="sidebar-bottom">

            <button className="sidebar-bottom-button">
              ⚙
              Settings
            </button>

            <button
              className="sidebar-bottom-button logout-button"
              onClick={onLogout}
            >
              ↪
              Sign out
            </button>

          </div>

        </aside>

        {/* ================= CONTENT ================= */}

        <main className="auditor-content">

          {/* Page Heading */}

          <section className="auditor-heading">

            <div>
              <div className="eyebrow">
                AUDITOR WORKSPACE
              </div>

              <h1>
                Audit overview
              </h1>

              <p>
                Review equipment records, certifications,
                compliance activity and audit trails.
              </p>
            </div>

            <div className="heading-actions">

              <button className="secondary-button">
                ↓ Export report
              </button>

              <button className="primary-button">
                + Start audit
              </button>

            </div>

          </section>

          {/* Live Strip */}

          <section className="auditor-status-strip">

            <div className="live-status">
              <span className="live-dot"></span>

              <strong>Audit system is live</strong>
            </div>

            <div className="status-divider"></div>

            <div>
              Last sync <strong>2 min ago</strong>
            </div>

            <div className="status-divider"></div>

            <div>
              Pending reviews <strong>12</strong>
            </div>

            <div className="status-divider"></div>

            <div className="system-status">
              <span>●</span>
              System healthy
            </div>

          </section>

          {/* Statistics */}

          <section className="auditor-stat-grid">

            {auditStats.map((stat) => (
              <div
                className={`auditor-stat-card ${stat.type}`}
                key={stat.title}
              >

                <div className="stat-top">

                  <div className="stat-icon">
                    {stat.icon}
                  </div>

                  <span className="stat-menu">
                    ⋮
                  </span>

                </div>

                <div className="stat-title">
                  {stat.title}
                </div>

                <div className="stat-value">
                  {stat.value}
                </div>

                <div className="stat-description">
                  {stat.description}
                </div>

              </div>
            ))}

          </section>

          {/* ================= TWO COLUMN SECTION ================= */}

          <section className="auditor-main-grid">

            {/* Audit activity */}

            <div className="audit-panel">

              <div className="panel-header">

                <div>
                  <div className="panel-eyebrow">
                    AUDIT ACTIVITY
                  </div>

                  <h2>
                    Recent audit records
                  </h2>
                </div>

                <button className="view-button">
                  View all →
                </button>

              </div>

              <div className="audit-table-wrapper">

                <table className="audit-table">

                  <thead>
                    <tr>
                      <th>Audit ID</th>
                      <th>Equipment</th>
                      <th>Action</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>

                  <tbody>

                    {recentAudits.map((audit) => (
                      <tr key={audit.id}>

                        <td>
                          <span className="audit-id">
                            {audit.id}
                          </span>
                        </td>

                        <td>

                          <div className="equipment-cell">

                            <strong>
                              {audit.equipment}
                            </strong>

                            <span>
                              {audit.equipmentId}
                            </span>

                          </div>

                        </td>

                        <td>
                          <div className="action-cell">
                            {audit.action}
                            <small>{audit.hospital}</small>
                          </div>
                        </td>

                        <td>

                          <span
                            className={`audit-status ${audit.status.toLowerCase()}`}
                          >
                            {audit.status}
                          </span>

                        </td>

                        <td>
                          <span className="audit-time">
                            {audit.time}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            {/* Needs attention */}

            <div className="attention-panel">

              <div className="attention-header">

                <div className="panel-eyebrow">
                  REVIEW QUEUE
                </div>

                <h2>
                  Needs attention
                </h2>

                <p>
                  Items that may require auditor action.
                </p>

              </div>

              <div className="attention-list">

                {attentionItems.map((item) => (
                  <div
                    className="attention-item"
                    key={item.title}
                  >

                    <div className="attention-icon">
                      {item.icon}
                    </div>

                    <div className="attention-info">

                      <strong>
                        {item.title}
                      </strong>

                      <span>
                        {item.description}
                      </span>

                    </div>

                    <span
                      className={`attention-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>

                  </div>
                ))}

              </div>

              <button className="attention-button">
                Open review queue →
              </button>

            </div>

          </section>

          {/* ================= COMPLIANCE SECTION ================= */}

          <section className="compliance-section">

            <div className="compliance-heading">

              <div>
                <div className="panel-eyebrow">
                  COMPLIANCE OVERVIEW
                </div>

                <h2>
                  Equipment record integrity
                </h2>
              </div>

              <span className="compliance-score">
                98.6%
              </span>

            </div>

            <div className="compliance-progress">

              <div className="progress-track">
                <div className="progress-fill"></div>
              </div>

            </div>

            <div className="compliance-details">

              <div>
                <strong>1,231</strong>
                <span>Verified records</span>
              </div>

              <div>
                <strong>12</strong>
                <span>Pending review</span>
              </div>

              <div>
                <strong>5</strong>
                <span>Flagged records</span>
              </div>

              <div>
                <strong>0</strong>
                <span>Critical issues</span>
              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default AuditorDashboard;