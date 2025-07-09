<?php
header("Content-Type: application/json");

// Kết nối CSDL
$conn = new mysqli("localhost", "root", "", "web_project");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Kết nối CSDL thất bại: " . $conn->connect_error
    ]);
    exit();
}

// Lấy danh sách sản phẩm đã duyệt
$sql = "SELECT * FROM products WHERE status = 'approved' ORDER BY created_at DESC";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi truy vấn CSDL: " . $conn->error
    ]);
    exit();
}

$products = [];
while ($row = $result->fetch_assoc()) {
    $imagePath = 'uploads/' . $row['images'];

    // Kiểm tra xem ảnh có tồn tại không
    if (!file_exists("../" . $imagePath)) {
        $imagePath = null; // hoặc giữ nguyên, tùy logic bạn muốn
    }

    $products[] = [
        "id" => $row['id'],
        "title" => $row['title'],
        "category" => $row['category'],
        "subcategory" => $row['subcategory'],
        "price" => $row['price'],
        "quantity" => $row['quantity'],
        "description" => $row['description'],
        "address" => $row['address'],
        "image" => $imagePath
    ];
}

echo json_encode([
    "status" => "success",
    "data" => $products
]);
exit();
?>
