import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import HospitalNavbar from "../components/HospitalNavbar";
import "../styles/Equipments.css";

function Equipments() {
  const navigate = useNavigate();

  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEquipments();
  }, []);

  const getEquipments = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/equipments"
      );

      setEquipments(response.data);

    } catch (err) {
      console.error(err);
      setError(
        "Could not load equipment records."
      );

    } finally {
      setLoading(false);
    }
  };

  const getStatus = (date) => {
    if (!date) {
      return "Valid";
    }

    const today = new Date();
    const due = new Date(date);

    const diff =
      (due - today) /
      (1000 * 60 * 60 * 24);

    if (diff < 0) {
      return "Overdue";
    }

    if (diff <= 30) {
      return "Due Soon";
    }

    return "Valid";
  };

  if (loading) {
    return (
      <div>

        <HospitalNavbar />

        <main className="equipments-page">

          <h1>
            Equipments
          </h1>

          <p>
            Loading equipment records...
          </p>

        </main>

      </div>
    );
  }

  return (
    <div>

      <HospitalNavbar />

      <main className="equipments-page">

        <div className="equipments-header">

          <div>

            <p className="equipments-eyebrow">
              EQUIPMENT REGISTRY
            </p>

            <h1>
              Equipments
            </h1>

            <p>
              Registered medical equipment records.
            </p>

          </div>


          <button
            className="equipment-register-btn"
            onClick={() =>
              navigate("/lab/register")
            }
          >
            + Register Equipment
          </button>

        </div>


        {error && (
          <div className="equipment-error">
            {error}
          </div>
        )}


        {!error &&
          equipments.length === 0 && (

            <div className="equipment-empty">

              <h2>
                No equipment registered
              </h2>

              <p>
                Register your first medical equipment
                to create a secure record.
              </p>

              <button
                onClick={() =>
                  navigate("/lab/register")
                }
              >
                Register Equipment
              </button>

            </div>
          )}


        <div className="equipment-list">

          {equipments.map((equipment) => {

            const status = getStatus(
              equipment.next_calibration_date
            );

            return (
              <div
                key={equipment.id}
                className="equipment-card"
                onClick={() =>
                  navigate(
                    `/hospital/equipment/${equipment.id}`
                  )
                }
              >

                <div className="equipment-card-main">

                  <div>

                    <h2>
                      {equipment.equipment_name}
                    </h2>

                    <p className="equipment-model">
                      {equipment.manufacturer}
                      {" · "}
                      {equipment.model}
                    </p>

                    <p className="equipment-serial">
                      Serial:{" "}
                      {equipment.serial_number}
                    </p>

                  </div>


                  <div className="equipment-qr">

                    {equipment.qr_code ? (

                      <img
                        src={`http://127.0.0.1:5000/uploads/${equipment.qr_code}`}
                        alt="Equipment QR"
                      />

                    ) : (

                      <span>
                        QR
                      </span>

                    )}

                  </div>

                </div>


                <div className="equipment-card-bottom">

                  <div className="equipment-id">

                    <span>
                      Equipment ID
                    </span>

                    <strong>
                      {equipment.id}
                    </strong>

                  </div>


                  <div
                    className={`equipment-status ${status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >

                    <span></span>

                    {status}

                  </div>


                  <div className="view-record">
                    View Record →
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </main>

    </div>
  );
}

export default Equipments;