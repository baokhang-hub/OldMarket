document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup-form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
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

        try {
            const response = await fetch("php/sigup.php", {
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
    });

    function showMessage(message, type = "success") {
        const msg = document.getElementById("message");
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
