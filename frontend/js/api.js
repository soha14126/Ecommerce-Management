// frontend/js/api.js
// Central API helper — all fetch calls go through here

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api' 
    : window.location.origin + '/api';

// ── Auth helpers ──────────────────────────────────────────────
const getToken  = () => localStorage.getItem('token');
const getUser   = () => JSON.parse(localStorage.getItem('user') || 'null');
const isLoggedIn = () => !!getToken();

const saveAuth = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};
const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// ── Core fetch wrapper ────────────────────────────────────────
async function apiFetch(path, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const res  = await fetch(`${API_BASE}${path}`, { ...options, headers: { ...headers, ...options.headers } });
        const data = await res.json();

        if (res.status === 401 || res.status === 403) {
            clearAuth();
            if (!window.location.pathname.includes('login') && !window.location.pathname.includes('signup')) {
                showToast('Session expired. Please login again.', 'warning');
                setTimeout(() => window.location.href = '/login.html', 1500);
            }
        }
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        console.error('API error:', err);
        return { ok: false, status: 0, data: { success: false, message: 'Network error. Is the server running?' } };
    }
}

// ── API Methods ───────────────────────────────────────────────
const API = {
    // Auth
    register: (body)   => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login:    (body)   => apiFetch('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
    getProfile: ()     => apiFetch('/auth/profile'),

    // Products
    getProducts:  (params = {}) => apiFetch('/products?' + new URLSearchParams(params)),
    getFeatured:  ()             => apiFetch('/products/featured'),
    getProduct:   (id)           => apiFetch(`/products/${id}`),
    getCategories:()             => apiFetch('/products/categories'),

    // Cart
    getCart:      ()             => apiFetch('/cart'),
    addToCart:    (body)         => apiFetch('/cart',       { method: 'POST',   body: JSON.stringify(body) }),
    updateCart:   (id, qty)      => apiFetch(`/cart/${id}`, { method: 'PUT',    body: JSON.stringify({ quantity: qty }) }),
    removeFromCart:(id)          => apiFetch(`/cart/${id}`, { method: 'DELETE' }),
    clearCart:    ()             => apiFetch('/cart/clear',  { method: 'DELETE' }),

    // Orders
    placeOrder:   (body)         => apiFetch('/orders',     { method: 'POST',   body: JSON.stringify(body) }),
    getOrders:    ()             => apiFetch('/orders'),
    getOrder:     (id)           => apiFetch(`/orders/${id}`),
};

// ── Toast Notification System ─────────────────────────────────
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOut 0.3s ease forwards'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ── Cart Count Badge ──────────────────────────────────────────
async function updateCartBadge() {
    if (!isLoggedIn()) { setCartBadge(0); return; }
    const { ok, data } = await API.getCart();
    if (ok) {
        const total = data.items.reduce((s, i) => s + i.quantity, 0);
        setCartBadge(total);
    }
}

function setCartBadge(count) {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(b => { b.textContent = count; b.style.display = count > 0 ? 'flex' : 'none'; });
}

// ── Navbar Auth State ─────────────────────────────────────────
function updateNavAuth() {
    const user = getUser();
    const loginBtn   = document.getElementById('nav-login-btn');
    const userMenu   = document.getElementById('nav-user-menu');
    const userNameEl = document.getElementById('nav-user-name');

    if (user) {
        if (loginBtn)   loginBtn.style.display   = 'none';
        if (userMenu)   userMenu.style.display    = 'flex';
        if (userNameEl) userNameEl.textContent     = user.name.split(' ')[0];
    } else {
        if (loginBtn)   loginBtn.style.display   = 'flex';
        if (userMenu)   userMenu.style.display    = 'none';
    }
}

// ── Format Price ──────────────────────────────────────────────
function formatPrice(price) {
    return '₹' + parseFloat(price).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ── Star Rating ───────────────────────────────────────────────
function renderStars(rating) {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5;
    let   stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < full)          stars += '★';
        else if (i === full && half) stars += '⭐';
        else                   stars += '☆';
    }
    return stars;
}

// ── Discount Calculator ───────────────────────────────────────
function getDiscount(price) {
    const discountPcts = [10, 15, 20, 25, 30];
    const pct = discountPcts[Math.floor(price * 17 % discountPcts.length)];
    return { pct, original: Math.round(price / (1 - pct / 100)) };
}

// ── Product Card Generator ────────────────────────────────────
function createProductCard(product) {
    const { pct, original } = getDiscount(product.price);
    return `
    <div class="product-card fade-in-up" data-id="${product.id}">
        <span class="product-badge">${pct}% OFF</span>
        <button class="wishlist-btn" title="Wishlist">♡</button>
        <div class="product-img">
            <img src="${product.image}" alt="${product.name}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200/e2e8f0/718096?text=Product'">
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-rating">
                <span class="stars">${renderStars(product.rating || 4.0)}</span>
                <span class="rating-num">${product.rating || 4.0}</span>
            </div>
            <div class="product-price">
                <span class="price-current">${formatPrice(product.price)}</span>
                <span class="price-original">${formatPrice(original)}</span>
                <span class="price-discount">Save ${pct}%</span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id}, this)">
                    🛒 Add to Cart
                </button>
                <button class="view-btn" onclick="window.location.href='product-detail.html?id=${product.id}'" title="View Details">👁</button>
            </div>
        </div>
    </div>`;
}

// ── Add to Cart Handler ───────────────────────────────────────
async function handleAddToCart(productId, btnEl) {
    if (!isLoggedIn()) {
        showToast('Please login to add items to cart.', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }
    if (btnEl) { btnEl.disabled = true; btnEl.innerHTML = '⏳ Adding...'; }

    const { ok, data } = await API.addToCart({ product_id: productId, quantity: 1 });
    if (ok) {
        showToast('✅ Added to cart!', 'success');
        updateCartBadge();
        if (btnEl) { btnEl.innerHTML = '✅ Added!'; setTimeout(() => { btnEl.disabled = false; btnEl.innerHTML = '🛒 Add to Cart'; }, 1500); }
    } else {
        showToast(data.message || 'Failed to add to cart.', 'error');
        if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = '🛒 Add to Cart'; }
    }
}

// ── Loading Screen ────────────────────────────────────────────
function showLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.style.display = 'flex';
}
function hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.style.display = 'none';
}

// ── Debounce ──────────────────────────────────────────────────
function debounce(fn, delay = 350) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ── Init on every page ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateNavAuth();
    updateCartBadge();

    // Hamburger menu
    const hamburger = document.getElementById('nav-hamburger');
    const navBottom = document.getElementById('nav-bottom');
    if (hamburger && navBottom) {
        hamburger.addEventListener('click', () => navBottom.classList.toggle('mobile-open'));
    }

    // Global search
    const searchInput  = document.getElementById('nav-search-input');
    const searchBtn    = document.getElementById('nav-search-btn');
    const searchCat    = document.getElementById('nav-search-cat');
    const doSearch = () => {
        const q   = searchInput?.value?.trim();
        const cat = searchCat?.value || '';
        if (q) window.location.href = `products.html?search=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}`;
    };
    searchBtn?.addEventListener('click', doSearch);
    searchInput?.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        clearAuth();
        showToast('Logged out successfully.', 'success');
        setTimeout(() => window.location.href = 'index.html', 800);
    });
});
