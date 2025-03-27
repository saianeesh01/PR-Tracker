// src/components/UserDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css'; // Import the CSS file for styling

function UserDashboard({ userId }) {
  const [userDetails, setUserDetails] = useState(null);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ description: '', target: '', startDate: '', endDate: '' });
  const [workouts, setWorkouts] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState({ type: '', duration: '', calories: '' });
  const [editingGoal, setEditingGoal] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details, goals, workouts, trainer, and workout plan
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/users/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchUserGoals = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/users/${userId}/goals`);
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching user goals:', error);
      }
    };

    const fetchUserWorkouts = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/users/${userId}/workouts`);
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching user workouts:', error);
      }
    };

    const fetchUserTrainer = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/users/${userId}/trainer`);
        setTrainer(response.data);

        // Fetch workout plan if a trainer is assigned
        if (response.data) {
          const planResponse = await axios.get(`http://localhost:5002/users/${userId}/workout-plan`);
          setWorkoutPlan(planResponse.data.length > 0 ? planResponse.data[0] : null);
        }
      } catch (error) {
        console.error('Error fetching trainer:', error);
      }
    };

    fetchUserDetails();
    fetchUserGoals();
    fetchUserWorkouts();
    fetchUserTrainer();
  }, [userId]);

  const addGoal = async () => {
    try {
      await axios.post(`http://localhost:5002/users/${userId}/goals`, newGoal);
      setNewGoal({ description: '', target: '', startDate: '', endDate: '' });
      // Refresh goals
      const response = await axios.get(`http://localhost:5002/users/${userId}/goals`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };
  
  const updateGoal = async (goalId) => {
    try {
      await axios.put(`http://localhost:5002/users/${userId}/goals/${goalId}`, editingGoal);
      setEditingGoal(null);
      // Refresh goals
      const response = await axios.get(`http://localhost:5002/users/${userId}/goals`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await axios.delete(`http://localhost:5002/users/${userId}/goals/${goalId}`);
      // Refresh goals
      const response = await axios.get(`http://localhost:5002/users/${userId}/goals`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const addWorkout = async () => {
    try {
      await axios.post(`http://localhost:5002/users/${userId}/workouts`, workoutDetails);
      setWorkoutDetails({ type: '', duration: '', calories: '' });
      // Refresh workouts
      const response = await axios.get(`http://localhost:5002/users/${userId}/workouts`);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  const navigateToTrainers = () => {
    navigate('/trainers');
  };

  const navigateToNutrition = () => {
    navigate('/nutrition');
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">User Dashboard</h2>
      <button className="logout-button" onClick={logout}>Logout</button>
      <button className="trainer-button" onClick={navigateToTrainers}>Find a Trainer</button>
      <button className="nutrition-button" onClick={navigateToNutrition}>Log Nutrition</button>
      {userDetails && (
        <div className="user-details">
          <h3>Welcome, {userDetails.name}</h3>
          <p>Age: {userDetails.age}</p>
          <p>Weight: {userDetails.weight} lbs</p>
        </div>
      )}

      {trainer ? (
        <div className="trainer-details">
          <h4>Your Trainer: {trainer.trainer_name}</h4>
          <p>Specialization: {trainer.specialization}</p>

          {workoutPlan ? (
            <div className="workout-plan-details">
              <h5>Workout Plan from Your Trainer:</h5>
              <p>Plan Name: {workoutPlan.plan_name}</p>
              <p>Description: {workoutPlan.description}</p>
              <p>Start Date: {new Date(workoutPlan.start_date).toLocaleDateString()}</p>
              <p>End Date: {new Date(workoutPlan.end_date).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>No workout plan assigned yet.</p>
          )}
        </div>
      ) : (
        <p>No trainer assigned yet.</p>
      )}

      <div className="goals-section">
        <h3>Your Goals</h3>
        {goals.length > 0 ? (
          <ul className="goals-list">
            {goals.map((goal) => (
              <li key={goal.goal_id} className="goal-item">
                {editingGoal && editingGoal.goal_id === goal.goal_id ? (
                  <div className="goal-edit">
                    <input
                      type="text"
                      placeholder="Goal Description"
                      value={editingGoal.description}
                      onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Target"
                      value={editingGoal.target}
                      onChange={(e) => setEditingGoal({ ...editingGoal, target: e.target.value })}
                    />
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={editingGoal.startDate}
                      onChange={(e) => setEditingGoal({ ...editingGoal, startDate: e.target.value })}
                    />
                    <input
                      type="date"
                      placeholder="End Date"
                      value={editingGoal.endDate}
                      onChange={(e) => setEditingGoal({ ...editingGoal, endDate: e.target.value })}
                    />
                    <button onClick={() => updateGoal(goal.goal_id)}>Save</button>
                    <button onClick={() => setEditingGoal(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="goal-display">
                    {goal.description} - Target: {goal.target}
                    <button onClick={() => setEditingGoal(goal)}>Edit</button>
                    <button onClick={() => deleteGoal(goal.goal_id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No goals set yet.</p>
        )}
        <div className="goal-form">
          <input
            type="text"
            placeholder="Goal Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Target"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          />
          <input
            type="date"
            placeholder="Start Date"
            value={newGoal.startDate}
            onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
          />
          <input
            type="date"
            placeholder="End Date"
            value={newGoal.endDate}
            onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
          />
          <button onClick={addGoal}>Add Goal</button>
        </div>
      </div>

      <div className="workouts-section">
        <h3>Your Workouts</h3>
        {workouts.length > 0 ? (
          <ul className="workouts-list">
            {workouts.map((workout) => (
              <li key={workout.workout_id} className="workout-item">
                {new Date(workout.workout_date).toLocaleDateString()}: {workout.workout_type} for {workout.duration_minutes} minutes, Calories burned: {workout.calories_burned}
              </li>
            ))}
          </ul>
        ) : (
          <p>No workouts logged yet.</p>
        )}
        <div className="workout-form">
          <input
            type="text"
            placeholder="Workout Type"
            value={workoutDetails.type}
            onChange={(e) => setWorkoutDetails({ ...workoutDetails, type: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={workoutDetails.duration}
            onChange={(e) => setWorkoutDetails({ ...workoutDetails, duration: e.target.value })}
          />
          <input
            type="number"
            placeholder="Calories Burned"
            value={workoutDetails.calories}
            onChange={(e) => setWorkoutDetails({ ...workoutDetails, calories: e.target.value })}
          />
          <button onClick={addWorkout}>Add Workout</button>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
