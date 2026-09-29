import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";

/* ================= HOSPITAL ================= */

import HospitalDashboard from "./pages/HospitalDashboard";
import RegisterEquipment from "./pages/RegisterEquipment";
import Equipments from "./pages/Equipments";
import EquipmentDetails from "./pages/EquipmentDetails";
import Maintenance from "./pages/Maintenance";
import HospitalLabSelection from "./pages/HospitalLabSelection";

/* ================= LAB ================= */

import LabDashboard from "./pages/LabDashboard";
import LabEquipments from "./pages/LabEquipments";
import LabCertificates from "./pages/LabCertificates";
import LabVerificationStatus from "./pages/LabVerificationStatus";
import LabIssues from "./pages/LabIssues";
import LabEquipmentDetails from "./pages/LabEquipmentDetails";

/* ================= AUDITOR ================= */

import AuditorDashboard from "./pages/AuditorDashboard";
import AuditorVerify from "./pages/AuditorVerify";
import AuditorEquipment from "./pages/AuditorEquipment";
import AuditorIssues from "./pages/AuditorIssues";
import AuditorAudit from "./pages/AuditorAudit";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [portal, setPortal] = useState("");

  const handleLogin = (selectedPortal) => {
    setLoggedIn(true);
    setPortal(selectedPortal);
  };

  const getPortalPath = () => {
    if (portal === "hospital") return "/hospital";
    if (portal === "lab") return "/lab";
    if (portal === "auditor") return "/auditor";

    return "/";
  };

  const protect = (allowedPortal, element) => {
    if (!loggedIn) {
      return <Navigate to="/" replace />;
    }

    if (portal !== allowedPortal) {
      return <Navigate to={getPortalPath()} replace />;
    }

    return element;
  };

  const protectRegistration = () => {
    if (!loggedIn) {
      return <Navigate to="/" replace />;
    }

    if (portal !== "hospital" && portal !== "lab") {
      return <Navigate to={getPortalPath()} replace />;
    }

    return <RegisterEquipment />;
  };


  return (
    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to={getPortalPath()} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />


        {/* ================= HOSPITAL ================= */}

        <Route
          path="/hospital"
          element={protect("hospital", <HospitalDashboard />)}
        />

        <Route
          path="/hospital/lab-selection"
          element={protect("hospital", <HospitalLabSelection />)}
        />

        <Route
          path="/hospital/equipment"
          element={protect("hospital", <Equipments />)}
        />

        <Route
          path="/hospital/equipment/:id"
          element={protect("hospital", <EquipmentDetails />)}
        />

        <Route
          path="/hospital/maintenance"
          element={protect("hospital", <Maintenance />)}
        />


        {/* ================= SHARED REGISTER ================= */}

        <Route
          path="/lab/register"
          element={protectRegistration()}
        />


        {/* ================= LAB ================= */}

        <Route
          path="/lab"
          element={protect("lab", <LabDashboard />)}
        />

        <Route
          path="/lab/equipments"
          element={protect("lab", <LabEquipments />)}
        />

        <Route
          path="/lab/equipments/:id"
          element={protect("lab", <LabEquipmentDetails />)}
        />

        <Route
          path="/lab/certificates"
          element={protect("lab", <LabCertificates />)}
        />

        <Route
          path="/lab/verification"
          element={protect("lab", <LabVerificationStatus />)}
        />

        <Route
          path="/lab/issues"
          element={protect("lab", <LabIssues />)}
        />


        {/* ================= AUDITOR ================= */}

        <Route
          path="/auditor"
          element={protect("auditor", <AuditorDashboard />)}
        />

        <Route
          path="/auditor/verify"
          element={protect("auditor", <AuditorVerify />)}
        />

        <Route
          path="/auditor/equipment"
          element={protect("auditor", <AuditorEquipment />)}
        />

        <Route
          path="/auditor/issues"
          element={protect("auditor", <AuditorIssues />)}
        />

        <Route
          path="/auditor/audit"
          element={protect("auditor", <AuditorAudit />)}
        />


        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={loggedIn ? getPortalPath() : "/"}
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
