# Import necessary libraries and modules
from pymongo import MongoClient

import projectsDB

'''
Structure of User entry:
User = {
    'username': username,        # Unique username (primary identifier)
    'password': password,        # Encrypted password
    'email': email,             # Optional email for recovery
    'projects': [project1_ID, project2_ID, ...]
}
'''

# Function to add a new user (registration)
def addUser(client, username, password, email=None):
    # Add a new user to the database
    # Returns success status and message
    pass

# Helper function to query a user by username
def __queryUser(client, username):
    # Query and return a user from the database
    pass

# Function to log in a user
def login(client, username, password):
    # Authenticate a user and return login status
    # Returns user data if successful
    pass

# Function to check if username already exists
def usernameExists(client, username):
    # Check if username is already taken
    # Returns True if exists, False if available
    pass

# Function to add a user to a project
def joinProject(client, username, projectId):
    # Add a user to a specified project
    pass

# Function to get the list of projects for a user
def getUserProjectsList(client, username):
    # Get and return the list of projects a user is part of
    pass

