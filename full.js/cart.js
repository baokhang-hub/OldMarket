    // --- Cart Logic ---
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartContainer = document.getElementById('cart-container');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-button');

    function renderCart() {
        cartContainer.innerHTML = '';
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="color:#888;">Your cart is empty.</p>';
            totalPriceEl.textContent = '';
            checkoutBtn.disabled = true;
            return;
        }
        let total = 0;
        cart.forEach((item, idx) => {
            const quantity = item.quantity || item.qty || 1;
            const title = item.title || item.name || 'Sản phẩm';
            const price = item.price || 0;
            const img = item.img || item.imgSrc || 'img/default.jpg';

            total += price * quantity;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${img}" alt="${title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${title}</div>
                    <div class="cart-item-price">${price.toLocaleString()}₫</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-idx="${idx}" data-action="dec">-</button>
                    <span>${quantity}</span>
                    <button class="qty-btn" data-idx="${idx}" data-action="inc">+</button>
                </div>
                <button class="remove-btn" data-idx="${idx}"><i class="fa fa-trash"></i></button>
            `;
            cartContainer.appendChild(div);
        });

        totalPriceEl.textContent = 'Total: ' + total.toLocaleString() + '₫';
        checkoutBtn.disabled = false;
    }

    cartContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-btn')) {
            const idx = +e.target.dataset.idx;
            const action = e.target.dataset.action;
            if (action === 'inc') cart[idx].quantity++;
            if (action === 'dec' && cart[idx].quantity > 1) cart[idx].quantity--;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
        if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
            const btn = e.target.closest('.remove-btn');
            const idx = +btn.dataset.idx;
            cart.splice(idx, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    });

    // --- Checkout Modal Logic ---
    const paymentModal = document.getElementById('payment-modal');
    const successModal = document.getElementById('success-modal');
    checkoutBtn.onclick = () => paymentModal.style.display = 'flex';
    document.getElementById('close-modal-btn').onclick = () => paymentModal.style.display = 'none';

    document.getElementById('bank-transfer-btn').onclick = () => {
        paymentModal.style.display = 'none';
        setTimeout(() => {
            alert('Thông tin chuyển khoản:\nNgân hàng: ABC Bank\nSố tài khoản: 123456789\nChủ tài khoản: Old Market');
            showSuccess();
        }, 200);
    };
    document.getElementById('cash-payment-btn').onclick = () => {
        paymentModal.style.display = 'none';
        showSuccess();
    };
    function showSuccess() {
        successModal.style.display = 'flex';
        cart = [];
        localStorage.setItem('cart', '[]');
        renderCart();
    }
    document.getElementById('success-close-btn').onclick = () => successModal.style.display = 'none';

    // Close modal on outside click
    window.onclick = function(event) {
        if (event.target === paymentModal) paymentModal.style.display = 'none';
        if (event.target === successModal) successModal.style.display = 'none';
    };

    // --- Navbar Cart Count Sync ---
    function updateCartCount() {
        let count = cart.reduce((sum, item) => sum + item.qty, 0);
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

    // Listen for cart changes from other tabs/pages
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            cart = JSON.parse(localStorage.getItem('cart') || '[]');
            renderCart();
            updateCartCount();
        }
    });

    // --- User Auth UI (Sign in/Logout) ---
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

    