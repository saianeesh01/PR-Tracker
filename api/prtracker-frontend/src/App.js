// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import TrainerSelection from './components/TrainerSelection';
import Nutrition from './components/Nutrition';
import WorkoutPlan from './components/WorkoutPlan';

function App() {
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role'); // Fetch role from local storage

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Conditional rendering for UserDashboard, TrainerDashboard, TrainerSelection, and Nutrition */}
        {userId && role === 'user' ? (
          <>
            <Route path="/userDashboard" element={<UserDashboard userId={userId} />} />
            <Route path="/trainers" element={<TrainerSelection userId={userId} />} />
            <Route path="/nutrition" element={<Nutrition userId={userId} />} />
          </>
        ) : userId && role === 'trainer' ? (
          <>
            <Route path="/trainerDashboard" element={<TrainerDashboard trainerId={userId} />} />
            <Route path="/workoutPlan/:userId" element={<WorkoutPlan />} />
          </>
        ) : (
          // Redirect to login if no userId is found
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Default route to redirect to the proper dashboard */}
        {userId && (
          <Route
            path="/dashboard"
            element={role === 'user' ? <Navigate to="/userDashboard" replace /> : <Navigate to="/trainerDashboard" replace />}
          />
        )}

        {/* Catch-all route to handle undefined paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
