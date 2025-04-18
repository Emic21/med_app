// Import necessary modules from React library
/* import React, { useEffect } from 'react';  */

// Import components for routing from react-router-dom library
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import custom Navbar component
import Navbar from './Components/Navbar/Navbar';
import LandingPage from "./Components/Landing_Page/LandingPage";
import SignUp from "./Components/Sign_Up/SignUp"
import Login from "./Components/Login/Login";
import InstantConsultation from "./Components/InstantConsultation/InstantConsultation";
import FindDoctorSearchIC from "./Components/FindDoctorSearchIC/FindDoctorSearchIC";
import DoctorCardIC from "./Components/DoctorCardIC/DoctorCardIC";
import AppointmentFormIC from "./Components/AppointmentFormIC/AppointmentFormIC";
import ReviewForm from "./Components/ReviewForm/ReviewForm";
import ProfileCard from "./Components/ProfileCard/ProfileCard";
import ReportsLayout from "./Components/ReportsLayout/ReportsLayout";




// Function component for the main App
function App() {

  // Render the main App component
  return (
    <div className="App">
        {/* Set up BrowserRouter for routing */}
        <BrowserRouter>
          {/* Display the Navbar component */}
          <Navbar/>
          
          
          

          {/* Set up the Routes for different pages */}
          <Routes>
            {/* Define individual Route components for different pages */}
           
            <Route path="/SignUp" element={<SignUp />} />
      <Route path="/AppointmentFormIC" element={<AppointmentFormIC />} />  
        {/* <Route path="/health-blog" element={<HealthBlog />} /> */}
        <Route path="/reviews" element={<ReviewForm />} /> 
        <Route path="/InstantConsultation" element={<InstantConsultation />} />
        <Route path="/FindDoctorSearchIC" element={<FindDoctorSearchIC />} />
        <Route path="/DoctorCardIC" element={<DoctorCardIC />} />
        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/reportslayout" element={<ReportsLayout />} /> 
        <Route path="/Login" element={<Login />} />
       
            {/* Home Route - Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
          </Routes>
        </BrowserRouter>
    </div>
  );
}

// Export the App component as the default export
export default App;
