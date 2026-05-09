/* eslint-disable */
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    exercise_name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  // Dynamically uses your EC2 IP from GitHub Actions, or localhost if you are on your laptop
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/workouts/';

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(API_URL);
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setFormData({ exercise_name: '', sets: '', reps: '', weight: '' });
      fetchWorkouts();
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Workout Tracker</h1>
      </header>

      <main className="main-content">
        <section className="left-panel">
          <div className="card">
            <h2>Log Workout</h2>
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="form-group">
                <label>Exercise Name</label>
                <input 
                  type="text" name="exercise_name" placeholder="e.g., Deadlift" 
                  value={formData.exercise_name} onChange={handleInputChange} required 
                />
              </div>
              <div className="form-group">
                <label>Sets</label>
                <input 
                  type="number" name="sets" placeholder="0" 
                  value={formData.sets} onChange={handleInputChange} required 
                />
              </div>
              <div className="form-group">
                <label>Reps</label>
                <input 
                  type="number" name="reps" placeholder="0" 
                  value={formData.reps} onChange={handleInputChange} required 
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input 
                  type="number" step="0.1" name="weight" placeholder="0.0" 
                  value={formData.weight} onChange={handleInputChange} required 
                />
              </div>
              <button type="submit">Log Session</button>
            </form>
          </div>
        </section>

        <section className="right-panel">
          <div className="card">
            <h2>Workout History</h2>
            <div className="history-table-container">
              {workouts.length === 0 ? (
                <div className="empty-state">
                  <p>No sessions logged yet. Time to hit the gym!</p>
                </div>
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
                        <td className="exercise-cell">{workout.exercise_name}</td>
                        <td>{workout.sets}</td>
                        <td>{workout.reps}</td>
                        <td>{workout.weight} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;