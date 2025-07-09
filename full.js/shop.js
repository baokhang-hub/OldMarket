// shop.js - Modernized, Modular, and More Maintainable

// --- Product Data ---
// Lấy danh sách bài đã duyệt từ localStorage
const APPROVED_POSTS = JSON.parse(localStorage.getItem('approved_posts')) || [];

// Chuyển định dạng bài duyệt thành sản phẩm hoàn chỉnh

const FIXED_PRODUCTS = [
{
    id: 2001,
    imgSrc: "../img/máy tính bảng.jpg",
    title: "Máy tính bảng Android 10 inch",
    description: "Màn hình IPS, RAM 4GB, pin 6000mAh.",
    brand: "TabX",
    category: "thiết bị điện tử",
    subcategory: "máy tính bảng",
    stars: 4,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "binhdan",
    price: 2590000
  },
  {
    id: 2002,
    imgSrc: "img/điện thoại thông minh 5G.jpg",
    title: "Điện thoại thông minh 5G",
    description: "Snapdragon, camera 64MP, pin 5000mAh.",
    brand: "VivaPhone",
    category: "thiết bị điện tử",
    subcategory: "điện thoại",
    stars: 4.3,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "hanghieu",
    price: 7690000
  },
  {
    id: 2003,
    imgSrc: "img/laptop văn phòng.jpg",
    title: "Laptop văn phòng mỏng nhẹ",
    description: "Core i5, SSD 512GB, màn hình 14 inch.",
    brand: "WorkBook",
    category: "thiết bị điện tử",
    subcategory: "laptop",
    stars: 4.5,
    inStock: true,
    isNew: true,
    auction: { enabled: true },
    segment: "daugia",
    price: 12500000
  },
  {
    id: 2004,
    imgSrc: "img/tủ lạnh inverter.jpg",
    title: "Tủ lạnh 2 cửa Inverter",
    description: "Tiết kiệm điện, dung tích 260L.",
    brand: "CoolMax",
    category: "đồ gia dụng",
    subcategory: "tủ lạnh",
    stars: 4.2,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "binhdan",
    price: 4890000
  },
  {
    id: 2005,
    imgSrc: "img/máy giặt cửa trước.jpg",
    title: "Máy giặt cửa trước 9kg",
    description: "Giặt hơi nước, chống nhăn hiệu quả.",
    brand: "WashPro",
    category: "đồ gia dụng",
    subcategory: "máy giặt",
    stars: 4.6,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "hanghieu",
    price: 7450000
  },
  {
    id: 2006,
    imgSrc: "img/lo vi sóng điện tử.jpg",
    title: "Lò vi sóng điện tử 23L",
    description: "Nấu, rã đông và hâm nóng nhanh.",
    brand: "HeatX",
    category: "đồ gia dụng",
    subcategory: "lò vi sóng",
    stars: 4.1,
    inStock: true,
    isNew: true,
    auction: { enabled: true },
    segment: "daugia",
    price: 1890000
  },
  {
    id: 2007,
    imgSrc: "img/sách nhà giả kim.jpg",
    title: "Sách kinh điển: Nhà giả kim",
    description: "Tác phẩm nổi tiếng của Paulo Coelho.",
    brand: "NXB Trẻ",
    category: "sở thích",
    subcategory: "sách",
    stars: 4.9,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "binhdan",
    price: 98000
  },
  {
    id: 2008,
    imgSrc: "img/nhạc cụ.jpg",
    title: "Đàn Guitar Acoustic",
    description: "Âm thanh ấm, gỗ thịt chất lượng.",
    brand: "Yamaha",
    category: "sở thích",
    subcategory: "nhạc cụ",
    stars: 4.7,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "hanghieu",
    price: 18500000
  },
  {
    id: 2009,
    imgSrc: "img/tem.jpg",
    title: "Bộ sưu tập tem cổ Việt Nam",
    description: "Gồm 30 mẫu hiếm từ 1950-1980.",
    brand: "StampVN",
    category: "sở thích",
    subcategory: "đồ sưu tầm",
    stars: 4.6,
    inStock: true,
    isNew: true,
    auction: { enabled: true },
    segment: "daugia",
    price: 520000
  },
  {
    id: 2010,
    imgSrc: "img/quần áo.jpg",
    title: "Áo sơ mi nam tay dài",
    description: "Chất vải cotton thoáng mát.",
    brand: "FashionX",
    category: "thời trang",
    subcategory: "quần áo",
    stars: 4,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "binhdan",
    price: 220000
  },
  {
    id: 2011,
    imgSrc: "img/dày sneaker.jpg",
    title: "Giày sneaker thể thao nam",
    description: "Phong cách trẻ trung, đế cao su êm ái.",
    brand: "RunnerPro",
    category: "thời trang",
    subcategory: "giày dép",
    stars: 4.5,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "hanghieu",
    price: 850000
  },
  {
    id: 2012,
    imgSrc: "img/túi xách nữ đeo chéo.jpg",
    title: "Túi xách nữ đeo chéo",
    description: "Thiết kế thời trang, chất liệu da PU.",
    brand: "LuxeBag",
    category: "thời trang",
    subcategory: "phụ kiện",
    stars: 4.2,
    inStock: true,
    isNew: true,
    auction: { enabled: true },
    segment: "daugia",
    price: 390000
  },
  {
    id: 2013,
    imgSrc: "img/laptop gaming.jpg",
    title: "Laptop Gaming Ryzen 7",
    description: "Màn hình 144Hz, VGA GTX1650.",
    brand: "PowerGame",
    category: "thiết bị điện tử",
    subcategory: "laptop",
    stars: 4.7,
    inStock: true,
    isNew: true,
    auction: { enabled: true },
    segment: "daugia",
    price: 18900000
  },
  {
    id: 2014,
    imgSrc: "img/iphone 13 pro max.jpg",
    title: "iPhone 13 Pro Max 128GB",
    description: "Mới 99%, pin khỏe, bảo hành 6 tháng.",
    brand: "Apple",
    category: "thiết bị điện tử",
    subcategory: "điện thoại",
    stars: 4.9,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "hanghieu",
    price: 17890000
  },
  {
    id: 2015,
    imgSrc: "img/guitar.jpg",
    title: "Đàn Guitar điện Rock",
    description: "Âm thanh mạnh, phù hợp biểu diễn.",
    brand: "Fender",
    category: "sở thích",
    subcategory: "nhạc cụ",
    stars: 4.8,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "hanghieu",
    price: 6350000
  },
  {
    id: 2016,
    imgSrc: "img/tủ lạnh mini.jpg",
    title: "Tủ lạnh mini cho phòng ngủ",
    description: "Dung tích 50L, tiết kiệm điện.",
    brand: "MiniCool",
    category: "đồ gia dụng",
    subcategory: "tủ lạnh",
    stars: 4.1,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "binhdan",
    price: 1690000
  },
  {
    id: 2017,
    imgSrc: "img/dày cao gót.jpg",
    title: "Giày cao gót 7cm",
    description: "Thiết kế thanh lịch, dễ phối đồ.",
    brand: "Elegance",
    category: "thời trang",
    subcategory: "giày dép",
    stars: 4.4,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "binhdan",
    price: 360000
  },
  {
    id: 2018,
    imgSrc: "img/7 thói quen thành đạt.jpg",
    title: "Sách kỹ năng: 7 thói quen thành đạt",
    description: "Cuốn sách nổi tiếng của Stephen Covey.",
    brand: "NXB Tổng hợp",
    category: "sở thích",
    subcategory: "sách",
    stars: 4.8,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "binhdan",
    price: 115000
  },
  {
    id: 2019,
    imgSrc: "img/lò vi sóng cơ 20l.jpg",
    title: "Lò vi sóng cơ 20L",
    description: "Giá rẻ, dễ sử dụng, phù hợp sinh viên.",
    brand: "QuickHeat",
    category: "đồ gia dụng",
    subcategory: "lò vi sóng",
    stars: 4,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "binhdan",
    price: 1390000
  },
  {
    id: 2020,
    imgSrc: "img/bộ đồ ở nhà.jpg",
    title: "Bộ đồ mặc nhà cotton nữ",
    description: "Mềm mại, thấm hút tốt, mặc mát mẻ.",
    brand: "HomeWear",
    category: "thời trang",
    subcategory: "quần áo",
    stars: 4.3,
    inStock: true,
    isNew: true,
    auction: { enabled: false },
    segment: "binhdan",
    price: 185000
  }
];

