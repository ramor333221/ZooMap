import React, { useState } from 'react';
import { useLoginMutation } from '../../Api/authApi';
import '../../Scss/LoginModal.scss';
import StatusDisplay from '.././ErrorDisplay/StatusDisplay';

const Login = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [login, { isLoading, error: apiError }] = useLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData).unwrap();

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      // error handled via apiError from RTK Query
    }
  };

  const displayError =
    apiError ? (apiError.data?.message || "Invalid username or password") : null;

  return (
    <div className="login-container-layout">
      <form onSubmit={handleSubmit} className="futuristic-login-form">

        <div className="form-header">
          <span className="security-icon">🔐</span>
          <h2>Admin Authentication</h2>
          <p className="form-subtitle">
            Provide secure credentials to enter map override mode
          </p>
        </div>

        {displayError && (
          <div style={{ marginBottom: '20px' }}>
            <StatusDisplay
              type="error"
              message={displayError}
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

        <button
          type="submit"
          className="btn-form-submit"
          disabled={isLoading}
        >
          {isLoading ? (
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