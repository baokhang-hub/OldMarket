// shop.js - Modernized, Modular, and More Maintainable

// --- Product Data ---
// Lấy danh sách bài đã duyệt từ localStorage
        const APPROVED_POSTS = JSON.parse(localStorage.getItem('approved_posts')) || [];

        // Chuyển định dạng bài duyệt thành sản phẩm hoàn chỉnh
        const PRODUCTS = APPROVED_POSTS.map((p, index) => ({
        ...p,
        id: 1000 + index, // id tự tạo cao để tránh trùng
        stars: p.stars || 4,
        inStock: true,
        isNew: true,
        auction: { enabled: false },
        segment: "binhdan"
        }));

// --- Utility Functions ---
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const getLocal = (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const setLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// --- Product Segmentation ---
PRODUCTS.forEach(p => {
    if (p.brand === "Name Brand") {
        p.segment = "hieu";
        p.segmentType = p.auction?.enabled ? "auction" : "noauction";
    } else {
        p.segment = "binhdan";
    }
});

// --- Auction State ---
function loadAuctionState() {
    const auctionState = getLocal('auctionState', {});
    PRODUCTS.forEach(p => {
        if (p.auction?.enabled && auctionState[p.id]) Object.assign(p.auction, auctionState[p.id]);
    });
}
function saveAuctionState() {
    const state = {};
    PRODUCTS.forEach(p => {
        if (p.auction?.enabled) {
            state[p.id] = {
                currentBid: p.auction.currentBid,
                endTime: p.auction.endTime,
                bids: p.auction.bids
            };
        }
    });
    setLocal('auctionState', state);
}
loadAuctionState();

// --- Wishlist & Cart State ---
let wishlist = getLocal('wishlist', []);
let cart = getLocal('cart', []);

// --- State ---
const PRODUCTS_PER_PAGE = 6;
let currentPage = 1;
let filteredProducts = [...PRODUCTS];
let sortedProducts = [...PRODUCTS];

// --- Rendering ---
function renderProducts(list) {
    const container = $('#productContainer');
    container.innerHTML = '';
    if (!list.length) {
        container.innerHTML = '<p style="text-align:center;width:100%;">No products found.</p>';
        $('#pagination').innerHTML = '';
        return;
    }
    const totalPages = Math.ceil(list.length / PRODUCTS_PER_PAGE);
    if (currentPage > totalPages) currentPage = 1;
    const pageProducts = list.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

    container.innerHTML = pageProducts.map(product => `
        <div class="pro" data-brand="${product.brand}" data-price="${product.price}" tabindex="0" aria-label="${product.name}" onkeydown="handleProductKeydown(event, ${product.id})">
            ${product.isNew ? `<span class="badge">NEW</span>` : ""}
            ${!product.inStock ? `<span class="badge" style="background:#e74c3c;color:#fff;left:auto;right:10px;">OUT</span>` : ""}
            <img src="${product.img}" alt="product" loading="lazy">
            <div class="des">
                <span>${product.brand}</span>
                <h5>${product.name}</h5>
                <div class="star" aria-label="Rating: ${product.stars} out of 5">
                    ${'<i class="fas fa-star"></i>'.repeat(product.stars)}
                    ${product.stars < 5 ? '<i class="far fa-star"></i>'.repeat(5-product.stars) : ''}
                </div>
                <h4>$${product.price}</h4>
                ${product.auction?.enabled ? `
                    <div style="margin-top:8px;">
                        <span style="color:#f7b731;font-weight:bold;">Auction</span>
                        <br>
                        <span>Current Bid: <b>$${product.auction.currentBid}</b></span>
                        <br>
                        <span id="auction-timer-${product.id}" style="font-size:13px;color:#888;"></span>
                        <br>
                        <button onclick="openAuctionModal(${product.id})" style="margin-top:6px;padding:5px 12px;border-radius:5px;border:1px solid #f7b731;background:#fffbe6;color:#222;cursor:pointer;font-size:14px;">Bid Now</button>
                    </div>
                ` : ''}
            </div>
            <button class="wishlist-btn${wishlist.includes(product.id) ? ' active' : ''}" title="Add to Wishlist" aria-pressed="${wishlist.includes(product.id)}" onclick="toggleWishlist(${product.id}, event)">
                <i class="fa${wishlist.includes(product.id) ? 's' : 'r'} fa-heart"></i>
            </button>
            <button class="cart" title="Add to Cart" onclick="addToCart(${product.id}, event)" ${!product.inStock ? 'disabled style="background:#ccc;cursor:not-allowed;"' : ''} aria-disabled="${!product.inStock}">
                <i class="fas fa-shopping-cart"></i>
            </button>
            <button class="quick-view-btn" onclick="openModal(${product.id})">Quick View</button>
        </div>
    `).join('');
    renderPagination(list.length, totalPages);
    addProductHoverPreview();
    updateAuctionTimers();
}

function renderPagination(total, totalPages) {
    const pag = $('#pagination');
    if (totalPages <= 1) return pag.innerHTML = '';
    let html = `<button ${currentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="goToPage(${currentPage - 1})" aria-label="Previous page">&laquo; Prev</button>`;
    let start = Math.max(1, currentPage - 2), end = Math.min(totalPages, currentPage + 2);
    if (start > 1) {
        html += `<button onclick="goToPage(1)">1</button>`;
        if (start > 2) html += `<span style="padding:0 6px;">...</span>`;
    }
    for (let i = start; i <= end; i++)
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})" aria-label="Page ${i}">${i}</button>`;
    if (end < totalPages) {
        if (end < totalPages - 1) html += `<span style="padding:0 6px;">...</span>`;
        html += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    html += `<button ${currentPage === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="goToPage(${currentPage + 1})" aria-label="Next page">Next &raquo;</button>`;
    pag.innerHTML = html;
}
function goToPage(page) {
    const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderProducts(sortedProducts);
    $('#productContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Filtering & Sorting ---
function filterProducts() {
    const segment = $('#segmentFilter')?.value || "";
    const brand = $('#brandFilter')?.value || "";
    const price = $('#priceFilter')?.value || "";
    const inStock = $('#inStockFilter')?.checked || false;
    const query = $('#searchInput')?.value.toLowerCase() || "";

    filteredProducts = PRODUCTS.filter(p => {
        if (segment === "binhdan" && p.segment !== "binhdan") return false;
        if (segment === "hieu" && p.segment !== "hieu") return false;
        if (segment === "hieu-auction" && !(p.segment === "hieu" && p.segmentType === "auction")) return false;
        if (segment === "hieu-noauction" && !(p.segment === "hieu" && p.segmentType === "noauction")) return false;
        if (brand && p.brand !== brand) return false;
        if (price === 'low' && p.price >= 20) return false;
        if (price === 'mid' && (p.price < 20 || p.price > 50)) return false;
        if (price === 'high' && p.price <= 50) return false;
        if (inStock && !p.inStock) return false;
        if (query && !(p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query))) return false;
        return true;
    });
    sortedProducts = [...filteredProducts];
    sortProducts();
}
function sortProducts() {
    const sort = $('#sortSelect')?.value || "";
    if (sort === "price-asc") sortedProducts.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sortedProducts.sort((a, b) => b.price - a.price);
    else if (sort === "star-desc") sortedProducts.sort((a, b) => b.stars - a.stars);
    else if (sort === "star-asc") sortedProducts.sort((a, b) => a.stars - b.stars);
    else if (sort === "name-asc") sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name-desc") sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    renderProducts(sortedProducts);
}
function searchProducts() {
    currentPage = 1;
    filterProducts();
}

// --- Quick View Modal ---
function openModal(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    $('#modalContent').innerHTML = `
        <span class="close-modal" onclick="closeModal()" tabindex="0" aria-label="Close">&times;</span>
        <img src="${product.img}" alt="${product.name}" style="width:100%;border-radius:6px;">
        <h3 style="margin:15px 0 5px 0;">${product.name}</h3>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <p>${product.desc}</p>
        <div class="star" style="margin-bottom:8px;" aria-label="Rating: ${product.stars} out of 5">
            ${'<i class="fas fa-star"></i>'.repeat(product.stars)}
            ${product.stars < 5 ? '<i class="far fa-star"></i>'.repeat(5-product.stars) : ''}
        </div>
        <h4 style="margin-bottom:10px;">$${product.price}</h4>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id}, event)" ${!product.inStock ? 'disabled style="background:#ccc;cursor:not-allowed;"' : ''} aria-disabled="${!product.inStock}"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
        <button class="modal-wishlist-btn${wishlist.includes(product.id) ? ' active' : ''}" onclick="toggleWishlist(${product.id}, event)">
            <i class="fa${wishlist.includes(product.id) ? 's' : 'r'} fa-heart"></i> Wishlist
        </button>
        ${product.auction?.enabled ? `
            <div style="margin-top:14px;">
                <span style="color:#f7b731;font-weight:bold;">Auction</span>
                <br>
                <span>Current Bid: <b>$${product.auction.currentBid}</b></span>
                <br>
                <span id="auction-modal-timer-${product.id}" style="font-size:13px;color:#888;"></span>
                <br>
                <button onclick="openAuctionModal(${product.id})" style="margin-top:6px;padding:7px 18px;border-radius:5px;border:1px solid #f7b731;background:#fffbe6;color:#222;cursor:pointer;font-size:15px;">Bid Now</button>
            </div>
        ` : ''}
        ${!product.inStock ? '<p style="color:#e74c3c;margin-top:10px;">Out of Stock</p>' : ''}
    `;
    $('#quickViewModal').style.display = 'flex';
    setTimeout(() => $('#modalContent').querySelector('.close-modal').focus(), 100);
    document.addEventListener('keydown', escModalHandler);
    if (product.auction?.enabled) updateAuctionModalTimer(product.id);
}
function closeModal() {
    $('#quickViewModal').style.display = 'none';
    document.removeEventListener('keydown', escModalHandler);
}
function escModalHandler(e) { if (e.key === 'Escape') closeModal(); }

/// Assume PRODUCTS, $, showToast, saveAuctionState, renderProducts are already defined.

// --- Auction Modal ---
function openAuctionModal(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product?.auction?.enabled) {
        showToast('Auction is not enabled for this product.', 'error');
        return;
    }

    if (product.auction.currentBid === 0 && product.price > 0) {
        product.auction.currentBid = product.price;
        saveAuctionState();
    }

    if (product.auction.status === 'ended' || product.auction.status === 'pending' || product.auction.status === 'sold') {
        const winningBid = product.auction.bids?.length ? product.auction.bids.slice().sort((a, b) => b.amount - a.amount)[0] : null;
        const winnerInfo = winningBid ? `Winner: <b>${winningBid.name || 'Anonymous'}</b> with $${winningBid.amount}` : 'No bids placed.';
        $('#auctionModalContent').innerHTML = `
            <span class="close-modal" onclick="closeAuctionModal()" tabindex="0" aria-label="Close">&times;</span>
            <h3>${product.name} - Auction (Ended)</h3>
            <img src="${product.img}" alt="${product.name}" style="width:100%;border-radius:6px;max-height:180px;object-fit:cover;">
            <p style="margin:10px 0 0 0;"><strong>Final Bid:</strong> <span id="auction-current-bid">$${product.auction.currentBid}</span></p>
            <p style="font-size:13px;color:#888;">${winnerInfo}</p>
            <p style="color:#f44336; font-weight:bold;">This auction has concluded.</p>
            <div style="margin-top:10px;">
                <strong>Bid History:</strong>
                ${getBidsHtml(product.auction.bids)}
            </div>
        `;
        $('#auctionModal').style.display = 'flex';
        setTimeout(() => $('#auctionModalContent').querySelector('.close-modal').focus(), 100);
        document.addEventListener('keydown', escAuctionModalHandler);
        return;
    }

    if (product.auction.status === 'inactive' || product.auction.endTime === 0) {
        // Correctly determine the initial bid amount based on product price or 1 if price is 0
        const initialBidAmount = product.price > 0 ? product.price : 1;
        $('#auctionModalContent').innerHTML = `
            <span class="close-modal" onclick="closeAuctionModal()" tabindex="0" aria-label="Close">&times;</span>
            <h3>${product.name} - Auction</h3>
            <img src="${product.img}" alt="${product.name}" style="width:100%;border-radius:6px;max-height:180px;object-fit:cover;">
            <p style="margin:10px 0 0 0;"><strong>Starting Bid:</strong> <span id="auction-current-bid">$${initialBidAmount}</span></p>
            <p style="font-size:13px;color:#888;">Be the first to bid! The auction will start a 24-hour countdown.</p>
            <form id="bidForm" onsubmit="submitBid(event,${product.id})" style="margin-bottom:10px;">
                <input type="text" id="bidderName" placeholder="Your name (optional)" style="padding:7px 10px;border-radius:5px;border:1px solid #bbb;width:60%;margin-bottom:6px;" autocomplete="username">
                <br>
                <input type="number" id="bidAmount" placeholder="Your bid ($)" min="${initialBidAmount}" step="1" style="padding:7px 10px;border-radius:5px;border:1px solid #bbb;width:60%;" required>
                <br>
                <button type="submit" style="margin-top:8px;padding:8px 22px;border-radius:5px;border:none;background:#28a745;color:white;font-size:16px;font-weight:500;cursor:pointer;">Place First Bid</button>
            </form>
            <div style="margin-top:20px;">
                <strong>Bid History:</strong>
                ${getBidsHtml(product.auction.bids)}
            </div>
        `;
        $('#auctionModal').style.display = 'flex';
        setTimeout(() => $('#auctionModalContent').querySelector('.close-modal').focus(), 100);
        document.addEventListener('keydown', escAuctionModalHandler);
        return;
    }

    $('#auctionModalContent').innerHTML = `
        <span class="close-modal" onclick="closeAuctionModal()" tabindex="0" aria-label="Close">&times;</span>
        <h3>${product.name} - Auction</h3>
        <img src="${product.img}" alt="${product.name}" style="width:100%;border-radius:6px;max-height:180px;object-fit:cover;">
        <p style="margin:10px 0 0 0;"><strong>Current Bid:</strong> <span id="auction-current-bid">$${product.auction.currentBid}</span></p>
        <p><span id="auction-modal-timer2-${product.id}" style="font-size:13px;color:#888;"></span></p>
        <form id="bidForm" onsubmit="submitBid(event,${product.id})" style="margin-bottom:10px;">
            <input type="text" id="bidderName" placeholder="Your name (optional)" style="padding:7px 10px;border-radius:5px;border:1px solid #bbb;width:60%;margin-bottom:6px;" autocomplete="username">
            <br>
            <input type="number" id="bidAmount" placeholder="Your bid ($)" min="${product.auction.currentBid + 1}" step="1" style="padding:7px 10px;border-radius:5px;border:1px solid #bbb;width:60%;" required>
            <br>
            <button type="submit" style="margin-top:8px;padding:8px 22px;border-radius:5px;border:none;background:#f7b731;color:#222;font-size:16px;font-weight:500;cursor:pointer;">Place Bid</button>
        </form>
        <div style="margin-top:10px;">
            <strong>Bid History:</strong>
            ${getBidsHtml(product.auction.bids)}
        </div>
    `;
    $('#auctionModal').style.display = 'flex';
    setTimeout(() => $('#auctionModalContent').querySelector('.close-modal').focus(), 100);
    document.addEventListener('keydown', escAuctionModalHandler);
    updateAuctionModalTimer2(product.id);
}

