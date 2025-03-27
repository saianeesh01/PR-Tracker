// src/components/Nutrition.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppTheme.css';

function Nutrition({ userId }) {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [nutritionDetails, setNutritionDetails] = useState({
    foodName: '',
    caloriesConsumed: '',
    proteinGrams: '',
    carbsGrams: '',
    fatsGrams: '',
  });

  useEffect(() => {
    const fetchNutritionLogs = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/users/${userId}/nutrition`);
        setNutritionLogs(response.data);
      } catch (error) {
        console.error('Error fetching nutrition logs:', error);
      }
    };

    fetchNutritionLogs();
  }, [userId]);

  const addNutritionLog = async () => {
    try {
      await axios.post(`http://localhost:5002/users/${userId}/nutrition`, nutritionDetails);
      setNutritionDetails({
        foodName: '',
        caloriesConsumed: '',
        proteinGrams: '',
        carbsGrams: '',
        fatsGrams: '',
      });
      // Refresh nutrition logs
      const response = await axios.get(`http://localhost:5002/users/${userId}/nutrition`);
      setNutritionLogs(response.data);
    } catch (error) {
      console.error('Error adding nutrition log:', error);
    }
  };

  return (
    <div className="nutrition-container">
      <h2>Nutrition Log</h2>
      {nutritionLogs.length > 0 ? (
        <ul>
          {nutritionLogs.map((log) => (
            <li key={log.nutrition_id}>
              {log.date}: {log.food_name} - {log.calories_consumed} calories, {log.protein_grams}g protein, {log.carbs_grams}g carbs, {log.fats_grams}g fats
            </li>
          ))}
        </ul>
      ) : (
        <p>No nutrition logs yet.</p>
      )}
      <div className="nutrition-form">
        <input
          type="text"
          placeholder="Food Name"
          value={nutritionDetails.foodName}
          onChange={(e) => setNutritionDetails({ ...nutritionDetails, foodName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Calories Consumed"
          value={nutritionDetails.caloriesConsumed}
          onChange={(e) => setNutritionDetails({ ...nutritionDetails, caloriesConsumed: e.target.value })}
        />
        <input
          type="number"
          placeholder="Protein (g)"
          value={nutritionDetails.proteinGrams}
          onChange={(e) => setNutritionDetails({ ...nutritionDetails, proteinGrams: e.target.value })}
        />
        <input
          type="number"
          placeholder="Carbs (g)"
          value={nutritionDetails.carbsGrams}
          onChange={(e) => setNutritionDetails({ ...nutritionDetails, carbsGrams: e.target.value })}
        />
        <input
          type="number"
          placeholder="Fats (g)"
          value={nutritionDetails.fatsGrams}
          onChange={(e) => setNutritionDetails({ ...nutritionDetails, fatsGrams: e.target.value })}
        />
        <button onClick={addNutritionLog}>Add Nutrition Log</button>
      </div>
    </div>
  );
}

export default Nutrition;
