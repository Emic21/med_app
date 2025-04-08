import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <section className="hero-section">
      <div>
        <div data-aos="fade-up" className="flex-hero">
          <h1>
            Your Health<br />
            <span className="text-gradient">Our Responsibility</span>
          </h1>
          
          <div className="blob-cont">
            <div className="blue blob"></div>
          </div>
          <div className="blob-cont">
            <div className="blue1 blob"></div>
          </div>
          
          <h4>
            At StayHealthy, we have always made lifelong health our top priority. 
            We continually consider how to support the overall health of every patient 
            that walks through our door.
          </h4>
          
          <Link to="/InstantConsultation">
            <button className="button">Get Started</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;