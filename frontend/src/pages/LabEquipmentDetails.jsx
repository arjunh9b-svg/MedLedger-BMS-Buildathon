import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/LabEquipments.css";

function LabEquipmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "https://medledger-bms-buildathon.onrender.com/api/lab/equipments"
        );

        const found = response.data.find(
          (item) => String(item.id) === String(id)
        );

        if (!found) {
          setError("Equipment record not found.");
          return;
        }

        setEquipment(found);
      } catch (err) {
        console.error("Lab equipment details error:", err);
        setError("Unable to load equipment details.");
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [id]);

  const logout = () => {
    navigate("/");
    window.location.reload();
  };

  const detailsPageStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "35px 42px 60px",
  };

  const backButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    marginBottom: "28px",
    padding: "9px 15px",
    border: "1px solid #ddd4d0",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#3b252d",
    fontSize: "13px",
    cursor: "pointer",
  };

  const headingStyle = {
    marginBottom: "28px",
  };

  const headingLabelStyle = {
    margin: "0 0 7px",
    color: "#648d79",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
  };

  const headingTitleStyle = {
    margin: "0",
    color: "#29191f",
    fontFamily: "Georgia, serif",
    fontSize: "34px",
    lineHeight: "1.2",
  };

  const headingSubtitleStyle = {
    display: "block",
    marginTop: "8px",
    color: "#75666b",
    fontSize: "14px",
  };

  const detailsGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    alignItems: "start",
  };

  const detailsCardStyle = {
    background: "#ffffff",
    border: "1px solid #eee7e3",
    borderRadius: "14px",
    padding: "25px 28px",
    boxShadow: "0 4px 16px rgba(41, 25, 31, 0.05)",
  };

  const fullCardStyle = {
    ...detailsCardStyle,
    gridColumn: "1 / -1",
  };

  const cardLabelStyle = {
    margin: "0 0 6px",
    color: "#648d79",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.4px",
  };

  const cardTitleStyle = {
    margin: "0 0 18px",
    color: "#29191f",
    fontFamily: "Georgia, serif",
    fontSize: "21px",
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    alignItems: "center",
    minHeight: "48px",
    borderBottom: "1px solid #eee8e5",
    gap: "20px",
  };

  const rowLabelStyle = {
    color: "#75666b",
    fontSize: "13px",
  };

  const rowValueStyle = {
    color: "#29191f",
    fontSize: "14px",
    fontWeight: "600",
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


      {/* DETAILS CONTENT */}
      <main style={detailsPageStyle}>

        <button
          style={backButtonStyle}
          onClick={() => navigate("/lab/equipments")}
        >
          ← Back to Equipments
        </button>


        {/* LOADING */}
        {loading && (
          <div className="lab-empty">
            <strong>
              Loading equipment details...
            </strong>
          </div>
        )}


        {/* ERROR */}
        {!loading && error && (
          <div className="lab-error">
            {error}
          </div>
        )}


        {/* DETAILS */}
        {!loading && !error && equipment && (
          <>

            {/* HEADING */}
            <div style={headingStyle}>

              <p style={headingLabelStyle}>
                LAB-TECH PORTAL
              </p>

              <h1 style={headingTitleStyle}>
                {equipment.name || "Equipment"}
              </h1>

              <span style={headingSubtitleStyle}>
                Equipment ID:{" "}
                {equipment.code || equipment.id}
              </span>

            </div>


            {/* TOP TWO CARDS */}
            <section style={detailsGridStyle}>

              {/* EQUIPMENT */}
              <div style={detailsCardStyle}>

                <p style={cardLabelStyle}>
                  EQUIPMENT INFORMATION
                </p>

                <h2 style={cardTitleStyle}>
                  Equipment Details
                </h2>

                <div style={rowStyle}>
                  <span style={rowLabelStyle}>
                    Equipment Code
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.code || "—"}
                  </strong>
                </div>

                <div style={rowStyle}>
                  <span style={rowLabelStyle}>
                    Equipment Name
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.name || "—"}
                  </strong>
                </div>

                <div style={rowStyle}>
                  <span style={rowLabelStyle}>
                    Manufacturer
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.manufacturer || "—"}
                  </strong>
                </div>

                <div style={rowStyle}>
                  <span style={rowLabelStyle}>
                    Model
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.model || "—"}
                  </strong>
                </div>

                <div
                  style={{
                    ...rowStyle,
                    borderBottom: "none",
                  }}
                >
                  <span style={rowLabelStyle}>
                    Serial Number
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.serial_number || "—"}
                  </strong>
                </div>

              </div>


              {/* HOSPITAL */}
              <div style={detailsCardStyle}>

                <p style={cardLabelStyle}>
                  LOCATION
                </p>

                <h2 style={cardTitleStyle}>
                  Hospital Information
                </h2>

                <div style={rowStyle}>
                  <span style={rowLabelStyle}>
                    Hospital
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.hospital || "—"}
                  </strong>
                </div>

                <div
                  style={{
                    ...rowStyle,
                    borderBottom: "none",
                  }}
                >
                  <span style={rowLabelStyle}>
                    Department
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.department || "—"}
                  </strong>
                </div>

              </div>


              {/* CALIBRATION */}
              <div style={fullCardStyle}>

                <p style={cardLabelStyle}>
                  CALIBRATION
                </p>

                <h2 style={cardTitleStyle}>
                  Certificate Information
                </h2>

                <div style={rowStyle}>
                  <span style={rowLabelStyle}>
                    Calibration Date
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.calibration_date || "—"}
                  </strong>
                </div>

                <div style={rowStyle}>
                  <span style={rowLabelStyle}>
                    Next Calibration
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.next_calibration_date || "—"}
                  </strong>
                </div>

                <div
                  style={{
                    ...rowStyle,
                    borderBottom: "none",
                  }}
                >
                  <span style={rowLabelStyle}>
                    Certificate Reference
                  </span>

                  <strong style={rowValueStyle}>
                    {equipment.certificate_reference || "—"}
                  </strong>
                </div>

              </div>

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default LabEquipmentDetails;
