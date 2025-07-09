<?php
header('Content-Type: application/json');

// Nhận dữ liệu từ JS (POST dạng JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Lấy dữ liệu
$fullname = trim($data["fullname"] ?? '');
$email = strtolower(trim($data["email"] ?? ''));
$password = $data["password"] ?? '';
$confirmPassword = $data["confirm-password"] ?? '';

// Kiểm tra đầu vào
if (!$fullname || !$email || !$password || !$confirmPassword) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Vui lòng điền đầy đủ thông tin."]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email không hợp lệ."]);
    exit();
}

if ($password !== $confirmPassword) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Mật khẩu không trùng khớp."]);
    exit();
}

// Kết nối MySQL
$conn = new mysqli("localhost", "root", "", "web_project");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Kết nối cơ sở dữ liệu thất bại."]);
    exit();
}

// Kiểm tra email đã tồn tại chưa
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["status" => "error", "message" => "Email đã tồn tại."]);
    exit();
}
$stmt->close();

// Mã hóa mật khẩu và lưu
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $fullname, $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Đăng ký thành công!"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Không thể lưu người dùng."]);
}

$stmt->close();
$conn->close();
?>
