import React, { useState } from 'react';

const AppointmentFormIC = ({ doctorName, doctorSpeciality, onSubmit }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');

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
    onSubmit({ name, phoneNumber, selectedSlot });
    setName('');
    setPhoneNumber('');
    setSelectedSlot(null);
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
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit">Book Now</button>
    </form>
  );
};

export default AppointmentFormIC;