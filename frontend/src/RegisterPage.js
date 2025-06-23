import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './RegisterPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signUpUser = (e) => {
    e.preventDefault(); // prevent page reload

    if (!email) {
      alert("Email has been left blank!");
    } else if (!password) {
      alert("Password has been left blank!");
    } else {
      axios.post('http://127.0.0.1:5000/signup', {
        firstName,
        lastName,
        email,
        password
      })
        .then((response) => {
          console.log(response);
          navigate("/login");
        })
        .catch((error) => {
          console.log(error, 'error');
          if (error.response?.status === 409) {
            alert("Email already exists");
          } else {
            alert("Signup failed. Please try again.");
          }
        });
    }
  };

  return (
    <div className="register-container" id="signup" style={{ display: "block" }}>
      <h1 className="register-form-title">Register</h1>
      <form onSubmit={signUpUser}>
        <div className="input-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            id="FirstName"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label htmlFor="FirstName">First Name</label>
        </div>
        <div className="input-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            id="LastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label htmlFor="LastName">Last Name</label>
        </div>
        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            id="SignupEmail"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="SignupEmail">Email</label>
        </div>
        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            id="SignupPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="SignupPassword">Password</label>
        </div>
        <button type="submit" className="btn">Sign Up</button>
      </form>

      <div className="links">
        <p>Already have an account?</p>
        <button id="signInButton" onClick={() => navigate("/login")}>Sign In</button>
      </div>
    </div>
  );
}