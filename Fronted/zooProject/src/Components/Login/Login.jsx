import React, { useState } from 'react';
import { authService } from '../../Api/authService'; 
import '../../Scss/LoginModal.scss';
import StatusDisplay from '.././ErrorDisplay/StatusDisplay'; 

const Login = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(formData);
      
      const token = response.token || response.data?.token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      // Using the error message from the backend if available, otherwise fallback
      const errorMessage = err.response?.data?.message || "Invalid username or password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-layout">
      <form onSubmit={handleSubmit} className="futuristic-login-form">
        <div className="form-header">
          <span className="security-icon">🔐</span>
          <h2>Admin Authentication</h2>
          <p className="form-subtitle">Provide secure credentials to enter map override mode</p>
        </div>

        {/* Replaced manual error div with StatusDisplay */}
        {error && (
          <div style={{ marginBottom: '20px' }}>
            <StatusDisplay 
              type="error" 
              message={error} 
            />
          </div>
        )}
        
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text"
            name="username" 
            placeholder="Enter username"
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••"
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit" className="btn-form-submit" disabled={loading}>
          {loading ? (
            <div className="button-loader-flex">
              <span className="button-spinner"></span>
              <span>Authenticating...</span>
            </div>
          ) : (
            'Access Control Panel'
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;