
        const products = [
            {
                id: 1,
                img: "img/f1.jpg",
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
                img: "img/f1.jpg",
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
        let wishlist = [];
        // Load cart from localStorage or initialize empty
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
                <div class="pro" data-brand="${product.brand}" data-price="${product.price}">
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
                    <button class="wishlist-btn${wishlist.includes(product.id) ? ' active' : ''}" title="Add to Wishlist" onclick="toggleWishlist(${product.id}, event)">
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
        }

        function renderPagination(total, totalPages) {
            const pag = document.getElementById('pagination');
            if (totalPages <= 1) {
                pag.innerHTML = '';
                return;
            }
            let html = '';
            for (let i = 1; i <= totalPages; i++) {
                html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            pag.innerHTML = html;
        }

        function goToPage(page) {
            currentPage = page;
            renderProducts(sortedProducts);
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
                <span class="close-modal" onclick="closeModal()">&times;</span>
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
        }
        function closeModal() {
            document.getElementById('quickViewModal').style.display = 'none';
        }

        // Add to Cart (save to localStorage and redirect)
        function addToCart(id, e) {
            e && e.stopPropagation && e.stopPropagation();
            const product = products.find(p => p.id === id);
            if (!product || !product.inStock) {
                showToast('Sorry, this product is out of stock.');
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
            // Redirect to cart.html after adding
            window.location.href = "../index/cart.html";
        }

        // Wishlist
        function toggleWishlist(id, e) {
            e && e.stopPropagation && e.stopPropagation();
            if (wishlist.includes(id)) {
                wishlist = wishlist.filter(pid => pid !== id);
                showToast('Removed from wishlist');
            } else {
                wishlist.push(id);
                showToast('Added to wishlist');
            }
            renderProducts(sortedProducts);
            // Update modal button if open
            if (document.getElementById('quickViewModal').style.display === 'flex') {
                openModal(id);
            }
        }

        // Toast notification
        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
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
 