function closeAuctionModal() {
    $('#auctionModal').style.display = 'none';
    document.removeEventListener('keydown', escAuctionModalHandler);
}

function escAuctionModalHandler(e) {
    if (e.key === 'Escape') closeAuctionModal();
}

function getBidsHtml(bids) {
    return (bids?.length) ?
        '<ul style="max-height:120px;overflow-y:auto;padding-left:18px;">' +
        bids.slice().reverse().map(b =>
            `<li><b>${b.name || 'Anonymous'}:</b> $${b.amount} <span style="font-size:12px;color:#888;">(${new Date(b.time).toLocaleString()})</span></li>`
        ).join('') + '</ul>' :
        '<p style="color:#888;">No bids yet.</p>';
}

function submitBid(e, id) {
    e.preventDefault();
    const product = PRODUCTS.find(p => p.id === id);
    if (!product?.auction?.enabled) return;

    if (product.auction.status === 'ended' || product.auction.status === 'pending' || product.auction.status === 'sold') {
        showToast('This auction has already ended.', 'error');
        openAuctionModal(id);
        return;
    }

    const name = $('#bidderName').value.trim();
    const amount = parseFloat($('#bidAmount').value);
    
    const basePrice = product.price > 0 ? product.price : 0;
    const currentBid = product.auction.currentBid > 0 ? product.auction.currentBid : basePrice;
    let minBid;

    // Determine the minimum bid required
    if (product.auction.status === 'inactive') {
        minBid = basePrice > 0 ? basePrice : 1; // First bid can be base price or 1
    } else { 
        minBid = currentBid + 1; // Subsequent bids must be higher than current bid
    }

    if (isNaN(amount) || amount < minBid) {
        return showToast(`Bid must be at least $${minBid}.`, 'error');
    }

    const isFirstBid = product.auction.status === 'inactive';

    if (isFirstBid) {
        product.auction.status = 'active';
        product.auction.endTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
        showToast('Auction started! 24-hour countdown begins.', 'success');
    } else {
        // For subsequent bids, reset the end time to 24 hours from the *current* time
        product.auction.endTime = Date.now() + 24 * 60 * 60 * 1000;
        showToast('Auction time reset! 24 hours added from now.', 'info');
    }

    product.auction.currentBid = amount;
    product.auction.bids = product.auction.bids || [];
    product.auction.bids.push({ name, amount, time: Date.now() });

    saveAuctionState();
    openAuctionModal(id);
    renderProducts(sortedProducts);
}

