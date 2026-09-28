import React, { useState } from "react";

import Login from "./pages/login";
import HospitalDashboard from "./pages/HospitalDashboard";
import AuditorDashboard from "./pages/AuditorDashboard";

function App() {
  // Always start from login when the application opens
  const [currentPage, setCurrentPage] = useState("login");

  const handleLogin = (workspace) => {
    // Store selected workspace
    sessionStorage.setItem("medledgerRole", workspace);

    // Move to the correct dashboard
    if (workspace === "hospital") {
      setCurrentPage("hospital");
    } else if (workspace === "auditor") {
      setCurrentPage("auditor");
    } else if (workspace === "lab") {
      setCurrentPage("lab");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("medledgerRole");

    // Always return to login
    setCurrentPage("login");
  };

  // LOGIN PAGE
  if (currentPage === "login") {
    return <Login onLogin={handleLogin} />;
  }

  // HOSPITAL DASHBOARD
  if (currentPage === "hospital") {
    return <HospitalDashboard onLogout={handleLogout} />;
  }

  // AUDITOR DASHBOARD
  if (currentPage === "auditor") {
    return <AuditorDashboard onLogout={handleLogout} />;
  }

  // LAB DASHBOARD
  if (currentPage === "lab") {
    return (
      <div
        style={{
          padding: "50px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>Lab Dashboard</h1>
        <p>Lab workspace is coming soon.</p>

        <button onClick={handleLogout}>Sign out</button>
      </div>
    );
  }

  // Safety fallback
  return <Login onLogin={handleLogin} />;
}

export default App;