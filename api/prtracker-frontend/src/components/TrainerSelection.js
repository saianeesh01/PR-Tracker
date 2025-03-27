// src/components/TrainerSelection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AppTheme.css';

function TrainerSelection({ userId }) {
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch trainers from the backend
    const fetchTrainers = async () => {
      try {
        const response = await axios.get('http://localhost:5002/trainers');
        setTrainers(response.data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    fetchTrainers();
  }, []);

  const assignTrainer = async (trainerId) => {
    try {
      const response = await axios.post(`http://localhost:5002/users/${userId}/assign_trainer`, { trainer_id: trainerId });
      alert(response.data.message);
      navigate('/userDashboard');
    } catch (error) {
      console.error('Error assigning trainer:', error);
    }
  };

  return (
    <div className="trainer-selection-container">
      <h2>Select a Trainer</h2>
      {trainers.length > 0 ? (
        <ul>
          {trainers.map((trainer) => (
            <li key={trainer.user_id}>
              <h3>{trainer.name}</h3>
              <button onClick={() => assignTrainer(trainer.user_id)}>Select as Trainer</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No trainers available.</p>
      )}
    </div>
  );
}

export default TrainerSelection;
