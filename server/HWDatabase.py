# HWDatabase.py
from pymongo import MongoClient
from pydantic import BaseModel
from typing import Optional

'''
Structure of Hardware Set entry:
HardwareSet = {
    'hwName': hwSetName,          # Unique hardware name
    'capacity': initCapacity,     # Total number of units
    'availability': initCapacity  # Current remaining units
}
'''

class HWData(BaseModel):
    id: Optional[str] = None 
    hwName: str
    capacity: int
    availability: int

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
        existing = client['Hardware'].Hardware_Sets.find_one({"hwName": hwSetName})
        if existing:
            return False

        hw_doc = HWData(
            hwName=hwSetName,
            capacity=initCapacity,
            availability=initCapacity
        )

        hw_model_dump = hw_doc.model_dump()

        client['Hardware'].Hardware_Sets.insert_one(hw_model_dump)
        print(f" Created hardware set '{hwSetName}' with capacity {initCapacity}")
        return True
    except Exception as e:
        print(f" Error creating hardware set: {e}")
        return False


# ============================================================
# Query a hardware set by its name
# ============================================================
def queryHardwareSet(client, hwSetName):
    """Return a hardware set by name."""
    try:
        existing = client['Hardware'].Hardware_Sets.find_one({"hwName": hwSetName})
        return existing
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
        existing = client['Hardware'].Hardware_Sets.find_one({"hwName": hwSetName})
        if existing:
            existing['availability'] = max(0, min(existing['capacity'], newAvailability))
            client['Hardware'].Hardware_Sets.update_one(
                {'hwName': hwSetName},
                {'$set': {'availability': existing['availability']}}
            )
            print(f"Updated '{hwSetName}' availability → {hw['availability']}/{hw['capacity']}")
            return True
        print(f"Hardware set '{hwSetName}' not found.")
        return False
    except Exception as e:
        print(f"Error updating availability: {e}")
        return False


# ============================================================
# Get all hardware set names and info
# ============================================================
def getAllHwSets(client):
    """Return a list of all hardware sets with capacity and availability."""
    try:
        hardware_sets = list(client['Hardware'].Hardware_Sets.find({}))
        _hw_storage =[]

        for hwSet in hardware_sets:
            _hw_storage.append({
                'hwName': hwSet['hwName'],
                'capacity': hwSet['capacity'],
                'availability': hwSet['availability']
            })

        return _hw_storage
    except Exception as e:
        print(f"❌ Error retrieving hardware list: {e}")
        return []
