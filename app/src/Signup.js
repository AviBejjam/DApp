import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/signin.css';

function Signup({ toggleForm }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/items', { name, password, role: selectedOption });
      setMessage('User registered successfully! Redirecting...');
      // Redirect to the SignIn page after successful registration
      navigate('/signin');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage('User already exists');
      } else {
        setMessage('Failed to register user.');
      }
    }
  };

  return (
    <div className="dog">
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={formSubmit}>
        <div className="form-group">
          <input 
            type="text" 
            required 
            value={name}
            onChange={handleNameChange} 
          />
          <label>Username</label>
        </div>

        <div className="form-group">
          <input 
            type="password" 
            required 
            value={password}
            onChange={handlePasswordChange} 
          />
          <label>Password</label>
        </div>

        <div className="form-group">
          <input 
            type="password" 
            required 
            value={confirmPassword}
            onChange={handleConfirmPasswordChange} 
          />
          <label>Confirm Password</label>
        </div>

        <div className="form-group">
          <select
            value={selectedOption}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Retailer">Retailer</option>
            <option value="Distributor">Distributor</option>
            <option value="Manufacturer">Manufacturer</option>
            <option value="Consumer">Consumer</option>
          </select>
          <label>Role</label>
        </div>

        <button id="btn" type="submit">Sign Up</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Already have an account? <a href="/signin">Sign In</a>
      </p>
    </div>
    </div>
  );
}

export default Signup;