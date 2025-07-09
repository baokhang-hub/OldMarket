// --- Cart Logic ---
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
const cartContainer = document.getElementById('cart-container');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-button');
const selectAllCheckbox = document.getElementById('select-all');

function renderCart() {
    // 🔒 Lưu trạng thái tích chọn của các checkbox hiện tại trước khi render lại
    const selectedIndexes = new Set(
        Array.from(document.querySelectorAll('.select-item:checked'))
            .map(cb => parseInt(cb.dataset.idx)) // Chuyển đổi idx sang số
    );

    cartContainer.innerHTML = ''; // Xóa toàn bộ nội dung giỏ hàng hiện tại
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="color:#888;">Giỏ hàng của bạn đang trống.</p>';
        totalPriceEl.textContent = 'Tổng cộng: 0₫';
        checkoutBtn.disabled = true;
        if (selectAllCheckbox) selectAllCheckbox.checked = false; // Bỏ chọn "Chọn tất cả" nếu giỏ hàng trống
        return;
    }

    cart.forEach((item, idx) => {
        // Đảm bảo quantity và price luôn là số khi đọc từ item
        const quantity = parseInt(item.quantity) || 1;
        const title = item.title || item.name || 'Sản phẩm không tên';
        const price = parseFloat(item.price) || 0;
        // --- BẮT ĐẦU CÁC DÒNG DEBUG MỚI TẠI ĐÂY ---
        console.log('DEBUG (Cart.js): Dữ liệu gốc của mục giỏ hàng (item):', item);
        console.log('DEBUG (Cart.js): Giá từ item.price:', item.price, 'Kiểu dữ liệu:', typeof item.price);
        console.log('DEBUG (Cart.js): Giá sau khi parseFloat (biến price):', price, 'Kiểu dữ liệu:', typeof price);
        console.log('DEBUG (Cart.js): Giá sau khi định dạng (toLocaleString):', price.toLocaleString('vi-VN') + '₫');
        // --- KẾT THÚC CÁC DÒNG DEBUG MỚI TẠI ĐÂY ---
        const img = item.img || item.imgSrc || 'img/default.jpg';

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-checkbox-col">
                <input type="checkbox" class="select-item" data-idx="${idx}" ${selectedIndexes.has(idx) ? 'checked' : ''}>
            </div>
            <div class="cart-image-wrapper">
                <img src="${img}" alt="${title}" class="cart-item-img">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${title}</h4>
                <p class="cart-item-price">Đơn giá: ${price.toLocaleString('vi-VN')}₫</p>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" data-action="decrease" data-idx="${idx}">-</button>
                <span>${quantity}</span>
                <button class="qty-btn" data-action="increase" data-idx="${idx}">+</button>
            </div>
            <div class="cart-item-price-col">
                <p class="item-total-price">${((price || 0) * (quantity || 1)).toLocaleString('vi-VN')}₫</p>
            </div>
            <button class="remove-btn" data-idx="${idx}">Xóa</button>
        `;
        cartContainer.appendChild(div);
    });

    // Gắn lại sự kiện cho các nút sau khi render lại DOM
    // Lặp qua các nút mới được tạo
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', updateQuantity);
    });
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeItem);
    });
    document.querySelectorAll('.select-item').forEach(checkbox => {
        checkbox.addEventListener('change', updateCartTotal);
    });

    // Gắn sự kiện cho nút "Chọn tất cả" nếu nó tồn tại
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = (cart.length > 0 && selectedIndexes.size === cart.length); // Cập nhật trạng thái "Chọn tất cả"
        // Quan trọng: Gỡ bỏ event listener cũ trước khi gắn lại để tránh gắn nhiều lần
        selectAllCheckbox.removeEventListener('change', handleSelectAllChange);
        selectAllCheckbox.addEventListener('change', handleSelectAllChange);
    }

    updateCartTotal(); // Cập nhật tổng giá giỏ hàng sau khi render
}

function handleSelectAllChange() {
    document.querySelectorAll('.select-item').forEach(cb => {
        cb.checked = this.checked;
    });
    updateCartTotal();
}

function updateQuantity(e) {
    const action = e.target.dataset.action;
    const idx = parseInt(e.target.dataset.idx);

    // --- DEBUGGING: Kiểm tra giá trị và kiểu dữ liệu ---
    console.log(`Clicked ${action} button for index: ${idx}`);
    console.log(`Current cart array length: ${cart.length}`);

    // === Kiểm tra kỹ trước khi truy cập item ===
    if (idx < 0 || idx >= cart.length || !cart[idx]) {
        console.error(`Error: Item at index ${idx} not found or out of bounds. This indicates a desynchronization between DOM and cart data.`);
        console.log("Current cart state:", JSON.parse(JSON.stringify(cart))); // Deep copy for inspection
        // Thử re-render để đồng bộ lại
        renderCart();
        return; // Thoát nếu không tìm thấy item
    }
    // === END Kiểm tra ===

    console.log(`Current item in cart:`, cart[idx]);
    console.log(`Current quantity (before update): ${cart[idx].quantity}, type: ${typeof cart[idx].quantity}`);


    if (action === 'increase') {
        cart[idx].quantity = (parseInt(cart[idx].quantity) || 0) + 1;
    } else if (action === 'decrease') {
        if ((parseInt(cart[idx].quantity) || 0) > 1) {
            cart[idx].quantity = (parseInt(cart[idx].quantity) || 0) - 1;
        } else {
            if (confirm(`Bạn có muốn xóa sản phẩm "${cart[idx].title || cart[idx].name}" khỏi giỏ hàng?`)) {
                removeItemLogic(idx); // Gọi hàm logic xóa trực tiếp
                return; // Thoát khỏi hàm updateQuantity sau khi xóa
            }
        }
    }

    console.log(`New quantity (after update): ${cart[idx].quantity}, type: ${typeof cart[idx].quantity}`);

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function removeItem(e) {
    const idx = parseInt(e.target.dataset.idx);
    removeItemLogic(idx); // Gọi hàm logic xóa
}

// Hàm logic xóa riêng để tái sử dụng
function removeItemLogic(idxToRemove) {
    console.log(`Attempting to remove item at index: ${idxToRemove}`);
    console.log("Cart before removal:", JSON.parse(JSON.stringify(cart)));

    if (idxToRemove >= 0 && idxToRemove < cart.length) {
        cart.splice(idxToRemove, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
        console.log("Cart after removal:", JSON.parse(JSON.stringify(cart)));
    } else {
        console.error(`Error: Cannot remove item. Index ${idxToRemove} is out of bounds for cart length ${cart.length}.`);
    }
}

function updateCartTotal() {
    let total = 0;
    // Lặp qua tất cả các checkbox select-item được tích chọn
    document.querySelectorAll('.select-item:checked').forEach(checkbox => {
        const idx = parseInt(checkbox.dataset.idx);
        const item = cart[idx]; // Lấy item từ mảng cart dựa trên index
        if (item) { // Đảm bảo item tồn tại
            total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
        }
    });
    totalPriceEl.textContent = `Tổng cộng: ${total.toLocaleString('vi-VN')}₫`;
    checkoutBtn.disabled = total === 0; // Vô hiệu hóa nút thanh toán nếu tổng bằng 0
}

function updateCartCount() {
    let count = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    let cartLink = document.querySelector('#navbar a[href="cart.html"]');
    if (cartLink) {
        let icon = cartLink.querySelector('.fa-bag-shopping');
        if (icon) {
            let badge = icon.nextElementSibling;
            if (!badge || !badge.classList.contains('cart-badge')) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style = 'background:#ff4d4f;color:#fff;border-radius:50%;padding:2px 7px;font-size:0.8em;margin-left:4px;';
                icon.after(badge);
            }
            badge.textContent = count;
            badge.style.display = count ? 'inline-block' : 'none';
        }
    }
}

// Initial calls
renderCart();
updateCartCount();

// Lắng nghe sự kiện storage để cập nhật giỏ hàng khi có thay đổi từ tab/cửa sổ khác
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
        renderCart();
        updateCartCount();
    }
});
// --- Payment Modal Logic ---
// Lấy các phần tử cần thiết từ DOM
const paymentModal = document.getElementById('payment-modal');
const closePaymentModalX = document.getElementById('close-payment-modal-x');
const closeModalBtn = document.getElementById('close-modal-btn');
const bankTransferBtn = document.getElementById('bank-transfer-btn');
const cashPaymentBtn = document.getElementById('cash-payment-btn');
const bankInfo = document.getElementById('bank-info');
const cashForm = document.getElementById('cash-form');
const confirmBankBtn = document.getElementById('confirm-bank');
const confirmCashBtn = document.getElementById('confirm-cash');
const successModal = document.getElementById('success-modal');
const successCloseBtn = document.getElementById('success-close-btn');

// Mở modal khi nhấn nút checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
        paymentModal.style.display = 'block';
    });
}

// Đóng modal thanh toán
function closePaymentModal() {
    paymentModal.style.display = 'none';
    bankInfo.style.display = 'none';
    cashForm.style.display = 'none';
}
if (closePaymentModalX) closePaymentModalX.addEventListener('click', closePaymentModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closePaymentModal);

// Hiển thị form chuyển khoản
if (bankTransferBtn) {
    bankTransferBtn.addEventListener('click', function () {
        bankInfo.style.display = 'block';
        cashForm.style.display = 'none';
    });
}

// Hiển thị form thanh toán khi nhận hàng
if (cashPaymentBtn) {
    cashPaymentBtn.addEventListener('click', function () {
        cashForm.style.display = 'block';
        bankInfo.style.display = 'none';
    });
}

// Xác nhận chuyển khoản
if (confirmBankBtn) {
    confirmBankBtn.addEventListener('click', function () {
        const checkbox = document.getElementById('confirm-transfer-checkbox');
        if (checkbox.checked) {
            paymentModal.style.display = 'none';
            successModal.style.display = 'block';
        } else {
            alert('Vui lòng xác nhận đã chuyển khoản.');
        }
    });
}

// Xác nhận thanh toán tiền mặt
if (confirmCashBtn) {
    confirmCashBtn.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        if (name && phone && address) {
            paymentModal.style.display = 'none';
            successModal.style.display = 'block';
        } else {
            alert('Vui lòng điền đầy đủ thông tin.');
        }
    });
}

// Đóng modal thành công
if (successCloseBtn) {
    successCloseBtn.addEventListener('click', function () {
        successModal.style.display = 'none';
    });
}