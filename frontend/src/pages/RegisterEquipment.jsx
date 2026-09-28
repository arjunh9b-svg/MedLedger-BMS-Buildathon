import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/RegisterEquipment.css";

function RegisterEquipment() {
  const [files, setFiles] = useState({
    calibration: null,
    photo: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [equipmentId, setEquipmentId] = useState("");
  const [equipmentCode, setEquipmentCode] = useState("");
  const [qrCode, setQrCode] = useState("");

  const handleFile = (type, file) => {
    setFiles((previous) => ({
      ...previous,
      [type]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    const form = new FormData();
    const inputs = e.target.elements;

    form.append("equipment_name", inputs.equipment_name.value);

    form.append("manufacturer", inputs.manufacturer.value);

    form.append("model", inputs.model.value);

    form.append("serial_number", inputs.serial_number.value);

    form.append("hospital_name", inputs.hospital_name.value);

    form.append("department", inputs.department.value);

    form.append("calibration_date", inputs.calibration_date.value);

    form.append("next_calibration_date", inputs.next_calibration_date.value);

    form.append("laboratory_name", inputs.laboratory_name.value);

    form.append("certificate_reference", inputs.certificate_reference.value);

    if (files.calibration) {
      form.append("calibration", files.calibration);
    }

    if (files.photo) {
      form.append("photo", files.photo);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/equipments",
        form,
      );

      console.log("Registration response:", response.data);

      setEquipmentId(response.data.equipment.id);

      setEquipmentCode(response.data.equipment.code);

      setQrCode(response.data.equipment.qr_code);

      setSuccess(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(
          "Could not register equipment. Make sure the backend is running.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="register-page">
        {/* =========================================
            SUCCESS
        ========================================= */}

        {success && (
          <div className="registration-success">
            <div className="success-icon">✓</div>

            <div className="success-content">
              <h2>Registered Successfully</h2>

              <p>
                Equipment and calibration certificate have been securely
                registered in MedLedger.
              </p>

              <div className="success-details">
                <div className="success-id">
                  <span>Equipment ID</span>

                  <strong>{equipmentCode}</strong>

                  <small>Database ID: {equipmentId}</small>
                </div>

                {qrCode && (
                  <div className="success-qr">
                    <img
                      src={`http://127.0.0.1:5000/uploads/${qrCode}`}
                      alt="Equipment QR Code"
                    />

                    <span>Scan to verify equipment</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="register-header">
          <p className="register-eyebrow">EQUIPMENT REGISTRATION</p>

          <h1>Register Equipment</h1>

          <p>Create a secure digital identity for a medical device.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* =========================================
              01 MACHINE PROFILE
          ========================================= */}

          <section className="register-section">
            <div className="section-number">01</div>

            <div className="section-content">
              <h2>Machine Profile</h2>

              <p className="section-description">
                Enter the core information manually.
              </p>

              <div className="form-grid">
                <div className="field">
                  <label>Equipment / Device Name</label>

                  <input
                    name="equipment_name"
                    type="text"
                    placeholder="e.g. Patient Monitor"
                    required
                  />
                </div>

                <div className="field">
                  <label>Manufacturer / Make</label>

                  <input
                    name="manufacturer"
                    type="text"
                    placeholder="e.g. Philips"
                    required
                  />
                </div>

                <div className="field">
                  <label>Model / Type</label>

                  <input
                    name="model"
                    type="text"
                    placeholder="e.g. IntelliVue MX450"
                    required
                  />
                </div>

                <div className="field">
                  <label>Serial Number</label>

                  <input
                    name="serial_number"
                    type="text"
                    placeholder="Enter serial number"
                    required
                  />
                </div>

                <div className="field">
                  <label>Hospital Name</label>

                  <input
                    name="hospital_name"
                    type="text"
                    placeholder="Issued to hospital"
                    required
                  />
                </div>

                <div className="field">
                  <label>Hospital Department / Location</label>

                  <input
                    name="department"
                    type="text"
                    placeholder="e.g. ICU"
                    required
                  />
                </div>

                <div className="field">
                  <label>Date of Calibration</label>

                  <input name="calibration_date" type="date" required />
                </div>

                <div className="field">
                  <label>Next Calibration Due Date</label>

                  <input name="next_calibration_date" type="date" required />
                </div>

                <div className="field">
                  <label>Issuing Laboratory Name</label>

                  <input
                    name="laboratory_name"
                    type="text"
                    placeholder="Laboratory name"
                    required
                  />
                </div>

                <div className="field">
                  <label>Calibration Certificate Reference</label>

                  <input
                    name="certificate_reference"
                    type="text"
                    placeholder="Certificate reference number"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =========================================
              02 CALIBRATION CERTIFICATE
          ========================================= */}

          <section className="register-section">
            <div className="section-number">02</div>

            <div className="section-content">
              <h2>Calibration Certificate</h2>

              <p className="section-description">
                Upload the original calibration certificate issued by the
                laboratory.
              </p>

              <label className="upload-box">
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => handleFile("calibration", e.target.files[0])}
                />

                <div className="upload-icon">↑</div>

                <strong>
                  {files.calibration
                    ? files.calibration.name
                    : "Upload Calibration Certificate"}
                </strong>

                <span>PDF files only</span>
              </label>
            </div>
          </section>

          {/* =========================================
              03 EQUIPMENT PHOTO
          ========================================= */}

          <section className="register-section">
            <div className="section-number">03</div>

            <div className="section-content">
              <h2>Equipment Photo</h2>

              <p className="section-description">
                Add a photo to visually identify the physical machine.
              </p>

              <label className="upload-box photo-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile("photo", e.target.files[0])}
                />

                <div className="upload-icon">↑</div>

                <strong>
                  {files.photo ? files.photo.name : "Upload Equipment Photo"}
                </strong>

                <span>JPG, PNG or WebP</span>
              </label>
            </div>
          </section>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div
              style={{
                margin: "20px 0",
                padding: "14px 16px",
                borderRadius: "8px",
                background: "#f8e9e9",
                color: "#8b3030",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          {/* =========================================
              04 SECURE REGISTRATION
          ========================================= */}

          <section className="secure-registration">
            <div>
              <p className="register-eyebrow">04 · SECURE REGISTRATION</p>

              <h2>Ready to create the equipment record?</h2>

              <p>
                The calibration certificate will be fingerprinted with SHA-256
                and linked to the equipment record.
              </p>
            </div>

            <button
              type="submit"
              className="register-submit-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Equipment"}
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}

export default RegisterEquipment;
