import React from "react"; // Importing React
import "./LandingPage.css"; // Importing CSS styles

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
          
          <a href="#services">
            <button className="button">Get Started</button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
