# Import necessary libraries and modules
import projectsDatabase as projectsDB
from pydantic import BaseModel
from typing import Optional
from passlib.hash import bcrypt
from passlib.context import CryptContext

'''
Structure of User entry:
User = {
    'username': username,        # Unique username (primary identifier)
    'password': password,        # Encrypted password
    'email': email,             # Optional email for recovery
    'projects': [project1_ID, project2_ID, ...]
}
'''
class UserLogin(BaseModel):
    id: Optional[str] = None 
    username: str
    password: str
    email: Optional[str] = None
    projects: Optional[list] = []

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to add a new user (registration)
async def addUser(coll, username, password, email=None):
    # Add a new user to the database
    # Returns success status and message

    # Create user document
    user = UserLogin(
        username=username,
        password=password,
        email=email,
        projects=[]
    )

    try:
        # Check if user already exists
        existing = await usernameExists(coll, user.username)
        if existing:
            return False
        
        # Hash User Password
        hashed_pw = pwd_context.hash(user.password)
        user_model_dump = user.model_dump()
        user_model_dump["password"] = hashed_pw
        await coll.users.insert_one(user_model_dump)
        return True
    
    except Exception as e:
        print(f"Error adding user: {e}")
        return False

# Helper function to query a user by username
async def queryUser(coll, username):
    # Query and return a user from the database
    existing = await coll.users.find_one({"username": username})
    return existing

# Function to log in a user
async def login(coll, username, password, email=None):
    # Authenticate a user and return login status
    # Returns user data if successful

    # Create user document
    user = UserLogin(
        username=username,
        password=password,
        email=email,
        projects=[]
    )

    try:
        # Check database for user
        existing = await queryUser(coll, user.username)
        if not existing or not pwd_context.verify(user.password, existing["password"]):
            return False
        else:
            return True

    except Exception as e:
        print(f"Error during login: {e}")
        return False

# Function to check if username already exists
async def usernameExists(coll, username):
    # Check if username is already taken
    # Returns True if exists, False if available
    try:
        # Check in-memory storage
        existing = await coll.users.find_one({"username": username})
        if existing:
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

