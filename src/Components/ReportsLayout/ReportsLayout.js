// ReportsLayout.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReportsLayout.css';

const API_URL = 'https://api.npoint.io/9a5543d36f1460da2f63';

const ReportsLayout = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const pdfPath = process.env.PUBLIC_URL + '/patient_report.pdf';

  const showAlert = useCallback((message, type = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    
    const timer = setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const fetchDoctors = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      
      const authToken = sessionStorage.getItem('auth-token');
      if (!authToken) {
        showAlert('Please login to access reports', 'error');
        navigate('/login');
        return;
      }

      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, 10000);

      const response = await fetch(API_URL, {
        signal: abortControllerRef.current.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      const reportsData = data.map((doctor, index) => ({
        id: doctor.id || `doc-${index}`,
        serialNumber: index + 1,
        doctorName: doctor.name || `Dr. ${doctor.speciality || 'Unknown'}`,
        doctorSpeciality: doctor.speciality || 'General Practice'
      }));
      
      setDoctors(reportsData);
      if (data.length === 0) {
        showAlert('No reports found for your account', 'info');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to load doctors:', err);
        const errorMsg = err.name === 'AbortError' 
          ? 'Request timed out. Please try again.' 
          : err.message || 'Failed to load reports. Please try again later.';
        setError(errorMsg);
        showAlert(errorMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, showAlert]);

  useEffect(() => {
    fetchDoctors();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchDoctors]);

  const handleViewReport = useCallback((doctorId, doctorName) => {
    try {
      const viewer = window.open('', '_blank');
      if (!viewer) {
        throw new Error('Popup blocked. Please allow popups to view reports.');
      }
      viewer.location.href = pdfPath;
      showAlert(`Opening report for ${doctorName}`, 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    }
  }, [pdfPath, showAlert]);

  const handleDownloadReport = useCallback(async (doctorId, doctorName) => {
    try {
      setDownloadStatus(`Preparing report for ${doctorName}...`);
      
      const response = await fetch(pdfPath);
      if (!response.ok) {
        throw new Error('Report file not found on server');
      }
      
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Report file is empty');
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Medical_Report_${doctorName.replace(/\s+/g, '_')}_${doctorId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      showAlert(`Download started for ${doctorName}'s report`, 'success');
    } catch (err) {
      console.error('Download failed:', err);
      showAlert(`Failed to download report: ${err.message}`, 'error');
    } finally {
      setDownloadStatus(null);
    }
  }, [pdfPath, showAlert]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading reports...</p>
        {downloadStatus && <p className="download-status">{downloadStatus}</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
        <button 
          onClick={fetchDoctors}
          className="retry-btn"
          disabled={loading}
        >
          {loading ? 'Retrying...' : 'Retry Now'}
        </button>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="alerts-container">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className={`alert alert-${alert.type}`}
            onClick={() => removeAlert(alert.id)}
          >
            {alert.message}
          </div>
        ))}
      </div>

      <h2>Reports</h2>
      {downloadStatus && (
        <div className="download-status-banner">
          {downloadStatus}
        </div>
      )}
      
      {doctors.length === 0 ? (
        <div className="no-reports">
          <p>No reports available in your account</p>
          <div className="no-reports-help">
            <p>If you expected to see reports:</p>
            <ul>
              <li>Your doctor may not have uploaded reports yet</li>
              <li>Check back later or contact your healthcare provider</li>
              <li>Ensure you're logged in with the correct account</li>
            </ul>
          </div>
          <button 
            onClick={fetchDoctors} 
            className="refresh-btn"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Check Again'}
          </button>
        </div>
      ) : (
        <div className="reports-table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Doctor Name</th>
                <th>Doctor Speciality</th>
                <th>View Report</th>
                <th>Download Report</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.serialNumber}</td>
                  <td>{doctor.doctorName}</td>
                  <td>{doctor.doctorSpeciality}</td>
                  <td>
                    <button 
                      onClick={() => handleViewReport(doctor.id, doctor.doctorName)}
                      className="view-btn"
                      disabled={downloadStatus}
                    >
                      View Report
                    </button>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDownloadReport(doctor.id, doctor.doctorName)}
                      className="download-btn"
                      disabled={downloadStatus}
                    >
                      {downloadStatus ? 'Downloading...' : 'Download Report'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsLayout;