// EditUser.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
  const navigator = useNavigate();
  const { userId } = useParams();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  useEffect(() => {
    // Fetch user data based on the user ID when component mounts
    if (userId) {
      // Assuming you have a function to fetch user data by ID
      // Replace this with your actual data fetching logic
      fetchUserData(userId)
        .then((user) => setFormData(user))
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle edit logic using the user ID
    console.log('Editing user with ID:', userId, 'Updated Data:', formData);
    // Redirect to another page after editing
    navigator('/');
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
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

        <div className="mb-3">
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

        <div className="mb-3">
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
          Save Changes
        </button>
      </form>
    </div>
  );
};

// Replace this with your actual data fetching logic
const fetchUserData = (userId) => {
  // Assuming you have a function to fetch user data by ID
  // Replace this with your actual data fetching logic
  return Promise.resolve({
    username: 'SampleUser',
    password: '********',
    email: 'sampleuser@example.com',
  });
};

export default EditUser;