function updateAuctionTimers() {
    for (const p of PRODUCTS) {
        if (p.auction?.enabled) {
            const el = document.getElementById('auction-timer-' + p.id);
            if (el) {
                const productCard = el.closest('.product-card');

                // Reset all inline styles before applying new ones to avoid stale styles
                if (productCard) {
                    productCard.style.border = '';
                    productCard.style.boxShadow = '';
                    productCard.style.animation = ''; // Ensure animation is cleared
                    productCard.style.backgroundColor = ''; // Clear background too if set
                }

                if (p.auction.status === 'sold') {
                    if (productCard) productCard.style.display = 'none';
                    continue;
                }

                const timeLeft = getAuctionTimeLeft(p.auction.endTime);

                if (p.auction.status === 'inactive' || p.auction.endTime === 0) {
                    // Update text and style for "In Queue"
                    if(productCard) {
                        productCard.style.border = '2px dashed #9E9E9E'; // Grey dashed border
                        productCard.style.boxShadow = '0 0 8px rgba(158, 158, 158, 0.4)'; // Light grey shadow
                        productCard.style.backgroundColor = '#f5f5f5'; // Light grey background
                    }
                    el.textContent = "In Queue"; // Changed text to "In Queue"
                    el.parentElement.style.cursor = 'pointer';
                    el.parentElement.onclick = () => openAuctionModal(p.id);
                    el.style.color = '#757575'; // Darker grey text color
                    el.style.fontWeight = 'bold';
                } else if (p.auction.status === 'active') {
                    if(productCard) {
                        productCard.style.border = '3px solid #f7b731'; // Orange solid border
                        productCard.style.boxShadow = '0 0 15px rgba(247, 183, 49, 0.7)'; // Intense orange shadow
                        productCard.style.backgroundColor = ''; // Ensure no background for active
                    }
                    el.textContent = timeLeft;
                    el.style.color = '';
                    el.style.fontWeight = '';
                    el.parentElement.onclick = () => openAuctionModal(p.id);
                    if (timeLeft === "Auction ended") {
                        p.auction.status = 'pending';
                        saveAuctionState();
                        showToast(`Auction for ${p.name} has ended and is pending processing!`, 'info');
                        renderProducts(sortedProducts);
                    }
                } else if (p.auction.status === 'pending' || p.auction.status === 'ended') {
                    if(productCard) {
                        productCard.style.border = '';
                        productCard.style.boxShadow = '';
                        productCard.style.backgroundColor = ''; // Clear background for ended/pending
                    }
                    el.textContent = p.auction.status === 'pending' ? "Pending Processing" : "Auction Ended";
                    el.style.color = p.auction.status === 'pending' ? '#f7b731' : '#dc3545';
                    el.style.fontWeight = 'bold';
                    el.parentElement.onclick = null;
                }

                const addToCartBtn = productCard?.querySelector('.add-to-cart-btn');
                if (addToCartBtn) {
                    addToCartBtn.disabled = true;
                    addToCartBtn.textContent = "Auction Item";
                    addToCartBtn.style.backgroundColor = '#ccc';
                    addToCartBtn.style.cursor = 'not-allowed';
                }
            }
        }
    }
}

