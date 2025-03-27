<?php
// db.php
require '../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$servername = $_ENV['PRTRACKER_HOST'];
$username = $_ENV['PRTRACKER_USER'];
$password = $_ENV['PRTRACKER_PASSWORD'];
$dbname = $_ENV['PRTRACKER_DB_NAME'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>