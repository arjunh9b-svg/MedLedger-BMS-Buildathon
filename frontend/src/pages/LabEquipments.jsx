import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/LabEquipments.css";

function LabEquipments() {
  const navigate = useNavigate();

  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEquipments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:5000/api/lab/equipments"
      );

      setEquipments(response.data);
    } catch (err) {
      console.error("Lab equipment error:", err);
      setError("Unable to load equipment records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipments();
  }, []);

  const logout = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="lab-equipments-page">

      {/* NAVBAR */}
      <header className="lab-navbar">

        <div
          className="lab-brand"
          onClick={() => navigate("/lab")}
        >
          <div className="lab-logo">M</div>
          <span>MEDLEDGER</span>
        </div>

        <nav className="lab-nav">
          <NavLink to="/lab">
            Dashboard
          </NavLink>

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

        <div className="lab-user">

          <div className="lab-avatar">
            LT
          </div>

          <span>
            Lab-Tech
          </span>

          <button
            className="lab-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* CONTENT */}
      <main className="lab-equipments-content">

        {/* PAGE HEADING */}
        <div className="lab-page-heading">

          <div>

            <p>
              LAB-TECH PORTAL
            </p>

            <h1>
              Equipment
            </h1>

            <span>
              View registered medical equipment and calibration records.
            </span>

          </div>

        </div>


        {/* STATS */}
        <section className="lab-equipment-stats">

          <div className="lab-equipment-stat">
            <span>
              Total Equipment
            </span>

            <strong>
              {equipments.length}
            </strong>
          </div>


          <div className="lab-equipment-stat">
            <span>
              Registered
            </span>

            <strong>
              {equipments.length}
            </strong>
          </div>


          <div className="lab-equipment-stat">
            <span>
              Laboratory Records
            </span>

            <strong>
              {equipments.length}
            </strong>
          </div>

        </section>


        {/* EQUIPMENT TABLE */}
        <section className="lab-equipment-card">

          <div className="lab-equipment-card-header">

            <div>

              <p>
                EQUIPMENT REGISTRY
              </p>

              <h2>
                Registered Equipment
              </h2>

            </div>


            <button
              className="lab-refresh-btn"
              onClick={loadEquipments}
            >
              Refresh
            </button>

          </div>


          {/* LOADING */}
          {loading && (
            <div className="lab-loading">
              Loading equipment records...
            </div>
          )}


          {/* ERROR */}
          {!loading && error && (
            <div className="lab-error">
              {error}
            </div>
          )}


          {/* EMPTY */}
          {!loading &&
            !error &&
            equipments.length === 0 && (
              <div className="lab-empty">

                <strong>
                  No equipment registered yet.
                </strong>

                <span>
                  Registered equipment will appear here.
                </span>

              </div>
            )}


          {/* TABLE */}
          {!loading &&
            !error &&
            equipments.length > 0 && (

              <div className="lab-equipment-table-wrapper">

                <table className="lab-equipment-table">

                  <thead>

                    <tr>
                      <th>Code</th>
                      <th>Equipment</th>
                      <th>Manufacturer</th>
                      <th>Serial Number</th>
                      <th>Hospital</th>
                      <th>Department</th>
                      <th>Action</th>
                    </tr>

                  </thead>


                  <tbody>

                    {equipments.map((equipment) => (

                      <tr key={equipment.id}>

                        <td>
                          <span className="equipment-code">
                            {equipment.code || "—"}
                          </span>
                        </td>


                        <td>
                          <span className="equipment-name">
                            {equipment.name || "—"}
                          </span>
                        </td>


                        <td>
                          {equipment.manufacturer || "—"}
                        </td>


                        <td>
                          <span className="equipment-serial">
                            {equipment.serial_number || "—"}
                          </span>
                        </td>


                        <td>
                          {equipment.hospital || "—"}
                        </td>


                        <td>
                          {equipment.department || "—"}
                        </td>


                        <td>

                          <button
                            className="equipment-view-btn"
                            onClick={() =>
                              navigate(
                                `/lab/equipments/${equipment.id}`
                              )
                            }
                          >
                            View
                          </button>

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

export default LabEquipments;