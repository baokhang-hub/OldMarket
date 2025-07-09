<?php
header("Content-Type: application/json");

// Kết nối CSDL
$conn = new mysqli("localhost", "root", "", "web_project");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Kết nối CSDL thất bại: " . $conn->connect_error]);
    exit();
}

//////////////////////////
// 1. CẬP NHẬT TRẠNG THÁI
//////////////////////////
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'update_status') {
    $id = intval($_POST['post_id'] ?? 0);
    $status = $_POST['new_status'] ?? '';

    if ($id <= 0 || !in_array($status, ['approved', 'rejected'])) {
        echo json_encode(["status" => "error", "message" => "Dữ liệu không hợp lệ"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE products SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Cập nhật trạng thái thành công"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Lỗi cập nhật: " . $stmt->error]);
    }
    exit();
}

/////////////////////////////
// 2. LẤY BÀI ĐĂNG CHỜ DUYỆT
/////////////////////////////
$action = $_GET['action'] ?? '';

if ($action === 'get_pending') {
    $sql = "SELECT * FROM products WHERE status = 'pending' ORDER BY created_at DESC";
    $result = $conn->query($sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi truy vấn DB: " . $conn->error]);
        exit();
    }

    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $imageUrl = 'uploads/' . $row['images']; // Đường dẫn tương đối từ thư mục gốc web

        // Nếu ảnh không tồn tại thì bỏ trống
        if (!file_exists("../" . $imageUrl)) {
            $imageUrl = null;
        }

        $posts[] = [
            "id" => $row['id'],
            "user_id" => $row['user_id'],
            "category" => $row['category'],
            "subcategory" => $row['subcategory'],
            "condition" => $row['condition'],
            "price" => $row['price'],
            "quantity" => $row['quantity'],
            "title" => $row['title'],
            "description" => $row['description'],
            "address" => $row['address'],
            "image" => $imageUrl,
            "created_at" => $row['created_at']
        ];
    }

    echo json_encode(["status" => "success", "data" => $posts]);
    exit();
}

//////////////////
// 3. ACTION SAI
//////////////////
http_response_code(400);
echo json_encode(["status" => "error", "message" => "Action không hợp lệ"]);
exit();
?>
