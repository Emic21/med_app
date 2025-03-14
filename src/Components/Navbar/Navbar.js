import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (storedEmail) {
      setIsLoggedIn(true);
      setUsername(storedEmail);
    }
  }, []);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("doctorData");
    setIsLoggedIn(false);
    setUsername("");
    setShowDropdown(false);
    window.location.reload();
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
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
          <Link to="/search/doctors">Appointments</Link>
        </li>
        <li className="link">
          <Link to="/healthblog">Health Blog</Link>
        </li>
        <li className="link">
          <Link to="/reviews">Reviews</Link>
        </li>
        {/* Add the Booking button here */}
        <li className="link">
          <Link to="/InstantConsultation">
            <button className="btn1">Booking</button>
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className="link dropdown">
              <button className="dropbtn" onClick={toggleDropdown}>
                {username} <i className="fa fa-caret-down"></i>
              </button>
              {showDropdown && (
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <Link to="/settings">Settings</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
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
  );
};

export default Navbar;