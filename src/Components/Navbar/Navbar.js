import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedName = sessionStorage.getItem("name");
    
    if (storedEmail) {
      setIsLoggedIn(true);
      setUsername(storedName || storedEmail.split('@')[0]);
    }
  }, []);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  // Close menu when any link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("doctorData");
    window.location.reload();
    closeMenu();
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav__logo">
          <Link to="/" onClick={closeMenu}>
            StayHealthy <i style={{ color: "#2190FF" }} className="fa fa-user-md"></i>
          </Link>
          <span>.</span>
        </div>
        
        <div className="nav__icon" onClick={handleMenuToggle}>
          <i className={isMenuOpen ? "fa fa-times" : "fa fa-bars"}></i>
        </div>
        
        <ul className={isMenuOpen ? "nav__links active" : "nav__links"}>
          <li className="link">
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li className="link">
            <Link to="/AppointmentFormIC" onClick={closeMenu}>Appointments</Link>
          </li>
          <li className="link">
            <Link to="/healthblog" onClick={closeMenu}>Health Blog</Link>
          </li>
          <li className="link">
            <Link to="/reviews" onClick={closeMenu}>Reviews</Link>
          </li>
          <li className="link">
            <Link to="/InstantConsultation" onClick={closeMenu}>
              <button className="btn1">Booking</button>
            </Link>
          </li>
          
          {isLoggedIn ? (
            <>
              <li className="link welcome-container">
                <div className="welcome-user">
                  Welcome, {username}
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/profile" onClick={closeMenu}>Your Profile</Link>
                    </li>
                    <li>
                      <Link to="/reportslayout" onClick={closeMenu}>Your Reports</Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={closeMenu}>Settings</Link>
                    </li>
                  </ul>
                </div>
                <button className="btn2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="link">
                <Link to="/SignUp" onClick={closeMenu}>
                  <button className="btn1">Sign Up</button>
                </Link>
              </li>
              <li className="link">
                <Link to="/Login" onClick={closeMenu}>
                  <button className="btn1">Login</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="navbar-spacer"></div>
    </>
  );
};

export default Navbar;