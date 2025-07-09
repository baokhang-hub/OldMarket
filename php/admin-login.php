<?php
header("Content-Type: application/json");
session_start();

$email = $_POST["email"] ?? '';
$password = $_POST["password"] ?? '';

$conn = new mysqli("localhost", "root", "", "web_project");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi kết nối CSDL"]);
    exit();
}

$stmt = $conn->prepare("SELECT password FROM admins WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Email không tồn tại"]);
    exit();
}

$stmt->bind_result($hashedPassword);
$stmt->fetch();

if (password_verify($password, $hashedPassword)) {
    $_SESSION['admin'] = $email;
    echo json_encode(["success" => true]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Mật khẩu không đúng"]);
}

$stmt->close();
$conn->close();
