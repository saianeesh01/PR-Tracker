CREATE DATABASE prtracker;

USE prtracker;

-- 1. User Table
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    weight FLOAT,
    fitness_goal VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- 2. Workout Table
CREATE TABLE Workout (
    workout_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE,
    duration INT,
    workout_type VARCHAR(100),
    calories_burned FLOAT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- 3. Exercise Table
CREATE TABLE Exercise (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    exercise_type VARCHAR(100),
    muscle_group VARCHAR(100),
    equipment_used VARCHAR(100)
);

-- 4. ExercisePerformance Table
CREATE TABLE ExercisePerformance (
    performance_id INT AUTO_INCREMENT PRIMARY KEY,
    workout_id INT,
    exercise_id INT,
    sets INT,
    reps INT,
    weight FLOAT,
    time TIME,
    heart_rate INT,
    FOREIGN KEY (workout_id) REFERENCES Workout(workout_id),
    FOREIGN KEY (exercise_id) REFERENCES Exercise(exercise_id)
);

-- 5. Goal Table
CREATE TABLE Goal (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    description VARCHAR(255),
    target FLOAT,
    progress FLOAT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