function updateAuctionModalTimer(id) {
    const product = PRODUCTS.find(p => p.id === id);
    const el = document.getElementById('auction-modal-timer-' + id);
    if (product?.auction?.enabled && el) {
        el.textContent = getAuctionTimeLeft(product.auction.endTime);
    }
}

function updateAuctionModalTimer2(id) {
    const product = PRODUCTS.find(p => p.id === id);
    const el = document.getElementById('auction-modal-timer2-' + id);
    if (product?.auction?.enabled && el) {
        el.textContent = getAuctionTimeLeft(product.auction.endTime);
    }
}

function getAuctionTimeLeft(endTime) {
    const now = Date.now();
    if (now >= endTime) return "Auction ended";
    const diff = endTime - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `Time left: ${h}h ${m}m ${s}s`;
}

setInterval(() => {
    updateAuctionTimers();
    const auctionModal = $('#auctionModal');
    if (auctionModal?.style.display === 'flex') {
        const h3 = $('#auctionModalContent').querySelector('h3');
        if (h3) {
            const name = h3.textContent.replace(' - Auction', '').replace(' (Ended)', '');
            const prod = PRODUCTS.find(p => p.name === name);
            if (prod) updateAuctionModalTimer2(prod.id);
        }
    }
    const quickViewModal = $('#quickViewModal');
    if (quickViewModal?.style.display === 'flex') {
        const h3 = $('#modalContent').querySelector('h3');
        if (h3) {
            const name = h3.textContent;
            const prod = PRODUCTS.find(p => p.name === name);
            if (prod) updateAuctionModalTimer(prod.id);
        }
    }
}, 1000);

