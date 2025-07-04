        // Sample product data with more fields
        const products = [
            {
                id: 1,
                img: "../img/f1.jpg",
                brand: "Name Brand",
                name: "Vintage Denim Jacket",
                price: 35,
                stars: 5,
                desc: "Classic denim jacket, gently used, size M.",
                inStock: true,
                isNew: true
            },
            {
                id: 2,
                img: "../index/img/products/f1.jpg",
                brand: "Vintage",
                name: "Retro Floral Dress",
                price: 22,
                stars: 4,
                desc: "Beautiful floral dress, perfect for summer.",
                inStock: true,
                isNew: false
            },
            {
                id: 3,
                img: "../index/img/products/f3.jpg",
                brand: "Classic",
                name: "Woolen Sweater",
                price: 18,
                stars: 4,
                desc: "Warm and cozy woolen sweater, size L.",
                inStock: false,
                isNew: false
            },
            {
                id: 4,
                img: "../index/img/products/f4.jpg",
                brand: "Name Brand",
                name: "Leather Boots",
                price: 55,
                stars: 5,
                desc: "High-quality leather boots, barely worn.",
                inStock: true,
                isNew: true
            },
            {
                id: 5,
                img: "../index/img/products/f5.jpg",
                brand: "Vintage",
                name: "Corduroy Pants",
                price: 28,
                stars: 3,
                desc: "Trendy corduroy pants, size S.",
                inStock: true,
                isNew: false
            },
            {
                id: 6,
                img: "../index/img/products/f6.jpg",
                brand: "Classic",
                name: "Plaid Shirt",
                price: 15,
                stars: 4,
                desc: "Comfortable plaid shirt, size M.",
                inStock: true,
                isNew: false
            },
            {
                id: 7,
                img: "../index/img/products/f7.jpg",
                brand: "Name Brand",
                name: "Graphic Tee",
                price: 12,
                stars: 3,
                desc: "Cool graphic tee, size L.",
                inStock: false,
                isNew: false
            },
            {
                id: 8,
                img: "../index/img/products/f8.jpg",
                brand: "Vintage",
                name: "Suede Skirt",
                price: 40,
                stars: 5,
                desc: "Chic suede skirt, size M.",
                inStock: true,
                isNew: true
            },
            {
                id: 9,
                img: "../index/img/products/f9.jpg",
                brand: "Classic",
                name: "Classic Trench Coat",
                price: 65,
                stars: 5,
                desc: "Elegant trench coat, timeless style.",
                inStock: true,
                isNew: true
            },
            {
                id: 10,
                img: "../index/img/products/f10.jpg",
                brand: "Name Brand",
                name: "Casual Hoodie",
                price: 25,
                stars: 4,
                desc: "Soft and comfy hoodie, size XL.",
                inStock: true,
                isNew: false
            }
        ];

        // Wishlist and Cart (demo, localStorage can be used for persistence)
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Pagination
        const PRODUCTS_PER_PAGE = 6;
        let currentPage = 1;
        let filteredProducts = [...products];
        let sortedProducts = [...products];

        function renderProducts(list) {
            const container = document.getElementById('productContainer');
            container.innerHTML = '';
            if (list.length === 0) {
                container.innerHTML = '<p style="text-align:center;width:100%;">No products found.</p>';
                document.getElementById('pagination').innerHTML = '';
                return;
            }
            // Pagination
            const totalPages = Math.ceil(list.length / PRODUCTS_PER_PAGE);
            if (currentPage > totalPages) currentPage = 1;
            const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
            const end = start + PRODUCTS_PER_PAGE;
            const pageProducts = list.slice(start, end);

            pageProducts.forEach(product => {
                container.innerHTML += `
                <div class="pro" data-brand="${product.brand}" data-price="${product.price}" tabindex="0" aria-label="${product.name}" onkeydown="handleProductKeydown(event, ${product.id})">
                    ${product.isNew ? `<span class="badge">NEW</span>` : ""}
                    ${!product.inStock ? `<span class="badge" style="background:#e74c3c;color:#fff;left:auto;right:10px;">OUT</span>` : ""}
                    <img src="${product.img}" alt="product">
                    <div class="des">
                        <span>${product.brand}</span>
                        <h5>${product.name}</h5>
                        <div class="star">
                            ${'<i class="fas fa-star"></i>'.repeat(product.stars)}
                            ${product.stars < 5 ? '<i class="far fa-star"></i>'.repeat(5-product.stars) : ''}
                        </div>
                        <h4>$${product.price}</h4>
                    </div>
                    <button class="wishlist-btn${wishlist.includes(product.id) ? ' active' : ''}" title="Add to Wishlist" aria-pressed="${wishlist.includes(product.id)}" onclick="toggleWishlist(${product.id}, event)">
                        <i class="fa${wishlist.includes(product.id) ? 's' : 'r'} fa-heart"></i>
                    </button>
                    <button class="cart" title="Add to Cart" onclick="addToCart(${product.id}, event)" ${!product.inStock ? 'disabled style="background:#ccc;cursor:not-allowed;"' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="quick-view-btn" onclick="openModal(${product.id})">Quick View</button>
                </div>
                `;
            });
            renderPagination(list.length, totalPages);
            addProductHoverPreview();
        }

        function renderPagination(total, totalPages) {
            const pag = document.getElementById('pagination');
            if (totalPages <= 1) {
                pag.innerHTML = '';
                return;
            }
            let html = '';

            // Previous button
            html += `<button ${currentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="goToPage(${currentPage - 1})" aria-label="Previous page">&laquo; Prev</button>`;

            // Page numbers (show max 5, with ... if needed)
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);

            if (start > 1) {
                html += `<button onclick="goToPage(1)">1</button>`;
                if (start > 2) html += `<span style="padding:0 6px;">...</span>`;
            }
            for (let i = start; i <= end; i++) {
                html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})" aria-label="Page ${i}">${i}</button>`;
            }
            if (end < totalPages) {
                if (end < totalPages - 1) html += `<span style="padding:0 6px;">...</span>`;
                html += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
            }

            // Next button
            html += `<button ${currentPage === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="goToPage(${currentPage + 1})" aria-label="Next page">Next &raquo;</button>`;

            pag.innerHTML = html;
        }

        function goToPage(page) {
            const container = document.getElementById('productContainer');
            const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
            if (page < 1 || page > totalPages) return;
            currentPage = page;
            renderProducts(sortedProducts);
            // Scroll to product list on page change (optional UX)
            if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Search functionality
        function searchProducts() {
            currentPage = 1;
            filterProducts();
        }

        // Filter functionality
        function filterProducts() {
            const brand = document.getElementById('brandFilter').value;
            const price = document.getElementById('priceFilter').value;
            const inStock = document.getElementById('inStockFilter').checked;
            const query = document.getElementById('searchInput').value.toLowerCase();

            filteredProducts = products.filter(p => {
                let ok = true;
                if (brand && p.brand !== brand) ok = false;
                if (price === 'low' && p.price >= 20) ok = false;
                if (price === 'mid' && (p.price < 20 || p.price > 50)) ok = false;
                if (price === 'high' && p.price <= 50) ok = false;
                if (inStock && !p.inStock) ok = false;
                if (query && !(p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query))) ok = false;
                return ok;
            });
            sortedProducts = [...filteredProducts];
            sortProducts();
        }

        // Sort functionality
        function sortProducts() {
            const sort = document.getElementById('sortSelect').value;
            if (sort === "price-asc") {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (sort === "price-desc") {
                sortedProducts.sort((a, b) => b.price - a.price);
            } else if (sort === "star-desc") {
                sortedProducts.sort((a, b) => b.stars - a.stars);
            } else if (sort === "star-asc") {
                sortedProducts.sort((a, b) => a.stars - b.stars);
            } else if (sort === "name-asc") {
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sort === "name-desc") {
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            }
            renderProducts(sortedProducts);
        }

        // Quick View Modal
        function openModal(id) {
            const product = products.find(p => p.id === id);
            if (!product) return;
            document.getElementById('modalContent').innerHTML = `
                <span class="close-modal" onclick="closeModal()" tabindex="0" aria-label="Close">&times;</span>
                <img src="${product.img}" alt="${product.name}" style="width:100%;border-radius:6px;">
                <h3 style="margin:15px 0 5px 0;">${product.name}</h3>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p>${product.desc}</p>
                <div class="star" style="margin-bottom:8px;">
                    ${'<i class="fas fa-star"></i>'.repeat(product.stars)}
                    ${product.stars < 5 ? '<i class="far fa-star"></i>'.repeat(5-product.stars) : ''}
                </div>
                <h4 style="margin-bottom:10px;">$${product.price}</h4>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, event)" ${!product.inStock ? 'disabled style="background:#ccc;cursor:not-allowed;"' : ''}><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                <button class="modal-wishlist-btn${wishlist.includes(product.id) ? ' active' : ''}" onclick="toggleWishlist(${product.id}, event)">
                    <i class="fa${wishlist.includes(product.id) ? 's' : 'r'} fa-heart"></i> Wishlist
                </button>
                ${!product.inStock ? '<p style="color:#e74c3c;margin-top:10px;">Out of Stock</p>' : ''}
            `;
            document.getElementById('quickViewModal').style.display = 'flex';
            // Focus for accessibility
            setTimeout(() => {
                document.getElementById('modalContent').querySelector('.close-modal').focus();
            }, 100);
            // Close modal on ESC
            document.addEventListener('keydown', escModalHandler);
        }
        function closeModal() {
            document.getElementById('quickViewModal').style.display = 'none';
            document.removeEventListener('keydown', escModalHandler);
        }
        function escModalHandler(e) {
            if (e.key === 'Escape') closeModal();
        }

        // Add to Cart (save to localStorage and redirect)
        function addToCart(id, e) {
            if (e && e.stopPropagation) e.stopPropagation();
            const product = products.find(p => p.id === id);
            if (!product || !product.inStock) {
                showToast('Sorry, this product is out of stock.', 'error');
                return;
            }
            // Check if product already in cart, if not add with quantity 1
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    img: product.img,
                    quantity: 1
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            showToast('Added to cart', 'success');
            // Offer to go to cart or continue shopping
            showActionToast('Added to cart', [
                { text: 'Go to Cart', action: () => window.location.href = "cart.html" },
                { text: 'Continue Shopping', action: () => hideActionToast() }
            ]);
        }

        // Wishlist
        function toggleWishlist(id, e) {
            if (e && e.stopPropagation) e.stopPropagation();
            if (wishlist.includes(id)) {
                wishlist = wishlist.filter(pid => pid !== id);
                showToast('Removed from wishlist', 'info');
            } else {
                wishlist.push(id);
                showToast('Added to wishlist', 'success');
            }
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            renderProducts(sortedProducts);
            // Update modal button if open
            if (document.getElementById('quickViewModal').style.display === 'flex') {
                openModal(id);
            }
        }

        // Toast notification
        function showToast(msg, type = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.className = 'toast show';
            if (type === 'success') toast.style.background = '#27ae60';
            else if (type === 'error') toast.style.background = '#e74c3c';
            else toast.style.background = '#222';
            setTimeout(() => toast.classList.remove('show'), 2000);
        }

        // Action Toast (with buttons)
        function showActionToast(msg, actions) {
            let toast = document.getElementById('action-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'action-toast';
                toast.className = 'toast';
                toast.style.bottom = '70px';
                document.body.appendChild(toast);
            }
            toast.innerHTML = `<span>${msg}</span> ` + actions.map((a, i) =>
                `<button style="margin-left:10px;padding:6px 14px;border-radius:4px;border:none;cursor:pointer;background:#f7b731;color:#222;" onclick="window._actionToastActions[${i}]()">${a.text}</button>`
            ).join('');
            window._actionToastActions = actions.map(a => a.action);
            toast.classList.add('show');
            setTimeout(() => hideActionToast(), 4000);
        }
        function hideActionToast() {
            const toast = document.getElementById('action-toast');
            if (toast) toast.classList.remove('show');
        }

        // Hover preview (tooltip)
        function addProductHoverPreview() {
            const proEls = document.querySelectorAll('.pro');
            proEls.forEach(el => {
                el.addEventListener('mouseenter', function () {
                    const id = getProductIdFromEl(el);
                    if (!id) return;
                    showProductTooltip(el, id);
                });
                el.addEventListener('mouseleave', function () {
                    hideProductTooltip();
                });
            });
        }
        function getProductIdFromEl(el) {
            const name = el.querySelector('h5')?.textContent;
            const prod = products.find(p => p.name === name);
            return prod ? prod.id : null;
        }
        function showProductTooltip(el, id) {
            let tooltip = document.getElementById('product-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'product-tooltip';
                tooltip.style.position = 'absolute';
                tooltip.style.zIndex = 9999;
                tooltip.style.background = '#fff';
                tooltip.style.border = '1px solid #ccc';
                tooltip.style.borderRadius = '8px';
                tooltip.style.boxShadow = '0 2px 12px rgba(0,0,0,0.13)';
                tooltip.style.padding = '12px 18px';
                tooltip.style.fontSize = '15px';
                tooltip.style.pointerEvents = 'none';
                document.body.appendChild(tooltip);
            }
            const prod = products.find(p => p.id === id);
            if (!prod) return;
            tooltip.innerHTML = `
                <strong>${prod.name}</strong><br>
                <span>${prod.brand}</span><br>
                <span>${prod.desc}</span><br>
                <span>Price: $${prod.price}</span>
            `;
            const rect = el.getBoundingClientRect();
            tooltip.style.top = (window.scrollY + rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (window.scrollX + rect.left + 10) + 'px';
            tooltip.style.display = 'block';
        }
        function hideProductTooltip() {
            const tooltip = document.getElementById('product-tooltip');
            if (tooltip) tooltip.style.display = 'none';
        }

        // Keyboard accessibility for product cards
        function handleProductKeydown(e, id) {
            if (e.key === 'Enter' || e.key === ' ') {
                openModal(id);
            }
        }

        // Initial render
        filterProducts();

        // Optional: Enter key triggers search
        document.getElementById('searchInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') searchProducts();
        });

        // Expose for inline handlers
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.addToCart = addToCart;
        window.toggleWishlist = toggleWishlist;
        window.goToPage = goToPage;
        window.searchProducts = searchProducts;
        window.filterProducts = filterProducts;
        window.sortProducts = sortProducts;
        window.handleProductKeydown = handleProductKeydown;
        window.hideActionToast = hideActionToast;