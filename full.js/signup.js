document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullname = (document.getElementById("fullname")?.value || "").trim();
        const email = (document.getElementById("email")?.value || "").trim();
        const password = (document.getElementById("password")?.value || "").trim();
        const confirmPassword = (document.getElementById("confirm-password")?.value || "").trim();

        // Basic validation
        if (!fullname || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        // Email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        let users = [];
        try {
            users = JSON.parse(localStorage.getItem("users")) || [];
        } catch {
            users = [];
        }

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            alert("Email already registered. Please use a different email or sign in.");
            return;
        }

        const newUser = {
            fullname,
            email,
            password
        };

        users.push(newUser);
        try {
            localStorage.setItem("users", JSON.stringify(users));
        } catch {
            alert("Registration failed due to storage error.");
            return;
        }

        alert("Registration successful! You can now sign in.");
        window.location.href = "signin.html";
    });
});