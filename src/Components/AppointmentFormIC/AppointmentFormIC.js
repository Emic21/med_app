import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './AppointmentFormIC.css';

const AppointmentFormIC = ({
  doctorName,
  doctorSpeciality,
  onSubmit,
  onCancel,
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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const API_URL = 'https://api.npoint.io/9a5543d36f1460da2f63';

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!formData.selectedDate) return;
      
      setIsLoadingSlots(true);
      setError('');
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch available slots');
        }
        const data = await response.json();
        
        // Find the doctor in the API response
        const doctor = data.find(doc => doc.name === doctorName);
        if (!doctor) {
          throw new Error('Doctor not found in available slots');
        }
        
        // Use the doctor's available slots or default slots
        const slots = doctor.availableSlots || ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'];
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setError('Failed to load available time slots');
        setAvailableSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [formData.selectedDate, doctorName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
        date: formData.selectedDate,
        doctorName,
        doctorSpeciality
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
    <div className="appointment-form-container">
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
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="selectedSlot">Time Slot:</label>
          {isLoadingSlots ? (
            <div className="loading-slots">Loading available slots...</div>
          ) : (
            <select
              id="selectedSlot"
              name="selectedSlot"
              value={formData.selectedSlot}
              onChange={handleChange}
              required
              disabled={loading || isLoadingSlots || availableSlots.length === 0}
            >
              <option value="">Select a time slot</option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          )}
          {availableSlots.length === 0 && formData.selectedDate && !isLoadingSlots && (
            <p className="no-slots-message">No available slots for this date</p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading || isLoadingSlots}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
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
    </div>
  );
};

AppointmentFormIC.propTypes = {
  doctorName: PropTypes.string.isRequired,
  doctorSpeciality: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

AppointmentFormIC.defaultProps = {
  loading: false
};

export default AppointmentFormIC;