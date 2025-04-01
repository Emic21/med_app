import React, { useState, useEffect, useCallback } from 'react';
import GiveReview from './GiveReview';
import './ReviewForm.css';

const ReviewForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = 'https://api.npoint.io/9a5543d36f1460da2f63';

  const fetchDoctors = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch doctors. Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Expected an array of doctors');
      }

      // Load individual reviews for each doctor
      const doctorsWithReviews = data.map(doctor => {
        const storedReview = localStorage.getItem(`doctor-${doctor.id}-review`);
        return {
          ...doctor,
          review: storedReview ? JSON.parse(storedReview).review : null,
          rating: storedReview ? JSON.parse(storedReview).rating : null,
          lastReviewed: storedReview ? JSON.parse(storedReview).lastReviewed : null
        };
      });

      setDoctors(doctorsWithReviews);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setApiError(err.message);
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleReviewSubmit = async (reviewData) => {
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Update ONLY the specific doctor that was reviewed
      const updatedDoctors = doctors.map(doctor => 
        doctor.id === reviewData.doctorId
          ? {
              ...doctor,
              review: reviewData.review,
              rating: reviewData.rating,
              lastReviewed: new Date().toISOString()
            }
          : doctor
      );

      // Store only this doctor's review
      localStorage.setItem(
        `doctor-${reviewData.doctorId}-review`,
        JSON.stringify({
          review: reviewData.review,
          rating: reviewData.rating,
          lastReviewed: new Date().toISOString()
        })
      );

      setDoctors(updatedDoctors);
      setSelectedDoctor(null);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading doctors...</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="api-error">
        <h3>We're experiencing issues</h3>
        <p>{apiError}</p>
        <button onClick={fetchDoctors}>Retry</button>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="no-doctors">
        <h3>No doctors available for review</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="review-container">
      <h1>Doctor Reviews</h1>
      
      <div className="table-responsive">
        <table className="doctors-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Doctor Name</th>
              <th>Speciality</th>
              <th>Feedback</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor.id}>
                <td>{index + 1}</td>
                <td>Dr. {doctor.name}</td>
                <td>{doctor.speciality}</td>
                <td>
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`feedback-btn ${doctor.review ? 'disabled' : ''}`}
                    disabled={isSubmitting || doctor.review}
                  >
                    {doctor.review ? 'View Feedback' : 'Give Feedback'}
                  </button>
                </td>
                <td>
                  {doctor.review ? (
                    <span className="status-reviewed">
                      <span className="status-icon">✓</span> Reviewed
                      {doctor.lastReviewed && (
                        <span className="review-date">
                          {new Date(doctor.lastReviewed).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="status-pending">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDoctor && (
        <GiveReview 
          doctor={selectedDoctor} 
          onClose={() => !isSubmitting && setSelectedDoctor(null)}
          onSubmit={handleReviewSubmit}
          loading={isSubmitting}
          initialReview={selectedDoctor.review || ''}
          initialRating={selectedDoctor.rating || 0}
        />
      )}
    </div>
  );
};

export default ReviewForm;