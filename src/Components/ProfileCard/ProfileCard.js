import React, { useEffect, useState, useCallback } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import "./ProfileCard.css";

const ProfileCard = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [updatedDetails, setUpdatedDetails] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");

      if (!authtoken || !email) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/user`, {
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Email": email,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const user = await response.json();
      setUserDetails(user);
      setUpdatedDetails(user);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/login");
    } else {
      fetchUserProfile();
    }
  }, [fetchUserProfile, navigate]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");

      if (!authtoken || !email) {
        navigate("/login");
        return;
      }

      const payload = { ...updatedDetails };
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
          "Email": email,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      sessionStorage.setItem("name", updatedDetails.name);
      sessionStorage.setItem("phone", updatedDetails.phone);
      setUserDetails(updatedDetails);
      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUpdatedDetails(userDetails);
    setEditMode(false);
    setError(null);
  };

  if (isLoading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="profile-error">
        <p>Error: {error}</p>
        <button onClick={fetchUserProfile}>Retry</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <h2>Edit Profile</h2>
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={updatedDetails.name || ""}
              onChange={handleInputChange}
              required
              minLength="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={updatedDetails.phone || ""}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={userDetails.email || ""}
              disabled
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <h2>Profile Details</h2>
          
          <div className="profile-detail">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{userDetails.name}</span>
          </div>
          
          <div className="profile-detail">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{userDetails.email}</span>
          </div>
          
          <div className="profile-detail">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{userDetails.phone}</span>
          </div>

          <button onClick={handleEdit} className="btn-edit">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;