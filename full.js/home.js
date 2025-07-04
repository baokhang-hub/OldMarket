document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const signinLink = document.getElementById("signin-link");
    const profileLink = document.getElementById("profile-link");

    if (isLoggedIn === "true") {
        // Ẩn nút Sign in
        if (signinLink) signinLink.style.display = "none";
        // Hiện nút Profile
        if (profileLink) profileLink.style.display = "block";
    } else {
        if (signinLink) signinLink.style.display = "block";
        if (profileLink) profileLink.style.display = "none";
    }
});

// Xử lý nút Sign up (nếu có)
document.addEventListener("DOMContentLoaded", function () {
    const signupBtn = document.getElementById("signup-btn");
    if (signupBtn) {
        signupBtn.addEventListener("click", function () {
            window.location.href = "../index/signup-in/signup.html";
        });
    }
});

// Xử lý thêm sản phẩm vào giỏ
document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();

            const isLoggedIn = localStorage.getItem("isLoggedIn");
            if (isLoggedIn !== "true") {
                alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ.");
                localStorage.setItem("redirectAfterLogin", "cart.html");
                window.location.href = "../index/signup-in/signin.html";
                return;
            }

            const productCard = button.closest(".pro");
            const name = productCard.querySelector(".des h5").innerText;
            const priceText = productCard.querySelector(".des h4").innerText;
            const imgSrc = productCard.querySelector("img").src;
            const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const existing = cart.find(item => item.name === name && item.price === price && item.imgSrc === imgSrc);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, imgSrc, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${name} đã được thêm vào giỏ.`);
            window.location.href = "../index/cart.html";
        });
    });
});
