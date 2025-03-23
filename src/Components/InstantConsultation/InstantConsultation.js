import React, { useEffect, useState, useCallback } from 'react';
import './InstantConsultation.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FindDoctorSearchIC from '../FindDoctorSearchIC/FindDoctorSearchIC';
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
    if (!doctorsList || !Array.isArray(doctorsList)) return; // Ensure doctorsList is an array
    const lowerCaseQuery = query.toLowerCase();
    const filtered = doctorsList.filter(
      (doctor) =>
        (doctor.speciality && doctor.speciality.toLowerCase().includes(lowerCaseQuery)) ||
        (doctor.location && doctor.location.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredDoctors(filtered);
  };

  // Handle search input change
  const handleSearchChange = (query) => {
    setSearchQuery(query); // Update the search query state
    filterDoctors(doctors, query); // Filter doctors based on the search query
  };

  // Handle selection of a specialty from FindDoctorSearchIC
  const handleSpecialtySelect = (speciality) => {
    setSearchQuery(speciality); // Update the search query state
    filterDoctors(doctors, speciality); // Filter doctors based on the selected specialty
  };

  useEffect(() => {
    getDoctorsDetails();
    const authtoken = sessionStorage.getItem('auth-token');
    if (!authtoken) {
      navigate('/login');
    }
  }, [getDoctorsDetails, navigate, searchParams]);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <center>
      <div className="searchpage-container">
        {/* Search Bar */}
        <div className="search-bar">
          <FindDoctorSearchIC
            onSearch={handleSearchChange} // Pass the search handler
            onSpecialtySelect={handleSpecialtySelect} // Pass the specialty selection handler
          />
          {searchQuery && <p>Searching for: {searchQuery}</p>}
        </div>
        <div className="search-results-container">
          {filteredDoctors.length > 0 ? (
            <>
              <h2>{filteredDoctors.length} doctors are available</h2>
              <h3>Book appointments with minimum wait-time & verified doctor details</h3>
              {filteredDoctors.map((doctor) => (
                <DoctorCardIC
                  key={doctor.id} // Add a unique key
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