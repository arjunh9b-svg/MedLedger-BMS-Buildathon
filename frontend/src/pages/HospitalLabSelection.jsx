import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HospitalNavbar from "../components/HospitalNavbar";
import "./HospitalLabSelection.css";

const API = "https://medledger-bms-buildathon.onrender.com";

function HospitalLabSelection() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/laboratories/trust`)
      .then((res) => res.json())
      .then((data) => {
        setLabs(data.slice(0, 6));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load laboratories:", error);
        setLoading(false);
      });
  }, []);

  const selectLab = (lab) => {
    localStorage.setItem(
      "selectedLab",
      JSON.stringify(lab)
    );

    navigate("/hospital");
  };

  return (
    <div className="hospital-lab-page">

      <HospitalNavbar />

      <main className="hospital-lab-content">

        {/* PAGE HEADING */}

        <div className="lab-heading">

          <p>HOSPITAL PORTAL</p>

          <h1>
            Select Calibration Laboratory
          </h1>

          <span>
            Choose the laboratory responsible for your equipment certificates.
          </span>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="lab-loading">
            Loading laboratories...
          </div>

        ) : labs.length === 0 ? (

          <div className="lab-loading">
            No laboratories available.
          </div>

        ) : (

          /* LAB CARDS */

          <div className="lab-grid">

            {labs.map((lab) => (

              <div
                className="lab-card"
                key={lab.id}
              >

                {/* TOP SECTION */}

                <div className="lab-card-top">

                  <div className="lab-icon">
                    L
                  </div>

                  <div className="lab-info">

                    <h2>
                      {lab.name}
                    </h2>

                    <p>
                      Accreditation:{" "}
                      {lab.accreditation_number ||
                        "Not available"}
                    </p>

                    <p>
                      Status:{" "}
                      <strong>
                        {lab.accreditation_status ||
                          "Not available"}
                      </strong>
                    </p>

                  </div>

                </div>

                {/* LABTRUST */}

                <div className="labtrust">

                  {/* SCORE WHEEL */}

                  <div
                    className="trust-wheel"
                    style={{
                      "--score":
                        `${Math.min(
                          Math.max(
                            Number(lab.trust_score) || 0,
                            0
                          ),
                          100
                        ) * 3.6}deg`,
                    }}
                  >

                    <div className="trust-wheel-inner">

                      <span className="trust-score">
                        {lab.trust_score ?? 0}
                      </span>

                      <span className="trust-out-of">
                        /100
                      </span>

                    </div>

                  </div>

                  {/* TRUST DETAILS */}

                  <div className="trust-details">

                    <span className="trust-title">
                      LabTrust Score
                    </span>

                    <span
                      className={`trust-level ${String(
                        lab.trust_level || "LOW"
                      ).toLowerCase()}`}
                    >
                      {lab.trust_level || "LOW"} TRUST
                    </span>

                    <span className="trust-description">
                      Based on laboratory activity
                    </span>

                  </div>

                </div>

                {/* SELECT */}

                <button
                  type="button"
                  onClick={() => selectLab(lab)}
                >
                  Select Lab
                </button>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default HospitalLabSelection;
