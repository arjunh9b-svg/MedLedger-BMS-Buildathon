import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";

import HospitalDashboard from "./pages/HospitalDashboard";
import LabDashboard from "./pages/LabDashboard";
import AuditorDashboard from "./pages/AuditorDashboard";

import RegisterEquipment from "./pages/RegisterEquipment";
import Equipments from "./pages/Equipments";
import EquipmentDetails from "./pages/EquipmentDetails";
import Maintenance from "./pages/Maintenance";
import Inspection from "./pages/Inspection";
import VerifyDocuments from "./pages/VerifyDocuments";
import AuditTrail from "./pages/AuditTrail";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* ================================================== */}
        {/* LOGIN */}
        {/* ================================================== */}

        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/hospital" replace />
            ) : (
              <Login onLogin={() => setLoggedIn(true)} />
            )
          }
        />

        {/* ================================================== */}
        {/* HOSPITAL PORTAL */}
        {/* ================================================== */}

        <Route
          path="/hospital"
          element={
            loggedIn ? <HospitalDashboard /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/hospital/equipment"
          element={loggedIn ? <Equipments /> : <Navigate to="/" replace />}
        />

        <Route
          path="/hospital/equipment/:id"
          element={
            loggedIn ? <EquipmentDetails /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/hospital/maintenance"
          element={loggedIn ? <Maintenance /> : <Navigate to="/" replace />}
        />

        {/* ================================================== */}
        {/* LAB-TECH PORTAL */}
        {/* ================================================== */}

        <Route
          path="/lab"
          element={loggedIn ? <LabDashboard /> : <Navigate to="/" replace />}
        />

        <Route
          path="/lab/register"
          element={
            loggedIn ? <RegisterEquipment /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/lab/certificates"
          element={loggedIn ? <VerifyDocuments /> : <Navigate to="/" replace />}
        />

        {/* ================================================== */}
        {/* AUDITOR PORTAL */}
        {/* ================================================== */}

        <Route
          path="/auditor"
          element={
            loggedIn ? <AuditorDashboard /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/auditor/verify"
          element={loggedIn ? <VerifyDocuments /> : <Navigate to="/" replace />}
        />

        <Route
          path="/auditor/inspection"
          element={loggedIn ? <Inspection /> : <Navigate to="/" replace />}
        />

        <Route
          path="/auditor/audit"
          element={loggedIn ? <AuditTrail /> : <Navigate to="/" replace />}
        />

        {/* ================================================== */}
        {/* QR VERIFICATION - PUBLIC */}
        {/* ================================================== */}

        <Route path="/scan/:id" element={<VerifyDocuments />} />

        {/* ================================================== */}
        {/* OLD ROUTES - TEMPORARY COMPATIBILITY */}
        {/* ================================================== */}

        <Route
          path="/dashboard"
          element={<Navigate to="/hospital" replace />}
        />

        <Route
          path="/register"
          element={<Navigate to="/lab/register" replace />}
        />

        <Route
          path="/equipments"
          element={<Navigate to="/hospital/equipment" replace />}
        />

        <Route
          path="/equipments/:id"
          element={
            loggedIn ? <EquipmentDetails /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/maintenance"
          element={<Navigate to="/hospital/maintenance" replace />}
        />

        <Route
          path="/inspection"
          element={<Navigate to="/auditor/inspection" replace />}
        />

        <Route
          path="/verify"
          element={<Navigate to="/auditor/verify" replace />}
        />

        <Route
          path="/audit"
          element={<Navigate to="/auditor/audit" replace />}
        />

        {/* ================================================== */}
        {/* UNKNOWN ROUTE */}
        {/* ================================================== */}

        <Route
          path="*"
          element={<Navigate to={loggedIn ? "/hospital" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
