import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MyLoginPage from './pages/MyLoginPage';
import MyRegistrationPage from './pages/MyRegistrationPage';
import MyUserPortal from './pages/MyUserPortal';
import ForgotMyPassword from './pages/ForgotMyPassword';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    console.log('User logged out');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/user/login" 
            element={
              !isAuthenticated ? (
                <MyLoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/user/register" 
            element={
              !isAuthenticated ? (
                <MyRegistrationPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              !isAuthenticated ? (
                <ForgotMyPassword />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <MyUserPortal response={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/user/login" replace />
              )
            } 
          />
          
          {/* Default route */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/user/login"} replace />} 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/user/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
