<?php
session_start();

// Kiểm tra đăng nhập
if (!isset($_SESSION['user_id'])) {
    echo "Bạn cần đăng nhập để đăng bài.";
    exit();
}

$user_id = $_SESSION['user_id'];

// Kết nối DB
$conn = new mysqli("localhost", "root", "", "web_project");
if ($conn->connect_error) {
    die("Kết nối database thất bại: " . $conn->connect_error);
}

// Nhận dữ liệu
$category = $_POST['category'] ?? '';
$subcategory = $_POST['subcategory'] ?? '';
$condition = $_POST['condition'] ?? '';
$price = $_POST['price'] ?? '';
$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';
$address = $_POST['address'] ?? '';

// Xử lý ảnh
$imageNames = [];
$uploadDir = "uploads/";

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!empty($_FILES['images']['name'][0])) {
    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
        if ($_FILES['images']['error'][$index] === 0) {
            $originalName = basename($_FILES['images']['name'][$index]);
            $uniqueName = uniqid() . '_' . $originalName;
            $targetPath = $uploadDir . $uniqueName;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $imageNames[] = $targetPath;
            }
        }
    }
}

$images = implode(",", $imageNames);

// Lưu vào bảng `pending_posts`
$stmt = $conn->prepare("INSERT INTO pending_posts 
    (user_id, category, subcategory, condition_status, price, title, description, address, images, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");

$stmt->bind_param("isssdssss", $user_id, $category, $subcategory, $condition, $price, $title, $description, $address, $images);

if ($stmt->execute()) {
    echo "<script>alert('Đăng bài thành công, đang chờ duyệt'); window.location.href = 'index.html';</script>";
} else {
    echo "<script>alert('Đăng bài thất bại.'); window.history.back();</script>";
}

$stmt->close();
$conn->close();
?>
