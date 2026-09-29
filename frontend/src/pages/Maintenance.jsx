import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

import HospitalNavbar from "../components/HospitalNavbar";
import "../styles/Maintenance.css";

function Maintenance() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEquipments();
  }, []);

  const getEquipments = async () => {
    try {
      const response = await axios.get(
        "https://medledger-bms-buildathon.onrender.com/api/equipments"
      );

      setEquipments(response.data);

    } catch (err) {
      console.error(err);

      setError(
        "Could not load maintenance records."
      );

    } finally {
      setLoading(false);
    }
  };

  const getStatus = (date) => {
    const today = new Date();
    const due = new Date(date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diff =
      (due - today) /
      (1000 * 60 * 60 * 24);

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

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const sortedEquipments = [...equipments].sort(
    (a, b) => {

      const order = {
        Overdue: 1,
        "Due Soon": 2,
        Verified: 3,
      };

      return (
        order[
          getStatus(
            a.next_calibration_date
          )
        ] -
        order[
          getStatus(
            b.next_calibration_date
          )
        ]
      );
    }
  );

  const overdue =
    sortedEquipments.filter(
      (equipment) =>
        getStatus(
          equipment.next_calibration_date
        ) === "Overdue"
    );

  const dueSoon =
    sortedEquipments.filter(
      (equipment) =>
        getStatus(
          equipment.next_calibration_date
        ) === "Due Soon"
    );

  const verified =
    sortedEquipments.filter(
      (equipment) =>
        getStatus(
          equipment.next_calibration_date
        ) === "Verified"
    );

  const renderEquipment = (equipment) => {

    const status = getStatus(
      equipment.next_calibration_date
    );

    return (
      <div
        className="maintenance-card"
        key={equipment.id}
      >

        <div className="maintenance-card-main">

          <div className="maintenance-info">

            <div className="maintenance-title-row">

              <h2>
                {equipment.equipment_name}
              </h2>

              <span className="maintenance-id">
                {equipment.id}
              </span>

            </div>


            <p className="maintenance-model">
              {equipment.manufacturer}
              {" · "}
              {equipment.model}
            </p>


            <p className="maintenance-serial">
              Serial:{" "}
              {equipment.serial_number}
            </p>

          </div>


          <div
            className={`maintenance-status ${status
              .toLowerCase()
              .replace(" ", "-")}`}
          >

            {status === "Overdue" && (
              <AlertCircle size={14} />
            )}

            {status === "Due Soon" && (
              <Clock3 size={14} />
            )}

            {status === "Verified" && (
              <CheckCircle2 size={14} />
            )}

            <span>
              {status}
            </span>

          </div>

        </div>


        <div className="maintenance-card-bottom">

          <div className="maintenance-date">

            <span>
              Last Calibration
            </span>

            <strong>
              {formatDate(
                equipment.calibration_date
              )}
            </strong>

          </div>


          <div className="maintenance-date">

            <span>
              Next Calibration Due
            </span>

            <strong>
              {formatDate(
                equipment.next_calibration_date
              )}
            </strong>

          </div>


          <div className="maintenance-hospital">

            <span>
              Location
            </span>

            <strong>
              {equipment.hospital_name}
            </strong>

          </div>

        </div>

      </div>
    );
  };


  if (loading) {
    return (
      <div>

        <HospitalNavbar />

        <main className="maintenance-page">

          <div className="maintenance-loading">
            Loading maintenance status...
          </div>

        </main>

      </div>
    );
  }


  return (
    <div>

      <HospitalNavbar />

      <main className="maintenance-page">

        {/* HEADER */}

        <div className="maintenance-header">

          <div>

            <p className="maintenance-eyebrow">
              CALIBRATION STATUS
            </p>

            <h1>
              Maintenance
            </h1>

            <p>
              Monitor calibration schedules and equipment status.
            </p>

          </div>

        </div>


        {error && (
          <div className="maintenance-error">
            {error}
          </div>
        )}


        {!error &&
          equipments.length === 0 && (

            <div className="maintenance-empty">

              <h2>
                No equipment records
              </h2>

              <p>
                Registered equipment will appear here.
              </p>

            </div>
          )}


        {!error &&
          equipments.length > 0 && (

            <div className="maintenance-sections">

              {/* OVERDUE */}

              {overdue.length > 0 && (

                <section className="maintenance-section">

                  <div className="maintenance-section-header">

                    <div>

                      <p className="section-label overdue-label">
                        ATTENTION REQUIRED
                      </p>

                      <h2>
                        Overdue
                      </h2>

                    </div>

                    <span className="section-count overdue-count">
                      {overdue.length}
                    </span>

                  </div>


                  <div className="maintenance-list">

                    {overdue.map(
                      renderEquipment
                    )}

                  </div>

                </section>
              )}


              {/* DUE SOON */}

              {dueSoon.length > 0 && (

                <section className="maintenance-section">

                  <div className="maintenance-section-header">

                    <div>

                      <p className="section-label due-label">
                        UPCOMING
                      </p>

                      <h2>
                        Due Soon
                      </h2>

                    </div>

                    <span className="section-count due-count">
                      {dueSoon.length}
                    </span>

                  </div>


                  <div className="maintenance-list">

                    {dueSoon.map(
                      renderEquipment
                    )}

                  </div>

                </section>
              )}


              {/* VERIFIED */}

              {verified.length > 0 && (

                <section className="maintenance-section">

                  <div className="maintenance-section-header">

                    <div>

                      <p className="section-label verified-label">
                        CURRENT
                      </p>

                      <h2>
                        Verified
                      </h2>

                    </div>

                    <span className="section-count verified-count">
                      {verified.length}
                    </span>

                  </div>


                  <div className="maintenance-list">

                    {verified.map(
                      renderEquipment
                    )}

                  </div>

                </section>
              )}

            </div>
          )}

      </main>

    </div>
  );
}

export default Maintenance;
