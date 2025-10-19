# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

# Import custom modules for database interactions
import usersDatabase as usersDB
import projectsDatabase as projectsDB
import hardwareDatabase as hardwareDB
import interface as interface

import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables
load_dotenv()

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

# Create MongoDB client and database instance
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]


# Initialize a new Flask web application
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods including OPTIONS
    allow_headers=["*"],  # Allow all headers
)
# Route for user login
@app.post("/login")
async def login(user: interface.LoginRequest):
    print(user)
    try:
        # Validate required fields
        if not user.username or not user.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    'success': False,
                    'message': 'Username and password are required'
                }
            )

        # Attempt to log in the user
        result = await usersDB.login(db, user.username, user.password)
        
        if result:
            return {
                'success': True,
                'message': 'Login successful',
                'user': {'username': user.username}
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    'success': False,
                    'message': 'Invalid credentials',
                    'user': {'username': user.username}
                }
            )

    except HTTPException:
        raise

# Route for the main page (Work in progress)
@app.get('/main')
def mainPage():
    # Extract data from request

    # Connect to MongoDB

    # Fetch user projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for joining a project
@app.post('/join_project')
def join_project():
    # Extract data from request
    # Expected: username, projectId

    # Connect to MongoDB

    # Attempt to join the project using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for user registration
@app.post('/register')
async def register(user: interface.RegisterRequest):
    print(user)
    try:
        # Validate required fields
        print(user)
        if not user.username or not user.password:
            raise HTTPException(
                status_code=400,
                detail={
                    'success': False,
                    'message': 'Username and password are required'
                }
            )

        # Check if username already exists
        existing = await usersDB.usernameExists(db, user.username)
        if existing:
            print("Here")
            raise HTTPException(
                status_code=400,
                detail={
                    'success': False,
                    'message': 'Username already exists'
                }
            )

        # Attempt to add the user
        result = await usersDB.addUser(db, user.username, user.password, user.email)
        
        if result:
            return {
                'success': True,
                'message': 'User registered successfully'
            }
        else:
            raise HTTPException(
                status_code=500,
                detail={
                    'success': False,
                    'message': 'Failed to register user'
                }
            )
    except HTTPException:
        raise

# Route for adding a new user (legacy - use /register instead)
@app.post('/add_user')
def add_user():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to add the user using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting the list of user projects
@app.post('/get_user_projects_list')
def get_user_projects_list():
    # Extract data from request
    # Expected: username

    # Connect to MongoDB

    # Fetch the user's projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for creating a new project
@app.post('/create_project')
def create_project():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to create the project using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting project information
@app.post('/get_project_info')
def get_project_info():
    # Extract data from request

    # Connect to MongoDB

    # Fetch project information using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting all hardware names
@app.post('/get_all_hw_names')
def get_all_hw_names():
    # Connect to MongoDB

    # Fetch all hardware names using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting hardware information
@app.post('/get_hw_info')
def get_hw_info():
    # Extract data from request

    # Connect to MongoDB

    # Fetch hardware set information using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking out hardware
@app.post('/check_out')
def check_out():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to check out the hardware using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking in hardware
@app.post('/check_in')
def check_in():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to check in the hardware using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for creating a new hardware set
@app.post('/create_hardware_set')
def create_hardware_set():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to create the hardware set using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking the inventory of projects
@app.get('/api/inventory')
def check_inventory():
    # Connect to MongoDB

    # Fetch all projects from the HardwareCheckout.Projects collection

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

@app.get("/")
async def root():
    return {"message": "Welcome to the backend!"}

# Main entry point for the application
if __name__ == '__main__':
    app = FastAPI()

