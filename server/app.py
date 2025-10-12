# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

# Import custom modules for database interactions
import usersDatabase as usersDB
import projectsDatabase as projectsDB
import HWDatabase as hardwareDB

# Define the MongoDB connection string
MONGODB_SERVER = "mongodb://localhost:27017/"

# Initialize a new Flask web application
app = Flask(__name__)
CORS(app)

# Route for the main page (Work in progress)
@app.route('/main')
def mainPage():
    # Extract data from request

    # Connect to MongoDB

    # Fetch user projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for joining a project
@app.route('/join_project', methods=['POST'])
def join_project():
    # Extract data from request
    # Expected: username, projectId

    # Connect to MongoDB

    # Attempt to join the project using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

############################################################
# USER MANAGEMENT
############################################################

# Route for user login
@app.route('/user/login', methods=['POST'])
def login():
    try:
        # Extract data from request
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Validate required fields
        if not username or not password:
            return jsonify({
                'success': False,
                'message': 'Username and password are required'
            }), 400

        # Connect to MongoDB
        client = MongoClient(MONGODB_SERVER)

        # Attempt to log in the user
        result = usersDB.login(client, username, password)
        
        if result:
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': {'username': username}
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid credentials'
            }), 401

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Login error: {str(e)}'
        }), 500

# Route for user registration
@app.route('/user/register', methods=['POST'])
def register():
    try:
        # Extract data from request
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        birthday = data.get('birthday')

        # Validate required fields
        if not username or not password:
            return jsonify({
                'success': False,
                'message': 'Username and password are required'
            }), 400

        # Connect to MongoDB
        client = MongoClient(MONGODB_SERVER)

        # Check if username already exists
        if usersDB.usernameExists(client, username):
            return jsonify({
                'success': False,
                'message': 'Username already exists'
            }), 400

        # Attempt to add the user
        result = usersDB.addUser(client, username, password, email)
        
        if result:
            return jsonify({
                'success': True,
                'message': 'User registered successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to register user'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Registration error: {str(e)}'
        }), 500

# Route for getting the list of user projects
@app.route('/get_user_projects_list', methods=['POST'])
def get_user_projects_list():
    # Extract data from request
    # Expected: username

    # Connect to MongoDB

    # Fetch the user's projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting project information
@app.route('/get_project_info', methods=['POST'])
def get_project_info():
    # Extract data from request

    # Connect to MongoDB

    # Fetch project information using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking the inventory of projects
@app.route('/api/inventory', methods=['GET'])
def check_inventory():
    # Connect to MongoDB

    # Fetch all projects from the HardwareCheckout.Projects collection

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

############################################################
# PROJECT MANAGEMENT
############################################################

# Route: Create a new project
@app.route('/projects/create', methods=['POST'])
def create_project():
    try:
        data = request.get_json()
        projectName = data.get('projectName')
        description = data.get('description')
        hwSets = data.get('hwSets', {})  # Expected: { "HWSet1": 10, "HWSet2": 5 }

        if not projectName:
            return jsonify({
                'success': False,
                'message': 'Project name is required.'
            }), 400

        client = MongoClient(MONGODB_SERVER)
        success = projectsDB.createProject(client, projectName, description, hwSets)

        if success:
            return jsonify({
                'success': True,
                'message': f'Project "{projectName}" created successfully.'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': f'Failed to create project "{projectName}". It may already exist or hardware allocation failed.'
            }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error creating project: {str(e)}'
        }), 500


# Route: Get all projects
@app.route('/projects', methods=['GET'])
def get_projects():
    try:
        client = MongoClient(MONGODB_SERVER)
        projects = projectsDB.getProjects(client)
        return jsonify({
            'success': True,
            'projects': projects
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving projects: {str(e)}'
        }), 500


# Route: Add a user to a project
@app.route('/projects/addUser', methods=['POST'])
def add_project_user():
    try:
        data = request.get_json()
        projectName = data.get('projectName')
        username = data.get('username')

        if not projectName or not username:
            return jsonify({
                'success': False,
                'message': 'Project name and username are required.'
            }), 400

        client = MongoClient(MONGODB_SERVER)
        success = projectsDB.addProjectUser(client, projectName, username)

        if success:
            return jsonify({
                'success': True,
                'message': f'User "{username}" added to project "{projectName}".'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': f'Failed to add user "{username}" to project "{projectName}".'
            }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error adding user to project: {str(e)}'
        }), 500

# ============================================================
# Route: Check out hardware within a project
# ============================================================
@app.route('/projects/checkout', methods=['POST'])
def checkout_project_hw():
    try:
        data = request.get_json()
        projectName = data.get('projectName')
        hwName = data.get('hwName')
        qty = data.get('qty')

        if not projectName or not hwName or qty is None:
            return jsonify({
                'success': False,
                'message': 'Project name, hardware name, and quantity are required.'
            }), 400

        client = MongoClient(MONGODB_SERVER)
        success = projectsDB.checkOutHW(client, projectName, hwName, qty)

        if success:
            return jsonify({
                'success': True,
                'message': f'Checked out {qty} of "{hwName}" from project "{projectName}".'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': f'Failed to check out hardware "{hwName}" from project "{projectName}".'
            }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error during hardware checkout: {str(e)}'
        }), 500


# ============================================================
# Route: Check in hardware within a project
# ============================================================
@app.route('/projects/checkin', methods=['POST'])
def checkin_project_hw():
    try:
        data = request.get_json()
        projectName = data.get('projectName')
        hwName = data.get('hwName')
        qty = data.get('qty')

        if not projectName or not hwName or qty is None:
            return jsonify({
                'success': False,
                'message': 'Project name, hardware name, and quantity are required.'
            }), 400

        client = MongoClient(MONGODB_SERVER)
        success = projectsDB.checkInHW(client, projectName, hwName, qty)

        if success:
            return jsonify({
                'success': True,
                'message': f'Checked in {qty} of "{hwName}" to project "{projectName}".'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': f'Failed to check in hardware "{hwName}" to project "{projectName}".'
            }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error during hardware check-in: {str(e)}'
        }), 500


############################################################
# HARDWARE MANAGEMENT
############################################################

# Route: Create a new hardware set
@app.route('/hardware/create', methods=['POST'])
def create_hardware():
    try:
        data = request.get_json()
        hwName = data.get('hwName')
        capacity = data.get('capacity')

        if not hwName or capacity is None:
            return jsonify({
                'success': False,
                'message': 'Hardware name and capacity are required.'
            }), 400

        client = MongoClient(MONGODB_SERVER)

        success = hardwareDB.createHardwareSet(client, hwName, int(capacity))
        if success:
            return jsonify({
                'success': True,
                'message': f'Hardware set "{hwName}" created successfully.'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': f'Hardware set "{hwName}" already exists.'
            }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error creating hardware set: {str(e)}'
        }), 500

# Route: Get all hardware sets info
@app.route('/hardware', methods=['GET'])
def get_hardware():
    try:
        client = MongoClient(MONGODB_SERVER)
        hw_list = hardwareDB.getAllHwSets(client)
        return jsonify({
            'success': True,
            'hardware': hw_list
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving hardware: {str(e)}'
        }), 500


# Main entry point for the application
if __name__ == '__main__':
    app.run(port=8001)

