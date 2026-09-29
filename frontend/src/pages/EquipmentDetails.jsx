import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";

import HospitalNavbar from "../components/HospitalNavbar";
import "../styles/EquipmentDetails.css";

function EquipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEquipment();
  }, [id]);

  const getEquipment = async () => {
    try {
      const response = await axios.get(
        `https://medledger-bms-buildathon.onrender.com/api/equipments/${id}`,
      );

      setEquipment(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not load equipment record.");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (date) => {
    if (!date) return "Valid";

    const today = new Date();
    const due = new Date(date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diff = (due - today) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "Overdue";
    if (diff <= 30) return "Due Soon";

    return "Valid";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const viewPdf = (filename) => {
    if (!filename) return;

    window.open(
      `https://medledger-bms-buildathon.onrender.com/uploads/${filename}`,
      "_blank",
    );
  };

  if (loading) {
    return (
      <div>
        <HospitalNavbar />

        <main className="details-page">
          <div className="details-loading">
            Loading equipment record...
          </div>
        </main>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div>
        <HospitalNavbar />

        <main className="details-page">
          <div className="details-error">
            {error || "Equipment record not found."}
          </div>
        </main>
      </div>
    );
  }

  const status = getStatus(equipment.next_calibration_date);

  const statusIcon =
    status === "Valid" ? (
      <CheckCircle2 size={15} />
    ) : status === "Due Soon" ? (
      <Clock3 size={15} />
    ) : (
      <AlertCircle size={15} />
    );

  return (
    <div>
      <HospitalNavbar />

      <main className="details-page">

        {/* HEADER */}

        <div className="details-top">
          <button
            className="back-button"
            onClick={() => navigate("/hospital/equipment")}
          >
            <ArrowLeft size={15} />
            Equipments
          </button>

          <div className="details-heading">
            <div className="details-heading-left">
              <p className="details-label">
                EQUIPMENT RECORD
              </p>

              <h1>{equipment.equipment_name}</h1>

              <p className="details-subtitle">
                {equipment.manufacturer} · {equipment.model}
              </p>

              <div className="details-meta">
                <span>{equipment.id}</span>
                <span>•</span>
                <span>{equipment.serial_number}</span>
              </div>
            </div>

            <div
              className={`record-status ${status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {statusIcon}
              <span>{status}</span>
            </div>
          </div>
        </div>

        {/* MACHINE INFORMATION */}

        <section className="record-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">
                MACHINE INFORMATION
              </p>

              <h2>Equipment details</h2>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span>Equipment ID</span>
              <strong>{equipment.id}</strong>
            </div>

            <div className="info-item">
              <span>Device Name</span>
              <strong>{equipment.equipment_name}</strong>
            </div>

            <div className="info-item">
              <span>Manufacturer</span>
              <strong>{equipment.manufacturer}</strong>
            </div>

            <div className="info-item">
              <span>Model / Type</span>
              <strong>{equipment.model}</strong>
            </div>

            <div className="info-item">
              <span>Serial Number</span>
              <strong>{equipment.serial_number}</strong>
            </div>

            <div className="info-item">
              <span>Hospital</span>
              <strong>
                {equipment.hospital || "—"}
              </strong>
            </div>

            <div className="info-item">
              <span>Department / Location</span>
              <strong>
                {equipment.department || "—"}
              </strong>
            </div>
          </div>
        </section>

        {/* CALIBRATION */}

        <section className="record-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">
                CALIBRATION
              </p>

              <h2>Calibration schedule</h2>
            </div>

            <div
              className={`small-status ${status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {status}
            </div>
          </div>

          <div className="calibration-grid">
            <div className="calibration-item">
              <span>Last Calibration</span>

              <strong>
                {formatDate(
                  equipment.calibration_date
                )}
              </strong>
            </div>

            <div className="calibration-item">
              <span>Next Calibration Due</span>

              <strong>
                {formatDate(
                  equipment.next_calibration_date
                )}
              </strong>
            </div>

            <div className="calibration-item">
              <span>Certificate Reference</span>

              <strong>
                {equipment.certificate_reference || "—"}
              </strong>
            </div>
          </div>
        </section>

        {/* LOWER AREA */}

        <div className="details-lower">

          {/* CALIBRATION CERTIFICATE */}

          <section className="record-panel certificates-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">
                  DOCUMENT
                </p>

                <h2>Calibration Certificate</h2>
              </div>
            </div>

            <div className="certificate-list">
              <div className="certificate-item">
                <div className="certificate-info">
                  <div className="certificate-icon">
                    <FileText size={15} />
                  </div>

                  <div>
                    <span>
                      Calibration Certificate
                    </span>

                    <strong>
                      {equipment.calibration_certificate ||
                        "Not uploaded"}
                    </strong>
                  </div>
                </div>

                <div className="certificate-actions">
                  <span className="fingerprint-status">
                    {equipment.calibration_hash
                      ? "Fingerprint stored"
                      : "No fingerprint"}
                  </span>

                  {equipment.calibration_certificate && (
                    <button
                      className="view-pdf-btn"
                      onClick={() =>
                        viewPdf(
                          equipment.calibration_certificate
                        )
                      }
                    >
                      <ExternalLink size={12} />
                      View PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* QR */}

          <section className="record-panel qr-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">
                  DIGITAL IDENTITY
                </p>

                <h2>Verification QR</h2>
              </div>
            </div>

            <div className="qr-content">
              {equipment.qr_code ? (
                <img
                  src={`https://medledger-bms-buildathon.onrender.com/uploads/${equipment.qr_code}`}
                  alt="Equipment verification QR"
                />
              ) : (
                <div className="qr-empty">
                  QR unavailable
                </div>
              )}

              <div className="qr-info">
                <strong>{equipment.id}</strong>

                <p>
                  Scan the QR code to open certificate
                  verification.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* SHA-256 */}

        <section className="record-panel hash-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">
                DOCUMENT INTEGRITY
              </p>

              <h2>SHA-256 fingerprint</h2>
            </div>

            <span className="integrity-note">
              Certificate fingerprint
            </span>
          </div>

          <div className="hash-list">
            <div className="hash-row">
              <span>
                Calibration Certificate
              </span>

              <code>
                {equipment.calibration_hash ||
                  "Not available"}
              </code>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <div className="record-footer">
          <div>
            <span>REGISTERED</span>

            <strong>
              {formatDateTime(
                equipment.created_at
              )}
            </strong>
          </div>

          <div>
            <span>RECORD ID</span>

            <strong>{equipment.id}</strong>
          </div>
        </div>

      </main>
    </div>
  );
}

export default EquipmentDetails;
