import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Reuse the same CSS as login page

const MyRegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
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
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, dots, hyphens, and underscores';
    }
    
    // Email validation (optional field)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
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
      const response = await axios.post('http://localhost:8000/register', {
        username: formData.username,
        password: formData.password,
        email: formData.email || undefined // Only send email if provided
      });
      
      if (response.data.success) {
        setMessage('Registration successful! You can now log in with your credentials.');
        // Clear form after successful registration
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          email: ''
        });
      } else {
        setMessage(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Registration failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <div className="login-container"> {/* Reuse login container styles */}
      <div className="login-card">
        <div className="login-header">
          <h1>Hardware Checkout System</h1>
          <h2>Create Account</h2>
          <p>Join the hardware checkout system</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Choose a unique username"
              disabled={isLoading}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email (optional)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="your.email@example.com"
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
            <small style={{ 
              color: '#888', 
              fontSize: '12px', 
              marginTop: '4px', 
              display: 'block',
              fontStyle: 'italic' 
            }}>
              Email can be used for password recovery
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Create a strong password"
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <small style={{ 
              color: '#888', 
              fontSize: '12px', 
              marginTop: '4px', 
              display: 'block',
              fontStyle: 'italic' 
            }}>
              Must be 6+ characters with uppercase, lowercase, and number
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={handleLoginRedirect}
              className="link-button"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyRegistrationPage;