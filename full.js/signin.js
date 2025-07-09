document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signin-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Lấy giá trị từ form
        const email = document.getElementById("email")?.value.trim().toLowerCase();
        const password = document.getElementById("password")?.value;

        // Kiểm tra điền đủ thông tin chưa
        if (!email || !password) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        // Lấy danh sách người dùng từ localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Tìm user có email và password trùng khớp
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Đăng nhập thành công: lưu trạng thái + tên người dùng
            localStorage.setItem("isLoggedIn", "true");

            // ✅ Chỉ lưu fullname để hiện trên giao diện, không lưu email hay password
            localStorage.setItem("loggedInUser", JSON.stringify({ fullname: user.fullname }));

            showMessage(`Welcome back, ${user.fullname}!`, "success");

            // Chuyển về trang chính sau 1 giây
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            // Đăng nhập thất bại
            showMessage("Incorrect email or password.", "error");
        }

        // ❌ Nếu dùng PHP thật sự thì dùng đoạn dưới:
        /*
        try {
            const response = await fetch("php/signin.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.status === "success") {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("loggedInUser", JSON.stringify({ fullname: result.fullname }));

                showMessage(`Welcome back, ${result.fullname}!`, "success");

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            } else {
                showMessage(result.message || "Login failed.", "error");
            }
        } catch (error) {
            console.error(error);
            showMessage("Error connecting to server.", "error");
        }
        */
    });

    // Hiển thị thông báo (dạng đơn giản)
    function showMessage(message, type = 'error') {
        const msgBox = document.getElementById("message");
        if (!msgBox) return;

        msgBox.className = '';
        msgBox.classList.add(type); // class error hoặc success
        msgBox.innerText = message;
        msgBox.style.display = 'block';
        msgBox.style.animation = 'slideDownFade 0.4s ease forwards';

        // Ẩn thông báo sau 3 giây
        setTimeout(() => {
            msgBox.style.display = 'none';
        }, 3000);
    }
});
