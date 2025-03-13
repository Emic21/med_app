import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const handleClick = () => {
    console.log('Navbar item clicked!');
  };

  return (
    <nav>
      {/* Navigation logo section */}
      <div className="nav__logo">
        <Link to="/">
          StayHealthy
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="26"
            width="26"
            viewBox="0 0 1000 1000"
            style={{ fill: '#3685fb' }}
          >
            <title>Doctor With Stethoscope SVG icon</title>
            <g>
              <g>
                <path d="M499.8,10c91.7,0,166,74.3,166,166c0,91.7-74.3,166-166,166c-91.7,0-166-74.3-166-166C333.8,84.3,408.1,10,499.8,10z"></path>
                <path d="M499.8,522.8c71.2,0,129.1-58.7,129.1-129.1H370.6C370.6,464.1,428.6,522.8,499.8,522.8z"></path>
                <path d="M693.2,395c-0.7,94.9-70.3,173.7-160.8,188.9v155.9c0,80.3-60.7,150.8-140.8,155.3c-83,4.7-152.7-58.9-157.6-139.7c-22-12.8-35.6-38.5-30.3-66.7c4.7-25.1,25.5-45.6,50.8-49.9c39.7-6.7,74.1,23.7,74.1,62.1c0,23-12.3,43-30.7,54.1c4.7,45.4,45.1,80.4,92.6,76c44.6-4,77.2-44.2,77.2-89.1V583.9c-90.5-15.2-160.1-94-160.8-188.9H693.2z"></path>
                <path d="M812.4,733.8c-51.1,0-92.6,41.5-92.6,92.6s41.5,92.6,92.6,92.6s92.6-41.5,92.6-92.6S863.5,733.8,812.4,733.8z M812.4,883.6c-31.8,0-57.2-25.4-57.2-57.2s25.4-57.2,57.2-57.2s57.2,25.4,57.2,57.2S844.2,883.6,812.4,883.6z"></path>
              </g>
            </g>
          </svg>
        </Link>
        <span>.</span>
      </div>

      {/* Navigation icon section */}
      <div className="nav__icon" onClick={handleClick}>
        <i className="fa fa-times fa fa-bars"></i>
      </div>

      {/* Navigation links */}
      <ul className="nav__links active">
        <li className="link">
          <Link to="/">Home</Link>
        </li>
        <li className="link">
          <Link to="/appointments">Appointments</Link>
        </li>
        <li className="link">
          <Link to="/health-blog">Health Blog</Link>
        </li>
        <li className="link">
          <Link to="/reviews">Reviews</Link>
        </li>
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
      </ul>
    </nav>
  );
};

export default Navbar;
