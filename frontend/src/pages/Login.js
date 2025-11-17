import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Ensure API base includes /api prefix and avoid double /api
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        // Store login state
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminUsername', response.data.user.username);
        
        // Redirect to admin dashboard
        navigate('/admin');
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Terlalu banyak percobaan login. Silakan coba lagi nanti.');
      } else if (err.response?.status === 401) {
        setError('Username atau password salah');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/images/lampung-selatan-logo.png" alt="Logo" className="login-logo" />
          <h1>Admin Login</h1>
          <p>Sistem Kesehatan Tarahan</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Lampung Selatan - Sistem Kesehatan</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
