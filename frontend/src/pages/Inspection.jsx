import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, AlertCircle, Upload, X } from "lucide-react";
import axios from "axios";

import Navbar from "../components/Navbar";
import "../styles/Inspection.css";

function Inspection() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [updateData, setUpdateData] = useState({
    calibration_date: "",
    next_calibration_date: "",
    certificate_reference: "",
    certificate: null,
  });

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getEquipments();
  }, []);

  const getEquipments = async () => {
    try {
      const response = await axios.get("https://medledger-bms-buildathon.onrender.com/api/equipments");

      setEquipments(response.data);
    } catch (err) {
      console.error(err);

      setError("Could not load inspection records.");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (date) => {
    const today = new Date();
    const due = new Date(date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diff = (due - today) / (1000 * 60 * 60 * 24);

    if (diff < 0) {
      return "Overdue";
    }

    if (diff <= 30) {
      return "Due Soon";
    }

    return "Verified";
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const openUpdate = (equipment) => {
    setSelectedEquipment(equipment);

    setUpdateData({
      calibration_date: equipment.calibration_date || "",

      next_calibration_date: equipment.next_calibration_date || "",

      certificate_reference: equipment.certificate_reference || "",

      certificate: null,
    });
  };

  const closeUpdate = () => {
    if (updating) {
      return;
    }

    setSelectedEquipment(null);

    setUpdateData({
      calibration_date: "",
      next_calibration_date: "",
      certificate_reference: "",
      certificate: null,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedEquipment) {
      return;
    }

    if (!updateData.certificate) {
      alert("Please select a calibration certificate.");

      return;
    }

    try {
      setUpdating(true);

      const form = new FormData();

      form.append("calibration_date", updateData.calibration_date);

      form.append("next_calibration_date", updateData.next_calibration_date);

      form.append("certificate_reference", updateData.certificate_reference);

      form.append("certificate", updateData.certificate);

      await axios.put(
        `https://medledger-bms-buildathon.onrender.com/api/equipments/${selectedEquipment.id}/calibration`,

        form,
      );

      await getEquipments();

      setSelectedEquipment(null);

      setUpdateData({
        calibration_date: "",
        next_calibration_date: "",
        certificate_reference: "",
        certificate: null,
      });

      alert("Calibration certificate updated successfully.");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
          "Could not update calibration certificate.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const sortedEquipments = [...equipments].sort((a, b) => {
    const order = {
      Overdue: 1,
      "Due Soon": 2,
      Verified: 3,
    };

    return (
      order[getStatus(a.next_calibration_date)] -
      order[getStatus(b.next_calibration_date)]
    );
  });

  const overdue = sortedEquipments.filter(
    (equipment) => getStatus(equipment.next_calibration_date) === "Overdue",
  );

  const dueSoon = sortedEquipments.filter(
    (equipment) => getStatus(equipment.next_calibration_date) === "Due Soon",
  );

  const verified = sortedEquipments.filter(
    (equipment) => getStatus(equipment.next_calibration_date) === "Verified",
  );

  const renderEquipment = (equipment) => {
    const status = getStatus(equipment.next_calibration_date);

    return (
      <div className="inspection-card" key={equipment.id}>
        <div className="inspection-card-top">
          <div className="inspection-info">
            <div className="inspection-title-row">
              <h2>{equipment.equipment_name}</h2>

              <span className="inspection-id">{equipment.id}</span>
            </div>

            <p className="inspection-model">
              {equipment.manufacturer} · {equipment.model}
            </p>

            <p className="inspection-serial">
              Serial: {equipment.serial_number}
            </p>
          </div>

          <div
            className={`inspection-status ${status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {status === "Overdue" && <AlertCircle size={14} />}

            {status === "Due Soon" && <Clock3 size={14} />}

            {status === "Verified" && <CheckCircle2 size={14} />}

            <span>{status}</span>
          </div>
        </div>

        <div className="inspection-card-bottom">
          <div className="inspection-date">
            <span>Last Inspection</span>

            <strong>{formatDate(equipment.calibration_date)}</strong>
          </div>

          <div className="inspection-date">
            <span>Next Inspection</span>

            <strong>{formatDate(equipment.next_calibration_date)}</strong>
          </div>

          <div className="inspection-reference">
            <span>Certificate Reference</span>

            <strong>{equipment.certificate_reference}</strong>
          </div>
        </div>

        <div className="inspection-card-actions">
          <button
            className="update-certificate-btn"
            onClick={() => openUpdate(equipment)}
          >
            <Upload size={13} />
            Update Calibration Certificate
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <Navbar />

        <main className="inspection-page">
          <div className="inspection-loading">Loading inspection status...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main className="inspection-page">
        {/* HEADER */}

        <div className="inspection-header">
          <p className="inspection-eyebrow">INSPECTION STATUS</p>

          <h1>Inspection</h1>

          <p>
            Monitor inspection and calibration status of registered equipment.
          </p>
        </div>

        {/* ERROR */}

        {error && <div className="inspection-error">{error}</div>}

        {/* EMPTY */}

        {!error && equipments.length === 0 && (
          <div className="inspection-empty">
            <div className="inspection-empty-icon">
              <CheckCircle2 size={22} />
            </div>

            <h2>No inspection records</h2>

            <p>Registered equipment will appear here.</p>
          </div>
        )}

        {/* RECORDS */}

        {!error && equipments.length > 0 && (
          <div className="inspection-sections">
            {/* OVERDUE */}

            {overdue.length > 0 && (
              <section className="inspection-section">
                <div className="inspection-section-header">
                  <div>
                    <p className="inspection-label overdue-label">
                      ATTENTION REQUIRED
                    </p>

                    <h2>Overdue</h2>
                  </div>

                  <span className="inspection-count overdue-count">
                    {overdue.length}
                  </span>
                </div>

                <div className="inspection-list">
                  {overdue.map(renderEquipment)}
                </div>
              </section>
            )}

            {/* DUE SOON */}

            {dueSoon.length > 0 && (
              <section className="inspection-section">
                <div className="inspection-section-header">
                  <div>
                    <p className="inspection-label due-label">UPCOMING</p>

                    <h2>Due Soon</h2>
                  </div>

                  <span className="inspection-count due-count">
                    {dueSoon.length}
                  </span>
                </div>

                <div className="inspection-list">
                  {dueSoon.map(renderEquipment)}
                </div>
              </section>
            )}

            {/* VERIFIED */}

            {verified.length > 0 && (
              <section className="inspection-section">
                <div className="inspection-section-header">
                  <div>
                    <p className="inspection-label verified-label">CURRENT</p>

                    <h2>Verified</h2>
                  </div>

                  <span className="inspection-count verified-count">
                    {verified.length}
                  </span>
                </div>

                <div className="inspection-list">
                  {verified.map(renderEquipment)}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* UPDATE MODAL */}

      {selectedEquipment && (
        <div className="inspection-modal-overlay">
          <div className="inspection-modal">
            <div className="inspection-modal-header">
              <div>
                <p>UPDATE CERTIFICATE</p>

                <h2>Calibration Certificate</h2>

                <span>
                  {selectedEquipment.equipment_name}
                  {" · "}
                  {selectedEquipment.id}
                </span>
              </div>

              <button
                className="inspection-modal-close"
                onClick={closeUpdate}
                disabled={updating}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="inspection-update-grid">
                <div className="inspection-field">
                  <label>Calibration Date</label>

                  <input
                    type="date"
                    value={updateData.calibration_date}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,

                        calibration_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="inspection-field">
                  <label>Next Calibration Due</label>

                  <input
                    type="date"
                    value={updateData.next_calibration_date}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,

                        next_calibration_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="inspection-field full">
                  <label>Certificate Reference</label>

                  <input
                    type="text"
                    value={updateData.certificate_reference}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,

                        certificate_reference: e.target.value,
                      })
                    }
                    placeholder="Certificate reference"
                    required
                  />
                </div>

                <div className="inspection-field full">
                  <label>New Calibration Certificate</label>

                  <label className="inspection-upload">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,

                          certificate: e.target.files[0],
                        })
                      }
                      required
                    />

                    <Upload size={17} />

                    <strong>
                      {updateData.certificate
                        ? updateData.certificate.name
                        : "Choose calibration certificate"}
                    </strong>

                    <span>PDF files only</span>
                  </label>
                </div>
              </div>

              <div className="inspection-modal-actions">
                <button
                  type="button"
                  className="inspection-cancel-btn"
                  onClick={closeUpdate}
                  disabled={updating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inspection-update-btn"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inspection;
