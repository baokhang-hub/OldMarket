<?php
session_start(); // Thêm dòng này để sử dụng session

header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? '';
$password = $data["password"] ?? '';

$conn = new mysqli("localhost", "root", "", "web_project");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Tìm user theo email
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id']; // ✅ Lưu user_id vào session

    echo json_encode([
        "status" => "success",
        "fullname" => $user['fullname']
    ]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Incorrect email or password"]);
}

$conn->close();
?>
