import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AppointmentFormIC.css';

const AppointmentFormIC = ({
  doctorName,
  doctorSpeciality,
  onSubmit,
  onCancel,
  availableSlots = [], // Default to an empty array
}) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Debug: Log availableSlots to verify it's being passed correctly
  console.log('Available Slots:', availableSlots);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !phoneNumber || !selectedSlot || !selectedDate) {
      setError('Please fill out all fields and select a date and time slot.');
      return;
    }

    // Phone number validation
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    // Clear errors and submit the form data
    setError('');
    onSubmit({ name, phoneNumber, slot: selectedSlot, date: selectedDate });
    setName('');
    setPhoneNumber('');
    setSelectedSlot('');
    setSelectedDate('');
    setSuccessMessage('Appointment booked successfully!');
  };

  return (
    <form onSubmit={handleFormSubmit} className="appointment-form">
      <h2>Book Appointment with {doctorName}</h2>
      <p>Speciality: {doctorSpeciality}</p>

      {/* Name Input */}
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="Enter your name"
        />
      </div>

      {/* Phone Number Input */}
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          placeholder="Enter 10-digit phone number"
          aria-label="Enter your phone number"
        />
      </div>

      {/* Date Input */}
      <div className="form-group">
        <label htmlFor="date">Appointment Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
          aria-label="Select appointment date"
        />
      </div>

      {/* Time Slot Selection */}
      <div className="form-group">
        <label htmlFor="slot">Select Time Slot:</label>
        <select
          id="slot"
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          required
        >
          <option value="">Select a slot</option>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No slots available
            </option>
          )}
        </select>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Success Message */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Book Now
      </button>

      {/* Cancel Button */}
      <button type="button" onClick={onCancel} className="cancel-button">
        Cancel
      </button>
    </form>
  );
};

AppointmentFormIC.propTypes = {
  doctorName: PropTypes.string.isRequired,
  doctorSpeciality: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  availableSlots: PropTypes.arrayOf(PropTypes.string),
};

AppointmentFormIC.defaultProps = {
  availableSlots: [], // Default to an empty array
};

export default AppointmentFormIC;