const PRODUCTS = [
    ...FIXED_PRODUCTS,
    ...APPROVED_POSTS.map((p, index) => ({
        ...p,
        id: 1000 + index,
        imgSrc: p.image,
        title: p.title || "Không có tiêu đề",
        description: p.description || "",
        brand: p.brand || "Người bán",
        category: p.category || "",      
        subcategory: p.subcategory || "", 
        stars: p.stars || 4,
        inStock: true,
        isNew: true,    
        auction: { enabled: false },
        segment: "binhdan",
        price: parseFloat(p.price) || 0
    }))
];


// --- Utility Functions ---
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const getLocal = (key, fallback = null) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
};
const setLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// --- Product Segmentation (Phân khúc sản phẩm) ---
function segmentProducts(products) {
    const SEGMENT_RULES = {
        "Name Brand": {
            segment: "hieu",
            getSegmentType: (p) => p.auction?.enabled ? "auction" : "noauction"
        }
        // Có thể thêm nhiều thương hiệu khác ở đây
        // "Luxury Brand": { segment: "cao-cap", getSegmentType: (p) => ... }
    };

    products.forEach(p => {
        const rule = SEGMENT_RULES[p.brand];
        if (rule) {
            p.segment = rule.segment;
            p.segmentType = rule.getSegmentType(p);
        } else {
            p.segment = "binhdan";
            p.segmentType = "none";
        }
    });

    console.info("✅ Đã phân loại sản phẩm theo phân khúc thành công.");
}

