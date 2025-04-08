import React, { useState, useEffect, useCallback } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './DoctorCardIC.css';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';
import { v4 as uuidv4 } from 'uuid';

// Initialize localStorage if empty
const initializeAppointmentsStorage = () => {
  if (!localStorage.getItem('doctorAppointments')) {
    localStorage.setItem('doctorAppointments', JSON.stringify([]));
  }
};

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize storage on component mount
  useEffect(() => {
    initializeAppointmentsStorage();
  }, []);

  // Safe localStorage operations
  const getAppointments = useCallback(() => {
    try {
      const stored = localStorage.getItem('doctorAppointments');
      
      // Handle cases where stored is null, undefined, or empty
      if (!stored || stored === 'undefined' || stored === 'null' || stored.trim() === '') {
        localStorage.setItem('doctorAppointments', JSON.stringify([]));
        return [];
      }
      
      const parsed = JSON.parse(stored);
      
      if (!Array.isArray(parsed)) {
        console.error('Invalid appointments data format - resetting storage');
        localStorage.setItem('doctorAppointments', JSON.stringify([]));
        return [];
      }
      
      return parsed.filter(app => app.doctorName === name);
    } catch (err) {
      console.error('Error reading appointments:', err);
      localStorage.setItem('doctorAppointments', JSON.stringify([]));
      setError('Failed to load appointments. Please refresh the page.');
      return [];
    }
  }, [name]);

  const saveAppointments = useCallback((apps) => {
    try {
      if (!Array.isArray(apps)) {
        throw new Error('Invalid appointments data format');
      }
      localStorage.setItem('doctorAppointments', JSON.stringify(apps));
    } catch (err) {
      console.error('Error saving appointments:', err);
      setError('Failed to save appointment. Please try again.');
      throw err;
    }
  }, []);

  // Load appointments with error handling
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const apps = getAppointments();
        setAppointments(apps);
      } catch (err) {
        console.error('Error loading appointments:', err);
        setError('Failed to load appointments. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAppointments();
  }, [getAppointments]);

  const handleBooking = () => {
    setShowModal(true);
    setError(null);
  };

  const handleCancel = useCallback(async (appointmentId) => {
    try {
      setLoading(true);
      const allAppointments = getAppointments();
      const appointmentToCancel = allAppointments.find(app => app.id === appointmentId);
      
      if (!appointmentToCancel) {
        throw new Error('Appointment not found');
      }

      const updatedAppointments = allAppointments.filter(app => app.id !== appointmentId);
      await saveAppointments(updatedAppointments);
      setAppointments(updatedAppointments);

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
    } catch (err) {
      console.error('Error canceling appointment:', err);
      setError(err.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [getAppointments, saveAppointments]);

  const handleFormSubmit = useCallback(async (appointmentData) => {
    try {
      setLoading(true);
      const newAppointment = {
        id: uuidv4(),
        doctorName: name,
        doctorSpeciality: speciality,
        ...appointmentData,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      };

      const allAppointments = getAppointments();
      const updatedAppointments = [...allAppointments, newAppointment];
      await saveAppointments(updatedAppointments);

      setAppointments(prev => [...prev, newAppointment]);

      window.dispatchEvent(new CustomEvent('appointmentUpdated', {
        detail: {
          action: 'booked',
          appointmentData: newAppointment
        }
      }));

      alert('Appointment booked successfully!');
      return true;
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.message || 'Failed to book appointment. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [name, speciality, getAppointments, saveAppointments]);

  const handleCancelAppointment = () => {
    setAppointments([]);
    setShowModal(false);
  };

  return (
    <div className="doctor-card-container">
      {error && (
        <div className="error-banner" role="alert">
          {error}
          <button 
            onClick={() => setError(null)} 
            aria-label="Dismiss error message"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="doctor-card-details-container">
        <div className="doctor-card-profile-image-container">
          {profilePic ? (
            <img 
              src={profilePic} 
              alt={`${name}'s profile`} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.parentElement.innerHTML = <ProfileIcon />;
              }}
            />
          ) : (
            <ProfileIcon />
          )}
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
          disabled={loading}
          aria-label={appointments.length > 0 ? 'Cancel Appointment' : 'Book Appointment'}
        >
          {loading ? (
            <span className="loading-spinner"></span>
          ) : appointments.length > 0 ? (
            'Cancel Appointment'
          ) : (
            'Book Appointment'
          )}
          <div>No Booking Fee</div>
        </button>

        <Popup
          modal
          open={showModal}
          onClose={() => !loading && setShowModal(false)}
          contentStyle={{ padding: '20px', borderRadius: '8px', maxWidth: '500px', width: '90%' }}
          closeOnDocumentClick={!loading}
        >
          {(close) => (
            <div className="doctorbg">
              <div className="modal-header">
                <button
                  className="modal-close-btn"
                  onClick={close}
                  aria-label="Close Modal"
                  disabled={loading}
                >
                  &times;
                </button>
                <div className="doctor-card-profile-image-container">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt={`${name}'s profile`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.innerHTML = <ProfileIcon />;
                      }}
                    />
                  ) : (
                    <ProfileIcon />
                  )}
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
                      <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                      <p>Time Slot: {appointment.slot}</p>
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancel(appointment.id)}
                        disabled={loading}
                        aria-label="Cancel Appointment"
                      >
                        {loading ? (
                          <span className="loading-spinner small"></span>
                        ) : (
                          'Cancel Appointment'
                        )}
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
                  availableSlots={['9:00 AM','10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']}
                  loading={loading}
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