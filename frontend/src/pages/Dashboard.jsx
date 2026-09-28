import { Link } from "react-router-dom";
import {
  Package,
  FileCheck,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Activity,
  Building2,
} from "lucide-react";

import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/dashboard" className="dashboard-brand">
          <div className="dashboard-logo">M</div>
          <span>MEDLEDGER</span>
        </Link>

        <nav className="dashboard-nav">
          <Link to="/dashboard">Dashboard</Link>

          <Link to="/register">Register Equipment</Link>

          <Link to="/equipments">Equipments</Link>

          <Link to="/maintenance">Maintenance</Link>

          <Link to="/inspection">Inspection</Link>

          <Link to="/verify">Verify Documents</Link>

          <Link to="/audit">Audit Trail</Link>
        </nav>

        <div className="dashboard-user">
          <div className="user-avatar">DR</div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-top">
          <div>
            <p className="dashboard-eyebrow">MEDICAL EQUIPMENT MANAGEMENT</p>

            <h1>Dashboard</h1>

            <p className="dashboard-subtitle">
              Monitor equipment, certificates and verification activity.
            </p>
          </div>

          <Link to="/register" className="register-button">
            <Plus size={17} />
            Register Equipment
          </Link>
        </div>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Package size={20} />
            </div>

            <div className="stat-content">
              <span>Total Equipment</span>
              <strong>30</strong>
              <small>Registered records</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FileCheck size={20} />
            </div>

            <div className="stat-content">
              <span>Valid Certificates</span>
              <strong>24</strong>
              <small>Currently valid</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <Clock size={20} />
            </div>

            <div className="stat-content">
              <span>Due Soon</span>
              <strong>4</strong>
              <small>Within 30 days</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon danger">
              <AlertTriangle size={20} />
            </div>

            <div className="stat-content">
              <span>Overdue</span>
              <strong>2</strong>
              <small>Requires attention</small>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-card blockchain-card">
            <div className="card-heading">
              <div>
                <p className="card-label">BLOCKCHAIN</p>

                <h2>Integrity Status</h2>
              </div>

              <ShieldCheck size={22} />
            </div>

            <div className="blockchain-status">
              <div className="status-dot"></div>

              <div>
                <strong>Blockchain Connected</strong>

                <span>Equipment records are anchored on MST Blockchain.</span>
              </div>
            </div>

            <div className="blockchain-details">
              <div>
                <span>Registered records</span>
                <strong>30</strong>
              </div>

              <div>
                <span>Verified hashes</span>
                <strong>30</strong>
              </div>

              <div>
                <span>Integrity events</span>
                <strong>7</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-heading">
              <div>
                <p className="card-label">EQUIPMENT</p>

                <h2>Equipment Overview</h2>
              </div>

              <Link to="/equipments">
                <ArrowUpRight size={20} />
              </Link>
            </div>

            <div className="overview-list">
              <div className="overview-row">
                <div className="overview-icon">
                  <Activity size={17} />
                </div>

                <div>
                  <strong>Active Equipment</strong>
                  <span>Currently registered</span>
                </div>

                <b>27</b>
              </div>

              <div className="overview-row">
                <div className="overview-icon">
                  <Clock size={17} />
                </div>

                <div>
                  <strong>Maintenance Due</strong>
                  <span>Requires inspection</span>
                </div>

                <b>3</b>
              </div>

              <div className="overview-row">
                <div className="overview-icon">
                  <Building2 size={17} />
                </div>

                <div>
                  <strong>Laboratories</strong>
                  <span>Registered locations</span>
                </div>

                <b>5</b>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card activity-card">
          <div className="card-heading">
            <div>
              <p className="card-label">RECENT ACTIVITY</p>

              <h2>Latest Records</h2>
            </div>

            <Link to="/audit">
              View Audit Trail
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="activity-table">
            <div className="activity-header">
              <span>Equipment</span>
              <span>Event</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            <div className="activity-row">
              <div>
                <strong>Patient Monitor</strong>
                <small>ML-0001</small>
              </div>

              <span>Equipment registered</span>

              <span>14 Sep 2026</span>

              <b className="activity-success">Verified</b>
            </div>

            <div className="activity-row">
              <div>
                <strong>Infusion Pump</strong>
                <small>ML-0002</small>
              </div>

              <span>Certificate uploaded</span>

              <span>14 Sep 2026</span>

              <b className="activity-success">Verified</b>
            </div>

            <div className="activity-row">
              <div>
                <strong>ECG Machine</strong>
                <small>ML-0003</small>
              </div>

              <span>Calibration updated</span>

              <span>13 Sep 2026</span>

              <b className="activity-warning">Updated</b>
            </div>

            <div className="activity-row">
              <div>
                <strong>Ventilator</strong>
                <small>ML-0004</small>
              </div>

              <span>Maintenance required</span>

              <span>12 Sep 2026</span>

              <b className="activity-danger">Overdue</b>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
