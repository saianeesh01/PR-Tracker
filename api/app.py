from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins, or adjust accordingly



# Load environment variables for database connection
DB_HOST = os.getenv("PRTRACKER_HOST", "localhost")
DB_USER = os.getenv("PRTRACKER_USER", "root")
DB_PASSWORD = os.getenv("PRTRACKER_PASSWORD", "")
DB_NAME = os.getenv("PRTRACKER_DB_NAME", "prtracker_db")

# Function to establish a connection to the MySQL database
def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )

# Home route
@app.route('/')
def index():
    return "Welcome to PRTracker API!"

# Register a new user
@app.route('/register', methods=['POST'])
def register():
    user_data = request.get_json()
    name = user_data.get('name')
    email = user_data.get('email')
    password = user_data.get('password')
    age = user_data.get('age')
    weight = user_data.get('weight')
    role = user_data.get('role')

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            hashed_password = generate_password_hash(password)
            sql = """
            INSERT INTO User (name, age, weight,  email, password_hash, role)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (name, age, weight, email, hashed_password, role))
            connection.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except pymysql.MySQLError as e:
        print(f"Database error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"Unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    finally:
        if 'connection' in locals():
            connection.close()

# User login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        # Get user by email
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user is None:
            return jsonify({"message": "User not found"}), 404

        # Verify the password (assuming password_hash was stored in db)
        stored_password_hash = user['password_hash']
        if check_password_hash(stored_password_hash, password):
            return jsonify({"message": "Login successful", "user_id": user['user_id'], "role": user.get('role', 'user')}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        if 'connection' in locals():
            connection.close()

# Fetch user details by user ID
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user_details(user_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM User WHERE user_id = %s", (user_id,))
            user = cursor.fetchone()
        if user:
            return jsonify(user)
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Fetch goals for a specific user
@app.route('/users/<int:user_id>/goals', methods=['GET'])
def get_user_goals(user_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM Goal WHERE user_id = %s", (user_id,))
            goals = cursor.fetchall()
        return jsonify(goals), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Fetch workouts for a specific user
@app.route('/users/<int:user_id>/workouts', methods=['GET'])
def get_user_workouts(user_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM Workout WHERE user_id = %s", (user_id,))
            workouts = cursor.fetchall()
        return jsonify(workouts), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Add a new workout for a specific user
@app.route('/users/<int:user_id>/workouts', methods=['POST'])
def add_user_workout(user_id):
    data = request.get_json()
    workout_type = data.get('type')
    duration_minutes = data.get('duration')
    calories_burned = data.get('calories')

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO Workout (user_id, workout_date, duration_minutes, workout_type, calories_burned) VALUES (%s, NOW(), %s, %s, %s)",
                (user_id, duration_minutes, workout_type, calories_burned)
            )
            connection.commit()
        return jsonify({"message": "Workout added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Add a new goal for a specific user
# Add a new goal for a specific user
@app.route('/users/<int:user_id>/goals', methods=['POST'])
def add_user_goal(user_id):
    data = request.get_json()
    description = data.get('description')
    target = data.get('target')
    start_date = data.get('startDate')
    end_date = data.get('endDate')

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO Goal (user_id, description, target, start_date, end_date) VALUES (%s, %s, %s, %s, %s)",
                (user_id, description, target, start_date, end_date)
            )
            connection.commit()
        return jsonify({"message": "Goal added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()



# Update a goal for a specific user
@app.route('/users/<int:user_id>/goals/<int:goal_id>', methods=['PUT'])
def update_user_goal(user_id, goal_id):
    data = request.get_json()
    description = data.get('description')
    target = data.get('target')
    start_date = data.get('startDate')
    end_date = data.get('endDate')

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
                UPDATE Goal 
                SET description = %s, target = %s, start_date = %s, end_date = %s
                WHERE goal_id = %s AND user_id = %s
            """
            cursor.execute(sql, (description, target, start_date, end_date, goal_id, user_id))
            connection.commit()
        return jsonify({"message": "Goal updated successfully"}), 200
    except pymysql.MySQLError as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()


