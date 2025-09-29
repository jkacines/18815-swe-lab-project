import React from 'react';

const MyUserPortal = ({ user, onLogout }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '1rem'
      }}>
        <h1>User Dashboard</h1>
        <button 
          onClick={onLogout}
          style={{ 
            padding: '0.5rem 1rem', 
            background: '#e53e3e', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <div>
        <h2>Welcome to the Hardware Checkout System!</h2>
        <p>Dashboard functionality coming soon...</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Features to be implemented:</h3>
          <ul>
            <li>View available hardware resources</li>
            <li>Request hardware checkout</li>
            <li>Manage your projects</li>
            <li>View checkout history</li>
          </ul>
        </div>
        
        {user && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#f7fafc', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4>User Information:</h4>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUserPortal;
