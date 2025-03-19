import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './DoctorCardIC.css';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';
import { v4 as uuidv4 } from 'uuid';

const DoctorCardIC = ({ name, speciality, experience, ratings, profilePic }) => {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const handleBooking = () => {
    setShowModal(true);
  };

  const handleCancel = (appointmentId) => {
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== appointmentId);
    setAppointments(updatedAppointments);
  };

  const handleFormSubmit = (appointmentData) => {
    const newAppointment = {
      id: uuidv4(),
      ...appointmentData,
    };
    setAppointments([...appointments, newAppointment]);
    setShowModal(false);
  };

  // Function to handle cancellation of the current appointment
  const handleCancelAppointment = () => {
    setAppointments([]); // Clear the appointments
    setShowModal(false); // Close the modal
  };

  return (
    <div className="doctor-card-container">
      <div className="doctor-card-details-container">
        <div className="doctor-card-profile-image-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            height="46"
            fill="currentColor"
            className="bi bi-person-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
        </div>
        <div className="doctor-card-details">
          <div className="doctor-card-detail-name">{name}</div>
          <div className="doctor-card-detail-speciality">{speciality}</div>
          <div className="doctor-card-detail-experience">{experience} years of experience</div>
          <div className="doctor-card-detail-ratings">Ratings: {ratings}</div>
        </div>
      </div>

      <div className="doctor-card-options-container">
        {/* Book Appointment Button */}
        <button
          className={`book-appointment-btn ${appointments.length > 0 ? 'cancel-appointment' : ''}`}
          onClick={handleBooking}
          aria-label={appointments.length > 0 ? 'Cancel Appointment' : 'Book Appointment'}
        >
          {appointments.length > 0 ? 'Cancel Appointment' : 'Book Appointment'}
          <div>No Booking Fee</div>
        </button>

        {/* Popup for Booking/Canceling Appointments */}
        <Popup
          modal
          open={showModal}
          onClose={() => setShowModal(false)}
          contentStyle={{ padding: '20px', borderRadius: '8px', maxWidth: '500px', width: '90%' }}
        >
          {(close) => (
            <div className="doctorbg">
              <div className="modal-header">
                <div className="doctor-card-profile-image-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="46"
                    height="46"
                    fill="currentColor"
                    className="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </div>
                <div className="doctor-card-details">
                  <div className="doctor-card-detail-name">{name}</div>
                  <div className="doctor-card-detail-speciality">{speciality}</div>
                  <div className="doctor-card-detail-experience">{experience} years of experience</div>
                  <div className="doctor-card-detail-ratings">Ratings: {ratings}</div>
                </div>
              </div>

              {appointments.length > 0 ? (
                <>
                  <h3 style={{ textAlign: 'center', margin: '20px 0' }}>Appointment Booked!</h3>
                  {appointments.map((appointment) => (
                    <div className="bookedInfo" key={appointment.id}>
                      <p>Name: {appointment.name}</p>
                      <p>Phone Number: {appointment.phoneNumber}</p>
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancel(appointment.id)}
                        aria-label="Cancel Appointment"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <AppointmentFormIC
                  doctorName={name}
                  doctorSpeciality={speciality}
                  onSubmit={handleFormSubmit} // Pass the onSubmit function
                  onCancel={handleCancelAppointment} // Pass the onCancel function
                />
              )}
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
};

export default DoctorCardIC;