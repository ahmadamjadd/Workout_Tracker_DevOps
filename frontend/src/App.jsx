import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- 1. State Management ---
  // This stores the list of workouts fetched from the backend
  const [workouts, setWorkouts] = useState([]);
  
  // This temporarily holds the data being typed into the form
  const [formData, setFormData] = useState({
    exercise_name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  // The URL of your FastAPI backend
  const API_URL = 'http://127.0.0.1:8000/workouts/';

  // --- 2. Fetch Data from Backend ---
  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(API_URL);
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  // useEffect runs the fetchWorkouts function once when the page loads
  useEffect(() => {
    fetchWorkouts();
  }, []);

  // --- 3. Handle Form Interactions ---
  // Updates the formData state whenever a user types in an input box
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Sends the form data to the backend when the user clicks "Log Workout"
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the page from refreshing
    try {
      await axios.post(API_URL, formData);
      setFormData({ exercise_name: '', sets: '', reps: '', weight: '' }); // Clear form
      fetchWorkouts(); // Refresh the list to show the new workout
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  // --- 4. The User Interface (HTML/JSX) ---
  return (
    <div className="container">
      <h1>🏋️ Minimalist Workout Tracker</h1>

      {/* The Input Form */}
      <div className="card">
        <h2>Log a New Workout</h2>
        <form onSubmit={handleSubmit} className="workout-form">
          <input 
            type="text" name="exercise_name" placeholder="Exercise (e.g., Bench Press)" 
            value={formData.exercise_name} onChange={handleInputChange} required 
          />
          <input 
            type="number" name="sets" placeholder="Sets" 
            value={formData.sets} onChange={handleInputChange} required 
          />
          <input 
            type="number" name="reps" placeholder="Reps" 
            value={formData.reps} onChange={handleInputChange} required 
          />
          <input 
            type="number" step="0.1" name="weight" placeholder="Weight (kg/lbs)" 
            value={formData.weight} onChange={handleInputChange} required 
          />
          <button type="submit">Log Workout</button>
        </form>
      </div>

      {/* The History Table */}
      <div className="card">
        <h2>Workout History</h2>
        {workouts.length === 0 ? (
          <p>No workouts logged yet. Get lifting!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Exercise</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <td>{new Date(workout.date).toLocaleDateString()}</td>
                  <td>{workout.exercise_name}</td>
                  <td>{workout.sets}</td>
                  <td>{workout.reps}</td>
                  <td>{workout.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;