// --- Cart ---
function addToCart(id, e) {
    if (e?.stopPropagation) e.stopPropagation();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
        showToast('Please sign in to add to cart.', 'error');
        setTimeout(() => window.location.href = "signin.html", 1200);
        return;
    }
    const product = PRODUCTS.find(p => p.id === id);
    if (!product?.inStock) return showToast('Sorry, this product is out of stock.', 'error');
    let cart = getLocal('cart', []);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, quantity: 1 });
    setLocal('cart', cart);
    showToast('Added to cart', 'success');
    showActionToast('Added to cart');
}

// --- Wishlist ---
function toggleWishlist(id, e) {
    if (e?.stopPropagation) e.stopPropagation();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
        showToast('Please sign in to use wishlist.', 'error');
        setTimeout(() => window.location.href = "signin.html", 1200);
        return;
    }
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(pid => pid !== id);
        showToast('Removed from wishlist', 'info');
    } else {
        wishlist.push(id);
        showToast('Added to wishlist', 'success');
    }
    setLocal('wishlist', wishlist);
    renderProducts(sortedProducts);
    if ($('#quickViewModal').style.display === 'flex') openModal(id);
}

// --- Toasts ---
function showToast(msg, type = 'info') {
    const toast = $('#toast');
    toast.textContent = msg;
    toast.className = 'toast show';
    toast.style.background = type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#222';
    setTimeout(() => toast.classList.remove('show'), 2000);
}
function showActionToast(msg, actions) {
    let toast = $('#action-toast');
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
    const toast = $('#action-toast');
    if (toast) toast.classList.remove('show');
}

