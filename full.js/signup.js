document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirm-password").value;

        // Kiểm tra đơn giản
        if (!fullname || !email || !password || !confirm) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        if (password !== confirm) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        // 🧪 Dữ liệu người dùng lưu localStorage để test
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            showMessage("Email is already registered.", "error");
            return;
        }

        // Thêm người dùng mới
        const newUser = { fullname, email, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        showMessage("Registration successful!", "success");

        setTimeout(() => {
            window.location.href = "signin.html";
        }, 2000);

        // ❌ Bỏ phần gửi qua PHP, bật lại khi dùng thật:
        /*
        try {
            const response = await fetch("php/signup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullname: fullname,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.status === "success") {
                showMessage(data.message, "success");
                setTimeout(() => {
                    window.location.href = "signin.html";
                }, 2000);
            } else {
                showMessage(data.message || "Registration failed", "error");
            }
        } catch (err) {
            console.error("Error:", err);
            showMessage("Error connecting to server.", "error");
        }
        */
    });

    function showMessage(message, type = "success") {
        const msg = document.getElementById("message");
        if (!msg) return;

        msg.className = ""; // reset class
        msg.classList.add(type);
        msg.innerText = message;
        msg.style.display = "block";
        msg.style.animation = "slideDownFade 0.4s ease forwards";
        setTimeout(() => {
            msg.style.display = "none";
        }, 3000);
    }
});
