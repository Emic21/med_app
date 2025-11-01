import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div data-aos="fade-up" className="flex-hero">
          <div className="heading-container">
            <h1>
              Your Health
              <span className="text-gradient">Our Responsibility</span>
            </h1>
          </div>
          
          {/* Blob Background Elements */}
          <div className="blob-cont">
            <div className="blue blob"></div>
            <div className="blue1 blob"></div>
          </div>
          
          <h4>
            At StayHealthy, we have always made lifelong health our top priority. 
            We continually consider how to support the overall health of every patient 
            that walks through our door.
          </h4>
          
          <div className="button-container">
            <Link to="/InstantConsultation">
              <button className="button">Get Started</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
