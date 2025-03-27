import React, { useEffect, useState, useCallback } from 'react';
import './InstantConsultation.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FindDoctorSearchIC from '../FindDoctorSearchIC/FindDoctorSearchIC';
import DoctorCardIC from '../DoctorCardIC/DoctorCardIC';
import Notification from '../Notification/Notification';

const API_URL = 'https://api.npoint.io/9a5543d36f1460da2f63';

const InstantConsultation = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getDoctorsDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors. Please try again later.');
      }
      const data = await response.json();
      setDoctors(data);
      filterDoctors(data, searchParams.get('speciality') || '');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  const filterDoctors = (doctorsList, query) => {
    if (!doctorsList || !Array.isArray(doctorsList)) return;
    const lowerCaseQuery = query.toLowerCase();
    const filtered = doctorsList.filter(
      (doctor) =>
        (doctor.speciality && doctor.speciality.toLowerCase().includes(lowerCaseQuery)) ||
        (doctor.location && doctor.location.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredDoctors(filtered);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterDoctors(doctors, query);
  };

  const handleSpecialtySelect = (speciality) => {
    setSearchQuery(speciality);
    filterDoctors(doctors, speciality);
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
    <Notification>
      <center>
        <div className="searchpage-container">
          <div className="search-bar">
            <FindDoctorSearchIC
              onSearch={handleSearchChange}
              onSpecialtySelect={handleSpecialtySelect}
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
                    key={doctor.id}
                    name={doctor.name}
                    speciality={doctor.speciality}
                    experience={doctor.experience}
                    ratings={doctor.ratings}
                    profilePic={doctor.profilePic}
                    location={doctor.location}
                  />
                ))}
              </>
            ) : (
              <p className="no-doctors-found">No doctors found for your search.</p>
            )}
          </div>
        </div>
      </center>
    </Notification>
  );
};

export default InstantConsultation;