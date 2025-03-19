//import React, { useEffect, useState } from 'react';
import './InstantConsultation.css';
//import { useNavigate, useSearchParams } from 'react-router-dom';
//import FindDoctorSearchIC from '../FindDoctorSearchIC/FindDoctorSearchIC';
//import DoctorCardIC from '../DoctorCardIC/DoctorCardIC';

import React, { useEffect, useState, useCallback } from 'react';
import './InstantConsultation.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DoctorCardIC from '../DoctorCardIC/DoctorCardIC';

const InstantConsultation = () => {
  const [searchParams] = useSearchParams();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getDoctorsDetails = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetch('https://api.npoint.io/9a5543d36f1460da2f63') // Replace with your API endpoint
      .then((res) => res.json())
      .then((data) => {
        // Filter doctors based on the speciality query parameter
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
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch doctors. Please try again later.');
      })
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  useEffect(() => {
    getDoctorsDetails();
    const authtoken = sessionStorage.getItem('auth-token');
    if (!authtoken) {
      navigate('/login');
    }
  }, [getDoctorsDetails, navigate, searchParams]); // Add getDoctorsDetails to the dependency array

  return (
    <center>
      <div className="searchpage-container">
        <div className="search-results-container">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : isSearched ? (
            <>
              <h2>{filteredDoctors.length} doctors are available</h2>
              <h3>Book appointments with minimum wait-time & verified doctor details</h3>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCardIC
                    key={doctor.id}
                    name={doctor.name}
                    speciality={doctor.speciality}
                    experience={doctor.experience}
                    ratings={doctor.ratings}
                    profilePic={doctor.profilePic}
                  />
                ))
              ) : (
                <p>No doctors found.</p>
              )}
            </>
          ) : (
            <p>Search for doctors by speciality or location.</p>
          )}
        </div>
      </div>
    </center>
  );
};

export default InstantConsultation;