import React, { useState } from 'react';
import './Sign_Up.css';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const SignUp = () => {
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePhone = (phone) => {
    // Adjusted phone validation pattern to accommodate various formats
    const phonePattern = /^[0-9]{10,15}$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      formErrors.phone = 'Phone number must be between 10 and 15 digits.';
    }

    // Ensure all fields are filled
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = 'This field is required.';
      }
    });

    if (Object.keys(formErrors).length === 0) {
      // Proceed with form submission
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const json = await response.json();

        if (json.authtoken) {
          // Store user data in session storage
          sessionStorage.setItem('auth-token', json.authtoken);
          sessionStorage.setItem('name', formData.name);
          sessionStorage.setItem('phone', formData.phone);
          sessionStorage.setItem('email', formData.email);
          sessionStorage.setItem('role', formData.role);

          // Redirect user to home page
          navigate('/');
          window.location.reload(); // Refresh the page
        } else {
          if (json.errors) {
            for (const error of json.errors) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                [error.param]: error.msg,
              }));
            }
          } else {
            setErrors({ form: json.error });
          }
        }
      } catch (error) {
        setErrors({ form: 'An error occurred during registration. Please try again later.' });
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="container mt-5">
      <div className="signup-grid">
        <div className="signup-text">
          <h1>Sign Up</h1>
        </div>
        <div className="signup-text1 text-left">
          Already a member?{' '}
          <span>
            <a href="../Login/Login.js" style={{ color: '#2190FF' }}>
              {' '}
              Login
            </a>
          </span>
        </div>
        <div className="signup-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                name="role"
                id="role"
                required
                className="form-control"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
              {errors.role && (
                <small className="text-danger">{errors.role}</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                className="form-control"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <small className="text-danger">{errors.phone}</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            {errors.form && (
              <div className="alert alert-danger" role="alert">
                {errors.form}
              </div>
            )}

            <div className="btn-group">
              <button
                type="submit"
                className="btn btn-primary mb-2 mr-1 waves-effect waves-light"
              >
                Submit
              </button>
              <button
                type="reset"
                className="btn btn-danger mb-2 waves-effect waves-light"
                onClick={() =>
                  setFormData({
                    role: '',
                    name: '',
                    phone: '',
                    email: '',
                    password: '',
                  })
                }
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
