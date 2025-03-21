import React, { useEffect, useState, useCallback } from 'react';
import './InstantConsultation.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DoctorCardIC from '../DoctorCardIC/DoctorCardIC';

const API_URL = 'https://api.npoint.io/9a5543d36f1460da2f63'; // Replace with your API endpoint

const InstantConsultation = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]); // All doctors from the API
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Filtered doctors based on search
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search input value
  const navigate = useNavigate();

  // Fetch all doctors from the API
  const getDoctorsDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors. Please try again later.');
      }
      const data = await response.json();
      setDoctors(data); // Store all doctors
      filterDoctors(data, searchParams.get('speciality') || ''); // Filter based on initial speciality
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  // Filter doctors based on speciality or location
  const filterDoctors = (doctorsList, query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = doctorsList.filter(
      (doctor) =>
        doctor.speciality.toLowerCase().includes(lowerCaseQuery) ||
        doctor.location.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredDoctors(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterDoctors(doctors, query); // Filter doctors based on the search query
  };

  useEffect(() => {
    getDoctorsDetails();
    const authtoken = sessionStorage.getItem('auth-token');
    if (!authtoken) {
      navigate('/login');
    }
  }, [getDoctorsDetails, navigate, searchParams]);

  return (
    <center>
      <div className="searchpage-container">
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search doctors by speciality or location..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search doctors"
            />
            {/* SVG Search Icon */}
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M10 2a8 8 0 105.293 14.707l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
          </div>
        </div>

        <div className="search-results-container">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : filteredDoctors.length > 0 ? (
            <>
              <h2>{filteredDoctors.length} doctors are available</h2>
              <h3>Book appointments with minimum wait-time & verified doctor details</h3>
              {filteredDoctors.map((doctor) => (
                <DoctorCardIC
                  key={doctor.id}
                  name={doctor.name}
                  speciality={doctor.speciality}
                  experience={doctor.experience}
                  ratings={doctor.ratings}
                  profilePic={doctor.profilePic}
                  location={doctor.location} // Pass location to DoctorCardIC if needed
                />
              ))}
            </>
          ) : (
            <p className="no-doctors-found">No doctors found for your search.</p>
          )}
        </div>
      </div>
    </center>
  );
};

export default InstantConsultation;