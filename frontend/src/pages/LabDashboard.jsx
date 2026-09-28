import { Link } from "react-router-dom";

function LabDashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>MedLedger</h1>
      <p>Lab-Tech Portal</p>

      <hr />

      <h2>Lab-Tech Dashboard</h2>
      <p>Manage equipment registration and certificates.</p>

      <div style={{ marginTop: "30px" }}>
        <Link to="/lab/register">
          Register Equipment
        </Link>
      </div>

      <div style={{ marginTop: "15px" }}>
        <Link to="/lab/certificates">
          Registered Certificates
        </Link>
      </div>
    </div>
  );
}

export default LabDashboard;