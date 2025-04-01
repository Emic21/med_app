import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AppointmentFormIC.css';

const AppointmentFormIC = ({
  doctorName,
  doctorSpeciality,
  onSubmit,
  onCancel,
  availableSlots = [],
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    selectedSlot: '',
    selectedDate: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const { name, phoneNumber, selectedSlot, selectedDate } = formData;

    if (!name.trim()) {
      throw new Error('Please enter your name');
    }

    if (!phoneNumber.trim()) {
      throw new Error('Please enter your phone number');
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      throw new Error('Please enter a valid 10-digit phone number');
    }

    if (!selectedDate) {
      throw new Error('Please select an appointment date');
    }

    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      throw new Error('Appointment date must be today or in the future');
    }

    if (!selectedSlot) {
      throw new Error('Please select a time slot');
    }

    if (!availableSlots.includes(selectedSlot)) {
      throw new Error('Selected time slot is not available');
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      validateForm();
      
      const submissionData = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        slot: formData.selectedSlot,
        date: formData.selectedDate
      };

      const success = await onSubmit(submissionData);
      
      if (success) {
        setSuccessMessage('Appointment booked successfully!');
        setFormData({
          name: '',
          phoneNumber: '',
          selectedSlot: '',
          selectedDate: ''
        });
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form" noValidate>
      <h2>Book Appointment with {doctorName}</h2>
      <p className="speciality-text">Speciality: {doctorSpeciality}</p>

      {error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="success-message" role="status">
          <span className="success-icon">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          aria-label="Enter your full name"
          aria-invalid={!!error && !formData.name}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          pattern="[0-9]{10}"
          maxLength="10"
          aria-label="Enter your 10-digit phone number"
          aria-invalid={!!error && !/^\d{10}$/.test(formData.phoneNumber)}
          disabled={loading}
        />
        <small className="hint-text">10 digits only</small>
      </div>

      <div className="form-group">
        <label htmlFor="selectedDate">Appointment Date:</label>
        <input
          type="date"
          id="selectedDate"
          name="selectedDate"
          value={formData.selectedDate}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
          aria-label="Select appointment date"
          aria-invalid={!!error && !formData.selectedDate}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="selectedSlot">Time Slot:</label>
        <select
          id="selectedSlot"
          name="selectedSlot"
          value={formData.selectedSlot}
          onChange={handleChange}
          required
          disabled={loading || availableSlots.length === 0}
          aria-label="Select time slot"
          aria-invalid={!!error && !formData.selectedSlot}
        >
          <option value="">Select a time slot</option>
          {availableSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {availableSlots.length === 0 && (
          <p className="no-slots-message">No available slots at this time</p>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner small"></span>
              Booking...
            </>
          ) : (
            'Book Appointment'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cancel-button"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

AppointmentFormIC.propTypes = {
  doctorName: PropTypes.string.isRequired,
  doctorSpeciality: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  availableSlots: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool
};

AppointmentFormIC.defaultProps = {
  availableSlots: [],
  loading: false
};

export default AppointmentFormIC;