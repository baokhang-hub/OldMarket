<?php
header("Content-Type: application/json");
session_start();

$email = $_POST["email"] ?? '';
$password = $_POST["password"] ?? '';

$conn = new mysqli("localhost", "root", "", "web_project");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM admins WHERE email = ? AND password = ?");
$hashedPassword = md5($password);
$stmt->bind_param("ss", $email, $hashedPassword);
$stmt->execute();
$result = $stmt->get_result();
$admin = $result->fetch_assoc();

if ($admin) {
    $_SESSION['admin'] = $email;
    echo json_encode(["success" => true]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid admin credentials"]);
}

$conn->close();