// --- Auction State Loader (Khôi phục trạng thái đấu giá) ---
function loadAuctionState(products) {
    const auctionState = getLocal('auctionState', {});
    let restoredCount = 0;

    products.forEach(p => {
        if (p.auction?.enabled && auctionState[p.id]) {
            p.auction = {
                ...p.auction,
                ...auctionState[p.id]
            };
            restoredCount++;
        }
    });

    console.info(`📦 Đã khôi phục trạng thái đấu giá cho ${restoredCount} sản phẩm.`);
}

// Gọi khi khởi tạo
segmentProducts(PRODUCTS);
loadAuctionState(PRODUCTS);

// --- Wishlist Logic ---
let wishlist = getLocal('wishlist', []);

function saveWishlist() {
    setLocal('wishlist', wishlist);
    updateWishlistCount();
}

function updateWishlistCount() {
    let count = wishlist.length;
    let wishlistLink = $('#navbar a[href="wishlist.html"]');
    if (wishlistLink) {
        let icon = wishlistLink.querySelector('.fa-heart');
        if (icon) {
            let badge = icon.nextElementSibling;
            if (!badge || !badge.classList.contains('wishlist-badge')) {
                badge = document.createElement('span');
                badge.className = 'wishlist-badge';
                badge.style = 'background:#ff4d4f;color:#fff;border-radius:50%;padding:2px 7px;font-size:0.8em;margin-left:4px;';
                icon.after(badge);
            }
            badge.textContent = count;
            badge.style.display = count ? 'inline-block' : 'none';
        }
    }
}

function toggleWishlist(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.findIndex(item => item.id === productId);

    if (index !== -1) {
        wishlist.splice(index, 1);
        showActionToast(`${product.title} đã được xóa khỏi danh sách yêu thích.`, null, "wishlist");
    } else {
        wishlist.push(product);
        showActionToast(`${product.title} đã được thêm vào danh sách yêu thích.`, "Xem danh sách", "wishlist");
    }
    saveWishlist();
    renderProducts(); // Re-render to update heart icons
}

// --- Cart Logic (simplified for shop page) ---
function addToCart(productId) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
        alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ.");
        localStorage.setItem("redirectAfterLogin", window.location.href); // Lưu URL hiện tại
        window.location.href = "../index/signup-in/signin.html";
        return;
    }

    let cart = getLocal('cart', []);
    const product = PRODUCTS.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity = (parseInt(existingItem.quantity) || 0) + 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                img: product.imgSrc,
                quantity: 1
            });
        }
        setLocal('cart', cart);
        showActionToast(`${product.title} đã được thêm vào giỏ hàng.`, "Xem giỏ hàng", "cart");
    }
}

// --- Modals ---
const productModal = $('#product-modal');
const auctionModal = $('#auction-modal');
const actionToast = $('#action-toast');
let currentProduct = null;

