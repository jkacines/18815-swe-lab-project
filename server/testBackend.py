import requests
import json
import time
import sys

BASE_URL = "http://localhost:8001"
ERROR_COUNT = 0

# ============ Helper Utilities ============

def pretty(data):
    """Print formatted JSON"""
    print(json.dumps(data, indent=2))

def print_section(title):
    print(f"\n🔹 {title}")

def assert_condition(condition, message):
    """Assertion utility for validations"""
    global ERROR_COUNT
    if condition:
        print(f"✅ PASS: {message}")
    else:
        print(f"❌ FAIL: {message}")
        ERROR_COUNT += 1


# ============ API Wrappers ============

def createHardware(hwName, capacity):
    print_section(f"Create Hardware Set '{hwName}' ({capacity})")
    data = {"hwName": hwName, "capacity": capacity}
    res = requests.post(f"{BASE_URL}/hardware/create", json=data)
    print("Status:", res.status_code)
    try:
        pretty(res.json())
    except:
        print("⚠️ Invalid JSON Response")
    return res


def verifyHardware(expected_list):
    """Verify all hardware sets match expected"""
    print_section("Verify Hardware Sets")
    res = requests.get(f"{BASE_URL}/hardware")
    print("Status:", res.status_code)
    data = res.json()
    pretty(data)

    hw_data = data.get("hardware", [])
    assert_condition(len(hw_data) == len(expected_list), "Hardware count matches expected")

    for expected in expected_list:
        found = next((h for h in hw_data if h["hwName"] == expected["hwName"]), None)
        assert_condition(found is not None, f"Found {expected['hwName']}")
        if found:
            assert_condition(found["capacity"] == expected["capacity"],
                             f"{expected['hwName']} capacity correct ({found['capacity']})")
            assert_condition(found["availability"] == expected["availability"],
                             f"{expected['hwName']} availability correct ({found['availability']})")
    return data


def createProject(projectName, description, hwSets):
    print_section(f"Create Project '{projectName}'")
    data = {
        "projectName": projectName,
        "description": description,
        "hwSets": hwSets
    }
    res = requests.post(f"{BASE_URL}/projects/create", json=data)
    print("Status:", res.status_code)
    try:
        pretty(res.json())
    except:
        print("⚠️ Invalid JSON Response")
    return res


def verifyProjects(expected_projects):
    print_section("Verify Projects List")
    res = requests.get(f"{BASE_URL}/projects")
    print("Status:", res.status_code)
    data = res.json()
    pretty(data)

    projects = data.get("projects", [])
    assert_condition(len(projects) == len(expected_projects), "Project count matches expected")

    for expected in expected_projects:
        found = next((p for p in projects if p["projectName"] == expected["projectName"]), None)
        assert_condition(found is not None, f"Found project '{expected['projectName']}'")
        if found:
            assert_condition(found["description"] == expected["description"],
                             f"Description matches for '{expected['projectName']}'")
            assert_condition(set(found["hwSets"].keys()) == set(expected["hwSets"].keys()),
                             f"HW sets match for '{expected['projectName']}'")
    return data


def verifyProject(projectName, expected_project):
    """Verify a single project matches expected values."""
    print_section(f"Verify Project '{projectName}'")
    res = requests.get(f"{BASE_URL}/projects")
    print("Status:", res.status_code)
    data = res.json()
    projects = data.get("projects", [])
    found = next((p for p in projects if p["projectName"] == projectName), None)
    assert_condition(found is not None, f"Project '{projectName}' exists")

    if found:
        for hwName, hwExpected in expected_project["hwSets"].items():
            assert_condition(hwName in found["hwSets"], f"HWSet '{hwName}' exists in project")
            if hwName in found["hwSets"]:
                hwFound = found["hwSets"][hwName]
                assert_condition(hwFound["capacity"] == hwExpected["capacity"],
                                 f"{projectName}/{hwName} capacity = {hwFound['capacity']}")
                assert_condition(hwFound["used"] == hwExpected["used"],
                                 f"{projectName}/{hwName} used = {hwFound['used']}")
    return data


def checkoutHW(projectName, hwName, qty):
    """Simulate checking out hardware from a project."""
    print_section(f"Check Out {qty} '{hwName}' in Project '{projectName}'")
    data = {"projectName": projectName, "hwName": hwName, "qty": qty}
    res = requests.post(f"{BASE_URL}/projects/checkout", json=data)
    print("Status:", res.status_code)
    try:
        pretty(res.json())
    except:
        print("⚠️ Invalid JSON Response")
    return res


# ============ Test Flow ============

def run_all_tests():
    global ERROR_COUNT
    print("\n🚀 Starting Backend Test Sequence...\n")
    time.sleep(1)

    # 1️⃣ Create hardware
    createHardware("HWSet1", 100)
    createHardware("HWSet2", 50)

    # 2️⃣ Verify hardware initial state
    verifyHardware([
        {"hwName": "HWSet1", "capacity": 100, "availability": 100},
        {"hwName": "HWSet2", "capacity": 50, "availability": 50}
    ])

    # 3️⃣ Create project
    createProject("Sensor Node Project", "IoT sensor testing platform", {"HWSet1": 20})
    verifyProject("Sensor Node Project", {
        "projectName": "Sensor Node Project",
        "hwSets": {"HWSet1": {"used": 0, "capacity": 20}}
    })

    # 4️⃣ Verify global HW decreased
    verifyHardware([
        {"hwName": "HWSet1", "capacity": 100, "availability": 80},
        {"hwName": "HWSet2", "capacity": 50, "availability": 50}
    ])

    # 5️⃣ Checkout 10 HW within project
    checkoutHW("Sensor Node Project", "HWSet1", 10)

    # 6️⃣ Verify project reflects checkout (used = 10)
    verifyProject("Sensor Node Project", {
        "projectName": "Sensor Node Project",
        "hwSets": {"HWSet1": {"used": 10, "capacity": 20}}
    })

    # 7️⃣ Verify global HW did NOT change
    verifyHardware([
        {"hwName": "HWSet1", "capacity": 100, "availability": 80},  # unchanged
        {"hwName": "HWSet2", "capacity": 50, "availability": 50}
    ])

    # ✅ Final test summary
    if ERROR_COUNT == 0:
        print("\n🎉 ✅ ALL TESTS PASSED SUCCESSFULLY!\n")
    else:
        print(f"\n❌ {ERROR_COUNT} TEST(S) FAILED.\n")


if __name__ == "__main__":
    try:
        run_all_tests()
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend. Make sure Flask is running at http://localhost:8001")
        sys.exit(1)
