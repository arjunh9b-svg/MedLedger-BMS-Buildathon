import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/Auditor.css";

const API = "http://127.0.0.1:5000";

function AuditorVerify() {
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const response = await axios.get(`${API}/api/equipments`);

        setEquipment(response.data || []);
      } catch (error) {
        console.error("Equipment loading error:", error);
      }
    };

    loadEquipment();
  }, []);

  const verifyCertificate = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      setResult({
        type: "error",
        message: "Please select equipment.",
      });

      return;
    }

    if (!file) {
      setResult({
        type: "error",
        message: "Please upload a certificate PDF.",
      });

      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("certificate", file);

      const response = await axios.post(
        `${API}/api/verify/${selectedId}`,
        formData,
      );

      const data = response.data;

      const verified =
        data.verified === true ||
        data.hash_match === true ||
        data.match === true;

      setResult({
        type: verified ? "success" : "error",

        message:
          data.message ||
          (verified
            ? "Certificate verified successfully."
            : "Certificate verification failed."),

        data: data,
      });
    } catch (error) {
      console.error("Certificate verification error:", error);

      setResult({
        type: "error",

        message:
          error.response?.data?.error || "Certificate verification failed.",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <p className="eyebrow">CERTIFICATE VERIFICATION</p>

            <h1>Verify Certificate</h1>

            <span>
              Compare a submitted certificate against its registered integrity
              record.
            </span>
          </div>
        </section>

        {/* VERIFICATION AREA */}

        <section className="verify-layout">
          {/* FORM */}

          <div className="auditor-card">
            <div className="card-heading">
              <div>
                <p>VERIFICATION REQUEST</p>

                <h2>Certificate Check</h2>
              </div>
            </div>

            <form className="auditor-form" onSubmit={verifyCertificate}>
              <label>
                Equipment
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  <option value="">Select equipment</option>

                  {equipment.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code || `EQ-${item.id}`}
                      {" — "}
                      {item.name || "Equipment"}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Certificate PDF
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                />
              </label>

              {file && (
                <div className="selected-file">
                  <strong>Selected certificate</strong>

                  <span>{file.name}</span>
                </div>
              )}

              <button
                type="submit"
                className="auditor-primary full-button"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Certificate"}
              </button>
            </form>
          </div>

          {/* PROCESS */}

          <div className="auditor-card verification-side">
            <p>VERIFICATION PROCESS</p>

            <div className="verify-step">
              <strong>01</strong>

              <span>Select registered equipment</span>
            </div>

            <div className="verify-step">
              <strong>02</strong>

              <span>Upload the certificate PDF</span>
            </div>

            <div className="verify-step">
              <strong>03</strong>

              <span>Calculate SHA-256 fingerprint</span>
            </div>

            <div className="verify-step">
              <strong>04</strong>

              <span>Compare the registered proof</span>
            </div>
          </div>
        </section>

        {/* RESULT */}

        {result && (
          <section className={`verification-result ${result.type}`}>
            <strong>
              {result.type === "success"
                ? "CERTIFICATE VERIFIED"
                : "VERIFICATION FAILED"}
            </strong>

            <span>{result.message}</span>

            {result.data && <pre>{JSON.stringify(result.data, null, 2)}</pre>}
          </section>
        )}
      </main>
    </div>
  );
}

export default AuditorVerify;