function openAuctionModal(productId) {
    currentProduct = PRODUCTS.find(p => p.id === productId);
    if (!currentProduct || !currentProduct.auction?.enabled) return;

    $('#auction-modal-img').src = currentProduct.imgSrc;
    $('#auction-modal-title').textContent = currentProduct.title;
    $('#auction-modal-current-bid').textContent = `Giá hiện tại: ${parseFloat(currentProduct.auction.currentBid).toLocaleString('vi-VN')}₫`;
    $('#auction-modal-time-left').textContent = `Thời gian còn lại: ${formatTimeLeft(currentProduct.auction.endTime)}`;

    $('#bidder-name').value = '';
    $('#bidder-email').value = '';
    $('#bid-amount').value = '';

    startAuctionTimer();

    auctionModal.style.display = 'block';
}


function closeModal() {
    productModal.style.display = 'none';
    auctionModal.style.display = 'none';
}

function saveAuctionState() {
    const state = {};
    PRODUCTS.forEach(p => {
        if (p.auction?.enabled) {
            state[p.id] = {
                currentBid: p.auction.currentBid,
                endTime: p.auction.endTime,
                lastBidder: p.auction.lastBidder || null
            };
        }
    });
    localStorage.setItem('auctionState', JSON.stringify(state));
}


setInterval(() => {
    if (auctionModal.style.display === 'block' && currentProduct?.auction) {
        $('#auction-modal-time-left').textContent =
            `Thời gian còn lại: ${formatTimeLeft(currentProduct.auction.endTime)}`;
    }
}, 1000);

function closeAuctionModal() {
    const auctionModal = document.getElementById('auctionModal');
    if (auctionModal) {
        auctionModal.style.display = 'none';
    }

    if (auctionTimer) {
        clearInterval(auctionTimer);
        auctionTimer = null;
    }

    currentProduct = null;
}


function showActionToast(message, actionText = null, type = "cart") {
    const toastMessage = $('#toast-message');
    const toastAction = $('#toast-action');
    const actionToast = $('#action-toast');

    toastMessage.text(message);

    if (actionText) {
        toastAction.text(actionText);
        toastAction.css('display', 'inline-block');
        toastAction.off('click').on('click', () => {
            if (type === "cart") {
                window.location.href = "cart.html";
            } else if (type === "wishlist") {
                window.location.href = "wishlist.html";
            }
            hideActionToast();
        });
    } else {
        toastAction.css('display', 'none');
    }

    actionToast.addClass('show');
    setTimeout(() => {
        hideActionToast();
    }, 5000);
}

function hideActionToast() {
    actionToast.classList.remove('show');
}

function submitBid(event) {
    event.preventDefault();

    const name = document.getElementById('bidder-name').value.trim();
    const email = document.getElementById('bidder-email').value.trim();
    const bidAmount = parseFloat(document.getElementById('bid-amount').value);

    if (!name || !email || isNaN(bidAmount)) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }

    const currentBid = parseFloat(currentProduct.auction.currentBid || currentProduct.price);
    if (bidAmount <= currentBid) {
        alert(`Giá bạn đặt phải cao hơn giá hiện tại: ${currentBid.toLocaleString('vi-VN')}₫`);
        return;
    }

    // Nếu đấu giá chưa bắt đầu, đặt thời gian kết thúc sau 24 giờ
    if (!currentProduct.auction.endTime) {
        const initialEndTime = new Date();
        initialEndTime.setHours(initialEndTime.getHours() + 24);
        currentProduct.auction.endTime = initialEndTime.toISOString();
    }

    // Cập nhật thông tin đấu giá
    currentProduct.auction.currentBid = bidAmount;
    currentProduct.auction.lastBidder = { name, email };

    // Kiểm tra nếu còn dưới 15 phút thì cộng thêm 15 phút
    const now = new Date();
    const endTime = new Date(currentProduct.auction.endTime);
    const timeLeft = endTime - now;

    if (timeLeft < 15 * 60 * 1000) {
        endTime.setMinutes(endTime.getMinutes() + 15);
        currentProduct.auction.endTime = endTime.toISOString();
    }

    // Lưu lại trạng thái vào localStorage hoặc nơi bạn đang dùng
    if (typeof saveAuctionState === 'function') {
        saveAuctionState();
    }

    // Cập nhật lại modal
    openAuctionModal(currentProduct.id);

    // Bắt đầu hoặc cập nhật lại đồng hồ đếm ngược
    if (typeof startAuctionTimer === 'function') {
        startAuctionTimer();
    }

    // Hiển thị thông báo toast
    if (typeof showActionToast === 'function') {
        showActionToast(`Đặt giá thành công với ${bidAmount.toLocaleString('vi-VN')}₫`, null, 'auction');
    }
}


