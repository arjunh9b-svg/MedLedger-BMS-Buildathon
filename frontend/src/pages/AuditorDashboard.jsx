import { Link } from "react-router-dom";

function AuditorDashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>MedLedger</h1>
      <p>Auditor Portal</p>

      <hr />

      <h2>Auditor Dashboard</h2>
      <p>Verify certificates and review audit activity.</p>

      <div style={{ marginTop: "30px" }}>
        <Link to="/auditor/verify">
          Verify Certificate
        </Link>
      </div>

      <div style={{ marginTop: "15px" }}>
        <Link to="/auditor/inspection">
          Inspection
        </Link>
      </div>

      <div style={{ marginTop: "15px" }}>
        <Link to="/auditor/audit">
          Audit Trail
        </Link>
      </div>
    </div>
  );
}
 
export default AuditorDashboard;