# README - PRTracker Database Design

## Project Overview

**Project Name**: PRTracker  
**Team Members**: Aneesh Mussim  
**Course**: CMSC408 - Fall 2024  
**Date**: September 28, 2024  
**GitHub Repository**: [CMSC408 PRTracker Repository](https://github.com/cmsc-vcu/cmsc408-fa2024-proj-prtracker)

**Description**:  
PRTracker is a workout log database application that helps users track workouts, exercises, and performance metrics such as sets, reps, weight lifted, and calories burned. It supports goal setting and progress tracking, making it ideal for individuals and personal trainers to manage and optimize fitness routines efficiently.

## Key Project Deliverables

- **Pitch Video**: [Link to Pitch Video](https://vcu.zoom.us/rec/share/gascYdsbK6lqeeTMTMOQ3bQaF_fnZxWFh8HHY_qqIAxMjVpi8BC8G21l77p-KOjw.8zr0bD4BpXU7E9Vu?startTime=1726086844000)
- **Design Video**: [Link to Design Video]
- **GitHub Repository**: [Link to GitHub Repository](https://github.com/cmsc-vcu/cmsc408-fa2024-proj-prtracker)

## Problem Description

**Problem Domain**:  
Tracking workouts and fitness progress manually can be challenging and ineffective. PRTracker addresses these issues by providing a structured way to record workouts, analyze performance, and track progress over time.

**Target Audience**:  
The application is designed for both individual users who want to manage their personal fitness progress and personal trainers who need to monitor multiple clients effectively.

**Motivation**:  
The project was inspired by the difficulties faced when manually logging workouts and the desire to create a solution that helps both fitness enthusiasts and professionals optimize their training routines.

## Database Design

### ERD and Normalization

The database includes the following entities and relationships:

1. **User**: Stores information about the user (e.g., ID, name, age, weight, fitness goal).
2. **Workout**: Represents workout sessions (e.g., ID, date, duration, type).
3. **Exercise**: Contains details about exercises (e.g., ID, name, type, muscle group).
4. **Exercise Performance**: Logs performance metrics for each exercise (e.g., sets, reps, weight).
5. **Goal**: Tracks fitness goals and progress (e.g., ID, description, target, progress).

Each relation has been decomposed into BCNF/4NF to ensure that it is free of redundancy and anomalies, supporting efficient querying and updates.

### Relational Schemas

1. **User (user_id, name, age, weight, fitness_goal, email)**  
   - Primary Key: `user_id`

2. **Workout (workout_id, user_id, date, duration, workout_type, calories_burned)**  
   - Primary Key: `workout_id`  
   - Foreign Key: `user_id` (references `User.user_id`)

3. **Exercise (exercise_id, name, exercise_type, muscle_group, equipment_used)**  
   - Primary Key: `exercise_id`

4. **ExercisePerformance (performance_id, workout_id, exercise_id, sets, reps, weight, time, heart_rate)**  
   - Primary Key: `performance_id`  
   - Foreign Keys: `workout_id` (references `Workout.workout_id`), `exercise_id` (references `Exercise.exercise_id`)

5. **Goal (goal_id, user_id, description, target, progress, start_date, end_date)**  
   - Primary Key: `goal_id`  
   - Foreign Key: `user_id` (references `User.user_id`)

### Use Cases and Queries

- **Retrieve all workout sessions for a specific user.**
- **List all exercises performed during a workout session.**
- **Find the most recent workout date for each user.**
- **Identify exercises not performed in any workout.**
- **Find users who have achieved their fitness goals.**

## Project Schedule and Management

The project schedule is divided into the following phases:

| Task                              | Start Date | End Date   | Status     |
|-----------------------------------|------------|------------|------------|
| Database Design & ERD             | 2024-09-01 | 2024-09-20 | Completed  |
| Relational Schema & Normalization | 2024-09-21 | 2024-10-01 | In Progress|
| Implementation & Testing          | 2024-10-02 | 2024-11-15 | Not Started|
| Documentation & Video Creation    | 2024-11-16 | 2024-11-30 | Not Started|
| Final Submission                  | 2024-12-01 | 2024-12-12 | Not Started|

---

This README provides a high-level overview of the PRTracker project, its objectives, and the technical design of its database. For detailed implementation and additional information, please refer to the [project repository](https://github.com/cmsc-vcu/cmsc408-fa2024-proj-prtracker).