// --- Rendering Functions ---
const productList = $('#productContainer');

function getStarRating(stars) {
    let ratingHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < stars) {
            ratingHtml += '<i class="fas fa-star"></i>';
        } else {
            ratingHtml += '<i class="far fa-star"></i>'; // Empty star
        }
    }
    return ratingHtml;
}

function formatTimeLeft(endTime) {
    if (!endTime) return 'Không xác định';

    const end = new Date(endTime);
    if (isNaN(end)) return 'Thời gian không hợp lệ'; // kiểm tra lỗi định dạng

    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Đã kết thúc';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}


function renderProducts(productsToRender = PRODUCTS) {
    productList.innerHTML = ''; // Clear current products
    if (productsToRender.length === 0) {
        productList.innerHTML = '<p style="text-align: center; width: 100%;">Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'pro';
        const isProductInWishlist = wishlist.some(item => item.id === product.id);
        const heartIconClass = isProductInWishlist ? 'fas' : 'far';

        let priceHtml = `<h4 class="price">${parseFloat(product.price).toLocaleString('vi-VN')}₫</h4>`;
        if (product.auction?.enabled) {
            priceHtml = `<span class="auction-tag">Đấu giá</span>`;
        }

        // Chọn hàm mở modal phù hợp
        const modalFn = product.auction?.enabled ? 'openAuctionModal' : 'openModal';

        productCard.innerHTML = `
            <img src="${product.imgSrc}" alt="${product.title}" onclick="${modalFn}(${product.id})">
            <div class="des">
                <span>${product.brand}</span>
                <h5 onclick="${modalFn}(${product.id})">${product.title}</h5>
                <div class="star">
                    ${getStarRating(product.stars)}
                </div>
                ${priceHtml}
            </div>
            <a href="../cart.html" class="cart" onclick="addToCart(${product.id})"><i class="fa-solid fa-cart-shopping"></i></a>
            <a href="#" class="wishlist-icon" onclick="toggleWishlist(${product.id})">
                <i class="${heartIconClass} fa-heart"></i>
            </a>
            ${product.auction?.enabled ? `
                <a href="#" 
                class="auction-icon" 
                onclick="openAuctionModal(${product.id})" 
                style="position: absolute; top: 10px; right: 10px; background: #f9c74f; color: #fff; padding: 8px 10px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: background 0.3s;">
                <i class="fas fa-gavel" style="font-size: 16px;"></i>
                </a>` : ''
}
        `;
        productList.appendChild(productCard);
    });
    updateWishlistCount(); // Cập nhật số lượng sản phẩm yêu thích sau khi render
}

// --- Pagination ---
const itemsPerPage = 8;
let currentPage = 1;

function goToPage(page) {
    currentPage = page;
    filterProducts(); // Re-filter and re-render for the current page
}

function renderPagination(filteredProducts) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (totalPages <= 1) return;

    // Nút "Trước"
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '« Trước';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    };
    paginationContainer.appendChild(prevBtn);

    // Nút số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        if (i === currentPage) pageBtn.classList.add('active');
        pageBtn.onclick = () => goToPage(i);
        paginationContainer.appendChild(pageBtn);
    }

    // Nút "Sau"
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Sau »';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) goToPage(currentPage + 1);
    };
    paginationContainer.appendChild(nextBtn);
}



// --- Category/Subcategory Mapping (Thêm hoặc cập nhật đoạn này) ---
const categorySubcategoryMap = {
    'Thiết bị điện tử': ['Điện thoại', 'Máy tính bảng', 'Laptop'],
    'Đồ gia dụng': ['Tủ lạnh', 'Máy giặt', 'Lò vi sóng'],
    'Sở thích': ['Sách', 'Nhạc cụ', 'Đồ sưu tầm'],
    'Thời trang': ['Quần áo', 'Giày dép', 'Phụ kiện']
};

const categoryFilterSelect = $('#categoryFilter');
const subcategoryFilterSelect = $('#subcategoryFilter');

function populateCategoryFilter() {
    categoryFilterSelect.innerHTML = '<option value="">Tất cả danh mục</option>';
    for (const category in categorySubcategoryMap) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterSelect.appendChild(option);
    }
}

