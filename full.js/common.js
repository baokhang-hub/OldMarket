// Hàm này sẽ cập nhật số lượng loại sản phẩm trên biểu tượng giỏ hàng
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let count = cart.length; 
    let cartLink = document.querySelector('#navbar a[href="cart.html"]'); 

    if (cartLink) {
        let icon = cartLink.querySelector('.fa-bag-shopping');
        if (icon) {
            // Xóa bỏ tất cả các badge cũ để đảm bảo chỉ có một
            let existingBadges = cartLink.querySelectorAll('.cart-badge');
            existingBadges.forEach(badge => badge.remove());

            // Tạo badge mới
            let badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = count; // Đặt nội dung là số lượng
            if (count > 0) {
                badge.classList.add('active'); // Thêm class 'active' nếu có sản phẩm
            } else {
                badge.classList.remove('active'); // Xóa class 'active' nếu không có
            }

            // Chèn badge vào cuối thẻ <a> chứa icon
            cartLink.appendChild(badge); 
        }
    }
}

// Gọi hàm cập nhật số lượng khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', updateCartCount);

// Lắng nghe sự kiện storage để cập nhật giỏ hàng khi có thay đ ổi từ tab/cửa sổ khác
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        updateCartCount();
    }
});

// Hàm cập nhật trạng thái đăng nhập/đăng xuất trên navbar (nếu bạn có)
function updateAuthUI() {
    const user = localStorage.getItem('user'); // Giả sử 'user' được lưu khi đăng nhập
    const signinLink = document.getElementById('signin-link');
    const logoutLink = document.getElementById('logout-link');

    if (signinLink) signinLink.style.display = user ? 'none' : '';
    if (logoutLink) logoutLink.style.display = user ? '' : 'none';
}

// Đảm bảo logout-link có id="logout-link" và signin-link có id="signin-link"
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('user'); // Xóa thông tin người dùng
            localStorage.removeItem('isLoggedIn'); // Xóa cờ đăng nhập nếu bạn dùng
            updateAuthUI(); // Cập nhật lại UI
            alert('Bạn đã đăng xuất.');
            // Chuyển hướng về trang chủ hoặc trang đăng nhập
            window.location.href = "index.html"; 
        };  
    }
});
