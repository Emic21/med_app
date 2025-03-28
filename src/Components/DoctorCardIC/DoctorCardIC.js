import React, { useState, useEffect, useCallback } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './DoctorCardIC.css';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';
import { v4 as uuidv4 } from 'uuid';

// SVG Icon for Profile Picture
const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="46"
    height="46"
    fill="currentColor"
    className="bi bi-person-fill"
    viewBox="0 0 16 16"
    aria-hidden="true"
  >
    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </svg>
);

const DoctorCardIC = ({ name, speciality, experience, ratings, profilePic }) => {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // Memoize the getAppointments function to prevent unnecessary recreations
  const getAppointments = useCallback(() => {
    const stored = localStorage.getItem('doctorAppointments');
    const allAppointments = stored ? JSON.parse(stored) : [];
    return allAppointments.filter(app => app.doctorName === name);
  }, [name]);

  // Save appointments to localStorage
  const saveAppointments = useCallback((apps) => {
    localStorage.setItem('doctorAppointments', JSON.stringify(apps));
  }, []);

  // Load appointments on component mount and when name changes
  useEffect(() => {
    setAppointments(getAppointments());
  }, [getAppointments]); // Now properly includes all dependencies

  const handleBooking = () => {
    setShowModal(true);
  };

  const handleCancel = useCallback((appointmentId) => {
    const allAppointments = getAppointments();
    const appointmentToCancel = allAppointments.find(app => app.id === appointmentId);
    const updatedAppointments = allAppointments.filter(app => app.id !== appointmentId);

    // Update local storage
    const allDocsAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    const updatedAllAppointments = allDocsAppointments.filter(app => app.id !== appointmentId);
    saveAppointments(updatedAllAppointments);

    // Update state
    setAppointments(updatedAppointments);

    // Dispatch cancellation event
    window.dispatchEvent(new CustomEvent('appointmentUpdated', {
      detail: {
        action: 'cancelled',
        appointmentData: {
          ...appointmentToCancel,
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        }
      }
    }));

    alert('Appointment canceled successfully!');
  }, [getAppointments, saveAppointments]);

  const handleFormSubmit = useCallback((appointmentData) => {
    const newAppointment = {
      id: uuidv4(),
      doctorName: name,
      doctorSpeciality: speciality,
      ...appointmentData,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };

    // Update local storage
    const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || []);
    const updatedAppointments = [...allAppointments, newAppointment];
    saveAppointments(updatedAppointments);

    // Update state
    setAppointments(prev => [...prev, newAppointment]);

    // Dispatch booking event
    window.dispatchEvent(new CustomEvent('appointmentUpdated', {
      detail: {
        action: 'booked',
        appointmentData: newAppointment
      }
    }));

    alert('Appointment booked successfully!');
  }, [name, speciality, saveAppointments]);

  const handleCancelAppointment = () => {
    setAppointments([]);
    setShowModal(false);
  };

  return (
    <div className="doctor-card-container">
      <div className="doctor-card-details-container">
        <div className="doctor-card-profile-image-container">
          <ProfileIcon />
        </div>
        <div className="doctor-card-details">
          <div className="doctor-card-detail-name">{name}</div>
          <div className="doctor-card-detail-speciality">{speciality}</div>
          <div className="doctor-card-detail-experience">{experience} years of experience</div>
          <div className="doctor-card-detail-ratings">Ratings: {ratings}</div>
        </div>
      </div>

      <div className="doctor-card-options-container">
        <button
          className={`book-appointment-btn ${appointments.length > 0 ? 'cancel-appointment' : ''}`}
          onClick={handleBooking}
          aria-label={appointments.length > 0 ? 'Cancel Appointment' : 'Book Appointment'}
        >
          {appointments.length > 0 ? 'Cancel Appointment' : 'Book Appointment'}
          <div>No Booking Fee</div>
        </button>

        <Popup
          modal
          open={showModal}
          onClose={() => setShowModal(false)}
          contentStyle={{ padding: '20px', borderRadius: '8px', maxWidth: '500px', width: '90%' }}
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div className="doctorbg">
              <div className="modal-header">
                <button
                  className="modal-close-btn"
                  onClick={close}
                  aria-label="Close Modal"
                >
                  &times;
                </button>
                <div className="doctor-card-profile-image-container">
                  <ProfileIcon />
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
                      <p>Date: {appointment.date}</p>
                      <p>Time Slot: {appointment.slot}</p>
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
                  onSubmit={handleFormSubmit}
                  onCancel={handleCancelAppointment}
                  availableSlots={['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']}
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