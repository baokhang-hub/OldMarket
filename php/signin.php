<?php
session_start();
header("Content-Type: application/json");

// Nhận dữ liệu từ fetch dạng JSON
$data = json_decode(file_get_contents("php://input"), true);

// Lấy email và mật khẩu
$email = trim($data["email"] ?? '');
$password = $data["password"] ?? '';

// Kiểm tra đầu vào
if (!$email || !$password) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Vui lòng nhập email và mật khẩu."
    ]);
    exit();
}

// Kết nối MySQL
$conn = new mysqli("localhost", "root", "", "web_project");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Kết nối cơ sở dữ liệu thất bại."
    ]);
    exit();
}

// Tìm người dùng theo email
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Kiểm tra mật khẩu
if ($user && password_verify($password, $user["password"])) {
    $_SESSION["user_id"] = $user["id"];

    echo json_encode([
        "status" => "success",
        "fullname" => $user["fullname"]
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Email hoặc mật khẩu không đúng."
    ]);
}

$stmt->close();
$conn->close();
?>
