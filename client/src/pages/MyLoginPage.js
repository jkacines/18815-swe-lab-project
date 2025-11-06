import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const MyLoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // No validation requirements
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setErrors({});
    
    try {
      const response = await axios.post('https://backendserver1-ab6b6912c013.herokuapp.com/user/login', {
        username: formData.username,
        password: formData.password
      });
      
      if (response.data.success) {
        setMessage('Login successful!');
        // Call the onLogin callback if provided
        if (onLogin) {
          onLogin(response.data);
        }
      } else {
        setMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setMessage('Invalid credentials. Please try again.');
      } else if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    // This would be handled by routing in a full app
    window.location.href = '/user/register';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Hardware Checkout System</h1>
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter your username"
              disabled={isLoading}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={handleRegisterRedirect}
              className="link-button"
            >
              Sign up here
            </button>
          </p>
          {/* Commented out for now
          <button 
            type="button" 
            onClick={() => window.location.href = '/forgot-password'}
            className="link-button"
          >
            Forgot your password?
          </button>
          */}
        </div>
      </div>
    </div>
  );
};

export default MyLoginPage;
