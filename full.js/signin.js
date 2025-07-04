document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signin-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email")?.value.trim().toLowerCase();
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        // 🧪 Đăng nhập tạm bằng localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            showMessage(`Welcome back, ${user.fullname}!`, "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            showMessage("Incorrect email or password", "error");
        }

        // ❌ Khi dùng PHP thực, dùng đoạn này thay thế:
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
                localStorage.setItem("loggedInUser", JSON.stringify(result));
                showMessage(`Welcome back, ${result.fullname}!`, "success");

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                showMessage(result.message || "Login failed.", "error");
            }
        } catch (error) {
            console.error(error);
            showMessage("Error connecting to server.", "error");
        }
        */
    });

    function showMessage(message, type = 'error') {
        const msgBox = document.getElementById("message");
        if (!msgBox) return;

        msgBox.className = '';
        msgBox.classList.add(type);
        msgBox.innerText = message;
        msgBox.style.display = 'block';
        msgBox.style.animation = 'slideDownFade 0.4s ease forwards';

        setTimeout(() => {
            msgBox.style.display = 'none';
        }, 3000);
    }
});
