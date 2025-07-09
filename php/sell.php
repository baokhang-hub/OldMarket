<?php
// session_start(); // ← KHÔNG CẦN ĐĂNG NHẬP NỮA
header("Content-Type: application/json");

// Kết nối CSDL
$conn = new mysqli("localhost", "root", "", "");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Kết nối cơ sở dữ liệu thất bại: " . $conn->connect_error
    ]);
    exit();
}

// Kiểm tra chọn database
if (!$conn->select_db("web_project")) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Không thể chọn database: " . $conn->error
    ]);
    exit();
}

// Nhận dữ liệu từ JS (JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Lấy và kiểm tra dữ liệu
$user_id     = 1; // ← GÁN TẠM ID NGƯỜI DÙNG ĐỂ TEST
$category    = $data["category"] ?? "";
$subcategory = $data["subcategory"] ?? "";
$condition   = $data["condition"] ?? "";
$price       = (int)($data["price"] ?? 0);
$quantity    = (int)($data["quantity"] ?? 1);
$title       = trim($data["title"] ?? "");
$description = trim($data["description"] ?? "");
$address     = $data["address"] ?? "";
$imageBase64 = $data["image"] ?? ""; // Lấy ảnh đầu tiên

if (!$category || !$condition || !$price || !$title || !$description || !$address || !$imageBase64) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Vui lòng điền đầy đủ thông tin bắt buộc."
    ]);
    exit();
}

// Giải mã và lưu ảnh
$uploadDir = "../uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$imageName = uniqid("product_") . ".jpg";
$imagePath = $uploadDir . $imageName;
$imageData = explode(",", $imageBase64);

if (count($imageData) === 2) {
    $decodedImage = base64_decode($imageData[1]);
    file_put_contents($imagePath, $decodedImage);
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Ảnh không hợp lệ."
    ]);
    exit();
}

// Thêm sản phẩm vào DB
$stmt = $conn->prepare("INSERT INTO products 
    (user_id, category, subcategory, `condition`, price, quantity, title, description, address, images, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())");

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Prepare statement thất bại: " . $conn->error
    ]);
    exit();
}

if (!$stmt->bind_param("isssiissss", $user_id, $category, $subcategory, $condition, $price, $quantity, $title, $description, $address, $imageName)) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Bind param thất bại: " . $stmt->error
    ]);
    exit();
}

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Execute thất bại: " . $stmt->error
    ]);
    exit();
}

echo json_encode([
    "status" => "success",
    "message" => "Bài đăng đã gửi thành công và đang chờ duyệt."
]);

$stmt->close();
$conn->close();
?>
