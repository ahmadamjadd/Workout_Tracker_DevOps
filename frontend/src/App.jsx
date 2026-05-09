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
            <div className="workout-history-list">
              {workouts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🏋️‍♂️</div>
                  <p>No sessions logged yet. Time to hit the gym!</p>
                </div>
              ) : (
                workouts.map((workout) => (
                  <div key={workout.id} className="workout-item-card">
                    <div className="workout-item-header">
                      <span className="workout-date">{new Date(workout.date).toLocaleDateString()}</span>
                      <h3 className="workout-name">{workout.exercise_name}</h3>
                    </div>
                    <div className="workout-item-details">
                      <div className="detail-stat">
                        <span className="label">Sets</span>
                        <span className="value">{workout.sets}</span>
                      </div>
                      <div className="detail-stat">
                        <span className="label">Reps</span>
                        <span className="value">{workout.reps}</span>
                      </div>
                      <div className="detail-stat">
                        <span className="label">Weight</span>
                        <span className="value">{workout.weight} <small>kg</small></span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;