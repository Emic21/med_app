import React, { useEffect, useState, useCallback } from 'react';
import './InstantConsultation.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FindDoctorSearchIC from './FindDoctorSearchIC/FindDoctorSearchIC';
import DoctorCardIC from './DoctorCardIC/DoctorCardIC';

const InstantConsultation = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getDoctorsDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.npoint.io/9a5543d36f1460da2f63');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data);

      if (searchParams.get('speciality')) {
        const filtered = data.filter(
          (doctor) =>
            doctor.speciality.toLowerCase() === searchParams.get('speciality').toLowerCase()
        );
        setFilteredDoctors(filtered);
        setIsSearched(true);
      } else {
        setFilteredDoctors([]);
        setIsSearched(false);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    getDoctorsDetails();
  }, [getDoctorsDetails, navigate]);

  const handleSearch = (searchText) => {
    if (searchText === '') {
      setFilteredDoctors([]);
      setIsSearched(false);
    } else {
      const filtered = doctors.filter((doctor) =>
        doctor.speciality.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredDoctors(filtered);
      setIsSearched(true);
    }
  };

  return (
    <center>
      <div className="searchpage-container">
        <FindDoctorSearchIC onSearch={handleSearch} />
        <div className="search-results-container">
          {isLoading ? (
            <p>Loading doctors...</p>
          ) : error ? (
            <p className="error-message">Error: {error}</p>
          ) : isSearched ? (
            <>
              <h2>
                {filteredDoctors.length} doctors are available {searchParams.get('location')}
              </h2>
              <h3>Book appointments with minimum wait-time & verified doctor details</h3>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCardIC className="doctorcard" {...doctor} key={doctor.name} />
                ))
              ) : (
                <p>No doctors found for your search.</p>
              )}
            </>
          ) : (
            <p>Start your search to find doctors.</p>
          )}
        </div>
      </div>
    </center>
  );
};

export default InstantConsultation;