<?php
include('includes/db.php');
session_start();

if (!isset($_SESSION['email'])) {
    header('Location: login.php');
    exit();
}

$email = $_SESSION['email'];
$query = "SELECT * FROM goals WHERE user_email='$email'";
$result = $conn->query($query);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Goals - PRTracker</title>
    <link rel="stylesheet" type="text/css" href="css/styles.css">
</head>
<body>
    <?php include('includes/header.php'); ?>
    <h1>Your Goals</h1>
    <ul>
        <?php while ($row = $result->fetch_assoc()) { ?>
            <li><?php echo $row['description'] . ' - Progress: ' . $row['progress'] . '/' . $row['target']; ?></li>
        <?php } ?>
    </ul>
</body>
</html>