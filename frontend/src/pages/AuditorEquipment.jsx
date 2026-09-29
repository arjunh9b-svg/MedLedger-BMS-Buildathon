import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/Auditor.css";

const API = "http://127.0.0.1:5000";

function AuditorEquipment() {
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEquipment = async () => {
    try {
      const response = await axios.get(`${API}/api/equipments`);

      setEquipment(response.data || []);
    } catch (error) {
      console.error("Equipment loading error:", error);

      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
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
            <p className="eyebrow">AUDITOR WORKSPACE</p>

            <h1>Equipment Records</h1>

            <span>
              Review registered medical equipment and certificate information.
            </span>
          </div>
        </section>

        {/* EQUIPMENT TABLE */}

        <section className="auditor-card">
          <div className="card-heading">
            <div>
              <p>EQUIPMENT REGISTRY</p>

              <h2>Registered Equipment</h2>
            </div>

            <button className="small-button" onClick={loadEquipment}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="empty-state">Loading equipment...</div>
          ) : equipment.length === 0 ? (
            <div className="empty-state">
              <strong>No equipment records</strong>

              <span>Registered equipment will appear here.</span>
            </div>
          ) : (
            <div className="auditor-table-wrap">
              <table className="auditor-table">
                <thead>
                  <tr>
                    <th>Equipment ID</th>
                    <th>Equipment</th>
                    <th>Manufacturer</th>
                    <th>Serial Number</th>
                    <th>Hospital</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {equipment.map((item) => (
                    <tr
                      key={item.id}
                      className="clickable-row"
                      onClick={() => navigate(`/auditor/equipment/${item.id}`)}
                    >
                      <td>
                        <strong>{item.code || `EQ-${item.id}`}</strong>
                      </td>

                      <td>
                        <strong>{item.name || "—"}</strong>

                        <span>{item.model || "—"}</span>
                      </td>

                      <td>{item.manufacturer || "—"}</td>

                      <td>{item.serial_number || item.serial || "—"}</td>

                      <td>{item.hospital || item.lab || "—"}</td>

                      <td>
                        <span className="record-status">
                          {item.status || item.inspection_state || "REGISTERED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AuditorEquipment;
