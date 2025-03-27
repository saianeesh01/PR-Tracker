-- Schema for User Table
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    weight DECIMAL(5, 2),
    fitness_goal VARCHAR(255),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Example instances for User Table
INSERT INTO User (name, age, weight, fitness_goal, email, password_hash) VALUES
('Alex Davidkov', 23, 150.0, 'Gain muscle mass', 'alex@prtracker.com', 'hashed_password_123'),
('Aneesh Mussim', 27, 165.0, 'Lose weight', 'aneesh@prtracker.com', 'hashed_password_456');

-- Schema for Workout Table
CREATE TABLE Workout (
    workout_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    workout_date DATE NOT NULL,
    duration_minutes INT,
    workout_type VARCHAR(100),
    calories_burned DECIMAL(6, 2),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Example instances for Workout Table
INSERT INTO Workout (user_id, workout_date, duration_minutes, workout_type, calories_burned) VALUES
(1, '2024-09-15', 60, 'Strength Training', 500.00),
(2, '2024-09-16', 45, 'Cardio', 350.00);

-- Schema for Exercise Table
CREATE TABLE Exercise (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100),
    muscle_group VARCHAR(100),
    equipment_used VARCHAR(100)
);

-- Example instances for Exercise Table
INSERT INTO Exercise (name, type, muscle_group, equipment_used) VALUES
('Bench Press', 'Strength', 'Chest', 'Barbell'),
('Squats', 'Strength', 'Legs', 'Barbell');

-- Schema for Exercise Performance Table
CREATE TABLE ExercisePerformance (
    performance_id INT AUTO_INCREMENT PRIMARY KEY,
    workout_id INT,
    exercise_id INT,
    sets INT,
    reps INT,
    weight DECIMAL(5, 2),
    time_minutes DECIMAL(5, 2),
    heart_rate INT,
    FOREIGN KEY (workout_id) REFERENCES Workout(workout_id),
    FOREIGN KEY (exercise_id) REFERENCES Exercise(exercise_id)
);

-- Example instances for Exercise Performance Table
INSERT INTO ExercisePerformance (workout_id, exercise_id, sets, reps, weight, time_minutes, heart_rate) VALUES
(1, 1, 3, 10, 135.0, NULL, NULL),
(2, 2, 4, 12, 185.0, NULL, NULL);

-- Schema for Goal Table
CREATE TABLE Goal (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    description VARCHAR(255) NOT NULL,
    target VARCHAR(100),
    progress VARCHAR(100),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Example instances for Goal Table
INSERT INTO Goal (user_id, description, target, progress, start_date, end_date) VALUES
(1, 'Gain 5 pounds', '155', '2', '2024-09-01', '2024-12-01'),
(2, 'Lose 10 pounds', '155', '3', '2024-09-01', '2024-12-01');

-- Schema for Nutrition Table
CREATE TABLE Nutrition (
    nutrition_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE NOT NULL,
    calories_consumed DECIMAL(6, 2),
    protein_grams DECIMAL(5, 2),
    carbs_grams DECIMAL(5, 2),
    fats_grams DECIMAL(5, 2),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Example instances for Nutrition Table
INSERT INTO Nutrition (user_id, date, calories_consumed, protein_grams, carbs_grams, fats_grams) VALUES
(1, '2024-09-15', 2500.00, 150.0, 300.0, 80.0),
(2, '2024-09-16', 1800.00, 100.0, 200.0, 60.0);

-- Schema for Trainer Table
CREATE TABLE Trainer (
    trainer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    specialization VARCHAR(255)
);

-- Example instances for Trainer Table
INSERT INTO Trainer (name, email, specialization) VALUES
('John Smith', 'john.smith@prtracker.com', 'Strength Training'),
('Emily Johnson', 'emily.johnson@prtracker.com', 'Cardio and Endurance');

-- Schema for User-Trainer Association Table
CREATE TABLE UserTrainer (
    user_trainer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    trainer_id INT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (trainer_id) REFERENCES Trainer(trainer_id)
);

-- Example instances for User-Trainer Association Table
INSERT INTO UserTrainer (user_id, trainer_id, start_date, end_date) VALUES
(1, 1, '2024-09-01', '2024-12-01'),
(2, 2, '2024-09-15', NULL);

-- Schema for Workout Plan Table
CREATE TABLE WorkoutPlan (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    plan_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Example instances for Workout Plan Table
INSERT INTO WorkoutPlan (user_id, plan_name, description, start_date, end_date) VALUES
(1, 'Mass Gain Plan', 'A workout plan focusing on strength and muscle gain', '2024-09-01', '2024-12-01'),
(2, 'Weight Loss Plan', 'A plan aimed at reducing body fat and increasing endurance', '2024-09-15', '2024-12-15');

-- Function to calculate total calories burned for a specific user
DELIMITER $$
CREATE FUNCTION TotalCaloriesBurned(userId INT) RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE total DECIMAL(10, 2);
    SELECT SUM(calories_burned) INTO total
    FROM Workout
    WHERE user_id = userId;
    RETURN IFNULL(total, 0);
END $$
DELIMITER ;

-- Procedure to add a new workout
DELIMITER $$
CREATE PROCEDURE AddWorkout(
    IN p_user_id INT,
    IN p_workout_date DATE,
    IN p_duration_minutes INT,
    IN p_workout_type VARCHAR(100),
    IN p_calories_burned DECIMAL(6, 2)
)
BEGIN
    INSERT INTO Workout (user_id, workout_date, duration_minutes, workout_type, calories_burned)
    VALUES (p_user_id, p_workout_date, p_duration_minutes, p_workout_type, p_calories_burned);
END $$
DELIMITER ;

-- View to display user workout summary
CREATE VIEW UserWorkoutSummary AS
SELECT
    u.user_id,
    u.name,
    COUNT(w.workout_id) AS total_workouts,
    SUM(w.calories_burned) AS total_calories_burned
FROM
    User u
LEFT JOIN Workout w ON u.user_id = w.user_id
GROUP BY
    u.user_id, u.name;

-- Trigger to automatically update a user's fitness goal progress after inserting a new workout
DELIMITER $$
CREATE TRIGGER AfterWorkoutInsert
AFTER INSERT ON Workout
FOR EACH ROW
BEGIN
    UPDATE Goal
    SET progress = CONCAT(progress + 1)
    WHERE user_id = NEW.user_id AND description LIKE '%workout%';
END $$
DELIMITER ;
