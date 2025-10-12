# HWDatabase.py
from pymongo import MongoClient

# In-memory storage for development
_hw_storage = []

'''
Structure of Hardware Set entry:
HardwareSet = {
    'hwName': hwSetName,          # Unique hardware name
    'capacity': initCapacity,     # Total number of units
    'availability': initCapacity  # Current remaining units
}
'''


# ============================================================
# Create a new hardware set
# ============================================================
def createHardwareSet(client, hwSetName, initCapacity):
    """
    Create a new hardware set with specified capacity.
    Availability starts equal to capacity.
    """
    try:
        # Check if it already exists
        for hw in _hw_storage:
            if hw['hwName'] == hwSetName:
                print(f"⚠️ Hardware set '{hwSetName}' already exists.")
                return False

        hw_doc = {
            'hwName': hwSetName,
            'capacity': initCapacity,
            'availability': initCapacity
        }

        _hw_storage.append(hw_doc)
        print(f"✅ Created hardware set '{hwSetName}' with capacity {initCapacity}")
        return True
    except Exception as e:
        print(f"❌ Error creating hardware set: {e}")
        return False


# ============================================================
# Query a hardware set by its name
# ============================================================
def queryHardwareSet(client, hwSetName):
    """Return a hardware set by name."""
    try:
        for hw in _hw_storage:
            if hw['hwName'] == hwSetName:
                return hw
        print(f"⚠️ Hardware set '{hwSetName}' not found.")
        return None
    except Exception as e:
        print(f"❌ Error querying hardware set: {e}")
        return None


# ============================================================
# Update availability of a hardware set
# ============================================================
def updateAvailability(client, hwSetName, newAvailability):
    """
    Update the availability of a hardware set.
    Ensures value stays within [0, capacity].
    """
    try:
        for hw in _hw_storage:
            if hw['hwName'] == hwSetName:
                hw['availability'] = max(0, min(hw['capacity'], newAvailability))
                print(f"✅ Updated '{hwSetName}' availability → {hw['availability']}/{hw['capacity']}")
                return True
        print(f"⚠️ Hardware set '{hwSetName}' not found.")
        return False
    except Exception as e:
        print(f"❌ Error updating availability: {e}")
        return False


# ============================================================
# Get all hardware set names and info
# ============================================================
def getAllHwSets(client):
    """Return a list of all hardware sets with capacity and availability."""
    try:
        return _hw_storage
    except Exception as e:
        print(f"❌ Error retrieving hardware list: {e}")
        return []
