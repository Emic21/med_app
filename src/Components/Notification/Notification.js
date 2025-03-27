import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../Navbar/Navbar';
import './Notification.css';

const Notification = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isCancelled: false,
    details: {
      patientName: "",
      date: "",
      time: "",
      doctorName: ""
    },
    visible: false
  });

  // Get the latest appointment from localStorage
  const getLatestAppointment = useCallback(() => {
    try {
      const stored = localStorage.getItem('doctorAppointments');
      if (!stored) return null;
      
      const appointments = JSON.parse(stored);
      if (!appointments.length) return null;
      
      return appointments.reduce((latest, current) => {
        const currentTime = new Date(current.bookedAt || 0).getTime();
        const latestTime = new Date(latest.bookedAt || 0).getTime();
        return currentTime > latestTime ? current : latest;
      });
    } catch (error) {
      console.error("Error reading appointments:", error);
      return null;
    }
  }, []);

  // Update notification state
  const updateNotification = useCallback((action, details = null) => {
    const latestAppointment = details || getLatestAppointment();
    
    if (!latestAppointment) {
      setNotification(prev => ({ ...prev, show: false, visible: false }));
      return;
    }

    const isCancelled = action === 'cancelled';
    const newNotification = {
      show: true,
      visible: true,
      isCancelled,
      message: isCancelled
        ? `Appointment with Dr. ${latestAppointment.doctorName} has been cancelled`
        : `Appointment confirmed with Dr. ${latestAppointment.doctorName}`,
      details: {
        patientName: latestAppointment.name || username,
        date: latestAppointment.date || "Not specified",
        time: latestAppointment.slot || "Not specified",
        doctorName: latestAppointment.doctorName || "Unknown Doctor"
      }
    };

    setNotification(newNotification);

    const timeout = setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, isCancelled ? 10000 : 5000);

    return () => clearTimeout(timeout);
  }, [getLatestAppointment, username]);

  // Handle appointment update events
  const handleAppointmentUpdate = useCallback((e) => {
    if (e.detail) {
      const { action, appointmentData } = e.detail;
      updateNotification(action, appointmentData);
    }
  }, [updateNotification]);

  // Initialize component
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('email');
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }

    window.addEventListener('appointmentUpdated', handleAppointmentUpdate);
    return () => {
      window.removeEventListener('appointmentUpdated', handleAppointmentUpdate);
    };
  }, [handleAppointmentUpdate]);

  // Check for existing appointments on login
  useEffect(() => {
    if (isLoggedIn) {
      const appointment = getLatestAppointment();
      if (appointment) {
        updateNotification(
          appointment.status === 'cancelled' ? 'cancelled' : 'booked', 
          appointment
        );
      }
    }
  }, [isLoggedIn, getLatestAppointment, updateNotification]);

  // Handle manual dismissal
  const dismissNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, visible: false, show: false }));
  }, []);

  return (
    <div>
      <Navbar />
      {children}
      
      {isLoggedIn && notification.show && notification.visible && (
        <div className={`notification-banner ${notification.isCancelled ? 'cancelled' : 'confirmed'} show`}>
          <div className="notification-content">
            <div className="notification-header">
              <h4>{notification.message}</h4>
              <button 
                className="dismiss-button" 
                onClick={dismissNotification}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
            <div className="notification-details">
              <p><strong>Patient:</strong> {notification.details.patientName}</p>
              <p><strong>Doctor:</strong> Dr. {notification.details.doctorName}</p>
              <p><strong>Date:</strong> {notification.details.date}</p>
              <p><strong>Time:</strong> {notification.details.time}</p>
              {notification.isCancelled && (
                <p className="cancelled-time">
                  Cancelled at: {new Date().toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;