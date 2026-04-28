import React, { useState } from 'react';
import { authService } from '../Api/authService'; 

const LoginComponent = () => {
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
      const data = await authService.login(formData);
      console.log('Success:', data);
      alert('Welcome back!');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div style={styles.inputGroup}>
          <label>Username</label>
          <input 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Processing...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f7f6', // Light gray background for the whole page
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    form: {
      padding: '2.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
      width: '100%',
      maxWidth: '350px',
    },
    title: {
      margin: '0 0 1.5rem 0',
      textAlign: 'center',
      color: '#333',
      fontSize: '1.5rem',
      fontWeight: '600',
    },
    inputGroup: {
      marginBottom: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.875rem',
      color: '#666',
      fontWeight: '500',
    },
    input: {
      padding: '0.75rem',
      fontSize: '1rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    // Note: For hover/focus effects in JS-in-CSS, you'd usually use 
    // a library or handle it via component state.
    button: {
      width: '100%',
      padding: '0.8rem',
      marginTop: '1rem',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
    },
    errorText: {
      color: '#d9534f',
      fontSize: '0.85rem',
      textAlign: 'center',
      marginBottom: '1rem',
      backgroundColor: '#fdf7f7',
      padding: '0.5rem',
      borderRadius: '4px',
      border: '1px solid #d9534f',
    }
  };
  
export default LoginComponent;