function populateSubcategoryFilter(selectedCategory) {
    subcategoryFilterSelect.innerHTML = '<option value="">Tất cả loại thiết bị</option>';
    if (selectedCategory && categorySubcategoryMap[selectedCategory]) {
        categorySubcategoryMap[selectedCategory].forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            subcategoryFilterSelect.appendChild(option);
        });
    }
}

// --- Filter & Sort Logic (Cập nhật đoạn này) ---
function filterProducts() {
    const searchTerm = $('#searchInput').value.trim().toLowerCase();
    const selectedCategory = categoryFilterSelect.value;
    const selectedSubcategory = subcategoryFilterSelect.value;
    const selectedSegment = $('#segmentFilter').value;
    const showOnlyNew = $('#newProductFilter').checked;
    const showOnlyAuction = $('#auctionFilter').checked;
    const sortValue = $('#sortSelect').value;

    let filtered = PRODUCTS.filter(product => {
        const title = product.title?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';

        const matchesSearch =
            !searchTerm ||
            title.includes(searchTerm) ||
            brand.includes(searchTerm) ||
            description.includes(searchTerm);

        const matchesCategory =
            !selectedCategory || product.category === selectedCategory;

        const matchesSubcategory =
            !selectedSubcategory || product.subcategory === selectedSubcategory;

        const matchesSegment =
            !selectedSegment || product.segment === selectedSegment;

        const matchesNew = !showOnlyNew || product.isNew;

        const matchesAuction = !showOnlyAuction || (product.auction?.enabled === true);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesSubcategory &&
            matchesSegment &&
            matchesNew &&
            matchesAuction
        );
    });

    // --- Sorting ---
    switch (sortValue) {
        case 'price-asc':
            filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-desc':
            filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    // --- Pagination ---
    const totalItems = filtered.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    // --- Render UI ---
    renderProducts(paginated);
    renderPagination(filtered);
}

/**
 * Khởi chạy lại bộ lọc sản phẩm, đặt lại trang đầu tiên.
 * @param {string} trigger - Lý do kích hoạt lọc (ví dụ: 'search', 'sort', 'filter')
 */
function refreshProductList(trigger = 'search') {
    console.log(`🔄 Đang lọc sản phẩm... (trigger: ${trigger})`);
    currentPage = 1; // Luôn trở về trang đầu khi có thao tác lọc/sắp xếp
    filterProducts();
}

/**
 * Hàm gọi khi người dùng tìm kiếm sản phẩm
 */
function searchProducts() {
    refreshProductList('search');
}

/**
 * Hàm gọi khi người dùng thay đổi sắp xếp
 */
function sortProducts() {
    refreshProductList('sort');
}


/**
 * Xử lý sự kiện bàn phím khi người dùng tương tác với sản phẩm.
 * Cho phép mở modal khi nhấn Enter hoặc Space.
 *
 * @param {KeyboardEvent} event - Sự kiện bàn phím
 * @param {string|number} productId - ID sản phẩm được chọn
 */
function handleProductKeydown(event, productId) {
    if (!event || !productId) {
        console.warn("⚠️ Thiếu event hoặc productId khi xử lý phím.");
        return;
    }

    const key = event.key?.toLowerCase();

    const validKeys = ['enter', ' ']; // Có thể mở rộng: ['enter', ' ', 'arrowright']
    if (validKeys.includes(key)) {
        event.preventDefault(); // Ngăn hành vi mặc định như scroll
        console.log(`🧲 Kích hoạt modal qua phím "${key}" cho sản phẩm ID: ${productId}`);
        openModal(productId);
    }
}


// --- Event Listeners (Cập nhật đoạn này) ---
document.addEventListener("DOMContentLoaded", function() {
    // Populate filters on load
    populateCategoryFilter();
    populateSubcategoryFilter(''); // Initially populate subcategories based on no selection

    // Event listeners for filters
    categoryFilterSelect.addEventListener('change', () => {
        populateSubcategoryFilter(categoryFilterSelect.value);
        filterProducts(); // Re-filter when category changes
    });
    subcategoryFilterSelect.addEventListener('change', filterProducts); // Re-filter when subcategory changes
    $('#segmentFilter').addEventListener('change', filterProducts);
    $('#newProductFilter').addEventListener('change', filterProducts);
    $('#auctionFilter').addEventListener('change', filterProducts);
    $('#sortSelect').addEventListener('change', sortProducts);

    filterProducts(); // Initial render of products

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