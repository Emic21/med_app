import React, { useState } from 'react';
import './AppointmentFormIC.css';

const AppointmentFormIC = ({ doctorName, doctorSpeciality, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isBooked, setIsBooked] = useState(false); // Track if an appointment is booked

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !phoneNumber || !selectedSlot) {
      setError('Please fill out all fields and select a time slot.');
      return;
    }

    // Additional phone number validation
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setError('');
    onSubmit({ name, phoneNumber, selectedSlot }); // Call the onSubmit function
    setName('');
    setPhoneNumber('');
    setSelectedSlot(null);
    setSuccessMessage('Appointment booked successfully!');
    setIsBooked(true); // Mark appointment as booked
  };

  const handleCancel = () => {
    onCancel(); // Call the onCancel function
    setIsBooked(false); // Mark appointment as canceled
    setSuccessMessage(''); // Clear success message
  };

  return (
    <form onSubmit={handleFormSubmit} className="appointment-form">
      <h2>Book Appointment with {doctorName}</h2>
      <p>Speciality: {doctorSpeciality}</p>

      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="Enter your name"
          disabled={isBooked} // Disable input if appointment is booked
        />
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          aria-label="Enter your phone number"
          disabled={isBooked} // Disable input if appointment is booked
        />
      </div>

      <div className="form-group">
        <label>Select a Time Slot:</label>
        <div className="time-slots">
          {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM'].map((slot) => (
            <button
              type="button"
              key={slot}
              className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
              onClick={() => handleSlotSelection(slot)}
              aria-label={`Select ${slot}`}
              disabled={isBooked} // Disable time slot selection if appointment is booked
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {!isBooked ? (
        <button type="submit" className="submit-button">
          Book Now
        </button>
      ) : (
        <button
          type="button"
          className="cancel-button"
          onClick={handleCancel}
          aria-label="Cancel Appointment"
        >
          Cancel Appointment
        </button>
      )}
    </form>
  );
};

export default AppointmentFormIC;