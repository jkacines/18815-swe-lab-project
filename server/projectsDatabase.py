# projectsDatabase.py
from pymongo import MongoClient
import HWDatabase as HWDB

# In-memory project storage (replace with MongoDB for persistence)
_projects_storage = []

'''
Structure of Project entry:
Project = {
    'projectName': str,
    'description': str,
    'hwSets': {                       # per-project reserved hardware pool
        'HWSet1': {'used': 0, 'capacity': 100},  # reserved 100, using 0
        'HWSet2': {'used': 20, 'capacity': 50}
    },
    'users': [ 'jason', 'alice' ]
}
'''


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
        for p in _projects_storage:
            if p['projectName'] == projectName:
                print(f"⚠️ Project '{projectName}' already exists.")
                return False

        hwSets = {}

        for hwName, reserve_amount in hwSets_dict.items():
            hw_info = HWDB.queryHardwareSet(client, hwName)
            if not hw_info:
                print(f"⚠️ Hardware set '{hwName}' not found.")
                continue

            capacity = hw_info.get('capacity', 0)
            availability = hw_info.get('availability', 0)

            # Ensure enough global hardware is available
            if reserve_amount > availability:
                print(f"⚠️ Not enough '{hwName}' available. Requested {reserve_amount}, only {availability} left.")
                reserve_amount = availability

            # Deduct reserved amount from global availability
            new_global_avail = availability - reserve_amount
            HWDB.updateAvailability(client, hwName, new_global_avail)

            # Add reserved pool to project (starts unused)
            hwSets[hwName] = {
                'used': 0,
                'capacity': reserve_amount
            }

        # Build project document
        project_doc = {
            'projectName': projectName,
            'description': description,
            'hwSets': hwSets,
            'users': []
        }

        _projects_storage.append(project_doc)
        print(f"✅ Created project '{projectName}' with hardware: {hwSets}")
        return True

    except Exception as e:
        print(f"❌ Error creating project: {e}")
        return False


# ============================================================
# Get all projects
# ============================================================
def getProjects(client):
    """Return all project entries."""
    try:
        return _projects_storage
    except Exception as e:
        print(f"❌ Error getting projects: {e}")
        return []


# ============================================================
# Add user to project
# ============================================================
def addProjectUser(client, projectName, username):
    """Add a user to an existing project."""
    try:
        for p in _projects_storage:
            if p['projectName'] == projectName:
                if username not in p['users']:
                    p['users'].append(username)
                    print(f"✅ Added user '{username}' to project '{projectName}'")
                    return True
                else:
                    print(f"⚠️ User '{username}' already in project '{projectName}'")
                    return False
        print(f"⚠️ Project '{projectName}' not found.")
        return False
    except Exception as e:
        print(f"❌ Error adding user to project: {e}")
        return False


# ============================================================
# Check out hardware within a project
# ============================================================
# Return signature: (success: bool, processed_qty: int, error_msg: str | None)

def checkOutHW(client, projectName, hwName, qty, username=None):
    try:
        for p in _projects_storage:
            if p['projectName'] == projectName:
                if username not in p['users']:
                    return (False, 0, f"User '{username}' is not part of project '{projectName}'")
                if hwName not in p['hwSets']:
                    return (False, 0, f"'{hwName}' not found in project '{projectName}'")

                hw_entry = p['hwSets'][hwName]
                available = hw_entry['capacity'] - hw_entry['used']
                if qty > available:
                    return (False, 0, f"Not enough '{hwName}' available. Requested {qty}, only {available} left.")

                hw_entry['used'] += qty
                hw_entry.setdefault('user_usage', {})
                hw_entry['user_usage'][username] = hw_entry['user_usage'].get(username, 0) + qty
                return (True, qty, None)

        return (False, 0, f"Project '{projectName}' not found.")
    except Exception as e:
        return (False, 0, f"Error checking out HW: {e}")

# ============================================================
# Check in hardware within a project
# ============================================================
def checkInHW(client, projectName, hwName, qty, username=None):
    try:
        for p in _projects_storage:
            if p['projectName'] == projectName:
                if username not in p['users']:
                    return (False, 0, f"User '{username}' is not part of project '{projectName}'")
                if hwName not in p['hwSets']:
                    return (False, 0, f"'{hwName}' not found in project '{projectName}'")

                hw_entry = p['hwSets'][hwName]
                hw_entry.setdefault('user_usage', {})
                user_checked_out = hw_entry['user_usage'].get(username, 0)

                if user_checked_out <= 0:
                    return (False, 0, f"User '{username}' has no '{hwName}' checked out.")

                # Cap to what the user actually has
                processed = min(qty, user_checked_out)

                hw_entry['used'] -= processed
                hw_entry['user_usage'][username] = user_checked_out - processed
                if hw_entry['user_usage'][username] <= 0:
                    del hw_entry['user_usage'][username]

                return (True, processed, None)

        return (False, 0, f"Project '{projectName}' not found.")
    except Exception as e:
        return (False, 0, f"Error checking in HW: {e}")
