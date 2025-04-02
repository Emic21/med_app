import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './GiveReview.css';

const GiveReview = ({ 
  doctor, 
  onClose, 
  onSubmit, 
  loading,
  initialReview = '',
  initialRating = 0,
  initialReviewerName = ''
}) => {
  const [review, setReview] = useState(initialReview);
  const [rating, setRating] = useState(initialRating);
  const [reviewerName, setReviewerName] = useState(initialReviewerName);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    if (!reviewerName.trim()) {
      setError('Please enter your name');
      return;
    }

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

    if (!doctor?.id) {
      setError('Invalid doctor information');
      return;
    }

    if (isMounted) {
      onSubmit({ 
        review: review.trim(), 
        rating,
        reviewerName: reviewerName.trim(),
        doctorId: doctor.id
      });
    }
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
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reviewer-name">Your Name:</label>
            <input
              type="text"
              id="reviewer-name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
              required
            />
          </div>

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
                    disabled={loading}
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
              required
              minLength="10"
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

GiveReview.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    speciality: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  initialReview: PropTypes.string,
  initialRating: PropTypes.number,
  initialReviewerName: PropTypes.string
};

export default GiveReview;