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
      
      if (!response.ok) throw new Error(`Failed to fetch doctors. Status: ${response.status}`);

      const data = await response.json();
      
      if (!Array.isArray(data)) throw new Error('Expected an array of doctors');

      const validatedDoctors = data.map(doctor => {
        if (!doctor.id || typeof doctor.id !== 'string') {
          console.warn('Doctor missing ID, generating one');
          doctor.id = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }

        if (!doctor.name || typeof doctor.name !== 'string') {
          doctor.name = 'Unknown Doctor';
        }

        if (!doctor.speciality || typeof doctor.speciality !== 'string') {
          doctor.speciality = 'General';
        }

        const reviewKey = `doctor-${doctor.id}-review`;
        const storedReview = localStorage.getItem(reviewKey);
        
        try {
          const reviewData = storedReview ? JSON.parse(storedReview) : null;
          return {
            ...doctor,
            review: reviewData?.review || null,
            rating: reviewData?.rating || null,
            lastReviewed: reviewData?.lastReviewed || null,
            reviewerName: reviewData?.reviewerName || null
          };
        } catch (e) {
          console.error('Invalid review data for', doctor.name, 'resetting');
          localStorage.removeItem(reviewKey);
          return {
            ...doctor,
            review: null,
            rating: null,
            lastReviewed: null,
            reviewerName: null
          };
        }
      });

      setDoctors(validatedDoctors);
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
    
    const handleStorageChange = () => {
      fetchDoctors();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchDoctors]);

  const handleReviewSubmit = async (reviewData) => {
    if (!reviewData?.doctorId) {
      console.error('Submission error: Missing doctorId');
      setApiError('Invalid review submission');
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    
    try {
      if (!reviewData.review || !reviewData.rating || !reviewData.reviewerName) {
        throw new Error('All review fields are required');
      }

      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('Invalid rating value');
      }

      if (reviewData.review.length < 10) {
        throw new Error('Review must be at least 10 characters');
      }

      const doctorIndex = doctors.findIndex(d => d.id === reviewData.doctorId);
      if (doctorIndex === -1) throw new Error('Doctor not found');

      const updatedDoctors = [...doctors];
      updatedDoctors[doctorIndex] = {
        ...updatedDoctors[doctorIndex],
        review: reviewData.review,
        rating: reviewData.rating,
        lastReviewed: new Date().toISOString(),
        reviewerName: reviewData.reviewerName
      };

      const storageKey = `doctor-${reviewData.doctorId}-review`;
      const reviewToStore = {
        review: reviewData.review,
        rating: reviewData.rating,
        lastReviewed: new Date().toISOString(),
        reviewerName: reviewData.reviewerName
      };
      
      localStorage.setItem(storageKey, JSON.stringify(reviewToStore));
      
      const stored = localStorage.getItem(storageKey);
      if (!stored) throw new Error('Failed to save review');

      setDoctors(updatedDoctors);
      setSelectedDoctor(null);
    } catch (err) {
      console.error('Review submission error:', err);
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
              <th>Serial Number</th>
              <th>Doctor Name</th>
              <th>Speciality</th>
              <th>Provide Feedback</th>
              <th>Review Given</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor.id}>
                <td>{index + 1}</td>
                <td>{doctor.name}</td>
                <td>{doctor.speciality}</td>
                <td>
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`feedback-btn ${doctor.review ? 'disabled' : ''}`}
                    disabled={isSubmitting || doctor.review}
                    aria-label={doctor.review ? `View feedback for Dr. ${doctor.name}` : `Give feedback to Dr. ${doctor.name}`}
                  >
                    {doctor.review ? 'View Feedback' : 'Click Here'}
                  </button>
                </td>
                <td>
                  {doctor.review ? (
                    <span className="status-reviewed">
                      {doctor.rating} ★
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
          initialReviewerName={selectedDoctor.reviewerName || ''}
        />
      )}
    </div>
  );
};

export default ReviewForm;