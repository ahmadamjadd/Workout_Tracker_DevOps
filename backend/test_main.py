from fastapi.testclient import TestClient
from main import app

# This creates a dummy client to interact with your FastAPI app
client = TestClient(app)

# --- TEST CASE 1: Can we fetch the workouts? ---
def test_read_workouts():
    response = client.get("/workouts/")
    
    # Check 1: Did the server respond with a success code (200 OK)?
    assert response.status_code == 200
    # Check 2: Is the response data a list?
    assert isinstance(response.json(), list)

# --- TEST CASE 2: Can we create a new workout? ---
def test_create_workout():
    dummy_workout = {
        "exercise_name": "Automated Test Squat", 
        "sets": 3, 
        "reps": 10, 
        "weight": 135.0
    }
    response = client.post("/workouts/", json=dummy_workout)
    
    # Check 1: Did the server accept and create the data (200 OK)?
    assert response.status_code == 200
    # Check 2: Does the returned data match what we sent?
    assert response.json()["exercise_name"] == "Automated Test Squat"
    assert "id" in response.json() # Make sure the database gave it an ID

# --- TEST CASE 3: Does the app reject bad data? ---
def test_create_workout_missing_data():
    # Notice we are intentionally leaving out the "weight" field
    bad_workout = {
        "exercise_name": "Automated Test Bench", 
        "sets": 3, 
        "reps": 10
    }
    response = client.post("/workouts/", json=bad_workout)
    
    # Check 1: Did the server correctly reject this? 
    # 422 stands for "Unprocessable Entity", which means Pydantic caught the missing field!
    assert response.status_code == 422
