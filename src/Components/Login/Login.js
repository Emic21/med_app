import React, { useState, useEffect } from 'react';
import './Login.css'; // Import your CSS file for styling
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const Login = () => {
  // State variables for form data and errors
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  // Get navigation function from react-router-dom
  const navigate = useNavigate();

  // Check if the user is already authenticated, then redirect to the home page
  useEffect(() => {
    if (sessionStorage.getItem('auth-token')) {
      navigate('/');
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors when the user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  // Validate form inputs
  const validate = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Send a POST request to the login API endpoint
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        // Parse the response JSON
        const json = await res.json();

        if (json.authtoken) {
          // If authentication token is received, store it in session storage
          sessionStorage.setItem('auth-token', json.authtoken);
          sessionStorage.setItem('email', formData.email);

          // Redirect to the home page and reload the window
          navigate('/');
          window.location.reload();
        } else {
          // Handle errors if authentication fails
          if (json.errors) {
            const errors = json.errors.map((error) => error.msg).join('\n');
            setErrors({ form: errors });
          } else {
            setErrors({ form: json.error || 'Login failed. Please try again.' });
          }
        }
      } catch (err) {
        console.error('Error during login:', err);
        setErrors({ form: 'An error occurred. Please try again later.' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({ email: '', password: '' });
    setErrors({});
  };

  return (
    <div className="container">
      <div className="login-grid">
        <div className="login-text">
          <h2>Login</h2>
        </div>
        <div className="login-text">
          Are you a new member?{' '}
          <span>
            <Link to="/signup" style={{ color: '#2190FF' }}>
              Sign Up Here
            </Link>
          </span>
        </div>
        <br />
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">
                Password <span className="required">*</span>:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
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
                Login
              </button>
              <button
                type="reset"
                className="btn btn-danger mb-2 waves-effect waves-light"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
            <br />
            <div className="login-text">
              <Link to="/forgot-password" style={{ color: '#2190FF' }}>
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;