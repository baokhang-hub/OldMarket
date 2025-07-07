// --- Cart Logic ---
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
const cartContainer = document.getElementById('cart-container');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-button');
const selectAllCheckbox = document.getElementById('select-all');

function renderCart() {
    // 🔒 Lưu trạng thái tích chọn
    const selectedIndexes = new Set(
        Array.from(document.querySelectorAll('.select-item:checked'))
            .map(cb => +cb.dataset.idx)
    );

    cartContainer.innerHTML = '';
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="color:#888;">Your cart is empty.</p>';
        totalPriceEl.textContent = 'Tổng cộng: 0₫';
        checkoutBtn.disabled = true;
        return;
    }

    
    cart.forEach((item, idx) => {
        const quantity = item.quantity || item.qty || 1;
        const title = item.title || item.name || 'Sản phẩm';
        const price = item.price || 0;
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
                <div class="cart-item-title">${title}</div>
                <div class="cart-item-price">${price.toLocaleString()}₫</div> 
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" data-idx="${idx}" data-action="dec">-</button>
                <span>${quantity}</span>
                <button class="qty-btn" data-idx="${idx}" data-action="inc">+</button>
            </div>
            <div class="cart-item-price-col"> 
                ${(price * quantity).toLocaleString()}₫
            </div>
            <button class="remove-btn" data-idx="${idx}"><i class="fa fa-trash"></i></button>
        `;
        cartContainer.appendChild(div);
    });

    updateTotal();
    checkoutBtn.disabled = false;
}

function updateTotal() {
    const checkboxes = document.querySelectorAll('.select-item');
    let total = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) {
            const idx = +cb.dataset.idx;
            const item = cart[idx];
            const quantity = item.quantity || item.qty || 1;
            const price = item.price || 0;
            total += price * quantity;
        }
    });
    totalPriceEl.textContent = `Tổng cộng: ${total.toLocaleString()}₫`;
}

cartContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('qty-btn')) {
    const idx = +e.target.dataset.idx;
    const action = e.target.dataset.action;
    if (action === 'inc') cart[idx].quantity++;
    if (action === 'dec' && cart[idx].quantity > 1) cart[idx].quantity--;

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();

    // ✅ Sau khi render lại thì cập nhật tổng giá nếu sản phẩm đang được chọn
    const checkbox = document.querySelector(`.select-item[data-idx='${idx}']`);
    if (checkbox && checkbox.checked) {
        updateTotal();
    }
}

    if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
        const btn = e.target.closest('.remove-btn');
        const idx = +btn.dataset.idx;
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
});

cartContainer.addEventListener('change', function(e) {
    if (e.target.classList.contains('select-item')) {
        updateTotal();
    }
});

selectAllCheckbox.addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.select-item');
    checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
    updateTotal();
});

// --- Checkout Modal Logic ---
const paymentModal = document.getElementById('payment-modal');
const successModal = document.getElementById('success-modal');
const bankInfo = document.getElementById('bank-info');
const cashForm = document.getElementById('cash-form');

checkoutBtn.onclick = () => {
    const selectedCheckboxes = document.querySelectorAll('.select-item:checked');

    if (selectedCheckboxes.length === 0) {
        alert('Vui lòng chọn sản phẩm để thanh toán.');
        return;
    }

    const selectedIndexes = Array.from(selectedCheckboxes).map(cb => +cb.dataset.idx);
    const selectedItems = selectedIndexes.map(i => cart[i]);
    const remainingItems = cart.filter((_, i) => !selectedIndexes.includes(i));
    sessionStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    sessionStorage.setItem('remainingItems', JSON.stringify(remainingItems));

    bankInfo.style.display = 'none';
    cashForm.style.display = 'none';
    paymentModal.style.display = 'flex';
};

document.getElementById('bank-transfer-btn').onclick = () => {
    bankInfo.style.display = 'block';
    cashForm.style.display = 'none';
};

document.getElementById('cash-payment-btn').onclick = () => {
    bankInfo.style.display = 'none';
    cashForm.style.display = 'block';
};

document.getElementById('confirm-bank').onclick = () => {
    const name = document.getElementById('sender-name').value.trim();
    const bank = document.getElementById('sender-bank').value.trim();
    const phone = document.getElementById('sender-phone').value.trim();
    const confirmed = document.getElementById('confirm-transfer-checkbox').checked;

    if (!name || !bank || !phone) {
        alert('Vui lòng nhập đầy đủ thông tin người chuyển khoản.');
        return;
    }

    if (!confirmed) {
        alert('Vui lòng xác nhận rằng bạn đã chuyển tiền.');
        return;
    }

    paymentModal.style.display = 'none';
    alert(`✅ Cảm ơn ${name}, thông tin chuyển khoản của bạn đã được ghi nhận.\nChúng tôi sẽ xử lý đơn hàng sau khi xác minh.`);
    showSuccess();
};

document.getElementById('confirm-cash').onclick = () => {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name || !phone || !address) {
        alert('Vui lòng nhập đầy đủ thông tin nhận hàng.');
        return;
    }

    paymentModal.style.display = 'none';
    alert(`Cảm ơn ${name}, đơn hàng sẽ được giao đến:\n${address}\nSĐT: ${phone}`);
    showSuccess();
};

document.getElementById('close-modal-btn').onclick = () => paymentModal.style.display = 'none';
document.getElementById('close-payment-modal-x').onclick = () => paymentModal.style.display = 'none';
document.getElementById('success-close-btn').onclick = () => successModal.style.display = 'none';

window.onclick = function(event) {
    if (event.target === paymentModal) paymentModal.style.display = 'none';
    if (event.target === successModal) successModal.style.display = 'none';
};

function showSuccess() {
    successModal.style.display = 'flex';
    cart = cart.filter((_, idx) => {
        const cb = document.querySelector(`.select-item[data-idx='${idx}']`);
        return cb && !cb.checked;
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// --- Navbar Cart Count Sync ---
function updateCartCount() {
    let count = cart.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0);
    let cartLink = document.querySelector('#navbar .active');
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

renderCart();
updateCartCount();

window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
        renderCart();
        updateCartCount();
    }
});

function updateAuthUI() {
    const user = localStorage.getItem('user');
    document.getElementById('signin-link').style.display = user ? 'none' : '';
    document.getElementById('logout-link').style.display = user ? '' : 'none';
}
updateAuthUI();
document.getElementById('logout-link').onclick = function(e) {
    e.preventDefault();
    localStorage.removeItem('user');
    updateAuthUI();
    alert('You have logged out.');
};
