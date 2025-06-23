import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email) {
      alert('Email has been left blank!');
      return;
    }
    if (!password) {
      alert('Password has been left blank!');
      return;
    }

    axios.post('http://127.0.0.1:5000/login', {
      email,
      password
    })
      .then((response) => {
        console.log(response);
        alert('Login successful!');
        navigate('/Home');
      })
      .catch((error) => {
        console.log(error, 'error');
        if (error.response?.status === 401) {
          alert('Invalid credentials');
        } else {
          alert('Login failed. Please try again.');
        }
      });
  };

  return (
    <div className="container" id="login" style={{ display: 'block' }}>
      <h1 className="form-title">Login</h1>
      <div className="input-group">
        <i className="fas fa-envelope"></i>
        <input
          type="email"
          id="LoginEmail"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="LoginEmail">Email</label>
      </div>
      <div className="input-group">
        <i className="fas fa-lock"></i>
        <input
          type="password"
          id="LoginPassword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="LoginPassword">Password</label>
      </div>
      <button className="btn" onClick={handleLogin}>
        Login
      </button>
      <div className="links">
        <p>Don't have an account?</p>
        <button id="signUpButton" onClick={() => navigate('/register')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginPage;