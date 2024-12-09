import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/signin.css';

function Signin({ toggleForm }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/items1', { name, password });
      const userData = response.data.item;

      // Save user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      setMessage('User found! Redirecting...');
      // Navigate to the appropriate page based on role
      const userRole = userData.role;
      if (userRole === 'Retailer') navigate('/retailer', { state: { name } });
      else if (userRole === 'Distributor') navigate('/distributor', { state: { name } });
      else if (userRole === 'Manufacturer') navigate('/manufacturer', { state: { name } });
      else if (userRole === 'Consumer') navigate('/consumer', { state: { name } });
      else navigate('/home');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('User not found.');
      } else {
        setMessage('Failed to check user.');
      }
    }
  };

  return (
    <div className='dog'>
    <div className="container">
      <h2>Sign In</h2>
      <form onSubmit={formSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
          <label>Username</label>
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <label>Password</label>
        </div>
        <button id="btn" type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Don’t have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
    </div>
  );
}

export default Signin;