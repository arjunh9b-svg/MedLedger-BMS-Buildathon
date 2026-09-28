import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, ShieldX, Upload, FileText, Search } from "lucide-react";
import axios from "axios";

import Navbar from "../components/Navbar";
import "../styles/VerifyDocuments.css";

function VerifyDocuments() {
  const { id } = useParams();

  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getEquipments();
  }, []);

  useEffect(() => {
    if (!id || equipments.length === 0) {
      return;
    }

    const equipment = equipments.find((item) => item.id === Number(id));

    if (equipment) {
      selectEquipment(equipment);
    }
  }, [id, equipments]);

  const getEquipments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("http://127.0.0.1:5000/api/equipments");

      setEquipments(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not load equipment records.");
    } finally {
      setLoading(false);
    }
  };

  const selectEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setCertificate(null);
    setResult(null);
    setError("");
  };

  const handleCertificateChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setCertificate(null);
      setError("Only PDF certificates are allowed.");
      return;
    }

    setCertificate(file);
    setResult(null);
    setError("");
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    if (!selectedEquipment) {
      setError("Please select equipment.");
      return;
    }

    if (!certificate) {
      setError("Please upload a certificate.");
      return;
    }

    try {
      setVerifying(true);
      setError("");
      setResult(null);

      const formData = new FormData();

      formData.append("certificate", certificate);

      const response = await axios.post(
        `http://127.0.0.1:5000/api/verify/${selectedEquipment.id}`,
        formData,
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.error || "Certificate verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  const shortenHash = (hash) => {
    if (!hash) {
      return "No hash available";
    }

    if (hash.length <= 35) {
      return hash;
    }

    return `${hash.slice(0, 18)}...${hash.slice(-12)}`;
  };

  if (loading) {
    return (
      <div>
        <Navbar />

        <main className="verify-page">
          <div className="verify-loading">Loading verification records...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main className="verify-page">
        {/* HEADER */}

        <div className="verify-header">
          <p className="verify-eyebrow">DOCUMENT INTEGRITY</p>

          <h1>Verify Documents</h1>

          <p>
            Compare a certificate against its registered SHA-256 fingerprint.
          </p>
        </div>

        {/* MAIN GRID */}

        <div className="verify-layout">
          {/* EQUIPMENT LIST */}

          <section className="verify-equipment-panel">
            <div className="verify-panel-header">
              <div>
                <p>REGISTERED EQUIPMENT</p>
                <h2>Select Equipment</h2>
              </div>

              <Search size={17} />
            </div>

            <div className="verify-equipment-list">
              {equipments.length === 0 && (
                <div className="verify-no-equipment">
                  No registered equipment.
                </div>
              )}

              {equipments.map((equipment) => (
                <button
                  key={equipment.id}
                  type="button"
                  className={`verify-equipment-item ${
                    selectedEquipment?.id === equipment.id ? "selected" : ""
                  }`}
                  onClick={() => selectEquipment(equipment)}
                >
                  <div>
                    <strong>{equipment.equipment_name}</strong>

                    <span>
                      {equipment.manufacturer || "Unknown manufacturer"}

                      {" · "}

                      {equipment.model || "Unknown model"}
                    </span>

                    <small>
                      {equipment.code ||
                        `EQ-${String(equipment.id).padStart(5, "0")}`}

                      {" · "}

                      {equipment.serial_number}
                    </small>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* VERIFICATION PANEL */}

          <section className="verify-main-panel">
            {!selectedEquipment ? (
              <div className="verify-placeholder">
                <div className="verify-placeholder-icon">
                  <ShieldCheck size={25} />
                </div>

                <h2>Select equipment</h2>

                <p>
                  Choose a registered equipment record to verify its
                  certificate.
                </p>
              </div>
            ) : (
              <>
                {/* SELECTED EQUIPMENT */}

                <div className="verify-selected">
                  <div>
                    <p className="verify-label">VERIFYING</p>

                    <h2>{selectedEquipment.equipment_name}</h2>

                    <span>
                      {selectedEquipment.code ||
                        `EQ-${String(selectedEquipment.id).padStart(5, "0")}`}

                      {" · "}

                      {selectedEquipment.serial_number}
                    </span>
                  </div>

                  <div className="verify-selected-icon">
                    <FileText size={20} />
                  </div>
                </div>

                {/* UPLOAD FORM */}

                <form onSubmit={handleVerify} className="verify-form">
                  <label className="verify-upload">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleCertificateChange}
                    />

                    <Upload size={23} />

                    <strong>
                      {certificate ? certificate.name : "Upload certificate"}
                    </strong>

                    <span>PDF files only</span>
                  </label>

                  <button
                    type="submit"
                    className="verify-button"
                    disabled={verifying}
                  >
                    <ShieldCheck size={15} />

                    {verifying ? "Verifying..." : "Verify Certificate"}
                  </button>
                </form>

                {/* ERROR */}

                {error && (
                  <div className="verify-error">
                    <ShieldX size={16} />

                    <span>{error}</span>
                  </div>
                )}

                {/* RESULT */}

                {result && (
                  <div
                    className={`verify-result ${
                      result.verified ? "verified" : "not-verified"
                    }`}
                  >
                    <div className="verify-result-header">
                      <div className="verify-result-icon">
                        {result.verified ? (
                          <ShieldCheck size={25} />
                        ) : (
                          <ShieldX size={25} />
                        )}
                      </div>

                      <div>
                        <p>DOCUMENT STATUS</p>

                        <h2>{result.verified ? "VERIFIED" : "NOT VERIFIED"}</h2>
                      </div>
                    </div>

                    <div className="verify-message">{result.message}</div>

                    {/* DETAILS */}

                    <div className="verify-details">
                      <div>
                        <span>Equipment</span>

                        <strong>{result.equipment_name}</strong>
                      </div>

                      <div>
                        <span>Certificate Reference</span>

                        <strong>
                          {result.certificate_reference || "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Registered SHA-256</span>

                        <code>{shortenHash(result.stored_hash)}</code>
                      </div>

                      <div>
                        <span>Uploaded SHA-256</span>

                        <code>{shortenHash(result.uploaded_hash)}</code>
                      </div>
                    </div>

                    {/* VERIFIED */}

                    {result.verified && (
                      <div className="verify-success">
                        <ShieldCheck size={15} />

                        <span>
                          The uploaded certificate matches the registered
                          fingerprint.
                        </span>
                      </div>
                    )}

                    {/* TAMPER DETECTED */}

                    {!result.verified && (
                      <div className="verify-warning">
                        <ShieldX size={15} />

                        <span>
                          The uploaded certificate fingerprint does not match
                          the registered record.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default VerifyDocuments;
