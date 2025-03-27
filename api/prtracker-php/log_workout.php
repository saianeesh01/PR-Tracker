<?php
include('includes/db.php');
session_start();

if (!isset($_SESSION['email'])) {
    header('Location: login.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_SESSION['email'];
    $date = $conn->real_escape_string($_POST['date']);
    $type = $conn->real_escape_string($_POST['type']);
    $duration = $conn->real_escape_string($_POST['duration']);

    $query = "INSERT INTO workouts (user_email, workout_date, workout_type, duration_minutes) VALUES ('$email', '$date', '$type', '$duration')";
    if ($conn->query($query) === TRUE) {
        header('Location: dashboard.php');
    } else {
        echo "Error: " . $conn->error;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Log Workout - PRTracker</title>
    <link rel="stylesheet" type="text/css" href="css/styles.css">
</head>
<body>
    <?php include('includes/header.php'); ?>
    <h1>Log a Workout</h1>
    <form method="post" action="">
        <input type="date" name="date" required><br>
        <input type="text" name="type" placeholder="Workout Type" required><br>
        <input type="number" name="duration" placeholder="Duration (minutes)" required><br>
        <button type="submit">Log Workout</button>
    </form>
</body>
</html>