# Import necessary libraries and modules
from pymongo import MongoClient

import projectsDatabase as projectsDB

'''
Structure of User entry:
User = {
    'username': username,        # Unique username (primary identifier)
    'password': password,        # Encrypted password
    'email': email,             # Optional email for recovery
    'projects': [project1_ID, project2_ID, ...]
}
'''

# In-memory storage for development (replace with MongoDB in production)
_users_storage = []

# Function to add a new user (registration)
def addUser(client, username, password, email=None):
    # Add a new user to the database
    # Returns success status and message
    try:
        # Check if user already exists
        for user in _users_storage:
            if user['username'] == username:
                return False
        
        # Create user document
        user_doc = {
            'username': username,
            'password': password,  # In production, this should be hashed
            'email': email,
            'projects': []
        }
        
        # Add user to in-memory storage
        _users_storage.append(user_doc)
        print(f"User added: {username}")
        return True
    except Exception as e:
        print(f"Error adding user: {e}")
        return False

# Helper function to query a user by username
def __queryUser(client, username):
    # Query and return a user from the database
    pass

# Function to log in a user
def login(client, username, password):
    # Authenticate a user and return login status
    # Returns user data if successful
    try:
        # Check in-memory storage for user
        for user in _users_storage:
            if user['username'] == username and user['password'] == password:
                return user
        return None
    except Exception as e:
        print(f"Error during login: {e}")
        return None

# Function to check if username already exists
def usernameExists(client, username):
    # Check if username is already taken
    # Returns True if exists, False if available
    try:
        # Check in-memory storage
        for user in _users_storage:
            if user['username'] == username:
                return True
        return False
    except Exception as e:
        print(f"Error checking username: {e}")
        return False

# Function to add a user to a project
def joinProject(client, username, projectId):
    # Add a user to a specified project
    pass

# Function to get the list of projects for a user
def getUserProjectsList(client, username):
    # Get and return the list of projects a user is part of
    pass