// --- Hover Preview ---
function addProductHoverPreview() {
    $$('.pro').forEach(el => {
        el.onmouseenter = () => {
            const id = getProductIdFromEl(el);
            if (id) showProductTooltip(el, id);
        };
        el.onmouseleave = hideProductTooltip;
        el.onfocus = () => {
            const id = getProductIdFromEl(el);
            if (id) showProductTooltip(el, id);
        };
        el.onblur = hideProductTooltip;
    });
}
function getProductIdFromEl(el) {
    const name = el.querySelector('h5')?.textContent;
    const prod = PRODUCTS.find(p => p.name === name);
    return prod?.id || null;
}
function showProductTooltip(el, id) {
    let tooltip = $('#product-tooltip');
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
    const prod = PRODUCTS.find(p => p.id === id);
    if (!prod) return;
    tooltip.innerHTML = `
        <strong>${prod.name}</strong><br>
        <span>${prod.brand}</span><br>
        <span>${prod.desc}</span><br>
        <span>Price: $${prod.price}</span>
        ${prod.auction?.enabled ? `<br><span style="color:#f7b731;">Auction: $${prod.auction.currentBid}</span>` : ''}
    `;
    const rect = el.getBoundingClientRect();
    let top = window.scrollY + rect.top - tooltip.offsetHeight - 10;
    if (top < window.scrollY) top = window.scrollY + rect.bottom + 10;
    let left = window.scrollX + rect.left + 10;
    if (left + tooltip.offsetWidth > window.innerWidth) left = window.innerWidth - tooltip.offsetWidth - 10;
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
    tooltip.style.display = 'block';
}
function hideProductTooltip() {
    const tooltip = $('#product-tooltip');
    if (tooltip) tooltip.style.display = 'none';
}

// --- Accessibility ---
function handleProductKeydown(e, id) {
    if (e.key === 'Enter' || e.key === ' ') openModal(id);
}

// --- Initial Render & Events ---
document.addEventListener("DOMContentLoaded", function () {
    filterProducts();
    $('#searchInput')?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') searchProducts();
    });

    // Auth links
    const signinLink = $("#signin-link");
    const logoutLink = $("#logout-link");
    function updateAuthLinks() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedIn) {
            if (signinLink) signinLink.style.display = "none";
            if (logoutLink) logoutLink.style.display = "inline-block";
        } else {
            if (signinLink) signinLink.style.display = "inline-block";
            if (logoutLink) logoutLink.style.display = "none";
        }
    }
    updateAuthLinks();
    if (logoutLink) {
        logoutLink.addEventListener("click", function(e) {
            localStorage.setItem("isLoggedIn", "false");
            updateAuthLinks();
            window.location.href = "../index.html";
        });
    }
});

// --- Expose for inline handlers ---
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
window.openAuctionModal = openAuctionModal;
window.closeAuctionModal = closeAuctionModal;
window.submitBid = submitBid;
