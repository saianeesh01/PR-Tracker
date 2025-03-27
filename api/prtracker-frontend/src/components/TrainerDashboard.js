// src/components/TrainerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TrainerDashboard.css';

function TrainerDashboard({ trainerId }) {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch clients assigned to the trainer, including workout plans
    const fetchClients = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/trainers/${trainerId}/clients`);
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, [trainerId]);

  const handleCreateWorkoutPlan = (userId) => {
    // Navigate to the workout plan creation page, passing the trainerId and userId as parameters
    navigate(`/workoutPlan/${userId}?trainerId=${trainerId}`);
  };

  const handleLogout = () => {
    // Clear localStorage and navigate back to login page
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="trainer-dashboard-container">
      <h2 className="trainer-dashboard-header">Trainer Dashboard</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h3>Your Clients</h3>
      {clients.length > 0 ? (
        <ul className="trainer-client-list">
          {clients.map((client) => (
            <li key={client.user_id} className="trainer-client-item">
              <h4>{client.name}</h4>
              <p>Fitness Goal: {client.fitness_goal && client.fitness_goal.trim() !== '' ? client.fitness_goal : 'No fitness goal set.'}</p>
              <h5>Workouts:</h5>
              {client.workouts && client.workouts.length > 0 ? (
                <ul className="client-workouts-list">
                  {client.workouts.map((workout) => (
                    <li key={workout.workout_id}>
                      {new Date(workout.workout_date).toLocaleDateString()}: {workout.workout_type} for {workout.duration_minutes} minutes, Calories burned: {workout.calories_burned}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No workouts logged yet.</p>
              )}
              <h5>Workout Plan:</h5>
              {client.plan_name ? (
                <div className="workout-plan-info">
                  <p>Plan Name: {client.plan_name}</p>
                  <p>Description: {client.description}</p>
                  <p>Start Date: {new Date(client.start_date).toLocaleDateString()}</p>
                  <p>End Date: {new Date(client.end_date).toLocaleDateString()}</p>
                </div>
              ) : (
                <p>No workout plan created yet.</p>
              )}
              <button className="workout-plan-button" onClick={() => handleCreateWorkoutPlan(client.user_id)}>Create/Edit Workout Plan</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No clients assigned yet.</p>
      )}
    </div>
  );
}

export default TrainerDashboard;
