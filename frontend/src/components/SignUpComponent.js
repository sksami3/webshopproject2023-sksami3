// SignUp.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SignUp = () => {
  const navigator = useNavigate();
  const { userId } = useParams();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId) {
      // Handle edit logic using the user ID
      console.log('Editing user with ID:', userId);
    } else {
      // Handle sign up logic
      console.log('Signing up:', formData);
    }
    // Redirect to another page after sign up or edit
    navigator('/');
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3 col-md-5">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 col-md-5">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 col-md-5">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {userId ? 'Save Changes' : 'Sign Up'}
        </button>
        <br />
      </form>
    </div>
  );
};

export default SignUp;
