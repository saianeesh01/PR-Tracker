// src/components/WorkoutPlan.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './WorkoutPlan.css';

function WorkoutPlan() {
  const { userId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const trainerId = queryParams.get('trainerId');
  const navigate = useNavigate();

  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const saveWorkoutPlan = async () => {
    if (!trainerId) {
      console.error('Trainer ID is undefined');
      return;
    }

    try {
      await axios.post(`http://localhost:5002/trainers/${trainerId}/clients/${userId}/workout-plan`, {
        plan_name: planName,
        description: description,
        start_date: startDate,
        end_date: endDate,
      });
      alert('Workout plan created successfully');
    } catch (error) {
      console.error('Error saving workout plan:', error);
    }
  };

  const goBackToDashboard = () => {
    navigate(`/trainerDashboard`);
  };

  return (
    <div className="workout-plan-container">
      <h2 className="workout-plan-header">Create Workout Plan</h2>
      <div className="workout-plan-form">
        <input
          type="text"
          placeholder="Plan Name"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={saveWorkoutPlan}>Save Workout Plan</button>
        <button onClick={goBackToDashboard}>Go Back to Trainer Dashboard</button>
      </div>
    </div>
  );
}

export default WorkoutPlan;
