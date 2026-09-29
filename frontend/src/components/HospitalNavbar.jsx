import { Link, useLocation } from "react-router-dom";
import "./HospitalNavbar.css";


function HospitalNavbar() {

  const location = useLocation();


  const logout = () => {
    window.location.href = "/";
  };


  const isActive = (path) => {

    if (path === "/hospital") {

      return location.pathname === "/hospital";

    }

    return location.pathname.startsWith(path);

  };


  return (

    <header className="hospital-navbar">

      <Link
        to="/hospital"
        className="hospital-navbar-brand"
      >

        <div className="hospital-navbar-logo">
          M
        </div>

        <span>
          MEDLEDGER
        </span>

      </Link>


      <nav className="hospital-navbar-links">

        <Link
          to="/hospital"
          className={
            isActive("/hospital")
              ? "hospital-nav-link active"
              : "hospital-nav-link"
          }
        >
          Dashboard
        </Link>


        <Link
          to="/lab/register"
          className={
            isActive("/lab/register")
              ? "hospital-nav-link active"
              : "hospital-nav-link"
          }
        >
          Register Equipment
        </Link>


        <Link
          to="/hospital/equipment"
          className={
            isActive("/hospital/equipment")
              ? "hospital-nav-link active"
              : "hospital-nav-link"
          }
        >
          Equipments
        </Link>


        <Link
          to="/hospital/lab-selection"
          className={
            isActive("/hospital/lab-selection")
              ? "hospital-nav-link active"
              : "hospital-nav-link"
          }
        >
          Lab Selection
        </Link>


        <Link
          to="/hospital/issues"
          className={
            isActive("/hospital/issues")
              ? "hospital-nav-link active"
              : "hospital-nav-link"
          }
        >
          Issues
        </Link>


        <Link
          to="/hospital/maintenance"
          className={
            isActive("/hospital/maintenance")
              ? "hospital-nav-link active"
              : "hospital-nav-link"
          }
        >
          Maintenance
        </Link>

      </nav>


      <div className="hospital-navbar-user">

        <div className="hospital-navbar-avatar">
          DR
        </div>

        <span className="hospital-navbar-name">
          Admin
        </span>

        <button
          type="button"
          className="hospital-navbar-logout"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </header>

  );

}


export default HospitalNavbar;
