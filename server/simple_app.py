"""
Simple Hardware Checkout System Backend
Uses in-memory dictionary storage for rapid prototyping
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend communication

# Simple in-memory storage (data lost when server restarts)
users_db = {
    # Pre-populated test users for immediate testing
    "admin": {
        "password": "password123",
        "email": "admin@hardware.edu",
        "projects": ["admin_project"],
        "created_at": "2024-01-15T10:30:00Z"
    },
    "testuser": {
        "password": "test123",
        "email": "test@example.com", 
        "projects": [],
        "created_at": "2024-01-20T14:22:00Z"
    }
}

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Simple Hardware Checkout System API is running',
        'total_users': len(users_db),
        'available_test_users': list(users_db.keys())
    }), 200

# User registration endpoint
@app.route('/register', methods=['POST'])
def register():
    try:
        # Extract data from request
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        email = data.get('email', '').strip()
        
        # Validate required fields
        if not username:
            return jsonify({'success': False, 'message': 'Username is required'}), 400
        if not password:
            return jsonify({'success': False, 'message': 'Password is required'}), 400
        
        # Check if username already exists
        if username in users_db:
            return jsonify({'success': False, 'message': 'Username already exists'}), 409
        
        # Create new user
        users_db[username] = {
            'password': password,  # Plain text for simplicity (NOT for production!)
            'email': email or None,
            'projects': [],
            'created_at': datetime.utcnow().isoformat() + 'Z'
        }
        
        return jsonify({
            'success': True, 
            'message': 'Registration successful! You can now log in.',
            'user': {
                'username': username,
                'email': email or None
            }
        }), 201
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'success': False, 'message': 'Registration failed'}), 500

# User login endpoint  
@app.route('/login', methods=['POST'])
def login():
    try:
        # Extract data from request
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # Validate input
        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password are required'}), 400
        
        # Check if user exists
        if username not in users_db:
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
        
        user = users_db[username]
        
        # Verify password (plain text comparison)
        if user['password'] != password:
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
        
        # Return user data (excluding password)
        user_data = {
            'username': username,
            'email': user.get('email'),
            'projects': user.get('projects', []),
            'created_at': user.get('created_at'),
            'last_login': datetime.utcnow().isoformat() + 'Z'
        }
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user_data
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'success': False, 'message': 'Authentication failed'}), 500

# Debug endpoint to see all users (for testing)
@app.route('/debug/users', methods=['GET'])
def debug_users():
    # Return usernames only (hide passwords even in debug)
    user_list = []
    for username, user_data in users_db.items():
        user_list.append({
            'username': username,
            'email': user_data.get('email', 'No email'),
            'projects': user_data.get('projects', []),
            'created_at': user_data.get('created_at', 'Unknown')
        })
    
    return jsonify({
        'total_users': len(users_db),
        'users': user_list
    }), 200

# Endpoint to reset/clear all users (for testing)
@app.route('/debug/reset', methods=['POST'])
def reset_users():
    global users_db
    users_db = {}
    return jsonify({
        'success': True,
        'message': 'All users cleared',
        'total_users': len(users_db)
    }), 200

if __name__ == '__main__':
    print("🚀 Simple Hardware Checkout System - Backend")
    print("📍 Server running on: http://localhost:8000")  
    print("💾 Using in-memory dictionary storage")
    print("👥 Pre-loaded test users:")
    for username, user_data in users_db.items():
        print(f"   - {username} (password: {user_data['password']})")
    print("🔧 Debug endpoints:")
    print("   - GET /health - Server status")
    print("   - GET /debug/users - View all users")
    print("   - POST /debug/reset - Clear all users")
    print()
    
    app.run(host='0.0.0.0', port=8000, debug=True)
