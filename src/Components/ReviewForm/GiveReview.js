import React, { useState } from 'react';
import './GiveReview.css';

const GiveReview = ({ 
  doctor, 
  onClose, 
  onSubmit, 
  loading,
  initialReview = '',
  initialRating = 0 
}) => {
  const [review, setReview] = useState(initialReview);
  const [rating, setRating] = useState(initialRating);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!review.trim()) {
      setError('Please write your review');
      return;
    }

    if (review.trim().length < 10) {
      setError('Review should be at least 10 characters');
      return;
    }

    setError('');
    onSubmit({ 
      review: review.trim(), 
      rating,
      doctorId: doctor.id // CRUCIAL: Pass the specific doctor's ID
    });
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button 
          className="close-btn" 
          onClick={onClose}
          disabled={loading}
          aria-label="Close review form"
        >
          &times;
        </button>
        
        <div className="doctor-info">
          <h2>Review for Dr. {doctor.name}</h2>
          <p className="speciality">{doctor.speciality}</p>
          {doctor.experience && (
            <p className="experience">{doctor.experience} years of experience</p>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rating">Your Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <React.Fragment key={star}>
                  <input
                    type="radio"
                    id={`star-${star}`}
                    name="rating"
                    value={star}
                    checked={rating === star}
                    onChange={() => setRating(star)}
                    className="visually-hidden"
                  />
                  <label
                    htmlFor={`star-${star}`}
                    className={`star ${star <= rating ? 'filled' : ''}`}
                    aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                  >
                    ★
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="review-text">Your Review:</label>
            <textarea
              id="review-text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience (minimum 10 characters)..."
              rows="5"
              disabled={loading}
              aria-describedby="review-help"
            />
            <small id="review-help">Be honest and specific about your experience</small>
          </div>
          
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  <span>Submitting...</span>
                </>
              ) : (
                initialReview ? 'Update Review' : 'Submit Review'
              )}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiveReview;