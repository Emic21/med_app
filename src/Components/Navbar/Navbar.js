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

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("doctorData");
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav__logo">
          <Link to="/">
            StayHealthy <i style={{ color: "#2190FF" }} className="fa fa-user-md"></i>
          </Link>
          <span>.</span>
        </div>
        
        <div className="nav__icon" onClick={handleMenuToggle}>
          <i className={isMenuOpen ? "fa fa-times" : "fa fa-bars"}></i>
        </div>
        
        <ul className={isMenuOpen ? "nav__links active" : "nav__links"}>
          <li className="link">
            <Link to="/">Home</Link>
          </li>
          <li className="link">
            <Link to="/AppointmentFormIC">Appointments</Link>
          </li>
          <li className="link">
            <Link to="/healthblog">Health Blog</Link>
          </li>
          <li className="link">
            <Link to="/reviews">Reviews</Link>
          </li>
          <li className="link">
            <Link to="/InstantConsultation">
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
                      <Link to="/profile">Your Profile</Link>
                    </li>
                    <li>
                      <Link to="/reportslayout">Your Reports</Link>
                    </li>
                    <li>
                      <Link to="/settings">Settings</Link>
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
                <Link to="/SignUp">
                  <button className="btn1">Sign Up</button>
                </Link>
              </li>
              <li className="link">
                <Link to="/Login">
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