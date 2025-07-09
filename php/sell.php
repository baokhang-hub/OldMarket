<?php
header('Content-Type: application/json');

// Kết nối CSDL
$host = 'localhost';
$dbname = 'web_project';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Lỗi kết nối CSDL']);
    exit;
}

$uploadDir = '../uploads/';
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lấy dữ liệu từ form
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $price = $_POST['price'] ?? '';
    $condition = $_POST['condition'] ?? '';
    $quantity = $_POST['quantity'] ?? 1;
    $category = $_POST['category'] ?? '';
    $subcategory = $_POST['subcategory'] ?? '';
    $address = $_POST['address'] ?? '';

    // Tạm gán user_id (sau này sửa lại từ session)
    $user_id = 1;

    // Xử lý ảnh
    $imagePath = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['image']['tmp_name'];
        $originalName = basename($_FILES['image']['name']);
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $uniqueName = 'img_' . uniqid() . '.' . $ext;
        $targetPath = $uploadDir . $uniqueName;

        if (!move_uploaded_file($tmpName, $targetPath)) {
            echo json_encode(['success' => false, 'message' => 'Không thể lưu ảnh.']);
            exit;
        }

        $imagePath = 'uploads/' . $uniqueName;
    } else {
        echo json_encode(['success' => false, 'message' => 'Vui lòng chọn ảnh.']);
        exit;
    }

    // Lưu vào bảng pending_posts
    $stmt = $conn->prepare("INSERT INTO pending_posts (category, subcategory, condition_status, price, title, description, address, images, quantity, created_at, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)");
    $stmt->bind_param("ssssssssii", $category, $subcategory, $condition, $price, $title, $description, $address, $imagePath, $quantity, $user_id);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Đăng bài thành công! Bài đang chờ admin duyệt.',
            'post' => [
                'title' => $title,
                'description' => $description,
                'price' => $price,
                'condition' => $condition,
                'quantity' => $quantity,
                'category' => $category,
                'subcategory' => $subcategory,
                'address' => $address,
                'image' => $imagePath
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi khi lưu vào CSDL.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Phương thức không hợp lệ.']);
}
?>
