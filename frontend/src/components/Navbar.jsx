import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate("/dashboard")}
      >
        <div className="navbar-logo">M</div>
        <span>MEDLEDGER</span>
      </div>

      <nav className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/register">Register Equipment</NavLink>
        <NavLink to="/equipments">Equipments</NavLink>
        <NavLink to="/maintenance">Maintenance</NavLink>
        <NavLink to="/inspection">Inspection</NavLink>
        <NavLink to="/verify">Verify Documents</NavLink>
      </nav>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="user-avatar">DR</div>
          <span>Admin</span>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;