# projectsDatabase.py
from pymongo import MongoClient
import HWDatabase as HWDB
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
# In-memory project storage (replace with MongoDB for persistence)
_projects_storage = []

'''
Structure of Project entry:
Project = {
    'projectName': str,
    'description': str,
    'hwSets': {                       # per-project reserved hardware pool
        'HWSet1': {'used': 0, 'capacity': 100},  # reserved 100, using 0
        'HWSet2': {'used': 20, 'capacity': 50, 'user_usage': {'user1':'20'}}
    },
    'users': [ 'jason', 'alice' ]
}
'''
class ProjectData(BaseModel):
    id: Optional[str] = None 
    projectName: str
    description: str
    hwSets: Dict[str, Any] = {}
    users: List[str] = []

# ============================================================
# Create a new project
# ============================================================
def createProject(client, projectName, description, hwSets_dict):
    """
    Create a new project and allocate hardware from the global HW pool.
    hwSets_dict: { 'HWSet1': 100, 'HWSet2': 50 } → reserve from global pool
    """
    try:
        # Prevent duplicate project names
        existing = client['Projects'].project.find_one({"projectName": projectName})
        if existing:
            return (False, f"Project '{projectName}' already exists.")

        # 1) Validate all requested hw sets exist and have sufficient availability
        hwSets = {}
        validation_errors = []
        for hwName, reserve_amount in hwSets_dict.items():
            hw_info = HWDB.queryHardwareSet(client, hwName)
            if not hw_info:
                validation_errors.append(f"Hardware set '{hwName}' not found.")
                continue

            availability = hw_info.get('availability', 0)
            if reserve_amount > availability:
                validation_errors.append(
                    f"Not enough '{hwName}' available. Requested {reserve_amount}, only {availability} left."
                )

        # If any validation failed, abort creation and do not modify global HW state
        if validation_errors:
            for msg in validation_errors:
                print(f"⚠️ {msg}")
            print(f"Project creation for '{projectName}' aborted due to insufficient hardware or missing sets.")
            return (False, '; '.join(validation_errors))

        # 2) All validations passed — reserve hardware from the global pool and build project hwSets
        for hwName, reserve_amount in hwSets_dict.items():
            hw_info = HWDB.queryHardwareSet(client, hwName)
            capacity = hw_info.get('capacity', 0)
            availability = hw_info.get('availability', 0)

            # Deduct reserved amount from global availability
            new_global_avail = availability - reserve_amount
            HWDB.updateAvailability(client, hwName, new_global_avail)

            # Add reserved pool to project (starts unused)
            hwSets[hwName] = {
                'used': 0,
                'capacity': reserve_amount
            }

        # Build project document
        project_doc = ProjectData(
            projectName=projectName,
            description=description,
            hwSets=hwSets,
            users=[]
        )

        proj_model_dump = project_doc.model_dump()
        client['Projects'].project.insert_one(proj_model_dump)
        print(f"Created project '{projectName}' with hardware: {hwSets}")
        return (True, None)

    except Exception as e:
        print(f"Error creating project: {e}")
        return (False, f"Error creating project: {e}")


# ============================================================
# Get all projects
# ============================================================
def getProjects(client):
    """Return all project entries."""
    try:
        project_sets = list(client['Projects'].project.find({}))

        _projects_storage =[]

        for projSet in project_sets:
            _projects_storage.append({
                'projectName': projSet['projectName'],
                'description': projSet['description'],
                'hwSets': projSet['hwSets'],
                'users': projSet['users']
            })
        return _projects_storage
    except Exception as e:
        print(f"Error getting projects: {e}")
        return []


# ============================================================
# Add user to project
# ============================================================
def addProjectUser(client, projectName, username):
    """Add a user to an existing project."""
    try:
        existing = client['Projects'].project.find_one({"projectName": projectName})
        if existing:
            users = existing['users']
            if username not in users:
                users.append(username)
                client['Projects'].project.update_one(
                    {'projectName': projectName},
                    {'$set': {'users': users}}
                )
                print(f"Added user '{username}' to project '{projectName}'")
                return True
            else:
                print(f"User '{username}' already in project '{projectName}'")
                return False
        print(f"Project '{projectName}' not found.")
        return False
    except Exception as e:
        print(f"Error adding user to project: {e}")
        return False


# ============================================================
# Check out hardware within a project
# ============================================================
# Return signature: (success: bool, processed_qty: int, error_msg: str | None)

def checkOutHW(client, projectName, hwName, qty, username=None):
    try:
        existing = client['Projects'].project.find_one({"projectName": projectName})
        if existing:
            users = existing['users']
            if username not in users:
                return (False, 0, f"User '{username}' is not part of project '{projectName}'")
            if hwName not in existing['hwSets']:
                return (False, 0, f"'{hwName}' not found in project '{projectName}'")
            hw_entry = existing['hwSets'][hwName]
            available = hw_entry['capacity'] - hw_entry['used'] 
            if qty > available:
                return (False, 0, f"Not enough '{hwName}' available. Requested {qty}, only {available} left.")
            hw_entry.setdefault('user_usage', {})

            client['Projects'].project.update_one(
                {"projectName": projectName},
                {
                    '$set': {
                        f'hwSets.{hwName}.used': hw_entry['used'] + qty,
                        f'hwSets.{hwName}.user_usage.{username}': hw_entry['user_usage'].get(username, 0) + qty
                    }
                }
            )
            return (True, qty, None)

        return (False, 0, f"Project '{projectName}' not found.")
    except Exception as e:
        return (False, 0, f"Error checking out HW: {e}")

# ============================================================
# Check in hardware within a project
# ============================================================
def checkInHW(client, projectName, hwName, qty, username=None):
    try:
        existing = client['Projects'].project.find_one({"projectName": projectName})
        if existing:
            if username not in existing['users']:
                return (False, 0, f"User '{username}' is not part of project '{projectName}'")
            if hwName not in existing['hwSets']:
                return (False, 0, f"'{hwName}' not found in project '{projectName}'")
            hw_entry = existing['hwSets'][hwName]
            hw_entry.setdefault('user_usage', {})
            user_checked_out = hw_entry['user_usage'].get(username, 0)
            if user_checked_out <= 0:
                return (False, 0, f"User '{username}' has no '{hwName}' checked out.")
            # Cap to what the user actually has
            processed = min(qty, user_checked_out)
            
            if hw_entry['user_usage'][username] <= 0:
                client['Projects'].project.update_one(
                    {"projectName": projectName},
                    {
                        '$unset': {
                            f'hwSets.{hwName}.user_usage.{username}': ""
                        }
                    }
                )
                del hw_entry['user_usage'][username]
            else:
                client['Projects'].project.update_one(
                    {"projectName": projectName},
                    {
                        '$set': {
                            f'hwSets.{hwName}.used': hw_entry['used'] - processed,
                            f'hwSets.{hwName}.user_usage.{username}': user_checked_out - processed
                        }
                    }
                )
            return (True, processed, None)
        
        return (False, 0, f"Project '{projectName}' not found.")
    except Exception as e:
        return (False, 0, f"Error checking in HW: {e}")
