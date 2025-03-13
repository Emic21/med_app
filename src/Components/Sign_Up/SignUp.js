import React, { useState } from 'react';
import "./Sign_Up.css";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePhone = (phone) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!validatePhone(formData.phone)) {
      formErrors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (Object.keys(formErrors).length === 0) {
      // Proceed with form submission (e.g., send data to the server)
      console.log('Form submitted:', formData);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="container mt-5 items-centre justify-centre justify-contents-centre">
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
            </div>

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