# Fetch all trainers
@app.route('/trainers', methods=['GET'])
def get_trainers():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM User WHERE role = 'trainer'")
            trainers = cursor.fetchall()
        return jsonify(trainers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Assign a trainer to a user
@app.route('/users/<int:user_id>/assign_trainer', methods=['POST'])
def assign_trainer(user_id):
    try:
        data = request.get_json()
        trainer_id = data.get('trainer_id')

        if not trainer_id:
            return jsonify({"error": "Trainer ID is required"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Insert into UserTrainer table to associate a trainer with a user
            sql = """
                INSERT INTO UserTrainer (user_id, trainer_id, start_date)
                VALUES (%s, %s, NOW())
            """
            cursor.execute(sql, (user_id, trainer_id))
            connection.commit()

        return jsonify({"message": f"Trainer assigned successfully to user {user_id}"}), 200

    except pymysql.MySQLError as e:
        print(f"Database error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"Unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    finally:
        if 'connection' in locals():
            connection.close()

# Fetch trainer assigned to a specific user
@app.route('/users/<int:user_id>/trainer', methods=['GET'])
def get_user_trainer(user_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Fetch trainer info for the user
            sql = """
                SELECT t.trainer_id, u.name AS trainer_name, t.specialization
                FROM UserTrainer ut
                JOIN Trainer t ON ut.trainer_id = t.trainer_id
                JOIN User u ON t.trainer_id = u.user_id
                WHERE ut.user_id = %s
            """
            cursor.execute(sql, (user_id,))
            trainer = cursor.fetchone()
        if trainer:
            return jsonify(trainer), 200
        else:
            return jsonify({"message": "No trainer assigned"}), 404
    except pymysql.MySQLError as e:
        print(f"Database error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()



# Add a new nutrition log for a user
@app.route('/users/<int:user_id>/nutrition', methods=['POST'])
def add_nutrition(user_id):
    data = request.get_json()
    food_name = data.get('foodName')
    calories = data.get('calories')
    protein = data.get('protein')
    carbs = data.get('carbs')
    fats = data.get('fats')

    if not all([food_name, calories, protein, carbs, fats]):
        return jsonify({"message": "All fields are required"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO Nutrition (user_id, food_name, date, calories_consumed, protein_grams, carbs_grams, fats_grams)
                VALUES (%s, %s, NOW(), %s, %s, %s, %s)
            """
            cursor.execute(sql, (user_id, food_name, calories, protein, carbs, fats))
            connection.commit()
        return jsonify({"message": "Nutrition log added successfully"}), 201
    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'connection' in locals():
            connection.close()

# Fetch all nutrition logs for a user
@app.route('/users/<int:user_id>/nutrition', methods=['GET'])
def get_nutrition_logs(user_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "SELECT * FROM Nutrition WHERE user_id = %s ORDER BY date DESC"
            cursor.execute(sql, (user_id,))
            logs = cursor.fetchall()
        return jsonify(logs), 200
    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'connection' in locals():
            connection.close()


# Endpoint to fetch workout plans for a specific user
@app.route('/users/<int:user_id>/workout-plan', methods=['GET'])
def get_workout_plan(user_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "SELECT * FROM WorkoutPlan WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            plans = cursor.fetchall()
        return jsonify(plans), 200
    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Fetch clients for a specific trainer
@app.route('/trainers/<int:trainer_id>/clients', methods=['GET'])
def get_trainer_clients(trainer_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Fetch clients assigned to the trainer
            cursor.execute("""
                SELECT u.user_id, u.name, u.role, 
                       wp.plan_id, wp.plan_name, wp.description, wp.start_date, wp.end_date
                FROM UserTrainer ut
                JOIN User u ON ut.user_id = u.user_id
                LEFT JOIN WorkoutPlan wp ON wp.user_id = u.user_id AND wp.trainer_id = %s
                WHERE ut.trainer_id = %s
            """, (trainer_id, trainer_id))
            clients = cursor.fetchall()

            # Fetch each client's workouts
            for client in clients:
                cursor.execute("SELECT * FROM Workout WHERE user_id = %s", (client['user_id'],))
                client['workouts'] = cursor.fetchall()

        return jsonify(clients), 200
    except pymysql.MySQLError as e:
        print(f"Database error occurred when fetching clients for trainer {trainer_id}: {e}")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"Unexpected error occurred when fetching clients for trainer {trainer_id}: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500
    finally:
        if 'connection' in locals():
            connection.close()


# Endpoint to add or update a workout plan for a specific user
@app.route('/trainers/<int:trainer_id>/clients/<int:user_id>/workout-plan', methods=['POST'])
def add_or_update_workout_plan(trainer_id, user_id):
    data = request.get_json()
    plan_name = data.get('plan_name')
    description = data.get('description')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if the workout plan already exists for the user
            cursor.execute("SELECT * FROM WorkoutPlan WHERE user_id = %s AND trainer_id = %s", (user_id, trainer_id))
            existing_plan = cursor.fetchone()

            if existing_plan:
                # Update the existing workout plan
                cursor.execute("""
                    UPDATE WorkoutPlan
                    SET plan_name = %s, description = %s, start_date = %s, end_date = %s
                    WHERE user_id = %s AND trainer_id = %s
                """, (plan_name, description, start_date, end_date, user_id, trainer_id))
            else:
                # Insert a new workout plan
                cursor.execute("""
                    INSERT INTO WorkoutPlan (user_id, trainer_id, plan_name, description, start_date, end_date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (user_id, trainer_id, plan_name, description, start_date, end_date))

            connection.commit()
        return jsonify({"message": "Workout plan saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'connection' in locals():
            connection.close()

@app.route('/users/<int:user_id>/goals/<int:goal_id>', methods=['DELETE'])
def delete_user_goal(user_id, goal_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "DELETE FROM Goal WHERE user_id = %s AND goal_id = %s"
            cursor.execute(sql, (user_id, goal_id))
            connection.commit()
        return jsonify({"message": "Goal deleted successfully"}), 200
    except pymysql.MySQLError as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)

