// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AppTheme.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/login', { email, password });
      if (response.data.message === "Login successful") {
        const { user_id, role } = response.data;
        localStorage.setItem('userId', user_id);
        localStorage.setItem('role', role);

        // Redirect based on user role
        if (role === 'trainer') {
          window.location.href = '/trainerDashboard';
        } else {
          window.location.href = '/userDashboard';
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-container">
      <h1 className="title">PrTracker</h1>
      <p className="subtitle">Track Your Progress Effectively!</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default Login;
