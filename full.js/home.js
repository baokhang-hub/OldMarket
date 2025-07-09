document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    const signinLink = document.getElementById("signin-link");
    const signupBtn = document.getElementById("signup-btn");
    const profileLink = document.getElementById("profile-link");
    const dropdownMenu = document.getElementById("user-dropdown");
    const signoutLink = document.getElementById("signout-link");

    // Hiển thị/ẩn Sign In và User Icon + Fullname
    if (isLoggedIn) {
        if (signinLink) signinLink.style.display = "none";
        if (profileLink) {
            profileLink.style.display = "inline-block";
            profileLink.innerHTML = `<i class="fa-solid fa-user"></i> ${user.fullname || ""}`;
        }
    } else {
        if (signinLink) signinLink.style.display = "inline-block";
        if (profileLink) profileLink.style.display = "none";
    }

    // Điều hướng nút Sign Up
    if (signupBtn) {
        signupBtn.addEventListener("click", function () {
            window.location.href = "signup.html";
        });
    }

    // Toggle dropdown menu
    if (profileLink && dropdownMenu) {
        profileLink.addEventListener("click", function (e) {
            e.preventDefault();
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", function (e) {
            if (!profileLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    }

    // Xử lý Sign Out
    if (signoutLink) {
        signoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("loggedInUser");

            if (signinLink) signinLink.style.display = "inline-block";
            if (profileLink) profileLink.style.display = "none";
            if (dropdownMenu) dropdownMenu.style.display = "none";

            // Chuyển về index.html sau khi đăng xuất
            window.location.href = "index.html";
        });
    }

    // Thêm vào giỏ hàng
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();

            if (!isLoggedIn) {
                alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ.");
                localStorage.setItem("redirectAfterLogin", "cart.html");
                window.location.href = "signin.html";
                return;
            }

            const productCard = button.closest(".pro");
            const name = productCard.querySelector(".des h5").innerText;
            const priceText = productCard.querySelector(".des h4").innerText;
            const imgSrc = productCard.querySelector("img").src;
            // Loại bỏ '₫' và dấu '.' phân cách hàng nghìn
            const cleanedPriceString = priceText.replace(/₫/g, '').replace(/\./g, '').trim();
            const price = parseFloat(cleanedPriceString) || 0;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existing = cart.find(item => item.name === name && item.price === price && item.imgSrc === imgSrc);

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, imgSrc, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${name} đã được thêm vào giỏ.`);
            window.location.href = "cart.html";
        });
    });
});
