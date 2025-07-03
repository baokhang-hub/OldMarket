document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signin-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        if (!emailInput || !passwordInput) {
            alert("Form elements not found. Please reload the page.");
            return;
        }

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        let users = [];
        try {
            users = JSON.parse(localStorage.getItem("users")) || [];
        } catch (err) {
            users = [];
        }

        const user = users.find(
            user =>
                user.email &&
                user.email.toLowerCase() === email &&
                user.password === password
        );

        if (user) {
            alert(`Welcome back, ${user.fullname || "User"}!`);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            window.location.href = "../index.html";
        } else {
            alert("Incorrect email or password. Please try again.");
        }
    });
});
