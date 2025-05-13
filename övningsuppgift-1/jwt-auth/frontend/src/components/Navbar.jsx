import { Link, useNavigate } from "react-router-dom";

import "./Components.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {token && (
          <>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/settings" className="nav-link">
              Settings
            </Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        {token ? (
          <button onClick={handleLogout} className="nav-button">
            Logout
          </button>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
