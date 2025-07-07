const products = JSON.parse(localStorage.getItem("products")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("wishlistContainer");

function renderWishlist() {
  container.innerHTML = '';

  if (wishlist.length === 0) {
    container.innerHTML = `<p style="text-align:center;width:100%;">Bạn chưa có sản phẩm yêu thích nào.</p>`;
    return;
  }

  wishlist.forEach(id => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    container.innerHTML += `
      <div class="pro">
        ${product.isNew ? `<span class="badge">NEW</span>` : ""}
        ${!product.inStock ? `<span class="badge" style="background:#e74c3c;color:#fff;left:auto;right:10px;">OUT</span>` : ""}
        <img src="${product.img}" alt="${product.name}">
        <div class="des">
          <span>${product.brand}</span>
          <h5>${product.name}</h5>
          <div class="star">
            ${'<i class="fas fa-star"></i>'.repeat(product.stars)}
            ${product.stars < 5 ? '<i class="far fa-star"></i>'.repeat(5 - product.stars) : ''}
          </div>
          <h4>$${product.price}</h4>
        </div>
        <button class="wishlist-btn active" title="Bỏ yêu thích" onclick="toggleWishlist(${product.id}, event)">
          <i class="fas fa-heart"></i>
        </button>
        <button class="cart" title="Thêm vào giỏ hàng" onclick="addToCart(${product.id}, event)" ${!product.inStock ? 'disabled style="background:#ccc;cursor:not-allowed;"' : ''}>
          <i class="fas fa-shopping-cart"></i>
        </button>
      </div>
    `;
  });
}

// Thêm vào giỏ hàng (giống shop)
function addToCart(id, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const product = products.find(p => p.id === id);
  if (!product || !product.inStock) {
    showToast('Sản phẩm đã hết hàng.', 'error');
    return;
  }

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

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast('Added to cart', 'success');
}

// Bỏ yêu thích
function toggleWishlist(id, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  wishlist = wishlist.filter(pid => pid !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  showToast('Removed from wishlist', 'info');
  renderWishlist();
}

// Toast
function showToast(msg, type = 'info') {
  const toast = document.getElementById("toast") || createToast();
  toast.textContent = msg;
  toast.className = "toast show";
  toast.style.background = type === 'success' ? "#27ae60" : type === 'error' ? "#e74c3c" : "#333";
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// Action toast
function showActionToast(msg, actions) {
  let toast = document.getElementById("action-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "action-toast";
    toast.className = "toast";
    toast.style.bottom = "70px";
    toast.style.zIndex = "9999";
    toast.style.display = "flex";
    toast.style.gap = "10px";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${msg}</span> ` + actions.map((a, i) =>
    `<button style="margin-left:10px;padding:6px 14px;border-radius:4px;border:none;cursor:pointer;background:#f7b731;color:#222;" onclick="window._actionToastActions[${i}]()">${a.text}</button>`
  ).join('');
  window._actionToastActions = actions.map(a => a.action);
  toast.classList.add("show");
  setTimeout(() => hideActionToast(), 4000);
}

function hideActionToast() {
  const toast = document.getElementById("action-toast");
  if (toast) toast.classList.remove("show");
}

function createToast() {
  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = "toast";
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "10px 18px";
  toast.style.borderRadius = "6px";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);
  return toast;
}

renderWishlist();
