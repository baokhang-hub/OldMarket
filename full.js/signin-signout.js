 document.addEventListener("DOMContentLoaded", function () {
    // ============================== 🔐 XỬ LÝ TRẠNG THÁI ĐĂNG NHẬP ==============================
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};

    // Các phần tử giao diện
    const signinLink = document.getElementById("signin-link");         // Liên kết "Sign in"
    const profileLink = document.getElementById("profile-link");       // Biểu tượng người dùng
    const dropdownMenu = document.getElementById("user-dropdown");     // Menu xổ xuống của người dùng
    const signoutLink = document.getElementById("signout-link");       // Liên kết "Sign out"
    const fullnameBox = document.getElementById("user-fullname");      // Tuỳ chọn: nơi hiển thị tên riêng nếu có

    // ============================== 👤 GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP ==============================
    if (isLoggedIn) {
        // Ẩn nút Sign in
        if (signinLink) signinLink.style.display = "none";

        // Hiện icon người dùng + tên đăng nhập (fullname)
        if (profileLink) {
            profileLink.style.display = "inline-block";
            profileLink.innerHTML = `<i class="fa-solid fa-user"></i> ${user.fullname || ""}`;
        }

        // (Tùy chọn) Hiện fullname ở nơi khác nếu cần
        if (fullnameBox) fullnameBox.textContent = user.fullname || "";
    } 
    // ============================== 🙅‍♂️ GIAO DIỆN KHI CHƯA ĐĂNG NHẬP ==============================
    else {
        if (signinLink) signinLink.style.display = "inline-block";
        if (profileLink) profileLink.style.display = "none";
    }

    // ============================== 📂 HIỆN / ẨN DROPDOWN MENU ==============================
    if (profileLink && dropdownMenu) {
        profileLink.addEventListener("click", function (e) {
            e.preventDefault();
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });

        // Click ra ngoài thì ẩn dropdown
        document.addEventListener("click", function (e) {
            if (!profileLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    }

    // ============================== 🔓 XỬ LÝ SIGN OUT ==============================
    if (signoutLink) {
        signoutLink.addEventListener("click", function (e) {
            e.preventDefault();

            // Xoá trạng thái đăng nhập
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("loggedInUser");

            // Cập nhật lại giao diện
            if (signinLink) signinLink.style.display = "inline-block";
            if (profileLink) profileLink.style.display = "none";
            if (dropdownMenu) dropdownMenu.style.display = "none";

            // Reload lại trang để trở về trạng thái ban đầu (home + signin hiển thị)
            location.href = "index.html";
        });
    }
});
