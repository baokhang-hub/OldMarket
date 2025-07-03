document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const signinLink = document.getElementById("signin-link");
    const profileLink = document.getElementById("profile-link");
    const logoutLink = document.getElementById("logout-link");

    if (isLoggedIn === "true") {
        // Ẩn nút Sign in
        if (signinLink) {
            signinLink.style.display = "none";
        }
        // Hiện nút Profile nếu có
        if (profileLink) {
            profileLink.style.display = "block";
        }
        // Hiện nút Logout nếu có
        if (logoutLink) {
            logoutLink.style.display = "block";
            logoutLink.addEventListener("click", function (e) {
                e.preventDefault();
                // Xóa trạng thái đăng nhập khi logout
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("loggedInUser");
                // Có thể redirect về index hoặc reload
                window.location.reload();
            });
        }
    } else {
        // Hiện nút Sign in
        if (signinLink) {
            signinLink.style.display = "block";
        }
        // Ẩn nút Profile/Logout
        if (profileLink) {
            profileLink.style.display = "none";
        }
        if (logoutLink) {
            logoutLink.style.display = "none";
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            window.location.href = '../index/signup-in/signup.html';
        });
    }
});

// Giả lập trạng thái đăng nhập, bạn có thể thay bằng kiểm tra localStorage/session hoặc cookie thật
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Gắn sự kiện click cho tất cả nút add-to-cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            if (isLoggedIn) {
                // Nếu đã đăng nhập, chuyển thẳng đến cart.html
                window.location.href = "cart.html";
            } else {
                // Nếu chưa đăng nhập, chuyển đến login.html, lưu trang cần chuyển đến sau khi đăng nhập
                localStorage.setItem('redirectAfterLogin', 'cart.html');
                window.location.href = "../index/signup-in/signin.html";
            }
        });
    });

    document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();

            // Kiểm tra đã đăng nhập chưa
            const isLoggedIn = localStorage.getItem("isLoggedIn");
            if (!isLoggedIn) {
                alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ.");
                window.location.href = "../index/signup-in/signin.html";
                return;
            }

            const productCard = button.closest(".pro");
            const name = productCard.querySelector(".des h5").innerText;
            const priceText = productCard.querySelector(".des h4").innerText;
            const imgSrc = productCard.querySelector("img").src;

            const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Kiểm tra nếu sản phẩm đã tồn tại, thì +1 số lượng
            const existingProduct = cart.find(item => item.name === name && item.price === price && item.imgSrc === imgSrc);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ name, price, imgSrc, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${name} đã được thêm vào giỏ.`);
            // Chuyển đến trang giỏ
            window.location.href = "../index/cart.html";
        });
    });
});
