<?php
// Nhận dữ liệu từ JS
$data = json_decode(file_get_contents("php://input"), true);

$fullname = $data["fullname"] ?? '';
$email = $data["email"] ?? '';
$password = $data["password"] ?? '';

// Kết nối MySQL
$conn = new mysqli("localhost", "root", "", "web_project");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Kiểm tra trùng email
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["status" => "error", "message" => "Email already exists"]);
    exit();
}

// Mã hóa mật khẩu và thêm vào DB
$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $fullname, $email, $hashed);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Registration successful"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to save user"]);
}

$conn->close();
?>