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
def checkOutHW(client, projectName, hwName, qty, username=None):
    """
    Check out hardware from a project's reserved pool for a specific user.
    Only affects the project's 'used' count and per-user tracking.
    """
    try:
        for p in _projects_storage:
            if p['projectName'] == projectName:
                # Ensure user is in the project
                if username not in p['users']:
                    print(f"⚠️ User '{username}' is not part of project '{projectName}'")
                    return False

                if hwName not in p['hwSets']:
                    print(f"⚠️ '{hwName}' not found in project '{projectName}'")
                    return False

                hw_entry = p['hwSets'][hwName]
                available = hw_entry['capacity'] - hw_entry['used']

                if qty > available:
                    print(f"⚠️ Not enough '{hwName}' available. Requested {qty}, only {available} left.")
                    return False

                # Update totals
                hw_entry['used'] += qty
                hw_entry.setdefault('user_usage', {})
                hw_entry['user_usage'][username] = hw_entry['user_usage'].get(username, 0) + qty

                print(f"✅ User '{username}' checked out {qty} of '{hwName}' from project '{projectName}'")
                return True

        print(f"⚠️ Project '{projectName}' not found.")
        return False
    except Exception as e:
        print(f"❌ Error checking out HW: {e}")
        return False



# ============================================================
# Check in hardware within a project
# ============================================================
def checkInHW(client, projectName, hwName, qty, username=None):
    """
    Check in hardware to a project's reserved pool for a specific user.
    Ensures the user actually has that much checked out.
    """
    try:
        for p in _projects_storage:
            if p['projectName'] == projectName:
                # Ensure user is in the project
                if username not in p['users']:
                    print(f"⚠️ User '{username}' is not part of project '{projectName}'")
                    return False

                if hwName not in p['hwSets']:
                    print(f"⚠️ '{hwName}' not found in project '{projectName}'")
                    return False

                hw_entry = p['hwSets'][hwName]
                hw_entry.setdefault('user_usage', {})

                user_checked_out = hw_entry['user_usage'].get(username, 0)
                if user_checked_out <= 0:
                    print(f"⚠️ User '{username}' has no '{hwName}' checked out.")
                    return False

                # Limit to what they actually have
                qty = min(qty, user_checked_out)

                hw_entry['used'] -= qty
                hw_entry['user_usage'][username] -= qty

                if hw_entry['user_usage'][username] <= 0:
                    del hw_entry['user_usage'][username]  # cleanup

                print(f"✅ User '{username}' checked in {qty} of '{hwName}' to project '{projectName}'")
                return True

        print(f"⚠️ Project '{projectName}' not found.")
        return False
    except Exception as e:
        print(f"❌ Error checking in HW: {e}")
        return False
